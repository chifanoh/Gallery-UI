import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // 检查 gallery-dl 是否安装
  checkGalleryDl: () => ipcRenderer.invoke('check-gallery-dl'),
  
  // 执行下载
  downloadGallery: (url: string, downloadPath: string) => 
    ipcRenderer.invoke('download-gallery', url, downloadPath),
  
  // 选择文件夹
  selectFolder: () => ipcRenderer.invoke('select-folder')
})
