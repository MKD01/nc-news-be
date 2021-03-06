# **NorthCoders News API**

# **Built By Mohammed Kabir Dastgir**

---

## **Back-End**

- Back-end - Hosted link: https://mkd-nc-news.herokuapp.com/api

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

### **Application dependencies:**

<i>
  
- npm 8.x
- cors: 2.x
- dotenv 14.x
- express 4.x
- pg 8.x
- pg-format 1.x
  </i>

### **Developer only dependencies:**

<i>

- jest 27.x
- jest-extended: 1.x
- jest-sorted 1.x
- supertest 6.x
  </i>

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

- You will need to create _two_ `.env` files for the app: `.env.test` and `.env.development`. Into each, add `PGDATABASE = nc_news` for the `.env.development` file and `PGDATABASE = nc_news_test` for the `.env.test` file.

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
$ npm test
```
