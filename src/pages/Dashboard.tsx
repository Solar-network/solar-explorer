import React, { useEffect, useState } from "react";
import { BlockchainContext } from "../BlockchainContext";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { BiSearch } from "react-icons/bi";
import { RiCoinLine } from "react-icons/ri";
import { MdKeyboardArrowDown, MdOutlineAttachMoney } from "react-icons/md";
import explorer from "../lib/api";
import {
  BlockId,
  ShortCopy,
  ShortTx,
  ShortWallet,
  Timestamp,
} from "../components/tables/Cells";
import { Blockchains } from "../lib/blockchains";
import Search from "../components/Search";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

class Dashboard extends React.Component<{}, any> {
  static contextType = BlockchainContext;

  constructor(props: any) {
    super(props);
    this.state = {
      coin: {},
      market_data: {},
      supply: "",
      height: "",
      nodeconfig: {},
      blocks: [],
      transactions: [],
      currency: localStorage.getItem("currency")
        ? localStorage.getItem("currency")
        : "eur",
      query: ""
    };
    this.updateCurrency = this.updateCurrency.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

  }

  handleSearch(event:React.FormEvent<HTMLInputElement>) {
    this.setState({query: event.currentTarget.value})
  }

  updateCurrency() {
    let blockchain = this.context;
    let current_network = Blockchains.find((bc) => bc.networks.find((network) => network.subdomain == blockchain)).networks.find((network) => network.subdomain == blockchain)
    this.setState({ currency: localStorage.getItem("currency")? localStorage.getItem("currency") : "eur" });
    

    if (current_network.coingecko_id.length > 0) {
      fetch(
        "https://api.coingecko.com/api/v3/coins/" + current_network.coingecko_id + "/market_chart?vs_currency=" +
          this.state.currency +
          "&days=1"
      ).then((body) => {
        body.json().then((market_data) => {
          console.log(market_data);
          this.setState({ market_data: market_data });
        });
      });
    }
  }

