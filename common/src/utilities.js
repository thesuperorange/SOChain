const fs = require('fs');
const crypto = require('crypto');



//var config_file = "test.json", variable = "HRRPCertContract", value = "12345678"
function update_config(config_file, variable, value){
    

    fs.readFile(config_file,  function readFileCallback(err, data) {
    if (err) throw err; // we'll not consider error handling for now
    var obj = JSON.parse(data);
    obj[variable] = value
    json = JSON.stringify(obj)
    fs.writeFile(config_file,json )
});
}


  function bytes32ToString (bytes,s) {
    //sc return bytes32 begin with 0x
    
    str = Buffer.from(bytes.slice(s).split('00')[0], 'hex').toString()
    if(str.slice(-1)=="#")str = str.slice(0,-1)
    return str
  }



  function stringToBytes32 (str) {
    const buffstr = Buffer.from(str).toString('hex')
    return buffstr + '0'.repeat(64 - buffstr.length)
  }

  function stringToBytes320x (str) {  
    str+="#"  
    return "0x"+stringToBytes32(str)
  }

  function sha256(str){
    return "0x"+crypto.createHmac('sha256',str).digest('hex');     
  }
  function sha256Array(uid_arr){
    var cert_id=new Array();  
    for(var i in uid_arr){
        cert_id[i]="0x"+crypto.createHmac('sha256', uid_arr[i]).digest('hex');     
    }
    return cert_id;
  }
  function stringArr2Bytes32Arr0x(strArr){
    var bytesArr=new Array();  
    for(var i in strArr){
        bytesArr[i] = "0x"+stringToBytes32(strArr[i]+"#")         
    }
    return bytesArr;
  }
  function stringToBytes32Array0x(str){
    str+="#"
    array = stringToBytes32Array(str)
    for(var i in array){
        array[i] = "0x"+array[i]        
    }
    return array;
  }
  function stringToBytes32Array(str){
      
    const sc_byte_length = 32
    const buffstr = Buffer.from(str).toString('hex')
    return chunkString(buffstr,sc_byte_length*2)
  }
  function chunkString(str, length) {
    return str.match(new RegExp('.{1,' + length + '}', 'g'));
  }
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }



  function bytes32ArrToString (cArr) {
    concatStr=""
    for(var idx in cArr){
      concatStr+=cArr[idx].replace("0x","")
    }
    return bytes32ToString(concatStr,0)
    

  }


  /*var content = "林小明開會偷吃便當，記大過一支"
  
const hash = crypto.createHmac('sha256', content).digest('hex');
console.log(hash);
  
bytes32Arr =[
    "0xe69e97e5b08fe6988ee9968be69c83e581b7e59083e4bebfe795b6efbc8ce8a8",
    "0x98e5a4a7e9818ee4b880e694af00000000000000000000000000000000000000"
]
*/
/*
var content ="扶老太太過馬路，克服困難，圓滿達成#"
  cArr = stringToBytes32Array0x(content)
  console.log(cArr)
  a = bytes32ArrToString(cArr)
console.log(a)

issue_org = "人事處"
issue_org_bytes32 = stringToBytes320x(issue_org)
console.log(issue_org_bytes32)

console.log(bytes32ToString(issue_org_bytes32,2))
*/

  /*concatArray = cArr.join("")
  console.log(concatArray)
  console.log(bytes32ToString(concatArray))*/
  
  
  
//update_config("test.json","HRRPCertContract","12345678")
module.exports = {
    update_config:update_config,
    bytes32ToString:bytes32ToString,
    bytes32ArrToString:bytes32ArrToString,
    stringToBytes32Array:stringToBytes32Array,
    stringToBytes32Array0x:stringToBytes32Array0x,
    stringToBytes32:stringToBytes32,
    getRandomInt:getRandomInt,
    sha256Array:sha256Array,
    sha256:sha256,
    stringArr2Bytes32Arr0x:stringArr2Bytes32Arr0x,
    stringToBytes320x:stringToBytes320x
  };