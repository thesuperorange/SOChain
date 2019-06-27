var HR_DB = artifacts.require("HR_DB");

module.exports = function(deployer) {
  deployer.deploy(HR_DB);
};

var HR_Cert = artifacts.require("HR_RPCert");

module.exports = function(deployer) {
  deployer.deploy(HR_Cert);
};