<!-- eslint-disable -->
<template>
<!-- dragging over calls dropHandler -->
  <div
    @dragenter="e => e.preventDefault()
    "
    @dragover= "e => e.preventDefault()
    "
    @drop="dropHandler">
    <div
      v-if="content"
      class="top-toolbar">
      <base-button
      :disabled="showPrevious == 0"
      style="float: left"
      @click="displayPrevFile">Previous</base-button>
<!--       <base-button
        @click="clearContent">
        Clear Content
      </base-button>
 -->      <base-button
        :disabled="showNext == 0"
        @click="displayNextFile">Next</base-button>
    </div>
       
    <base-collapse
      v-if="content"
      v-model="activeItems">
      <base-collapse-item
        title="Structured Data"
        name="1">
        <ul class="structured-data">
          <li
            v-for="({key, value}, index) of structuredData"
            :key="index"
            class="structured-data__item">
            <div class="structured-data__item-key">{{ key }}</div>
            <div class="structured-data__item-value">{{ value }}</div>
          </li>
        </ul>
      </base-collapse-item>
      <base-collapse-item
        title="Unstructured Data"
        name="2">
        <div v-html="content.Html"></div>
      </base-collapse-item>
      <div class="bottom-bar">
        <button
        v-if="content"
        class="base-button"
        @click="markDone">Mark Done</button>
      </div>
      
    </base-collapse>
    <div
      v-else
      class="placeholder">
      Drag or Drop Files
      <a
        href="javascript: void 0;"
        @click="upload">
        Click to Upload
      </a>
      <!-- clicking a file calls fileChange -->
      <input
        ref="upload"
        accept=".html, .json"
        type="file"
        @change="fileChange">
    </div>
  </div>
</template>

<script>
/* eslint-disable */
// WANT TO REFACTOR CODE SO THAT FOR LOOPS are replaced internal data #NOFORLOOPS! unless necesscary
import _ from 'lodash'
import htmlReader from '@/readers/html-reader'
import jsonReader from '@/readers/json-reader'
import { getFileData, getUserFileList } from '@/apis/api'

//constants
const CONTENT_TYPE_JSON = 'application/json'
const CONTENT_TYPE_HTML = 'text/html'
//external helper functions
const handleError = (error) => {
  return "Error: " + error;
}
const getContentType = (file) => {
  const { name } = file
  const type = name.match(/.(\w+)$/)[1]
  if (type === 'json') {
    return CONTENT_TYPE_JSON
  } else if (type === 'html') {
    return CONTENT_TYPE_HTML
  }
  throw new Error('unsupport file type')
}

