const API_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEBAPP_URL";

const tbody = document.getElementById('timecard-body');
const statusText = document.getElementById('status-text');
const statusDot = document.getElementById('status-dot');
const lastUpdate = document.getElementById('last-update');

function setStatus(type, text) {
  statusText.textContent = text;

  statusDot.classList.remove('ok', 'bad');
  if (type === 'ok') statusDot.classList.add('ok');
  if (type === 'bad') statusDot.classList.add('bad');
}

function setLastUpdate() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  lastUpdate.textContent = `Last update: ${hh}:${mm}:${ss}`;
}

async function fetchAndRender() {
  try {
    const response = await fetch(API_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("HTTP " + response.status);

    const result = await response.json();
    const data = result.data;

    tbody.innerHTML = '';

    if (!data || !Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = `
        <tr class="state-row">
          <td colspan="5">No records to show.</td>
        </tr>
      `;
      setStatus('ok', 'Connected');
      setLastUpdate();
      return;
    }

    for (const item of data) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.Name ?? ''}</td>
        <td>${item.UID ?? ''}</td>
        <td>${item.Date ?? ''}</td>
        <td>${item.Time_In ?? ''}</td>
        <td>${item.Time_Out ?? ''}</td>
      `;
      tbody.appendChild(row);
    }

    setStatus('ok', 'Connected');
    setLastUpdate();

  } catch (err) {
    setStatus('bad', 'Failed to fetch data');
    console.log(err);
  }
}

// run once immediately
fetchAndRender();

// repeat every 500ms (same behavior as before)
setInterval(fetchAndRender, 500);
