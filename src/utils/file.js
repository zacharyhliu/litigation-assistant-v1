export const save = (content, filename) => {
  // 创建隐藏的可下载链接
  const eleLink = document.createElement('a')
  eleLink.download = filename
  eleLink.style.display = 'none'
  // 字符内容转变成blob地址
  const blob = new Blob([content])
  eleLink.href = URL.createObjectURL(blob)
  // 触发点击
  document.body.appendChild(eleLink)
  eleLink.click()
  // 然后移除
  document.body.removeChild(eleLink)
}

export const upload = () => {
  const promise = new Promise((resolve) => { // eslint-disable-line
    let input = document.createElement('input')
    input.type = 'file'
    input.style.display = 'none'
    document.body.appendChild(input)
    const handler = (e) => {
      const file = e.currentTarget.files[0]
      input.removeEventListener('change', handler)
      document.body.removeChild(input)
      input = null
      resolve(file)
    }
    input.addEventListener('change', handler)
    input.click()
  })
  return promise
}

export const read = (file) => new Promise((resolve) => {
  const reader = new FileReader()
  reader.readAsText(file, 'utf-8')
  reader.onload = (ev) => {
    resolve(ev.target.result)
  }
})
