pragma solidity ^0.4.23;


contract HR_RPCert{
    address owner;  
    
    constructor () public{
        owner = msg.sender;         
    }

    function getContractAddr()public view returns(address){
        return this;
    }

    mapping(bytes32=> IssueInfo) ISSUE_INFO;
    mapping( bytes32 => CertInfo ) CERT_INFO;
    mapping( address => bytes32[] ) OWNER_CERT_LIST;

    mapping(address =>bytes32[]) ISSUE_ID_LIST; //get issue list by issuer address
    mapping(address =>bytes32[]) ISSUE_ID_LIST_by_Singer;
    mapping(address =>SignInfo) SIGNER_CERT_LIST;
   
    struct IssueInfo{
        bytes32[] certID;
        bytes32[] signedCertID;

    }
    
    struct SignInfo {
        bytes32[] certID;
        mapping (bytes32 => bool) status;
    }
    
    struct CertInfo {
 
        address issuerAddr;
        bytes32 issuerID;
        bytes32 issueOrg;
        bytes32 date;
        string unique_id;
        bytes32[] content; 
        address ownerAddr;//different 
        bytes32 ownerName; //different 
        bytes32 ownerID;       
        bytes32 rewardType; //different        

        SignerInfo signInfo;
        bool revokeStatus;
                  
    }

    
    struct SignerInfo {
      //  uint signerID;
        bool status;
        string publickey;
        string signature;
    }


    function issueContent( 
        bytes32 issue_id, bytes32[] cert_id,bytes32 issue_org, bytes32[] owner_name, bytes32[] owner_id, bytes32 issue_date, bytes32[] reward_type, bytes32[] content,
        address[] owner_addr, address issuer_addr, bytes32 issuer_id, string unique_id)public {
        if(!( (cert_id.length == owner_name.length) && ( cert_id.length == reward_type.length)
        && ( cert_id.length == owner_addr.length)) ) revert();

        ISSUE_ID_LIST[issuer_addr].push(issue_id);   //query by issuer
        
        for (uint8 j = 0; j < cert_id.length; j++) {
            ISSUE_INFO[issue_id].certID.push(cert_id[j]);  //query by issuer id
            OWNER_CERT_LIST[owner_addr[j]].push(cert_id[j]);  //query by owner
            CERT_INFO[cert_id[j]].ownerAddr = owner_addr[j];
            CERT_INFO[cert_id[j]].issuerAddr = issuer_addr;
            CERT_INFO[cert_id[j]].issuerID = issuer_id;
            CERT_INFO[cert_id[j]].issueOrg = issue_org;
            CERT_INFO[cert_id[j]].ownerName = owner_name[j];
            CERT_INFO[cert_id[j]].ownerID = owner_id[j];
            CERT_INFO[cert_id[j]].date = issue_date;
            CERT_INFO[cert_id[j]].rewardType = reward_type[j];
            CERT_INFO[cert_id[j]].content = content;
            CERT_INFO[cert_id[j]].revokeStatus = false;
            CERT_INFO[cert_id[j]].signInfo.signature = "";
            CERT_INFO[cert_id[j]].signInfo.publickey = "";
            CERT_INFO[cert_id[j]].signInfo.status = false;
            CERT_INFO[cert_id[j]].unique_id = unique_id;
        }   
    }

    //rename pushSignerPublickey to sign
    function sign(bytes32 certID, string publickey, string signature)public {
        if(CERT_INFO[certID].ownerAddr == 0)   revert();
        CERT_INFO[certID].signInfo.signature = signature;
        CERT_INFO[certID].signInfo.publickey = publickey;
        CERT_INFO[certID].signInfo.status = true;
    }
    function revoke(bytes32 certID)public{
        CERT_INFO[certID].revokeStatus = true;
    }

    function getSignStatus(bytes32 certID) public view returns(bool){
        return CERT_INFO[certID].signInfo.status;
    }
    function verify(bytes32 certID) public view returns(string,string,bool){

        if(CERT_INFO[certID].ownerAddr == 0)   revert();
        return(
        CERT_INFO[certID].signInfo.signature,
        CERT_INFO[certID].signInfo.publickey,
        CERT_INFO[certID].signInfo.status);
    }


    // getallinfo
    function getCertInfo (bytes32 certID) public view  returns( address, address, bytes32, bool ){       
        return ( CERT_INFO[certID].ownerAddr, CERT_INFO[certID].issuerAddr, CERT_INFO[certID].issuerID, CERT_INFO[certID].revokeStatus);        
    }

    function getCertContent (bytes32 certID) public view  returns( bytes32, bytes32, bytes32, bytes32, bytes32, bytes32[], string ){       
        return( CERT_INFO[certID].issueOrg, CERT_INFO[certID].ownerName, CERT_INFO[certID].ownerID, CERT_INFO[certID].date, CERT_INFO[certID].rewardType, CERT_INFO[certID].content, CERT_INFO[certID].unique_id);
    }

    function getOwnerAddr (bytes32 certID)public view returns(address){
        return CERT_INFO[certID].ownerAddr;
    }
    function getIssuerAddr(bytes32 certID)public view returns(address){
        return CERT_INFO[certID].issuerAddr;
    }
    
    function getIssuerID(bytes32 certID)public view returns(bytes32){
        return CERT_INFO[certID].issuerID;
    }


    function checkExistence(bytes32 certID) public view returns (bool){
        if(CERT_INFO[certID].ownerAddr == 0)  return false;
        else return true;        
    }
  
//--------------------signer cert info

    function getIssuerIssueIDList (address issue_addr )public view returns(bytes32[]){
        return (ISSUE_ID_LIST[issue_addr]);
    }


    function getSignedList ( bytes32 issue_id) public view returns(bytes32[]){
        if(ISSUE_INFO[issue_id].certID.length==0)revert();
               
        bytes32[] memory all_certID = ISSUE_INFO[issue_id].certID; 
        for(uint8 i = 0;i < all_certID.length;i++){
            bytes32 curr_certID = all_certID[i];
            if(CERT_INFO[curr_certID].signInfo.status==true){
                ISSUE_INFO[issue_id].signedCertID.push(curr_certID);
            }
        } 
        
        return ISSUE_INFO[issue_id].signedCertID;
    }

         

    function getCertIDList(bytes32 issue_id)public view returns(bytes32[]){
        return ISSUE_INFO[issue_id].certID;  
    }

 
    function getIssueIDInfo ( bytes32 issue_id )public view returns(bytes32[],address,address,bytes32){
        //uint[] all_certID = ISSUE_INFO[issue_id];
        //uint[] memory signedList = getSignedList(issue_id);
        //CertCommon memory detail = CERT_INFO[ISSUE_INFO[issue_id].certID[0]].detail;
        return(ISSUE_INFO[issue_id].certID,CERT_INFO[ISSUE_INFO[issue_id].certID[0]].ownerAddr,
        CERT_INFO[ISSUE_INFO[issue_id].certID[0]].issuerAddr,CERT_INFO[ISSUE_INFO[issue_id].certID[0]].issuerID);
    }   

//--------------owner's cert info
//getusercert
    function getUserCert (address user_addr)public view returns(bytes32[]){
        return (OWNER_CERT_LIST[user_addr]);
    }

}
