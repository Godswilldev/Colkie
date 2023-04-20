import { ApiProperty } from "@nestjs/swagger";
import { HttpException, HttpStatus } from "@nestjs/common";

interface Response<T> {
  status: string;
  code: number;
  message: string;
  data: T;
  meta?: object;
}

export class ResponseManager {
  public static StandardResponse<T>({
    status,
    code,
    message,
    meta,
    data,
  }: Response<T>): StandardResponse<T> {
    return {
      status,
      code,
      message,
      meta,
      data,
    };
  }

  public static AuthenticationFailedResponse() {
    return new HttpException(
      ResponseManager.StandardResponse({
        status: "Auth failed",
        code: 401,
        message: "Auth failed",
        data: null,
        meta: null,
      }),
      HttpStatus.UNAUTHORIZED,
    );
  }

  public static InternalServerErrorResponse() {
    return new HttpException(
      ResponseManager.StandardResponse({
        status: "server Error",
        code: 500,
        message: "This is our fault",
        data: null,
        meta: null,
      }),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  public static BadRequestResponse(message: string, meta?: object) {
    return new HttpException(
      ResponseManager.StandardResponse({
        status: "Bad request",
        code: 400,
        message,
        data: null,
        meta,
      }),
      HttpStatus.BAD_REQUEST,
    );
  }

  static NotFoundResponse(message: string, meta?: object) {
    return new HttpException(
      ResponseManager.StandardResponse({
        status: "Not found",
        code: 404,
        message,
        data: null,
        meta,
      }),
      HttpStatus.NOT_FOUND,
    );
  }
}

export class StandardResponse<T = any> {
  @ApiProperty()
  status: string;

  @ApiProperty()
  code: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: T;

  @ApiProperty()
  meta?: object;
}
