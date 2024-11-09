"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDirs = createDirs;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
function createDirs(folderPath, mode) {
    const folders = [];
    let tmpPath = path.normalize(folderPath);
    let exists = fs.existsSync(tmpPath);
    while (!exists) {
        folders.push(tmpPath);
        tmpPath = path.join(tmpPath, "..");
        exists = fs.existsSync(tmpPath);
    }
    for (let i = folders.length - 1; i >= 0; i--) {
        fs.mkdirSync(folders[i], mode);
    }
}
