<template>
  <div class="app-wrapper">
    <Sidebar />
    <div class="content-area">
      <TitleBar />
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import TitleBar from './components/TitleBar.vue'
import { useThemeStore } from './stores/theme'
import { useSettingsStore } from './stores/settings'

const themeStore = useThemeStore()
const settingsStore = useSettingsStore()

onMounted(async () => {
  themeStore.loadTheme()
  settingsStore.loadSettings()
  // 预检查 gallery-dl，避免进入设置页面时等待
  settingsStore.checkGallery()
})
</script>

<style scoped>
.app-wrapper {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.content-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  background-color: var(--bg-primary);
}

.main-content {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
</style>
