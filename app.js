const canvas = document.getElementById('gameCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const gameScreen = document.getElementById('game-screen');
const mainMenu = document.getElementById('main-menu');
const loginModal = document.getElementById('login-modal');
const overlay = document.getElementById('overlay');
const collectionScreen = document.getElementById('collection-screen');
const shopScreen = document.getElementById('shop-screen');
const challengeScreen = document.getElementById('challenge-screen');
const bottomNav = document.getElementById('bottom-nav');
const navHome = document.getElementById('nav-home');
const navCollection = document.getElementById('nav-collection');
const navShop = document.getElementById('nav-shop');
const navChallenge = document.getElementById('nav-challenge');
const collectionGrid = document.getElementById('collection-grid');
const shopGrid = document.getElementById('shop-grid');
const shopCoins = document.getElementById('shop-coins');
const playChallengeBtn = document.getElementById('play-challenge-btn');
const challengeStatus = document.getElementById('challenge-status');
const undoBtn = document.getElementById('undo-btn');
const rewardModal = document.getElementById('reward-modal');
const rewardOkBtn = document.getElementById('reward-ok-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const settingsCloseBtn = document.getElementById('settings-close-btn');

// New Game UI Elements
const restartBtn = document.getElementById('restart-btn');
const hintBtn = document.getElementById('hint-btn');
const hintBadge = document.getElementById('hint-badge');
const gameCoinText = document.getElementById('game-coin-text');
const gameBuyCoins = document.getElementById('game-buy-coins');

// UI Elements
const menuLevelText = document.getElementById('menu-level-text');
const menuDiffText = document.getElementById('menu-diff-text');
const gameLevelText = document.getElementById('game-level-text');

// --- SETTINGS LOGIC ---
let settingsData = {
    vibrations: true,
    sounds: true,
    darkMode: true,
    language: 'English'
};

// Game State (must be declared before applyDarkMode runs)
const MAX_LIVES = 5;
let lives = MAX_LIVES;
let pieces = [];
let animatingPieces = [];
let isGameRunning = false;
let moveHistory = [];
let isDailyChallengeMode = false;
let seededRandom = null;
let freeHintsLeft = 3;
let initialPiecesStr = "[]";

const translations = {
    'English': {
        'menu_play': 'Play',
        'menu_level': 'Level',
        'menu_easy': 'Easy',
        'menu_medium': 'Medium',
        'menu_hard': 'Hard',
        'menu_super_hard': 'Super Hard',
        'menu_extra_hard': 'Extra Hard',
        'menu_nightmare': 'Nightmare',
        'challenge_completed': 'Completed',
        'btn_play': 'Play',
        'title_collection': 'My Collection',
        'title_shop': 'Shop',
        'title_skins': 'Skins',
        'btn_buy': 'Buy',
        'btn_equip': 'Equip',
        'btn_equipped': 'Equipped',
        'title_challenge': 'Daily Challenge',
        'challenge_desc': 'Complete 30 levels this month to earn a special reward!',
        'btn_play_challenge': 'Play Challenge',
        'title_settings': 'Settings',
        'set_lang': 'Language',
        'set_vib': 'Vibrations',
        'set_sounds': 'Sounds',
        'set_dark': 'Dark mode',
        'set_account': 'Account Connection',
        'set_ads': 'Remove Ads',
        'set_restore': 'Restore purchases',
        'set_rate': 'Rate us',
        'set_write': 'Write us',
        'set_privacy': 'Privacy',
        'reward_title': 'Reward Unlocked!',
        'reward_desc': 'You earned a new skin!',
        'btn_awesome': 'Awesome!',
        'nav_home': 'Home',
        'nav_challenge': 'Challenge',
        'nav_collection': 'Collection',
        'nav_shop': 'Shop',
        'nav_settings': 'Settings',
        'leagues': 'Leagues',
        'unlocks_at': 'Unlocks at Level',
        'login_title': 'Welcome to Arrows',
        'login_desc': 'Save your progress across devices.',
        'btn_login': 'Sign in with Google',
        'btn_sign_out': 'Sign out',
        'btn_guest': 'Play as Guest',
        'guest_name': 'Guest',
        'profile_change_photo': 'Change profile photo',
        'profile_remove_photo': 'Remove photo',
        'profile_crop_photo': 'Adjust photo',
        'profile_crop_hint': 'Drag to move · slider to zoom',
        'profile_change_name': 'Change name',
        'btn_save': 'Save',
        'btn_cancel': 'Cancel',
        'path_hint_show': 'Show paths',
        'path_hint_hide': 'Hide paths',
        'daily_challenge': 'DAILY CHALLENGE',
        'not_enough': 'Not enough!',
        'mode_special': 'Special Mode',
        'title_traps': 'Traps & Locks',
        'weekly_streak': 'Weekly Streak'
    },
    'Russian': {
        'menu_play': 'Играть',
        'menu_level': 'Уровень',
        'menu_easy': 'Легко',
        'menu_medium': 'Средне',
        'menu_hard': 'Сложно',
        'menu_super_hard': 'Супер сложно',
        'menu_extra_hard': 'Экстра сложно',
        'menu_nightmare': 'Кошмар',
        'challenge_completed': 'Выполнено',
        'btn_play': 'Играть',
        'title_collection': 'Моя Коллекция',
        'title_shop': 'Магазин',
        'title_skins': 'Скины',
        'btn_buy': 'Купить',
        'btn_equip': 'Надеть',
        'btn_equipped': 'Надето',
        'title_challenge': 'Ежедневное',
        'challenge_desc': 'Пройдите 30 уровней в этом месяце для получения награды!',
        'btn_play_challenge': 'Играть',
        'title_settings': 'Настройки',
        'set_lang': 'Язык',
        'set_vib': 'Вибрация',
        'set_sounds': 'Звуки',
        'set_dark': 'Темный режим',
        'set_account': 'Привязка аккаунта',
        'set_ads': 'Удалить рекламу',
        'set_restore': 'Восстановить покупки',
        'set_rate': 'Оцените нас',
        'set_write': 'Напишите нам',
        'set_privacy': 'Конфиденциальность',
        'reward_title': 'Награда!',
        'reward_desc': 'Вы получили новый скин!',
        'btn_awesome': 'Круто!',
        'nav_home': 'Главная',
        'nav_challenge': 'Задания',
        'nav_collection': 'Скины',
        'nav_shop': 'Магазин',
        'nav_settings': 'Настройки',
        'leagues': 'Лиги',
        'unlocks_at': 'Откроется на уровне',
        'login_title': 'Добро пожаловать',
        'login_desc': 'Сохраните ваш прогресс.',
        'btn_login': 'Войти через Google',
        'btn_sign_out': 'Выйти',
        'btn_guest': 'Играть как гость',
        'guest_name': 'Гость',
        'profile_change_name': 'Изменить имя',
        'profile_change_photo': 'Изменить фото',
        'profile_remove_photo': 'Удалить фото',
        'profile_crop_photo': 'Настроить фото',
        'profile_crop_hint': 'Перетащите · ползунок — масштаб',
        'btn_save': 'Сохранить',
        'btn_cancel': 'Отмена',
        'path_hint_show': 'Показать пути',
        'path_hint_hide': 'Скрыть пути',
        'daily_challenge': 'ЕЖЕДНЕВНОЕ ИСПЫТАНИЕ',
        'not_enough': 'Не хватает!',
        'mode_special': 'Особый режим',
        'title_traps': 'Ловушки и замки',
        'weekly_streak': 'Недельная серия'
    },
    'Uzbek': {
        'menu_play': 'O\'ynash',
        'menu_level': 'Daraja',
        'menu_easy': 'Oson',
        'menu_medium': 'O\'rtacha',
        'menu_hard': 'Qiyin',
        'menu_super_hard': 'Super qiyin',
        'menu_extra_hard': 'Ekstra qiyin',
        'menu_nightmare': 'Dahshatli',
        'challenge_completed': 'Bajarildi',
        'btn_play': 'O\'ynash',
        'title_collection': 'Mening Kolleksiyam',
        'title_shop': 'Do\'kon',
        'title_skins': 'Skinlar',
        'btn_buy': 'Sotib olish',
        'btn_equip': 'Tanlash',
        'btn_equipped': 'Tanlangan',
        'title_challenge': 'Kunlik Vazifa',
        'challenge_desc': 'Maxsus sovrin yutib olish uchun shu oy 30 ta darajadan o\'ting!',
        'btn_play_challenge': 'O\'ynash',
        'title_settings': 'Sozlamalar',
        'set_lang': 'Til',
        'set_vib': 'Vibratsiya',
        'set_sounds': 'Ovozlar',
        'set_dark': 'Tungi rejim',
        'set_account': 'Akkauntni ulash',
        'set_ads': 'Reklamani o\'chirish',
        'set_restore': 'Xaridlarni tiklash',
        'set_rate': 'Baho berish',
        'set_write': 'Bizga yozish',
        'set_privacy': 'Maxfiylik',
        'reward_title': 'Sovrin!',
        'reward_desc': 'Siz yangi skin yutib oldingiz!',
        'btn_awesome': 'Zo\'r!',
        'nav_home': 'Asosiy',
        'nav_challenge': 'Vazifa',
        'nav_collection': 'Kolleksiya',
        'nav_shop': 'Do\'kon',
        'nav_settings': 'Sozlamalar',
        'leagues': 'Ligalar',
        'unlocks_at': 'Ochildi: Daraja',
        'login_title': 'Xush kelibsiz',
        'login_desc': 'Boshqa qurilmalarda ham o\'ynash uchun kiring.',
        'btn_login': 'Google orqali kirish',
        'btn_sign_out': 'Chiqish',
        'btn_guest': 'Mehmon sifatida o\'ynash',
        'guest_name': 'Mehmon',
        'profile_change_photo': 'Profil rasmini o\'zgartirish',
        'profile_remove_photo': 'Rasmni olib tashlash',
        'profile_crop_photo': 'Rasmni moslash',
        'profile_crop_hint': 'Surish · slayder — kattalashtirish',
        'profile_change_name': 'Ismni o\'zgartirish',
        'btn_save': 'Saqlash',
        'btn_cancel': 'Bekor qilish',
        'path_hint_show': 'Yo\'llarni ko\'rsatish',
        'path_hint_hide': 'Yo\'llarni yashirish',
        'daily_challenge': 'KUNLIK VAZIFA',
        'not_enough': 'Yetarli emas!',
        'mode_special': 'Maxsus Rejim',
        'title_traps': 'Qopqon va Qulflar',
        'weekly_streak': 'Haftalik Seriya'
    }
};

const LANGUAGES = ['English', 'Russian', 'Uzbek', 'Spanish', 'French', 'German', 'Turkish', 'Portuguese', 'Arabic', 'Chinese', 'Hindi', 'Korean', 'Japanese', 'Italian'];

function extendLang(name, overrides) {
    translations[name] = { ...translations.English, ...overrides };
}

extendLang('Spanish', {
    menu_play: 'Jugar', menu_level: 'Nivel', menu_easy: 'Fácil', menu_hard: 'Difícil',
    menu_super_hard: 'Super difícil', menu_extra_hard: 'Extra difícil', menu_nightmare: 'Pesadilla',
    btn_play: 'Jugar', title_collection: 'Mi colección', title_shop: 'Tienda', title_challenge: 'Desafío diario',
    btn_play_challenge: 'Jugar', title_settings: 'Ajustes', set_lang: 'Idioma', set_account: 'Cuenta Google',
    btn_login: 'Iniciar con Google', daily_challenge: 'DESAFÍO DIARIO', challenge_completed: 'Completado',
    nav_home: 'Inicio', nav_challenge: 'Reto', nav_collection: 'Colección', nav_shop: 'Tienda', nav_settings: 'Ajustes'
});
extendLang('French', {
    menu_play: 'Jouer', menu_level: 'Niveau', menu_easy: 'Facile', menu_hard: 'Difficile',
    menu_super_hard: 'Super difficile', menu_extra_hard: 'Extra difficile', menu_nightmare: 'Cauchemar',
    btn_play: 'Jouer', title_challenge: 'Défi quotidien', btn_play_challenge: 'Jouer', set_lang: 'Langue',
    set_account: 'Compte Google', btn_login: 'Connexion Google', daily_challenge: 'DÉFI QUOTIDIEN',
    challenge_completed: 'Terminé', nav_home: 'Accueil', nav_challenge: 'Défi', nav_settings: 'Réglages'
});
extendLang('German', {
    menu_play: 'Spielen', menu_level: 'Level', menu_easy: 'Leicht', menu_hard: 'Schwer',
    menu_super_hard: 'Super schwer', menu_extra_hard: 'Extra schwer', menu_nightmare: 'Albtraum',
    btn_play: 'Spielen', title_challenge: 'Tägliche Herausforderung', btn_play_challenge: 'Spielen',
    set_lang: 'Sprache', set_account: 'Google-Konto', btn_login: 'Mit Google anmelden',
    daily_challenge: 'TÄGLICHE HERAUSFORDERUNG', challenge_completed: 'Erledigt', nav_home: 'Start'
});
extendLang('Turkish', {
    menu_play: 'Oyna', menu_level: 'Seviye', menu_easy: 'Kolay', menu_hard: 'Zor',
    menu_super_hard: 'Süper zor', menu_extra_hard: 'Ekstra zor', menu_nightmare: 'Kabus',
    btn_play: 'Oyna', title_challenge: 'Günlük görev', btn_play_challenge: 'Oyna',
    set_lang: 'Dil', set_account: 'Google hesabı', btn_login: 'Google ile giriş',
    daily_challenge: 'GÜNLÜK GÖREV', challenge_completed: 'Tamamlandı', nav_home: 'Ana sayfa'
});
extendLang('Portuguese', {
    menu_play: 'Jogar', menu_level: 'Nível', menu_easy: 'Fácil', menu_hard: 'Difícil',
    menu_super_hard: 'Super difícil', menu_extra_hard: 'Extra difícil', menu_nightmare: 'Pesadelo',
    btn_play: 'Jogar', btn_login: 'Entrar com Google', daily_challenge: 'DESAFIO DIÁRIO',
    challenge_completed: 'Concluído', set_lang: 'Idioma', set_account: 'Conta Google'
});
extendLang('Arabic', {
    menu_play: 'العب', menu_level: 'المستوى', menu_easy: 'سهل', menu_hard: 'صعب',
    menu_super_hard: 'صعب جداً', menu_extra_hard: 'صعب للغاية', menu_nightmare: 'كابوس',
    btn_play: 'العب', btn_login: 'تسجيل Google', daily_challenge: 'التحدي اليومي',
    challenge_completed: 'مكتمل', set_lang: 'اللغة', set_account: 'حساب Google',
    set_vib: 'اهتزاز', set_sounds: 'أصوات', set_dark: 'الوضع الداكن', set_ads: 'إزالة الإعلانات', set_restore: 'استعادة المشتريات',
    btn_sign_out: 'خروج', mode_special: 'وضع خاص', title_traps: 'فخاخ وأقفال', weekly_streak: 'خط أسبوعي'
});
extendLang('Chinese', {
    menu_play: '开始', menu_level: '关卡', menu_easy: '简单', menu_hard: '困难',
    menu_super_hard: '超级难', menu_extra_hard: '极难', menu_nightmare: '噩梦',
    btn_play: '开始', btn_login: 'Google 登录', daily_challenge: '每日挑战',
    challenge_completed: '已完成', set_lang: '语言', set_account: 'Google 账户'
});
extendLang('Hindi', {
    menu_play: 'खेलें', menu_level: 'स्तर', menu_easy: 'आसान', menu_hard: 'कठिन',
    menu_super_hard: 'सुपर हार्ड', menu_extra_hard: 'एक्स्ट्रा हार्ड', menu_nightmare: 'नाइटमेयर',
    btn_play: 'खेलें', btn_login: 'Google से साइन इन', daily_challenge: 'दैनिक चुनौती',
    challenge_completed: 'पूर्ण', set_lang: 'भाषा', set_account: 'Google खाता'
});
extendLang('Korean', {
    menu_play: '플레이', menu_level: '레벨', menu_easy: '쉬움', menu_hard: '어려움',
    menu_super_hard: '슈퍼 하드', menu_extra_hard: '엑스트라 하드', menu_nightmare: '나이트메어',
    btn_play: '플레이', btn_login: 'Google 로그인', daily_challenge: '일일 챌린지',
    challenge_completed: '완료', set_lang: '언어', set_account: 'Google 계정'
});
extendLang('Japanese', {
    menu_play: 'プレイ', menu_level: 'レベル', menu_easy: 'イージー', menu_hard: 'ハード',
    menu_super_hard: 'スーパーハード', menu_extra_hard: 'エクストラハード', menu_nightmare: 'ナイトメア',
    btn_play: 'プレイ', btn_login: 'Googleでログイン', daily_challenge: 'デイリーチャレンジ',
    challenge_completed: '完了', set_lang: '言語', set_account: 'Googleアカウント'
});
extendLang('Italian', {
    menu_play: 'Gioca', menu_level: 'Livello', menu_easy: 'Facile', menu_hard: 'Difficile',
    menu_super_hard: 'Super difficile', menu_extra_hard: 'Extra difficile', menu_nightmare: 'Incubo',
    btn_play: 'Gioca', btn_login: 'Accedi con Google', daily_challenge: 'SFIDA GIORNALIERA',
    challenge_completed: 'Completato', set_lang: 'Lingua', set_account: 'Account Google'
});

function t(key) {
    const lang = translations[settingsData.language];
    if (lang && lang[key]) return lang[key];
    return translations.English[key] || key;
}

function applyLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.innerText = t(el.getAttribute('data-i18n'));
    });
    if (typeof updateMenuUI === 'function') updateMenuUI();
    if (typeof updateChallengeUI === 'function' && document.getElementById('challenge-screen') && !document.getElementById('challenge-screen').classList.contains('hidden')) updateChallengeUI();
    if (typeof renderShop === 'function' && document.getElementById('shop-screen') && !document.getElementById('shop-screen').classList.contains('hidden')) renderShop();
    
    if (typeof gameLevelText !== 'undefined' && isGameRunning && window.currentDifficulty) {
        const diffLabel = t(window.currentDifficulty.key);
        if (isDailyChallengeMode) {
            gameLevelText.innerHTML = `${t('daily_challenge')} <span style="font-size: 0.65em; color: ${window.currentDifficulty.color};">${diffLabel}</span>`;
        } else {
            gameLevelText.innerHTML = `${t('menu_level')} ${userData.level} <span style="font-size: 0.7em; color: ${window.currentDifficulty.color};">${diffLabel}</span>`;
        }
    }
    if (typeof updatePathHintButton === 'function') updatePathHintButton();
}

