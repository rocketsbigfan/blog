
function drawAnimation(options) {
  this.ele = options.context;//canvas对象
  this.w = options.width;//width
  this.h = options.height;//height
  this.ele.fillStyle = options.fillStyle;
  this.ele.strokeStyle = options.strokeStyle;
  this.ele.lineWidth = options.lineWidth;
  this.arcCount = options.arcCount;//圆心数
  this.arcInfo = [];//圆
  this.init();//初始化
  this.animate();//动画进程			
};
drawAnimation.prototype.init = function () {
  for (let i = 0; i < this.arcCount; i++) {
    let _this = this;
    //圆信息
    let info = {
      x: Math.ceil(Math.random() * _this.w),
      y: Math.ceil(Math.random() * _this.h),
      r: Math.ceil(Math.random() * 5) + 1,
      sx: Math.ceil(Math.random() * 10000) / 10000,
      sy: Math.ceil(Math.random() * 10000) / 10000,
      controlX: parseInt(Math.random() * 10) > 5 ? true : false,
      controlY: parseInt(Math.random() * 10) > 5 ? true : false,
      id: i
    }
    info.sx = info.controlX ? info.sx : -info.sx;
    info.sy = info.controlY ? info.sy : -info.sy;
    if ((info.x + info.r) > this.w) {
      info.x = this.w - info.r;
    }
    if (info.x < info.r) {
      info.x = info.r;
    }
    if ((info.y + info.r) > this.h) {
      info.y = this.h - info.r;
    }
    if (info.y < info.r) {
      info.y = info.r;
    }
    this.arcInfo.push(info);
  }
}
//画圆
drawAnimation.prototype.paint = function (obj) {
  this.ele.beginPath();
  this.ele.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI);
  this.ele.closePath();
  this.ele.fill();
}
//圆运动
drawAnimation.prototype.moving = function (obj) {

  obj.sx = (obj.x <= this.w && obj.x >= 0) ? obj.sx : -obj.sx;
  obj.sy = (obj.y <= this.h && obj.y >= 0) ? obj.sy : -obj.sy;

  obj.x += obj.sx / 2;
  obj.y += obj.sy / 2;

}
//画圆心之间的连线
drawAnimation.prototype.drawLine = function (obj, x, y) {
  this.ele.beginPath();
  this.ele.moveTo(obj.x, obj.y);
  this.ele.lineTo(x, y);
  this.ele.closePath();
  this.ele.stroke();
}
//动画效果
drawAnimation.prototype.animate = function () {
  this.ele.clearRect(0, 0, this.w, this.h);
  //绘图
  for (var i = 0; i < this.arcCount; i++) {
    this.paint(this.arcInfo[i]);
    // if (i == 10) {
    //   console.log(this.arcInfo[i].controlX, this.arcInfo[i].controlY)
    // }
    for (let j = i + 1; j < this.arcCount; j++) {
      let x = this.arcInfo[i].x;
      let y = this.arcInfo[i].y;
      let jx = this.arcInfo[j].x;
      let jy = this.arcInfo[j].y;

      let dx = x - jx;
      let dy = y - jy;
      let d = Math.sqrt(dx * dx + dy * dy);
      if (d < this.h / 4) {
        this.drawLine(this.arcInfo[i], jx, jy)
      }
    }
    this.moving(this.arcInfo[i]);
  }

  let _this = this;
  //requestAnimationFrame兼容性
  window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 30);
    };

  window.requestAnimFrame(function () {
    _this.animate(_this)
  });
}

export default drawAnimation