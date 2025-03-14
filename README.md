# NC News Seeding

Hosted Version: https://joe-beaumont-nc-news.onrender.com

Summary: Mimicking a real world backend service such as reddit where articles are posted by users about topics and users can comment on and upvote/downvote articles.

Setup Instructions:
Project can be cloned using the following command: git clone https://github.com/Joe-Beaumont/nc_news.git
In the northcoders-news-BE directory run the command: npm install

Create environment variable
In the northcoders-news-BE directory, create two .env files:
.env.development
.env.production

In each of these files write the following statements respectively:
PGDATABASE=nc_news

DATABASE_URL=postgresql://postgres.gckjkmpfwakgqrmoyhvz:SwAgAxe1993S@aws-0-eu-west-2.pooler.supabase.com:6543/postgres
PGDATABASE=nc_news

Seed Database:
In the northcoders-news-BE directory run the command: npm run seed-dev

npm version number: 10.9.2
PostgreSQL: 16.8

  Dependency Versions
    dotenv: 16.4.7
    express: 4.21.2
    nodemon: 3.1.9
    pg: 8.13.3
    pg-format: 1.0.4