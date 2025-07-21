
import request from './request';

// 全局SWR fetcher
export const globalFetcher = (url) => request.get(url).then(res => res.data);

// 带参数的全局fetcher
export const globalFetcherWithParams = ([url, params]) => 
  request.get(url, { params }).then(res => res.data);

// POST请求的全局fetcher
export const globalPostFetcher = ([url, data]) => 
  request.post(url, data).then(res => res.data);

// 全局SWR配置
export const globalSWRConfig = {
  fetcher: globalFetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  revalidateIfStale: false,
  dedupingInterval: 2000,
  errorRetryCount: 3,
  errorRetryInterval: 1000,
  
  // 全局错误处理
  onError: (error, key) => {
    console.error('SWR Global Error:', { error, key });
    
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error.message;
    
    // 根据错误状态码进行全局处理
    switch (status) {
      case 400:
        console.error(`请求错误: ${message}`);
        break;
      case 401:
        // 401已经在axios拦截器中处理了
        console.error('登录已过期');
        break;
      case 403:
        console.error('权限不足');
        break;
      case 404:
        console.error('请求的资源不存在');
        break;
      case 429:
        console.error('请求过于频繁，请稍后再试');
        break;
      case 500:
      case 502:
      case 503:
        console.error('服务器错误，请稍后重试');
        break;
      default:
        console.error(message || '网络请求失败');
    }
  },
  
  // 全局重试策略
  onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
    const status = error?.response?.status;
    
    // 不重试的错误类型
    if ([400, 401, 403, 404].includes(status)) return;
    
    // 最多重试3次
    if (retryCount >= 3) return;
    
    // 指数退避重试策略
    const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
    setTimeout(() => revalidate({ retryCount }), delay);
  },
  
  // 全局成功回调（可选）
  onSuccess: (data, key, config) => {
    // 可以在这里处理全局成功逻辑，比如日志记录
    console.log('SWR Success:', { key, dataLength: data?.length });
  },
};