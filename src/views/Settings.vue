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
      <h2 class="section-title">关于</h2>
      <div class="about-content">
        <div class="about-item">
          <span class="about-label">版本</span>
          <span class="about-value">v1.0.0</span>
        </div>
        <div class="about-item">
          <span class="about-label">基于</span>
          <span class="about-value">Electron + Vue3</span>
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

const settingsStore = useSettingsStore()
const themeStore = useThemeStore()
const { downloadPath } = storeToRefs(settingsStore)
const { isDark } = storeToRefs(themeStore)

const themeMode = ref('light')

onMounted(() => {
  // 根据当前主题设置初始值
  if (isDark.value) {
    themeMode.value = 'dark'
  } else {
    themeMode.value = 'light'
  }
})

const selectFolder = () => {
  // 由于是在 Electron 中，这里使用模拟路径
  // 实际项目中可以通过 IPC 调用主进程选择文件夹
  const mockPath = 'C:\\Users\\Downloads\\Comics'
  settingsStore.setDownloadPath(mockPath)
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
</style>
