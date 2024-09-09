import { openSync, closeSync, writeSync, readFileSync } from 'fs'
import remote from 'electron'

export enum HP_APPEARANCE {
  BOXES,
  PERCENTAGE,
  NONE
}

export type BTOptions = {
  hpMin: number,
  hpMax: number,
  initiativeMax: number,
  initiativeMin: number,
  // hpAppearance: HP_APPEARANCE
}

export const DEFAULT_OPTIONS: BTOptions = {
  hpMin: 5,
  hpMax: 5,
  initiativeMax: 20,
  initiativeMin: 2,
  // hpAppearance: HP_APPEARANCE.BOXES
}

export default {

  setData: async (options: BTOptions)=>{
    let fd: number;
    const userDataPath: string = remote.app.getPath('userData');

    try {
      fd = openSync(userDataPath + '/options.json', 'w+')
      writeSync(fd, JSON.stringify(options))
    } catch (err) {
      console.log(err)
    }
  },

  async getData(): Promise<BTOptions> {
    const userDataPath: string = remote.app.getPath('userData');
    let resp: string
    const options: BTOptions = DEFAULT_OPTIONS;
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

    return JSON.parse(resp);
  }
}

