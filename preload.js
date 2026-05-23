const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  close: () => ipcRenderer.send('close-window'),
  setAlwaysOnTop: (flag) => ipcRenderer.send('set-always-on-top', !!flag),
  openExternal: (url) => ipcRenderer.send('open-external', url)
});
