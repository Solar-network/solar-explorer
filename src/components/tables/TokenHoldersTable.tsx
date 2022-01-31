import React from "react";
import i18n from "../../i18n/en.json";
import { BlockchainContext } from "../../BlockchainContext";
import BiRightArrow from 'react-icons/bi';
import {
  ShortId,
  Confirms,
  ShortWallet,
  Amount,
  SmartBridge,
  Timestamp,
  TxArrow,
  BlockId,
  LongWallet,
} from "./Cells";
import explorer from "../../lib/api";

const { lang } = i18n;
const { navigation } = lang;
type TokenHoldersTableProps = {
    token_id?: string;
};
type TokenHoldersTableState = { holders: Array<any> };
class TokenHoldersTable extends React.Component<
TokenHoldersTableProps,
TokenHoldersTableState
> {
  static contextType = BlockchainContext;

  constructor(props: TokenHoldersTableProps) {
    super(props);
    this.state = {
      holders: []
    };
  }

  componentDidUpdate(prevProps: any) {
    console.log(prevProps);
  }

  componentDidMount() {
    let blockchain = this.context;

    explorer
    .on(blockchain)
    .slp
    .tokenHolders(this.props.token_id)
    .then((d:any) => {
      this.setState({ holders: d });
    });
  }

  render() {
    const token_id = this.props.token_id;
    return (
      <div>
        <table className="w-full">
          <thead className="border-b border-b-secondary dark:border-b-dark-secondary">
            <th>SLP ID</th>
            <th className="py-2">Address</th>
            <th>Balance</th>
            <th>Last block</th>
          </thead>
          <tbody>
            {this.state.holders.map((holder) => (
              <tr className="bg-quartish dark:bg-dark-quartish dark:hover:bg-dark-hoverish dark:even:bg-dark-evenish hover:bg-hoverish cursor-pointer even:bg-evenish w-full h-10 z-10">
                <td className="text-center text-greenish">
                  {holder.recordId}
                </td>
                <td className="text-center font-xs">
                  <LongWallet id={holder.address} />                  
                </td>
                <td className="text-center">
                  {holder.tokenBalance? holder.tokenBalance : "-"}
                </td>
                <td className="">
                  <BlockId id={holder.lastUpdatedBlock.toString()}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
export default TokenHoldersTable;
