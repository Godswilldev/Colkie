"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GlobalErrorHandler = void 0;
var enums_1 = require("@nestjs/common/enums");
var common_1 = require("@nestjs/common");
var websockets_1 = require("@nestjs/websockets");
var GlobalErrorHandler = /** @class */ (function (_super) {
    __extends(GlobalErrorHandler, _super);
    function GlobalErrorHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GlobalErrorHandler.prototype["catch"] = function (exception, host) {
        _super.prototype["catch"].call(this, exception, host);
        var ctx = host.switchToHttp();
        var response = ctx.getResponse();
        var request = ctx.getRequest();
        var httpStatus = exception instanceof common_1.HttpException ? exception.getStatus() : enums_1.HttpStatus.CONFLICT;
        // const cause = exception.cause;
        // const name = exception.name;
        // const message = exception.message;
        return response.status(httpStatus).json({
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: exception
        });
    };
    GlobalErrorHandler = __decorate([
        common_1.Catch()
    ], GlobalErrorHandler);
    return GlobalErrorHandler;
}(websockets_1.BaseWsExceptionFilter));
exports.GlobalErrorHandler = GlobalErrorHandler;
