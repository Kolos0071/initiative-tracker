import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import dataService, {BTOptions} from './data-service'

let battleLogWindow: BrowserWindow | null = null

// Хранилище лога боя (в памяти)
let battleLog: Array<{
  id: number
  round: number
  attackerName?: string
  targetName?: string
  damage: number
  isHeal: boolean
  timestamp: string
}> = []

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function createBattleLogWindow(mainWindow: BrowserWindow): void {
  if (battleLogWindow && !battleLogWindow.isDestroyed()) {
    battleLogWindow.focus()
    return
  }

  battleLogWindow = new BrowserWindow({
    width: 400,
    height: 600,
    show: true,
    autoHideMenuBar: true,
    parent: mainWindow,
    modal: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    battleLogWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/battle-log.html')
  } else {
    battleLogWindow.loadFile(join(__dirname, '../renderer/battle-log.html'))
  }

  battleLogWindow.on('closed', () => {
    battleLogWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.handle('getData', async () => await dataService.getData())
  ipcMain.handle('setData', async (_, options: BTOptions) => await dataService.setData(options))

  // Battle log IPC handlers
  ipcMain.handle('openBattleLog', async (_, mainWindowId: number) => {
    const mainWindow = BrowserWindow.fromId(mainWindowId)
    if (mainWindow) {
      createBattleLogWindow(mainWindow)
    }
  })

  ipcMain.handle('getBattleLog', () => battleLog)
  
  ipcMain.handle('addBattleLogEntry', async (_, entry: typeof battleLog[0]) => {
    battleLog.unshift(entry)
    // Уведомить окно лога об обновлении
    if (battleLogWindow && !battleLogWindow.isDestroyed()) {
      battleLogWindow.webContents.send('battle-log-update')
    }
  })
  
  ipcMain.handle('clearBattleLog', () => {
    battleLog = []
    if (battleLogWindow && !battleLogWindow.isDestroyed()) {
      battleLogWindow.webContents.send('battle-log-update')
    }
  })
  
  ipcMain.handle('closeBattleLogWindow', () => {
    if (battleLogWindow && !battleLogWindow.isDestroyed()) {
      battleLogWindow.close()
    }
  })


  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    battleLogWindow = null
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
