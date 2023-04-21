import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { RoomGateway } from "src/rooms/rooms.gateway";
import { RoomsService } from "src/rooms/rooms.service";
import { Room } from "src/rooms/entities/rooms.entity";
import { Message } from "src/messages/entities/message.entity";

@Module({
  providers: [RoomsService, RoomGateway],
  imports: [TypeOrmModule.forFeature([Room, User, Message])],
})
export class RoomsModule {}
