const p1 = /"(.*)":"((.|\s)*?)"/
const HTML_KEY = '诉讼全文'

const html = content => content.split('\n').map(line => `<div class="line">${line}</div>`).join('')

export default (data) => {
  const values = data
    .match(new RegExp(p1, 'g')) || []

  const obj = {}
  values.forEach(value => {
    const [, key, val] = value.match(p1)
    if (key === HTML_KEY) {
      obj.Html = html(val)
    } else {
      obj[key] = val
    }
  })
  return obj
}
