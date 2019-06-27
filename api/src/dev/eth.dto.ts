export class EthDTO {
  contract: string;
  typeAccount: string; 
  typeTo: string; 
  addressAccount: string;
  addressTo: string;
  idTo: number ;
  idAccount : number;
  transferAmount: number = 0;
  providerUrl: string;
}