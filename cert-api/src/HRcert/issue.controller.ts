import { Get, Post, Body, Response, HttpStatus, HttpException, Controller } from '@nestjs/common';
import { UsersEthDTO } from './userInfo.dto';
import { EthDTO } from '../dev/eth.dto';
import { GetHdProvider } from '../dev/eth.common';
const secp256k1 = require('secp256k1')
const fs = require('fs');
const certCommon: any = require('common');
const CertContract: any = require("cert-contract");
var config = require('../../config/config.json');
// const Web3 = require("web3");
// const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8546"));
@Controller('dgpa/issue')
export class IssueController {
  //constructor(private readonly appService: AppService) {}

  //This API is for internal deploy. Officially contract deploy has to use the one in the initial/insert-org
  @Post("contract-deploy")
  async contractRegistryDeploy(@Body() body: EthDTO, @Response() res: any) {
    // 測試時使用 idAccount:0 
    const certContract = CertContract.getHRCertContract();
    const hdProviderAccount = GetHdProvider(body.idAccount, body.providerUrl);
    certContract.setProvider(hdProviderAccount);
    certContract.defaults({ from: hdProviderAccount.address });

    let instance = await certContract.new();

    console.log("deploy cert Contract")

    if (instance && instance.address) {
      config.HRRPCertContract = instance.address;
      var jsonSrt = JSON.stringify(config);
      fs.writeFileSync('config/config.json', jsonSrt, 'utf8');
      return res.status(HttpStatus.OK).json({
        address: instance.address,
        req: body
      });
    } else {
      throw new HttpException("Deployment Contract Error: ", HttpStatus.BAD_REQUEST);
    }
  }

