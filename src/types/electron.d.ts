export interface ElectronAPI {
  checkGalleryDl: () => Promise<{ installed: boolean; version?: string; bundled?: boolean; error?: string }>
  downloadGallery: (url: string, downloadPath: string) => Promise<{ success: boolean; message: string; output?: string }>
  selectFolder: () => Promise<string | null>
  openExternal: (url: string) => Promise<void>
  windowMinimize: () => void
  windowMaximize: () => void
  windowClose: () => void
  windowIsMaximized: () => Promise<boolean>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
