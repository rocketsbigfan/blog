---
title: '开发多语言转换工具小记'
date: '2024-11-18'
---

有点标题党啦。其实文章就是个开发总结。

## 前言

最近我司有个多语言需求，考虑到一个个手动替换，不是个好方法，通过查找资料，咱就找到了[字节前端如何基于 AST 做国际化重构？](https://mp.weixin.qq.com/s/O7HaOKBGMXwaE3KkqANX3A?forceh5=1)，这篇文章，恰好能很好的解决需求。所以看完文章就立马准备上手了。

## 前置介绍

### jscodeshift

[jscodeshift](https://github.com/facebook/jscodeshift)是一个可以重构js和ts文件的工具集。通过对[recast](https://github.com/benjamn/recast)(一个AST-to-AST的转换工具)封装，提供了很多语义化的api来操作AST，导出自己想要的效果。  

jscodeshift的优点：

1. 同时支持 JavaScript or TypeScript 的解析
2. API 简洁，只通过几个 API 即可完成代码修改
3. 提供可视化的 code->AST 的网站：[astexplorer](https://astexplorer.net/)。只需要把我们的 js 或 ts 代码贴进去，即可转换成一棵 AST 语法树。利用这个语法树再加上 API，很容易就能通过 js 代码找到文件指定的代码片段去修改。

飞猪团队的这篇文章对我学习jscodeshift挺有帮助的：[像玩jQuery一样玩AST](https://zhuanlan.zhihu.com/p/349891657)  
咱在这也不介绍jscodeshift的api了，大家可以看看官方github和上面飞猪团队的文章学习下。

## 开工

### 1.找到所有场景

以下，是代码中出现中文最常见的几种情景（待补充..

```javascript
function Test(c: string) {
  // 经过实验，注释不会出现在ast中
  let templateStr = `模版字符串中出现中文${x}美${y}犹犹`
  const zh = '中文'
  const objStr = {
    c: '测试'
  }
  return <Exception
    type="404"
    linkElement={`作为属性${x}嗨`}
    desc={a}
    backText="作为属性出现"
  />
}
```

接下来我们对几种形式来找出对应的ast.type([astexplorer](https://astexplorer.net/)和控制台输出一起使用)

```text
模版字符串对应：TemplateLiteral；
普通字面量：StringLiteral；
```

![WeChat09a109b756d95a58a0889d740e1f5c70.png](/images/posts/code-refactor/image-1.image)
![WeChat84aac008033cee4196e4eeabaa84d7e1.png](/images/posts/code-refactor/image-2.image)

找出对应数据集合：

```javascript
module.exports = function (file, api) {
  const j = api.jscodeshift
  const root = j(file.source)
  // 找到模板字符串集合，
  root.find(j.TemplateLiteral)
  // 找到普通字面量集合，可以传入第二个参数，来对返回的集合进行过滤
  root.find(j.Literal, p => /[\u4e00-\u9fa5]/.test(p.value))
  // 返回文件
  return root.toSource()
}
```

### 2.处理不同场景的类型

找到对应的集合之后，就需要使用```forEach```遍历集合，找到相应的文本，使用```replaceWith```来进行替换替换操作，返回替换结果，并生成对应中文注释

```javascript
let i = 0
module.exports = function (file, api) {
  const j = api.jscodeshift
  const root = j(file.source)
  // find方法返回的是一个节点集合
  // 找到模板字符串集合，
  root.find(j.TemplateLiteral).forEach((path) => {
    let value = '';
    let hash = i++;
    // quasis中的数据为模版字符串切分后的数组，即string数组。
    // expressions为模板字符串中type = Identifier的数组，及模版字符串中的变量名数组
    // 生成原模板字符串 eg： value = `作为属性${x}嗨`
    path.node.quasis.forEach((item, index) => {
      if (index >= path.node.expressions.length) {
        value += item.value.raw;
      } else {
        value = `${value + item.value.raw}{${path.node.expressions[index].name}}`;
      }
    });
    // 取出变量数组
    const obj = path.node.expressions.map((item) => item.name);
    j(path).replaceWith((p) => {
      // 设置对应intl方法, eg: intl.get('moment', { day, hours})
      p.node.raw = `intl.get(${hash}, {${obj}})`;
      return p.node.raw;
    });
    const comment = j.commentBlock(`${hash}: ${value}`, true, false); 
    // 生成块注释
    // 1: 作为属性${x}嗨
    const comments = (path.node.comments = path.node.comments || []);
    comments.push(comment);
  });
  // 找到普通字面量集合，可以传入第二个参数，来对返回的集合进行过滤
  root.find(j.Literal, p => /[\u4e00-\u9fa5]/.test(p.value)).forEach((path) => {
      // 获取原始值
      const value = path.node.raw || path.node.value;
      let hash = i++ ;

      j(path).replaceWith((p) => {
        // 处理不同节点的类型做处理，设置替换后的值
        if (p.node.type === 'JSXText') {
          p.node.raw = `{intl.get(${hash})}`;
        } else if (p.parentPath.node.type === 'JSXAttribute') {
          p.node.raw = `{intl.get(${hash})}`;
        } else {
          p.node.raw = `intl.get(${hash})`;
        }
        return p.node.raw;
      });
      // 生成注释 
      // eg： /** 1: 中文 */
      const comments = (path.node.comments = path.node.comments || []);
      // 生成块注释
      const comment = j.commentBlock(`${hash}: ${value}`, true, false); 
      comments.push(comment);
    });
  }
  // 返回文件
  return root.toSource()
}
```

### 3.如果存在需要处理的字段，就引入对应的多语言方法

```javascript
...
  const Literal = root.find(j.Literal, (p) => /[\u4e00-\u9fa5]/.test(p.value));
  const TemplateLiteral = root.find(j.TemplateLiteral);
    if (Literal.length || TemplateLiteral.length) {
    // eg：import { intl } from 'intl';
    j(root.find(j.Declaration).at(0).get()).insertBefore(j.importDeclaration(
      [j.importSpecifier(j.identifier("intl"))],
      j.literal("intl")
    ));
...
```

大功告成

![image.png](/images/posts/code-refactor/image-3.image)

### 4.处理多个文件

以上代码是对单文件的处理，我们重构代码，往往是需要对整个文件，或者多个文件，那就要借助到node啦。我们使用[globby](https://github.com/sindresorhus/globby)来获取文件地址，使用fs.readFileSync,fs.writeFileSync来读写文件

```javascript
const { resolve } = require('path');
const { sync } = require('globby');
const { readFileSync, writeFileSync } = require('fs');
const { transformer } = require('./transform');


function start() {
  // 获取当前工作目录src
  const root = resolve(process.cwd(), 'src');
  // 获取src目录下的所有ts，tsx，js，jsx，忽略.umi文件加
  // sync方法返回文件名数组
  const files = sync([`${root}/**/!(*.d).{ts,tsx,js,jsx}`], {
    dot: true,
    ignore: `${root}/.umi/**`,
  }).map((x) => resolve(x));
  const filesLen = files.length;

  for (let i = 0; i < filesLen; i += 1) {
    const file = files[i];
    console.log('file: ', file);
    const index = file.lastIndexOf('.');
    const parser = file.substr(index + 1);
    // 读取文件内容，可以设定编码
    const content = readFileSync(file, 'utf-8');
    // 为上文的转换方法
    const resContent = transformer(content, parser);
    下入文件
    writeFileSync(file, resContent, 'utf8');
  }
}

module.exports = start

```

以上中文转相应多语言的和重构就完成啦。

## 扩展

我们可以使用配合[Commander](https://github.com/commander-rb/commander)插件，来开发多语言转换脚手架。类似如下代码

```javascript
#! /usr/bin/env node
// 解决了不同的用户node路径不同的问题，可以让系统动态的去查找node来执行你的脚本文件
const { program } = require("commander")
const pkg = require('../../package.json')
const start = require("..")
program
  .version(pkg.version)
  .option('-s --start', 'start translate', start)

program.on('--help', function(){  
  console.log('');  
  console.log('use translate !');  
});

program.parse(process.argv)

```

## 最后

这个是咱自己封装的代码批量重构脚手架，还很粗糙，大家可以当个demo玩一下，也请给小弟指点一二，或者一个start，hhh。  
github地址：[translate-mod](https://github.com/rocketsbigfan/translate-mod)

谢谢大家！！

![aec59196-6adb-418d-a94c-d8df84944645.gif](/images/posts/code-refactor/image-4.image)
