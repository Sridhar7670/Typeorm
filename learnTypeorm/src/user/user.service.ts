import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/enities/User';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/Create-user.dto';
import { UpdateUSerDto } from './dto/Update-user.dto';


@Injectable()
export class UserService {

    constructor(
    @InjectRepository(User)
    private userRepository:Repository<User>
    ){}

    async create(createUserDto:CreateUserDto):Promise<User>{
        const {email}=createUserDto;
        const existingUser=await this.userRepository.findOne({where:{email}});
        if(existingUser){
            throw new ConflictException('Email Already Exists');
        }
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

    async remove(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.remove(user);
    return { message: `User with ID ${id} deleted successfully` };
  }
}