const storedSettings = localStorage.getItem('arrowsSettings');
if (storedSettings) settingsData = JSON.parse(storedSettings);

const soundsToggle = document.getElementById('sounds-toggle');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const vibrationsToggle = document.getElementById('vibrations-toggle');
const languageValue = document.getElementById('language-value');

if (soundsToggle) {
    soundsToggle.checked = settingsData.sounds;
    soundsToggle.addEventListener('change', (e) => {
        settingsData.sounds = e.target.checked;
        localStorage.setItem('arrowsSettings', JSON.stringify(settingsData));
    });
}
if (vibrationsToggle) {
    vibrationsToggle.checked = settingsData.vibrations;
    vibrationsToggle.addEventListener('change', (e) => {
        settingsData.vibrations = e.target.checked;
        localStorage.setItem('arrowsSettings', JSON.stringify(settingsData));
    });
}
if (darkModeToggle) {
    darkModeToggle.checked = settingsData.darkMode;
    darkModeToggle.addEventListener('change', (e) => {
        settingsData.darkMode = e.target.checked;
        localStorage.setItem('arrowsSettings', JSON.stringify(settingsData));
        applyDarkMode();
    });
}
const languageModal = document.getElementById('language-modal');
const languageList = document.getElementById('language-list');
const languageCloseBtn = document.getElementById('language-close-btn');

function openLanguagePicker() {
    if (!languageModal || !languageList) return;
    languageList.innerHTML = '';
    LANGUAGES.forEach((lang) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'lang-option' + (settingsData.language === lang ? ' active' : '');
        btn.innerText = lang;
        btn.addEventListener('click', () => {
            settingsData.language = lang;
            if (languageValue) languageValue.innerText = lang + ' >';
            localStorage.setItem('arrowsSettings', JSON.stringify(settingsData));
            applyLanguage();
            languageModal.classList.add('hidden');
        });
        languageList.appendChild(btn);
    });
    languageModal.classList.remove('hidden');
}

if (languageValue) {
    languageValue.innerText = settingsData.language + ' >';
    languageValue.parentElement.addEventListener('click', openLanguagePicker);
}
if (languageCloseBtn && languageModal) {
    languageCloseBtn.addEventListener('click', () => languageModal.classList.add('hidden'));
    languageModal.addEventListener('click', (e) => {
        if (e.target === languageModal) languageModal.classList.add('hidden');
    });
}

function applyDarkMode() {
    if (settingsData.darkMode) {
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
    }
    if (isGameRunning && typeof draw === 'function') draw();
}
applyDarkMode();

// Make entire settings rows clickable
document.querySelectorAll('.settings-item').forEach(item => {
    item.addEventListener('click', (e) => {
        if (e.target.classList.contains('slider') || e.target.tagName === 'INPUT' || e.target.closest('.toggle-switch')) return;
        if (item.querySelector('#language-value')) return; // Language has its own handler
        
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        }
    });
});
let arrowLineWidth = 4;
const heartsContainer = document.getElementById('hearts-container');
const playBtn = document.getElementById('play-btn');
const backBtn = document.getElementById('back-btn');
const googleLoginBtn = document.getElementById('google-login-btn');
const guestLoginBtn = document.getElementById('guest-login-btn');
const profileWrap = document.getElementById('profile-wrap');
const profileMenuBtn = document.getElementById('profile-menu-btn');
const profileDropdown = document.getElementById('profile-dropdown');
const changeNameBtn = document.getElementById('change-name-btn');
const changeAvatarBtn = document.getElementById('change-avatar-btn');
const removeAvatarBtn = document.getElementById('remove-avatar-btn');
const avatarUpload = document.getElementById('avatar-upload');
const profileSignOutBtn = document.getElementById('profile-sign-out-btn');
const nameEditModal = document.getElementById('name-edit-modal');
const nameEditInput = document.getElementById('name-edit-input');
const nameEditSave = document.getElementById('name-edit-save');
const nameEditCancel = document.getElementById('name-edit-cancel');
const avatarCropModal = document.getElementById('avatar-crop-modal');
const avatarCropStage = document.getElementById('avatar-crop-stage');
const avatarCropImg = document.getElementById('avatar-crop-img');
const avatarCropZoom = document.getElementById('avatar-crop-zoom');
const avatarCropSave = document.getElementById('avatar-crop-save');
const avatarCropCancel = document.getElementById('avatar-crop-cancel');

const AVATAR_CROP_STAGE = 320;
const AVATAR_CROP_OUTPUT = 300;
let avatarCropSource = null;
let avatarCropScale = 1;
let avatarCropOffsetX = 0;
let avatarCropOffsetY = 0;
let avatarCropDragging = false;
let avatarCropDragStart = null;
const settingsSignOutRow = document.getElementById('settings-sign-out-row');
const userDisplayName = document.getElementById('user-display-name');
const userAvatar = document.getElementById('user-avatar');
const userAvatarFallback = document.getElementById('user-avatar-fallback');
let profileMenuOpen = false;
const settingsUserName = document.getElementById('settings-user-name');
const loginError = document.getElementById('login-error');
const authLoading = document.getElementById('auth-loading');
const modalBtn = document.getElementById('modal-btn');
const modalTitle = document.getElementById('modal-title');
const leagueCard = document.getElementById('league-card');
const trapsModeCard = document.getElementById('traps-mode-card');
const streakCount = document.getElementById('streak-count');
const streakBtn = document.getElementById('streak-btn');
const streakModal = document.getElementById('streak-modal');
const streakOkBtn = document.getElementById('streak-ok-btn');
const trapsLockIcon = document.getElementById('traps-lock-icon');

// User Data (Stored in LocalStorage)
let userData = {
    username: null,
    level: 1,
    score: 0,
    coins: 0,
    streak: 0,
    nightmareCompleted: 0,
    rewards: [],
    unlockedSkins: ['#ffffff'],
    equippedSkin: '#ffffff',
    lastDailyChallenge: null,
    completedDays: [],
    email: null,
    googleId: null,
    picture: null
};

const SHOP_SKINS = [
    { id: '#ffffff', name: 'Classic', price: 0 },
    { id: 'neon', name: 'Neon Glow', price: 200 },
    { id: 'wood', name: 'Wooden Blocks', price: 500 },
    { id: 'space', name: 'Space Theme', price: 1000 },
    { id: 'ocean', name: 'Deep Ocean', price: 1500 },
    { id: 'desert', name: 'Desert Sand', price: 2000 },
    { id: 'forest', name: 'Dark Forest', price: 2500 },
    { id: 'sunset', name: 'Sunset Glow', price: 3200 },
    { id: 'ice', name: 'Frozen Ice', price: 3800 },
    { id: 'lava', name: 'Lava Burst', price: 4200 },
    { id: 'galaxy', name: 'Galactic Sky', price: 5000 }
];

// Grid Settings
let cols = 20;
let rows = 28;
let baseCellSize = 30;
let zoomScale = 1;
const MIN_ZOOM = 0.8;
const MAX_ZOOM = 1.6;
let cellSize = baseCellSize;
let offsetX = 0;
let offsetY = 0;
let pinchPointers = new Map();
let pinchStartDistance = 0;
let pinchStartZoom = 1;
let dragPointerId = null;
let dragStart = null;
let isPanning = false;

const DIR = { UP: { dx: 0, dy: -1 }, DOWN: { dx: 0, dy: 1 }, LEFT: { dx: -1, dy: 0 }, RIGHT: { dx: 1, dy: 0 } };
const DIRS = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

// Moderate thin strokes; path extension removes gaps along each arrow
const ARROW_WIDTH_RATIO = 0.36;
const ARROW_HEAD_CELL_RATIO = 0.46;

let firebaseUser = null;
let authReady = false;
let isGuestMode = false;
const GUEST_STORAGE_ID = 'guest';
const GUEST_MODE_KEY = 'arrowsGuestMode';
let hintedPiece = null;
let pathHintsVisible = false;
let isTrapsMode = false;

// Combo & Effects State
let floatingTexts = [];
let confettiParticles = [];
let screenShakeFrames = 0;
const pathHintBtn = document.getElementById('path-hint-btn');

const DIFFICULTIES = [
    { name: 'EASY', key: 'menu_easy', cssClass: 'easy', color: '#22c55e', tier: 1, minPieces: 35, maxPieces: 50, minPath: 3, maxPath: 6 },
    { name: 'HARD', key: 'menu_hard', cssClass: 'hard', color: '#f59e0b', tier: 2, minPieces: 120, maxPieces: 180, minPath: 4, maxPath: 8 },
    { name: 'SUPER HARD', key: 'menu_super_hard', cssClass: 'super', color: '#f97316', tier: 3, minPieces: 200, maxPieces: 300, minPath: 5, maxPath: 10 },
    { name: 'EXTRA HARD', key: 'menu_extra_hard', cssClass: 'extra', color: '#ef4444', tier: 4, minPieces: 350, maxPieces: 500, minPath: 6, maxPath: 12 },
    { name: 'NIGHTMARE', key: 'menu_nightmare', cssClass: 'nightmare', color: '#b91c1c', tier: 5, minPieces: 500, maxPieces: 750, minPath: 8, maxPath: 16 }
];

