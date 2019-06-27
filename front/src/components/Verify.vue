<template>
  <div id="Verify">
    <!-- style="{'background-image': `url('${image}`} "-->
    <div class="content" v-if="error">
              <h3>{{error_message}}</h3>
    </div>
    <div class="cert_bg" v-if="!error">
      <div style="position:relative;top:15vw;font-size:6vw">行政院人事行政總處獎懲系統</div>
      <div style="position:relative;top:20vw;font-size:4vw">獎懲證明</div>
      <div style="position:relative;top:25vw;right:-24vw;font-size:3vw"> {{cert_info.uniqueId}}</div>
      <div style="position:relative;top:30vw;margin-left:10vw;margin-right:10vw;font-size:4vw;line-height:6vw">{{cert_info.ownerName}}  ({{cert_info.ownerID}}) 於 {{cert_info.date}}，因 {{cert_info.rewardContent}}</div>
      <div style="position:relative;top:60vw;font-size:5vw;left:-30vw;line-height:6vw;">特此證明</div>
      <div style="position:relative;top:70vw;font-size:2.7vw;left:-6vw">擁有人區塊鏈位址: {{cert_info.ownerAddr}}</div>
      <div style="position:relative;top:71vw;font-size:2.7vw;left:-5vw">發行單位區塊鏈位址:  {{cert_info.issuerAddr}}</div>      
      <div style="position:relative;top:72vw;font-size:2.7vw;left:-5vw">核定日期: {{cert_info.date}}</div>
      <div style="position:relative;top:73vw;font-size:2.7vw;left:-35.5vw">是否撤銷: {{cert_info.revokeStatus}}</div>
      <div style="position:relative;top:75vw;font-size:4vw;">驗證: <b v-if="!unverified">✔</b><b-button v-if="unverified" v-on:click="Verify" style="position:relative;left:15vw">點我驗證</b-button></div>
    </div>
      <!-- <div calss ="row">
			  <div class="card">
				  <div class="header">
            <div class="content" v-if="error">
              <h3>{{error_message}}</h3>
            </div>
            <div class="content" v-if="verify">
              <table class="table table-hover table-bordered" style="table-layout:fixed;word-wrap:break-word;">
                <thead>
                  <tr>
                  <th width="20%">Cert Tittle</th>
                  <th width="80%">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr ><td >{{cert_tittle[0]}}</td><td>{{cert_info.issueOrg}}</td></tr>
                  <tr ><td >{{cert_tittle[6]}}</td><td>{{cert_info.issuerAddr}}</td></tr>
                  <tr ><td >{{cert_tittle[7]}}</td><td>{{cert_info.issuerID}}</td></tr>
                  <tr ><td >{{cert_tittle[10]}}</td><td>{{cert_info.uniqueId}}</td></tr>
                  <tr ><td >{{cert_tittle[1]}}</td><td>{{cert_info.ownerName}}</td></tr>
                  <tr ><td >{{cert_tittle[9]}}</td><td>{{cert_info.ownerID}}</td></tr>
                  <tr ><td >{{cert_tittle[5]}}</td><td>{{cert_info.ownerAddr}}</td></tr>
                  <tr ><td >{{cert_tittle[2]}}</td><td>{{cert_info.date}}</td></tr>
                  <tr ><td >{{cert_tittle[3]}}</td><td>{{cert_info.rewardType}}</td></tr>
                  <tr ><td >{{cert_tittle[4]}}</td><td>{{cert_info.rewardContent}}</td></tr>
                  <tr ><td >{{cert_tittle[8]}}</td><td>{{cert_info.revokeStatus}}</td></tr>
                </tbody>
              </table>
            </div>
				  </div>
			  </div>
      </div> -->
  </div>  
</template>

