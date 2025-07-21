import axios from "axios";

const request = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// 全局token管理
let globalToken: string | null = null;
const localStorage = typeof window !== 'undefined' ? window.localStorage : { 
  setItem(key, value) {
  }, 
  getItem(key) {
    return null;
  },
  removeItem(key) {
  }
}
// 设置全局token
export const setGlobalToken = (token) => {
  globalToken = token;
  if (token) {
    request.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // 同时保存到localStorage
    localStorage.setItem('authToken', token);
  } else {
    delete request.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
  }
};

// 获取全局token
export const getGlobalToken = () => {
  if (!globalToken) {
    // 从localStorage恢复token
    globalToken = localStorage.getItem('authToken');
    if (globalToken) {
      request.defaults.headers.common['Authorization'] = `Bearer ${globalToken}`;
    }
  }
  return globalToken;
};

globalToken = getGlobalToken();

request.interceptors.request.use(config => {
  // 添加token

  if (globalToken && !config.headers['Authorization']) {
    config.headers['Authorization'] = `Bearer ${globalToken}`;
  }

  return config
})
// 清除全局token
export const clearGlobalToken = () => {
  setGlobalToken(null);
};

// 响应拦截器 - 全局错误处理
request.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // 全局错误处理
    if (response?.status === 401) {
      // Token过期，清除并跳转登录
      clearGlobalToken();
      window.location.href = '/login';
      // 可以触发全局事件或通知
      window.dispatchEvent(new CustomEvent('auth:logout', { 
        detail: { reason: 'token_expired' } 
      }));
    }
    // 也可以在此处理错误
    // console.error('Request failed:', error);
    
    return Promise.reject(error);
  }
);

export default request