let nextPlayDifficulty = null;

function pickRandomDifficulty() {
    return DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)];
}

function rollNextDifficulty() {
    nextPlayDifficulty = pickRandomDifficulty();
    return nextPlayDifficulty;
}

function getGameTheme() {
    let bg = settingsData.darkMode ? '#1c1d27' : '#ffffff';
    let arrowColor = '#ffffff';
    let pathRGB = '255,255,255';

    if (userData.equippedSkin === 'neon') {
        bg = '#0f172a';
        arrowColor = '#22d3ee';
        pathRGB = '34,211,238';
    } else if (userData.equippedSkin === 'wood') {
        bg = '#fef3c7';
        arrowColor = '#92400e';
        pathRGB = '146,64,14';
    } else if (userData.equippedSkin === 'space') {
        bg = '#020617';
        arrowColor = '#fef08a';
        pathRGB = '168,85,247';
    } else if (userData.equippedSkin === 'ocean') {
        bg = '#0c4a6e';
        arrowColor = '#38bdf8';
        pathRGB = '56,189,248';
    } else if (userData.equippedSkin === 'desert') {
        bg = '#ffedd5';
        arrowColor = '#ea580c';
        pathRGB = '234,88,12';
    } else if (userData.equippedSkin === 'forest') {
        bg = '#022c22';
        arrowColor = '#4ade80';
        pathRGB = '74,222,128';
    } else {
        if (!settingsData.darkMode) {
            arrowColor = '#000000';
            pathRGB = '0,0,0';
        }
    }

    return { bg, arrow: arrowColor, pathRGB };
}

function getLocalDateStr(d = new Date()) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function computeCurrentStreak() {
    const completedSet = new Set(userData.completedDays || []);
    if (completedSet.size === 0) return 0;

    let streak = 0;
    const current = new Date();
    while (true) {
        const dateKey = getLocalDateStr(current);
        if (!completedSet.has(dateKey)) break;
        streak += 1;
        current.setDate(current.getDate() - 1);
    }
    return streak;
}

function updateUserStreak() {
    const streak = computeCurrentStreak();
    if (userData.streak !== streak) {
        userData.streak = streak;
        saveData();
    }
    if (streakCount) streakCount.innerText = streak;
}

// Haptics helper
function vibrate(style = 'Light') {
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics) {
        window.Capacitor.Plugins.Haptics.impact({ style });
    } else if (navigator.vibrate) {
        if (style === 'Heavy') navigator.vibrate(40);
        else if (style === 'Medium') navigator.vibrate(20);
        else navigator.vibrate(10);
    }
}

// Seeded RNG for Daily Challenges
function sfc32(a, b, c, d) {
    return function() {
        a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
        var t = (a + b) | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        d = d + 1 | 0;
        t = t + d | 0;
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
    }
}
function myRandom() {
    return seededRandom ? seededRandom() : Math.random();
}

// --- INIT & AUTH (Firebase) ---
function getStorageKey(uid) {
    return uid ? `arrowsData_${uid}` : 'arrowsData';
}

function normalizeUserData(data) {
    const base = {
        username: null,
        level: 1,
        score: 0,
        coins: 0,
        streak: 0,
        nightmareCompleted: 0,
        rewards: [],
        unlockedSkins: ['#ffffff'],
        equippedSkin: '#ffffff',
        lastDailyChallenge: null,
        completedDays: [],
        email: null,
        googleId: null,
        picture: null
    };
    return { ...base, ...data };
}

function loadUserDataForUid(uid) {
    const key = getStorageKey(uid);
    let saved = localStorage.getItem(key);
    if (!saved && uid) saved = localStorage.getItem('arrowsData');
    if (saved) {
        try {
            userData = normalizeUserData(JSON.parse(saved));
        } catch (e) {
            userData = normalizeUserData({});
        }
    } else {
        userData = normalizeUserData({});
    }
    updateUserStreak();
}

function setLoginError(msg) {
    if (!loginError) return;
    if (msg) {
        loginError.innerText = msg;
        loginError.classList.remove('hidden');
    } else {
        loginError.innerText = '';
        loginError.classList.add('hidden');
    }
}

function setAuthLoading(loading) {
    if (authLoading) authLoading.classList.toggle('hidden', !loading);
    if (googleLoginBtn) googleLoginBtn.disabled = !!loading;
}

function showLoginScreen() {
    isGuestMode = false;
    closeProfileMenu();
    document.body.classList.remove('user-signed-in');
    isGameRunning = false;
    hideAllScreens();
    document.querySelectorAll('.auth-gated').forEach((el) => {
        el.classList.add('hidden');
    });
    if (gameScreen) gameScreen.classList.add('hidden');
    if (bottomNav) {
        bottomNav.classList.add('hidden');
        bottomNav.style.display = 'none';
    }
    if (loginModal) {
        loginModal.classList.remove('hidden');
        loginModal.style.display = 'flex';
    }
    setAuthLoading(false);
}

function getDisplayName(user) {
    if (userData.username && String(userData.username).trim()) {
        return String(userData.username).trim();
    }
    if (isGuestMode) return t('guest_name');
    return user?.displayName || user?.email || 'Player';
}

function showAvatarFallback(name) {
    if (!userAvatarFallback) return;
    const letter = (name || 'P').trim().charAt(0).toUpperCase() || 'P';
    userAvatarFallback.innerText = letter;
    userAvatarFallback.classList.remove('hidden');
    if (userAvatar) userAvatar.classList.add('hidden');
}

function setAvatarImage(url, name) {
    if (!userAvatar) {
        showAvatarFallback(name);
        return;
    }
    if (!url) {
        userAvatar.removeAttribute('src');
        userAvatar.classList.add('hidden');
        showAvatarFallback(name);
        return;
    }
    userAvatar.onload = () => {
        userAvatar.classList.remove('hidden');
        if (userAvatarFallback) userAvatarFallback.classList.add('hidden');
    };
    userAvatar.onerror = () => {
        userAvatar.removeAttribute('src');
        userAvatar.classList.add('hidden');
        showAvatarFallback(name);
    };
    userAvatar.referrerPolicy = 'no-referrer';
    userAvatar.src = url;
}

function removeProfilePhoto() {
    userData.picture = null;
    saveData();
    updateUserDisplay(firebaseUser);
    closeProfileMenu();
}

function updateRemovePhotoButton() {
    if (!removeAvatarBtn) return;
    const hasCustom = !!userData.picture;
    removeAvatarBtn.classList.toggle('hidden', !hasCustom);
    removeAvatarBtn.disabled = !hasCustom;
}

function updateProfileTriggerWidth() {
    if (!profileMenuBtn || !userDisplayName) return;
    const nameLen = (userDisplayName.textContent || '').trim().length;
    const widthPx = Math.min(340, Math.max(128, 96 + nameLen * 8));
    profileMenuBtn.style.maxWidth = `${widthPx}px`;
}

function updateUserDisplay(user) {
    const name = getDisplayName(user);
    if (userDisplayName) userDisplayName.innerText = name;
    if (settingsUserName) settingsUserName.innerText = name;
    updateProfileTriggerWidth();

    const photo = userData.picture || user?.photoURL || null;
    setAvatarImage(photo, name);
    updateRemovePhotoButton();
}

function updatePathHintButton() {
    if (!pathHintBtn) return;
    pathHintBtn.classList.toggle('active', pathHintsVisible);
    pathHintBtn.style.background = pathHintsVisible ? '#eab308' : 'rgba(255,255,255,0.1)';
    pathHintBtn.style.color = pathHintsVisible ? '#000' : 'white';
    pathHintBtn.setAttribute('aria-pressed', pathHintsVisible ? 'true' : 'false');
    pathHintBtn.title = pathHintsVisible ? t('path_hint_hide') : t('path_hint_show');
    pathHintBtn.setAttribute('aria-label', pathHintBtn.title);
}

function togglePathHints() {
    pathHintsVisible = !pathHintsVisible;
    updatePathHintButton();
    if (isGameRunning) draw();
}

function closeProfileMenu() {
    profileMenuOpen = false;
    if (profileDropdown) profileDropdown.classList.add('hidden');
    if (profileMenuBtn) profileMenuBtn.setAttribute('aria-expanded', 'false');
}

function toggleProfileMenu() {
    profileMenuOpen = !profileMenuOpen;
    if (profileDropdown) profileDropdown.classList.toggle('hidden', !profileMenuOpen);
    if (profileMenuBtn) profileMenuBtn.setAttribute('aria-expanded', profileMenuOpen ? 'true' : 'false');
}

function openNameEditModal() {
    closeProfileMenu();
    if (!nameEditModal || !nameEditInput) return;
    nameEditInput.value = getDisplayName(firebaseUser);
    nameEditModal.classList.remove('hidden');
    nameEditModal.style.display = 'flex';
    setTimeout(() => nameEditInput.focus(), 50);
}

function closeNameEditModal() {
    if (!nameEditModal) return;
    nameEditModal.classList.add('hidden');
    nameEditModal.style.display = 'none';
}

function saveDisplayName() {
    if (!nameEditInput) return;
    const name = nameEditInput.value.trim().slice(0, 28);
    if (!name) {
        nameEditInput.focus();
        return;
    }
    userData.username = name;
    saveData();
    updateUserDisplay(firebaseUser);
    closeNameEditModal();
}

function updateAvatarCropPreview() {
    if (!avatarCropImg) return;
    avatarCropImg.style.transform =
        `translate(calc(-50% + ${avatarCropOffsetX}px), calc(-50% + ${avatarCropOffsetY}px)) scale(${avatarCropScale})`;
}

function openAvatarCropModal(dataUrl) {
    if (!avatarCropModal || !avatarCropImg) return;
    avatarCropSource = new Image();
    avatarCropSource.onload = () => {
        const cover = AVATAR_CROP_STAGE / Math.min(avatarCropSource.width, avatarCropSource.height);
        avatarCropScale = cover;
        avatarCropOffsetX = 0;
        avatarCropOffsetY = 0;
        avatarCropImg.src = dataUrl;
        if (avatarCropZoom) avatarCropZoom.value = String(Math.round(avatarCropScale * 100));
        updateAvatarCropPreview();
        avatarCropModal.classList.remove('hidden');
        avatarCropModal.style.display = 'flex';
        closeProfileMenu();
    };
    avatarCropSource.onerror = () => alert('Could not load image.');
    avatarCropSource.src = dataUrl;
}

function closeAvatarCropModal() {
    if (!avatarCropModal) return;
    avatarCropModal.classList.add('hidden');
    avatarCropModal.style.display = 'none';
    avatarCropSource = null;
    if (avatarCropImg) avatarCropImg.removeAttribute('src');
}

function saveAvatarCrop() {
    if (!avatarCropSource) return;
    const ratio = AVATAR_CROP_OUTPUT / AVATAR_CROP_STAGE;
    const center = AVATAR_CROP_STAGE / 2;
    const drawW = avatarCropSource.width * avatarCropScale;
    const drawH = avatarCropSource.height * avatarCropScale;
    const dx = center - drawW / 2 + avatarCropOffsetX;
    const dy = center - drawH / 2 + avatarCropOffsetY;

    const c = document.createElement('canvas');
    c.width = AVATAR_CROP_OUTPUT;
    c.height = AVATAR_CROP_OUTPUT;
    const cctx = c.getContext('2d');
    cctx.beginPath();
    cctx.arc(AVATAR_CROP_OUTPUT / 2, AVATAR_CROP_OUTPUT / 2, AVATAR_CROP_OUTPUT / 2, 0, Math.PI * 2);
    cctx.clip();
    cctx.drawImage(
        avatarCropSource,
        dx * ratio,
        dy * ratio,
        drawW * ratio,
        drawH * ratio
    );

    userData.picture = c.toDataURL('image/jpeg', 0.85);
    saveData();
    updateUserDisplay(firebaseUser);
    closeAvatarCropModal();
}

function handleAvatarFileSelect(file) {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
        alert('Image too large. Max 5 MB.');
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => openAvatarCropModal(e.target.result);
    reader.onerror = () => alert('Could not read image.');
    reader.readAsDataURL(file);
}

function initAvatarCropUI() {
    if (!avatarCropStage) return;

    const onDragStart = (clientX, clientY) => {
        avatarCropDragging = true;
        avatarCropDragStart = { x: clientX, y: clientY, ox: avatarCropOffsetX, oy: avatarCropOffsetY };
        avatarCropStage.classList.add('dragging');
    };
    const onDragMove = (clientX, clientY) => {
        if (!avatarCropDragging || !avatarCropDragStart) return;
        avatarCropOffsetX = avatarCropDragStart.ox + (clientX - avatarCropDragStart.x);
        avatarCropOffsetY = avatarCropDragStart.oy + (clientY - avatarCropDragStart.y);
        updateAvatarCropPreview();
    };
    const onDragEnd = () => {
        avatarCropDragging = false;
        avatarCropDragStart = null;
        avatarCropStage.classList.remove('dragging');
    };

    avatarCropStage.addEventListener('mousedown', (e) => {
        e.preventDefault();
        onDragStart(e.clientX, e.clientY);
    });
    window.addEventListener('mousemove', (e) => {
        if (avatarCropDragging) onDragMove(e.clientX, e.clientY);
    });
    window.addEventListener('mouseup', onDragEnd);

    avatarCropStage.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        onDragStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    avatarCropStage.addEventListener('touchmove', (e) => {
        if (!avatarCropDragging || e.touches.length !== 1) return;
        onDragMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    avatarCropStage.addEventListener('touchend', onDragEnd);

    if (avatarCropZoom) {
        avatarCropZoom.addEventListener('input', () => {
            avatarCropScale = Number(avatarCropZoom.value) / 100;
            updateAvatarCropPreview();
        });
    }
    if (avatarCropSave) avatarCropSave.addEventListener('click', saveAvatarCrop);
    if (avatarCropCancel) avatarCropCancel.addEventListener('click', closeAvatarCropModal);
    if (avatarCropModal) {
        avatarCropModal.addEventListener('click', (e) => {
            if (e.target === avatarCropModal) closeAvatarCropModal();
        });
    }
}

function initProfileMenu() {
    if (profileMenuBtn) {
        profileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleProfileMenu();
        });
    }
    if (changeNameBtn) {
        changeNameBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openNameEditModal();
        });
    }
    if (nameEditSave) nameEditSave.addEventListener('click', saveDisplayName);
    if (nameEditCancel) nameEditCancel.addEventListener('click', closeNameEditModal);
    if (nameEditModal) {
        nameEditModal.addEventListener('click', (e) => {
            if (e.target === nameEditModal) closeNameEditModal();
        });
    }
    if (nameEditInput) {
        nameEditInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') saveDisplayName();
            if (e.key === 'Escape') closeNameEditModal();
        });
    }
    if (changeAvatarBtn && avatarUpload) {
        changeAvatarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            avatarUpload.click();
        });
        avatarUpload.addEventListener('change', () => {
            const file = avatarUpload.files?.[0];
            if (file) handleAvatarFileSelect(file);
            avatarUpload.value = '';
        });
    }
    if (removeAvatarBtn) {
        removeAvatarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeProfilePhoto();
        });
    }
    if (profileSignOutBtn) {
        profileSignOutBtn.addEventListener('click', () => {
            closeProfileMenu();
            handleSignOut();
        });
    }
    document.addEventListener('click', (e) => {
        if (profileWrap && !profileWrap.contains(e.target)) closeProfileMenu();
    });
}

