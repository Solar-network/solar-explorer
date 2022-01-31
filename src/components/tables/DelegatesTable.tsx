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
} from "./Cells";
import explorer from "../../lib/api";
import { MdArrowBackIos, MdArrowForwardIos, MdOutlineCancel } from "react-icons/md";
import { Blockchains } from "../../lib/blockchains";
import { networkInterfaces } from "os";
import { AiOutlineCheckCircle } from "react-icons/ai";

const { lang } = i18n;
const { navigation } = lang;
type DelegatesTableState = {delegates:Array<any>, interval: any,meta: any, supply: string, currentPage: number, pager: Array<any>, loading:boolean, network:any}

function isForging(time:string) : number {
  var d = new Date();
  var current = d.getTime();
  var previous = Date.parse(time);

  var elapsed = (current - previous) / 1000;

  if (elapsed < (16 * 60)) {
    return 0;
  } else if (elapsed < (24 * 60)) {
    return 1;
  } else {
    return 2;
  }
}

class DelegatesTable extends React.Component<{status: string}, DelegatesTableState> {
  static contextType = BlockchainContext;
  
  constructor(props:any) {
    super(props)
    let blockchain = this.context;
    this.state = {
        delegates: [],
        meta: {},
      interval: null,
      supply: "",
      currentPage: 1,
      pager: [],
      loading: true,
      network: {symbol:""}
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
    if (this.props.status == "standby") {pc -= 1}
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

  getData(page: number = this.state.currentPage, skeleton: boolean = false) {
    let blockchain = this.context;
    let missed = 0, forging = 0, notforging = 0;
    if (this.props.status == "active") {
      explorer.on(blockchain).core
      .api("delegates")
      .all({limit:Blockchains.find((bc) => bc.networks.find((network: { subdomain: any; }) => network.subdomain == blockchain)).delegates})
      .then((d) => {
        this.setState({ delegates: d.body.data , meta: d.body.meta});
        this.setState({pager: this.paginator(page)})
        this.setState({loading: false})

      }).catch(() => {
        this.setState({ delegates: [] });
        this.setState({pager: this.paginator(page)})
        this.setState({loading: false})
      });
    } 
    else if (this.props.status == "standby")
     {
      explorer.on(blockchain).core
      .api("delegates")
      .all({limit:Blockchains.find((bc) => bc.networks.find((network: { subdomain: any; }) => network.subdomain == blockchain)).delegates, page:page+1})
      .then((d) => {
        this.setState({ delegates: d.body.data , meta: d.body.meta});
        this.setState({pager: this.paginator(page)})
        this.setState({loading: false})
      }).catch(() => {
        this.setState({ delegates: [] });
        this.setState({pager: this.paginator(page)})
        this.setState({loading: false})
      });
     }
     else {
      explorer.on(blockchain).core
      .api("delegates")
      .all({isResigned:true, page: page})
      .then((d) => {
        this.setState({ delegates: d.body.data , meta: d.body.meta});
        this.setState({pager: this.paginator(page)})
        this.setState({loading: false})
      }).catch(() => {
        this.setState({ delegates: [] });
        this.setState({pager: this.paginator(page)})
        this.setState({loading: false})
      });
     }    
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

  componentDidUpdate(prevProps: any) {
    console.log(prevProps);
  }

  componentDidMount() {
    let blockchain = this.context;
    this.setState({network:Blockchains.find((bc) => bc.networks.find((network) => network.subdomain == blockchain)).networks.find((network) => network.subdomain == blockchain)})
    explorer.on(blockchain).core.get("blockchain").then((response) => {
      this.setState({supply: response.body.data.supply});
  })
    this.getData(1,true);
    this.setState({
      interval: setInterval(() => {
        this.getData();
      }, 30000),
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval)
  }
  render() {
    return (
      <div>
        <table className="w-full">
          <thead className="border-b border-b-secondary dark:border-b-dark-secondary">
            <tr>
              <th className="py-2">Rank</th>
              <th className="">Username</th>
              <th>Votes</th>
              {this.props.status == "active" && <th className="">Forging</th>}
              <th className="">Last forged</th>
            </tr>
          </thead>

          <tbody>
            {!this.state.loading && this.state.delegates.map((delegate) => (
              <tr
                key={delegate.address}
                className="bg-quartish dark:bg-dark-quartish dark:hover:bg-dark-hoverish dark:even:bg-dark-evenish hover:bg-hoverish cursor-pointer even:bg-evenish w-full h-10 z-10"
              >
                <td className="py-3 text-center">
                  <span className="rounded-full bg-secondary dark:bg-dark-secondary p-2 text-greenish">#{delegate.rank}</span>
                </td>
                <td className="text-center">
                <a href={`/${this.context}/wallet/${delegate.address}`} className="text-greenish">{delegate.username}</a>
                </td>
                <td className="text-center">{parseInt((parseInt(delegate.votes)/100000000).toFixed(0)).toLocaleString("us")} {this.state.network.symbol}  <span className="text-gray-600 dark:text-gray-400">{((100 * delegate.votes) / parseInt(this.state.supply)).toFixed(4)}%</span></td>
                {this.props.status == "active" && <td className="text-center">
                  {delegate.blocks.produced > 0 && delegate.blocks.last && isForging(delegate.blocks.last.timestamp.human) == 0 ? <span className="rounded px-2 py-1 text-green-400 "><AiOutlineCheckCircle className="mx-auto text-xl"/></span>: <span className="rounded px-2 py-1 text-red-600"><MdOutlineCancel className="mx-auto text-xl"/></span>}
                </td>}
                <td className="text-center">
                {delegate.blocks.produced > 0 ? <Timestamp value={delegate.blocks.last.timestamp.human}/> : <span className="text-gray-600 dark:text-gray-400 italic">Never</span>  }
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
              <td><div className="rounded bg-secondary dark:bg-[#1c2531] p-3 mx-2"></div></td>
            </tr>
            ))
            }
          </tbody>
        </table>
        {this.state.delegates.length == 0 && this.state.loading == false &&
              <div className="rounded m-3 bg-secondary dark:bg-dark-secondary py-2 text-center text-gray-600 dark:text-gray-400">No records found.</div>
        }
        {this.props.status!="active" && <div className="flex justify-center py-2">
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
        </div>}
      </div>
    );
  }
}
export default DelegatesTable;
