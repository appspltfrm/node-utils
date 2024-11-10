import watch from "chokidar";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { copySync, removeSync } from "fs-extra/esm";
import path from "path";
export function watchDuplicate(...entry) {
    for (const [source, target] of entry) {
        const watcher = watch.watch(source, { ignored: ".DS_Store" });
        console.log(`Started watch-duplicate of ${source}, duplicated to ${target}`);
        const fileEquals = (input, inputBuffer) => {
            const destPath = path.join(target, input.substring(source.length));
            const destBuffer = existsSync(destPath) && readFileSync(destPath);
            return destBuffer && inputBuffer.equals(destBuffer);
        };
        watcher.on("change", (filename, stats) => {
            const inputBuffer = readFileSync(filename);
            if (!fileEquals(filename, inputBuffer)) {
                console.log(`Changed file ${filename}`);
                const destPath = path.join(target, filename.substring(source.length));
                writeFileSync(destPath, inputBuffer);
                // fse.copySync(filename, path.join(target, filename.substring(source.length)), {preserveTimestamps: true});
            }
        });
        watcher.on("add", (filename, stats) => {
            const inputBuffer = readFileSync(filename);
            if (!fileEquals(filename, inputBuffer)) {
                console.log(`Added file ${filename}`);
                copySync(filename, path.join(target, filename.substr(source.length)), { preserveTimestamps: true });
            }
        });
        watcher.on("unlink", (filename, stats) => {
            console.log(`Deleted file ${filename}`);
            removeSync(path.join(target, filename.substr(source.length)));
        });
        watcher.on("unlinkDir", (filename, stats) => {
            console.log(`Deleted dir ${filename}`);
            removeSync(path.join(target, filename.substr(source.length)));
        });
    }
}
