const bip39 = require('bip39')
const bitcoinSecp256r1 = require('./bitcoinjs-lib-secp256r1')
const ethUtil = require('ethereumjs-util')
const ecurve = require('ecurve')
const BigInteger = require('bigi')
const bitcoin = require('bitcoinjs-lib')

function GenerateMnemonic(isChineseTraditional) {
    // Generate a random mnemonic (uses crypto.randomBytes under the hood), defaults to 128-bits of entropy
    return bip39.generateMnemonic(128,
      void 0, // fallback to default 'randombytes' function
      isChineseTraditional ? bip39.wordlists.chinese_traditional : bip39.wordlists.english)
  }

 
  function DeriveKey(mnemonic, derivePath, type) {
    var masterKeyPair
    var privateKeyHex
    var r
  
    switch (type) {
      case "secp256k1":
        const seed = bip39.mnemonicToSeed(mnemonic)
        masterKeyPair = bitcoin.HDNode.fromSeedBuffer(seed)
        const kp = masterKeyPair.derivePath(derivePath).keyPair
        privateKeyHex = kp.d.toBuffer(32).toString('hex')
        r = {
          pub_buf: kp.getPublicKeyBuffer(),
          wif: kp.toWIF(),
          publicKey: kp.getPublicKeyBuffer().toString('hex'),
          privateKey: privateKeyHex,
          ethAddress: GetEthereumAddress(privateKeyHex),
          path: derivePath
        }
        return r
        break;
      case "secp256r1":
  
        const actualSeed = bip39.mnemonicToSeed(mnemonic)
        const rootNode = bitcoinSecp256r1.HDNode.fromSeedBuffer(actualSeed, bitcoinSecp256r1.bitcoin)
        const actualPathNode = rootNode.derivePath(derivePath)
        const actualPathNodeChild0 = actualPathNode.derive(0)
        const keypair = actualPathNodeChild0.keyPair
        const actualPrivateKey = actualPathNodeChild0.keyPair.d.toBuffer(32).toString('hex')        
        const actualPublicKey = actualPathNodeChild0.keyPair.getPublicKeyBuffer().toString('hex')
         
        r = {
          pub_buf: keypair.getPublicKeyBuffer(),
          wif: keypair.toWIF(),
          publicKey: actualPublicKey,
          privateKey: actualPrivateKey,
          ethAddress: GetEthereumAddress(actualPrivateKey),
          path: derivePath
        }
        return r
        break;
      default:
        throw "type should be secp256k1 or secp256r1";
  
    }
  }
  function GetEthereumAddress(privkeyHex) {
    const privKeyBuffer = Buffer.from(privkeyHex, 'hex')
    const addressBuffer = ethUtil.privateToAddress(privKeyBuffer)
    const hexAddress = addressBuffer.toString('hex')
    const checksumAddress = ethUtil.toChecksumAddress(hexAddress)
    return checksumAddress
  }
  function pubxtofull(pubx) {
    var ecparams = ecurve.getCurveByName('secp256k1')
    var buffer  = new Buffer(pubx, 'hex');
    var byteLength = ecparams.pLength
    var x = BigInteger.fromBuffer(buffer.slice(1, 1 + byteLength))
    var type = buffer.readUInt8(0)
    var isOdd = (type === 0x03)
    Q = ecparams.pointFromX(isOdd, x) //isOdd  0x03
    return Q.getEncoded(false).toString('hex');
}

  function DeriveAddr(publicKey){
    var fullpublickey = pubxtofull(publicKey);    
    var upk_buf = new Buffer(fullpublickey, 'hex');
    var addr_buf = ethUtil.pubToAddress(upk_buf.slice(1, 65), true);  
    var addr = "0x" +addr_buf.toString('hex');
    return addr
  }


  module.exports = {
    GenerateMnemonic: GenerateMnemonic,
    DeriveKey: DeriveKey,
    DeriveAddr: DeriveAddr,
    pubxtofull:pubxtofull
  };
  
  function test()
  {
    const TEST_PATH = "m/2018'/11'/1'"; //
    const TEST_ECDSA_CURVE = "secp256r1"
    let mnemonic  =GenerateMnemonic(true)
    console.log(mnemonic)
    let pubkey1 = DeriveKey(mnemonic,TEST_PATH+"/0",TEST_ECDSA_CURVE )
    console.log(pubkey1)
    let addr1 = DeriveAddr(pubkey1.publicKey)
    console.log(addr1)

    let pubkey2 = DeriveKey(mnemonic,TEST_PATH+"/1",TEST_ECDSA_CURVE )
    console.log(pubkey2)
    let addr2 = DeriveAddr(pubkey2.publicKey)
    console.log(addr2)
  }

 // test()
