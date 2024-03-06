import { FileClient } from "./file-client";
import { FileServer } from "./file-server";
import { TcpClient, TcpClientOptions } from "./tcp-client";
import { HandlerCallback, TcpServer, TcpServerOptions } from "./tcp-server";

export declare const Server: {
  createTcpServer(options: TcpServerOptions, handler: HandlerCallback): TcpServer;
  createTcpClient(options: TcpClientOptions): TcpClient;
  createTcpClient(host: string, port: number): TcpClient;
  createFileServer(options, handler): FileServer;
  createFileClient(dest): FileClient;
};
