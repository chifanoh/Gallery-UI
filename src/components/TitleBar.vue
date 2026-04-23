<template>
  <div class="title-bar">
    <div class="title-bar-drag"></div>
    <div class="window-controls">
      <button class="window-btn minimize" @click="minimize" title="最小化">
        <el-icon><Minus /></el-icon>
      </button>
      <button class="window-btn maximize" @click="maximize" title="最大化/还原">
        <el-icon>
          <FullScreen v-if="!isMaximized" />
          <CopyDocument v-else />
        </el-icon>
      </button>
      <button class="window-btn close" @click="close" title="关闭">
        <el-icon><Close /></el-icon>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Minus, FullScreen, CopyDocument, Close } from '@element-plus/icons-vue'

const isMaximized = ref(false)

const minimize = () => {
  window.electronAPI?.windowMinimize()
}

const maximize = async () => {
  await window.electronAPI?.windowMaximize()
  checkMaximized()
}

const close = () => {
  window.electronAPI?.windowClose()
}

const checkMaximized = async () => {
  isMaximized.value = await window.electronAPI?.windowIsMaximized() || false
}

onMounted(() => {
  checkMaximized()
  window.addEventListener('resize', checkMaximized)
})
</script>

<style scoped>
.title-bar {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--bg-primary);
  -webkit-app-region: drag;
  user-select: none;
}

.title-bar-drag {
  flex: 1;
  height: 100%;
}

.window-controls {
  display: flex;
  height: 100%;
  -webkit-app-region: no-drag;
}

.window-btn {
  width: 48px;
  height: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.window-btn:hover {
  background-color: var(--bg-hover);
  color: var(--text-primary);
}

.window-btn.close:hover {
  background-color: #e81123;
  color: white;
}

.window-btn .el-icon {
  font-size: 14px;
}
</style>
