const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let win = null;
let settingsWin = null;
const settingsFile = path.join(app.getPath('userData'), 'settings.json');
let settings = {
  alwaysOnTop: true,
  showSeconds: true,
  showDate: true,
  showAuthor: true,
  use24Hour: true,
  windowOpacity: 0.95,
  clockSize: 'normal',
  blurIntensity: 'medium',
  theme: 'dark'
};

function loadSettings() {
  try {
    const data = fs.readFileSync(settingsFile, 'utf-8');
    const parsed = JSON.parse(data);
    settings = { ...settings, ...parsed };
  } catch (error) {
    saveSettings();
  }
}

function saveSettings() {
  try {
    fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

function applyWindowSettings() {
  if (win) {
    win.setAlwaysOnTop(!!settings.alwaysOnTop, 'screen-saver');
  }
}

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
  //win.removeMenu();

  win.on('closed', () => {
    win = null;
  });
}

function createSettingsWindow() {
  if (settingsWin) {
    settingsWin.focus();
    return;
  }

  settingsWin = new BrowserWindow({
    width: 380,
    height: 420,
    resizable: false,
    frame: false,
    transparent: true,
    hasShadow: true,
    alwaysOnTop: false,
    focusable: true,
    parent: win,
    modal: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  settingsWin.loadFile(path.join(__dirname, 'gui', 'settings.html'));

  settingsWin.on('closed', () => {
    settingsWin = null;
  });
}

app.whenReady().then(() => {
  loadSettings();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.on('close-window', () => {
  if (win) win.close();
});

ipcMain.on('open-settings', () => {
  createSettingsWindow();
});

ipcMain.handle('get-settings', () => {
  return settings;
});

ipcMain.on('save-settings', (event, newSettings) => {
  settings = { ...settings, ...newSettings };
  saveSettings();
  applyWindowSettings();
  if (win) win.webContents.send('settings-updated', settings);
  if (settingsWin) settingsWin.webContents.send('settings-updated', settings);
});

ipcMain.on('set-always-on-top', (event, flag) => {
  settings.alwaysOnTop = !!flag;
  saveSettings();
  if (win) win.setAlwaysOnTop(settings.alwaysOnTop, 'screen-saver');
  if (settingsWin) settingsWin.webContents.send('settings-updated', settings);
});

ipcMain.on('open-external', (event, url) => {
  if (typeof url === 'string' && url.trim()) {
    shell.openExternal(url);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
