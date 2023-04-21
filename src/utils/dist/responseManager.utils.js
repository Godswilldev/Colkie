"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.StandardResponse = exports.ResponseManager = void 0;
var swagger_1 = require("@nestjs/swagger");
var common_1 = require("@nestjs/common");
var websockets_1 = require("@nestjs/websockets");
var ResponseManager = /** @class */ (function () {
    function ResponseManager() {
    }
    ResponseManager.StandardResponse = function (_a) {
        var status = _a.status, code = _a.code, message = _a.message, meta = _a.meta, data = _a.data;
        return {
            status: status,
            code: code,
            message: message,
            meta: meta,
            data: data
        };
    };
    ResponseManager.AuthenticationFailedResponse = function () {
        return new common_1.HttpException(ResponseManager.StandardResponse({
            status: "Auth failed",
            code: 401,
            message: "Auth failed",
            data: null,
            meta: null
        }), common_1.HttpStatus.UNAUTHORIZED);
    };
    ResponseManager.InternalServerErrorResponse = function () {
        return new common_1.HttpException(ResponseManager.StandardResponse({
            status: "server Error",
            code: 500,
            message: "This is our fault",
            data: null,
            meta: null
        }), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    };
    ResponseManager.BadRequestResponse = function (message, meta) {
        return new websockets_1.WsException(ResponseManager.StandardResponse({
            status: "Bad request",
            code: 400,
            message: message,
            data: null,
            meta: meta
        }));
    };
    ResponseManager.NotFoundResponse = function (message, meta) {
        return new websockets_1.WsException(ResponseManager.StandardResponse({
            status: "Not found",
            code: 404,
            message: message,
            data: null,
            meta: meta
        }));
    };
    return ResponseManager;
}());
exports.ResponseManager = ResponseManager;
var StandardResponse = /** @class */ (function () {
    function StandardResponse() {
    }
    __decorate([
        swagger_1.ApiProperty()
    ], StandardResponse.prototype, "status");
    __decorate([
        swagger_1.ApiProperty()
    ], StandardResponse.prototype, "code");
    __decorate([
        swagger_1.ApiProperty()
    ], StandardResponse.prototype, "message");
    __decorate([
        swagger_1.ApiProperty()
    ], StandardResponse.prototype, "data");
    __decorate([
        swagger_1.ApiProperty()
    ], StandardResponse.prototype, "meta");
    return StandardResponse;
}());
exports.StandardResponse = StandardResponse;
