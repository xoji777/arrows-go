const fs = require('fs');
let html = fs.readFileSync('www/index.html', 'utf8');

const COIN_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: text-bottom; margin-right: 4px;"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>`;

const FIRE_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="#f97316" stroke="none" style="vertical-align: text-bottom; margin-right: 2px;"><path d="M12 2c0 0-4.5 3.5-4.5 8.5a4.5 4.5 0 0 0 1.3 3.1C8 14 8 15 8 15s1.5-1 2.5-1c1-1.5 2-3.5 2-3.5s.5 2 1.5 2.5c1 .5 2 1.5 2 3a4 4 0 0 1-1 2.6c2.5-1.5 3-4.5 3-6 0-5-6-10-6-10z"/></svg>`;

const TROPHY_SVG = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`;

const NAV_HOME = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
const NAV_CALENDAR = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const NAV_COLLECTION = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const NAV_SHOP = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`;
const NAV_SETTINGS = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;

const SET_LANG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
const SET_VIB = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12" y2="18"/><line x1="2" y1="6" x2="2" y2="18"/><line x1="22" y1="6" x2="22" y2="18"/></svg>`;
const SET_SND = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
const SET_DARK = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const SET_ACC = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
const SET_ADS = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`;
const SET_RESTORE = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`;
const SET_RATE = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const SET_WRITE = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
const SET_PRIV = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;

const htmlReplacements = [
    { target: '🔥', replace: FIRE_SVG },
    { target: '💰 0', replace: `${COIN_SVG} <span id="shop-coins-val">0</span>` },
    { target: '🏆', replace: TROPHY_SVG },
    { target: '<div class="nav-icon">🏠</div>', replace: `<div class="nav-icon">${NAV_HOME}</div>` },
    { target: '<div class="nav-icon">📅</div>', replace: `<div class="nav-icon">${NAV_CALENDAR}</div>` },
    { target: '<div class="nav-icon">⭐</div>', replace: `<div class="nav-icon">${NAV_COLLECTION}</div>` },
    { target: '<div class="nav-icon">🛒</div>', replace: `<div class="nav-icon">${NAV_SHOP}</div>` },
    { target: '<div class="nav-icon">⚙️</div>', replace: `<div class="nav-icon">${NAV_SETTINGS}</div>` },
    { target: '<span class="settings-icon">🌐</span>', replace: `<span class="settings-icon">${SET_LANG}</span>` },
    { target: '<span class="settings-icon">〰️</span>', replace: `<span class="settings-icon">${SET_VIB}</span>` },
    { target: '<span class="settings-icon">🔊</span>', replace: `<span class="settings-icon">${SET_SND}</span>` },
    { target: '<span class="settings-icon">🌙</span>', replace: `<span class="settings-icon">${SET_DARK}</span>` },
    { target: '<span class="settings-icon">👤</span>', replace: `<span class="settings-icon">${SET_ACC}</span>` },
    { target: '<span class="settings-icon">🚫</span>', replace: `<span class="settings-icon">${SET_ADS}</span>` },
    { target: '<span class="settings-icon">🔄</span>', replace: `<span class="settings-icon">${SET_RESTORE}</span>` },
    { target: '<span class="settings-icon">⭐</span>', replace: `<span class="settings-icon">${SET_RATE}</span>` },
    { target: '<span class="settings-icon">✉️</span>', replace: `<span class="settings-icon">${SET_WRITE}</span>` },
    { target: '<span class="settings-icon">🔒</span>', replace: `<span class="settings-icon">${SET_PRIV}</span>` }
];

htmlReplacements.forEach(r => {
    html = html.replace(r.target, r.replace);
});
fs.writeFileSync('www/index.html', html);

let js = fs.readFileSync('www/app.js', 'utf8');

const LOCKED_SHIELD_SVG = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8c8c9e" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
const UNLOCKED_SHIELD_SVG = `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;

const jsReplacements = [
    { target: '🔒', replace: LOCKED_SHIELD_SVG },
    { target: '🛡️', replace: UNLOCKED_SHIELD_SVG },
    { target: 'shopCoins.innerText = `💰 ${userData.coins}`;', replace: 'shopCoins.innerHTML = `'+COIN_SVG+' ${userData.coins}`;' },
    { target: 'btn.innerText = `💰 ${skin.price}`;', replace: 'btn.innerHTML = `'+COIN_SVG+' ${skin.price}`;' },
    { target: 'setTimeout(() => btn.innerText = `💰 ${skin.price}`, 1000);', replace: 'setTimeout(() => btn.innerHTML = `'+COIN_SVG+' ${skin.price}`, 1000);' },
    { target: '<span>${userData.score} (💰 ${userData.coins})</span>', replace: '<span>${userData.score} ('+COIN_SVG+' ${userData.coins})</span>' },
    { target: 'userData.rewards.push("🏆");', replace: 'userData.rewards.push(`'+TROPHY_SVG+'`);' }
];

jsReplacements.forEach(r => {
    js = js.split(r.target).join(r.replace);
});
fs.writeFileSync('www/app.js', js);
console.log("Updated files");