function loginAsGuest() {
    if (isGuestMode && document.body.classList.contains('user-signed-in')) return;
    localStorage.setItem(GUEST_MODE_KEY, '1');
    isGuestMode = true;
    firebaseUser = null;
    setLoginError('');
    setAuthLoading(false);

    loadUserDataForUid(GUEST_STORAGE_ID);
    if (!userData.username) userData.username = t('guest_name');
    userData.email = null;
    userData.googleId = GUEST_STORAGE_ID;
    userData.picture = null;
    saveData();

    document.body.classList.add('user-signed-in');
    updateUserDisplay(null);
    enterGameAfterLogin();
}

function onFirebaseAuthStateChanged(user) {
    authReady = true;
    setAuthLoading(false);

    if (user) {
        localStorage.removeItem(GUEST_MODE_KEY);
        isGuestMode = false;
        firebaseUser = user;
        document.body.classList.add('user-signed-in');
        setLoginError('');
        loadUserDataForUid(user.uid);
        if (!userData.username) {
            userData.username = user.displayName || user.email || 'Player';
        }
        userData.email = user.email || null;
        userData.googleId = user.uid;
        if (!userData.picture) {
            userData.picture = user.photoURL || null;
        }
        saveData();
        updateUserDisplay(user);
        enterGameAfterLogin();
    } else if (localStorage.getItem(GUEST_MODE_KEY) === '1') {
        loginAsGuest();
    } else if (!isGuestMode) {
        firebaseUser = null;
        showLoginScreen();
        if (typeof applyLanguage === 'function') applyLanguage();
    }
}

async function handleGoogleLoginClick(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    if (!window.ArrowsFirebase) {
        setLoginError('Firebase not loaded. Check your connection.');
        return;
    }
    setLoginError('');
    setAuthLoading(true);
    try {
        await ArrowsFirebase.signInWithGoogle();
    } catch (err) {
        console.error('Google sign-in error', err);
        setAuthLoading(false);
        const code = err?.code || '';
        if (code === 'auth/popup-closed-by-user') {
            setLoginError('');
            return;
        }
        setLoginError(err.message || 'Sign in failed. Try again.');
    }
}

async function handleSignOut() {
    const wasGuest = isGuestMode;
    localStorage.removeItem(GUEST_MODE_KEY);
    isGuestMode = false;
    if (!wasGuest && window.ArrowsFirebase && firebaseUser) {
        try {
            await ArrowsFirebase.signOut();
        } catch (err) {
            console.error('Sign out error', err);
        }
    }
    firebaseUser = null;
    showLoginScreen();
    if (typeof applyLanguage === 'function') applyLanguage();
}

function initFirebaseAuth() {
    if (!window.ArrowsFirebase) {
        setLoginError('Firebase failed to load.');
        showLoginScreen();
        return;
    }
    setAuthLoading(true);
    ArrowsFirebase.onAuthStateChanged(onFirebaseAuthStateChanged);
}

function logDeviceInfo() {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);
    const hasPointerEvents = 'PointerEvent' in window;
    const hasBackdropFilter = CSS && CSS.supports && CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
    
    console.log('🎮 Arrows Game Device Info:');
    console.log(`Platform: ${isIOS ? 'iOS' : isAndroid ? 'Android' : 'Web'}`);
    console.log(`Touch Support: ${('ontouchstart' in window) ? '✅' : '❌'}`);
    console.log(`Pointer Events: ${hasPointerEvents ? '✅' : '❌'}`);
    console.log(`Backdrop Filter (Glassmorphism): ${hasBackdropFilter ? '✅' : '❌'}`);
    console.log(`User Agent: ${ua}`);
}

function init() {
    logDeviceInfo();
    applyLanguage();
    if (localStorage.getItem(GUEST_MODE_KEY) === '1') {
        loginAsGuest();
        return;
    }
    setAuthLoading(true);
    document.body.classList.remove('user-signed-in');
    if (loginModal) {
        loginModal.classList.add('hidden');
        loginModal.style.display = 'none';
    }
}

function enterGameAfterLogin() {
    try {
        if (loginModal) {
            loginModal.classList.add('hidden');
            loginModal.style.display = 'none';
        }
        hideAllScreens();
        if (mainMenu) {
            mainMenu.classList.remove('hidden');
            mainMenu.style.display = 'flex';
        }
        if (bottomNav) {
            bottomNav.classList.remove('hidden');
            bottomNav.style.display = 'flex';
        }
        setActiveNav('nav-home');
        if (typeof applyLanguage === 'function') applyLanguage();
        if (typeof updateMenuUI === 'function') updateMenuUI(false);
        if (typeof updateAccountStatus === 'function') updateAccountStatus();
    } catch (err) {
        console.error('enterGameAfterLogin failed', err);
    }
}

if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', handleGoogleLoginClick);
}
if (guestLoginBtn) {
    guestLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginAsGuest();
    });
}
initProfileMenu();
initAvatarCropUI();

if (pathHintBtn) {
    pathHintBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePathHints();
    });
}
updatePathHintButton();
updateRemovePhotoButton();

if (settingsSignOutRow) {
    settingsSignOutRow.addEventListener('click', handleSignOut);
}

function saveData() {
    const uid = isGuestMode ? GUEST_STORAGE_ID : (firebaseUser?.uid || userData.googleId);
    const key = getStorageKey(uid);
    try {
        localStorage.setItem(key, JSON.stringify(userData));
        if (firebaseUser && window.ArrowsFirebase && window.ArrowsFirebase.db) {
            window.ArrowsFirebase.db.collection('users').doc(firebaseUser.uid).set({
                name: userData.username || firebaseUser.displayName || 'Player',
                picture: userData.picture || firebaseUser.photoURL || null,
                level: Number(userData.level) || 1,
                score: Number(userData.score) || 0,
                coins: Number(userData.coins) || 0,
                lastActive: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true }).catch(err => console.warn('Firestore sync failed', err));
        }
    } catch (e) {
        console.warn('Could not save to localStorage', e);
    }
}

function updateAccountStatus() {
    if (firebaseUser) updateUserDisplay(firebaseUser);
}

function updateGameCoinDisplay() {
    if (gameCoinText) {
        gameCoinText.innerText = userData.coins;
    }
}

function updateHintUI() {
    if (!hintBadge) return;
    if (freeHintsLeft > 0) {
        hintBadge.innerText = freeHintsLeft;
        hintBadge.style.background = '#ef4444';
    } else {
        // Show 50 cost
        hintBadge.innerHTML = '50<svg width="10" height="10" viewBox="0 0 24 24" fill="#fde047" stroke="#ca8a04" stroke-width="2" style="vertical-align: baseline; margin-left: 2px; position: relative; top: 1px;"><circle cx="12" cy="12" r="10"/></svg>';
        hintBadge.style.background = '#eab308';
    }
}

if (restartBtn) {
    restartBtn.addEventListener('click', () => {
        if (!isGameRunning) return;
        pieces = JSON.parse(initialPiecesStr);
        animatingPieces = [];
        moveHistory = [];
        hintedPiece = null;
        lives = MAX_LIVES;
        freeHintsLeft = 3;
        updateHearts();
        updateHintUI();
        if(typeof playSound !== 'undefined') playSound('tap');
        vibrate('Light');
        resize();
    });
}

if (hintBtn) {
    hintBtn.addEventListener('click', () => {
        if (!isGameRunning || pieces.length === 0) return;
        
        if (freeHintsLeft > 0) {
            freeHintsLeft--;
        } else {
            if (userData.coins >= 50) {
                userData.coins -= 50;
                saveData();
                updateGameCoinDisplay();
            } else {
                if(typeof playSound !== 'undefined') playSound('error');
                vibrate('Heavy');
                return;
            }
        }
        
        updateHintUI();
        
        const validPieces = pieces.filter(p => getBlockers(p).length === 0);
        if (validPieces.length > 0) {
            const hintPiece = validPieces[Math.floor(Math.random() * validPieces.length)];
            
            const clone = { 
                ...hintPiece, 
                gridPaths: JSON.parse(JSON.stringify(hintPiece.gridPaths)), 
                dirVec: {...hintPiece.dirVec} 
            };
            clone.offset = 0;
            clone.state = 'IDLE';
            moveHistory.push(clone);
            
            if(typeof playSound !== 'undefined') playSound('tap');
            vibrate('Light');

            const idx = pieces.findIndex(p => p.id === hintPiece.id);
            pieces.splice(idx, 1);
            animatingPieces.push(hintPiece);
            
            animateEscape(hintPiece, () => {
                animatingPieces = animatingPieces.filter(p => p.id !== hintPiece.id);
                if (pieces.length === 0 && animatingPieces.length === 0) {
                    levelComplete();
                }
            });
        }
    });
}

function updateMenuUI(rollDifficulty = false) {
    if (!userData.level) userData.level = 1;
    if (menuLevelText) menuLevelText.innerText = `${t('menu_level')} ${userData.level}`;
    updateUserStreak();
    if (streakCount) streakCount.innerText = userData.streak || 0;
    updateWeeklyStreak();

    if (rollDifficulty || !nextPlayDifficulty) rollNextDifficulty();
    if (menuDiffText && nextPlayDifficulty) {
        menuDiffText.innerText = t(nextPlayDifficulty.key);
        menuDiffText.className = `diff-${nextPlayDifficulty.cssClass}`;
    }
    updateAccountStatus();

    if (trapsModeCard && trapsLockIcon) {
        if (Number(userData.level) <= 10) {
            trapsModeCard.style.opacity = '0.5';
            trapsLockIcon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0"></path></svg>`;
        } else {
            trapsModeCard.style.opacity = '1';
            trapsLockIcon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;
        }
    }

    if (!leagueCard) return;

    if (userData.level <= 5) {
        leagueCard.innerHTML = `
            <h3 data-i18n="leagues">${t('leagues')}</h3>
            <div class="shield" style="filter: grayscale(1); opacity: 0.5; margin: 15px 0; font-size: 3rem;"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8c8c9e" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
            <div class="timer" style="font-size: 0.8rem; color: #8c8c9e;">${t('unlocks_at')} 6</div>
        `;
    } else {
        leagueCard.innerHTML = `
            <h3 data-i18n="leagues">${t('leagues')}</h3>
            <div class="shield" style="font-size: 4rem; margin: 15px 0; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.3));"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
            <div class="score" style="background: rgba(0,0,0,0.3); display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px; border-radius: 20px; font-weight: 700; font-size: 0.9rem;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M21 3L3 10.53L9.82 14.18L13.47 21L21 3Z"/></svg>
                <span>${userData.score} (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: text-bottom; margin-right: 4px;"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg> ${userData.coins})</span>
            </div>
        `;
    }
}

function updateWeeklyStreak() {
    updateUserStreak();
    const container = document.getElementById('weekly-streak-container');
    if (!container) return;
    container.innerHTML = '';

    const summary = document.getElementById('streak-summary');
    if (summary) {
        summary.innerText = `Current streak: ${userData.streak || 0} days`;
    }
    
    const todayObj = new Date();
    const day = todayObj.getDay() || 7; 
    const monday = new Date(todayObj);
    monday.setDate(todayObj.getDate() - day + 1);
    
    const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    const completedDays = userData.completedDays || [];
    
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        
        const dateStr = getLocalDateStr(d);
        const todayStr = getLocalDateStr(todayObj);
        
        const isCompleted = completedDays.includes(dateStr);
        const isToday = (dateStr === todayStr);
        
        const dayDiv = document.createElement('div');
        dayDiv.style.display = 'flex';
        dayDiv.style.flexDirection = 'column';
        dayDiv.style.alignItems = 'center';
        dayDiv.style.justifyContent = 'center';
        dayDiv.style.width = '24px';
        dayDiv.style.opacity = isToday ? '1' : '0.5';
        
        const nameSpan = document.createElement('span');
        nameSpan.innerText = days[i].charAt(0);
        nameSpan.style.fontSize = '10px';
        nameSpan.style.fontWeight = isToday ? 'bold' : 'normal';
        nameSpan.style.color = '#fff';
        
        const checkSpan = document.createElement('span');
        checkSpan.style.fontSize = '12px';
        checkSpan.style.marginTop = '2px';
        checkSpan.innerHTML = isCompleted ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="4"><polyline points="20 6 9 17 4 12"></polyline></svg>' : '<div style="width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,0.1);"></div>';
        
        dayDiv.appendChild(nameSpan);
        dayDiv.appendChild(checkSpan);
        container.appendChild(dayDiv);
    }
}

