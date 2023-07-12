# **NorthCoders News API**

# **Built By Mohammed Kabir Dastgir**

---

## **Back-End**

- Back-end - Hosted link: https://mkd-nc-news.onrender.com/api

## **Front-End**

- Front-End - Hosted link: https://mkd-nc-news.netlify.app/
- Front-End - Github link: https://github.com/MKD01/nc-news

---

## **Description**

'News API' is an API built using Node.js, Express.js and a PostgreSQL database.

you can view the API endpoints in the `endpoints.json` file or by going to https://mkd-nc-news.herokuapp.com/api which lists all available endpoints and how they can be interacted with.

---

# **Setup / Installation Instructions**

### **requirements:**

- Node.js 17.x
- Postgres 14.x

### **dependencies:**

Application dependencies and versions can be found in the package.json file.

### **Cloning the repositry:**

- In your teminal:

```
$ git clone https://github.com/MKD01/nc-news-be.git
$ cd nc-news
```

### **Installing dependencies:**

- Initialising Node by installing the required dependencies from `package.json`. In your terminal:

```
$ npm install
```

### **Environment setup:**

- You will need to create _two_ `.env` files for the app: `.env.test` and `.env.development`. Into each, add `PGDATABASE=nc_news` for the `.env.development` file and `PGDATABASE=nc_news_test` for the `.env.test` file.

### **Database set-up and seeding:**

- To begin testing or using this app, you will need to setup the database seed it with data:

```
$ npm run setup-dbs
$ npm run seed
```

# **Testing**

- `Jest` is the framework used to test this application.
- To run tests:

```
$ npm run test
```
