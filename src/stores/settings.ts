import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // 下载路径，默认为系统下载文件夹
  const downloadPath = ref('')

  // 加载设置
  const loadSettings = () => {
    const saved = localStorage.getItem('downloadPath')
    if (saved) {
      downloadPath.value = saved
    } else {
      // 默认使用系统下载文件夹
      downloadPath.value = 'downloads'
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
