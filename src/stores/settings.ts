import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // 下载路径，默认为当前目录
  const downloadPath = ref('./downloads')

  // 加载设置
  const loadSettings = () => {
    const saved = localStorage.getItem('downloadPath')
    if (saved) {
      downloadPath.value = saved
    }
  }

  // 保存下载路径
  const setDownloadPath = (path: string) => {
    downloadPath.value = path
    localStorage.setItem('downloadPath', path)
  }

  return {
    downloadPath,
    loadSettings,
    setDownloadPath
  }
})
