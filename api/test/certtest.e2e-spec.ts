import { HttpStatus } from '@nestjs/common';
import { GetReq, PostReq, ExpectRespError } from './test.common';
//import { ENETRESET } from 'constants';
const certCommon: any = require('common');
const config = require('../config/config.json');

const TYPE = config["ECDSA"];
const PATH = config["path"];
//const fs: any = require('fs');
//const needle = require('needle')
let DEPLOY_DB_CONTRACT_ADDRESS = '0x00';
let USER_MNEMONIC = "";
let USER_ADDRESS = "";
let USER_NAME = "王大明";
let USER_ID = "A123456789";
let USER_PUBLICKEY = "";

let ORG_MNEMONIC = "";
let ORG_ADDRESS = "";
let ORG_NAME = "人事行政總處獎懲系統";
let ORG_ID = "A05";
let ORG_PUBLICKEY = "";

let USER_NAME2 = "林小明";
let USER_ID2 = "T232255452";
let USER_MNEMONIC2 = "";
let USER_ADDRESS2 = "";
let USER_PUBLICKEY2 = "";

let USER_NAME3 = "謝老闆";
let USER_ID3 = "B287654321";
let USER_MNEMONIC3 = "";
let USER_ADDRESS3 = "";
let USER_PUBLICKEY3 = "";

let UNIQUE_ID="○○○字第○○○○○○○號"
let DATE ="2018/10/20"
let REWARD_TYPE1 = "嘉獎一支"
let REWARD_TYPE2 = "嘉獎兩支"
let REWARD_CONTENT = "扶老太太過馬路，克服困難，圓滿達成"

let GOT_TOKEN;
//

let DEPLOY_CONTRACT_ADDRESS = '0x00';

test('/auth/get-token', async () => {
  const body = {
    pwd: 'test'
  }
  const response = await PostReq('/auth/get-token', body, null);
  ExpectRespError(response, HttpStatus.OK);
  GOT_TOKEN = response.body.token;
  console.log("!!! GET TOKEN !!!!" + GOT_TOKEN)
});

test('/initial/db-contract-deploy', async () => {
  const body = {
    idAccount: 0
  }
  const response = await PostReq('/initial/db-contract-deploy', body, GOT_TOKEN);
  ExpectRespError(response, HttpStatus.OK);
  expect(response.body.address).toBeTruthy();
  DEPLOY_DB_CONTRACT_ADDRESS = response.body.address;
  console.log("!!! CERT CONTRACT ADDR !!!!" + DEPLOY_DB_CONTRACT_ADDRESS)
});

test('/initial/insert-user', async () => {
  const body = {
    userInfo: {
      name: USER_NAME,
      ID: USER_ID
    }
    //idIssuer:0 
    //providerUrl:
  }
  const response = await PostReq('/initial/insert-user', body, GOT_TOKEN);
  ExpectRespError(response, HttpStatus.OK);
  //expect(response.body.privateKey).toMatch(new RegExp('\p{Han}\s\p{Han}\s\p{Han}\s\p{Han}\s\p{Han}\s\p{Han}\s\p{Han}\s\p{Han}\s\p{Han}'),);
  USER_MNEMONIC = response.body.privateKey;
  USER_ADDRESS = response.body.address;
  console.log("USER_MNEMONIC" + USER_MNEMONIC)
  console.log("USER_ADDRESS" + USER_ADDRESS)
  //expect(response.address).toHaveLength(42);

});

test('/initial/get-user-info', async () => {
  const body = {
    address: USER_ADDRESS
  }


  const key = certCommon.keygen.DeriveKey(USER_MNEMONIC, PATH, TYPE);
  USER_PUBLICKEY = key.publicKey

  const response = await PostReq('/initial/get-user-info', body, GOT_TOKEN);
  ExpectRespError(response, HttpStatus.OK);
  expect(response.body.userInfo[0]).toBe(USER_NAME);
  expect(response.body.userInfo[1]).toBe(USER_PUBLICKEY);

});

test('/initial/insert-user2', async () => {
  const body = {
    userInfo: {
      name: USER_NAME2,
      ID: USER_ID2
    }
    //idIssuer:0 
    //providerUrl:
  }
  const response = await PostReq('/initial/insert-user', body, GOT_TOKEN);
  ExpectRespError(response, HttpStatus.OK);
  //expect(response.body.privateKey).toMatch(new RegExp('\p{Han}\s\p{Han}\s\p{Han}\s\p{Han}\s\p{Han}\s\p{Han}\s\p{Han}\s\p{Han}\s\p{Han}'),);
  USER_MNEMONIC2 = response.body.privateKey;
  USER_ADDRESS2 = response.body.address;
  console.log("USER_MNEMONIC2" + USER_MNEMONIC2)
  console.log("USER_ADDRESS2" + USER_ADDRESS2)
  //expect(response.address).toHaveLength(42);

});