  @Post('upload-sign')
  public async insertUser(@Body() body: any/* UsersEthDTO*/, @Response() res: any) {
    if (!body) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'entity is required!' });
    }
    if (!body.owner_id) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'owner_id is null' });
    }
    if (!body.owner_addr) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'owner_addr is null' });
    }
    if (!body.unique_id) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'unique_id is null' });
    }
    if (!body.issue_org) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'issue_org is null' });
    }
    if (!body.owner_name) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'owner_name is null' });
    }
    if (!body.date) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'date is null' });
    }
    if (!body.reward_type) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'reward_type is null' });
    }
    if (!body.content) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'content is null' });
    }
    if (!body.issuer) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'issuer is null' });
    }
    if (!body.issuer.addr) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'issuer.addr is null' });
    }
    if (!body.issuer.privatekey) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'issuer.privatekey is null' });
    }
    if (!body.issuer.ID) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'issuer.ID' });
    }
    if (body.owner_name.length != body.owner_addr.length) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'wrong owner_name length' });
    }
    if (body.owner_id.length != body.owner_addr.length) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'wrong owner_id length' });
    }
    if (body.reward_type.length != body.owner_addr.length) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'wrong reward_type length' });
    }

    var contract = config["HRRPCertContract"]
    if (!contract) {
      throw new HttpException('contract address (req.contract) not found', HttpStatus.BAD_REQUEST);
    }

    let cert_id = new Array()
    for (var i in body.owner_id) {
      cert_id[i] = body.content + body.owner_id[i] + body.date
    }

    //let issue_id = certCommon.utilities.getRandomInt(100000)*1000;
    let issue_id_bytes32 = certCommon.utilities.sha256(body.unique_id)
    let unique_id = body.unique_id;

    let cert_id_bytes32 = certCommon.utilities.sha256Array(cert_id)
    let issue_org_bytes32 = certCommon.utilities.stringToBytes320x(body.issue_org)
    let owner_name_bytes32 = certCommon.utilities.stringArr2Bytes32Arr0x(body.owner_name)
    let owner_id_bytes32 = certCommon.utilities.stringArr2Bytes32Arr0x(body.owner_id)
    let date_bytes32 = certCommon.utilities.stringToBytes320x(body.date)
    let reward_type32 = certCommon.utilities.stringArr2Bytes32Arr0x(body.reward_type)
    let content_bytes32 = certCommon.utilities.stringToBytes32Array0x(body.content)
    let issuer_id = certCommon.utilities.stringToBytes320x(body.issuer.ID)

    //console.log("##### input to issue" + issue_id_bytes32, cert_id_bytes32, issue_org_bytes32, owner_name_bytes32, date_bytes32, reward_type32, content_bytes32,
    //  body.owner_addr, body.issuer.addr, issuer_id)
    //sign JWT

    let jsonToSign = body
    let mnemonic = jsonToSign["issuer"]["privatekey"]
    var path = config["path"]
    var type = config["ECDSA"]
    var keypair = certCommon.keygen.DeriveKey(mnemonic, path, type)
    var publickey = keypair.publicKey;
    var privatekey = keypair.privateKey;

    jsonToSign["issuer"]["publickey"] = publickey
    delete jsonToSign["issuer"]["privatekey"]
    const jsonToSignStr =  JSON.stringify(jsonToSign);

    let jsonArr = new Array()
    for (var i in jsonToSign.owner_name) {
      jsonArr[i] = JSON.parse(jsonToSignStr);
      jsonArr[i]["owner_addr"] = jsonToSign.owner_addr[i]
      jsonArr[i]["owner_name"] = jsonToSign.owner_name[i]
      jsonArr[i]["owner_id"] = jsonToSign.owner_id[i]
      jsonArr[i]["reward_type"] = jsonToSign.reward_type[i]
      //console.log("[" + i + "]" + JSON.stringify(jsonArr[i]))
    }
    
    let certSignature = new Array()
    let cert_sha256s = new Array()
    for (var i in jsonArr) {
      console.log("====== jsonArr ======");
      var jsonArrStr = JSON.stringify(jsonArr[i]);
      console.log("jsonArrStr", jsonArrStr);
      cert_sha256s[i] = certCommon.utilities.sha256(jsonArrStr).slice(2);
      console.log("cert_sha256:", cert_sha256s[i]);
      var msg = Buffer.from(cert_sha256s[i], 'hex');
      console.log("msg:", msg);
      certSignature[i] = secp256k1.sign(msg, Buffer.from(privatekey, 'hex')).signature.toString('base64');
      console.log("certSignature["+i+"]", certSignature[i]);
      console.log("verify:" ,secp256k1.verify(msg, Buffer.from(certSignature[i],'base64'), Buffer.from(publickey, 'hex')))
      //certSignature[i] = certCommon.sign.signJson(mnemonic, path, type, jsonArr[i]);
    }
    // var result = verifyByKjur(jsonToSign["issuer"]["publickey"], sJWS) 
    // console.log(result)

    const certContract = CertContract.getHRCertContract();
    const hdProviderIssuer = GetHdProvider(body.idIssuer, body.providerUrl, mnemonic);
    certContract.setProvider(hdProviderIssuer);
    const addressIssuer = hdProviderIssuer.address;
    
    const cert = await certContract.at(contract)

    for (i in cert_id_bytes32) {
      var CertContent = await cert.getCertContent(cert_id_bytes32[i], { from: addressIssuer });
      if( CertContent[0] != "0x0000000000000000000000000000000000000000000000000000000000000000") {
        res.status(HttpStatus.OK).json("cert already exist: " + cert_id_bytes32[i]);
        return
      }
    }

    // console.log(cert_id_bytes32.length,owner_name_bytes32.length, reward_type32.length, body.owner_addr.length);
    var gasNeed = await cert.issueContent.estimateGas(issue_id_bytes32, cert_id_bytes32, issue_org_bytes32, owner_name_bytes32, owner_id_bytes32, date_bytes32, reward_type32, content_bytes32, body.owner_addr, body.issuer.addr, issuer_id, unique_id);
    console.log("gas need:", gasNeed);
    // await web3.eth.sendTransaction({from:web3.eth.accounts[0], to:jsonToSign["issuer"]["addr"], value: gasNeed});
    let issueResult = await cert.issueContent(issue_id_bytes32, cert_id_bytes32, issue_org_bytes32, owner_name_bytes32, owner_id_bytes32, date_bytes32, reward_type32, content_bytes32, body.owner_addr, body.issuer.addr, issuer_id, unique_id, { from: addressIssuer, gasPrice:'1' });
    console.log("Issue Tx:", issueResult.tx);

    var certTx = new Array();
    for (var i in certSignature) {
      var gasNeed = await cert.sign.estimateGas(cert_id_bytes32[i], publickey, certSignature[i]);
      console.log("gas need:", gasNeed);
      // await web3.eth.sendTransaction({from:web3.eth.accounts[0], to:jsonToSign["issuer"]["addr"], value: gasNeed});
      let tx = await cert.sign(cert_id_bytes32[i], publickey, certSignature[i], { from: addressIssuer, gasPrice:'1' });
      certTx.push(tx.tx);
    }
    console.log("Cert Tx:", certTx);

    var outputurl = new Array()
    for (i in cert_id_bytes32) {
      outputurl[i] = "https://certproof.nchc.org.tw/dgpa2/verify?certid=" + cert_id_bytes32[i].slice(2)
    }

    let response = {
      txId: issueResult.tx,// issueResult2.tx],      
      url: outputurl,
      ID: issue_id_bytes32.slice(2),
      certTx: certTx
      //blockID: [issueResult.receipt.blockNumber],

    };
    res.status(HttpStatus.OK).json(response);

  }
  @Post('check-status')
  public async checkStatus(@Body() body: any, @Response() res: any) {
    if (!body) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'entity is required!' });
    }

    const certContract = CertContract.getHRCertContract();
    const hdProviderIssuer = GetHdProvider(body.idIssuer, body.providerUrl);
    certContract.setProvider(hdProviderIssuer);
    const addressIssuer = hdProviderIssuer.address;
    console.log("addressIssuer " + addressIssuer)
    var contract = config["HRRPCertContract"]
    if (!contract) {
      throw new HttpException('contract address (req.contract) not found', HttpStatus.BAD_REQUEST);
    }
    const cert = await certContract.at(contract)

    let tx = await cert.getSignStatus(body.cert_id, { from: addressIssuer });
    console.log("---STATUS---" + tx)
    let response = {
      result: tx
      //blockID: [issueResult.receipt.blockNumber],
    };
    res.status(HttpStatus.OK).json(response);

  }
  @Post('verify')
  public async verifySig(@Body() body: any, @Response() res: any) {
    if (!body) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'entity is required!' });
    }

    const certContract = CertContract.getHRCertContract();
    const hdProviderIssuer = GetHdProvider(body.idIssuer, body.providerUrl);
    certContract.setProvider(hdProviderIssuer);
    const addressIssuer = hdProviderIssuer.address;
    console.log("addressIssuer " + addressIssuer)
    var contract = config["HRRPCertContract"]
    if (!contract) {
      throw new HttpException('contract address (req.contract) not found', HttpStatus.BAD_REQUEST);
    }
    const cert = await certContract.at(contract)

    let tx = await cert.verify(body.cert_id, { from: addressIssuer });
    // var signatrue = tx[0];
    // var pubkey = tx[1];
    // var certHash = tx[2];
    // console.log("verify:" ,secp256k1.verify(Buffer.from(certHash,'hex'), Buffer.from(signatrue,'base64'), Buffer.from(pubkey, 'hex')))
    let response = {
      verifyInfo: tx
      //blockID: [issueResult.receipt.blockNumber],

    };
    res.status(HttpStatus.OK).json(response);

  }
  @Post('get-cert-info')
  public async getCertInfo(@Body() body: any, @Response() res: any) {
    if (!body) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'entity is required!' });
    }

    const certContract = CertContract.getHRCertContract();
    const hdProviderIssuer = GetHdProvider(body.idIssuer, body.providerUrl);
    certContract.setProvider(hdProviderIssuer);
    const addressIssuer = hdProviderIssuer.address;
    console.log("addressIssuer " + addressIssuer)
    var contract = config["HRRPCertContract"]
    if (!contract) {
      throw new HttpException('contract address (req.contract) not found', HttpStatus.BAD_REQUEST);
    }
    const cert = await certContract.at(contract)

    let tx = await cert.getCertContent(body.cert_id, { from: addressIssuer });
    let tx2 = await cert.getCertInfo(body.cert_id, { from: addressIssuer });


    let response = {
      certInfo: {
        issueOrg: tx[0],
        ownerName: tx[1],
        ownerID: tx[2],
        date: tx[3],
        rewardType: tx[4],
        rewardContent: tx[5],
        unique_id: tx[6],
        ownerAddr: tx2[0],
        issuerAddr: tx2[1],
        issuerID: tx2[2],
        revokeStatus: tx2[3]
      }
      //blockID: [issueResult.receipt.blockNumber],

    };
    res.status(HttpStatus.OK).json(response);
  }
  @Post('revoke-cert')
  public async revokeCert(@Body() body: any, @Response() res: any) {
    if (!body) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'entity is required!' });
    }
    if (!body.cert_id) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'cert_id is null' });
    }

    const certContract = CertContract.getHRCertContract();
    const hdProviderIssuer = GetHdProvider(body.idIssuer, body.providerUrl);
    certContract.setProvider(hdProviderIssuer);
    const addressIssuer = hdProviderIssuer.address;
    var contract = config["HRRPCertContract"]
    if (!contract) {
      throw new HttpException('contract address (req.contract) not found', HttpStatus.BAD_REQUEST);
    }
    const cert = await certContract.at(contract)

    let tx = await cert.revoke(body.cert_id, { from: addressIssuer });
    var response
    if(!tx.tx){
      response = false;
    } else {
      response = true;
    }
    
    res.status(HttpStatus.OK).json(response);
  }
}
