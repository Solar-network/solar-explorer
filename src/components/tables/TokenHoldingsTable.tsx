import React from "react";
import i18n from "../../i18n/en.json";
import { BlockchainContext } from "../../BlockchainContext";
import {
  ShortId,
  Confirms,
  ShortWallet,
  Amount,
  SmartBridge,
  Timestamp,
  BlockId,
  BoolBadge,
} from "./Cells";
import explorer from "../../lib/api";

const { lang } = i18n;
const { navigation } = lang;
type TokenHoldingsTableState = {tokens:Array<any>}

class TokenHoldingsTable extends React.Component<{wallet:string}, TokenHoldingsTableState> {
  static contextType = BlockchainContext;
  
  constructor(props:any) {
    super(props)
    this.state = {
        tokens: []
    };
  }

  componentDidUpdate(prevProps: any) {
    console.log(prevProps);
  }

  componentDidMount() {
    let blockchain = this.context;
    const getData = () => {
      explorer.on(blockchain).slp.tokenHoldings(this.props.wallet)
      .then((d:any) => {
        this.setState({ tokens: d });
      });
    }
    getData();
  }

  render() {
    return (
<div>
        <table className="w-full">
          <thead className="border-b border-b-secondary dark:border-b-dark-secondary bg-quartish dark:bg-dark-quartish">
                <th className="py-2">Version</th>
                <th>Name</th>
                <th>Symbol</th>
                <th>Owner address</th>
                <th>Token address</th>
                <th>Circulating supply</th>
                <th>Pausable</th>
                <th>Mintable</th>
          </thead>
          <tbody>
            {this.state.tokens.map((token) => (
              <tr className="bg-quartish dark:bg-dark-quartish dark:hover:bg-dark-hoverish dark:even:bg-dark-evenish hover:bg-hoverish cursor-pointer even:bg-evenish w-full h-10 z-10">
                <td className="text-center">
                  {token.tokenInfo.type}
                </td>
                <td className="text-center"><a href={`/${this.context}/tokens/${token.tokenInfo.tokenDetails.tokenIdHex}`}>{token.tokenInfo.tokenDetails.name}</a></td>
                <td className="text-center">{token.tokenInfo.tokenDetails.symbol}</td>
                <td className="text-center"><ShortWallet id={token.tokenInfo.tokenDetails.ownerAddress}/></td>
                <td className="text-center"><BlockId id={token.tokenInfo.tokenDetails.tokenIdHex} /></td>
                <td className="text-center">{parseInt(token.tokenInfo.tokenStats.qty_token_circulating_supply).toLocaleString("us")} {token.tokenInfo.tokenDetails.symbol}</td>
                <td className="text-center"><BoolBadge value={token.tokenInfo.tokenDetails.pausable} /></td>
                <td className="text-center"><BoolBadge value={token.tokenInfo.tokenDetails.mintable} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {this.state.tokens.length == 0 &&
              <div className="rounded m-3 mb-5 bg-secondary dark:bg-dark-secondary py-2 text-center text-gray-600 dark:text-gray-400">No records found.</div>
        }
      </div>
    );
  }
}
export default TokenHoldingsTable;
