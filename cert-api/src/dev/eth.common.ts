const HDWalletProvider: any = require("truffle-hdwallet-provider");

const MNEMONIC_SYSTEM =
  "tell sibling misery still crew globe flip leopard mosquito silk west gesture";

export const RPCURL = process.env.RPCURL || "http://localhost:8546";

export function GetHdProvider(id: number, rpcurl: string, mnemonic=MNEMONIC_SYSTEM) {
    let url = rpcurl || RPCURL;
    return new HDWalletProvider(mnemonic, url, id);
  }