import bip39 from "bip39";
import {
    TransactionVersion,
    getAddressFromPrivateKey,
    getNonce,
    broadcastTransaction,
    makeContractDeploy,
    ClarityVersion,
} from "@stacks/transactions";
import { generateWallet } from "@stacks/wallet-sdk";
import { StacksDevnet, StacksMainnet, StacksTestnet } from "@stacks/network";


const getNetwork = (networkType: string) => {
    return networkType == "testnet" ? new StacksTestnet() : new StacksMainnet();
}

export const createWallet = async (seed: string, password: string, networkType: string) => {
    const wallet = await generateWallet({
        secretKey: seed,
        password: password
    });

    const privateKey = wallet.accounts[0].stxPrivateKey;

    console.log("=>", wallet.accounts);

    const network = getNetwork(networkType);

    const account = {
        privateKey: privateKey,
        stxAddress: getAddressFromPrivateKey(privateKey, TransactionVersion.Testnet),
        nonce: Number(
            await getNonce(getAddressFromPrivateKey(privateKey, TransactionVersion.Testnet),
                network
            )
        ),
    };

    return account;
}