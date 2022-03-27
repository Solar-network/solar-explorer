import { Connection } from "@arkecosystem/client";
import { Blockchains } from "./blockchains";


const explorer = {
  on: (blockchain_name: string) => {
    let network = Blockchains.find((blockchain) => blockchain.networks.find((network) => network.subdomain == blockchain_name)).networks.find((network) => network.subdomain == blockchain_name)
    
    var originalFetch = require('isomorphic-fetch');
    var fetch = require('fetch-retry')(originalFetch);
    return {
      core: new Connection(network.url),
      slp: {
        tokens: () => {
            return fetch(network.slp_url + "/tokens").then((res:any) => res.json())
        },
        token: (address:string) => {
          return fetch(network.slp_url + "/token/"+address).then((res:any) => res.json())
      },
      tokenTransactions: (token_id:string) => {
         return fetch(network.slp_url + "/transactions?tokenId="+token_id).then((res:any) => res.json())
      },
      transaction: (tx_id:string) => {
        return fetch(network.slp_url + "/transaction/"+tx_id).then((res:any) => res.json())
     },
      tokenHolders: (token_id:string) => {
        return fetch(network.slp_url + "/addressesByTokenId/"+token_id).then((res:any) => res.json())
      },
      tokenHoldings: (address:string) => {
        return fetch(network.slp_url + "/address/"+address).then((res:any) => res.json())
      },
      tokensByOwner: (address:string) => {
        return fetch(network.slp_url + "/tokensByOwner/"+address).then((res:any) => res.json())
      }
      
      },
      known_wallets: () => {
        switch (blockchain_name) {
          case "mainnet":
            return [
              {
                  "type": "protocol",
                  "name": "Swap Wallet",
                  "address": "SP77TpbBYC2nCpaCg3u1BBsYU7zqwqzGo7"
              }
          ];          
            break;
          default:
                return [];
                break;
        }
      }
    };
  },
};

export default explorer;
