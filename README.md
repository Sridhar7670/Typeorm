# Learning TypeORM with NestJS: A Revision Guide

This document outlines the steps to integrate [TypeORM] into a NestJS project, configure it for different environments, and understand key configuration options.

## 1. Create a NestJS Project

First, create a new NestJS project if you don't have one already.
```bash 
nest new my-nestjs-project
cd my-nestjs-project
```

## 2. Install Dependencies

Install the necessary packages for NestJS, TypeORM, and the PostgreSQL driver.
```bash 
npm install @nestjs/typeorm typeorm pg
```

## 3. Configuration

You can configure TypeORM in two main ways.

Basic Localhost Setup

For a basic local setup, you can directly add the configuration to your src/app.module.ts.
```bash 
// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/user.entity'; // Example entity

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // or your PostgreSQL host
      port: 5432, // or your PostgreSQL port
      username: 'your_username',
      password: 'your_password',
      database: 'your_database_name',
      entities: [User], // List your entities here
      synchronize: true, // Set to false in production
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
---
URL-Based Setup (Recommended for Production/Cloud)

For connecting to a cloud database (like on Heroku, Render, or Supabase), using a connection URL is much cleaner.

The URL format is:
```bash 
postgres://username:password@host:port/database
```
---

You can then use this URL in your app.module.ts, which is often loaded from environment variables.
```bash 
// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // <-- The URL is used here
      entities: [User],
      synchronize: true, // Set to false in production
      ssl: {
        rejectUnauthorized: false, // Often required for Supabase or other managed DBs
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```
## 4. Tip: Using Environment Variables (.env)

To load process.env.DATABASE_URL, you should use the @nestjs/config package.
```bash 
// src/app.module.ts
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // You can also specify a path:
      // envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      // ... your config that uses process.env
    }),
  ],
})
export class AppModule {}
```

## 5. Key Concepts Explained
### Why should `synchronize` be false in production?

- **Development (`synchronize: true`)**  
  - Great for rapid development.  
  - As you change your entities (e.g., add a column), TypeORM automatically updates your database schema to match.  
  - Saves you from writing manual migrations.

- **Production (`synchronize: false`)**  
  - Setting this to `true` in production is extremely dangerous.  
  - If you accidentally rename a column or remove an entity, TypeORM might drop the table or column to "synchronize" the schema.  
  - This can lead to **irreversible data loss**.  
  - In production, always use migrations instead.

---

### What is the need for `ssl: { rejectUnauthorized: false }`?

- **SSL (Secure Sockets Layer)**  
  - Encrypts the connection between your app and the database.  
  - Essential for security over the internet.

- **`rejectUnauthorized: false`**  
  - Managed databases often use **self-signed SSL certificates**.  
  - By default, Node.js (and thus TypeORM) rejects these connections because they aren’t signed by a globally trusted Certificate Authority (CA).  
  - Setting `rejectUnauthorized: false` tells the client to **trust the server’s certificate** and allow the connection.

---

To Create an User Entity go to cli do these steps:
these lines create module controller and services (basic) then we 
CLI: 

```bash 
nest g module user  //this will create a basic module for user inside folder 
nest g controller /user
nest g service /user
```

create a docker image for postgress then connect that to the nest js:
### this way we can create a basic docker image and then connect t to nest js and typeorm
```bash 
version: '3.8'
services:
  postgres:
    image: postgres:16
    container_name: typeorm
    environment:
      POSTGRES_USER: sridhar
      POSTGRES_PASSWORD: root
      POSTGRES_DB: typeorm_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```


once connection is properly estabished then we need to **Create Entity:**

An Entity is a class that directly maps to a database table or a collection of data in a database. It serves as the blueprint for the structure and relationships of the data that will be stored.  


```bash 
// src/enities/User.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;
}
```

now we have to go into user modules and then do this 


```bash
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/enities/User';

@Module({
  imports:[TypeOrmModule.forFeature([User])], //importing it here 
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
```

import that into main module like this 
```bash 
@Module({
  imports: [
    TypeOrmModule.forRoot({
      // ... your config
    }),
    UserModule, // <-- Add the UserModule here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

CRUD LOGIC IN SERVICE :
```bash 
// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../enities/User';
import { CreateUserDto } from './dto/create-user.dto'; // <-- Import
import { UpdateUserDto } from './dto/update-user.dto'; // <-- Import

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // CREATE
  async create(createUserDto: CreateUserDto): Promise<User> { // <-- Use the DTO
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  // READ (all)
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // READ (one)
  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  // UPDATE
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> { // <-- Use the DTO
    const user = await this.userRepository.findOneByOrFail({ id });
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  // DELETE
  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
```


can write userconroller 
```bash 
// src/user/user.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users') // This means all routes will start with /users
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post() // POST /users
  create(@Body() createUserDto: { firstName: string; lastName: string; email: string }) {
    return this.userService.create(createUserDto);
  }

  @Get() // GET /users
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id') // GET /users/123
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id); // +id converts string to number
  }

  @Patch(':id') // PATCH /users/123
  update(@Param('id') id: string, @Body() updateUserDto: { firstName?: string; lastName?: string; email?: string }) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id') // DELETE /users/123
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
```


using DTO's :for Validation 

pakages to install :
```bash 
npm install class-validator class-transformer
```


in src/main.ts :
```
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <-- Import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // This line enables global validation
  app.useGlobalPipes(new ValidationPipe()); // <-- Add this line

  await app.listen(3000);
}
bootstrap();
```



class-validators 
```bash 
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;
}
```



#the most important **partial implementaion**
```bash 
npm install @nestjs/mapped-types

import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// This automatically creates a new type based on CreateUserDto
// but with all fields marked as optional.
export class UpdateUserDto extends PartialType(CreateUserDto) {}
```


THEN WE CAN GO TO POSTMAN AND ENJOY THE TABLE.