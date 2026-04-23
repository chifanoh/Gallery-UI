const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // 检查 gallery-dl 是否安装
  checkGalleryDl: () => ipcRenderer.invoke('check-gallery-dl'),

  // 执行下载
  downloadGallery: (url, downloadPath) =>
    ipcRenderer.invoke('download-gallery', url, downloadPath),

  // 选择文件夹
  selectFolder: () => ipcRenderer.invoke('select-folder'),

  // 打开外部链接
  openExternal: (url) => ipcRenderer.invoke('open-external', url),

  // 窗口控制
  windowMinimize: () => ipcRenderer.invoke('window-minimize'),
  windowMaximize: () => ipcRenderer.invoke('window-maximize'),
  windowClose: () => ipcRenderer.invoke('window-close'),
  windowIsMaximized: () => ipcRenderer.invoke('window-is-maximized')
})
