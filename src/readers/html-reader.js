const p1 = /var\sjsonHtmlData\s=\s"(.*)";/

export default (data) => {
  const values = data
    .split('\n')
    .join('')
    .match(p1) || []

  const [, value] = values
  return JSON.parse(value.replace(/\\"/g, '"'))
}