test('/initial/get-user-info2', async () => {
  const body = {
    address: USER_ADDRESS2
  }


  const key = certCommon.keygen.DeriveKey(USER_MNEMONIC2, PATH, TYPE);
  USER_PUBLICKEY2 = key.publicKey

  const response = await PostReq('/initial/get-user-info', body, GOT_TOKEN);
  ExpectRespError(response, HttpStatus.OK);
  expect(response.body.userInfo[0]).toBe(USER_NAME2);
  expect(response.body.userInfo[1]).toBe(USER_PUBLICKEY2);

});
test('/initial/insert-user3', async () => {
  const body = {
    userInfo: {
      name: USER_NAME3,
      ID: USER_ID3
    }
    //idIssuer:0 
    //providerUrl:
  }
  const response = await PostReq('/initial/insert-user', body, GOT_TOKEN);
  ExpectRespError(response, HttpStatus.OK);
  //expect(response.body.privateKey).toMatch(new RegExp('\p{Han}\s\p{Han}\s\p{Han}\s\p{Han}\s\p{Han}\s\p{Han}\s\p{Han}\s\p{Han}\s\p{Han}'),);
  USER_MNEMONIC3 = response.body.privateKey;
  USER_ADDRESS3 = response.body.address;
  console.log("USER_MNEMONIC" + USER_MNEMONIC3)
  console.log("USER_ADDRESS" + USER_ADDRESS3)
  //expect(response.address).toHaveLength(42);

});

test('/initial/get-user-info3', async () => {
  const body = {
    address: USER_ADDRESS3
  }


  const key = certCommon.keygen.DeriveKey(USER_MNEMONIC3, PATH, TYPE);
  USER_PUBLICKEY3 = key.publicKey

  const response = await PostReq('/initial/get-user-info', body, GOT_TOKEN);
  ExpectRespError(response, HttpStatus.OK);
  expect(response.body.userInfo[0]).toBe(USER_NAME3);
  expect(response.body.userInfo[1]).toBe(USER_PUBLICKEY3);

});
test('/initial/insert-org', async () => {
  const body = {
    orgInfo: {
      name: ORG_NAME,
      ID: ORG_ID
    }
    //idIssuer:0 
    //providerUrl:
  }
  const response = await PostReq('/initial/insert-org', body, GOT_TOKEN);
  ExpectRespError(response, HttpStatus.OK);
  ORG_MNEMONIC = response.body.privateKey;
  ORG_ADDRESS = response.body.address;
  DEPLOY_CONTRACT_ADDRESS = response.body.orgContract;
  console.log("ORG_MNEMONIC" + ORG_MNEMONIC)
  console.log("ORG_ADDRESS" + ORG_ADDRESS)
  console.log("orgContract" + DEPLOY_CONTRACT_ADDRESS)

});

test('/initial/get-org-info', async () => {
  const body = {
    address: ORG_ADDRESS
  }
  const key = certCommon.keygen.DeriveKey(ORG_MNEMONIC, PATH, TYPE);
  ORG_PUBLICKEY = key.publicKey

  const response = await PostReq('/initial/get-org-info', body, GOT_TOKEN);
  ExpectRespError(response, HttpStatus.OK);
  expect(response.body.orgInfo[0]).toBe(ORG_NAME);
  expect(response.body.orgInfo[1]).toBe(ORG_PUBLICKEY);
  expect(response.body.orgInfo[2]).toBe(DEPLOY_CONTRACT_ADDRESS);

});

test('/initial/get-user-publickey', async () => {
  const body = {
    address: USER_ADDRESS
  }

  const response = await PostReq('/initial/get-user-publickey', body, GOT_TOKEN);
  ExpectRespError(response, HttpStatus.OK);
  expect(response.body.publickey).toBe(USER_PUBLICKEY);

});

test('/initial/get-org-publickey', async () => {
  const body = {
    address: ORG_ADDRESS
  }

  const response = await PostReq('/initial/get-org-publickey', body, GOT_TOKEN);
  ExpectRespError(response, HttpStatus.OK);
  expect(response.body.publickey).toBe(ORG_PUBLICKEY);

});


