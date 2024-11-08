import * as fs from "fs";

export function copyFileSync(source, target) {
    fs.writeFileSync(target, fs.readFileSync(source));
}