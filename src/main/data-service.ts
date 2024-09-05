import { openSync, closeSync, writeSync, readFileSync } from 'fs'
// import * as path from 'path'

import remote from 'electron'

const app = remote.app



export default {
  getData: async () => {

    console.log("---------------");
    console.log(app.getPath('userData'))
    console.log("---------------");

    const userDataPath = app.getPath('userData');

    let resp
    const json = [
      {
        name: 'Chuchka',
        age: 25
      },
      {
        name: 'djopA',
        age: 13
      },
      {
        name: '123421SAASD',
        age: 12
      }
    ]
    let fd

    try {
      resp = readFileSync(userDataPath + '/options.json', 'utf8')
    } catch (error) {
      try {
        fd = openSync(userDataPath + '/options.json', 'a')
        writeSync(fd, JSON.stringify(json))
      } catch (err) {
        console.log(err)
      } finally {
        if (fd !== undefined) closeSync(fd)
        resp = readFileSync(userDataPath + '/options.json', 'utf8')
      }
    }

   

    return resp
  }
}

export type DataService = {
  geData(): string
}
