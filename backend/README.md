## Backend With Hono

1. Install all the depedencies

```bash
npm i
```

2. Copy the .env

```bash
cp .env.example .env
```

3. Change the `DATABASE_URL`. You can check this [link](https://orm.drizzle.team/docs/guides/mysql-local-setup#configure-database-url) for reference.

```bash
DATABASE_URL=mysql://<user>:<password>@<host>:<port>/<database>
# DATABASE_URL=mysql://username:password@localhost:3306/dbName
```
Don't forget to create the database 

4. Push drizzle schema to DB

```bash
npm run db:push
```

5. Seeding products data

```
npm run db:seed
```


6. Run the backend. 

```bash
npm run dev
```

It should be run on `http://localhost:3001`