export default {
  name: 'Content',
  data() {
    return {
      content: undefined,
      activeItems: ['1', '2'],
      currentFileId: undefined,// will be refactored into one object currentFileMetaData
      currentFileList: undefined,
      currentUserId: undefined,
      currentFileIndex: -1, //will later be used to remove redundant for loops
      // later will be refactored into one object markFlags
      showNext: 0,// just used to determine wether next button will show. 0 = don't show, 1 = show
      showPrevious: 0,
    }
  },
  computed: {
    structuredData() {
      const data = _.omit(this.content, ['Html'])
      const keys = Object.keys(data)
      return keys
        .map(key => ({ key, value: data[key] }))
        .filter(item => item.value)
    },
  },
  methods: {
    //clears all internal data
    clearContent(){
      this.content = undefined;
      this.currentFileList = undefined;
      this.currentUserId = undefined;
      this.currentFileId = undefined;
      this.currentFileIndex = -1;
      this.showPrevious = 0;
      this.showNext = 0;
    },
    // handles drop file event, next 4 methods are no longer needed
    dropHandler(e) {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      this.readFile(file)
    },
    // reads file and displays formatted
    readFile(file) {
      const self = this
      if (window.FileReader) {
        const fileReader = new FileReader()
        fileReader.readAsText(file, 'utf-8')
        fileReader.onload = ({ currentTarget }) => {
          console.log(file);
          const type = file.type || getContentType(file)
          if (type === CONTENT_TYPE_JSON) {
            self.content = jsonReader(currentTarget.result)
          } else if (type === CONTENT_TYPE_HTML) {
            self.content = htmlReader(currentTarget.result)
          }
        }
      }
    },
    // uploads file from client
    upload(e) {
      e.preventDefault()
      this.$refs.upload.click()
    },
    // 
    fileChange(e) {
      const file = e.currentTarget.files[0]
      this.readFile(file)
    },
    //gets content of file and displays it, stores content
    displayFileContent(fileIdArg) {
      this.currentFileId = fileIdArg;
      getFileData(this.currentFileId).then(res => {
        //when migrate to AWS use instead of this.content = res.data.content
        //depending on file type which is done by if (res.data.content[0] == $) then htmlReader, else use jsonReader
        //example below of how to use json/html Reader
        //this.content = jsonReader(res.data.content), this.content = htmlReader(res.data.content)
        this.content = res.data.content;
      }).catch(error => {
        console.log(error.response);
        handleError(error);
      })
    },
    //get's user file list based on userID, stores [{fd1,status1},{fd2,status2},...,{fdN,statusN}]
    storeUserFileList(userIdArg){
      this.currentUserId = userIdArg
      getUserFileList(this.currentUserId).then(res => {
        this.currentFileList = res.data.fileList;
        this.displayFileContent(this.currentFileList[0].fileID);
        this.currentFileIndex = 0;
        this.currentFileList[0].status = 'in use';
      }).catch(error => {
        console.log(error);
        handleError(error);
      })
    },
    // displays next file
    displayNextFile() {
      if (!this.currentFileList) {// checking if file, if not throw error
        throw new Error("User has no files!");
      }
      this.showNext = 0;//hides next button
      this.showPrevious = 1;//shows previous button
      this.currentFileIndex++;
      for (let i = 0; i < this.currentFileList.length; i++) {
        if (this.currentFileList[i].status == 'not done') {//looks for file with not_done status, loads it, and sets current file status to in_use
          this.displayFileContent(this.currentFileList[i].fileID);
          this.currentFileList[i].status = 'in use';
          break;
        }
      }
    },
    // displays the previous file
    displayPrevFile(){
      if(this.currentFileList.length - 1 == this.currentFileIndex){
        this.showNext = 1;
        this.showMarkDone = 1;
      }
      this.currentFileIndex--;
      for (let i = 0; i < this.currentFileList.length; i++){
        if(this.currentFileList[i].status == 'in use'){
          this.currentFileList[i].status = 'not done';
          break;
        }
      }
      for (let i = this.currentFileList.length - 1; i >= 0; i--) {
        if (this.currentFileList[i].status == 'done') {//loads previous file, and sets current file status to in use
          this.displayFileContent(this.currentFileList[i].fileID);
          this.currentFileList[i].status = 'in use';
          if(this.currentFileId == this.currentFileList[0].fileID){
            this.showPrevious = 0;// hide previous button
          }
          break;
        }
      }

    },
    // Marks a file status as done
    markDone() {
      if (this.currentFileList.length - 1 != this.currentFileIndex)
      this.showNext = 1;//show next button
      for (let i = 0; i < this.currentFileList.length; i++){
        if(this.currentFileList[i].status == 'in use'){
          this.currentFileList[i].status = 'done';
          break;
        }
      }
      let message = "File is Marked Done"
      this.$message({ message, type: "success" })
    },
  },
  // gets called after html unrendered on reroute
  beforeDestroy(){
    // stores necesscary data to global scope
    Vue.prototype.$globalFileList = this.currentFileList
    Vue.prototype.$globalFileId = this.currentFileId
    Vue.prototype.$globalUserId = this.currentUserId
    console.log("destroyed")
  },
  // gets called after html render and method definitions
  created(){
    //restores data state from accessing global data
    if(!this.$globalFileList){
      this.storeUserFileList(100)
    } else {
      this.currentFileList = this.$globalFileList
      this.currentFileId = this.$globalFileId
      this.currentUserId = this.$globalUserId
      this.displayFileContent(this.$globalFileId)
      for (let i = 0; i < this.currentFileList.length; i++){
        if (this.currentFileId == this.currentFileList[i].fileID) {
          if (this.currentFileList[i].status == 'done') {
            this.showNext = 1;
            break;
          }
        }
      }
      if (this.currentFileId != this.currentFileList[0].fileID){
        this.showPrevious = 1;
      }
    }
  }
}

</script>

<style lang="less">
@import '../assets/mixin-clearfix.less';

.base-collapse-item__header {
  [class*=" base-icon-"] {
    line-height: inherit;
  }
  padding-left: 8px;
  font-size: 16px;
}
.base-collapse-item__content {
  padding: 10px;
}

.structured-data {
  padding: 0;
  list-style: none;
  &__item {
    .clearfix();
    border-bottom: dotted 1px #eee;
    &-key,
    &-value, {
      float: left;
    }
    &-key {
      width: 200px;
      user-select: none;
    }
    &-value {
      width: ~'calc(100% - 200px)';
    }
  }
}

.top-toolbar {
  position: sticky;
  top: 0;
  text-align: right;
  font-size: 18px;
  padding: 10px;
  background-color: #fff;
  border-bottom: solid 1px #eee;
  padding: 10px 15px;
}

.bottom-bar {
  padding: 10px;
  text-align: right;
}

.placeholder {
  margin: 25vh auto;
  text-align: center;
  color: #bbb;
  font-size: 24px;
  a {
    display: block;
  }
}

input[type=file] {
  visibility: hidden;
}
</style>
