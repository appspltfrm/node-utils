"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyDirRecursiveSync = copyDirRecursiveSync;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
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
