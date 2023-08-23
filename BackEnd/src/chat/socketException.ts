import { ArgumentsHost, Catch, HttpException, Injectable } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";

@Injectable()
@Catch(WsException, HttpException)
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient() as WebSocket;
    const data = host.switchToWs().getData();
    const error = exception instanceof WsException ? exception.getError() : exception.getResponse();
    const details = error instanceof Object ? { ...error } : { message: error };
    let rid;
    if (data && data.rid) {
      rid = data.rid;
    } else {
      // Handle the case where data.rid is missing
      rid = 'unknown';
    }
    client.send(JSON.stringify({
      event: "error",
      data: {
        id: (client as any).id,
        rid: data.rid,
        ...details
      }
    }));
  }
}