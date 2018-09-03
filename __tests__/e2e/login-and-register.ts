import {Browser, BrowserContext, Page} from "puppeteer";
import { App, startAppForE2E } from "../_utils/e2e";

const puppeteer = require('puppeteer');

let browser: Browser;
let app: App;
let loginUrl: string;

beforeAll(async () => {
    app = await startAppForE2E();
    loginUrl = app.getUrl('/login');
    browser = await puppeteer.launch({
        // headless: false,
        // slowMo: 30,
    });
});

afterAll(async () => {
    await browser.close();
    app.stop()
});

describe("Registration", () => {
    it("can register", async () => {
        const browsingContext: BrowserContext = await browser.createIncognitoBrowserContext();
        const page: Page = await browsingContext.newPage();
        await page.goto(app.getUrl('/signup'));
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
        await page.goto(loginUrl);
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
        await page.goto(loginUrl);
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
        await page.goto(loginUrl);
        await page.waitForSelector("[name=email]");
        await page.type("[name=email]", 'admin@example.com');
        await page.type("[name=password]", '1');
        await page.click("[type=submit]");
        await page.waitForSelector(".alert");
        const alert = await page.$eval(".alert", e => e.innerHTML);
        expect(alert).toEqual('Invalid password')
    }, 10000);
});