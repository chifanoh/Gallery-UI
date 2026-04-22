import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import { spawn } from 'child_process'
import fs from 'fs'

// 获取 gallery-dl 可执行文件路径
const getGalleryDlPath = (): string => {
  // 首先检查应用目录下是否有打包的 gallery-dl.exe
  const bundledPath = path.join(process.resourcesPath, 'gallery-dl.exe')
  if (fs.existsSync(bundledPath)) {
    return bundledPath
  }
  
  // 开发环境下检查项目根目录
  const devPath = path.join(app.getAppPath(), 'bin', 'gallery-dl.exe')
  if (fs.existsSync(devPath)) {
    return devPath
  }
  
  // 否则使用系统 PATH 中的 gallery-dl
  return 'gallery-dl'
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    resizable: false,
    maximizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    titleBarStyle: 'hiddenInset',
    show: false
  })

  // 加载应用
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

// 检查 gallery-dl 是否可用
ipcMain.handle('check-gallery-dl', async () => {
  return new Promise((resolve) => {
    const galleryDlPath = getGalleryDlPath()
    const process = spawn(galleryDlPath, ['--version'])
    let output = ''
    
    process.stdout.on('data', (data) => {
      output += data.toString()
    })
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve({ 
          installed: true, 
          version: output.trim(),
          bundled: galleryDlPath !== 'gallery-dl'
        })
      } else {
        resolve({ 
          installed: false, 
          error: 'gallery-dl 未找到，请确保 gallery-dl.exe 在应用目录的 bin 文件夹中，或已添加到系统 PATH'
        })
      }
    })
    
    process.on('error', () => {
      resolve({ 
        installed: false, 
        error: 'gallery-dl 未找到，请确保 gallery-dl.exe 在应用目录的 bin 文件夹中，或已添加到系统 PATH'
      })
    })
  })
})

// 执行下载
ipcMain.handle('download-gallery', async (event, url: string, downloadPath: string) => {
  return new Promise((resolve) => {
    const galleryDlPath = getGalleryDlPath()
    
    // 处理相对路径，转换为绝对路径
    let targetPath = downloadPath
    if (targetPath.startsWith('./') || targetPath.startsWith('.\\')) {
      targetPath = path.join(app.getPath('downloads'), 'gallery-dl')
    }
    
    // 确保目录存在
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true })
    }
    
    const args = ['-d', targetPath, url]
    const process = spawn(galleryDlPath, args)
    
    let output = ''
    let errorOutput = ''
    
    process.stdout.on('data', (data) => {
      output += data.toString()
    })
    
    process.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, message: '下载完成', output })
      } else {
        resolve({ success: false, message: errorOutput || '下载失败', output })
      }
    })
    
    process.on('error', (error) => {
      resolve({ success: false, message: error.message })
    })
  })
})

// 选择文件夹
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
