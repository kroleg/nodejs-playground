// 2. When logged in, a user can see a list of his meals, also he should be able to add, edit and delete meals.
// (user enters calories manually, no auto calculations!)
// 4. Each entry has a date, time, text, and num of calories.

import {Browser, Page} from "puppeteer";
import {startAppForE2E, confirmNextDialog, Db, connectToDbForE2E, register, getMyMeals} from "../_utils/e2e";

import * as puppeteer from 'puppeteer';
import {App} from "../_utils/app";
let browser: Browser;
let app: App;
let db: Db;
let page: Page;

const user = { email: 'user@example.com', password: '12345678' };

jest.setTimeout(15000);

beforeAll(async () => {
    app = await startAppForE2E();
    browser = await puppeteer.launch({
        // headless: false,
        slowMo: 50,
    });
    page = await browser.newPage();
    page.setDefaultNavigationTimeout(2000);
});

beforeAll(async () => {
    db = await connectToDbForE2E();
    await db.wipeUsers();
});

beforeAll(async () => {
    await register(app, browser, user.email, user.password);
    // const userInDb = await db.findUser({ email: user.email });
    // db.createMeal(userInDb._id, { })
})


afterAll(async () => {
    await browser.close();
    await db.disconnect();
    app.stop();
});

describe("My meals", () => {
    it("should show meals page", async () => {
        await page.goto(app.getUrl('/meals'));
        // await page.waitForSelector("nav");
        expect(page.url()).toMatch(/meals$/);
    });

    it("should add meal and show it", async () => {
        await page.goto(app.getUrl('/meals'));
        const addLinkSelector = 'a[href="/meals/add"]';
        // await page.waitForSelector(addLinkSelector);
        await page.click(addLinkSelector)
        // await page.waitForSelector('input[name="calories"]');
        expect(page.url()).toMatch(/meals\/add$/);
        await page.type("[name=calories]", '1000');
        await page.type("[name=note]", 'pizza');
        await page.click("[type=submit]");
        await page.waitForSelector('.meals-list');
        const mealsByDays = await getMyMeals(app, page);
        console.log({ mealsByDays })
        expect(mealsByDays).toHaveLength(1);
        expect(mealsByDays[0].meals).toHaveLength(1);
        // expect(meals[0]).toHaveProperty('time', ) // todo check time
        expect(mealsByDays).toHaveProperty('0.meals.0.calories', 1000);
        expect(mealsByDays).toHaveProperty('0.meals.0.note', 'pizza');
    });

    // todo check that custom date will be displayed correctly too

    it.skip("should list meals", async () => {
        await page.goto(app.getUrl('/meals'));
    });

    it("should remove meal", async () => {
        await page.goto(app.getUrl('/meals'));
        await page.hover('.table_actions--show-on-hover')
        // await page.waitForSelector('.link-danger', { visible: true });
        confirmNextDialog(page);
        await page.click('.link-danger')
        // await page.waitForSelector('.meals-list');
    });
});
