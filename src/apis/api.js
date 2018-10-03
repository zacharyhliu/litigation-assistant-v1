/* eslint-disable */
import axios from 'axios'

export const getCurrentUserName = currentUserId => {
  return axios.get('user/username', { params: { userId: currentUserId } })
}
export const getFileData = fileId => {
  return axios.get('file/filedata', { params: { id: fileId } })
}
export const getUserFileList = currentUserId => {
  return axios.get('user/filelist', { params: { userId: currentUserId } })
}

