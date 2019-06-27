pragma solidity ^0.4.25;


contract HRRPSysem{
    address owner;  
    
    constructor () public{
        owner = msg.sender;         
    }
    
    mapping( bytes32 => CertInfo ) public CERT_INFO;


    
    struct CertInfo{
        address issuerAddr;
        bytes32 issuerID;
        address ownerAddr;
        string ownerName;
        string certName;
        uint timestamp;
        string certType;
        uint8 certQuantity;
        string description;
        bool signStatus;
}

    function issue(bytes32 cert_id, address issuer_addr, bytes32 issuer_id, address owner_addr, string owner_name, string cert_name,uint timestamp, string cert_type, uint8 cert_quantity, string description)public
    {
        CERT_INFO[cert_id].issuerAddr = issuer_addr;
        CERT_INFO[cert_id].issuerID = issuer_id;
        CERT_INFO[cert_id].ownerAddr = owner_addr;
        CERT_INFO[cert_id].ownerName = owner_name;
        CERT_INFO[cert_id].certName = cert_name;
        CERT_INFO[cert_id].timestamp = timestamp;
        CERT_INFO[cert_id].certType = cert_type;
        CERT_INFO[cert_id].certQuantity = cert_quantity;
        CERT_INFO[cert_id].description = description;
        CERT_INFO[cert_id].signStatus = false;
        
        
    }
    
    function sign(bytes32 cert_id) public{
        CERT_INFO[cert_id].signStatus = true;
    }
    

    function getInfo(bytes32 cert_id)public view returns( bytes32 , string , string ,uint , string , uint8 , string )
    {
        return (
            //CERT_INFO[cert_id].issuerAddr,
            CERT_INFO[cert_id].issuerID ,
            //CERT_INFO[cert_id].ownerAddr ,
            CERT_INFO[cert_id].ownerName ,
            CERT_INFO[cert_id].certName ,
            CERT_INFO[cert_id].timestamp ,
            CERT_INFO[cert_id].certType ,
            CERT_INFO[cert_id].certQuantity ,
            CERT_INFO[cert_id].description 
        );
    
    }
        function getSignStatus(bytes32 cert_id)public view returns (bool){
        return CERT_INFO[cert_id].signStatus;
    }

}