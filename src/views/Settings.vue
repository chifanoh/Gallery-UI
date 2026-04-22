<template>
  <div class="settings-container">
    <h1 class="page-title">设置</h1>
    
    <div class="settings-card">
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
      
      <el-divider />
      
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
    </div>
    
    <div class="settings-card">
      <h2 class="section-title">依赖检查</h2>
      <div class="about-content">
        <div class="about-item">
          <span class="about-label">gallery-dl.exe</span>
          <el-tag v-if="galleryInstalled" type="success">已安装</el-tag>
          <el-tag v-else type="danger">未安装</el-tag>
        </div>
        <div v-if="galleryVersion" class="about-item">
          <span class="about-label">版本</span>
          <span class="about-value">{{ galleryVersion }}</span>
        </div>
        <div v-if="galleryInstalled && galleryBundled" class="install-hint">
          <p>使用内置的 gallery-dl 可执行文件</p>
        </div>
        <div v-if="!galleryInstalled" class="install-hint">
          <p>gallery-dl 未找到，请下载 Windows 可执行文件并放置到以下位置之一：</p>
          <ul>
            <li>应用目录的 bin 文件夹中</li>
            <li>添加到系统 PATH 环境变量</li>
          </ul>
          <p>下载地址：<a href="https://github.com/mikf/gallery-dl/releases" target="_blank">GitHub Releases</a></p>
        </div>
      </div>
    </div>
    
    <div class="settings-card">
      <h2 class="section-title">关于</h2>
      <div class="about-content">
        <div class="about-item">
          <span class="about-label">版本</span>
          <span class="about-value">v1.0.0</span>
        </div>
        <div class="about-item">
          <span class="about-label">基于</span>
          <span class="about-value">Electron + Vue3 + gallery-dl</span>
        </div>
      </div>
    </div>
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
const { downloadPath } = storeToRefs(settingsStore)
const { isDark } = storeToRefs(themeStore)

const themeMode = ref('light')
const galleryInstalled = ref(false)
const galleryVersion = ref('')
const galleryBundled = ref(false)

onMounted(async () => {
  // 根据当前主题设置初始值
  if (isDark.value) {
    themeMode.value = 'dark'
  } else {
    themeMode.value = 'light'
  }
  
  // 检查 gallery-dl
  try {
    const result = await window.electronAPI.checkGalleryDl()
    galleryInstalled.value = result.installed
    galleryBundled.value = result.bundled || false
    if (result.version) {
      galleryVersion.value = result.version
    }
  } catch (error) {
    console.error('检查 gallery-dl 失败:', error)
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
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 24px;
}

.settings-card {
  background-color: var(--bg-secondary);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  border: 1px solid var(--border-color);
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
}

.setting-control {
  width: 300px;
}

.path-input :deep(.el-input__wrapper) {
  background-color: var(--bg-primary);
}

.path-input :deep(.el-input__inner) {
  color: var(--text-primary);
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.about-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.about-label {
  color: var(--text-secondary);
  font-size: 14px;
}

.about-value {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
}

.install-hint {
  margin-top: 12px;
  padding: 12px;
  background-color: var(--bg-primary);
  border-radius: 8px;
  font-size: 13px;
}

.install-hint p {
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.install-hint code {
  display: block;
  padding: 8px 12px;
  background-color: var(--bg-secondary);
  border-radius: 4px;
  color: var(--text-primary);
  font-family: 'Courier New', monospace;
}
</style>
