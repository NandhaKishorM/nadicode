import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { setupMenu } from './utils/menu'
import { createUserSpace } from './utils/path'
/**
 * Managers
 **/
import { WindowManager } from './managers/window'
import { log, ModuleManager } from '@janhq/core/node'

/**
 * IPC Handlers
 **/
import { handleDownloaderIPCs } from './handlers/download'
import { handleExtensionIPCs } from './handlers/extension'
import { handleFileMangerIPCs } from './handlers/fileManager'
import { handleAppIPCs } from './handlers/app'
import { handleFsIPCs } from './handlers/fs'

/**
 * Utils
 **/
import { migrateExtensions } from './utils/migration'
import { cleanUpAndQuit } from './utils/clean'
import { setupExtensions } from './utils/extension'

app
  .whenReady()
  .then(createUserSpace)
  .then(migrateExtensions)
  .then(setupExtensions)
  .then(setupMenu)
  .then(handleIPCs)
  .then(createMainWindow)
  .then(() => {
    app.on('activate', () => {
      if (!BrowserWindow.getAllWindows().length) {
        createMainWindow()
      }
    })
  })

app.once('window-all-closed', () => {
  cleanUpAndQuit()
})

app.once('quit', () => {
  cleanUpAndQuit()
})

function createMainWindow() {
  /* Create main window */
  const mainWindow = WindowManager.instance.createWindow({
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, 'preload.js'),
      webSecurity: false,
    },
  })

  const startURL = app.isPackaged
    ? `file://${join(__dirname, '..', 'renderer', 'index.html')}`
    : 'http://localhost:3000'

  /* Load frontend app to the window */
  mainWindow.loadURL(startURL)

  mainWindow.once('ready-to-show', () => mainWindow?.show())
  mainWindow.on('closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  /* Open external links in the default browser */
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url)
    return { action: 'deny' }
  })

  /* Enable dev tools for development */
  if (!app.isPackaged) mainWindow.webContents.openDevTools()
}

/**
 * Handles various IPC messages from the renderer process.
 */
function handleIPCs() {
  handleFsIPCs()
  handleDownloaderIPCs()
  handleExtensionIPCs()
  handleAppIPCs()
  handleFileMangerIPCs()
}

/*
** Suppress Node error messages
*/
process.on('uncaughtException', function (err) {
  // TODO: Write error to log file in #1447
  log(`Error: ${err}`)
})