  componentDidMount() {
    let blockchain = this.context;
    let current_network = Blockchains.find((bc) => bc.networks.find((network) => network.subdomain == blockchain)).networks.find((network) => network.subdomain == blockchain)

    if (current_network.coingecko_id.length > 0) {
      fetch("https://api.coingecko.com/api/v3/coins/"+current_network.coingecko_id).then((body) => {
        body.json().then((coin) => {
          console.log(coin);
          this.setState({ coin: coin });
        });
      });
      fetch(
        "https://api.coingecko.com/api/v3/coins/"+current_network.coingecko_id+"/market_chart?vs_currency=eur&days=1"
      ).then((body) => {
        body.json().then((market_data) => {
          console.log(market_data);
          this.setState({ market_data: market_data });
        });
      });
    } 


    explorer
      .on(blockchain)
      .core.get("blockchain")
      .then((response) => {
        console.log(response.body);
        this.setState({ supply: response.body.data.supply });
        this.setState({ height: response.body.data.block.height });
      });

    explorer
      .on(blockchain)
      .core.get("node/configuration")
      .then((response) => {
        console.log(response.body);
        this.setState({ nodeconfig: response.body.data });
      });

    explorer
      .on(blockchain)
      .core.api("blocks")
      .all({ limit: 10 })
      .then((response: any) => {
        console.log(response.body.data);
        this.setState({ blocks: response.body.data });
      });

    explorer
      .on(blockchain)
      .core.api("transactions")
      .all({ limit: 10 })
      .then((response: any) => {
        console.log(response.body.data);
        this.setState({ transactions: response.body.data });
      });
  }
  render() {
    return (
      <div>
        <button
          className="hidden"
          id="update_currency"
          onClick={this.updateCurrency}
        ></button>
        <div className="relative h-[350px] bg-hoverish< dark:bg-dark-evenish -z-10"></div>
        <div className="max-w-7xl mx-auto text-black dark:text-white mt-[-350px] ">
          {/*  <div className="my-12">
          <span className="text-3xl text-black dark:text-white">ARK Stats</span>
        </div> */}
          <div>
            <div className="my-12">
              <div className="py-6 text-2xl px-3 sm:px-0">
                Blockchain info and stats
              </div>
{/*               <div className="  flex justify-content-center drop-shadow-lg ml-2 sm:m-0">
                <div className="bg-tertiary dark:bg-dark-tertiary py-2 px-4 rounded-l">
                  <div className="flex">
                    Filter <MdKeyboardArrowDown className="mt-1 ml-2" />
                  </div>
                </div>
                <input
                  type="text"
                  className=" appearance-none border-none  w-1/2 py-2 px-3 text-gray-600 dark:text-gray-400 bg-tertiary dark:bg-dark-tertiary hover:bg-hoverish dark:hover:bg-dark-hoverish focus-within:hover:bg-secondary focus-within:placeholder-transparent focus-within:bg-secondary dark:focus-within:bg-dark-hoverish focus:outline-none "
                  placeholder="Search in the blockchain..."
                  id="searchInput"
                  onChange={this.handleSearch}
                />{" "}
                <div className="bg-greenish py-2 px-4 rounded-r">
                  <BiSearch className="text-xl text-white" />
                </div>
                <Search query={this.state.query} />
              </div> */}
            </div>
          </div>
          {this.state.coin.market_data && 
          <div className="rounded bg-tertiary dark:bg-dark-tertiary p-3 drop-shadow">
          <div className="sm:grid sm:grid-cols-3 sm:space-x-3 sm:divide-x-2 sm:divide-secondary sm:dark:divide-dark-secondary">
            <div className="space-y-4 divide-y-2 divide-secondary dark:divide-dark-secondary">
              <div className="flex py-3">
                <div>
                  <div className="rounded-full bg-secondary dark:bg-dark-secondary p-3 mx-3 text-2xl">
                    <RiCoinLine />
                  </div>
                </div>
                <div>
                  <span className="text">Value</span>
                  <br />
                  <span className="">
                    <span className="text-greenish text-2xl">
                      {this.state.coin.market_data &&
                        this.state.coin.market_data.current_price[
                          this.state.currency
                        ] && this.state.coin.market_data.current_price[
                          this.state.currency
                        ].toFixed(4)}{" "}
                      {this.state.currency}
                    </span>{" "}
                    <span className="text-gray-600 dark:text-gray-400 italic">
                      @{" "}
                      {this.state.coin.market_data &&
                        this.state.coin.market_data.current_price.btc.toFixed(
                          5
                        )}{" "}
                      BTC
                    </span>
                    <span className="text-red-700">
                      {" "}
                      (
                      {this.state.coin.market_data &&
                        this.state.coin.market_data.price_change_percentage_24h.toFixed(
                          2
                        )}
                      %)
                    </span>
                  </span>
                </div>
              </div>
              <div className="flex py-3">
                <div>
                  <div className="rounded-full bg-secondary dark:bg-dark-secondary p-3 mx-3 text-2xl">
                    <MdOutlineAttachMoney />
                  </div>
                </div>
                <div>
                  <span className="text">Marketcap</span>
                  <br />
                  <span className="text-greenish text-xl">
                    {this.state.coin.market_data && this.state.coin.market_data.market_cap[
                        this.state.currency
                      ] > 0 &&
                      this.state.coin.market_data.market_cap[
                        this.state.currency
                      ].toLocaleString("us")}
                      {this.state.coin.market_data && this.state.coin.market_data.market_cap[
                        this.state.currency
                      ] == 0 && this.state.coin.market_data.current_price &&
                      ((parseInt(this.state.supply.length > 0? this.state.supply : "0") / 100000000)*this.state.coin.market_data.current_price[
                        this.state.currency
                      ]).toLocaleString("us")}
                    {this.state.currency}
                  </span>
                </div>
              </div>
            </div>
            <div className=" border-secondary dark:border-dark-secondary space-y-4 divide-y-2 divide-secondary dark:divide-dark-secondary">
              <div className="flex py-3">
                <div>
                  <div className="rounded-full bg-secondary dark:bg-dark-secondary p-3 mx-3">
                    CV
                  </div>
                </div>
                <div>
                  <span className="text">24hr volume</span>
                  <br />
                  <span className="text-greenish text-xl">
                    {this.state.market_data.total_volumes &&
                      parseInt(
                        this.state.market_data.total_volumes[0][1]
                      ).toLocaleString("us")}{" "}
                    {this.state.currency}
                  </span>
                </div>
              </div>
              <div className="flex py-3">
                <div>
                  <div className="rounded-full bg-secondary dark:bg-dark-secondary p-3 mx-3">
                    CV
                  </div>
                </div>
                <div>
                  <span className="text">24h Low / High</span>
                  <br />
                  <span className="text-greenish text-xl">
                    {this.state.coin.market_data &&
                      this.state.coin.market_data.low_24h[
                        this.state.currency
                      ].toLocaleString("us")}{" "}
                    /{" "}
                    {this.state.coin.market_data &&
                      this.state.coin.market_data.high_24h[
                        this.state.currency
                      ].toLocaleString("us")}{" "}
                    {this.state.currency.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <div className="border-l-2 border-secondary dark:border-dark-secondary"></div>
          </div>
        </div>
          }
          
          <div className="sm:grid sm:grid-cols-3 sm:space-x-3 mt-6 "></div>
          <div className="">
            <div className="sm:grid sm:grid-cols-12 sm:gap-3">
              <div className="sm:col-span-8">
                <div className="sm:grid sm:grid-cols-12 rounded bg-tertiary dark:bg-dark-tertiary mt-2  px-6 drop-shadow">
                  <div className="sm:col-span-3 mt-9 px-6 text-center sm:text-left">
                    <div className="my-3">
                      <span className="text-1xl">Total Supply</span>
                      <br />
                      <span className="text-greenish text-xl">
                        {(
                          parseInt(this.state.supply) / 100000000
                        ).toLocaleString("us")}
                      </span>
                    </div>
                    <div className="my-3">
                      <span className="text-1xl">Block Height</span>
                      <br />
                      <span className="text-greenish text-3xl">
                        {this.state.height.toLocaleString("us")}
                      </span>
                    </div>
                    <div className="my-3">
                      <span className="text-1xl">Delegates forging</span>
                      <br />
                      <span className="text-greenish text-3xl">51/51</span>
                    </div>
                    <div className="my-3">
                      <span className="text-1xl">Core version</span>
                      <br />
                      <span className="text-greenish text-3xl">
                        {this.state.nodeconfig.core &&
                          this.state.nodeconfig.core.version}
                      </span>
                    </div>
                  </div>
                  <div className="sm:col-span-9">
                    <ComposableMap
                      style={{
                        width: "100%",
                        height: "auto",
                        margin: 0,
                        position: "relative",
                        fill: "#ed5c15",
                      }}
                    >
                      <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                          geographies.map((geo) => (
                            <Geography key={geo.rsmKey} geography={geo} />
                          ))
                        }
                      </Geographies>
                    </ComposableMap>
                  </div>
                </div>
              </div>
              <div className="col-span-4 rounded bg-tertiary dark:bg-dark-tertiary mt-2 drop-shadow">
                <table className="w-full">
                  <tbody>
                    <tr className=" hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
                      <td className="pl-4 w-1/4 text-center font-bold">
                        Blocktime{" "}
                      </td>{" "}
                      <td className="text-center">
                        {this.state.nodeconfig.constants &&
                          this.state.nodeconfig.constants.blocktime}
                      </td>
                    </tr>
                    <tr className="bg-quartish dark:bg-dark-quartish hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
                      <td className="pl-4 w-1/4 text-center ">Nethash</td>{" "}
                      <td className="text-center">
                        {this.state.nodeconfig.nethash && (
                          <ShortCopy text={this.state.nodeconfig.nethash} />
                        )}
                      </td>
                    </tr>
                    <tr className="bg-quartish dark:bg-dark-quartish hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
                      <td className="pl-4 w-1/4 text-center ">WIF</td>
                      <td className="text-center">
                        {this.state.nodeconfig.wif && this.state.nodeconfig.wif}
                      </td>
                    </tr>
                    <tr className="bg-quartish dark:bg-dark-quartish hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
                      <td className="pl-4 w-1/4 text-center ">Version</td>
                      <td className="text-center">
                        {this.state.nodeconfig.version &&
                          this.state.nodeconfig.version}
                      </td>
                    </tr>
                    <tr className="bg-quartish dark:bg-dark-quartish hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
                      <td className="pl-4 w-1/4 text-center ">SLIP44</td>
                      <td className="text-center">
                        {this.state.nodeconfig.slip44 &&
                          this.state.nodeconfig.slip44}
                      </td>
                    </tr>
                    <tr className="bg-quartish dark:bg-dark-quartish hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
                      <td className="pl-4 w-1/4 text-center ">Dynamic fees</td>
                      <td className="text-center">
                        {this.state.nodeconfig.transactionPool &&
                        this.state.nodeconfig.transactionPool.dynamicFees
                          .enabled ? (
                          <span>yes</span>
                        ) : (
                          <span>no</span>
                        )}
                      </td>
                    </tr>
                    <tr className="bg-quartish dark:bg-dark-quartish hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
                      <td className="pl-4 w-1/4 text-center ">
                        Multipayment limit
                      </td>
                      <td className="text-center">
                        {this.state.nodeconfig.constants &&
                          this.state.nodeconfig.constants.multiPaymentLimit}
                      </td>
                    </tr>
                    <tr className="bg-quartish dark:bg-dark-quartish hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
                      <td className="pl-4 w-1/4 text-center ">AIP11 Enabled</td>
                      <td className="text-center">
                        {this.state.nodeconfig.aip11 &&
                        this.state.nodeconfig.aip11 ? (
                          <span>yes</span>
                        ) : (
                          <span>no</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-2 mt-4 sm:gap-4">
            <div>
              <span className="text-2xl mt-4 py-2 pl-3 sm:pl-0">Latest blocks</span>
              <div className="rounded bg-tertiary dark:bg-dark-tertiary py-2 mt-4">
                <div className="h-[500px] overflow-scroll">
                  {this.state.blocks.map((block: any) => (
                    <div className="flex py-2 even:bg-evenish dark:even:bg-dark-evenish hover:bg-hoverish dark:hover:bg-dark-hoverish">
                      <div className="rounded bg-secondary dark:bg-dark-secondary  py-3 px-6 mx-3 hidden sm:inline">
                        Bk
                      </div>
                      <div className="mx-4">
                        <BlockId id={block.id} />
                        <Timestamp value={block.timestamp.human} />
                      </div>
                      <div>
                        Validated by{" "}
                        <a
                          className="text-greenish"
                          href={`/${this.context}/wallets/${block.generator.address}`}
                        >
                          {block.generator.username}
                        </a>{" "}
                        <br />
                        {block.transactions} txns
                      </div>
                    </div>
                  ))}
                </div>
                <a
                  href={`/${this.context}/blocks`}
                  className="bg-greenish text-white rounded text-center drop-shadow-md w-full p-2 inline-block"
                >
                  See all blocks
                </a>
              </div>
            </div>
            <div>
              <span className="text-2xl mt-4 py-2 pl-3 sm:pl-0">Latest transactions</span>
              <div className="rounded bg-tertiary dark:bg-dark-tertiary py-2 mt-4">
                <div className="h-[500px] overflow-scroll">
                  {this.state.transactions.map((transaction: any) => (
                    <div className="flex py-2 even:bg-evenish dark:even:bg-dark-evenish hover:bg-hoverish dark:hover:bg-dark-hoverish">
                      <div className="rounded bg-secondary dark:bg-dark-secondary  py-3 px-6 mx-3 hidden sm:inline">
                        Tx
                      </div>
                      <div className="mx-4">
                        <ShortTx id={transaction.id} />
                        <Timestamp value={transaction.timestamp.human} />
                      </div>
                      <div>
                        <div className="flex">
                          <span>From</span>{" "}
                          <ShortWallet id={transaction.sender} />
                        </div>
                        <div className="flex">
                          <span>To</span>{" "}
                          <ShortWallet id={transaction.recipient} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <a
                  href={`/${this.context}/transactions`}
                  className="bg-greenish text-white rounded text-center drop-shadow-md w-full p-2 inline-block"
                >
                  See all transactions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Dashboard;
