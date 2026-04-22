<template>
  <aside class="sidebar">
    <div class="logo">
      <el-icon size="28" color="var(--accent-color)"><Collection /></el-icon>
    </div>
    
    <nav class="nav-menu">
      <el-tooltip content="下载漫画" placement="right">
        <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
          <el-icon size="22"><Download /></el-icon>
        </router-link>
      </el-tooltip>
    </nav>
    
    <div class="bottom-menu">
      <el-tooltip content="设置" placement="right">
        <router-link to="/settings" class="nav-item" :class="{ active: $route.path === '/settings' }">
          <el-icon size="22"><Setting /></el-icon>
        </router-link>
      </el-tooltip>
      
      <el-tooltip content="使用手册" placement="right">
        <router-link to="/manual" class="nav-item" :class="{ active: $route.path === '/manual' }">
          <el-icon size="22"><Document /></el-icon>
        </router-link>
      </el-tooltip>
      
      <el-tooltip :content="isDark ? '切换浅色模式' : '切换深色模式'" placement="right">
        <el-button 
          circle 
          :icon="isDark ? Sunny : Moon" 
          @click="toggleTheme"
          class="theme-btn"
        />
      </el-tooltip>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Collection, Download, Setting, Document, Sunny, Moon } from '@element-plus/icons-vue'
import { useThemeStore } from '../stores/theme'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)
const { toggleTheme } = themeStore
</script>

<style scoped>
.sidebar {
  width: 64px;
  height: 100%;
  background-color: var(--sidebar-bg);
  color: var(--sidebar-text);
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 16px;
  width: 100%;
}

.nav-menu {
  flex: 1;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.bottom-menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.3s;
}

.nav-item:hover {
  color: #ffffff;
}

.nav-item.active {
  color: #ffffff;
}

.theme-btn {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border: none !important;
  color: #ffffff !important;
  width: 40px;
  height: 40px;
}

.theme-btn:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
}
</style>
