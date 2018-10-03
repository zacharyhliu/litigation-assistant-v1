<template>
  <div>
    <table
      id="documentTable"
      class="document-table">
      <tr>
        <th>Document List</th>
        <th class="left-header">Status</th>
        <th class="right-header">Final/Total: {{ completedFiles }}/{{ fileListLength }}</th>
      </tr>
    </table>
  </div>
</template>

<script>
/* eslint-disable */
import { getFileData, getUserFileList } from '@/apis/api'

export default {
  name: 'DocumentList',
  data() {
    return {
      fileList: undefined,
      fileListLength: 0,
      completedFiles: 0,
      documentTable: undefined,
    }
  },
  created(){
    setTimeout(() => {
      this.documentTable = document.getElementById("documentTable")
      // if not an admin display current user's file list
      if (!this.$parent.admin){
        this.storeRegularUserData()
        this.displayNameList(this.fileList)
      }
    })
  },
  mounted(){
    //calls if user is admin
    if(this.$parent.admin){
      this.$parent.$on('sendingUserId', data => {
        setTimeout(() => {
          getUserFileList(data).then(res => {
            this.clearTable()
            this.displayNameList(res.data.fileList)
            this.fileList = res.data.fileList
            this.fileListLength = res.data.fileList.length
          })
        })
      });
    }
  },
  methods: {
    clearTable(){
      let tableRows = this.documentTable.getElementsByTagName('tr');
      let rowCount = tableRows.length;
      for (let x=rowCount-1; x>0; x--) {
         this.documentTable.removeChild(tableRows[x]);
      }
    },
    // fills fileNameList with based on fileList's fileId's and increments completedFiles based on 'done' statuses
    displayNameList(fileListArg){
      for (let i = fileListArg.length - 1; i >= 0; i--){
        if (fileListArg[i].status == 'done') {
          this.completedFiles++;
        }
        getFileData(fileListArg[i].fileID).then(res => {
          let row = this.documentTable.insertRow(1)
          let documentCell = row.insertCell(0)
          let statusCell = row.insertCell(1)
          let buttonCell = row.insertCell(2)
          documentCell.innerHTML = res.data.fileName
          statusCell.innerHTML = fileListArg[i].status
        })

      }
    },
    // stores fileList from global, gets Table object, sets filelistLength
    storeRegularUserData(){
      this.fileList = this.$globalFileList
      if(this.fileList == undefined){
        throw new Error('no file list!')
      }
      this.fileListLength = this.fileList.length
      
    },
  },

}
</script>

<style>
.document-table{
  border-collapse: collapse;
  width: 100%;
}
.left-header {
  text-align: left;
}
th {
  font-size: 18px;
}
th, td {
  padding: 5px;
  border-bottom: solid 1px #eee;;
}

.right-header {
  text-align: right;
}
</style>
