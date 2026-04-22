<template>
  <div class="home-container">
    <div class="content-wrapper">
      <h1 class="title">Gallery-UI</h1>
      
      <div class="input-section">
        <el-input
          v-model="url"
          placeholder="请输入漫画链接..."
          size="large"
          class="url-input"
          clearable
        >
          <template #prefix>
            <el-icon><Link /></el-icon>
          </template>
        </el-input>
        
        <el-button
          type="primary"
          size="large"
          class="download-btn"
          :loading="isDownloading"
          :disabled="!galleryInstalled"
          @click="handleDownload"
        >
          <el-icon class="btn-icon"><Download /></el-icon>
          {{ isDownloading ? '下载中...' : '开始下载' }}
        </el-button>
      </div>
      
      <div v-if="downloadStatus" class="status-section">
        <el-alert
          :title="downloadStatus"
          :type="statusType"
          :closable="false"
          show-icon
        />
      </div>
      
      <div v-if="checked" class="tips-section" :class="{ error: !galleryInstalled }">
        <el-icon size="14"><WarningFilled v-if="!galleryInstalled" /><InfoFilled v-else /></el-icon>
        <span>{{ !galleryInstalled ? (galleryError || 'gallery-dl 未找到，请在设置中查看安装说明') : '请合理使用下载功能，避免频繁请求对服务器造成压力' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Link, Download, InfoFilled, WarningFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useSettingsStore } from '../stores/settings'

const url = ref('')
const isDownloading = ref(false)
const downloadStatus = ref('')
const statusType = ref<'success' | 'warning' | 'info' | 'error'>('info')
const galleryInstalled = ref(false)
const galleryError = ref('')
const checked = ref(false)

const settingsStore = useSettingsStore()

// 检查 gallery-dl 是否安装
const checkGallery = async () => {
  try {
    const result = await window.electronAPI.checkGalleryDl()
    galleryInstalled.value = result.installed
    if (result.error) {
      galleryError.value = result.error
    }
    checked.value = true
  } catch (error) {
    galleryInstalled.value = false
    checked.value = true
  }
}

const handleDownload = async () => {
  if (!url.value.trim()) {
    ElMessage.warning('请输入漫画链接')
    return
  }
  
  isDownloading.value = true
  downloadStatus.value = '正在下载中，请稍候...'
  statusType.value = 'info'
  
  try {
    const result = await window.electronAPI.downloadGallery(
      url.value.trim(),
      settingsStore.downloadPath
    )
    
    if (result.success) {
      downloadStatus.value = '下载完成！'
      statusType.value = 'success'
      ElMessage.success('下载完成')
      url.value = ''
    } else {
      downloadStatus.value = result.message || '下载失败'
      statusType.value = 'error'
      ElMessage.error(result.message || '下载失败')
    }
  } catch (error) {
    downloadStatus.value = '下载出错：' + (error as Error).message
    statusType.value = 'error'
    ElMessage.error('下载出错')
  } finally {
    isDownloading.value = false
    setTimeout(() => {
      downloadStatus.value = ''
    }, 5000)
  }
}

onMounted(() => {
  checkGallery()
})
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  padding: 40px;
}

.content-wrapper {
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.title {
  font-size: 36px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 40px;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.url-input {
  width: 100%;
}

.url-input :deep(.el-input__wrapper) {
  background-color: var(--bg-secondary);
  box-shadow: 0 0 0 1px var(--border-color) inset;
}

.url-input :deep(.el-input__inner) {
  color: var(--text-primary);
}

.download-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
}

.btn-icon {
  margin-right: 8px;
}

.status-section {
  margin-bottom: 16px;
}

.tips-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 32px;
  padding: 12px 16px;
  font-size: 13px;
  color: var(--text-secondary);
  opacity: 0.7;
}

.tips-section .el-icon {
  color: var(--text-secondary);
}

.tips-section.error {
  color: #f56c6c;
  opacity: 1;
}

.tips-section.error .el-icon {
  color: #f56c6c;
}
</style>
