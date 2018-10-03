/* eslint-disable */
import Mock from 'mockjs'

var Files = [{
  fileID: 123,
  fileName: 'testfile.txt',
  content: 'this is a test file, some random text blah blah blah',
}]

for (let i = 0; i < 100; i++) {
  Files.push(Mock.mock({
    fileID: Mock.Random.id(),
    fileName: Mock.Random.first() + " 's File.txt",
    content: Mock.Random.paragraph(),
  }))
}

var Users = [{
  userID: 100,
  userName: "Zachary Liu"
}]

for (let i = 0; i < 10; i++) {
  Users.push(Mock.mock({
    userID: Mock.Random.guid(),
    userName: Mock.Random.name(),
  }))
}

var usersToFiles = {}
// mapping each userId to 10 filesId's
let count = 0
for (let i = 0; i < 10; i++) {
  let full = false
  usersToFiles[Users[i].userID] = []// init an array for each key in object
  while (!full) {
    usersToFiles[Users[i].userID].push({// push object containing status and fileID
      status: 'not done',
      fileID: Files[count].fileID,
    })
    count++
    if (count % 10 === 0) {
      full = true
    }
  }
}

export { Files, Users, usersToFiles }
