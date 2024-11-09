"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchDuplicate = watchDuplicate;
const tslib_1 = require("tslib");
const watch = tslib_1.__importStar(require("chokidar"));
const fse = tslib_1.__importStar(require("fs-extra"));
const path_1 = tslib_1.__importDefault(require("path"));
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
