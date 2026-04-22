export interface ElectronAPI {
  checkGalleryDl: () => Promise<{ installed: boolean; version?: string; bundled?: boolean; error?: string }>
  downloadGallery: (url: string, downloadPath: string) => Promise<{ success: boolean; message: string; output?: string }>
  selectFolder: () => Promise<string | null>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
