const createWatch = (() => {
  let startMap = {
    main: +new Date(),
    end: null
  }
  let descMap = {}

  let createMethods = (key='') => {
    if( startMap[key] == undefined && key.toUpperCase() !== 'ALL' ) {
      startMap[key] = +new Date()
    }

    const methods = (k='') => {
      if( startMap[k] === undefined ) return undefined
      const getName = () => k
      const getStart = () => startMap[k]
      const getEnd   = () => +new Date();
      const getKeep  = () => getEnd() - startMap[k]
      // 重新计算进入时间
      const refresh  = () => startMap[k] = +new Date()
      // 获取说明注释
      const getDesc  = () => descMap[k] == undefined ? '' : descMap[k]
      // 设置说明注释
      const setDesc  = (desc = '') => descMap[k] = desc
      // 查找其他的
      const find = target => methods(target)
      // 一次获取所有信息
      const getInfo  = () => ({ name: k, start: getStart(), end: getEnd(), keep: getKeep(), desc: getDesc(), find })
      return { getName, getStart, getEnd, getKeep, refresh, getInfo, getDesc, setDesc, find }
    }

    if( key.toUpperCase() == 'MAIN' ) return methods('main')
    if( key.toUpperCase() == 'ALL' ) {
      const getInfo = () => Object.keys(startMap).reduce((sum, next) => {
        sum[next] = methods(next).getInfo()
        return sum
      }, {})
      // 查找其他的
      const find = target => methods(target)
      return { getInfo, find }
    }

    return methods(key)
  }
  return createMethods
})();

export default createWatch
