import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // 可以在这里添加主进程和渲染进程通信的 API
})
