const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  close: () => ipcRenderer.send('close-window'),
  setAlwaysOnTop: (flag) => ipcRenderer.send('set-always-on-top', !!flag),
  openExternal: (url) => ipcRenderer.send('open-external', url),
  openSettings: () => ipcRenderer.send('open-settings'),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.send('save-settings', settings),
  onSettingsUpdated: (callback) => {
    ipcRenderer.on('settings-updated', (event, payload) => callback(payload));
  }
});
