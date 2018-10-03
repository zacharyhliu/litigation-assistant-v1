<!-- eslint-disable -->
<template>
  <div>
    <table
      id="userTable"
      class="usertable">
      <tr>
        <th v-if="$parent.admin == false">Current User</th>
        <th v-else>Team Member List</th>
      </tr>
      <!-- during actual use change to 'in userList' -->
      <tr
        class="selectableText"
        v-for="(username, index) in adminList"
        v-if="$parent.admin == true">
        <td @click="highlight(index) & sendSelectedUserId(index)"
            :class="{ 'highlighted': index == activeIndex }">
            {{ username.userName }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
/* eslint-disable */

import { getCurrentUserName } from '@/apis/api'



export default {
  name: 'UserList',

  data() {
    return {
      userTable: undefined,
      user: { userName: undefined },
      userList: undefined,
      adminList: undefined,
      activeIndex: undefined,
    }

  },
  // function runs after everything html and methods are rendered
  created() {
    setTimeout(() => {
      this.storeUserInfo(100)
      setTimeout(() => {
        if (this.$parent.admin == false) {
          this.loadUser()
        } else {
          // just for testing purposes due to the way data is mocked last user does not have files mapped, during use comment out
          this.adminList = this.userList.splice(0,this.userList.length - 1)
        }
      })
    })

  },
  methods: {
    // fills necessecary component data
    storeUserInfo(userIdArg){
      this.userTable = document.getElementById("userTable");
      let tempUserId = userIdArg
      getCurrentUserName(tempUserId).then(res => {
        this.user.userName = res.data.userName
        this.userList = res.data.userList
      }).catch(error => {
      console.log(error)
      })
    },
    // loads normal User's username
    loadUser() {
    // regular user loads only his list so render immediately
      if(this.user.userName != undefined){
        let row = this.userTable.insertRow(1)
        let cell = row.insertCell(0)
        cell.innerHTML = this.user.userName
      } else {
        throw new Error('No Current User')
      }
    },
    sendSelectedUserId(index) { 
      // during actual use refactor to this.userList
      this.$parent.$emit('sendingUserId', this.adminList[index].userID)

    },
    highlight(index) {
      this.activeIndex = index;
    },
  },
}
</script>

<style>

.usertable {
  border-collapse: collapse;
  width: 100%;
}
th, td {

  padding: 5px;
  border-bottom: solid 1px #eee;;
}
th {
  color: white;
  background-color: #78AF2B; 
}
.selectableText {
  cursor: pointer;
}
.highlighted {
  background-color: lightblue;
}
</style>

