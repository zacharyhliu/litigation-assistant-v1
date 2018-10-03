<!-- html -->
<template>
  <div class="progress">
    <UserList class="userlist">
    </UserList>
    <DocumentList class="documentlist">
    </DocumentList>
  </div>
</template>
<!-- js -->
<script>
/* eslint-disable */
import UserList from '@/components/UserList'
import DocumentList from '@/components/DocumentList'

export default {
// Parent of UserList and DocumentList components
// To view admin UI set admin to true
  name: 'Progress',
  components: {
    UserList,
    DocumentList,
  },
  data() {
    return {
      admin: false,// <- set to true for admin | false for normal user
    }
  },
  methods: {

  },

}

</script>
<!-- css -->
<style lang="less">
@import '../assets/mixin-clearfix.less';

.progress {
  .userlist,
  .documentlist {
    height: 100%;
    border: solid 1px #eee;
    overflow-x: hidden;
    overflow-y: auto;
    border-radius: 5px;
  }
  .userlist {
    width: 30%;
    float: left;
  }
  .documentlist {
    width: 70%;
    border-left: 0px;
  }
}


</style>
