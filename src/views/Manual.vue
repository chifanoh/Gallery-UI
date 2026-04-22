<template>
  <div class="manual-container">
    <h1 class="page-title">使用手册</h1>
    
    <div class="manual-card">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <template #title>
            <div class="collapse-title">
              <el-icon class="title-icon"><Download /></el-icon>
              <span>如何下载漫画</span>
            </div>
          </template>
          <div class="collapse-content">
            <ol>
              <li>在首页的输入框中粘贴漫画链接</li>
              <li>点击"开始下载"按钮</li>
              <li>等待下载完成，文件将保存到设置的下载路径</li>
            </ol>
          </div>
        </el-collapse-item>
        
        <el-collapse-item name="2">
          <template #title>
            <div class="collapse-title">
              <el-icon class="title-icon"><Folder /></el-icon>
              <span>设置下载路径</span>
            </div>
          </template>
          <div class="collapse-content">
            <ol>
              <li>点击左侧导航栏的"设置"</li>
              <li>在"下载路径"选项中点击文件夹图标</li>
              <li>选择您想要保存漫画的文件夹</li>
              <li>设置将自动保存</li>
            </ol>
          </div>
        </el-collapse-item>
        
        <el-collapse-item name="3">
          <template #title>
            <div class="collapse-title">
              <el-icon class="title-icon"><Brush /></el-icon>
              <span>切换主题</span>
            </div>
          </template>
          <div class="collapse-content">
            <p>您可以通过以下方式切换主题：</p>
            <ul>
              <li>点击左侧导航栏底部的主题切换按钮</li>
              <li>或在设置页面选择"浅色"、"深色"或"跟随系统"</li>
            </ul>
          </div>
        </el-collapse-item>
        
        <el-collapse-item name="4">
          <template #title>
            <div class="collapse-title">
              <el-icon class="title-icon"><Link /></el-icon>
              <span>示例站点（包括但不限于）</span>
            </div>
          </template>
          <div class="collapse-content">
            <p>支持以下漫画网站：</p>
            <ul>
              <li>nhentai.net</li>
              <li>wnacg.com</li>
            </ul>
          </div>
        </el-collapse-item>
        
        <el-collapse-item name="5">
          <template #title>
            <div class="collapse-title">
              <el-icon class="title-icon"><QuestionFilled /></el-icon>
              <span>常见问题</span>
            </div>
          </template>
          <div class="collapse-content">
            <div class="faq-item">
              <h4>Q: 下载失败怎么办？</h4>
              <p>A: 请检查网络连接，确认链接有效，或尝试更换下载路径（频繁请求可能会被对应网站封禁）。</p>
            </div>
            <div class="faq-item">
              <h4>Q: 支持哪些格式的漫画？</h4>
              <p>A: 目前支持常见的图片格式（JPG、PNG、WEBP）的批量下载。</p>
            </div>
            <div class="faq-item">
              <h4>Q: 下载的漫画在哪里？</h4>
              <p>A: 默认保存在程序目录下的 downloads 文件夹中，可在设置中更改。</p>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Download, Folder, Brush, Link, QuestionFilled } from '@element-plus/icons-vue'

const activeNames = ref(['1'])
</script>

<style scoped>
.manual-container {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 24px;
}

.manual-card {
  background-color: var(--bg-secondary);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--border-color);
}

.collapse-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.title-icon {
  color: var(--accent-color);
}

.collapse-content {
  color: var(--text-secondary);
  line-height: 1.8;
  padding: 8px 0;
}

.collapse-content ol,
.collapse-content ul {
  padding-left: 20px;
  margin: 12px 0;
}

.collapse-content li {
  margin: 8px 0;
}

.faq-item {
  margin-bottom: 20px;
}

.faq-item:last-child {
  margin-bottom: 0;
}

.faq-item h4 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 8px;
}

.faq-item p {
  margin: 0;
}

:deep(.el-collapse) {
  border: none;
}

:deep(.el-collapse-item__header) {
  background-color: transparent;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 16px 0;
}

:deep(.el-collapse-item__wrap) {
  background-color: transparent;
  border-bottom: 1px solid var(--border-color);
}

:deep(.el-collapse-item__content) {
  color: var(--text-secondary);
  padding-bottom: 16px;
}
</style>