// --- NAVIGATION ---
function hideAllScreens() {
    mainMenu.classList.add('hidden');
    collectionScreen.classList.add('hidden');
    shopScreen.classList.add('hidden');
    challengeScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    if (document.getElementById('settings-screen')) {
        document.getElementById('settings-screen').classList.add('hidden');
    }
}

function setActiveNav(navId) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    if (document.getElementById(navId)) document.getElementById(navId).classList.add('active');
}

if (navHome) navHome.addEventListener('click', () => { hideAllScreens(); mainMenu.classList.remove('hidden'); setActiveNav('nav-home'); updateMenuUI(false); });
if (navCollection) navCollection.addEventListener('click', () => { hideAllScreens(); collectionScreen.classList.remove('hidden'); setActiveNav('nav-collection'); renderCollection(); });
if (navShop) navShop.addEventListener('click', () => { hideAllScreens(); shopScreen.classList.remove('hidden'); setActiveNav('nav-shop'); renderShop(); });
if (navChallenge) navChallenge.addEventListener('click', () => { hideAllScreens(); challengeScreen.classList.remove('hidden'); setActiveNav('nav-challenge'); updateChallengeUI(); });
const navSettings = document.getElementById('nav-settings');
if (navSettings) navSettings.addEventListener('click', () => { hideAllScreens(); document.getElementById('settings-screen').classList.remove('hidden'); setActiveNav('nav-settings'); });

// --- RENDERERS ---
function renderCollection() {
    collectionGrid.innerHTML = '';
    const totalSlots = 16;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Elite", "Champion", "Legend", "Master"];
    
    for (let i = 0; i < totalSlots; i++) {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.flexDirection = 'column';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'center';
        
        let hasReward = userData.rewards.includes(`Trophy_${i}`);
        const tierClass = i >= 12 ? 'special' : '';
        
        if (hasReward) {
            item.className = `reward-item unlocked ${tierClass}`.trim();
            item.innerHTML = `<div style="font-size: 2.2rem; filter: drop-shadow(0 2px 5px rgba(255,215,0,0.5));">🏆</div><div style="font-size: 0.75rem; color: #fff; margin-top: 5px; font-weight: bold;">${monthNames[i]}</div>`;
        } else {
            item.className = `reward-item locked ${tierClass}`.trim();
            item.innerHTML = `<div style="font-size: 2.2rem; opacity: 0.3; filter: grayscale(1);">🏆</div><div style="font-size: 0.75rem; color: #8c8c9e; margin-top: 5px;">${monthNames[i]}</div>`;
        }
        collectionGrid.appendChild(item);
    }
}

function renderShop() {
    shopCoins.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: text-bottom; margin-right: 4px;"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg> ${userData.coins}`;
    shopGrid.innerHTML = '';
    
    SHOP_SKINS.forEach(skin => {
        const item = document.createElement('div');
        item.className = `skin-item ${userData.equippedSkin === skin.id ? 'equipped' : ''}`;
        
        const preview = document.createElement('div');
        preview.className = 'skin-preview';
        let previewBg = skin.id;
        if (skin.id === 'neon') previewBg = 'linear-gradient(45deg, #0f172a, #06b6d4)';
        else if (skin.id === 'wood') previewBg = 'linear-gradient(45deg, #78350f, #d97706)';
        else if (skin.id === 'space') previewBg = 'linear-gradient(45deg, #020617, #4c1d95)';
        else if (skin.id === 'ocean') previewBg = 'linear-gradient(45deg, #0c4a6e, #38bdf8)';
        else if (skin.id === 'desert') previewBg = 'linear-gradient(45deg, #ffedd5, #ea580c)';
        else if (skin.id === 'forest') previewBg = 'linear-gradient(45deg, #022c22, #4ade80)';
        else if (skin.id === 'sunset') previewBg = 'linear-gradient(45deg, #fb7185, #f59e0b)';
        else if (skin.id === 'ice') previewBg = 'linear-gradient(45deg, #bae6fd, #0ea5e9)';
        else if (skin.id === 'lava') previewBg = 'linear-gradient(45deg, #dc2626, #f97316)';
        else if (skin.id === 'galaxy') previewBg = 'linear-gradient(45deg, #7c3aed, #22d3ee)';
        preview.style.background = previewBg;
        
        const name = document.createElement('span');
        name.innerText = skin.name;
        name.style.fontWeight = 'bold';
        
        const btn = document.createElement('button');
        
        if (userData.unlockedSkins.includes(skin.id)) {
            if (userData.equippedSkin === skin.id) {
                btn.className = 'skin-btn equipped';
                btn.innerText = t('btn_equipped');
            } else {
                btn.className = 'skin-btn';
                btn.innerText = t('btn_equip');
                btn.onclick = () => {
                    userData.equippedSkin = skin.id;
                    saveData();
                    if(typeof playSound !== 'undefined') playSound('tap');
                    vibrate('Light');
                    renderShop();
                };
            }
        } else {
            btn.className = 'skin-btn locked';
            btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: text-bottom; margin-right: 4px;"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg> ${skin.price}`;
            btn.onclick = () => {
                if (userData.coins >= skin.price) {
                    userData.coins -= skin.price;
                    userData.unlockedSkins.push(skin.id);
                    userData.equippedSkin = skin.id;
                    saveData();
                    if(typeof playSound !== 'undefined') playSound('buy');
                    vibrate('Medium');
                    renderShop();
                } else {
                    if(typeof playSound !== 'undefined') playSound('error');
                    vibrate('Heavy');
                    btn.innerText = t('not_enough');
                    setTimeout(() => btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: text-bottom; margin-right: 4px;"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg> ${skin.price}`, 1000);
                }
            };
        }
        
        item.appendChild(preview);
        item.appendChild(name);
        item.appendChild(btn);
        shopGrid.appendChild(item);
    });
}

function updateChallengeUI() {
    const today = new Date();
    const todayStr = getLocalDateStr(today);

    if (userData.lastDailyChallenge === todayStr || userData.completedDays.includes(todayStr)) {
        playChallengeBtn.innerText = t('challenge_completed');
        playChallengeBtn.style.opacity = "0.5";
        playChallengeBtn.style.pointerEvents = "none";
    } else {
        playChallengeBtn.innerText = t('btn_play_challenge');
        playChallengeBtn.style.opacity = "1";
        playChallengeBtn.style.pointerEvents = "auto";
    }

    renderCalendar(today);
}

function renderCalendar(date) {
    const monthYearText = document.getElementById('calendar-month');
    const daysGrid = document.getElementById('calendar-days');
    if(!monthYearText || !daysGrid) return;
    
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYearText.innerText = `${monthNames[month]} ${year}`;
    
    // First day of month
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Adjust so Monday is 0
    let startDayIndex = firstDay - 1;
    if (startDayIndex < 0) startDayIndex = 6; 
    
    daysGrid.innerHTML = '';
    
    // Empty cells
    for(let i = 0; i < startDayIndex; i++) {
        const empty = document.createElement('div');
        empty.className = 'cal-day empty';
        daysGrid.appendChild(empty);
    }
    
    let currentMonthCompleted = 0;
    
    for(let d = 1; d <= daysInMonth; d++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'cal-day';
        dayCell.innerText = d;
        
        const cellDateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        
        if (userData.completedDays.includes(cellDateStr)) {
            dayCell.classList.add('completed');
            currentMonthCompleted++;
        } else if (d === date.getDate()) {
            dayCell.classList.add('today');
        }
        
        daysGrid.appendChild(dayCell);
    }
    
    // Update progress bar
    const progressVal = document.getElementById('progress-val');
    const progressMax = document.getElementById('progress-max');
    const progressFill = document.getElementById('progress-fill');
    
    if (progressVal) {
        progressVal.innerText = currentMonthCompleted;
        progressMax.innerText = daysInMonth;
        let pct = (currentMonthCompleted / daysInMonth) * 100;
        progressFill.style.width = `${pct}%`;
    }
}

// --- PROCEDURAL GENERATION ---
function generateLevelAttempt(difficulty, numPieces, shapeType) {
    let newPieces = [];
    let occupied = Array(cols).fill().map(() => Array(rows).fill(0));
    let nextId = 0;
    
    const margin = difficulty.tier >= 4 ? 0 : (difficulty.tier >= 2 ? 1 : 2);
    
    const cx = cols / 2;
    const cy = rows / 2;
    let validCellCount = 0;
    
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            let isValid = true;
            if (x < margin || x >= cols - margin || y < margin || y >= rows - margin) isValid = false;
            
            if (isValid && shapeType === 'CROSS') {
                const isCorner = Math.abs(x - cx) > cols * 0.25 && Math.abs(y - cy) > rows * 0.25;
                if (isCorner) isValid = false;
            } else if (isValid && shapeType === 'DIAMOND') {
                const dist = Math.abs(x - cx) / (cols/2) + Math.abs(y - cy) / (rows/2);
                if (dist > 1.3) isValid = false;
            } else if (isValid && shapeType === 'DONUT') {
                const distSq = Math.pow((x - cx)/(cols/2), 2) + Math.pow((y - cy)/(rows/2), 2);
                if (distSq < 0.15) isValid = false;
            } else if (isValid && shapeType === 'TRIANGLE') {
                const widthAtY = ((y+1) / rows) * cols * 1.5;
                if (Math.abs(x - cx) > widthAtY / 2) isValid = false;
            }
            
            occupied[x][y] = isValid ? 0 : 1;
            if (isValid) validCellCount++;
        }
    }
    
    // Adjust numPieces if shape is small
    numPieces = Math.min(numPieces, Math.floor(validCellCount * 0.7));

    function isRayClear(cx, cy, dir) {
        let x = cx + dir.dx; let y = cy + dir.dy;
        while (x >= 0 && x < cols && y >= 0 && y < rows) {
            if (occupied[x][y] === 2) return false;
            x += dir.dx; y += dir.dy;
        }
        return true;
    }

    function collectValidHeads(startX, endX, startY, endY) {
        const heads = [];
        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                if (occupied[x][y] !== 0) continue;
                DIRS.forEach(dirName => {
                    if (isRayClear(x, y, DIR[dirName])) {
                        const bx = x - DIR[dirName].dx;
                        const by = y - DIR[dirName].dy;
                        if (bx >= 1 && bx < cols - 1 && by >= 1 && by < rows - 1 && occupied[bx][by] === 0) {
                            heads.push({ x, y, dirName });
                        }
                    }
                });
            }
        }
        return heads;
    }

    function buildPathFromHead(headInfo, pathLength, startX, endX, startY, endY) {
        const path = [{ x: headInfo.x, y: headInfo.y }];
        occupied[headInfo.x][headInfo.y] = 2;

        let cx = headInfo.x - DIR[headInfo.dirName].dx;
        let cy = headInfo.y - DIR[headInfo.dirName].dy;
        if (occupied[cx][cy] !== 0) {
            occupied[headInfo.x][headInfo.y] = 0;
            return null;
        }
        path.unshift({ x: cx, y: cy });
        occupied[cx][cy] = 2;

        const rayCells = new Set();
        let rx = headInfo.x;
        let ry = headInfo.y;
        while(rx >= 0 && rx < cols && ry >= 0 && ry < rows) {
            rayCells.add(`${rx},${ry}`);
            rx += DIR[headInfo.dirName].dx;
            ry += DIR[headInfo.dirName].dy;
        }

        for (let step = 2; step < pathLength; step++) {
            let neighbors = [];
            DIRS.forEach(d => {
                const nx = cx + DIR[d].dx;
                const ny = cy + DIR[d].dy;
                if (path[1].x === nx && path[1].y === ny) return;
                if (path.some(pt => pt.x === nx && pt.y === ny)) return;
                if (rayCells.has(`${nx},${ny}`)) return;

                const inBounds = (nx >= Math.max(1, startX - 1) && nx <= Math.min(cols - 2, endX + 1) &&
                    ny >= Math.max(1, startY - 1) && ny <= Math.min(rows - 2, endY + 1));

                if (inBounds && occupied[nx][ny] === 0) neighbors.push({ x: nx, y: ny });
            });

            if (neighbors.length === 0) {
                DIRS.forEach(d => {
                    const nx = cx + DIR[d].dx;
                    const ny = cy + DIR[d].dy;
                    if (path[1].x === nx && path[1].y === ny) return;
                    if (path.some(pt => pt.x === nx && pt.y === ny)) return;
                    if (rayCells.has(`${nx},${ny}`)) return;
                    if (nx >= 1 && nx < cols - 1 && ny >= 1 && ny < rows - 1 && occupied[nx][ny] === 0) {
                        neighbors.push({ x: nx, y: ny });
                    }
                });
            }

            if (neighbors.length === 0) break;

            const next = neighbors[Math.floor(myRandom() * neighbors.length)];
            path.unshift(next);
            occupied[next.x][next.y] = 2;
            cx = next.x;
            cy = next.y;
        }

        return path;
    }

    function addPiece(headInfo, pathLength, startX, endX, startY, endY) {
        const path = buildPathFromHead(headInfo, pathLength, startX, endX, startY, endY);
        if (!path) return false;
        newPieces.push({
            id: nextId++,
            gridPaths: path,
            dir: headInfo.dirName,
            dirVec: DIR[headInfo.dirName],
            offset: 0,
            state: 'IDLE',
            errorMarked: false,
            isKey: false,
            isLocked: false
        });
        return true;
    }

    const startX = 1;
    const startY = 1;
    const endX = cols - 2;
    const endY = rows - 2;

    for (let p = 0; p < numPieces; p++) {
        const validHeads = collectValidHeads(startX, endX, startY, endY);
        if (validHeads.length === 0) break;

        const headInfo = validHeads[Math.floor(myRandom() * validHeads.length)];
        const pathLength = difficulty.minPath + Math.floor(myRandom() * (difficulty.maxPath - difficulty.minPath + 1));
        addPiece(headInfo, pathLength, startX, endX, startY, endY);
    }

    const centerX0 = Math.floor(cols * 0.2);
    const centerX1 = Math.ceil(cols * 0.8) - 1;
    const centerY0 = Math.floor(rows * 0.2);
    const centerY1 = Math.ceil(rows * 0.8) - 1;
    const fillStartX = 1;
    const fillEndX = cols - 2;
    const fillStartY = 1;
    const fillEndY = rows - 2;
    const maxFillPasses = (centerX1 - centerX0 + 1) * (centerY1 - centerY0 + 1) * 3;

    function countCenterEmpty() {
        let n = 0;
        for (let x = centerX0; x <= centerX1; x++) {
            for (let y = centerY0; y <= centerY1; y++) {
                if (occupied[x][y] === 0) n++;
            }
        }
        return n;
    }

    function pickHeadForCenterGap(validHeads) {
        let sumX = 0;
        let sumY = 0;
        let emptyN = 0;
        for (let x = centerX0; x <= centerX1; x++) {
            for (let y = centerY0; y <= centerY1; y++) {
                if (occupied[x][y] === 0) {
                    sumX += x;
                    sumY += y;
                    emptyN++;
                }
            }
        }
        if (emptyN === 0) return validHeads[Math.floor(myRandom() * validHeads.length)];

        const ecx = sumX / emptyN;
        const ecy = sumY / emptyN;
        const inCenter = validHeads.filter(h =>
            h.x >= centerX0 && h.x <= centerX1 && h.y >= centerY0 && h.y <= centerY1
        );
        const pool = inCenter.length ? inCenter : validHeads;
        pool.sort((a, b) => {
            const da = (a.x - ecx) ** 2 + (a.y - ecy) ** 2;
            const db = (b.x - ecx) ** 2 + (b.y - ecy) ** 2;
            return da - db;
        });
        const topN = Math.min(8, pool.length);
        return pool[Math.floor(myRandom() * topN)];
    }

    for (let pass = 0; pass < maxFillPasses && countCenterEmpty() > 0; pass++) {
        const validHeads = collectValidHeads(fillStartX, fillEndX, fillStartY, fillEndY);
        if (validHeads.length === 0) break;

        const headInfo = pickHeadForCenterGap(validHeads);
        const pathLength = 3 + Math.floor(myRandom() * 4);
        addPiece(headInfo, pathLength, fillStartX, fillEndX, fillStartY, fillEndY);
    }

    if (isTrapsMode && newPieces.length > 5) {
        let shuffled = [...newPieces].sort(() => 0.5 - myRandom());
        shuffled[0].isKey = true;
        
        let numLocks = Math.max(2, Math.floor(newPieces.length * 0.15));
        for (let i = 1; i <= numLocks; i++) {
            shuffled[i].isLocked = true;
        }
    }

    return newPieces;
}

