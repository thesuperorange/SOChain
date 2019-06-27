const EthereumHRDB = artifacts.require('HR_DB')

contract('EthereumHR_DB', accounts => {

    let certHRDB    
    before(async () => {
        certHRDB = await EthereumHRDB.new()
    })
//-----------------did
const user_mnemonic = "蒙 般 展 爛 資 旦 七 經 債 肥 否 駛"
const org_mnemonic = "怒 徽 祥 蝕 擦 溝 棚 芳 給 天 座 害"
const TEST_PATH = "m/2018'/5'/1'/0"; //
const TEST_ECDSA_CURVE = "secp256r1"

let user_pubkey ="02fc0061e29fa6e1ca56a993e6d819eccbd800ac1bc9e19b5324540196a0be7de4"
//"02025ef7e3d34d9354a78ca122f7e16393a4774250b8101f9c0098e3193d1868df"]

let org_pubkey =  "03693a0bbb2641919dd7375a58b410b27a1e9d39f89ece2f4af96aba86bbe55f27"
//"02a0dc644fd24bb421c12a2e53ed95c1934c1f0831a2442b0916268dd6e01a3cb4"]

let user_addr = "0x52f9645163bf84c3fce5dd8ec5f48d3b23ed524e"
let org_addr =  "0xbd192148eed8a5a5d18afa05204a13c2e4458447"
let contract_addr =  "0x38562148eed8a5a5d18afa05204a13c2e4458447"
let contract_addr2 =  "0x49562148eed8a5a5d18afa05204a13c2e4458447"

let user_name="王大明"
let org_name = "人事總處獎懲系統"

it('test setUserInfo', async () => {   
   
    let tx = await certHRDB.setUserInfo(user_addr,user_name,user_pubkey,{from: accounts[5]})
  
    let entry = await certHRDB.getUserInfo(user_addr)  
    assert.equal(entry[1], user_pubkey, 'user public key1 is incorrect')
  //  assert.equal(entry[2], user_pubkey[1], 'user public key2 is incorrect')
    assert.equal(entry[0], user_name, 'user name is incorrect')
    let pubkey = await certHRDB.getUserPublickey(user_addr)  
    assert.equal(pubkey, user_pubkey, 'publickey1 hex should have correct value')
    /*let pubkey2 = await certHRDB.getUserPublickey2(user_addr)  
    assert.equal(pubkey2, user_pubkey[1], 'publickey2 hex should have correct value')*/
    
  })

  it('test setOrgInfo', async () => {
  
    let tx = await certHRDB.setOrgInfo(org_addr,org_name,org_pubkey,contract_addr,{from: accounts[5]})
  
    let entry = await certHRDB.getOrgInfo(org_addr)  
    assert.equal(entry[1], org_pubkey, 'user public key1 is incorrect')
    assert.equal(entry[0], org_name, 'user name is incorrect')
    assert.equal(entry[2], contract_addr, 'org contract addr is incorrect')

    let pubkey = await certHRDB.getOrgPublickey(org_addr)  
    assert.equal(pubkey, org_pubkey, 'publickey1 hex should have correct value')

    let contract = await certHRDB.getOrgContract(org_addr)  
    assert.equal(contract, contract_addr, 'contract_addr should have correct value')

    let tx2 = await certHRDB.updateContractAddr(org_addr,contract_addr2,{from: accounts[5]})

    let contract2 = await certHRDB.getOrgContract(org_addr)  
    assert.equal(contract2, contract_addr2, 'contract_addr should have correct value')
    
    
  })
/*-----------------how to generate addr
function test() {
    const mnemonic = "蒙 般 展 爛 資 旦 七 經 債 肥 否 駛"
    const mnemonic2 = "怒 徽 祥 蝕 擦 溝 棚 芳 給 天 座 害"
    const TEST_PATH = "m/2018'/5'/1'/0"; //
    const TEST_ECDSA_CURVE = "secp256r1"
    var pkDerive =DeriveKey(mnemonic, TEST_PATH, TEST_ECDSA_CURVE)
     console.log("public"+pkDerive.publicKey);
    var pkDerive2 =DeriveKey(mnemonic2, TEST_PATH, TEST_ECDSA_CURVE)
     console.log("public2"+pkDerive2.publicKey);
  
    var DID1 = CreateTcEduNchcV0DIDoc(mnemonic,TEST_PATH, TEST_ECDSA_CURVE);
    var DID2 = CreateTcEduNchcV0DIDoc(mnemonic2,TEST_PATH, TEST_ECDSA_CURVE);
  
     console.log("public1-0 "+DID1.publicKey[0].publicKeyHex);
     console.log("public2-0 "+DID2.publicKey[0].publicKeyHex);
  
     console.log("public1-1 "+DID1.publicKey[1].publicKeyHex);
     console.log("public2-1 "+DID2.publicKey[1].publicKeyHex);
  
     //addr generate by key[1]
     var fullpublickey = sign.pubxtofull(DID1.publicKey[1].publicKeyHex);
     var upk_buf = new Buffer(fullpublickey, 'hex');  
     var addr_buf = util.pubToAddress(upk_buf.slice(1, 65), true);  
     var addr = "0x" +addr_buf.toString('hex');
     console.log("addr 1 "+addr);
     
     var fullpublickey2 = sign.pubxtofull(DID2.publicKey[1].publicKeyHex);
     var upk_buf2 = new Buffer(fullpublickey2, 'hex');  
     var addr_buf2 = util.pubToAddress(upk_buf2.slice(1, 65), true);  
     var addr2 = "0x" +addr_buf2.toString('hex');
     console.log("addr 2 "+addr2);
  
  }*/

  /*
  public1-0 02fc0061e29fa6e1ca56a993e6d819eccbd800ac1bc9e19b5324540196a0be7de4
  public2-0 03693a0bbb2641919dd7375a58b410b27a1e9d39f89ece2f4af96aba86bbe55f27
  public1-1 02025ef7e3d34d9354a78ca122f7e16393a4774250b8101f9c0098e3193d1868df
  public2-1 02a0dc644fd24bb421c12a2e53ed95c1934c1f0831a2442b0916268dd6e01a3cb4
  public1-2 02190244c544c5532598d36deb800cfa74429b3a3203e24de51c73971c1cb7f47c
  public2-2 02190244c544c5532598d36deb800cfa74429b3a3203e24de51c73971c1cb7f47c
*/


})