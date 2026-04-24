# Gallery-UI

一个基于 Electron + Vue3 的漫画下载工具，使用 gallery-dl 作为下载引擎。

## 功能特性

- 支持多平台漫画网站下载（基于 gallery-dl）
- 简洁美观的现代化界面
- 明暗主题切换
- 自定义下载路径
- 便携版与安装版双版本

## 下载安装

### 便携版
下载 `Gallery-UI-v{version}-win-x64.exe`，双击即可运行，无需安装。

### 安装版
下载 `Gallery-UI-v{version}-win-x64-setup.exe`，运行安装向导，按提示完成安装。

## 使用方法

1. 打开应用，在首页输入漫画链接
2. 点击"开始下载"按钮
3. 等待下载完成

## 依赖说明

便携版已内置 gallery-dl.exe，无需额外配置。

安装版若提示缺少 gallery-dl，请：
1. 访问 [gallery-dl Releases](https://github.com/mikf/gallery-dl/releases) 下载最新版
2. 将 gallery-dl.exe 放置于应用安装目录的 `resources` 文件夹中

## 技术栈

- Electron 34
- Vue 3 + TypeScript
- Element Plus
- Pinia
- Tailwind CSS

---
> ⚡ **只用 Windows，追求更快的启动速度和更小的体积？**  
> 试试 WPF 版本 → **[GalleryUI-WPF](https://github.com/chifanoh/GalleryUI-WPF)**
