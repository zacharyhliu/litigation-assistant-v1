/* eslint no-param-reassign: "off" */
const EVENT_MOUSE_UP = 'mouseup'

export const directive = {
  bind(el, binding) {
    const mouseUpHandler = (event) => {
      const selection = window.getSelection()
      const string = selection.toString()
      const { value, arg } = binding
      if (string.length > 0) {
        value({
          selection: string.trim(),
          arg,
          event,
        })
      }
    }

    el.addEventListener(EVENT_MOUSE_UP, mouseUpHandler)
    el.mouseUpHandler = mouseUpHandler
  },
  unbind(el) {
    el.removeEventListener(EVENT_MOUSE_UP, el.mouseUpHandler)
    delete el.mouseUpHandler
  },
}

const install = (Vue) => {
  Vue.directive('huaci', directive)
}

export default {
  install,
}
