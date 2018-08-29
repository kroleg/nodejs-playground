import {ChildProcess, fork} from "child_process";

export class App {
    private instance: ChildProcess;
    private readonly processPath = './server/'
    private readonly appPort = 30199;
    private readonly appUrl = 'http://localhost:' + this.appPort;

    async start(): Promise<void> {
        // @ts-ignore
        return new Promise((resolve) => {
            const args = [];
            console.info(`\nrunning ${this.processPath} ${args.join(' ')}`);
            // @ts-ignore
            this.instance = fork(this.processPath, args, {
                env: { ...process.env, PORT: this.appPort }
            });
            this.instance.on('message', message => {
                if (message === 'ready') {
                    resolve();
                }
            });
        });
    }

    stop() {
        this.instance.kill();
    }

    getUrl(path): string {
        return this.appUrl + path;
    }
}
