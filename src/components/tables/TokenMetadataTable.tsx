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
type TokenMetadataTableProps = {
    token_id?: string;
};
type TokenMetadataTableState = { tokenWithMeta: any };
class TokenMetadataTable extends React.Component<
TokenMetadataTableProps,
TokenMetadataTableState
> {
  static contextType = BlockchainContext;

  constructor(props: TokenMetadataTableProps) {
    super(props);
    this.state = {
      tokenWithMeta: {metadata: []}
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
    .token(this.props.token_id)
    .then((d:any) => {
      this.setState({ tokenWithMeta: d });
      console.log(d);
    });
  }

  render() {
    const token_id = this.props.token_id;
    return (
      <div>
        <table className="w-full">
          <thead className="border-b border-b-secondary dark:border-b-dark-secondary">
            <th>Tx</th>
            <th className="py-2">Block</th>
            <th>Poster</th>
            <th>Timestamp</th>
            <th>Property</th>
            <th>Value</th>
          </thead>
          <tbody>
            {this.state.tokenWithMeta.metadata.map((meta:any) => (
              <tr className="bg-quartish dark:bg-dark-quartish dark:hover:bg-dark-hoverish dark:even:bg-dark-evenish hover:bg-hoverish cursor-pointer even:bg-evenish w-full h-10 z-10">
                <td className="text-center">
                  <span className="mx-auto"><ShortId id={meta.txid} /></span>
                </td>
                <td className="text-center font-xs">
                  <BlockId id={meta.blockId} />                  
                </td>
                <td className="text-center">
                  <ShortWallet id={meta.metaDetails.posterAddress}/>
                </td>
                <td className="text-center">
                  <Timestamp value={meta.metaDetails.timestamp}/>
                </td>
                <td className="text-center">{meta.metaDetails.metaName}</td>
                <td className="text-center">{meta.metaDetails.metaData}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
export default TokenMetadataTable;
