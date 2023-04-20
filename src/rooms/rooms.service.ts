import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Guard } from "src/utils/guard.utils";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Room } from "src/rooms/entities/rooms.entity";
import { Message } from "src/messages/entities/message.entity";
import { CreateRoomDto, RoomDto, UpdateRoomsDto } from "src/rooms/dto/rooms.dto";
import { ResponseManager, StandardResponse } from "src/utils/responseManager.utils";
import { Paginate, QueryDto, SortEnum, paginateResponse } from "src/utils/pagination.utils";

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private roomsRepository: Repository<Room>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  async create(createRoomDto: CreateRoomDto, userId: string): Promise<StandardResponse<RoomDto>> {
    const user = await this.userRepository.findOneBy({ id: userId });
    Guard.AgainstNotFound(user, "user");

    const newRoom = this.roomsRepository.create({ ...createRoomDto, users: [user] });

    await newRoom.save();

    return ResponseManager.StandardResponse({
      code: 201,
      status: "success",
      message: "room created successfully",
      data: newRoom,
    });
  }

  async findAll(query: QueryDto): Promise<StandardResponse<Paginate[]>> {
    const page = query.page || 1;
    const limit = query.limit || 5;
    const skip = (page - 1) * limit;
    const sortField = query.sortField;
    const sortOrder = query.sortOrder;

    const rooms = await this.roomsRepository.findAndCount({
      take: limit,
      skip,
      order: {
        [sortField]: sortOrder === SortEnum.descending ? SortEnum.descending : SortEnum.ascending,
      },
    });

    return ResponseManager.StandardResponse({
      code: 200,
      message: "room fetched successfully",
      ...paginateResponse(rooms, page, limit),
    });
  }

  async findOne(id: string): Promise<StandardResponse<Room>> {
    const room = await this.roomsRepository.findOne({
      where: { id },
      relations: { users: true, messages: true },
    });

    Guard.AgainstNotFound(room, "room");

    return ResponseManager.StandardResponse({
      status: "success",
      code: 200,
      message: "Room retrieved Successfully",
      data: room,
    });
  }

  async update(id: string, updateRoomDto: UpdateRoomsDto): Promise<StandardResponse<Room>> {
    const room = await this.roomsRepository.findOneBy({ id });

    Guard.AgainstNotFound(room, "room");

    await this.roomsRepository.update({ id }, { ...updateRoomDto });

    return ResponseManager.StandardResponse({
      status: "success",
      code: 200,
      message: "Room Updated Successfully",
      data: room,
    });
  }

  async remove(id: string): Promise<StandardResponse<null>> {
    const room = await this.roomsRepository.findOneBy({ id });

    Guard.AgainstNotFound(room, "room");

    await this.roomsRepository.delete({ id });

    return ResponseManager.StandardResponse({
      status: "success",
      code: 204,
      message: "Room deleted Successfully",
      data: null,
    });
  }
}
