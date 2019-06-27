import { Get, Post, Body, Response, HttpStatus, HttpException, Controller } from '@nestjs/common';
import { UsersEthDTO } from './userInfo.dto';
import { EthDTO } from '../dev/eth.dto';
import { GetHdProvider } from '../dev/eth.common';
const fs = require('fs');
const certCommon: any = require('common');
const CertContract: any = require("cert-contract");
const CONFIG_FILE = 'config/config.json'
const config = require('../../' + CONFIG_FILE);
var sqlite = require('sqlite-sync');
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8546"));

@Controller('dgpa/initial')
export class InitialController {
  //constructor(private readonly appService: AppService) {}
  /*
    async updateConfig(variable,value){
      var data = fs.readFileSync(CONFIG_FILE).toString();
      data = JSON.parse(data);
      data[variable] = value;
      var buf = Buffer.from(JSON.stringify(data));
      fs.writeFileSync(CONFIG_FILE, buf)
    }*/

  @Post("db-contract-deploy")
  async contractRegistryDeploy(@Body() body: EthDTO, @Response() res: any) {
    // 測試時使用 idAccount:0 
    const hdProviderAccount = GetHdProvider(body.idAccount, body.providerUrl);

    const certDBContract = CertContract.getHRDBContract();
    certDBContract.setProvider(hdProviderAccount);
    certDBContract.defaults({ from: hdProviderAccount.address });

    let instance = await certDBContract.new();

    console.log("deploy certDB Contract")

    certCommon.utilities.update_config(CONFIG_FILE, "CertDBContract", instance.address)
    /* var data = fs.readFileSync(CONFIG_FILE).toString();
     data = JSON.parse(data);
     data["CertDBContract"] = instance.address;
     var buf = Buffer.from(JSON.stringify(data));
     fs.writeFileSync(CONFIG_FILE, buf)*/

    //this.updateConfig("CertDBContract", instance.address)

    if (instance && instance.address) {
      config.CertDBContract = instance.address;
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

  @Post('insert-user')
  public async insertUser(@Body() body: any/* UsersEthDTO*/, @Response() res: any) {
    if (!body) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'entity is required!' });
    }
    if (!body.userInfo){
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'userInfo is null' });
    }
    if (!body.userInfo.name){
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'userInfo.name is null' });
    }
    if (!body.userInfo.ID){
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'userInfo.ID is null' });
    }
    //var data = fs.readFileSync(CONFIG_FILE).toString();
    //data = JSON.parse(data);

    const mnemonic = certCommon.keygen.GenerateMnemonic(true);
    console.log("mnemonic: ", mnemonic);
    //const type = "secp256r1"//config["ECDSA"];//secp256k1;
    const type = config["ECDSA"];//secp256k1;
    const path = config["path"];
    var obj = {
      hello: "test",
      world: "gogo"
    }
    
    const key = certCommon.keygen.DeriveKey(mnemonic, path, type);
    let private_key = key.privateKey
    let public_key = key.publicKey
    
    let user_addr = certCommon.keygen.DeriveAddr(key.publicKey)

    console.log("====== private_key ====== ", private_key, private_key.length);
    console.log("====== private_key ====== ", public_key, public_key.length);

    var cmd = "UPDATE userinfo SET NAME = '" + body.userInfo.name + "', ADDRESS = '" + user_addr + "', PUBKEY = '" + public_key + "', MNEMONIC = '" + mnemonic + "' WHERE USERID LIKE '" + body.userInfo.ID + "'"
    sqlite.connect('info.db');

    sqlite.run(cmd, function (res) {
      if (res.error)
        console.log(res.error);
    });
    sqlite.close();

    //const hdProviderSubject = GetHdProvider(body.idSubject, body.providerUrl);
    //const addressSubject = hdProviderSubject.address;
    //certDBContract.setProvider(hdProviderIssuer);
    var contract = config["CertDBContract"]
    const certDBContract = CertContract.getHRDBContract();
    const hdProviderIssuer = GetHdProvider(body.idIssuer, body.providerUrl);
    certDBContract.setProvider(hdProviderIssuer);
    const addressIssuer = hdProviderIssuer.address;
    console.log("contract addr:", contract);
    if (!contract) {
      throw new HttpException('contract address (req.contract) not found', HttpStatus.BAD_REQUEST);
    }
    await certDBContract
      .at(contract)
      .then(callCert => {
        let tx = callCert.setUserInfo(user_addr, body.userInfo.name, public_key, { from: addressIssuer });

        return tx
      })
      .then(txSetCliam => {
        let r = {
          req: body,
          addressIssuer,
          privateKey: mnemonic,
          address: user_addr,
          txId: txSetCliam

        };
        res.status(HttpStatus.OK).json(r);
      })
      .catch(err => {
        throw new HttpException(err.toString(), HttpStatus.BAD_REQUEST);
      });

  }

  @Post('get-user-info')
  public async getUserInfo(@Body() body: any, @Response() res: any) {
    if (!body) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'entity is required!' });
    }


    var contract = config["CertDBContract"]
    const certDBContract = CertContract.getHRDBContract();
    const hdProviderIssuer = GetHdProvider(body.idIssuer, body.providerUrl);
    certDBContract.setProvider(hdProviderIssuer);
    const addressIssuer = hdProviderIssuer.address;
    if (!contract) {
      throw new HttpException('contract address (req.contract) not found', HttpStatus.BAD_REQUEST);
    }

    let callCert = null;
    await certDBContract
      .at(contract)
      .then(callCert => {
        let tx = callCert.getUserInfo(body.address, { from: addressIssuer });
        console.log("[DEBUG] " + tx)
        return tx
      })
      .then(txSetCliam => {
        let r = {
          req: body,
          addressIssuer,
          userInfo: txSetCliam

        };
        res.status(HttpStatus.OK).json(r);
      })
      .catch(err => {
        throw new HttpException(err.toString(), HttpStatus.BAD_REQUEST);
      });

  }

  @Post('insert-org')
  public async insertOrg(@Body() body: any, @Response() res: any) {
    if (!body) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'entity is required!' });
    }
    if (!body.orgInfo) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'orgInfo is null' });
    }
    if (!body.orgInfo.name) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'orgInfo.name is null' });
    }
    if (!body.orgInfo.ID) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'orgInfo.ID is null' });
    }


    const mnemonic = certCommon.keygen.GenerateMnemonic(true);
    const type = config["ECDSA"];//"secp256r1"];
    const path = config["path"];

    const key = certCommon.keygen.DeriveKey(mnemonic, path, type);
    let public_key = key.publicKey
    let org_addr = certCommon.keygen.DeriveAddr(key.publicKey)

    console.log("key " + public_key)
    console.log("addr " + org_addr)
    console.log("name " + body.orgInfo.name)
    console.log("ID " + body.orgInfo.ID)

    //-----------deploy org contract
    const certContract = CertContract.getHRCertContract();
    const hdProviderAccount = GetHdProvider(body.idAccount, body.providerUrl);
    certContract.setProvider(hdProviderAccount);
    const addressIssuer = hdProviderAccount.address;
    certContract.defaults({ from: addressIssuer });
    let instance = await certContract.new();
    console.log("deploy cert Contract")
    let orgContract = ""
    if (instance && instance.address) {
      orgContract = instance.address;
      certCommon.utilities.update_config(CONFIG_FILE, "HRRPCertContract", orgContract)

    } else {
      throw new HttpException("Deployment Contract Error: ", HttpStatus.BAD_REQUEST);
    }
    await web3.eth.sendTransaction({from:web3.eth.accounts[0], to:org_addr, value: web3.toWei(10000000000, "ether")});

    var cmd = "INSERT INTO orginfo (ORGID,NAME,ADDRESS,PUBKEY,CONTRACT,MNEMONIC) VALUES ('" + body.orgInfo.ID + "','" + body.orgInfo.name + "','" + org_addr + "','" + public_key + "','" + orgContract + "','" + mnemonic + "')";
    sqlite.connect('info.db');
    sqlite.run(cmd, function (res) {
      if (res.error)
        console.log(res.error);
    });
    sqlite.close();

    //-----------insert org info
    var contract = config["CertDBContract"]
    console.log("contract= " + contract)

    const certDBContract = CertContract.getHRDBContract();
    const hdProviderIssuer = GetHdProvider(body.idIssuer, body.providerUrl);
    certDBContract.setProvider(hdProviderIssuer);

    if (!contract) {
      throw new HttpException('contract address (req.contract) not found', HttpStatus.BAD_REQUEST);
    }

    let callCert = null;
    await certDBContract
      .at(contract)
      .then(callCert => {
        let tx = callCert.setOrgInfo(org_addr, body.orgInfo.name, public_key, orgContract, { from: addressIssuer });
        let r = {
          req: body,
          addressIssuer,
          privateKey: mnemonic,
          address: org_addr,
          orgContract: orgContract,
          txId: tx

        };
        hdProviderIssuer
        res.status(HttpStatus.OK).json(r);
      })
      .catch(err => {
        throw new HttpException(err.toString(), HttpStatus.BAD_REQUEST);
      });
  }
  @Post('get-org-info')
  public async getOrgInfo(@Body() body: any, @Response() res: any) {
    if (!body) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'entity is required!' });
    }
    var contract = config["CertDBContract"]
    const certDBContract = CertContract.getHRDBContract();
    const hdProviderIssuer = GetHdProvider(body.idIssuer, body.providerUrl);
    certDBContract.setProvider(hdProviderIssuer);
    const addressIssuer = hdProviderIssuer.address;
    if (!contract) {
      throw new HttpException('contract address (req.contract) not found', HttpStatus.BAD_REQUEST);
    }

    await certDBContract
      .at(contract)
      .then(callCert => {
        let tx = callCert.getOrgInfo(body.address, { from: addressIssuer });
        console.log("[DEBUG] " + tx)
        return tx
      })
      .then(txSetCliam => {
        let r = {
          req: body,
          addressIssuer,
          orgInfo: txSetCliam

        };
        res.status(HttpStatus.OK).json(r);
      })
      .catch(err => {
        throw new HttpException(err.toString(), HttpStatus.BAD_REQUEST);
      });

  }
  @Post('get-user-publickey')
  public async getUserPublickey(@Body() body: any, @Response() res: any) {
    if (!body) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'entity is required!' });
    }
    var contract = config["CertDBContract"]
    const certDBContract = CertContract.getHRDBContract();
    const hdProviderIssuer = GetHdProvider(body.idIssuer, body.providerUrl);
    certDBContract.setProvider(hdProviderIssuer);
    const addressIssuer = hdProviderIssuer.address;
    if (!contract) {
      throw new HttpException('contract address (req.contract) not found', HttpStatus.BAD_REQUEST);
    }

    let callCert = null;
    await certDBContract
      .at(contract)
      .then(callCert => {
        let tx = callCert.getUserPublickey(body.address, { from: addressIssuer });
        console.log("[DEBUG] " + tx)
        return tx
      })
      .then(txSetCliam => {
        let r = {
          req: body,
          addressIssuer,
          publickey: txSetCliam

        };
        res.status(HttpStatus.OK).json(r);
      })
      .catch(err => {
        throw new HttpException(err.toString(), HttpStatus.BAD_REQUEST);
      });

  }
  @Post('get-org-publickey')
  public async getOrgPublickey(@Body() body: any, @Response() res: any) {
    if (!body) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'entity is required!' });
    }
    var contract = config["CertDBContract"]
    const certDBContract = CertContract.getHRDBContract();
    const hdProviderIssuer = GetHdProvider(body.idIssuer, body.providerUrl);
    certDBContract.setProvider(hdProviderIssuer);
    const addressIssuer = hdProviderIssuer.address;
    if (!contract) {
      throw new HttpException('contract address (req.contract) not found', HttpStatus.BAD_REQUEST);
    }

    let callCert = null;
    await certDBContract
      .at(contract)
      .then(callCert => {
        let tx = callCert.getOrgPublickey(body.address, { from: addressIssuer });
        console.log("[DEBUG] " + tx)
        return tx
      })
      .then(txSetCliam => {
        let r = {
          req: body,
          addressIssuer,
          publickey: txSetCliam

        };
        res.status(HttpStatus.OK).json(r);
      })
      .catch(err => {
        throw new HttpException(err.toString(), HttpStatus.BAD_REQUEST);
      });

  }

  @Get('simple-get')
  root(@Response() res: any) {
    const message = 'Hello';
    res.status(HttpStatus.OK).json(message);
  }
  @Post('simple-post')
  getAddress(@Body() body: any, @Response() res: any) {
    const r = {
      name: 'superorange',
      orgID: body.orgID,
      success: true
    };
    res.status(HttpStatus.OK).json(r);
  }

}