function countCenterEmptyCells(pieces) {
    const occupied = Array(cols).fill().map(() => Array(rows).fill(false));
    pieces.forEach(p => {
        p.gridPaths.forEach(pt => { occupied[pt.x][pt.y] = true; });
    });
    const centerX0 = Math.floor(cols * 0.2);
    const centerX1 = Math.ceil(cols * 0.8) - 1;
    const centerY0 = Math.floor(rows * 0.2);
    const centerY1 = Math.ceil(rows * 0.8) - 1;
    let n = 0;
    for (let x = centerX0; x <= centerX1; x++) {
        for (let y = centerY0; y <= centerY1; y++) {
            if (!occupied[x][y]) n++;
        }
    }
    return n;
}

function generateLevel(difficulty) {
    const targetPieces = difficulty.minPieces + Math.floor(myRandom() * (difficulty.maxPieces - difficulty.minPieces + 1));
    let best = [];
    let bestScore = -Infinity;
    const attempts = difficulty.tier >= 3 ? 12 : 7;
    
    const SHAPES = ['FULL'];
    const shapeType = SHAPES[Math.floor(myRandom() * SHAPES.length)];

    for (let a = 0; a < attempts; a++) {
        const attempt = generateLevelAttempt(difficulty, targetPieces, shapeType);
        const centerEmpty = countCenterEmptyCells(attempt);
        const filled = attempt.reduce((sum, p) => sum + p.gridPaths.length, 0);
        const score = filled * 100 - centerEmpty * 500;
        if (score > bestScore) {
            best = attempt;
            bestScore = score;
        }
        if (centerEmpty === 0) break;
    }
    if (best.length < 8) {
        for (let i = 0; i < 6 && best.length < 8; i++) {
            const attempt = generateLevelAttempt(difficulty, targetPieces, shapeType);
            if (attempt.length > best.length) best = attempt;
        }
    }
    return best;
}

function scheduleGameResize() {
    requestAnimationFrame(() => {
        resize();
        requestAnimationFrame(() => resize());
    });
}

// --- GAME LOGIC ---


if (playBtn) {
    playBtn.addEventListener('click', () => {
        isTrapsMode = false;
        isDailyChallengeMode = false;
        seededRandom = null;
        if (!nextPlayDifficulty) rollNextDifficulty();
        const diff = nextPlayDifficulty;
        startGameWithLevel(diff, userData.level);
    });
}

if (leagueCard) {
    leagueCard.addEventListener('click', async () => {
        if (userData.level <= 5) return;
        if (typeof playSound !== 'undefined') playSound('click');
        vibrate('Light');

        const originalHTML = leagueCard.innerHTML;
        leagueCard.innerHTML = `<h3 style="color: #10b981;">Global Rank</h3><div style="font-size: 1rem; margin: 15px 0; color: #d1d1e0;">Loading global rank...</div>`;

        if (!window.ArrowsFirebase?.db || !firebaseUser) {
            leagueCard.innerHTML = `<h3 style="color: #10b981;">Global Rank</h3><div style="font-size: 1rem; margin: 15px 0; color: #d1d1e0;">Sign in to see real global ranking.</div>`;
            setTimeout(() => {
                leagueCard.innerHTML = originalHTML;
            }, 3000);
            return;
        }

        try {
            const myScore = Number(userData.score || 0);
            const higherQuery = await window.ArrowsFirebase.db.collection('users')
                .where('score', '>', myScore)
                .get();
            const rank = higherQuery.size + 1;
            leagueCard.innerHTML = `<h3 style="color: #10b981;">Global Rank</h3><div style="font-size: 2.5rem; font-weight: bold; margin: 20px 0;">#${rank.toLocaleString()}</div><div style="font-size: 0.8rem; color: #a5b4fc;">Score ${myScore} • ${higherQuery.size} players above you</div>`;
        } catch (err) {
            console.error('Global rank lookup failed', err);
            leagueCard.innerHTML = `<h3 style="color: #10b981;">Global Rank</h3><div style="font-size: 1rem; margin: 15px 0; color: #f87171;">Unable to load rank. Try again later.</div>`;
            setTimeout(() => {
                leagueCard.innerHTML = originalHTML;
            }, 3000);
        }
    });
}

if (trapsModeCard) {
    trapsModeCard.addEventListener('click', () => {
        if (Number(userData.level) <= 10) {
            if(typeof playSound !== 'undefined') playSound('error');
            vibrate('Medium');
            trapsModeCard.style.transform = 'translateX(5px)';
            setTimeout(() => trapsModeCard.style.transform = 'translateX(-5px)', 50);
            setTimeout(() => trapsModeCard.style.transform = 'translateX(5px)', 100);
            setTimeout(() => trapsModeCard.style.transform = 'translateX(0)', 150);
            return;
        }
        if(typeof playSound !== 'undefined') playSound('click');
        isDailyChallengeMode = false;
        isTrapsMode = true;
        seededRandom = null;
        startGameWithLevel(DIFFICULTIES[1], 10); // visualLvl won't be used since we check isTrapsMode
    });
}

if (playChallengeBtn) {
playChallengeBtn.addEventListener('click', () => {
    isTrapsMode = false;
    isDailyChallengeMode = true;

    const todayStr = getLocalDateStr();
    let seedVal = 0;
    for (let i = 0; i < todayStr.length; i++) seedVal += todayStr.charCodeAt(i);
    seededRandom = sfc32(seedVal, seedVal + 1, seedVal + 2, seedVal + 3);

    if (!nextPlayDifficulty) rollNextDifficulty();
    startGameWithLevel(nextPlayDifficulty, 'Challenge');
});
}

if (backBtn) {
backBtn.addEventListener('click', () => {
    const wasChallenge = isDailyChallengeMode;
    isDailyChallengeMode = false;
    exitGame(wasChallenge);
});
}

function startGameWithLevel(difficulty, visualLvl) {
    if (!firebaseUser && !isGuestMode) {
        showLoginScreen();
        return;
    }
    hideAllScreens();
    bottomNav.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    const theme = getGameTheme();
    gameScreen.style.background = theme.bg;
    
    isGameRunning = true;

    moveHistory = [];
    hintedPiece = null;
    pathHintsVisible = false;
    updatePathHintButton();
    window.currentDifficulty = difficulty;
    
    if (difficulty.tier === 1) { cols = 20; rows = 28; }
    else if (difficulty.tier === 2) { cols = 24; rows = 34; }
    else if (difficulty.tier === 3) { cols = 28; rows = 40; }
    else if (difficulty.tier === 4) { cols = 34; rows = 48; }
    else if (difficulty.tier === 5) { cols = 40; rows = 56; }
    else { cols = 20; rows = 28; }

    pieces = generateLevel(difficulty);
    initialPiecesStr = JSON.stringify(pieces);
    animatingPieces = [];
    lives = MAX_LIVES;
    freeHintsLeft = 3;
    updateHintUI();
    updateGameCoinDisplay();

    const diffLabel = t(difficulty.key);
    if (isDailyChallengeMode) {
        gameLevelText.innerHTML = `${t('daily_challenge')} <span style="font-size: 0.65em; color: ${difficulty.color}; margin-left: 6px;">${diffLabel}</span>`;
    } else if (isTrapsMode) {
        gameLevelText.innerHTML = `${t('title_traps')} <span style="font-size: 0.65em; color: ${difficulty.color}; margin-left: 6px;">${diffLabel}</span>`;
    } else {
        gameLevelText.innerHTML = `${t('menu_level')} ${visualLvl} <span style="font-size: 0.7em; color: ${difficulty.color}; margin-left: 8px; vertical-align: baseline;">${diffLabel}</span>`;
    }
    updateHearts();
    scheduleGameResize();
}

function exitGame(toChallenge = false) {
    isGameRunning = false;
    gameScreen.classList.add('hidden');
    gameScreen.style.background = ''; // Clear custom background
    hideAllScreens();
    bottomNav.classList.remove('hidden');

    if (toChallenge) {
        challengeScreen.classList.remove('hidden');
        setActiveNav('nav-challenge');
        updateChallengeUI();
    } else {
        mainMenu.classList.remove('hidden');
        setActiveNav('nav-home');
        rollNextDifficulty();
        updateMenuUI(false);
    }
}

function updateHearts() {
    heartsContainer.innerHTML = '';
    for (let i = 0; i < MAX_LIVES; i++) {
        const heart = document.createElement('span');
        heart.className = `heart ${i >= lives ? 'lost' : ''}`;
        heart.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
        heartsContainer.appendChild(heart);
    }
}

function updatePixelPaths() {
    const allPieces = [...pieces, ...animatingPieces];
    allPieces.forEach(p => {
        p.pixelPaths = p.gridPaths.map(pt => ({
            x: offsetX + pt.x * cellSize + cellSize/2,
            y: offsetY + pt.y * cellSize + cellSize/2
        }));
        
        let ext = Math.max(0, cellSize * 0.36 - arrowLineWidth / 2);
        
        let last = p.pixelPaths[p.pixelPaths.length - 1];
        last.x += p.dirVec.dx * ext;
        last.y += p.dirVec.dy * ext;

        if (p.pixelPaths.length > 1) {
            let first = p.pixelPaths[0];
            let second = p.pixelPaths[1];
            let tailDx = Math.sign(first.x - second.x);
            let tailDy = Math.sign(first.y - second.y);
            first.x += tailDx * ext;
            first.y += tailDy * ext;
        } else {
            let first = p.pixelPaths[0];
            first.x -= p.dirVec.dx * ext;
            first.y -= p.dirVec.dy * ext;
        }

        p.totalLength = 0;
        for(let i = 0; i < p.pixelPaths.length - 1; i++){
            p.totalLength += Math.hypot(p.pixelPaths[i+1].x - p.pixelPaths[i].x, p.pixelPaths[i+1].y - p.pixelPaths[i].y);
        }
    });
}

function resize() {
    if (!isGameRunning || !canvas || !ctx) return;
    const container = document.getElementById('game-container');
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w < 8 || h < 8) {
        scheduleGameResize();
        return;
    }

    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    
    ctx.scale(dpr, dpr);

    const maxCellW = w / (cols + 2);
    const maxCellH = h / (rows + 2);
    baseCellSize = Math.min(maxCellW, maxCellH, 42);
    cellSize = baseCellSize * zoomScale;
    if (!cellSize || cellSize < 4) {
        scheduleGameResize();
        return;
    }
    arrowLineWidth = Math.max(cellSize * ARROW_WIDTH_RATIO, 4);
    
    offsetX = (w - cols * cellSize) / 2;
    offsetY = (h - rows * cellSize) / 2;
    
    updatePixelPaths();
    draw();
}
window.addEventListener('resize', resize);

function getBlocks(piece) {
    let blocks = [];
    for (let i = 0; i < piece.gridPaths.length - 1; i++) {
        const p1 = piece.gridPaths[i];
        const p2 = piece.gridPaths[i+1];
        const dx = Math.sign(p2.x - p1.x);
        const dy = Math.sign(p2.y - p1.y);
        let cx = p1.x; let cy = p1.y;
        while (cx !== p2.x || cy !== p2.y) {
            blocks.push({x: cx, y: cy});
            cx += dx; cy += dy;
        }
    }
    const lastP = piece.gridPaths[piece.gridPaths.length - 1];
    blocks.push({x: lastP.x, y: lastP.y});
    return blocks.filter((v, i, a) => a.findIndex(t => (t.x === v.x && t.y === v.y)) === i);
}