test('/issue/contract-deploy', async () => {
  const body = {
    idAccount: 0
  }
  const response = await PostReq('/issue/contract-deploy', body, GOT_TOKEN);
  ExpectRespError(response, HttpStatus.OK);
  expect(response.body.address).toBeTruthy();
  DEPLOY_CONTRACT_ADDRESS = response.body.address;
  console.log("!!! CERT CONTRACT ADDR !!!!" + DEPLOY_CONTRACT_ADDRESS)
});


test('/issue/upload-sign', async () => {
  const body = {
    owner_addr: [USER_ADDRESS, USER_ADDRESS2],
    unique_id: UNIQUE_ID,
    owner_name: [USER_NAME, USER_NAME2], // max 10
    owner_id: [USER_ID, USER_ID2], // max 10
    reward_type: [REWARD_TYPE1, REWARD_TYPE2], //max 10
    issue_org: ORG_NAME,
    date: DATE, //核定日期
    content: REWARD_CONTENT, //獎懲事由
    issuer: {
      addr:ORG_ADDRESS,
      privatekey: ORG_MNEMONIC,
      ID: USER_ID3
    }
  }

  
  let issue_id_bytes32 = certCommon.utilities.sha256(body.unique_id)  
  
  let cert_id = new Array()
  for(var i in body.owner_id){
    cert_id[i] = body.unique_id+body.owner_id[i]
  }

  var outputurl = new Array()
  for(var i in body.owner_addr){
    var  cert_id_bytes32 = certCommon.utilities.sha256Array(cert_id)
    outputurl[i] = "https://hrcert.nchc.org.tw/qrcode/"+cert_id_bytes32[i].slice(2)
  }
  
  const response = await PostReq('/issue/upload-sign', body, GOT_TOKEN);
  ExpectRespError(response, HttpStatus.OK);  
  expect(response.body.url[0]).toBe(outputurl[0]);
  expect(response.body.url[1]).toBe(outputurl[1]);
  expect(response.body.ID).toBe(issue_id_bytes32.slice(2));
  

});

test('/issue/check-status', async () => {

  
  let cert_id = certCommon.utilities.sha256(UNIQUE_ID+USER_ID)
   
  const body = {
    cert_id: cert_id
  }

  const response = await PostReq('/issue/check-status', body, GOT_TOKEN);
  ExpectRespError(response, HttpStatus.OK);
 
  expect(response.body.result).toBeTruthy
  

});

test('/issue/get-cert-info', async () => {

  
  let cert_id = certCommon.utilities.sha256(UNIQUE_ID+USER_ID)
   
  const body = {
    cert_id: cert_id
  }

  const response = await PostReq('/issue/get-cert-info', body, GOT_TOKEN);
  ExpectRespError(response, HttpStatus.OK);
 
  expect(certCommon.utilities.bytes32ToString(response.body.certInfo.issueOrg,2)).toBe(ORG_NAME)
  expect(certCommon.utilities.bytes32ToString(response.body.certInfo.ownerName,2)).toBe(USER_NAME)
  expect(certCommon.utilities.bytes32ToString(response.body.certInfo.date,2)).toBe(DATE)
  expect(certCommon.utilities.bytes32ToString(response.body.certInfo.rewardType,2)).toBe(REWARD_TYPE1)
  expect(certCommon.utilities.bytes32ArrToString(response.body.certInfo.rewardContent)).toBe(REWARD_CONTENT)

  
  expect(response.body.certInfo.ownerAddr).toBe(USER_ADDRESS)
  expect(response.body.certInfo.issuerAddr).toBe(ORG_ADDRESS)
  expect(certCommon.utilities.bytes32ToString(response.body.certInfo.issuerID,2)).toBe(USER_ID3)
  //certCommon.utilities.bytes32ToString(
  

});
/*
test('/issue/verify', async () => {

  
  let cert_id = certCommon.utilities.sha256(UNIQUE_ID+USER_ID)
   
  const body = {
    cert_id: cert_id
  }

  const response = await PostReq('/issue/verify', body, null);
  ExpectRespError(response, HttpStatus.OK);
  var sJWS = response.body.verifyInfo[0]
  var pubkey = response.body.verifyInfo[1]

  expect(sJWS).toBe("outputurl[0]");
  expect(pubkey).toBe(ORG_PUBLICKEY);

 // var result = certCommon.sign.verifyByKjur(pubkey, sJWS) 
  // console.log(result)
 // expect(result).toBeTruthy

});*/
/*
  test('simple post', async () => {
    var org="NCTU"

    const body = {
        orgID: org
    }
    const response = await PostReq('/mytest/simple-post', body);
    ExpectRespError(response, HttpStatus.OK); 
    expect(response.body.name).toBe('superorange');
    expect(response.body.orgID).toBe(org);

  });

*/