/* eslint-disable */
const data = require('../../static/fields.json')

const parse = (items) => items.map((code) => {
  if (typeof code === 'string') {
    return { code, type: 'String' }
  }
  const key = Object.keys(code)[0]
  const { fields = [], type = 'String', ...rest } = code[key]
  return { code: key, type, fields: parse(fields), ...rest }
})


export const get = () => parse(data.fields)

export default {}
