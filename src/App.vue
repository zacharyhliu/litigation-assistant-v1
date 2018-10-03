<template>
  <div id="app">
    <app-header></app-header>
    <router-view class="router-view"/>
  </div>
</template>

<script>
import AppHeader from '@/components/Header'

export default {
  name: 'App',
  components: {
    AppHeader,
  },
}
</script>

<style lang="less">
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  height: 100%;
}

#app {
  height: 100%;
}

.router-view {
  padding: 20px;
  height: ~'calc(100% - 56px)';
}

.comp-spotlight .base-dialog {
  border-radius: 8px;
}

.inner-form {
  margin: 0;
  padding: 10px 15px 10px;
  border: none;
  border: dotted #d2d2d2 1px;
  &__top {
    text-align: right;
  }
  .base-form-item {
    margin-bottom: 12px;
  }
  .base-form-item__label,
  .base-form-item__content {
    line-height: 36px;
  }
}
</style>
