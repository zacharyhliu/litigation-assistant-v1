import _ from 'lodash'

export const up = (data) => {
  const keys = Object.keys(data)
  const obj = {}
  keys.forEach(key => {
    _.set(obj, key, data[key])
  })
  return obj
}

export const down = (data, last) => {
  const obj = last || {}
  const keys = Object.keys(data)
  keys.forEach(key => {
    const value = data[key]
    if (_.isArray(value)) {
      value.forEach((item, index) => {
        down({ [`${key}[${index}]`]: item }, obj)
      })
    } else if (_.isObject(value)) {
      Object.keys(value).forEach(k => {
        down({ [`${key}[${k}]`]: value[k] }, obj)
      })
    } else {
      obj[key] = value
    }
  })
  return obj
}
