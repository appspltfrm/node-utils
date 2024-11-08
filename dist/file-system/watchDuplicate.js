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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchDuplicate = watchDuplicate;
const watch = __importStar(require("chokidar"));
const fse = __importStar(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function watchDuplicate(...entry) {
    for (const [source, target] of entry) {
        const watcher = watch.watch(source, { ignored: ".DS_Store" });
        console.log(`Started watch-duplicate of ${source}, duplicated to ${target}`);
        const fileEquals = (input, inputBuffer) => {
            const destPath = path_1.default.join(target, input.substring(source.length));
            const destBuffer = fse.existsSync(destPath) && fse.readFileSync(destPath);
            return destBuffer && inputBuffer.equals(destBuffer);
        };
        watcher.on("change", (filename, stats) => {
            const inputBuffer = fse.readFileSync(filename);
            if (!fileEquals(filename, inputBuffer)) {
                console.log(`Changed file ${filename}`);
                const destPath = path_1.default.join(target, filename.substring(source.length));
                fse.writeFileSync(destPath, inputBuffer);
                // fse.copySync(filename, path.join(target, filename.substring(source.length)), {preserveTimestamps: true});
            }
        });
        watcher.on("add", (filename, stats) => {
            const inputBuffer = fse.readFileSync(filename);
            if (!fileEquals(filename, inputBuffer)) {
                console.log(`Added file ${filename}`);
                fse.copySync(filename, path_1.default.join(target, filename.substr(source.length)), { preserveTimestamps: true });
            }
        });
        watcher.on("unlink", (filename, stats) => {
            console.log(`Deleted file ${filename}`);
            fse.removeSync(path_1.default.join(target, filename.substr(source.length)));
        });
        watcher.on("unlinkDir", (filename, stats) => {
            console.log(`Deleted dir ${filename}`);
            fse.removeSync(path_1.default.join(target, filename.substr(source.length)));
        });
    }
}
