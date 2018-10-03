const Store = (prefix) => ({
  get(key, defaultValue) {
    const lKey = `${prefix}:${key}`
    const value = localStorage.getItem(lKey) || ''
    try {
      return JSON.parse(value)
    } catch (e) {
      this.remove(lKey)
      return defaultValue
    }
  },
  set(key, value) {
    localStorage.setItem(`${prefix}:${key}`, JSON.stringify(value))
    return this
  },
  remove(key) {
    localStorage.removeItem(`${prefix}:${key}`)
    return this
  },
})

export default Store('litigation-assistant')
