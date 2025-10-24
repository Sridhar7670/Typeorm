# Typeorm
Learning TypeORM: Revision

Create a Nest Js project To have some Connection to Db using typeOrm.
code :"
    nest new my-nestjs-project //my-nest.. is the folder name 
    cd my-nestjs-project
    "

installing the necessary packages :
"    npm install @nestjs/typeorm typeorm pg "

for a basic local host set up do this :
code :
"src/app.module.ts 
import { Module } from '@nestjs/common'; 
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { AppController } from './app.controller';
 import { AppService } from './app.service';
  import { User } from './user/user.entity'; // Example entity 
  @Module({ imports: 
        [ TypeOrmModule.forRoot({
             type: 'postgres',
              host: 'localhost', // or your PostgreSQL 
              port: 5432, // or your PostgreSQL port 
              username: 'your_username',
              password: 'your_password',
              database: 'your_database_name', 
              entities: [User], // List your entities here
            synchronize: true, // Set to false in production }), 
            ],
   controllers: [AppController],
   providers: [AppService], })
export class AppModule {}
"

if every taught to connect to some url online :
Using a connection URL:
code Url :"postgres://username:password@host:port/database"


Type orm setup :
"// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // <-- the URL here
      entities: [User],
      synchronize: true, // Set to false in production
      ssl: {
        rejectUnauthorized: false, // required for Supabase or other managed DBs
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
"


Tip : ever Used .env file then we can do this to load the env into nest/config :
"
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),   //we can also mention :envFilePath: ".env" along side gloable true 
    TypeOrmModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
"



what is the need of synchronise true or false why it should be false at production end.

At Devlopment : It allows for quick iteration. As we modify your entities, TypeORM automatically updates the database schema to reflect those changes, eliminating the need to manually write and run schema migrations.

At Production : can lead to irreversible data loss in a production environment. If you rename a column, remove an entity, or change a data type that TypeORM cannot safely migrate, it might drop tables or columns and recreate them, resulting in the loss of existing data.


Why do We need to Write About SSL in Typeorm what is the need in Url based approaches ?
SSl : Secure Socket LAyer just some none sence by web Url , 
rejectUnauthorized : false ;
tells that i trust this certificate , dont block connection.


