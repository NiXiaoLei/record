// 编码解码
const codec = () => {
  // 简单加密
  const encode = (data={}) => {
    // btoa 兼容性  >=IE 10
    if( Object.prototype.toString.call(data) === "[object Object]" ) data = JSON.stringify(data)
    return window.btoa(encodeURIComponent(data))
  }

  // 解密
  const decode = (str='', isJson=true) => {
    const result = encodeURIComponent(window.atob(str))
    return isJson ? JSON.parse(result) : result
  }

  return { encode, decode }
}

// 处理 cookie
const cookieControl = () => {
  const { encode, decode } = codec()

  const getItem = (key='') => {
    var arr,reg = new RegExp(`(^| )${key}=([^;]*)(;|$)`);
    if(arr = document.cookie.match(reg)) return decode(arr[2], false);
    return null;
  }

  const setItem = (key='', value='', days=99999) => {
    const exp = new Date();
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${key}=${encode(value)};expires=${exp.toGMTString()}`
  }
  
  return { getItem, setItem }
}

// 处理localStorge 
const localStorageControl = () => {
  const { encode, decode } = codec()
  const getItem = (key='') => localStorage.getItem(decode(key))
  const setItem = (key='', value={}) => localStorage.setItem(key, encode(value))
  
  return { getItem, setItem }
}

// 检测浏览器是否可以使用 localStorge ( ios10 以下的用户打开了无痕模式 )
const Store = (function() {
  // 防止和上次打开重复
  const secret = +new Date()
  let hasStorge = true
  // ios 10 以下无痕模式无法存储 localStorge, 
  try {
    localStorage.setItem('support', secret)
    hasStorge = secret == +localStorage.getItem('support')
  }catch(e) {
    hasStorge = false
  }
  
  return hasStorge ? localStorageControl() : cookieControl()   
})();




// { 返回 getItem, setItem } 二个方法
export default Store



