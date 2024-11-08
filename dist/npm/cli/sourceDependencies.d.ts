interface SourceDependencies {
    [depsName: string]: {
        modulePath: string;
        srcPath: string;
        srcDir: string;
        repoPath?: string;
    };
}
export declare function sourceDependencies(): SourceDependencies;
export {};
