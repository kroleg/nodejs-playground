import {Page} from "puppeteer";
import { App } from './app';
import {Db} from "./db";


const MONGO_URL = 'mongodb://localhost/toptal-ts-e2e';

export { App } from './app';
export {Db} from "./db";

export async function startAppForE2E() {
    const app = new App(MONGO_URL);
    await app.start();
    return app;
}

export async function connectToDbForE2E() {
    const db = new Db(MONGO_URL);
    await db.connect();
    return db;
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
