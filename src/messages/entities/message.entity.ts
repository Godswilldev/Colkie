import { Entity, Column, ManyToOne } from "typeorm";
import BaseModel from "src/entities/baseModel.entity";
import { User } from "src/users/entities/user.entity";
import { Room } from "src/rooms/entities/rooms.entity";

@Entity()
export class Message extends BaseModel {
  @Column()
  text: string;

  @ManyToOne(() => Room, (room) => room.messages)
  room: Room;

  @ManyToOne(() => User, (user) => user.messages)
  user: User;
}
