import { Reflector } from "@nestjs/core";
import { ROLES_KEY, Role } from "src/auth/decorators/role.decorator";
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    const canPass = requiredRoles.some((r) => user.role?.includes(r));

    if (canPass) {
      return true;
    } else {
      throw new ForbiddenException(
        "Your Rank isn't high enough to access this resource, Ask your boss for promotion",
      );
    }
  }
}
