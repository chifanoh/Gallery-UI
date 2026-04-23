<template>
  <div class="settings-container">
    <h1 class="page-title">设置</h1>
    
    <section class="settings-section">
      <h2 class="section-title">下载设置</h2>
      
      <div class="setting-item">
        <div class="setting-info">
          <label class="setting-label">下载路径</label>
          <p class="setting-desc">漫画文件将保存到此目录</p>
        </div>
        <div class="setting-control">
          <el-input
            v-model="downloadPath"
            readonly
            class="path-input"
            placeholder="选择下载目录"
          >
            <template #append>
              <el-button @click="selectFolder">
                <el-icon><Folder /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
    </section>
    
    <section class="settings-section">
      <h2 class="section-title">外观设置</h2>
      
      <div class="setting-item">
        <div class="setting-info">
          <label class="setting-label">主题模式</label>
          <p class="setting-desc">选择您喜欢的界面主题</p>
        </div>
        <div class="setting-control">
          <el-radio-group v-model="themeMode" @change="handleThemeChange">
            <el-radio-button label="light">
              <el-icon><Sunny /></el-icon>
              浅色
            </el-radio-button>
            <el-radio-button label="dark">
              <el-icon><Moon /></el-icon>
              深色
            </el-radio-button>
            <el-radio-button label="auto">
              <el-icon><Monitor /></el-icon>
              跟随系统
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </section>
    
    <section class="settings-section">
      <h2 class="section-title">依赖检查</h2>
      <div class="check-content">
        <div class="check-item">
          <span class="check-label">gallery-dl.exe</span>
          <div class="tag-wrapper">
            <el-tag v-if="galleryChecked" :type="galleryInstalled ? 'success' : 'danger'">
              {{ galleryInstalled ? '已安装' : '未安装' }}
            </el-tag>
            <el-tag v-else type="info">检查中...</el-tag>
          </div>
        </div>
        <div v-if="galleryVersion" class="check-item">
          <span class="check-label">版本</span>
          <span class="check-value">{{ galleryVersion }}</span>
        </div>
        <div v-if="galleryInstalled && galleryBundled" class="install-hint">
          <p>使用内置的 gallery-dl 可执行文件</p>
        </div>
        <div v-if="galleryChecked && !galleryInstalled" class="install-hint">
          <p>gallery-dl 未找到，请下载 Windows 可执行文件并放置到以下位置之一：</p>
          <ul>
            <li>应用目录的 bin 文件夹中</li>
            <li>添加到系统 PATH 环境变量</li>
          </ul>
          <p>下载地址：<a href="https://github.com/mikf/gallery-dl/releases" target="_blank">GitHub Releases</a></p>
        </div>
      </div>
    </section>
    
    <section class="settings-section">
      <h2 class="section-title">关于</h2>
      <div class="check-content">
        <div class="check-item">
          <span class="check-label">版本</span>
          <span class="check-value">v1.0.0</span>
        </div>
        <div class="check-item">
          <span class="check-label">基于</span>
          <span class="check-value">Electron + Vue3 + gallery-dl</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Folder, Sunny, Moon, Monitor } from '@element-plus/icons-vue'
import { useSettingsStore } from '../stores/settings'
import { useThemeStore } from '../stores/theme'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'

const settingsStore = useSettingsStore()
const themeStore = useThemeStore()
const { downloadPath, galleryInstalled, galleryVersion, galleryBundled, galleryChecked } = storeToRefs(settingsStore)
const { isDark } = storeToRefs(themeStore)

const themeMode = ref('light')

onMounted(async () => {
  // 根据当前主题设置初始值
  if (isDark.value) {
    themeMode.value = 'dark'
  } else {
    themeMode.value = 'light'
  }
  
  // 如果还没有检查过，则检查 gallery-dl
  if (!galleryChecked.value) {
    await settingsStore.checkGallery()
  }
})

const selectFolder = async () => {
  try {
    const path = await window.electronAPI.selectFolder()
    if (path) {
      settingsStore.setDownloadPath(path)
      ElMessage.success('下载路径已更新')
    }
  } catch (error) {
    ElMessage.error('选择文件夹失败')
  }
}

const handleThemeChange = (val: string) => {
  if (val === 'dark') {
    themeStore.setTheme(true)
  } else if (val === 'light') {
    themeStore.setTheme(false)
  } else {
    // 跟随系统
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    themeStore.setTheme(prefersDark)
  }
}
</script>

<style scoped>
.settings-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 32px;
}

.settings-section {
  margin-bottom: 40px;
}

.settings-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
}

.setting-label {
  display: block;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.setting-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
}

.setting-control {
  width: 300px;
}

.path-input :deep(.el-input__wrapper) {
  background-color: var(--bg-secondary);
}

.path-input :deep(.el-input__inner) {
  color: var(--text-primary);
}

.check-content {
  display: flex;
  flex-direction: column;
}

.check-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.check-item:last-child {
  border-bottom: none;
}

.check-label {
  color: var(--text-secondary);
  font-size: 14px;
}

.tag-wrapper {
  min-width: 60px;
  text-align: right;
}

.check-value {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
}

.install-hint {
  margin-top: 16px;
  padding: 16px;
  background-color: var(--bg-secondary);
  border-radius: 8px;
  font-size: 13px;
}

.install-hint p {
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.install-hint p:last-child {
  margin-bottom: 0;
}

.install-hint ul {
  color: var(--text-secondary);
  padding-left: 20px;
  margin: 8px 0;
}

.install-hint li {
  margin: 6px 0;
}

.install-hint a {
  color: var(--accent-color);
  text-decoration: none;
}

.install-hint a:hover {
  text-decoration: underline;
}
</style>
