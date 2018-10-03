<template>
  <common-patsnap-header
    :menus="appMenus"
    :breadcrumbs="appBreadcrumbs"
    :user="userInfo"
    :logo="logo"
    :user-center="{
      modules: modules,
      systems: systems,
      globals: globals
  }">
  </common-patsnap-header>
</template>

<script>
const logo = {
  type: 'patsnap',
  route: 'Welcome',
}

const userInfo = {
  name: '',
}

const modules = [{
  label: 'Welcome',
  route: 'Welcome',
}, {
  label: 'Preferences',
  route: 'Preferences',
}, {
  label: 'Progress',
  route: 'Progress',
}]

const systems = [{
  label: 'Release Log',
}]

const appMenus = [{
  label: 'Welcome',
  route: 'Welcome',
}, {
  label: 'Preferences',
  route: 'Preferences',
}, {
  label: 'Progress',
  route: 'Progress',
}]

const appBreadcrumbs = []

export default {
  name: 'AppHeader',
  data() {
    return {
      userInfo,
      logo,
      modules,
      systems,
      globals: [],
      appMenus,
      appBreadcrumbs,
    }
  },
}
</script>
