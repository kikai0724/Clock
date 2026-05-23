function $(selector) {
  return document.querySelector(selector);
}

const alwaysOnTop = $('#alwaysOnTop');
const showSeconds = $('#showSeconds');
const showDate = $('#showDate');
const showAuthor = $('#showAuthor');
const use24Hour = $('#use24Hour');
const clockSize = $('#clockSize');
const blurIntensity = $('#blurIntensity');
const windowOpacity = $('#windowOpacity');
const theme = $('#theme');
const saveButton = $('#save');
const closeButton = $('#close');

function updateForm(settings) {
  alwaysOnTop.checked = !!settings.alwaysOnTop;
  showSeconds.checked = !!settings.showSeconds;
  showDate.checked = !!settings.showDate;
  showAuthor.checked = settings.showAuthor !== false;
  use24Hour.checked = settings.use24Hour !== false;
  clockSize.value = settings.clockSize || 'normal';
  blurIntensity.value = settings.blurIntensity || 'medium';
  windowOpacity.value = settings.windowOpacity != null ? settings.windowOpacity : '0.95';
  theme.value = settings.theme || 'dark';
}

async function init() {
  const settings = await window.electron.getSettings();
  updateForm(settings);
  document.body.classList.add('loaded');
}

saveButton.addEventListener('click', () => {
  const newSettings = {
    alwaysOnTop: alwaysOnTop.checked,
    showSeconds: showSeconds.checked,
    showDate: showDate.checked,
    showAuthor: showAuthor.checked,
    use24Hour: use24Hour.checked,
    clockSize: clockSize.value,
    blurIntensity: blurIntensity.value,
    windowOpacity: parseFloat(windowOpacity.value),
    theme: theme.value
  };
  window.electron.saveSettings(newSettings);
  window.close();
});

closeButton.addEventListener('click', () => {
  window.close();
});

window.electron.onSettingsUpdated((settings) => {
  updateForm(settings);
});

init();
