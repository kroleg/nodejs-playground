1. User must be able to create an account and log in.
2. When logged in, a user can see a list of his meals, also he should be able to add, edit and delete meals.
 (user enters calories manually, no auto calculations!)
3. Implement at least three roles with different permission levels:
 a. regular user would only be able to CRUD on their owned records,
 b. user manager would be able to CRUD users,
 c. admin would be able to CRUD all records and users.
4. Each entry has a date, time, text, and num of calories.
5. Filter by dates from-to, time from-to (e.g. how much calories have I had for lunch each day in the last month if lunch is between 12 and 15h).
6. User setting – Expected number of calories per day.
7. When displayed, it goes green if the total for that day is less than expected number of calories per day, otherwise goes red.
8. REST API. Make it possible to perform all user actions via the API, including authentication.
9. In any case, you should be able to explain how a REST API works and demonstrate that by creating functional tests
that use the REST Layer directly. Please be prepared to use REST clients like Postman, cURL, etc. for this purpose.
10. It must be a single-page application. All actions need to be done client side using AJAX, refreshing the page is not acceptable.
11. Minimal UI/UX design is needed. You will not be marked on graphic design. However, do try to keep it as tidy as possible.
12. Bonus: unit and e2e tests.