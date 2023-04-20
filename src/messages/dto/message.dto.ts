import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "src/users/dto/user.dto";
import { RoomDto } from "src/rooms/dto/rooms.dto";
import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class MessageDto {
  @ApiProperty()
  text: string;

  @ApiProperty()
  room: RoomDto;

  @ApiProperty()
  user: UserDto;
}

export class CreateMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsUUID()
  roomId: string;

  @ApiProperty()
  @IsUUID()
  userId: string;
}

export class UpdateMessageDto extends PartialType<CreateMessageDto>(CreateMessageDto) {}
