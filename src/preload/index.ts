import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getData: (msg) => ipcRenderer.invoke('getData', msg),
  setData: (msg) => ipcRenderer.invoke('setData', msg),
  
  // Battle log APIs
  openBattleLog: (mainWindowId: number) => ipcRenderer.invoke('openBattleLog', mainWindowId),
  getBattleLog: () => ipcRenderer.invoke('getBattleLog'),
  addBattleLogEntry: (entry: any) => ipcRenderer.invoke('addBattleLogEntry', entry),
  clearBattleLog: () => ipcRenderer.invoke('clearBattleLog'),
  closeBattleLogWindow: () => ipcRenderer.invoke('closeBattleLogWindow'),
  onBattleLogUpdate: (callback: () => void) => {
    ipcRenderer.on('battle-log-update', () => callback())
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
