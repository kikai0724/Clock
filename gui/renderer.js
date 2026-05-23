function pad(n){return String(n).padStart(2,'0')}

function update(){
  const now = new Date();
  const t = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  document.getElementById('time').textContent = t;
  document.getElementById('date').textContent = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], {hour12:false});
}

update();
setInterval(update,1000);

document.getElementById('author').addEventListener('click', () => {
  if (window.electron && window.electron.openExternal) {
    window.electron.openExternal('https://guns.lol/kikai');
  }
});
