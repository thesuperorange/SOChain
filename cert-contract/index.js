const Web3 = require("web3");
const HDWalletProvider = require("truffle-hdwallet-provider");
const TruffleContract = require("truffle-contract");

const HRCertJson = require("./build/contracts/HR_RPCert.json");
const HRCertContract = TruffleContract(HRCertJson);

const HRDBJson = require("./build/contracts/HR_DB.json");
const HRDBContract = TruffleContract(HRDBJson);

module.exports = {


  getHRCertContract: function() {
    return HRCertContract;
  },

  getHRDBContract: function() {
    return HRDBContract;
  },

};
