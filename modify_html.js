const fs = require('fs');
let html = fs.readFileSync('www/index.html', 'utf8');

const replacements = [
    { target: '<button id="play-btn">Play</button>', replace: '<button id="play-btn" data-i18n="btn_play">Play</button>' },
    { target: '<h2>My Collection</h2>', replace: '<h2 data-i18n="title_collection">My Collection</h2>' },
    { target: '<h2>Shop</h2>', replace: '<h2 data-i18n="title_shop">Shop</h2>' },
    { target: '<button id="play-challenge-btn" class="big-blue-btn">Play</button>', replace: '<button id="play-challenge-btn" class="big-blue-btn" data-i18n="btn_play">Play</button>' },
    { target: '<span>Home</span>', replace: '<span data-i18n="nav_home">Home</span>' },
    { target: '<span>Challenge</span>', replace: '<span data-i18n="nav_challenge">Challenge</span>' },
    { target: '<span>Collection</span>', replace: '<span data-i18n="nav_collection">Collection</span>' },
    { target: '<span>Shop</span>', replace: '<span data-i18n="nav_shop">Shop</span>' },
    { target: '<span>Settings</span>', replace: '<span data-i18n="nav_settings">Settings</span>' },
    { target: '<span class="settings-label">Language</span>', replace: '<span class="settings-label" data-i18n="set_lang">Language</span>' },
    { target: '<span class="settings-label">Vibrations</span>', replace: '<span class="settings-label" data-i18n="set_vib">Vibrations</span>' },
    { target: '<span class="settings-label">Sounds</span>', replace: '<span class="settings-label" data-i18n="set_sounds">Sounds</span>' },
    { target: '<span class="settings-label">Dark mode</span>', replace: '<span class="settings-label" data-i18n="set_dark">Dark mode</span>' },
    { target: '<span class="settings-label">Account Connection</span>', replace: '<span class="settings-label" data-i18n="set_account">Account Connection</span>' },
    { target: '<span class="settings-label">Remove Ads</span>', replace: '<span class="settings-label" data-i18n="set_ads">Remove Ads</span>' },
    { target: '<span class="settings-label">Restore purchases</span>', replace: '<span class="settings-label" data-i18n="set_restore">Restore purchases</span>' },
    { target: '<span class="settings-label">Rate us</span>', replace: '<span class="settings-label" data-i18n="set_rate">Rate us</span>' },
    { target: '<span class="settings-label">Write us</span>', replace: '<span class="settings-label" data-i18n="set_write">Write us</span>' },
    { target: '<span class="settings-label">Privacy</span>', replace: '<span class="settings-label" data-i18n="set_privacy">Privacy</span>' },
    { target: '<h2>Reward Unlocked!</h2>', replace: '<h2 data-i18n="reward_title">Reward Unlocked!</h2>' },
    { target: '<p>You earned a new skin!</p>', replace: '<p data-i18n="reward_desc">You earned a new skin!</p>' },
    { target: '<button class="action-btn" id="reward-ok-btn">Awesome!</button>', replace: '<button class="action-btn" id="reward-ok-btn" data-i18n="btn_awesome">Awesome!</button>' },
    { target: '<h2>Welcome to Arrows</h2>', replace: '<h2 data-i18n="login_title">Welcome to Arrows</h2>' },
    { target: '<p>Save your progress across devices.</p>', replace: '<p data-i18n="login_desc">Save your progress across devices.</p>' }
];

replacements.forEach(r => {
    html = html.replace(r.target, r.replace);
});
fs.writeFileSync('www/index.html', html);
console.log("Updated index.html");
