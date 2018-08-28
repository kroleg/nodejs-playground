import {Browser, BrowserContext, Page} from "puppeteer";
import {runNodeApp} from "./_utils";
import {ChildProcess} from "child_process";

const puppeteer = require('puppeteer');
const APP_PORT = 30199;
// @ts-ignore
process.env.PORT = APP_PORT;
const APP_URL = 'http://localhost:' + APP_PORT;
const SINGUP_URL = APP_URL + '/signup';

let browser: Browser;
let appInstance: ChildProcess;

beforeAll(async () => {
    appInstance = await runNodeApp('./server/', []);
    browser = await puppeteer.launch({
        // headless: false,
        // slowMo: 30,
    });
});

afterAll(async () => {
    await browser.close();
    appInstance.kill()
});

describe("Registration", () => {
    it("can register", async () => {
        const browsingContext: BrowserContext = await browser.createIncognitoBrowserContext();
        const page: Page = await browsingContext.newPage();
        await page.goto(SINGUP_URL);
        await page.waitForSelector("[name=email]");
        await page.type("[name=email]", 'new_user' + Math.random() + '@example.com');
        await page.type("[name=password]", '123456');
        await page.click("[type=submit]");
        await page.waitForSelector("nav");
        expect(page.url()).toMatch('/meals');
    }, 10000);
});

describe("Login page", () => {
    it("should login", async () => {
        const browsingContext = await browser.createIncognitoBrowserContext();
        const page: Page = await browsingContext.newPage();
        await page.goto(APP_URL + '/login');
        await page.waitForSelector("[name=email]");
        await page.type("[name=email]", 'admin@example.com');
        await page.type("[name=password]", '123456');
        await page.click("[type=submit]");
        await page.waitForSelector("nav");
        expect(page.url()).toMatch('/meals');
    }, 10000);

    it("should return error if provided non-registered email", async () => {
        const browsingContext = await browser.createIncognitoBrowserContext();
        const page: Page = await browsingContext.newPage();
        await page.goto(APP_URL + '/login');
        await page.waitForSelector("[name=email]");
        await page.type("[name=email]", 'incorrect@example.com');
        await page.type("[name=password]", '123456');
        await page.click("[type=submit]");
        await page.waitForSelector(".alert");
        const alert = await page.$eval(".alert", e => e.innerHTML);
        expect(alert).toEqual('No user with such email')
    }, 10000);

    it("should return error if provided incorrect password", async () => {
        const browsingContext = await browser.createIncognitoBrowserContext();
        const page: Page = await browsingContext.newPage();
        await page.goto(APP_URL + '/login');
        await page.waitForSelector("[name=email]");
        await page.type("[name=email]", 'admin@example.com');
        await page.type("[name=password]", '1');
        await page.click("[type=submit]");
        await page.waitForSelector(".alert");
        const alert = await page.$eval(".alert", e => e.innerHTML);
        expect(alert).toEqual('Invalid password')
    }, 10000);
});