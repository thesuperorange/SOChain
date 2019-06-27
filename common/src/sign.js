const rs = require('jsrsasign');
const keytool = require("./keygen");
const ecurve = require('ecurve');
var BigInteger = require('bigi')
//var config = require('../config/config');
const fs = require('fs');

function signJson(mnemonic,path,type, jsonStr) {

    //get private key

    const dkey = keytool.DeriveKey(mnemonic, path, type);
    var prvKey = dkey.privateKey;
    //console.log(prvKey);
    //sign
    var sJWS = signByKjur(prvKey, jsonStr, type)
    //console.log(sJWS);
    //call API
    return sJWS

}
function signByKjur(prvhex, json, type) {
    var ecKeypair = rs.KEYUTIL.generateKeypair("EC", type);
    var prvobj = ecKeypair.prvKeyObj
    prvobj.prvKeyHex = prvhex
    //var pubobj=ecKeypair.pubKeyObj
    //pubobj.pubKeyHex=btcr1pub_full
    //console.log(prvobj)
    //console.log(pubobj)
    var pemprv = rs.KEYUTIL.getPEM(prvobj, "PKCS8PRV")
    //var pempub = rs.KEYUTIL.getPEM(pubobj, "PKCS8PUB")
    //console.log(pemprv)
    //console.log(pempub)
    var sJWS = rs.KJUR.jws.JWS.sign(null, '{"alg":"ES256", "cty":"JWT"}', json, pemprv);
    return sJWS
}

function verifyByKjur(pubx, sJWS, type) {

    var fullpubkey =  keytool.pubxtofull(pubx)

    var ecKeypair = rs.KEYUTIL.generateKeypair("EC", type);
    // var prvobj=ecKeypair.prvKeyObj
    // prvobj.prvKeyHex=prvhex
    var pubobj = ecKeypair.pubKeyObj
    pubobj.pubKeyHex = fullpubkey
    //console.log(prvobj)
    //console.log(pubobj)
    // var pemprv = rs.KEYUTIL.getPEM(prvobj, "PKCS8PRV")
    var pempub = rs.KEYUTIL.getPEM(pubobj, "PKCS8PUB")
    //console.log(pempub)
    var result = rs.KJUR.jws.JWS.verify(sJWS, pempub);

    return result
}


module.exports = {
    signJson: signJson,
    signByKjur: signByKjur,
    verifyByKjur: verifyByKjur,
   
    
  };
function test() {
    var testmnemonic = "雛 張 壞 施 防 勵 鋼 廣 伸 弟 插 酒";
    var path ="m/2018'/11'/1'"
    var type = "secp256r1"
    let pubkey1 = keytool.DeriveKey(testmnemonic,path,type )
    var pubx=pubkey1.publicKey
    console.log("publickey = "+pubx)
    testjson =
    { 
        issue_org:"人事行政總處",
        name: "王大明", 
        date:"2018/10/20", 
        title:"嘉獎一支", 
        content:"王大明扶老太太過馬路，記嘉獎一支" 
        }
        
    
    var sJWS = signJson(testmnemonic,path,type, testjson);
    console.log("sJWS=" + sJWS);
    var result = verifyByKjur(pubx, sJWS) 
    console.log(result)
}


function test2(){
body = {
    owner_addr: ["0x0000000000000000000000000000000000000456", "0x0000000000000000000000000000000000000123"],
    unique_id: "○○○字第○○○○○○○號",
    owner_name: ["王曉明", "林大名"], // max 10
    owner_id: ["A123456789", "B123456789"], // max 10
    reward_type: ["嘉獎一支", "嘉獎兩支"], //max 10
    issue_org: "人事處",
    date: "2018/10/20", //核定日期
    content: "扶老太太過馬路，克服困難，圓滿達成", //獎懲事由
    issuer: {
      addr:"0x1f3feae701286e31e97965f728e4fc8f15bc753b",
      privatekey: "香 您 斷 善 斤 楚 乘 烷 糖 邀 壤 盾",
      ID: "C123456789"
    
    }
  }
let jsonToSign = body
console.log( jsonToSign["issuer"]["privatekey"])
console.log( jsonToSign["issuer"]["addr"])
let mnemonic =  jsonToSign["issuer"]["privatekey"]
var path ="m/2018'/11'/1'"
var type = "secp256r1"
jsonToSign["issuer"]["publickey"] = keytool.DeriveKey(mnemonic,path,type).publicKey
delete jsonToSign["issuer"]["privatekey"]
console.log( jsonToSign["issuer"]["publickey"])

console.log( JSON.stringify(jsonToSign))

let jsonArr=new Array()
for(var i in jsonToSign["owner_addr"]){
    jsonArr[i] = jsonToSign
    jsonArr[i]["owner_addr"] = jsonToSign["owner_addr"][i]
    jsonArr[i]["owner_name"] = jsonToSign["owner_name"][i]
    jsonArr[i]["owner_id"] = jsonToSign["owner_id"][i]
    jsonArr[i]["reward_type"] = jsonToSign["reward_type"][i]

    console.log( "["+i+"]"+JSON.stringify(jsonArr[i]))
}



var sJWS = signJson(mnemonic,path,type, jsonToSign);
console.log("sJWS=" + sJWS);
var result = verifyByKjur(jsonToSign["issuer"]["publickey"], sJWS) 
console.log(result)

}

