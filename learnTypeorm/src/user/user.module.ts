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
