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
type TokenTableState = {tokens:Array<any>}

class TokenTable extends React.Component<{}, TokenTableState> {
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
      explorer.on(blockchain).slp.tokens()
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
                  {token.type}
                </td>
                <td className="text-center"><a href={`/${this.context}/tokens/${token.tokenDetails.tokenIdHex}`}>{token.tokenDetails.name}</a></td>
                <td className="text-center">{token.tokenDetails.symbol}</td>
                <td className="text-center"><ShortWallet id={token.tokenDetails.ownerAddress}/></td>
                <td className="text-center"><BlockId id={token.tokenDetails.tokenIdHex} /></td>
                <td className="text-center">{parseInt(token.tokenStats.qty_token_circulating_supply).toLocaleString("us")} {token.tokenDetails.symbol}</td>
                <td className="text-center"><BoolBadge value={token.tokenDetails.pausable} /></td>
                <td className="text-center"><BoolBadge value={token.tokenDetails.mintable} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
export default TokenTable;