function getDistanceToBlocker(targetPiece) {
    const head = targetPiece.gridPaths[targetPiece.gridPaths.length - 1];
    const dirVec = targetPiece.dirVec;
    let cx = head.x; let cy = head.y;
    
    let maxSteps = Math.max(cols, rows);
    for (let step = 1; step <= maxSteps; step++) {
        cx += dirVec.dx; cy += dirVec.dy;
        if (cx < 0 || cx >= cols || cy < 0 || cy >= rows) return step;
        for (const other of pieces) {
            if (other.id === targetPiece.id) continue;
            const blocks = getBlocks(other);
            for (const b of blocks) {
                if (b.x === cx && b.y === cy) {
                    return step;
                }
            }
        }
    }
    return null;
}

function getBlockers(targetPiece) {
    const head = targetPiece.gridPaths[targetPiece.gridPaths.length - 1];
    const dirVec = targetPiece.dirVec;
    let cx = head.x; let cy = head.y;
    
    let blockers = [];
    let maxSteps = Math.max(cols, rows);
    for (let step = 1; step <= maxSteps; step++) {
        cx += dirVec.dx; cy += dirVec.dy;
        for (const other of pieces) {
            if (other.id === targetPiece.id) continue;
            const blocks = getBlocks(other);
            for (const b of blocks) {
                if (b.x === cx && b.y === cy) {
                    if (!blockers.includes(other)) blockers.push(other);
                }
            }
        }
        if (blockers.length > 0) return blockers;
    }
    return blockers;
}

function getPointAtDistance(pixelPaths, dirVec, dist, totalLength) {
    if (dist >= totalLength) {
        let excess = dist - totalLength;
        let lastP = pixelPaths[pixelPaths.length - 1];
        return {
            x: lastP.x + dirVec.dx * excess,
            y: lastP.y + dirVec.dy * excess
        };
    }
    let currentDist = 0;
    for (let i = 0; i < pixelPaths.length - 1; i++) {
        let p1 = pixelPaths[i]; let p2 = pixelPaths[i+1];
        let segLen = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        if (dist <= currentDist + segLen) {
            let ratio = (dist - currentDist) / segLen;
            return {
                x: p1.x + (p2.x - p1.x) * ratio,
                y: p1.y + (p2.y - p1.y) * ratio
            };
        }
        currentDist += segLen;
    }
    return pixelPaths[pixelPaths.length - 1];
}

function getPathPoints(piece) {
    let pts = [];
    let dStart = piece.offset;
    let dEnd = piece.offset + piece.totalLength;
    
    pts.push(getPointAtDistance(piece.pixelPaths, piece.dirVec, dStart, piece.totalLength));
    let currentDist = 0;
    for (let i = 0; i < piece.pixelPaths.length - 1; i++) {
        let p1 = piece.pixelPaths[i]; let p2 = piece.pixelPaths[i+1];
        let segLen = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        currentDist += segLen;
        if (currentDist > dStart && currentDist < dEnd) pts.push(p2);
    }
    pts.push(getPointAtDistance(piece.pixelPaths, piece.dirVec, dEnd, piece.totalLength));
    return pts;
}

function getPieceColor(piece) {
    if (piece.errorMarked || piece.state === 'ERROR') return '#FF3B30';
    return getGameTheme().arrow;
}

function gridToPixel(gx, gy) {
    return {
        x: offsetX + gx * cellSize + cellSize / 2,
        y: offsetY + gy * cellSize + cellSize / 2
    };
}

function getPieceBodyCells(piece) {
    const cells = new Set();
    for (let i = 0; i < piece.gridPaths.length - 1; i++) {
        const pt = piece.gridPaths[i];
        cells.add(`${pt.x},${pt.y}`);
    }
    return cells;
}

function isCellOccupiedByOther(cx, cy, pieceId) {
    const all = [...pieces, ...animatingPieces];
    for (const other of all) {
        if (other.id === pieceId) continue;
        for (const b of getBlocks(other)) {
            if (b.x === cx && b.y === cy) return true;
        }
    }
    return false;
}

function getEscapePreviewPoints(piece) {
    const head = piece.gridPaths[piece.gridPaths.length - 1];
    const body = getPieceBodyCells(piece);
    const pts = [gridToPixel(head.x, head.y)];
    let cx = head.x;
    let cy = head.y;

    while (true) {
        const nx = cx + piece.dirVec.dx;
        const ny = cy + piece.dirVec.dy;

        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) {
            const last = pts[pts.length - 1];
            let ex = last.x;
            let ey = last.y;
            const pad = 12;
            while(
                ex + piece.dirVec.dx * 5 >= pad && 
                ex + piece.dirVec.dx * 5 <= canvas.width - pad && 
                ey + piece.dirVec.dy * 5 >= pad && 
                ey + piece.dirVec.dy * 5 <= canvas.height - pad
            ) {
                ex += piece.dirVec.dx * 5;
                ey += piece.dirVec.dy * 5;
            }
            if (ex !== last.x || ey !== last.y) {
                pts.push({ x: ex, y: ey });
            }
            break;
        }
        if (body.has(`${nx},${ny}`)) break;
        if (isCellOccupiedByOther(nx, ny, piece.id)) {
            pts.push(gridToPixel(nx, ny));
            break;
        }
        cx = nx;
        cy = ny;
        pts.push(gridToPixel(cx, cy));
    }
    return pts;
}

function getHintStyle(difficulty) {
    const tier = difficulty?.tier ?? 3;
    if (tier === 1) return { mode: 'hover', alpha: 0.5, widthMul: 1 };
    if (tier === 2) return { mode: 'hover', alpha: 0.42, widthMul: 1 };
    if (tier === 3) return { mode: 'hover', alpha: 0.36, widthMul: 1 };
    return { mode: 'hover', alpha: 0.3, widthMul: 0.95 };
}

function drawPathHint(piece, style) {
    const pts = getEscapePreviewPoints(piece);
    if (pts.length < 2) return;

    const alpha = style.alpha;
    const theme = getGameTheme();
    const hintStroke = `rgba(${theme.pathRGB},${alpha})`;

    ctx.save();
    ctx.strokeStyle = hintStroke;
    ctx.fillStyle = hintStroke;
    ctx.lineWidth = arrowLineWidth * style.widthMul;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();

    const last = pts[pts.length - 1];
    const prev = pts[pts.length - 2];
    const angle = Math.atan2(last.y - prev.y, last.x - prev.x);
    const sz = Math.max(arrowLineWidth * 0.85, 4);
    ctx.translate(last.x, last.y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(sz * 0.55, 0);
    ctx.lineTo(-sz * 0.42, sz * 0.48);
    ctx.lineTo(-sz * 0.42, -sz * 0.48);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function findPieceAtPixel(x, y) {
    let found = null;
    let minDist = Infinity;
    pieces.forEach(p => {
        if (p.state !== 'IDLE') return;
        for (let i = 0; i < p.pixelPaths.length - 1; i++) {
            const p1 = p.pixelPaths[i];
            const p2 = p.pixelPaths[i + 1];
            const l2 = Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
            if (l2 === 0) continue;
            const t = Math.max(0, Math.min(1, ((x - p1.x) * (p2.x - p1.x) + (y - p1.y) * (p2.y - p1.y)) / l2));
            const projX = p1.x + t * (p2.x - p1.x);
            const projY = p1.y + t * (p2.y - p1.y);
            const dist = Math.hypot(x - projX, y - projY);
            if (dist < cellSize * 0.6 && dist < minDist) {
                minDist = dist;
                found = p;
            }
        }
    });
    return found;
}

function drawArrowHead(ctx, x, y, dir, size, color, isKey, isLocked) {
    ctx.save();
    ctx.translate(x, y);
    if (dir === 'RIGHT') ctx.rotate(0);
    else if (dir === 'DOWN') ctx.rotate(Math.PI / 2);
    else if (dir === 'LEFT') ctx.rotate(Math.PI);
    else if (dir === 'UP') ctx.rotate(-Math.PI / 2);

    if (isKey) {
        // Draw Key Icon
        ctx.beginPath();
        ctx.arc(-size*0.1, 0, size*0.3, 0, Math.PI*2);
        ctx.moveTo(size*0.2, 0);
        ctx.lineTo(size*0.6, 0);
        ctx.moveTo(size*0.4, 0);
        ctx.lineTo(size*0.4, size*0.2);
        ctx.moveTo(size*0.6, 0);
        ctx.lineTo(size*0.6, size*0.2);
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = arrowLineWidth * 0.8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    } else if (isLocked) {
        // Draw Lock Icon
        ctx.beginPath();
        ctx.rect(-size*0.3, -size*0.1, size*0.6, size*0.5);
        ctx.moveTo(-size*0.15, -size*0.1);
        ctx.lineTo(-size*0.15, -size*0.3);
        ctx.arc(0, -size*0.3, size*0.15, Math.PI, 0);
        ctx.lineTo(size*0.15, -size*0.1);
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = arrowLineWidth * 0.6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    } else {
        ctx.beginPath();
        const wingX = -size * 0.55;
        const wingY = size * 0.55;

        ctx.moveTo(wingX, wingY);
        ctx.lineTo(0, 0);
        ctx.lineTo(wingX, -wingY);

        ctx.strokeStyle = color;
        ctx.lineWidth = arrowLineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    }
    ctx.restore();
}

function draw() {
    if (!isGameRunning || !canvas || !ctx) return;
    if (canvas.width < 8 || canvas.height < 8) {
        scheduleGameResize();
        return;
    }

    const theme = getGameTheme();
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const toggleHintStyle = { alpha: 0.42, widthMul: 1 };
    if (pathHintsVisible) {
        pieces.forEach(p => {
            if (p.state === 'IDLE') drawPathHint(p, toggleHintStyle);
        });
    }

    const headSize = cellSize * ARROW_HEAD_CELL_RATIO;

    ctx.lineWidth = arrowLineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2.5;

    const allPieces = [...pieces, ...animatingPieces];

    allPieces.forEach(p => {
        const color = getPieceColor(p);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        let pts = getPathPoints(p);
        if (pts.length < 2) return;

        if (userData.equippedSkin === 'neon') {
            ctx.shadowBlur = 12;
            ctx.shadowColor = color;
        } else {
            ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length - 1; i++) ctx.lineTo(pts[i].x, pts[i].y);

        let headPt = pts[pts.length - 1];
        
        ctx.lineTo(headPt.x, headPt.y);
        ctx.stroke();

        drawArrowHead(ctx, headPt.x, headPt.y, p.dir, headSize, color, p.isKey, p.isLocked);
    });

    // Draw Trails
    allPieces.forEach(p => {
        if (p.history && p.history.length > 1) {
            ctx.beginPath();
            ctx.moveTo(p.history[0].x, p.history[0].y);
            for (let i = 1; i < p.history.length; i++) {
                ctx.lineTo(p.history[i].x, p.history[i].y);
            }
            ctx.strokeStyle = getPieceColor(p);
            ctx.lineWidth = arrowLineWidth * 0.8;
            ctx.globalAlpha = 0.5;
            if (userData.equippedSkin === 'neon') ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        }
    });

    // Draw Floating Texts
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    floatingTexts.forEach(ft => {
        ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
        ctx.font = `bold ${ft.size}px sans-serif`;
        ctx.fillStyle = ft.color;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.strokeText(ft.text, ft.x, ft.y);
        ctx.fillText(ft.text, ft.x, ft.y);
    });
    ctx.globalAlpha = 1;

    // Draw Confetti
    confettiParticles.forEach(cp => {
        ctx.globalAlpha = Math.max(0, cp.life / cp.maxLife);
        ctx.fillStyle = cp.color;
        ctx.save();
        ctx.translate(cp.x, cp.y);
        ctx.rotate(cp.angle);
        ctx.fillRect(-cp.size/2, -cp.size/2, cp.size, cp.size);
        ctx.restore();
    });
    ctx.globalAlpha = 1;
}

let effectsLoopRunning = false;
function startEffectsLoop() {
    if (effectsLoopRunning) return;
    effectsLoopRunning = true;
    function loop() {
        if (!isGameRunning) {
            effectsLoopRunning = false;
            return;
        }
        let needsDraw = false;
        
        if (floatingTexts.length > 0) {
            for (let i = floatingTexts.length - 1; i >= 0; i--) {
                floatingTexts[i].life--;
                floatingTexts[i].y -= 0.8;
                if (floatingTexts[i].life <= 0) floatingTexts.splice(i, 1);
            }
            needsDraw = true;
        }
        
        if (confettiParticles.length > 0) {
            for (let i = confettiParticles.length - 1; i >= 0; i--) {
                let p = confettiParticles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.3; // gravity
                p.angle += p.va;
                p.life--;
                if (p.life <= 0) confettiParticles.splice(i, 1);
            }
            needsDraw = true;
        }
        
        if (screenShakeFrames > 0) {
            screenShakeFrames--;
            if (screenShakeFrames === 0) {
                gameScreen.classList.remove('shake-active');
            }
        }
        
        if (needsDraw) {
            draw();
            requestAnimationFrame(loop);
        } else {
            effectsLoopRunning = false;
        }
    }
    requestAnimationFrame(loop);
}

function addFloatingText(text, c, r, color = '#ffffff', size = 24) {
    let x = c * cellSize + cellSize / 2 + panOffset.x;
    let y = r * cellSize + cellSize / 2 + panOffset.y;
    floatingTexts.push({ text, x, y, color, size, life: 60, maxLife: 60 });
    startEffectsLoop();
}

function spawnConfetti(x, y) {
    const colors = ['#facc15', '#ef4444', '#3b82f6', '#22c55e', '#a855f7'];
    for(let i=0; i<50; i++) {
        confettiParticles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 1) * 15,
            va: (Math.random() - 0.5) * 0.2,
            angle: Math.random() * Math.PI * 2,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 100 + Math.random() * 50,
            maxLife: 150
        });
    }
    startEffectsLoop();
}

