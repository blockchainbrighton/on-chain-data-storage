import axios from "axios";
import { admin_address, api_url } from "../config"
import { RequestStatus } from "../types";

export const getRequestStatus = async (txId: string) => {
    try {
        const url = `${api_url}tx/0x${txId}`;
        const res = await axios.get(url);
        if (res.data.tx_status == "success" && res.data.tx_type == "token_transfer") {
            if (res.data.token_transfer.recipient_address == admin_address && res.data.token_transfer.amount == "2000000") {
                return RequestStatus.CONFIRMED;
            } else {
                return RequestStatus.REJECTED;
            }
        } else if (res.data.tx_status == "success" && res.data.tx_type == "smart_contract") {
            return RequestStatus.CONFIRMED;
        } else if (res.data.tx_status == "success" && res.data.tx_type == "contract_call") {
            return RequestStatus.CONFIRMED;
        } else {
            return RequestStatus.UNCONFIRMED;
        }
    } catch (error) {
        console.log("Get Request Status Error =>", error);
        return RequestStatus.UNCONFIRMED;
    }
}

export const getAccountBalances = async (address: string, contractName: string) => {
    try {
        const url = `${api_url}address/${address}/balances`
        const res: any = await axios.get(url);
        const stxBalance = res.data.stx.balance;
        let tokenBalance = "0";
        const tokenStr = `${admin_address}.${contractName}::${contractName}`;
        if (tokenStr in res.data.fungible_tokens) {
            tokenBalance = res.data.fungible_tokens[tokenStr].balance;
        }
        return {
            stxBalance: parseInt(stxBalance) * 1 / 10 ** 6,
            tokenBalance: parseInt(tokenBalance) * 1 / 10 ** 6
        }

    } catch (error) {
        console.log("Get Account Balances Error =>", error);
        return {
            stxBalance: 0,
            tokenBalance: 0
        }
    }
}