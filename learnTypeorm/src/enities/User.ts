import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

    @Column()
    createdAt:Date;

    // @OneToMany(()=>Post,(post)=>post.user)
    // post:Post[]
}