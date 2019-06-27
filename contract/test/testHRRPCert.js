const EthereumHRCert = artifacts.require('HR_RPCert')

const crypto = require('crypto');
const certCommon = require('common')



 

contract('EthereumHR_Cert', accounts => {

    let certHRCert    
    before(async () => {
        certHRCert = await EthereumHRCert.new()
    })
//-----------------did
let user_pubkey ="02fc0061e29fa6e1ca56a993e6d819eccbd800ac1bc9e19b5324540196a0be7de4"


let issuer_addr =  "0xbd192148eed8a5a5d18afa05204a13c2e4458447"

let issuer_id = "0x38e8a1698ee5a5f184f6a867d17b6c8def70de216445a7d26df0b765287683bf"

let owner_addr = ["0x52f9645163bf84c3fce5dd8ec5f48d3b23ed524e", "0x1122345163bf84c3fce5dd8ec5f48d3b23ed524e"]
let owner_id = ["A1234567890","T245678981"]
let unique_id = "xxx字第○○○○○○○號"
let owner_name=["王大明","林小明"]
let issue_org="人事處"
let date="2018/10/20"
let title = ["嘉獎一支","嘉獎兩支"]
let content = "扶老太太過馬路，克服困難，圓滿達成"

let cert_id_bytes32=[]

it('test issue', async () => {   


    //let issue_id = certCommon.utilities.getRandomInt(100000)*1000;
   // let n =owner_addr.length
   // let cert_id = Array.from(new Array(n),(val,index)=>index+issue_id)

   let cert_id = new Array()
   for(var i in owner_id){
     cert_id[i] = unique_id+owner_id[i]
   }
   
   //let issue_id = certCommon.utilities.getRandomInt(100000)*1000;
   let issue_id_bytes32 = certCommon.utilities.sha256(unique_id)
    cert_id_bytes32 = certCommon.utilities.sha256Array(cert_id)

    //cert_id_bytes32 = certCommon.utilities.sha256Array(unique_id)
    issue_org_bytes32 = certCommon.utilities.stringToBytes320x(issue_org)
    owner_name_bytes32 = certCommon.utilities.stringArr2Bytes32Arr0x(owner_name)
    date_bytes32 = certCommon.utilities.stringToBytes320x(date)
    reward_type32 = certCommon.utilities.stringArr2Bytes32Arr0x(title)
    content_bytes32 = certCommon.utilities.stringToBytes32Array0x(content)
    console.log("[DEBUG] cert_id_bytes32="+ cert_id_bytes32)
    console.log("[DEBUG] issue_org_bytes32="+ issue_org_bytes32)
    console.log("[DEBUG] owner_name_bytes32="+ owner_name_bytes32)
    console.log("[DEBUG] date_bytes32="+ date_bytes32)
    console.log("[DEBUG] reward_type32="+ reward_type32)
    console.log("[DEBUG] content_bytes32="+ content_bytes32)
 
  
    tx = await certHRCert.issueContent(issue_id_bytes32, cert_id_bytes32,issue_org_bytes32, owner_name_bytes32, date_bytes32, reward_type32, content_bytes32,
        owner_addr,  issuer_addr,  issuer_id)
    let entry = await certHRCert.getCertInfo(cert_id_bytes32[0])

    assert.equal(entry[0], owner_addr[0], 'owner addr is incorrect')
    assert.equal(entry[1], issuer_addr, 'issuer addr is incorrect')
    assert.equal(entry[2], issuer_id, 'issueid is incorrect')
    

    let entry2 = await certHRCert.getCertContent(cert_id_bytes32[0])         
    assert.equal(certCommon.utilities.bytes32ToString(entry2[0],2), issue_org, 'issuer org is incorrect')
    assert.equal(certCommon.utilities.bytes32ToString(entry2[1],2), owner_name[0], 'owner name is incorrect')    
    assert.equal(certCommon.utilities.bytes32ToString(entry2[2],2), date, 'date is incorrect')    
    assert.equal(certCommon.utilities.bytes32ToString(entry2[3],2), title[0], 'reward type is incorrect')

    console.log("[DEBUG] content_bytes32="+ entry2[4])
    let content_r = certCommon.utilities.bytes32ArrToString(entry2[4])
    assert.equal(content_r, content, 'content is incorrect')
    

    let status = await certHRCert.getSignStatus(cert_id_bytes32[0])  
    assert.equal(status, false, 'sign status should have correct value')
    
    
    let check = await certHRCert.checkExistence(cert_id_bytes32[0])  
    assert.equal(check, true, 'exist should have correct value')
    
  })

  it('test sign', async () => {

    let sJWS="eyJhbGciOiJFUzI1NiIsICJjdHkiOiJKV1QifQ.eyJpc3N1ZV9vcmciOiLkurrkuovooYzmlL_nuL3omZUiLCJuYW1lIjoi546L5aSn5piOIiwiZGF0ZSI6IjIwMTgvMTAvMjAiLCJ0aXRsZSI6IuWYieeNjuS4gOaUryIsImNvbnRlbnQiOiLnjovlpKfmmI7mibbogIHlpKrlpKrpgY7ppqzot6_vvIzoqJjlmInnjY7kuIDmlK8ifQ.veE7UxVKQuWMtIrZhTk3Yvq3ksxTckGPtUrlFDW0H5CmNBmGzzn4VOs47k0F_6aGgfY2mPykhwwcqTR_p2qhwQ"
     
    let tx = await certHRCert.sign(cert_id_bytes32[0], user_pubkey,sJWS,{from: accounts[5]}) 
   let status = await certHRCert.getSignStatus(cert_id_bytes32[0])  
    assert.equal(status, true, 'sign status should have correct value')

    let result = await certHRCert.verify(cert_id_bytes32[0])  
    assert.equal(result[0], sJWS, 'signature should have correct value')
    assert.equal(result[1], user_pubkey, 'public key should have correct value')
    assert.equal(result[2], true, 'sign status should have correct value')
    


  })
})