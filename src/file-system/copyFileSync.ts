import {writeFileSync, readFileSync} from "fs";

export function copyFileSync(source, target) {
    writeFileSync(target, readFileSync(source));
}
