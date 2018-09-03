import {ChildProcess, fork} from "child_process";
import { MongoClient } from 'mongodb';
import {Page} from "puppeteer";

const MONGO_URL = 'mongodb://localhost/toptal-ts-e2e';

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
                env: { ...process.env, PORT: this.appPort, MONGO_URL }
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

    getLoginUrl () {
        return this.getUrl('/login');
    }

    getRegistrationUrl () {
        return this.getUrl('/signup');
    }
}

export class Db {
    private connection: MongoClient;

    async connect() {
        this.connection = await MongoClient.connect(MONGO_URL);
        console.info('test env connected to mongodb')
    }

    async disconnect() {
        this.connection && this.connection.close();
    }

    async wipeUsers() {
        return this.connection.db().collection('users').deleteMany({});
    }

    async getAllUsers() {
        return this.connection.db().collection('users').find({}).toArray()
    }
}

export async function login (app, browser, email, password) {
    const page = await browser.newPage();
    await page.goto(app.getLoginUrl());
    await page.waitForSelector("[name=email]");
    await page.type("[name=email]", email);
    await page.type("[name=password]", password);
    await page.click("[type=submit]");
    await page.waitForSelector("nav");
}

export async function register (app, browser, email = 'admin@example.com', password = '123456') {
    const page = await browser.newPage();
    await page.goto(app.getRegistrationUrl());
    await page.waitForSelector("[name=email]");
    await page.type("[name=email]", email);
    await page.type("[name=password]", password);
    await page.click("[type=submit]");
    await page.waitForSelector("nav");
    await page.close();
}

export function confirmNextDialog(page: Page) {
    page.once("dialog", (dialog) => {
        dialog.accept();
    });
}
