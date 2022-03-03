# **NorthCoders News API**

# **Built By Mohammed Kabir Dastgir**

---

## **Back-End**

- Back-end - Hosted link: https://lee-nc-news.herokuapp.com/

## **Front-End**

- Front-End - Hosted link: https://fe-nc-news-app.netlify.app/
- Front-End - Github link: https://github.com/leekli/fe-nc-news

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
$ git clone https://github.com/leekli/nc-news.git
$ cd nc-news
```

### **Installing dependencies:**

- Initialising Node by installing the required dependencies from `package.json`. In your teminal:

```
$ npm install
```

### **Environment setup:**

- You will need to create _two_ `.env` files for the app: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for both dev and test environments.

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
