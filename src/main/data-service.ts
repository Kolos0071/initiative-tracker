import { openSync, closeSync, writeSync, readFileSync } from 'fs'
import remote from 'electron'

const app = remote.app

export default {
  getData: async () => {

    const userDataPath = app.getPath('userData');

    let resp
    const options = {

    }
    let fd

    try {
      resp = readFileSync(userDataPath + '/options.json', 'utf8')
    } catch (error) {
      try {
        fd = openSync(userDataPath + '/options.json', 'a')
        writeSync(fd, JSON.stringify(options))
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
