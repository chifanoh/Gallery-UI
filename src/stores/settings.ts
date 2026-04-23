import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // 下载路径，默认为系统下载文件夹
  const downloadPath = ref('')

  // gallery-dl 检查状态
  const galleryInstalled = ref(false)
  const galleryVersion = ref('')
  const galleryBundled = ref(false)
  const galleryChecked = ref(false)

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

  // 检查 gallery-dl
  const checkGallery = async () => {
    if (galleryChecked.value) return
    
    try {
      const result = await window.electronAPI.checkGalleryDl()
      galleryInstalled.value = result.installed
      galleryBundled.value = result.bundled || false
      if (result.version) {
        galleryVersion.value = result.version
      }
    } catch (error) {
      console.error('检查 gallery-dl 失败:', error)
    } finally {
      galleryChecked.value = true
    }
  }

  return {
    downloadPath,
    galleryInstalled,
    galleryVersion,
    galleryBundled,
    galleryChecked,
    loadSettings,
    setDownloadPath,
    checkGallery
  }
})
