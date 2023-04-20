import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Guard } from "src/utils/guard.utils";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Room } from "src/rooms/entities/rooms.entity";
import { Message } from "src/messages/entities/message.entity";
import { CreateRoomDto, RoomDto } from "src/rooms/dto/rooms.dto";
import { CreateMessageDto, MessageDto } from "src/messages/dto/message.dto";

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private roomsRepository: Repository<Room>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  async create(createRoomDto: CreateRoomDto, userId: string): Promise<RoomDto> {
    const user = await this.userRepository.findOneBy({ id: userId });
    Guard.AgainstNotFound(user, "user");

    const newRoom = this.roomsRepository.create({ ...createRoomDto, users: [user] });

    await newRoom.save();

    return newRoom;
  }

  async addUserToRoom(roomId: string, userId: string): Promise<{ room: Room; user: User }> {
    const user = await this.userRepository.findOneBy({ id: userId });
    Guard.AgainstNotFound(user, "user");

    const room = await this.roomsRepository.findOneBy({ id: roomId });
    Guard.AgainstNotFound(room, "room");

    room.users.push(user);

    await room.save();

    return { room, user };
  }

  async leaveRoom(roomId: string, userId: string): Promise<{ room: Room; user: User }> {
    const user = await this.userRepository.findOneBy({ id: userId });
    Guard.AgainstNotFound(user, "user");

    const room = await this.roomsRepository.findOneBy({ id: roomId });
    Guard.AgainstNotFound(room, "room");

    room.users.filter((u) => u.id !== user.id);

    await room.save();

    return { room, user };
  }

  async sendMessageToRoom(message: CreateMessageDto): Promise<MessageDto> {
    const user = await this.userRepository.findOneBy({ id: message.userId });
    Guard.AgainstNotFound(user, "user");

    const room = await this.roomsRepository.findOneBy({ id: message.roomId });
    Guard.AgainstNotFound(room, "room");

    const newMessage = await this.messageRepository.create({ user, room, text: message.text });
    await newMessage.save();

    return newMessage;
  }

  async getRoomMessages(roomId: string): Promise<Room> {
    const room = await this.roomsRepository.findOneBy({ id: roomId });
    Guard.AgainstNotFound(room, "room");

    return room;
  }
}
