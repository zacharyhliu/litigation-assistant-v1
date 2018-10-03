<template>
  <span v-clickoutside="close">
    <base-input
      :name="name"
      :value="value"
      size="mini"
      @input="setValue"
      @click.native="toggle">
    </base-input>
    <div
      v-if="opened && items.length > 0"
      class="base-popover base-popper"
      x-placement="bottom"
      @click.stop>
      <ul>
        <li
          v-for="item of items"
          :key="item.value"
          class="base-dropdown-menu__item"
          @click.stop="setValue(item.value)">
          <i
            v-if="item.type === 'clip'"
            class="base-icon-tickets">
          </i>
          {{ item.value }}
        </li>
      </ul>
      <div class="popper__arrow"></div>
    </div>
  </span>
</template>

<script>
import Clickoutside from '@patsnap/base-components/src/utils/clickoutside'
import { CACHE_KEY_CLIPBOARD } from '@/constants'
import store from '@/utils/storage'

export default {
  directives: {
    Clickoutside,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      opened: false,
    }
  },
  computed: {
    items() {
      const clips = store.get(CACHE_KEY_CLIPBOARD, [])
        .map(value => ({ value, type: 'clip' }))
      const choices = this.data
        .map(value => ({ value, type: 'choice' }))
      return [...clips, ...choices]
    },
  },
  methods: {
    close() {
      this.opened = false
    },
    toggle() {
      this.opened = !this.opened
    },
    setValue(value) {
      this.$el.querySelector('input.base-input__inner').value = value
      this.$emit('input', value)
    },
  },
}
</script>

