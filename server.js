const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Xuddi shu papkadagi fayllarni ulash (index.html, style.css, app.js)
app.use(express.static(path.join(__dirname, 'www')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'www', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n✨ "Arrows" Anti-Stress o'yini ishga tushdi!`);
    console.log(`🎮 O'yinni ko'rish uchun brauzerda quyidagi manzilga kiring: http://localhost:${PORT}\n`);
});
