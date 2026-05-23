function pad(n){return String(n).padStart(2,'0')}

let currentSettings = {
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

function update() {
  const now = new Date();
  let hours = now.getHours();
  let amPm = '';

  if (!currentSettings.use24Hour) {
    amPm = hours >= 12 ? ' PM' : ' AM';
    hours = hours % 12 || 12;
  }

  const timeParts = [pad(hours), pad(now.getMinutes())];
  if (currentSettings.showSeconds) timeParts.push(pad(now.getSeconds()));

  document.getElementById('time').textContent = timeParts.join(':') + amPm;
  document.getElementById('date').textContent = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], {hour12:false});
}

function applySettings(settings) {
  currentSettings = { ...currentSettings, ...settings };

  document.getElementById('date').style.display = currentSettings.showDate ? 'block' : 'none';
  document.getElementById('author').style.display = currentSettings.showAuthor ? 'block' : 'none';
  document.documentElement.dataset.theme = currentSettings.theme;
  document.documentElement.style.setProperty('--card-opacity', currentSettings.windowOpacity || 0.95);
  document.documentElement.style.setProperty('--card-blur', currentSettings.blurIntensity === 'high' ? '18px' : currentSettings.blurIntensity === 'low' ? '4px' : '8px');
  document.documentElement.style.setProperty('--time-size', currentSettings.clockSize === 'large' ? '92px' : currentSettings.clockSize === 'small' ? '56px' : '72px');
}

function init() {
  window.electron.getSettings().then((settings) => {
    applySettings(settings);
    update();
  });

  setInterval(update, 1000);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Insert') {
      window.electron.openSettings();
    }
  });

  document.getElementById('author').addEventListener('click', () => {
    if (window.electron && window.electron.openExternal) {
      window.electron.openExternal('https://guns.lol/kikai');
    }
  });

  window.electron.onSettingsUpdated((settings) => {
    applySettings(settings);
  });
}

init();
