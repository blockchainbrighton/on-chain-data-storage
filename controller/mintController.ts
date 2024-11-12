import { makeContractDeploy, callReadOnlyFunction, ReadOnlyFunctionOptions, broadcastTransaction, AnchorMode, ClarityVersion, PostConditionMode, makeContractCall, uintCV, standardPrincipalCV, contractPrincipalCV, principalCV } from "@stacks/transactions";
import { StacksMainnet, StacksTestnet, StacksDevnet } from "@stacks/network";
import {

    TxBroadcastResult,
    FungibleConditionCode,
    makeStandardSTXPostCondition,
    bufferCVFromString,
} from "@stacks/transactions";
import fs from "fs";
import { createWallet } from "../utills.ts/wallet";
import { getAccountBalances } from "../utills.ts/hiro";
import { networkType, seedPhrase, fee, admin_address } from "../config";
import { none } from "@stacks/transactions/dist/cl";

export const traitDeploy = async () => {
    const network = networkType == "mainnet" ? new StacksMainnet() : new StacksTestnet();
    let contractBody = fs.readFileSync(__dirname + "/../contract/sig-trait.clar", "utf8").toString();

    const account = await createWallet(seedPhrase, "yum@!@#", networkType);

    const tx = await makeContractDeploy({
        network: network,
        // contractName: contractName,
        contractName: "sig-trait",
        codeBody: contractBody,
        senderKey: account.privateKey,
        clarityVersion: 3 as ClarityVersion,
        nonce: account.nonce,
        fee: fee,
        anchorMode: AnchorMode.Any,
    });

    // const hexString = JSON.stringify(tx);

    console.log("nonce =>", tx);

    const broadcastResponse = await broadcastTransaction(tx);

}
export const nftDeploy = async () => {
    const network = networkType == "mainnet" ? new StacksMainnet() : new StacksTestnet();
    let contractBody = fs.readFileSync(__dirname + "/../contract/sig-punk.clar", "utf8").toString();

    const account = await createWallet(seedPhrase, "yum@!@#", networkType);

    const tx = await makeContractDeploy({
        network: network,
        // contractName: contractName,
        contractName: "sig-punk",
        codeBody: contractBody,
        senderKey: account.privateKey,
        clarityVersion: 3 as ClarityVersion,
        nonce: account.nonce,
        fee: fee,
        anchorMode: AnchorMode.Any,
    });

    // const hexString = JSON.stringify(tx);

    console.log("nonce =>", tx);

    const broadcastResponse = await broadcastTransaction(tx);

}
export const mint = async () => {
    console.log("mint")
    const network = networkType == "mainnet" ? new StacksMainnet() : new StacksTestnet();

    const account = await createWallet(seedPhrase, "yum@!@#", networkType);

    const txOptions = {
        contractAddress: admin_address,
        contractName: "sig-punk",
        functionName: "mint",
        functionArgs: [
            principalCV(admin_address),
        ],
        network,
        senderKey: account.privateKey,
        fee: 500000,
        none: account.nonce,
        anchorMode: AnchorMode.Any
    };

    const tx = await makeContractCall(txOptions);

    // const hexString = JSON.stringify(tx);

    console.log("nonce =>", account.nonce);

    const broadcastResponse = await broadcastTransaction(tx);

}
export const transfer = async () => {
    console.log("fffff")
    const network = networkType == "mainnet" ? new StacksMainnet() : new StacksTestnet();

    const account = await createWallet(seedPhrase, "yum@!@#", networkType);

    const txOptions = {
        contractAddress: admin_address,
        contractName: "nft",
        functionName: "mint",
        functionArgs: [
            uintCV(1),
            principalCV(admin_address),
            principalCV("ST3BXNAMTXJ8GR1TNPQV9E91FFYDJ131P8HRCSEFE"),
        ],
        network,
        senderKey: account.privateKey,
        fee: 500000,
        none: account.nonce,
        anchorMode: AnchorMode.Any
    };

    const tx = await makeContractCall(txOptions);

    // const hexString = JSON.stringify(tx);

    console.log("nonce =>", account.nonce);

    const broadcastResponse = await broadcastTransaction(tx);

}

export const getTokenUri = async () => {
    console.log("uri")
    const network = networkType == "mainnet" ? new StacksMainnet() : new StacksTestnet();

    const account = await createWallet(seedPhrase, "yum@!@#", networkType);

    const txOptions = {
        contractName: "nft",
        contractAddress: admin_address,
        functionName: "get-token-uri",
        functionArgs: [
            uintCV(1),
        ],
        network,
        senderAddress: admin_address
    };
    const tx = await callReadOnlyFunction(txOptions);

    // const hexString = JSON.stringify(tx);

    // console.log("nonce =>", account.nonce);

    console.log("broadcastResponse =>", tx);

}