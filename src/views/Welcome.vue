<template>
  <div class="welcome">
    <file-content
      v-huaci="huaciHandler"
      class="content">
    </file-content>
    <div
      v-loading="loading"
      element-loading-text="load local data..."
      class="form">
      <div class="button-group">
        <!-- no need for manual save button or interval box-->
        <!-- <base-checkbox
          v-model="autoSave">
          定时保存(每 {{ saveInterval }} 秒)
        </base-checkbox>
        <base-button
          icon="base-icon-check"
          @click="saveData()">
          Sync (in Browser)
        </base-button> -->
        <base-button
          icon="base-icon-download"
          @click="exportData">
          Export
        </base-button>
        <base-button
          icon="base-icon-upload2"
          @click="loadData">
          Import
        </base-button>
      </div>
      <form-render
        ref="form"
        v-model="formData"
        :data="formItems">
      </form-render>
    </div>
    <spotlight
      :selection="selectionText"
      :visible.sync="visible"
      :service="spotlightService">
    </spotlight>
  </div>
</template>

<script>
/* eslint camelcase: "off" */
import dayjs from 'dayjs'
import Spotlight from '@/components/Spotlight'
// FileContent is just an object representing everything exported from component
import FileContent from '@/components/Content'
import FormRender from '@/components/FormRender'
import { save, upload, read } from '@/utils/file'
import { up } from '@/utils/object'
import store from '@/utils/storage'
import { get } from '@/apis/preferences'
import {
  CACHE_KEY_DATA,
  CACHE_KEY_CLIPBOARD,
  CLIPBOARD_MAX_SIZE,
} from '@/constants'

const match = (field, re) => {
  const keys = Object.keys(field)
  for (let i = 0, size = keys.length; i < size; i++) {
    const key = keys[i]
    if (re.test(field[key])) {
      return true
    }
  }
  return false
}

export default {
  name: 'Welcome',
  components: {
    Spotlight,
    FileContent,
    FormRender,
  },
  data() {
    return {
      visible: false,
      selectionText: '',
      formItems: [],
      loading: false,
      autoSave: true,
      formData: {},
      saveInterval: 10,
    }
  },
  mounted() {
    this.spotlightService()
    this.loading = true
    this.timeout = setTimeout(() => {
      this.loadLocalData()
      this.loading = false
    }, 1000)
    // commented out because form data is auto being saved in browser
    // this.interval = setInterval(() => {
    //   if (!this.autoSave) return
    //   const auto = true
    //   this.saveData(auto)
    // }, this.saveInterval * 1000)
  },
  destroyed() {
    clearTimeout(this.timeout)
    clearInterval(this.interval)
  },
  methods: {
    huaciHandler({ selection }) {
      const clips = store.get(CACHE_KEY_CLIPBOARD, [])
      if (clips.indexOf(selection) !== -1) {
        return
      }
      if (clips.length >= CLIPBOARD_MAX_SIZE) {
        clips.splice(0, 1)
      }
      clips.push(selection)
      store.set(CACHE_KEY_CLIPBOARD, clips)
    },
    async spotlightService(keyword) {
      const fields = await get(keyword)
      this.formItems = fields
      const re = new RegExp(keyword)
      return fields.filter(field => match(field, re))
    },
    async loadData() {
      const file = await upload()
      const content = await read(file)
      const data = JSON.parse(content)
      this.formData = data
    },
    loadLocalData() {
      const data = store.get(CACHE_KEY_DATA, {})
      this.formData = data
    },
    async exportData() {
      // 先保存
      const data = this.saveData()
      let { case_number } = data
      if (!case_number) {
        const result = await this.$prompt('请输入案件编号', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
        case_number = result.value
      }
      const fileName = `${case_number}_${dayjs().format('YYYYMMDDHHmm')}.json`
      save(JSON.stringify(data, null, 2), fileName)
    },
    saveData(auto) {
      const { form } = this.$refs
      if (!form) return null
      const data = up(form.getData())
      store.set(CACHE_KEY_DATA, data)
      this.formData = data
      const message = `${auto ? 'Auto' : 'Manual'} Saved !`
      console.info(message) // eslint-disable-line
      this.$message({
        message,
        type: 'success',
      })
      return this.formData
    },
  },
}
</script>
<!-- comma makes it so that content and form have the same attributes -->
<style lang="less">
@import '../assets/mixin-clearfix.less';
.welcome {
  .clearfix();
  .content,
  .form {
    float: left;
    width: 50%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .content {
    border: solid 1px #eee;
  }
  .form {
    border: solid 1px #eee;
    border-left: none;
    &.base-form {
      padding: 20px;
    }
    .button-group {
      position: sticky;
      top: 0;
      width: 100%;
      padding: 10px 15px;
      text-align: right;
      z-index: 1;
      background-color: #fff;
      border-bottom: #eee solid 1px;
    }
    > .inner-form {
      border: none;
    }
  }
}
</style>

