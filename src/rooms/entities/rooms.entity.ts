import BaseModel from "src/entities/baseModel.entity";
import { User } from "src/users/entities/user.entity";
import { Message } from "src/messages/entities/message.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";

@Entity()
export class Room extends BaseModel {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => User, (user) => user.rooms)
  @JoinTable()
  users: User[];

  @OneToMany(() => Message, (message: Message) => message.room, { nullable: false })
  messages: Message[];
}
