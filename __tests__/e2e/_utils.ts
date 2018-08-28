import {ChildProcess, fork} from "child_process";

export async function runNodeApp(processPath: string, args: string[]): Promise<ChildProcess> {
    // @ts-ignore
    return new Promise((resolve) => {
        console.info(`\nrunning ${processPath} ${args.join(' ')}`);
        const instance: ChildProcess = fork(processPath, args, {
            env: process.env
        });
        instance.on('message', message => {
            if (message === 'ready') {
                resolve(instance);
            }
        });
    });
}
