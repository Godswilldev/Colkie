import { ApiTags } from "@nestjs/swagger";
import { Server, Socket } from "socket.io";
import { SubscribeMessage } from "@nestjs/websockets";
import { RoomsService } from "src/rooms/rooms.service";
import { CreateRoomDto } from "src/rooms/dto/rooms.dto";
import { Logger, Session, UseGuards } from "@nestjs/common";
import { SessionGuard } from "src/auth/guards/session.guard";
import { CreateMessageDto } from "src/messages/dto/message.dto";
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

export enum RoomActions {
  CREATE = "create",
  ADD_USER = "addUser",
  LEAVE_ROOM = "leaveRoom",
  SEND_MESSAGE = "sendMessage",
  GET_LATEST_MESSAGE = "getLatestMessages",
}

@ApiTags("Rooms")
@WebSocketGateway()
@UseGuards(SessionGuard)
export class RoomGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
  constructor(private readonly roomService: RoomsService) {}

  @WebSocketServer() wss: Server;

  private readonly logger: Logger = new Logger("Colkie Chat");

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`${client.id} Connected`);
    client.emit(`${client.id} Connected`);
  }

  afterInit() {
    this.logger.log("Server has beem Initialized");
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`${client.id} Disconnected`);
    client.disconnect();
  }

  @SubscribeMessage(RoomActions.CREATE)
  async roomCreate(
    @ConnectedSocket() client: Socket,
    @Session() session: any,
    createRoomDto: CreateRoomDto,
  ) {
    const room = await this.roomService.create(createRoomDto, session.passport.user.id);
    client.join(room.id);
    client.emit("roomCreated", room);
  }

  @SubscribeMessage(RoomActions.ADD_USER)
  async addUserToRoom(@ConnectedSocket() client: Socket, @Session() session: any, roomId: string) {
    const { room, user } = await this.roomService.addUserToRoom(roomId, session.passport.user.id);
    client.join(room.id);
    client.emit("userAdded", room);
    client.to(room.id).emit("userJoined", user.id);
  }

  @SubscribeMessage(RoomActions.LEAVE_ROOM)
  async leaveRoom(@ConnectedSocket() client: Socket, @Session() session: any, roomId: string) {
    const { room, user } = await this.roomService.leaveRoom(roomId, session.passport.user.id);
    client.leave(room.id);
    client.emit("leftRoom", room);
    client.to(room.id).emit("userLeft", user);
  }

  @SubscribeMessage(RoomActions.SEND_MESSAGE)
  async sendMessageToRoom(@ConnectedSocket() client: Socket, message: CreateMessageDto) {
    const newMessage = await this.roomService.sendMessageToRoom(message);
    client.to(newMessage.room.id).emit("messageSent", message);
    this.wss.to(newMessage.room.id).emit("messageSent", message);
  }

  @SubscribeMessage(RoomActions.GET_LATEST_MESSAGE)
  async handleGetLatestMessages(@ConnectedSocket() client: Socket, roomId: string) {
    const room = await this.roomService.getRoomMessages(roomId);
    client.emit("latestMessages", room.messages);
  }
}
