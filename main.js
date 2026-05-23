const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 640,
    height: 360,
    resizable: false,
    frame: false,
    transparent: true,
    hasShadow: true,
    alwaysOnTop: true,
    focusable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, 'gui', 'index.html'));
  win.setAlwaysOnTop(true, 'screen-saver');
  //win.removeMenu();

  win.on('closed', () => {
    win = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.on('close-window', () => {
  if (win) win.close();
});

ipcMain.on('set-always-on-top', (event, flag) => {
  if (win) win.setAlwaysOnTop(!!flag);
});

ipcMain.on('open-external', (event, url) => {
  if (typeof url === 'string' && url.trim()) {
    shell.openExternal(url);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
