import * as watch from "chokidar";
import * as fse from "fs-extra";
import path from "path";

export function watchDuplicate(...entry: [source: string, target: string][]) {

    for (const [source, target] of entry) {

        const watcher = watch.watch(source, {ignored: ".DS_Store"});

        console.log(`Started watch-duplicate of ${source}, duplicated to ${target}`)

        const fileEquals = (input: string, inputBuffer: Buffer) => {

            const destPath = path.join(target, input.substring(source.length));
            const destBuffer = fse.existsSync(destPath) && fse.readFileSync(destPath);

            return destBuffer && inputBuffer.equals(destBuffer);
        }

        watcher.on("change", (filename, stats) => {
            const inputBuffer = fse.readFileSync(filename);
            if (!fileEquals(filename, inputBuffer)) {
                console.log(`Changed file ${filename}`);
                const destPath = path.join(target, filename.substring(source.length));
                fse.writeFileSync(destPath, inputBuffer);
                // fse.copySync(filename, path.join(target, filename.substring(source.length)), {preserveTimestamps: true});
            }
        });

        watcher.on("add", (filename, stats) => {
            const inputBuffer = fse.readFileSync(filename);
            if (!fileEquals(filename, inputBuffer)) {
                console.log(`Added file ${filename}`);
                fse.copySync(filename, path.join(target, filename.substr(source.length)), {preserveTimestamps: true});
            }
        });

        watcher.on("unlink", (filename, stats) => {
            console.log(`Deleted file ${filename}`);
            fse.removeSync(path.join(target, filename.substr(source.length)));
        });

        watcher.on("unlinkDir", (filename, stats) => {
            console.log(`Deleted dir ${filename}`);
            fse.removeSync(path.join(target, filename.substr(source.length)));
        });
    }

}
