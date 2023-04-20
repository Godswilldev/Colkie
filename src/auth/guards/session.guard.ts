import { Request } from "express";
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class SessionGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    return request.isAuthenticated();
  }
}
