import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/enities/User';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/Create-user.dto';
import { UpdateUSerDto } from './dto/Update-user.dto';
import { promises } from 'dns';

@Injectable()
export class UserService {

    constructor(
    @InjectRepository(User)
    private userRepository:Repository<User>
    ){}

    async create(createUserDto:CreateUserDto):Promise<User>{
        const newUser=this.userRepository.create(createUserDto);
        return this.userRepository.save(newUser)
    }

    findAll(): Promise<User[]>{
        return this.userRepository.find()
    }

    findOne(id:number):Promise<User|null>{
        return this.userRepository.findOneBy({id});
    }
    async update(id:number,updateuserdto:UpdateUSerDto):Promise<User >{
        const user=await this.userRepository.findOneByOrFail({id});
        Object.assign(user,updateuserdto);
        return this.userRepository.save(user)
    }

    async remove(id:number):Promise<void>{
        await this.userRepository.delete(id)
    }
}