<script>
  import axios from "axios"
  const crypto = require('crypto')
  const secp256k1 = require('secp256k1')

  function bytes32toStr(input) {
    return Buffer.from(input, 'hex').toString('utf8').replace(/\0/g, '')
  }
  function Substr(input){
    return input.substr(0,input.length-1);
  }
  function merge(input){
    var str='';
      for(var i=0;i<input.length;i++){
        str=str+input[i].substr(2);
      }
      console.log(str)
    return str
  }
  function convert(input){
    if(typeof(input)=="string"){
      console.log(Substr(bytes32toStr(input.substr(2))))
      return Substr(bytes32toStr(input.substr(2)))
    }
    else{
      var str=merge(input);
      return Substr(bytes32toStr(str));
    }
  }
  export default {
    name: 'Verify',
    data() {
      return {
        image:'../assets/cert_bg.jpg',
        verify:true,
        error:false,
        unverified:true,
        verified:true,
        msg: 'Verify Correct!',
        certID: this.$route.query.certid,
        cert_tittle:[
          '發行單位',
          '擁有人姓名',
          '核定日期',
          '獎懲內容',
          '事由',
          '擁有人區塊鏈位址',
          '發行單位區塊鏈位址',
          '發行人身分證字號',
          '是否撤銷',
          '擁有人身分證字號',
          '發行號'
        ],
        cert_info:{},
        error_message:'查無此cert',
        certJson: {}
      }
    },
    created: async function () {
      
      var config = {
        headers: {
          'X-Custom-Header': 'DGPA_BLOCKCHAIN',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
      var _this=this
      var data = {
          "cert_id":"0x"+_this.certID
      }

      let res = await axios.post('https://certproof.nchc.org.tw/dgpa/issue/get-cert-info', data, config);
      console.log(res);
      let certinfo = res.data.certInfo;

      // let resVerify = await axios.post('https://certproof.nchc.org.tw/dgpa/issue/verify', data, config);
      // console.log(resVerify);
      // let verifyInfo = resVerify.data.verifyInfo;

      if((certinfo!=null)&&(certinfo.revokeStatus==false)){
        _this.verify=true;
        _this.error=false;
        _this.cert_info = {
          issueOrg: convert(certinfo.issueOrg),
          ownerName: convert(certinfo.ownerName),
          ownerID: convert(certinfo.ownerID),
          date: convert(certinfo.date),
          rewardType: convert(certinfo.rewardType),
          rewardContent: convert(certinfo.rewardContent),
          ownerAddr: certinfo.ownerAddr,
          issuerAddr: certinfo.issuerAddr,
          issuerID: convert(certinfo.issuerID),
          uniqueId: certinfo.unique_id,
          revokeStatus: certinfo.revokeStatus
        }
        // _this.certJson = {
        //   owner_addr: _this.cert_info.ownerAddr,
        //   unique_id: _this.cert_info.uniqueId,
        //   owner_name: _this.cert_info.ownerName,
        //   owner_id: _this.cert_info.ownerID,
        //   reward_type: _this.cert_info.rewardType,
        //   issue_org: _this.cert_info.issueOrg,
        //   date: _this.cert_info.date,
        //   content: _this.cert_info.rewardContent,
        //   issuer: {
        //     addr: _this.cert_info.issuerAddr,
        //     ID: _this.cert_info.issuerID,
        //     publickey: verifyInfo[1]
        //   }
        //}
        // var jsonStr = JSON.stringify(_this.certJson);
        // console.log("jsonArrStr", jsonStr);
        // const certObjHash = crypto.createHmac('sha256',jsonStr).digest('hex'); 
        // //console.log(_this.certJson);
        // console.log(certObjHash);
        // var msg = Buffer.from(certObjHash, 'hex');
        // console.log("verify:" ,secp256k1.verify(msg, Buffer.from(verifyInfo[0],'base64'), Buffer.from(verifyInfo[1], 'hex')))
      }
      else if(res.data==null){
        this.error=true;
        this.error_message='查無此cert'
      }
      else if((res.data!=null&&res.data.revokeStatus==true)){
        this.error=true;
        this.error_message='此cert已被註銷'
      }
    },
    methods:{
      Verify:async function() {
        let resVerify = await axios.post('https://certproof.nchc.org.tw/dgpa/issue/verify', data, config);
        console.log(resVerify);
        let verifyInfo = resVerify.data.verifyInfo;
        this.certJson = {
          owner_addr: _this.cert_info.ownerAddr,
          unique_id: _this.cert_info.uniqueId,
          owner_name: _this.cert_info.ownerName,
          owner_id: _this.cert_info.ownerID,
          reward_type: _this.cert_info.rewardType,
          issue_org: _this.cert_info.issueOrg,
          date: _this.cert_info.date,
          content: _this.cert_info.rewardContent,
          issuer: {
            addr: _this.cert_info.issuerAddr,
            ID: _this.cert_info.issuerID,
            publickey: verifyInfo[1]
          }
        }
        var jsonStr = JSON.stringify(_this.certJson);
        console.log("jsonArrStr", jsonStr);
        const certObjHash = crypto.createHmac('sha256',jsonStr).digest('hex'); 
        //console.log(_this.certJson);
        console.log(certObjHash);
        var msg = Buffer.from(certObjHash, 'hex');
        let verified=secp256k1.verify(msg, Buffer.from(verifyInfo[0],'base64'), Buffer.from(verifyInfo[1], 'hex'));
        if(verified==true){
          this.unverified=false;
        }
        console.log(verified)
        //console.log("verify:" ,secp256k1.verify(msg, Buffer.from(verifyInfo[0],'base64'), Buffer.from(verifyInfo[1], 'hex')))        
      }

    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  #Verify{
    font-size: 6vw;
    font-family:BiauKai;
    font-weight:bold;
    color:black;
    height: 100%
  }
  .cert_bg{
    width: 100vw;
    position: static;
    height: 141.428571429vw;
    background-image:url('../assets/cert_bg.jpg');
    background-position: center center ;
    background-repeat:  no-repeat;
    background-size: cover;
  }
</style>
