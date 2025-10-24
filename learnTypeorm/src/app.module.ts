import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './enities/User';
import { UserModule } from './user/user.module';

@Module({
  imports: [ TypeOrmModule.forRoot({
             type: 'postgres',
              host: 'localhost', // or your PostgreSQL 
              port: 5432, // or your PostgreSQL port 
              username: 'sridhar',
              password: 'root',
              database: 'typeorm_db', 
              entities: [User], // List your entities here
            synchronize: true, // Set to false in production
             }),
              UserModule, 
            ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
