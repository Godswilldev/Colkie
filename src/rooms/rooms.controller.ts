import { RoomsService } from "src/rooms/rooms.service";
import { Room } from "src/rooms/entities/rooms.entity";
import { UserSession } from "src/users/users.controller";
import { SessionGuard } from "src/auth/guards/session.guard";
import { Paginate, QueryDto } from "src/utils/pagination.utils";
import { Role, Roles } from "src/auth/decorators/role.decorator";
import { StandardResponse } from "src/utils/responseManager.utils";
import { CreateRoomDto, RoomDto, UpdateRoomsDto } from "src/rooms/dto/rooms.dto";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  Controller,
  Get,
  Body,
  Post,
  HttpCode,
  Patch,
  Delete,
  ParseUUIDPipe,
  Param,
  UseGuards,
  Query,
  Session,
} from "@nestjs/common";

@Controller("rooms")
@UseGuards(SessionGuard)
@ApiTags("Rooms")
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.User)
  @ApiBody({ description: "Create a new room", type: CreateRoomDto })
  @ApiCreatedResponse({ description: "room created successfully", type: RoomDto })
  create(
    @Session() session: any,
    @Body() createRoomDto: CreateRoomDto,
  ): Promise<StandardResponse<RoomDto>> {
    return this.roomsService.create(createRoomDto, session.passport.user.id);
  }

  @Get()
  @ApiOkResponse({ description: "Rooms retrieved successfully", type: [RoomDto] })
  async findAll(@Query() query: QueryDto): Promise<StandardResponse<Paginate[]>> {
    return await this.roomsService.findAll(query);
  }

  @Get(":id")
  @ApiOkResponse({ description: "Room retrieved successfully", type: RoomDto })
  async findOne(@Param("id", ParseUUIDPipe) id: string): Promise<StandardResponse<RoomDto>> {
    return await this.roomsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(SessionGuard)
  @Roles(Role.Admin, Role.Manager)
  @ApiOkResponse({ description: "Room Updated successfully", type: RoomDto })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateRoomDto: UpdateRoomsDto,
  ): Promise<StandardResponse<Room>> {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(":id")
  @Roles(Role.Admin)
  @ApiNoContentResponse({
    description: "Room deleted successfully",
    type: StandardResponse<null>,
  })
  remove(@Param("id", ParseUUIDPipe) id: string): Promise<StandardResponse<null>> {
    return this.roomsService.remove(id);
  }
}
