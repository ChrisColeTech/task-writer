export declare const TEST_ENV: {
    TASK_WRITER_TEMP_DIR: string;
    TZ?: string;
};
export declare function cleanTestDirectories(): void;
export declare function createTestDirectory(name: string): string;
export declare class TestFixtures {
    private static FIXTURES_DIR;
    static getFixturePath(category: 'valid' | 'invalid', filename: string): string;
    static copyFixtureToTemp(category: 'valid' | 'invalid', filename: string, tempDir: string): string;
    static createTestProjectStructure(tempDir: string): void;
    static createMalformedFiles(tempDir: string): void;
}
export declare function setupTest(): void;
export declare function cleanupTest(): void;
export declare function isolatedTest(testFn: () => void | Promise<void>): () => Promise<void>;
export declare function createMockFs(mockFiles?: Record<string, string | Error>): {
    readFile: jest.Mock<Promise<Buffer<ArrayBuffer>>, [path: string], any>;
    writeFile: jest.Mock<Promise<void>, [], any>;
    mkdir: jest.Mock<Promise<void>, [], any>;
    chmod: jest.Mock<Promise<void>, [], any>;
    stat: jest.Mock<Promise<{
        isFile: () => true;
        isDirectory: () => false;
        size: number;
        mtime: Date;
    }>, [path: string], any>;
    access: jest.Mock<Promise<void>, [path: string], any>;
};
export declare function createMockExpressObjects(): {
    req: {
        body: {};
        params: {};
        query: {};
        headers: {};
        method: string;
        url: string;
        path: string;
    };
    res: {
        status: jest.Mock<any, any, any>;
        json: jest.Mock<any, any, any>;
        send: jest.Mock<any, any, any>;
        end: jest.Mock<any, any, any>;
        set: jest.Mock<any, any, any>;
        header: jest.Mock<any, any, any>;
    };
    next: jest.Mock<any, any, any>;
};
//# sourceMappingURL=test-isolation.d.ts.map