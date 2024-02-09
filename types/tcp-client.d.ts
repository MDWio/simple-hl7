import { Message } from "./message";

type CallbackFunction = (err: Error, ack: Message) => void;

type TcpClientOptions = {
  host: string;
  port: number;
  callback?: CallbackFunction;
  keepalive?: boolean;
  timeout?: number;
};

/**
 * Represents a TCP client for HL7 communication.
 */
declare class TcpClient {
  /**
   * Creates a new instance of TcpClient.
   * @param {TcpClientOptions} options - The options for the client.
   */
  constructor(options: TcpClientOptions);
  /**
   * Creates a new instance of TcpClient.
  * @param {string} host - The host address to connect to.
  * @param {number} port - The port number to connect to.
  */
  constructor(host: string, port: number);

  /**
   * Connects to the specified host and port.
   * @param {function} callback - The callback function to be called when connected.
   */
  connect(callback: CallbackFunction): void;

  /**
   * Sends a message through the TCP connection.
   * @param {string} msg - The message to send.
   * @param {function} callback - The callback function to be called when the response is received.
   */
  send(msg: Message, callback: CallbackFunction): void;

  /**
   * Closes the TCP connection.
   */
  close(): void;
}
