# **Waiter bot api**

### Waiter bot api built with Node.js and MongoDB
<br>

## **About**

### This api is the backend of the waiter bot system. We have developed this API on top of the express.js and MongoDB.
<br>

## **Features**
- Versioning
- Tests
- Flexibility

## **Install**
```
git clone https://github.com/shirlymadushanka/waiterbot-api.git
cd waiterbot-api
npm install
```

### You have to add .env file in your root directory and add following env variables.
    1. DB (MongoDB url)
    2. SECRET
    3. PORT

## **Start**
```
npm start
```
<br>

### API runs on port 3000 by default. You can access the root by navigating to the ```http://localhost:3000/api```

<br>

## **Testing**
### Each route has its own test file. That can be found on test/ directory. Validity of the each responses can be found in utils/Validator.js
<br>

### To run the test :

``` 
npm test
```
<br>

## **Collaborator**
* [Buddhi Heshan](https://github.com/buddhiheshan)
* [Kavindu Chamith](https://github.com/kavin-du)
* [Shirly Madushanka](https://github.com/shirlymadushanka)
