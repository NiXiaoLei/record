const ajax = (function () {
  let xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')
  return ({
    url = '',
    data = {},
    type = 'GET',
    async = true,
    dataType = 'JSON',
    success = () => {},
    error = () => {}
  }) => {
    type = type.toUpperCase()
    dataType = dataType.toUpperCase()
    let postData = Object.keys(data).map(key => `${key}=${data[key]}`).join('&');
    // 处理回调
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        let resData = xhr.responseText
        if (dataType === 'JSON') resData = JSON.parse(resData)
        xhr.status === 200 ? success(resData) : error(resData)
      }
    }
    // 请求类型
    if (type === 'GET') {
      xhr.open(type, `${url}?${postData}`, async);
      xhr.send(null);
    } else if (type !== 'GET') {
      xhr.open(type, url, async);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
      xhr.send(postData);
    }
  }
})();

export default ajax
