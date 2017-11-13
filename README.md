# Manage a Book Trading Club

Fourth dynamic web application from the Free Code Camp back end development certification.

### Objective: 
Build a full stack JavaScript app that is functionally similar to 
this: http://bookjump.herokuapp.com/ and deploy it to Heroku.

### User stories: 

  - I can view all books posted by every user.
  - I can add a new book.
  - I can update my settings to store my full name, city, and state.
  - I can propose a trade and wait for the other user to accept the trade.

### Live Version:
https://book-trading-clb.herokuapp.com/

### Requirements:
- Node.js
- NPM
- Mongodb
- Passport.js
- Facebook and Twitter Auth Keys

### Installation:

1.Install dependecies 

```sh
$ npm install
```

2.Create a .env file on the app root folder with the following info

```sh
BASEURL=[main url of application]

MONGO_URI=[mongodb url]

TWITTER_KEY=[twitter key]
TWITTER_SECRET=[twitter secret]

FB_CLIENT_ID=[fb client id]
FB_CLIENT_SECRET=[fb client secret] 

```
### Run:

```sh
$ npm start
```
