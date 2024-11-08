"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globCopy = globCopy;
const fs = require("fs");
const Glob = require("glob");
const path = require("path");
const copyFileSync_1 = require("./copyFileSync");
const createDirs_1 = require("./createDirs");
function globCopy(source, segments, target) {
    const sourceDir = path.resolve(source);
    const targetDir = path.resolve(target);
    segments.forEach(function (query) {
        if (typeof query === "string") {
            Glob.sync((query.charAt(0) === "/" ? "" : "/") + query, { root: sourceDir }).forEach((segment) => {
                const sourcePath = path.resolve(sourceDir, segment);
                const targetPath = path.resolve(targetDir, segment.replace(sourceDir + "/", ""));
                const stat = fs.statSync(sourcePath);
                if (stat.isFile()) {
                    (0, createDirs_1.createDirs)(path.dirname(targetPath));
                    (0, copyFileSync_1.copyFileSync)(sourcePath, targetPath);
                }
            });
        }
    });
}