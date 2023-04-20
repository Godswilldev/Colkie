import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "src/users/dto/user.dto";
import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsString } from "class-validator";
import { MessageDto } from "src/messages/dto/message.dto";

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;
}

export class RoomDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  users: UserDto[];

  @ApiProperty()
  messages: MessageDto[];
}

export class UpdateRoomsDto extends PartialType<CreateRoomDto>(CreateRoomDto) {}
