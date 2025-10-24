import { Column, Entity, OneToMany, PrimaryGeneratedColumn ,CreateDateColumn} from "typeorm";
// import Post from "./post"
@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    firstName:string

    @Column()
    lastName:string

    @Column({unique:true})
    email:string

    @CreateDateColumn()
    createdAt:Date;

    // @OneToMany(()=>Post,(post)=>post.user)
    // post:Post[]
}