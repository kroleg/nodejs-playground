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

interface MealInfo {
    calories: number;
    note: string;
    time: string;
}
interface DayInfo {
    meals: MealInfo[];
    date: string;
}
export async function getMyMeals(app, page: Page): Promise<DayInfo[]> {
    await page.goto(app.getUrl('/meals'));
    //@ts-ignore
    return page.$$eval('.meals-table-day tbody', tds => tds.map(tbody => {
        return {
            date: tbody.querySelector('th .day-date').innerHTML,
            meals: Array.from(tbody.querySelectorAll('tr')).map(tr => {
                //@ts-ignore
                const data = Array.from(tr.querySelectorAll('td')).map(td => td.innerHTML);
                if (data.length) {
                    return {time: data[0], calories: Number(data[1]), note: data[2]}
                }
                return null;
            }).filter(meal => !!meal)
        }
    }))
}

export async function clearAndType(page: Page, selector: string, text: string) {
    const elementHandle = await page.$(selector);
    await elementHandle.click();
    await elementHandle.focus();
    // click three times to select all
    await elementHandle.click({clickCount: 3});
    await elementHandle.press('Backspace');
    await page.type(selector, text);
}