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
import { contextType } from "react-modal";
import { traceDeprecation } from "process";
import { ApiQuery } from "@arkecosystem/client";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
const { lang } = i18n;
const { navigation } = lang;

type TransactionsTableProps = {
  wallet?: string;
  type: number;
};
type TransactionsTableState = { transactions: Array<any>; meta: any, interval: any, currentPage: number, pager: Array<any>, loading:boolean};
class TransactionsTable extends React.Component<
TransactionsTableProps,
  TransactionsTableState
> {
  static contextType = BlockchainContext;
  
  constructor(props: TransactionsTableProps) {
    super(props);
    this.state = {
      transactions: [],
      meta: {},
      interval: null,
      currentPage: 1,
      pager: [],
      loading: true
    };
    this.getData = this.getData.bind(this);
    this.goFirst = this.goFirst.bind(this);
    this.goLast = this.goLast.bind(this);
    this.goBack = this.goBack.bind(this);
    this.goNext = this.goNext.bind(this);
    this.handlePage = this.handlePage.bind(this);

  }

  paginator(page: number = this.state.currentPage) {
    let pc = this.state.meta.pageCount
    let cp = page
    let pages = []
    console.log(cp)
    if (pc > 13) {    
      if (cp < 8) {
        pages = [1,2,3,4,5,6,7,8,9,10,-1,pc-1,pc]
      } else {
        
        if (cp > (pc-10)) {
          pages = [1,2,-1,pc-9,pc-8,pc-7,pc-6,pc-5,pc-4,pc-3,pc-1,pc]
        } else {          
          
          pages = [1,2,-1,cp-4,cp-3,cp-2,cp-1,cp,cp+1,cp+2,cp+3,-1,pc-1,pc]
        }
      }
    } else {
      for (let index = 1; index <= pc; index++) {
        pages.push(index)
      }
    }
    console.log(pages);
    return pages;
  }
  componentDidUpdate(prevProps: any) {
    console.log(prevProps);
    if (prevProps.type !== this.props.type) {

      this.getData(1,true);
  
    }
  }
  getData(page: number = this.state.currentPage, skeleton: boolean = false) {
    let blockchain = this.context;
    if (this.props.wallet) {
      if (this.props.type == -1) {
      explorer
      .on(blockchain)
      .core.api("wallets")
      .transactions(this.props.wallet,{page: page, limit: 25})
      .then((d) => {
        this.setState({ transactions: d.body.data, meta: d.body.meta});
        this.setState({pager: this.paginator(page)})
        this.setState({loading: false})
      }).catch(() => {
        this.setState({ transactions: [] });
        this.setState({pager: this.paginator(page)})
        this.setState({loading: false})
      });
    } else {
      explorer
      .on(blockchain)
      .core.api("wallets")
      .transactions(this.props.wallet,{page: page, limit: 25, type: this.props.type})
      .then((d) => {
        this.setState({ transactions: d.body.data, meta: d.body.meta});
        this.setState({pager: this.paginator(page)})
        this.setState({loading: false})
      }).catch(() => {
        this.setState({ transactions: [] });
        this.setState({pager: this.paginator(page)})
        this.setState({loading: false})
      });
    }
    } else {
      if (this.props.type == -1) {

      if (skeleton) {this.setState({transactions: []})}
      this.setState({loading: skeleton});
      explorer
      .on(blockchain)
      .core.api("transactions")
      .all({page: page, limit: 25})
      .then((d) => {
        this.setState({ transactions: d.body.data, meta: d.body.meta});
        this.setState({pager: this.paginator(page)})
        this.setState({loading: false})
      }).catch(() => {
        this.setState({ transactions: [] });
        this.setState({pager: this.paginator(page)})
        this.setState({loading: false})
      });
    } else {
      this.setState({loading: skeleton});
      explorer
      .on(blockchain)
      .core.api("transactions")
      .all({page: page, limit: 25, type: this.props.type})
      .then((d) => {
        this.setState({ transactions: d.body.data, meta: d.body.meta});
        this.setState({pager: this.paginator(page)})
        this.setState({loading: false})
      }).catch(() => {
        this.setState({ transactions: [] });
        this.setState({pager: this.paginator(page)})
        this.setState({loading: false})
      });
    }
    }
  };

  
  componentDidMount() {
    this.getData(1,true);
    this.setState({
      interval: setInterval(() => {
        this.getData();
      }, 30000),
    });
  }

  handlePage(event:React.MouseEvent) {
    if (event.target instanceof Element) {
      if (parseInt(event.target.getAttribute("data-page")) != this.state.currentPage) {
        this.setState({currentPage: parseInt(event.target.getAttribute("data-page"))})
        this.getData(parseInt(event.target.getAttribute("data-page")), true)
      }
    }
  }

  goFirst() {
    if (this.state.currentPage != 1) {
      this.setState({currentPage: 1})
      this.getData(1,true)
    }
  }

  goLast() {
    if (this.state.currentPage != this.state.meta.pageCount) {
      this.setState({currentPage: this.state.meta.pageCount})
      this.getData(this.state.meta.pageCount,true)
    }
  }

  goBack() {
    if (this.state.currentPage != 1) {
      this.setState({currentPage: this.state.currentPage-1})
      this.getData(this.state.currentPage-1,true)
    }
  }

  goNext() {
    if (this.state.currentPage != this.state.meta.pageCount) {
      this.setState({currentPage: this.state.currentPage+1})
      this.getData(this.state.currentPage+1,true)
    }
  }
  
  componentWillUnmount() {
    clearInterval(this.state.interval);
  }
  render() {
    const wallet = this.props.wallet;
    return (
      <div>
        <table className="w-full">
          <thead className="border-b border-b-secondary dark:border-b-dark-secondary">
            <th className="py-2">ID</th>
            <th>Confirms</th>
            <th>Timestamp</th>
            <th>Sender</th>
            <th></th>
            <th>Recipient</th>
            <th>Amount</th>
            <th>Smartbridge</th>
          </thead>
          <tbody>
            {!this.state.loading && this.state.transactions.map((transaction) => (
              <tr className="bg-quartish dark:bg-dark-quartish dark:hover:bg-dark-hoverish dark:even:bg-dark-evenish hover:bg-hoverish cursor-pointer even:bg-evenish w-full h-10 z-10">
                <td>
                  <ShortId id={transaction.id} />
                </td>
                <td className="text-center">
                  <Confirms confirms={transaction.confirmations} />
                </td>
                <td className="text-center font-xs">
                  <Timestamp value={transaction.timestamp.human} />
                </td>
                <td className="">
                  <ShortWallet id={transaction.sender} />
                </td>
                <td className="text-center">
                  <TxArrow/>
                </td>
                <td className="">
                  <ShortWallet id={transaction.recipient} multi={transaction.asset? transaction.asset.payments : []} />
                </td>
                
                <td className="text-center">
                  <Amount value={transaction.amount} />
                </td>
                <td className="">
                  <SmartBridge value={transaction.vendorField} />
                </td>
              </tr>
            ))}
            {this.state.loading &&
            [...Array(25)].map(() => (
              <tr className="bg-quartish dark:bg-dark-quartish w-full h-10 dark:even:bg-dark-evenish even:bg-evenish">
              <td><div className="rounded bg-secondary dark:bg-[#1c2531] p-3 mx-2"></div></td>
              <td><div className="rounded bg-secondary dark:bg-[#1c2531] p-3 mx-2"></div></td>
              <td><div className="rounded bg-secondary dark:bg-[#1c2531] p-3 mx-2"></div></td>
              <td><div className="rounded bg-secondary dark:bg-[#1c2531] p-3 mx-2"></div></td>
              <td></td>
              <td><div className="rounded bg-secondary dark:bg-[#1c2531] p-3 mx-2"></div></td>
              <td><div className="rounded bg-secondary dark:bg-[#1c2531] p-3 mx-2"></div></td>
              <td><div className="rounded bg-secondary dark:bg-[#1c2531] p-3 mx-2"></div></td>
            </tr>
            ))
            }
          </tbody>
        </table>
        {this.state.transactions.length == 0 && this.state.loading == false &&
              <div className="rounded m-3 bg-secondary dark:bg-dark-secondary py-2 text-center text-gray-600 dark:text-gray-400">No records found.</div>
        }
        <div className="flex justify-center py-2">
          <button className={`bg-secondary dark:bg-dark-secondary  py-1 px-4 m-2 rounded ${this.state.currentPage == 1 ? " text-gray-600 dark:text-gray-400 cursor-default" : "hover:bg-hoverish dark:hover:bg-dark-hoverish"}`} onClick={this.goFirst}>First</button>
          <button className={`bg-secondary dark:bg-dark-secondary  py-1 px-4 m-2 rounded ${this.state.currentPage == 1 ? " text-gray-600 dark:text-gray-400 cursor-default" : "hover:bg-hoverish dark:hover:bg-dark-hoverish"}`} onClick={this.goBack}><MdArrowBackIos/></button>
          <div className="rounded my-2 px-2 bg-secondary dark:bg-dark-secondary py-2">
          {this.state.pager.map((numbo) => {
              if (numbo == -1 ) {
                return <span className={` py-2 px-3 cursor-default rounded bg-secondary dark:bg-dark-secondary w-7`}>...</span>
              } else {
                return <span className={` py-2 px-3 cursor-pointer rounded hover:bg-hoverish dark:hover:bg-dark-hoverish ${this.state.currentPage == numbo ? "bg-hoverish dark:bg-dark-hoverish" : "bg-secondary dark:bg-dark-secondary"}`} data-page={numbo} onClick={this.handlePage}>{numbo}</span>
              }
            })}
          </div>
          <button className={`bg-secondary dark:bg-dark-secondary  py-1 px-4 m-2 rounded ${this.state.currentPage == this.state.meta.pageCount ? "text-gray-600 dark:text-gray-400 cursor-default" : "hover:bg-hoverish dark:hover:bg-dark-hoverish"}`} onClick={this.goNext}><MdArrowForwardIos/></button>
          <button className={`bg-secondary dark:bg-dark-secondary  py-1 px-4 m-2 rounded ${this.state.currentPage == this.state.meta.pageCount ? "text-gray-600 dark:text-gray-400 cursor-default" : "hover:bg-hoverish dark:hover:bg-dark-hoverish"}`} onClick={this.goLast}>Last</button>
        </div>
      </div>
    );
  }
}
export default TransactionsTable;
