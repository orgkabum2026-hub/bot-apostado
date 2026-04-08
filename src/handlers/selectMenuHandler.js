const fs = require('fs');
const path = require('path');

// Load all select menu interactions from src/selectMenus
const selectMenuHandlers = {};

const selectMenusDir = path.join(__dirname, '../selectMenus');
fs.readdirSync(selectMenusDir).forEach((file) => {
    const handler = require(path.join(selectMenusDir, file));
    selectMenuHandlers[handler.name] = handler;
});

module.exports = selectMenuHandlers;