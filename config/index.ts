export { PORT, JWT_SECRET } from "./config";
export { connectMongoDB } from './db'
import { createWallet } from "../utills.ts/wallet";

export const networkType = process.env.NETWORK ? process.env.NETWORK : "testnet";
export const seedPhrase = process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY : "penalty promote before alarm couch strategy boss furnace token skin million duck";
export const admin_address = process.env.ADMIN_ADDRESS ? process.env.ADMIN_ADDRESS : "ST1R54GFBKWHS57G21ERQWB1BJMQ81127BR28QCKS";
export const fee = 1000000;


export const api_url = `https://api${networkType == "testnet" ? ".testnet" : ""}.hiro.so/extended/v1/`;
// export const account = createWallet(seedPhrase, "d@mon19981205!@#", networkType);

export const socket_url = `wss://api.${networkType == "testnet" ? "testnet" : "mainnet"}.hiro.so/`;