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
          return fetch(network.slp_url + "/tokenWithMeta/"+address).then((res:any) => res.json())
      },
      tokenTransactions: (token_id:string) => {
         return fetch(network.slp_url + "/transactions/"+token_id).then((res:any) => res.json())
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
          case "ark":
            return [
              {
                  "type": "team",
                  "name": "ACF Hot Wallet",
                  "address": "AagJoLEnpXYkxYdYkmdDSNMLjjBkLJ6T67"
              },
              {
                  "type": "team",
                  "name": "ACF Hot Wallet (old)",
                  "address": "AWkBFnqvCF4jhqPSdE2HBPJiwaf67tgfGR"
              },
              {
                  "type": "exchange",
                  "name": "Altilly",
                  "address": "ANvR7ny44GrLy4NTfuVqjGYr4EAwK7vnkW"
              },
              {
                  "type": "team",
                  "name": "ARK Bounty",
                  "address": "AXxNbmaKspf9UqgKhfTRDdn89NidP2gXWh"
              },
              {
                  "type": "team",
                  "name": "ARK Bounty Hot Wallet",
                  "address": "AYCTHSZionfGoQsRnv5gECEuFWcZXS38gs"
              },
              {
                  "type": "team",
                  "name": "ARK GitHub Bounty",
                  "address": "AZmQJ2P9xg5j6VPZWjcTzWDD4w7Qww2KGX"
              },
              {
                  "type": "team",
                  "name": "ARK Hot Wallet",
                  "address": "ANkHGk5uZqNrKFNY5jtd4A88zzFR3LnJbe"
              },
              {
                  "type": "team",
                  "name": "ARK Shield",
                  "address": "AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9"
              },
              {
                  "type": "team",
                  "name": "ARK Shield (old)",
                  "address": "AdTyTzaXPtj1J1DzTgVksa9NYdUuXCRbm1"
              },
              {
                  "type": "team",
                  "name": "ARK Team",
                  "address": "AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX"
              },
              {
                  "type": "team",
                  "name": "ARK Team (old)",
                  "address": "AUDud8tvyVZa67p3QY7XPRUTjRGnWQQ9Xv"
              },
              {
                  "type": "exchange",
                  "name": "Binance",
                  "address": "AFrPtEmzu6wdVpa2CnRDEKGQQMWgq8nE9V"
              },
              {
                  "type": "exchange",
                  "name": "Binance Cold Wallet",
                  "address": "AQkyi31gUbLuFp7ArgH9hUCewg22TkxWpk"
              },
              {
                  "type": "exchange",
                  "name": "Binance Cold Wallet II",
                  "address": "AdS7WvzqusoP759qRo6HDmUz2L34u4fMHz"
              },
              {
                  "type": "exchange",
                  "name": "Binance Cold Wallet III",
                  "address": "Aakg29vVhQhJ5nrsAHysTUqkTBVfmgBSXU"
              },
              {
                  "type": "exchange",
                  "name": "Binance Cold Wallet IV",
                  "address": "AazoqKvZQ7HKZMQ151qaWFk6nDY1E9faYu"
              },
              {
                  "type": "exchange",
                  "name": "Bittrex",
                  "address": "AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK"
              },
              {
                  "type": "exchange",
                  "name": "Changelly",
                  "address": "AdA5THjiVFAWhcMo5QyTKF1Y6d39bnPR2F"
              },
              {
                  "type": "exchange",
                  "name": "COSS",
                  "address": "AcPwcdDbrprJf8FNCE3dKZaTvPJT8y4Cqi"
              },
              {
                  "type": "exchange",
                  "name": "Cryptopia",
                  "address": "AJbmGnDAx9y91MQCDApyaqZhn6fBvYX9iJ"
              },
              {
                  "type": "exchange",
                  "name": "Genesis Wallet",
                  "address": "AewxfHQobSc49a4radHp74JZCGP8LRe4xA"
              },
              {
                  "type": "exchange",
                  "name": "Livecoin",
                  "address": "AcVHEfEmFJkgoyuNczpgyxEA3MZ747DRAu"
              },
              {
                  "type": "exchange",
                  "name": "OKEx",
                  "address": "AZcK6t1P9Z2ndiYvdVaS7srzYbTn5DHmck"
              },
              {
                  "type": "exchange",
                  "name": "Upbit",
                  "address": "ANQftoXeWoa9ud9q9dd2ZrUpuKinpdejAJ"
              },
              {
                  "type": "exchange",
                  "name": "Upbit Cold Wallet",
                  "address": "AdzbhuDTyhnfAqepZzVcVsgd1Ym6FgETuW"
              },
              {
                  "type": "exchange",
                  "name": "Upbit Hot Wallet",
                  "address": "AReY3W6nTv3utiG2em5nefKEsGQeqEVPN4"
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
