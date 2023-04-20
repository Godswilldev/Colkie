import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { SubscribeMessage } from "@nestjs/websockets";
import { RoomsService } from "src/rooms/rooms.service";
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

export enum Events {
  NEW_MESSAGE = "newMessage",
}

@WebSocketGateway()
export class RoomGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
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

  constructor(private readonly roomService: RoomsService) {}

  /*
  @SubscribeMessage("joinRoom")
  handleJoinRoom(client: Socket, data: { roomId: string; user: string }): void {
    const room = this.roomService.addRoomUser(data.roomId, data.user);
    client.join(room.id);
    client.emit("joinedRoom", room);
    client.to(room.id).emit("userJoined", data.user);
  }

  @SubscribeMessage("leaveRoom")
  handleLeaveRoom(client: Socket, data: { roomId: string; user: string }): void {
    const room = this.roomService.getRoomById(data.roomId);
    const userIndex = room.users.indexOf(data.user);
    if (userIndex !== -1) {
      room.users.splice(userIndex, 1);
    }
    client.leave(room.id);
    client.emit("leftRoom", room);
    client.to(room.id).emit("userLeft", data.user);
  }

  @SubscribeMessage("sendMessage")
  handleSendMessage(client: Socket, data: { roomId: string; user: string; text: string }): void {
    const message = this.roomService.addRoomMessage(data.roomId, data.user, data.text);
    client.to(data.roomId).emit("messageReceived", message);
  }

  @SubscribeMessage("getLatestMessages")
  handleGetLatestMessages(client: Socket, data: { roomId: string; limit: number }): void {
    const messages = this.roomService.getRoomMessages(data.roomId, data.limit);
    client.emit("latestMessages", messages);
  }
  */
}
