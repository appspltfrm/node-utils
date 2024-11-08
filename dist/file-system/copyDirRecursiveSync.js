"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyDirRecursiveSync = copyDirRecursiveSync;
const fs = require("fs");
const path = require("path");
const copyFileSync_1 = require("./copyFileSync");
function copyDirRecursiveSync(source, target, options) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
    }
    // copy
    if (fs.lstatSync(source).isDirectory()) {
        fs.readdirSync(source).forEach(function (fileName) {
            let file = path.join(source, fileName);
            if (options && options.exclude) {
                for (let e of options.exclude) {
                    if (file.match(e)) {
                        return;
                    }
                }
            }
            if (fs.lstatSync(file).isDirectory()) {
                copyDirRecursiveSync(file, path.join(target, fileName));
            }
            else {
                (0, copyFileSync_1.copyFileSync)(file, path.join(target, fileName));
            }
        });
    }
}
