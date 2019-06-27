//本檔用來產生user跟hash

var sqlite = require('sqlite-sync');
const SHA256 = require('crypto-js/sha256');

sqlite.connect('info.db');

//確認 Table userinfo 是否存在，若沒有則創建
var cmd = "select count(*) from sqlite_master where type = 'table' and name = 'userinfo'"
var sqlres = sqlite.run(cmd);
console.log("count:", sqlres[0]['count(*)']);
if (sqlres[0]['count(*)'] == 0) {
  console.log("table not exist");
  cmd = "CREATE TABLE userinfo ( " + 
    "ID INTEGER PRIMARY KEY AUTOINCREMENT," + 
    "USERID TEXT NOT NULL," +
    "NAME TEXT," +
    "ADDRESS TEXT," +
    "PUBKEY TEXT," +
    "HASH TEXT," + 
    "MNEMONIC TEXT" +
  ");"
  sqlite.run(cmd, (res) => {
    if (res.error) {
      console.log('Create failed: ' + res.error);
      return;
    }
    console.log("Create Table userinfo");
  });
}

//確認 Table orginfo 是否存在，若沒有則創建
var cmd = "select count(*) from sqlite_master where type = 'table' and name = 'orginfo'"
var sqlres = sqlite.run(cmd);
console.log("count:", sqlres[0]['count(*)']);
if (sqlres[0]['count(*)'] == 0) {
  console.log("table not exist");
  cmd = "CREATE TABLE orginfo ( " + 
    "ID INTEGER PRIMARY KEY AUTOINCREMENT," + 
    "ORGID TEXT NOT NULL," +
    "NAME TEXT," +
    "ADDRESS TEXT," +
    "PUBKEY TEXT," +
    "CONTRACT TEXT," +
    "MNEMONIC TEXT" +
  ");"
  sqlite.run(cmd, (res) => {
    if (res.error) {
      console.log('Create failed: ' + res.error);
      return;
    }
    console.log("Create Table orginfo");
  });
}

//輸入使用者資訊
for (var i = 0; i < 10; i++) {
  var userid = 'A12345679' + i;
  var hash = SHA256(userid + "syscomnchcmlb@04968299");
  var cmd = "INSERT INTO userinfo (USERID, HASH) VALUES ('" + userid + "','" + hash + "')";
  console.log("cmd:" + cmd);

  sqlite.run(cmd, (res) => {
    if (res.error) {
      console.log('Insert failed: ' + res.error);
      return;
    }
    console.log(res);
  });
}

sqlite.close();