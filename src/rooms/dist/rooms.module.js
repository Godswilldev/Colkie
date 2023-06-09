"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RoomsModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var user_entity_1 = require("src/users/entities/user.entity");
var rooms_gateway_1 = require("src/rooms/rooms.gateway");
var rooms_service_1 = require("src/rooms/rooms.service");
var rooms_entity_1 = require("src/rooms/entities/rooms.entity");
var message_entity_1 = require("src/messages/entities/message.entity");
var RoomsModule = /** @class */ (function () {
    function RoomsModule() {
    }
    RoomsModule = __decorate([
        common_1.Module({
            providers: [rooms_service_1.RoomsService, rooms_gateway_1.RoomGateway],
            imports: [typeorm_1.TypeOrmModule.forFeature([rooms_entity_1.Room, user_entity_1.User, message_entity_1.Message])]
        })
    ], RoomsModule);
    return RoomsModule;
}());
exports.RoomsModule = RoomsModule;
