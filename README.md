# Waiter bot api 🤖

### Waiter bot api built with Node.js and MongoDB
---

## What is THIS??? 🤔

### This api is the backend of the waiter bot system. We have developed this API on top of the express.js framework and MongoDB.
---
## 🏷️ Features
- Versioning
- Tests
- Flexibility
---
## Ready to set-up? 🔥
```bash
git clone https://github.com/shirlymadushanka/waiterbot-api.git
cd waiterbot-api
npm install
```
---
### 📝 You have to add .env file in your root directory and add following env variables. 
    1. DB (MongoDB url)
    2. SECRET
    3. PORT

    Also you have to configure aws-s3 bucket and enter below details as env variables.

    4. AWS_ACCESS_KEY
    5. AWS_SECRET_ACCESS_KEY
    6. AWS_BUCKET_NAME
    7. S3_BASE_URL

---
## One more step & DONE! 🏁
```bash
npm start
```
## Tadaaa 🎉🎉🎉
You made it.💪 
Congratulations. 😀🏆

---


### ☝️ API runs on port 3000 by default. You can access the root by navigating to the ```http://localhost:3000/api```

---

## 🧪 Time to do some testing 🤯
##### Each module has its own test file. That can be found on __tests__/ directory. Validity of the each responses can be found in utils/Validator.js
---
### Run test as follows :

```bash
npm run test
```
``` 
When running above test you may have to override the default timeout (5000ms) of the jest.
because testing done using mongo-memory-server.
So in first run it will download the mongodb binaries & it will take some time.
```

### To get code coverage report : 📊 

```bash
npm run test:coverage
```

## 👷 Collaborators
* [Buddhi Heshan](https://github.com/buddhiheshan)
* [Kavindu Chamith](https://github.com/kavin-du)
* [Shirly Madushanka](https://github.com/shirlymadushanka)
