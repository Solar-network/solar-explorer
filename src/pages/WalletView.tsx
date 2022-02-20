import { render } from "@testing-library/react";
import React, { useContext, useEffect, useState } from "react";
import {
  NavigateFunction,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  Amount,
  BlockId,
  LongWallet,
  ShortCopy,
  ShortWallet,
} from "../components/tables/Cells";
import { BsWallet, BsKey } from "react-icons/bs";
import { FaRegAddressCard } from "react-icons/fa";
import { MdQrCode2 } from "react-icons/md";
import explorer from "../lib/api";
import { BlockchainContext } from "../BlockchainContext";
import { Tab } from "@headlessui/react";
import TransactionsTable from "../components/tables/TransactionsTable";
import TokenHoldingsTable from "../components/tables/TokenHoldingsTable";
import TokenOwnershipTable from "../components/tables/TokenOwnershipTable";
import Delegates from "./Delegates";
import { Blockchains } from "../lib/blockchains";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const tabClass = ({ selected }: { selected: boolean }) =>
  classNames(
    "w-full py-1 text-sm leading-5 font-medium text-black dark:text-white rounded-lg",
    "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60",
    selected
      ? "bg-secondary dark:bg-dark-secondary shadow"
      : "text-blue-100 hover:bg-white/[0.12]"
  );
function WalletView() {
  const { wallet_address } = useParams();
  const [wallet, setWallet] = useState({
    address: "",
    publicKey: "",
    balance: "",
  });
  const [delegate, setDelegate] = useState(null)
  const [network, setNetwork] = useState({symbol:""})
  let blockchain = useContext(BlockchainContext);

  useEffect(() => {
    const getData = () => {
      setNetwork(Blockchains.find((bc:any) => bc.networks.find((nt:any) => nt.subdomain == blockchain)).networks.find((nt:any) => nt.subdomain == blockchain))
      console.log(blockchain);
      explorer
        .on(blockchain)
        .core.api("wallets")
        .get(wallet_address)
        .then((d) => {
          setWallet(d.body.data);
        });
        explorer
        .on(blockchain)
        .core.api("delegates")
        .get(wallet_address)
        .then((d) => {
          setDelegate(d.body.data);
        });
    };
    getData();
  }, []);

  return (
    <div className="mx-auto max-w-7xl mt-10">
      <div className="my-8">
        <span className="text-3xl text-black dark:text-white">
          Wallet Details
        </span>
      </div>
      <div className="sm:rounded bg-tertiary dark:bg-dark-tertiary sm:grid sm:grid-cols-3 text-black dark:text-white p-4 space-y-4 sm:space-y-0 sm:divide-x-2 sm:divide-secondary sm:dark:divide-dark-secondary drop-shadow-sm">
        <div className="flex">
          <div className="rounded-full bg-secondary dark:bg-dark-secondary py-3 px-3 ml-3">
            <FaRegAddressCard className="text-2xl" />
          </div>
          <div className="ml-4">
            <span className="">Address</span> <br />
            <LongWallet id={wallet.address} />
          </div>
        </div>
        <div className="">
          <div className="flex">
            <div className="rounded-full bg-secondary dark:bg-dark-secondary py-3 px-3 ml-3">
              <BsKey className="text-2xl" />
            </div>
            <div className="ml-4">
              <span>Public Key</span>
              <br />
              <span className="text-greenish">
                <ShortCopy text={wallet.publicKey} />
              </span>
            </div>
          </div>
        </div>
        <div className="">
          <div className="flex">
            <div className="rounded-full bg-secondary dark:bg-dark-secondary py-3 px-3 ml-3 mr-4">
              <BsWallet className="text-2xl" />
            </div>

            <div className="grow">
              <span>Balance</span>
              <br />
              <span className="">
                <Amount value={parseFloat(wallet.balance)} />
              </span>
            </div>
            <div>
              <button className="bg-greenish rounded py-1 px-3 justify-self-end hidden">
                <MdQrCode2 className="text-4xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Tab.Group>
        <div className="mx-auto max-w-7xl mt-2">
          <div className="w-full sm:w-2/4 mt-4">
            <Tab.List className="flex p-1 space-x-1 bg-tertiary dark:bg-dark-tertiary rounded-xl">
              <Tab key="txs" className={tabClass}>
                Transactions
              </Tab>

{/*               <Tab key="tokens" className={tabClass}>
                Token Holdings
              </Tab>
              <Tab key="token_ownership" className={tabClass}>
                Token Ownership
              </Tab> */}
              {delegate &&
                  <Tab key="delegate" className={tabClass}>
                  Delegate
                </Tab>
              }
            </Tab.List>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-4 text-black dark:text-white rounded drop-shadow-lg bg-tertiary dark:bg-dark-tertiary">
          <Tab.Panels className="mt-2">
            <Tab.Panel key="txs" className="text-black dark:text-white">
              <TransactionsTable wallet={wallet_address} type={-1} />
            </Tab.Panel>
{/*             <Tab.Panel
              key="tokens"
              className="text-black dark:text-white"
            >
              <TokenHoldingsTable wallet={wallet_address}/>
            </Tab.Panel>
            <Tab.Panel
              key="token_ownership"
              className="text-black dark:text-white"
            ><TokenOwnershipTable wallet={wallet_address}/></Tab.Panel> */}
            {delegate && 
            <Tab.Panel
            key="delegate"
            className="text-black dark:text-white"
          >
            <table className="w-full">
              <tbody>
                <tr className="hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
                  <td className="pl-4 w-1/4 text-center font-bold">Username</td>
                  <td>{delegate.username}</td>
                </tr>
                <tr className="hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
                  <td className="pl-4 w-1/4 text-center font-bold">Votes</td>
                  <td>{parseInt((parseInt(delegate.votes)/100000000).toFixed(0)).toLocaleString("us")}  {network.symbol} </td>
                </tr>
                <tr className="hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
                  <td className="pl-4 w-1/4 text-center font-bold">Rank</td>
                  <td>{delegate.rank}</td>
                </tr>
                <tr className="hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
                  <td className="pl-4 w-1/4 text-center font-bold">Blocks produced</td>
                  <td>{delegate.blocks.produced}</td>
                </tr>
               {
                 delegate.blocks.last &&
                 <tr className="hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
                 <td className="pl-4 w-1/4 text-center font-bold">Last produced block</td>
                 <td><BlockId id={delegate.blocks.last.id}/></td>
               </tr>
               }
                <tr className="hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
                  <td className="pl-4 w-1/4 text-center font-bold">Resigned</td>
                  <td>{delegate.isResigned? <span>yes</span> : <span>no</span>}</td>
                </tr>
              </tbody>
            </table>
          </Tab.Panel>}
          </Tab.Panels>
        </div>
      </Tab.Group>
    </div>
  );
}
export default WalletView;
