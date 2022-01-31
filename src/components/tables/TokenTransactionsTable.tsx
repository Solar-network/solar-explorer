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
} from "./Cells";
import explorer from "../../lib/api";

const { lang } = i18n;
const { navigation } = lang;
type TokenTransactionsTableProps = {
    token_id?: string;
};
type TokenTransactionsTableState = { transactions: Array<any>; interval: any };
class TokenTransactionsTable extends React.Component<
TokenTransactionsTableProps,
TokenTransactionsTableState
> {
  static contextType = BlockchainContext;

  constructor(props: TokenTransactionsTableProps) {
    super(props);
    this.state = {
      transactions: [],
      interval: null,
    };
  }

  componentDidUpdate(prevProps: any) {
    console.log(prevProps);
  }

  componentDidMount() {
    let blockchain = this.context;

    const getData = () => {
      console.log(blockchain);
      if (this.props.token_id) {
        explorer
        .on(blockchain)
        .slp
        .tokenTransactions(this.props.token_id)
        .then((d:any) => {
          this.setState({ transactions: d });
        });
      } else {
        explorer
        .on(blockchain)
        .slp
        .tokenTransactions(this.props.token_id)
        .then((d:any) => {
          this.setState({ transactions: d });
        });
      }
    };
    getData();
    this.setState({
      interval: setInterval(() => {
        getData();
      }, 30000),
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }
  render() {
    const wallet = this.props.token_id;
    return (
      <div>
        <table className="w-full">
          <thead className="border-b border-b-secondary dark:border-b-dark-secondary">
            <th className="py-2">Tx</th>
            <th>Timestamp</th>
            <th>Sender</th>

            <th>Type</th>
            <th>Note</th>
          </thead>
          <tbody>
            {this.state.transactions.map((transaction) => (
              <tr className="bg-quartish dark:bg-dark-quartish dark:hover:bg-dark-hoverish dark:even:bg-dark-evenish hover:bg-hoverish cursor-pointer even:bg-evenish w-full h-10 z-10">
                <td>
                  <ShortId id={transaction.txid} />
                </td>
                <td className="text-center font-xs">
                  <Timestamp value={transaction.transactionDetails.timestamp} />
                </td>
                <td className="">
                  <ShortWallet id={transaction.transactionDetails.senderAddress} />
                </td>
                <td className="text-center">
                  <span className="rounded p-1 bg-secondary dark:bg-dark-secondary lowercase">{transaction.transactionDetails.transactionType}</span>
                </td>
                <td className="text-center">
                  <SmartBridge value={transaction.transactionDetails.note} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
export default TokenTransactionsTable;
