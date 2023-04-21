import { Request, Response } from "express";
import { HttpStatus } from "@nestjs/common/enums";
import { UnauthorizedException } from "@nestjs/common";
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from "@nestjs/common";
import { BaseWsExceptionFilter } from "@nestjs/websockets";

@Catch()
export class GlobalErrorHandler extends BaseWsExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const httpStatus =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.CONFLICT;

    // const cause = exception.cause;
    // const name = exception.name;
    // const message = exception.message;

    return response.status(httpStatus).json({
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: exception,
      // message,
      // cause,
      // name,

      // [exception instanceof BadRequestException || exception instanceof UnauthorizedException
      //   ? "error"
      //   : ""]:
      //   exception instanceof BadRequestException
      //     ? exception["response"]["message"]
      //     : exception instanceof UnauthorizedException
      //     ? "The Token you are trying to use to bypass my server is either invalid or expired"
      //     : "",
    });
  }
}