function animateEscape(piece, onComplete) {
    let speed = cellSize * 0.5;
    piece.history = []; // Initialize trail history
    
    function step() {
        if(!isGameRunning) return;
        piece.offset += speed;
        
        // Track History
        let cx = piece.c * cellSize + cellSize / 2 + panOffset.x;
        let cy = piece.r * cellSize + cellSize / 2 + panOffset.y;
        let px = cx, py = cy;
        if (piece.dir === 0) py -= piece.offset;
        else if (piece.dir === 1) px += piece.offset;
        else if (piece.dir === 2) py += piece.offset;
        else if (piece.dir === 3) px -= piece.offset;
        
        piece.history.push({x: px, y: py});
        if (piece.history.length > 15) piece.history.shift();
        
        draw();
        
        if (piece.offset > piece.totalLength + Math.max(canvas.width, canvas.height)) {
            if (onComplete) onComplete();
        } else {
            requestAnimationFrame(step);
        }
    }
    requestAnimationFrame(step);
}

function animateBump(piece, onComplete) {
    // Trigger Shake
    screenShakeFrames = 15;
    gameScreen.classList.add('shake-active');
    addFloatingText('Blocked!', piece.c, piece.r, '#ef4444', 20);
    startEffectsLoop();

    let forward = true;
    let dist = getDistanceToBlocker(piece);
    let maxBump = dist ? Math.max(cellSize * 0.15, dist * cellSize - cellSize * 0.5) : (cellSize * 0.15); 
    let speed = cellSize * 0.4;
    
    function step() {
        if(!isGameRunning) return;
        
        if (forward) {
            piece.offset += speed;
            if (piece.offset >= maxBump) {
                piece.offset = maxBump;
                forward = false;
                if(typeof vibrate !== 'undefined') vibrate('Light');
            }
        } else {
            piece.offset -= speed;
            if (piece.offset <= 0) {
                piece.offset = 0;
                if (onComplete) onComplete();
                return;
            }
        }
        draw();
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

function levelComplete() {
    if(typeof playSound !== 'undefined') playSound('win');
    vibrate('Medium');
    spawnConfetti(canvas.width / 2, canvas.height / 2);

    setTimeout(() => {
        const today = new Date();
        const todayStr = getLocalDateStr(today);
        if (!userData.completedDays) userData.completedDays = [];
        if (!userData.completedDays.includes(todayStr)) {
            userData.completedDays.push(todayStr);
        }
        updateUserStreak();

        if (isDailyChallengeMode) {
            userData.lastDailyChallenge = todayStr;
        userData.coins += 500;

        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();
        let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        let completedThisMonth = 0;
        for (let i = 1; i <= daysInMonth; i++) {
            let dStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            if (userData.completedDays.includes(dStr)) completedThisMonth++;
        }

        let trophyId = `Trophy_${currentMonth}`;
        if (completedThisMonth === daysInMonth && !userData.rewards.includes(trophyId)) {
            userData.rewards.push(trophyId);
            saveData();
            document.querySelector('#reward-modal p').innerText = "You completed the Monthly Challenge!";
            rewardModal.classList.remove('hidden');
        } else {
            saveData();
            isDailyChallengeMode = false;
            exitGame(true);
        }
        return;
    }

    userData.level++;
    userData.score += 15;
    userData.coins += 15;
    
    let showReward = false;
    if (userData.level > 41) { 
        userData.nightmareCompleted++;
        if (userData.nightmareCompleted > 0 && userData.nightmareCompleted % 10 === 0) {
            userData.rewards.push(`<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`);
            showReward = true;
        }
    }
    
    saveData();
    
        if (showReward) {
            rewardModal.classList.remove('hidden');
        } else {
            rollNextDifficulty();
            startGameWithLevel(nextPlayDifficulty, userData.level);
        }
    }, 1500);
}

if (streakBtn) {
    streakBtn.addEventListener('click', () => {
        if(typeof playSound !== 'undefined') playSound('click');
        updateWeeklyStreak();
        streakModal.classList.remove('hidden');
    });
}

if (streakOkBtn) {
    streakOkBtn.addEventListener('click', () => {
        if(typeof playSound !== 'undefined') playSound('click');
        streakModal.classList.add('hidden');
    });
}

if (rewardOkBtn) rewardOkBtn.addEventListener('click', () => {
    rewardModal.classList.add('hidden');
    if (isDailyChallengeMode) {
        isDailyChallengeMode = false;
        exitGame(true);
    } else {
        rollNextDifficulty();
        startGameWithLevel(nextPlayDifficulty, userData.level);
    }
});

// UNDO FUNCTIONALITY
if (undoBtn) undoBtn.addEventListener('click', () => {
    if (!isGameRunning || moveHistory.length === 0) return;
    const lastPiece = moveHistory.pop();
    pieces.push(lastPiece);
    animatingPieces = animatingPieces.filter(p => p.id !== lastPiece.id);
    updatePixelPaths();
    draw();
});

if (canvas) {
    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function getTouchDistance(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y);
    }

    function canUseZoomPan() {
        return true;
    }

    function applyZoomAt(centerX, centerY, newZoom) {
        newZoom = clamp(newZoom, MIN_ZOOM, MAX_ZOOM);
        const prevCellSize = cellSize;
        zoomScale = newZoom;
        cellSize = baseCellSize * zoomScale;
        arrowLineWidth = Math.max(cellSize * ARROW_WIDTH_RATIO, 4);

        const ratio = cellSize / prevCellSize;
        offsetX = centerX - (centerX - offsetX) * ratio;
        offsetY = centerY - (centerY - offsetY) * ratio;
        updatePixelPaths();
        draw();
    }

    function clampPan(x, min, max) {
        return Math.max(min, Math.min(max, x));
    }

    function clampPanOffset(x, y) {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        const totalW = cols * cellSize;
        const totalH = rows * cellSize;

        const padX = w * 0.15;
        const padY = h * 0.25;

        if (totalW <= w) {
            x = (w - totalW) / 2;
        } else {
            x = clampPan(x, w - totalW - padX, padX);
        }

        if (totalH <= h) {
            y = (h - totalH) / 2;
        } else {
            y = clampPan(y, h - totalH - padY, padY);
        }

        return { x, y };
    }

    function updatePinchZoom() {
        const points = Array.from(pinchPointers.values());
        if (!canUseZoomPan() || points.length !== 2 || pinchStartDistance <= 0) return;
        const newDist = getTouchDistance(points[0], points[1]);
        const centerX = (points[0].x + points[1].x) / 2 - canvas.getBoundingClientRect().left;
        const centerY = (points[0].y + points[1].y) / 2 - canvas.getBoundingClientRect().top;
        applyZoomAt(centerX, centerY, pinchStartZoom * (newDist / pinchStartDistance));
    }

    function updateDrag(e) {
        if (!dragStart || dragPointerId !== e.pointerId) return;
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        const next = clampPanOffset(dragStart.ox + dx, dragStart.oy + dy);
        offsetX = next.x;
        offsetY = next.y;
        updatePixelPaths();
        draw();
    }

    // OLD EVENTS REMOVED
    canvas.addEventListener('wheel', (e) => {
        if (!isGameRunning || !canUseZoomPan()) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const centerX = e.clientX - rect.left;
        const centerY = e.clientY - rect.top;
        const delta = e.deltaY > 0 ? -0.08 : 0.08;
        applyZoomAt(centerX, centerY, zoomScale + delta);
    }, { passive: false });
    // OLD POINTERDOWN REMOVED

    // iOS Safari fallback removed
    function triggerPieceEscape(clickedPiece) {
        if (clickedPiece.isLocked) {
            if(typeof playSound !== 'undefined') playSound('error');
            vibrate('Medium');
            animateBump(clickedPiece, () => { draw(); });
            return;
        }

        let blockers = getBlockers(clickedPiece);
        if (blockers.length === 0) {
            // Save state for undo
            const clone = { 
                ...clickedPiece, 
                gridPaths: JSON.parse(JSON.stringify(clickedPiece.gridPaths)), 
                dirVec: {...clickedPiece.dirVec} 
            };
            clone.offset = 0;
            clone.state = 'IDLE';
            moveHistory.push(clone);
            
            if(typeof playSound !== 'undefined') playSound('tap');
            vibrate('Light');

            const idx = pieces.findIndex(p => p.id === clickedPiece.id);
            pieces.splice(idx, 1);
            animatingPieces.push(clickedPiece);

            if (clickedPiece.isKey) {
                if(typeof playSound !== 'undefined') playSound('win');
                pieces.forEach(p => {
                    if (p.isLocked) p.isLocked = false;
                });
            }
            
            animateEscape(clickedPiece, () => {
                animatingPieces = animatingPieces.filter(p => p.id !== clickedPiece.id);
                if (pieces.length === 0 && animatingPieces.length === 0) {
                    levelComplete();
                }
            });
        } else {
            if(typeof playSound !== 'undefined') playSound('error');
            vibrate('Heavy');

            clickedPiece.state = 'ERROR';
            blockers.forEach(b => b.state = 'ERROR');
            const lostLife = !clickedPiece.errorMarked;
            clickedPiece.errorMarked = true;
            animateBump(clickedPiece, () => {
                clickedPiece.state = 'IDLE';
                blockers.forEach(b => b.state = 'IDLE');
                draw();
                if (lostLife) {
                    lives--;
                    updateHearts();
                    if (lives <= 0 && overlay.classList.contains('hidden')) {
                        modalTitle.innerText = "Game Over";
                        modalBtn.innerText = "Try Again";
                        overlay.classList.remove('hidden');
                    }
                }
            });
        }
    }

    canvas.addEventListener('pointerdown', (e) => {
        if (!isGameRunning) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        
        try {
            if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
        } catch(err) {}

        if (e.pointerType === 'touch') {
            pinchPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
            if (pinchPointers.size === 2) {
                const points = Array.from(pinchPointers.values());
                pinchStartDistance = getTouchDistance(points[0], points[1]);
                pinchStartZoom = zoomScale;
                dragPointerId = null;
                dragStart = null;
                isPanning = false;
                return;
            }
        }
        if (pinchPointers.size > 1) return;

        dragPointerId = e.pointerId;
        dragStart = { x: e.clientX, y: e.clientY, ox: offsetX, oy: offsetY };
        isPanning = false;
    });

    canvas.addEventListener('pointermove', (e) => {
        if (!isGameRunning) return;
        
        if (e.pointerType === 'touch' && pinchPointers.has(e.pointerId)) {
            e.preventDefault();
            pinchPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
            if (pinchPointers.size === 2 && pinchStartDistance > 0) {
                const points = Array.from(pinchPointers.values());
                const newDist = getTouchDistance(points[0], points[1]);
                const rect = canvas.getBoundingClientRect();
                const centerX = (points[0].x + points[1].x) / 2 - rect.left;
                const centerY = (points[0].y + points[1].y) / 2 - rect.top;
                if (canUseZoomPan()) {
                    applyZoomAt(centerX, centerY, pinchStartZoom * (newDist / pinchStartDistance));
                }
            }
            return;
        }

        if (dragStart && dragPointerId === e.pointerId) {
            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;
            if (!isPanning && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
                isPanning = true;
            }
            if (isPanning && canUseZoomPan()) {
                e.preventDefault();
                const next = clampPanOffset(dragStart.ox + dx, dragStart.oy + dy);
                offsetX = next.x;
                offsetY = next.y;
                updatePixelPaths();
                draw();
            }
            return;
        }

        if (e.pointerType === 'mouse') {
            const style = getHintStyle(window.currentDifficulty);
            if (style.mode !== 'hover') return;
            const rect = canvas.getBoundingClientRect();
            const next = findPieceAtPixel(e.clientX - rect.left, e.clientY - rect.top);
            if (next !== hintedPiece) {
                hintedPiece = next;
                draw();
            }
        }
    });

    canvas.addEventListener('pointerup', (e) => {
        if (e.pointerType === 'touch') {
            pinchPointers.delete(e.pointerId);
            if (pinchPointers.size < 2) pinchStartDistance = 0;
        }
        
        if (dragPointerId === e.pointerId) {
            const wasPanning = isPanning;
            const startPoint = dragStart;
            dragPointerId = null;
            dragStart = null;
            isPanning = false;

            if (!wasPanning && startPoint) {
                const rect = canvas.getBoundingClientRect();
                const x = startPoint.x - rect.left;
                const y = startPoint.y - rect.top;
                const clickedPiece = findPieceAtPixel(x, y);

                if (clickedPiece) {
                    triggerPieceEscape(clickedPiece);
                }
            }
        }
    });

    canvas.addEventListener('pointerleave', () => {
        if (hintedPiece) {
            hintedPiece = null;
            if (isGameRunning) draw();
        }
    });

    canvas.addEventListener('pointercancel', (e) => {
        if (e.pointerType === 'touch') {
            pinchPointers.delete(e.pointerId);
            if (pinchPointers.size < 2) pinchStartDistance = 0;
        }
        if (dragPointerId === e.pointerId) {
            dragPointerId = null;
            dragStart = null;
            isPanning = false;
        }
    });
}

if (modalBtn) modalBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    if (lives <= 0) {
        const diff = window.currentDifficulty || nextPlayDifficulty || rollNextDifficulty();
        startGameWithLevel(diff, isDailyChallengeMode ? 'Challenge' : userData.level);
    }
});

if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
    });
}
if (settingsCloseBtn) {
    settingsCloseBtn.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });
}



document.addEventListener('contextmenu', event => event.preventDefault());

function bootApp() {
    try {
        rollNextDifficulty();
        init();
        initFirebaseAuth();
    } catch (err) {
        console.error('bootApp failed', err);
        showLoginScreen();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootApp);
} else {
    bootApp();
}
