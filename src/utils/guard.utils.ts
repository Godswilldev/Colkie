import { HttpException } from "@nestjs/common";
import { ResponseManager } from "src/utils/responseManager.utils";

export class Guard {
  static AgainstNullOrUndefined(value: any, name: string, error?: HttpException): void {
    if (value === null || value === undefined) {
      if (error) {
        throw error;
      }

      throw ResponseManager.BadRequestResponse(`${name} does not exist`);
    }
  }

  static AgainstNotFound(value: any, name: string, error?: HttpException): void {
    if (value === null || value === undefined) {
      if (error) {
        throw error;
      }

      throw ResponseManager.NotFoundResponse(`${name} does not exist`);
    }
  }
}
