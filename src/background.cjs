const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')

// 延迟加载模块
let spawn
let fs

const getGalleryDlPath = () => {
  if (!fs) fs = require('fs')
  
  const extraResourcePath = path.join(process.resourcesPath, 'gallery-dl.exe')
  if (fs.existsSync(extraResourcePath)) {
    return extraResourcePath
  }

  const devPath = path.join(app.getAppPath(), 'bin', 'gallery-dl.exe')
  if (fs.existsSync(devPath)) {
    return devPath
  }

  return 'gallery-dl'
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 900,
    minHeight: 600,
    resizable: true,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    },
    show: false,
    backgroundColor: '#1a1a1a'
  })

  mainWindow.setMenu(null)

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

ipcMain.handle('window-minimize', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) win.minimize()
})

ipcMain.handle('window-maximize', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  }
})

ipcMain.handle('window-close', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) win.close()
})

ipcMain.handle('window-is-maximized', () => {
  const win = BrowserWindow.getFocusedWindow()
  return win ? win.isMaximized() : false
})

ipcMain.handle('check-gallery-dl', async () => {
  if (!spawn) spawn = require('child_process').spawn
  
  return new Promise((resolve) => {
    const galleryDlPath = getGalleryDlPath()
    const childProcess = spawn(galleryDlPath, ['--version'])
    let output = ''

    childProcess.stdout.on('data', (data) => {
      output += data.toString()
    })

    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve({
          installed: true,
          version: output.trim(),
          bundled: galleryDlPath !== 'gallery-dl'
        })
      } else {
        resolve({
          installed: false,
          error: 'gallery-dl 未找到'
        })
      }
    })

    childProcess.on('error', () => {
      resolve({
        installed: false,
        error: 'gallery-dl 未找到'
      })
    })
  })
})

ipcMain.handle('download-gallery', async (event, url, downloadPath) => {
  if (!spawn) spawn = require('child_process').spawn
  if (!fs) fs = require('fs')
  
  return new Promise((resolve) => {
    const galleryDlPath = getGalleryDlPath()
    let targetPath = downloadPath
    
    if (targetPath === 'downloads' || targetPath.startsWith('./') || targetPath.startsWith('.\\')) {
      targetPath = app.getPath('downloads')
    }

    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true })
    }

    const args = ['-d', targetPath, url]
    const childProcess = spawn(galleryDlPath, args)
    let output = ''
    let errorOutput = ''

    childProcess.stdout.on('data', (data) => {
      output += data.toString()
    })

    childProcess.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })

    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, message: '下载完成', output })
      } else {
        resolve({ success: false, message: errorOutput || '下载失败', output })
      }
    })

    childProcess.on('error', (error) => {
      resolve({ success: false, message: error.message })
    })
  })
})

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0]
  }
  return null
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
