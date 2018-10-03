/* eslint-disable */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Files, Users, usersToFiles } from './data/files'

const _Files = Files
const _Users = Users
const _UsersToFiles = usersToFiles

export default {
  bootstrap() {

    let mock = new MockAdapter(axios)

    // mocks get request for username by User Id
    mock.onGet('user/username').reply(config => {
      let tempUserID = config.params.userId
      let tempUserList = _Users
      let tempUserName = undefined
      for (let i = 0; i < _Users.length; i++) {
        if (_Users[i].userID == tempUserID){
          tempUserName = _Users[i].userName
          break
        }
      }
      return new Promise((resolve, reject) => { 
          if(tempUserName) {
            resolve([200, {
              userName: tempUserName,
              userList: tempUserList,
            }])
          } else {
            reject(new Error('User not found'))
          }
      })
    })

    //  mock get file metadata based on fileID
    mock.onGet('/file/filedata').reply(config => {
      let tempFileID = config.params.id
      let currentFile = _Files.filter(file => {
        if (tempFileID && file.fileID === tempFileID) return true
        return false
      })
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (currentFile) {
            resolve([200, {// resolve promise with an object containing file name and content
              content: currentFile[0].content,
              fileName: currentFile[0].fileName,
            }])
          } else {
            reject(new Error('File not found'))
          }
        })
      })
    })

    //  get_users_file_list(userID): returns [{f1,status1},{f2,status2},...,{fN,statusN}]
    mock.onGet('/user/filelist').reply(config => {
      let tempUserID = config.params.userId
      let currentFileList = undefined
      for (let key in _UsersToFiles) {
        if (tempUserID && key == tempUserID) {
          currentFileList = _UsersToFiles[key]
        }// currentFileList is now set to the users assigned files with their statuses
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (currentFileList) {
            resolve([200, {
              fileList: currentFileList,
            }])
          } else {
            reject(new Error('User not found'))
          }
        })
      })
    })
  },
}
//  local variables pointing to mockdata
