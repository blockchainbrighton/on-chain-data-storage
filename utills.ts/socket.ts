import { connectWebSocketClient, StacksApiSocketClient } from "@stacks/blockchain-api-client";
import { socket_url } from "../config";
import { handleRequest } from "./request";

export const initSocketClient = async () => {
    const sc = new StacksApiSocketClient({ url: socket_url });
    const sub = sc.subscribeBlocks((block: any) => {
        handleRequest();
    })
}