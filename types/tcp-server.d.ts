import { EventEmitter } from 'events';
import { Message } from './message';
import { Parser } from './parser';
export type HandlerCallback = (err: Error | null, req?: Req, res?: Res) => void;

class Req {
    constructor(msg: Message, raw: string);
    msg: Message;
    raw: string;
    sender: string;
    facility: string;
    type: string;
    event: string;
}

class Res {
  constructor(socket: net.Socket, ack: Message);
  ack: Message;
  socket: net.Socket;
  end(): void;
}

class TcpServer extends EventEmitter {
  constructor(options: TcpServerOptions, handler: HandlerCallback);
  start(port: number, encoding?: string, options?: any): void;
  stop(): void; createAckMessage(msg: Message): Message;
}

export interface TcpServerOptions { parser?: Parser; }

export = TcpServer;
