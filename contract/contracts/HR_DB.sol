pragma solidity ^0.4.23;
//pragma experimental ABIEncoderV2;

contract HR_DB{
    
    address owner;  
    
    mapping( address => UsersInfo ) public USER_INFO;
    mapping( address => OrgsInfo ) public ORG_INFO;
 
    struct UsersInfo{
        string userName;
        string publickey;
        //string publickey2;
    }
    struct OrgsInfo{
        string orgName;
        string publickey;
        address contractAddr;
       // string publickey2;
    }
    
    constructor () public{
        owner = msg.sender;         
    }
    
    function getOwner()public view returns (address){
        return owner;
    }
    function getUserPublickey(address user_addr) public view returns(string){
        return USER_INFO[user_addr].publickey;
    }    
    function getOrgPublickey(address org_addr) public view returns(string){
        return ORG_INFO[org_addr].publickey;
    }
   /* function getUserPublickey2(address user_addr) public view returns(string){
        return USER_INFO[user_addr].publickey2;
    }    
    function getOrgPublickey2(address org_addr) public view returns(string){
        return ORG_INFO[org_addr].publickey2;
    }*/
    function getUserInfo(address org_addr) public view returns(string,string){
        return (USER_INFO[org_addr].userName,USER_INFO[org_addr].publickey);
    }
    function getOrgInfo(address org_addr) public view returns(string,string,address){
        return (ORG_INFO[org_addr].orgName,ORG_INFO[org_addr].publickey,ORG_INFO[org_addr].contractAddr);
    }
    //string array only work in experimental version, not for production
    function setUserInfo (address user_addr, string user_name, string public_key)public{
        USER_INFO[user_addr].userName = user_name;
        USER_INFO[user_addr].publickey = public_key;
        /*for(uint8 i = 0; i<public_key.length; i++){
            USER_INFO[user_addr].publickey[i] = public_key[i];
        }*/
    }
    function setOrgInfo (address org_addr, string org_name, string public_key, address contract_addr)public{
        ORG_INFO[org_addr].orgName = org_name;        
        ORG_INFO[org_addr].publickey = public_key;
        ORG_INFO[org_addr].contractAddr = contract_addr;
        
    }    
    function updateContractAddr(address org_addr,address contract_addr)public{
        ORG_INFO[org_addr].contractAddr = contract_addr;
    }
    function getOrgContract(address org_addr) public view returns(address){
        return ORG_INFO[org_addr].contractAddr;
    }

}
