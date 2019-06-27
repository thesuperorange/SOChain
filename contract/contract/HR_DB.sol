pragma solidity ^0.4.25;


contract HR_DB{
    
    address owner;  
    
    mapping( address => UsersInfo ) public USER_INFO;
    mapping( address => OrgsInfo ) public ORG_INFO;
 
    struct UsersInfo{
        string userName;
        string publickey;
    }
    struct OrgsInfo{
        string orgName;
        string publickey;
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
    function setUserInfo (address user_addr, string user_name, string public_key)public{
        USER_INFO[user_addr].userName = user_name;
        USER_INFO[user_addr].publickey = public_key;
    }
    function setOrgInfo (address org_addr, string org_name, string public_key)public{
        ORG_INFO[org_addr].orgName = org_name;
        ORG_INFO[org_addr].publickey = public_key;
    }    
}
