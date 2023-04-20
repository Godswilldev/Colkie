import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { RoomsService } from "src/rooms/rooms.service";
import { Room } from "src/rooms/entities/rooms.entity";
import { Message } from "src/messages/entities/message.entity";

@Module({
  providers: [RoomsService],
  imports: [TypeOrmModule.forFeature([Room, User, Message])],
})
export class RoomsModule {}
