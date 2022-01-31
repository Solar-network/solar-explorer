import { render } from "@testing-library/react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BlockchainContext } from "../BlockchainContext";
import explorer from "../lib/api";
import { AiOutlineNumber } from "react-icons/ai";
import {RiUserShared2Line, RiUserReceived2Line} from 'react-icons/ri';
import { Amount, BlockId, Confirms, LongTimestamp, LongWallet, Timestamp } from "../components/tables/Cells";
import { Tab } from "@headlessui/react";
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const tabClass = ({ selected }: { selected: boolean }) =>
  classNames(
    "w-full py-1 text-sm leading-5 font-medium text-white rounded-lg",
    "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60",
    selected
      ? "bg-secondary dark:bg-dark-secondary shadow"
      : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
  );

  function isJson(str:string) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

  
export const TransactionView = () => {
  const { tx_id } = useParams();
  const blockchain = useContext(BlockchainContext);
  const [tx, setTx] = useState({
    confirmations: 0,
    amount: "",
    fee: "",
    timestamp: { epoch: 0, unix: 0, human: "string" },
    blockId: "",
    type: 0,
    sender: "",
    recipient: "",
    vendorField : ""
  });

  const [slpTx, setSlpTx] = useState([])
  const [smartbridge, setSmartBridge] = useState("d");

  useEffect(() => {
    explorer
      .on(blockchain)
      .core.api("transactions")
      .get(tx_id)
      .then((d) => {
          let dd = d.body.data;
          setTx({confirmations:dd.confirmations, amount: dd.amount, fee: dd.fee, timestamp: dd.timestamp, type: dd.type, recipient: dd.recipient, sender: dd.sender, vendorField: dd.vendorField, blockId: dd.blockId});
          explorer.on(blockchain).slp.transaction(tx_id).then((ds:any) => {
            setSlpTx(ds)
          })
      });
  }, []);
  return (
    <div className="max-w-7xl mx-auto mt-4 text-black dark:text-white">
        <div className="my-12">
                        <span className="text-3xl text-black dark:text-white">
                    Transaction Details
                </span>
                        </div>
      <div className="rounded bg-tertiary dark:bg-dark-tertiary text-black dark:text-white p-4 divide-y-2 divide-secondary dark:divide-dark-secondary drop-shadow-sm mb-3">
        <div className="flex mb-3">
          <div className="rounded-full bg-secondary dark:bg-dark-secondary py-3 px-3">
            <AiOutlineNumber className="text-2xl" />
          </div>
          <div className="ml-4">
            <span className="">Transaction ID</span> <br />
            <span className="text-greenish">{tx_id}</span>
          </div>
        </div>
        <div className="sm:grid sm:grid-cols-2 sm:divide-x-2 divide-secondary dark:divide-dark-secondary">
          <div className="flex items-center pt-3">
          <div className="rounded-full bg-secondary dark:bg-dark-secondary py-3 px-3 mr-2">
            <RiUserShared2Line className="text-2xl" />
          </div>
            <div  className=" pl-3">
            <span className="">Sender</span>
            <span className="text-greenish"><LongWallet id={tx.sender} /></span>

            </div>
          </div>
          <div className="flex items-center pt-3 sm:pl-3">
          <div className="rounded-full bg-secondary dark:bg-dark-secondary py-3 px-3 mr-2">
            <RiUserReceived2Line className="text-2xl" />
          </div>
            <div className=" pl-3">
            <span className="">Recipient</span>
            <span className="text-greenish"><LongWallet id={tx.recipient} /></span>
            </div>
          </div>
        </div>
      </div>

      <Tab.Group>
        <div className="mx-auto max-w-7xl mt-2">
          <div className="w-56 mt-4">
            <Tab.List className="flex p-1 space-x-1 bg-tertiary dark:bg-dark-tertiary rounded-xl text-black dark:text-white">
            <Tab key="info" className={tabClass}>
                <span className="text-black dark:text-white">Details</span>
              </Tab>
              {slpTx [0] && <Tab key="slp" className={tabClass}>
                <span className="text-black dark:text-white">SLP Details</span>
              </Tab>}
            </Tab.List>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-4 text-black dark:text-white rounded drop-shadow-lg bg-tertiary dark:bg-dark-tertiary">
          <Tab.Panels className="mt-2">
          <Tab.Panel key="info" className="dark:text-white text-black">
          <div className="rounded bg-tertiary dark:bg-dark-tertiary">
        <table className="w-full">
          <tbody>
            <tr className=" hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
              <td className="pl-4 w-1/4 text-center font-bold">Status: </td>{" "}
              <td>
                <span className="p-2 bg-green-700 text-center rounded">
                  Success
                </span>
              </td>
            </tr>
            <tr className="bg-quartish dark:bg-dark-quartish hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
              <td className="pl-4 w-1/4 text-center font-black">
                Confirmations
              </td>{" "}
              <td><Confirms confirms={tx.confirmations}/></td>
            </tr>
            <tr className="bg-quartish dark:bg-dark-quartish hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
              <td className="pl-4 w-1/4 text-center font-black">Amount</td>
              <td><Amount value={parseFloat(tx.amount)}/></td>
            </tr>
            <tr className="bg-quartish dark:bg-dark-quartish hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
              <td className="pl-4 w-1/4 text-center font-black">Fee</td>
              <td><Amount value={parseFloat(tx.fee)}/></td>
            </tr>
            <tr className="bg-quartish dark:bg-dark-quartish hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
              <td className="pl-4 w-1/4 text-center font-black">Timestamp</td>
              <td><LongTimestamp value={tx.timestamp.human}/></td>
            </tr>
            <tr className="bg-quartish dark:bg-dark-quartish hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
              <td className="pl-4 w-1/4 text-center font-black">Block ID</td>
              <td><BlockId id={tx.blockId} /></td>
            </tr>
            <tr className="bg-quartish dark:bg-dark-quartish hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
              <td className="pl-4 w-1/4 text-center font-black">
                Transaction Type
              </td>{" "}
              <td>{tx.type}</td>
            </tr>
            <tr className="bg-quartish dark:bg-dark-quartish hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
              <td className="pl-4 w-1/4 text-center font-black">SmartBridge</td>
              <td><textarea className="my-3 bg-secondary dark:bg-dark-secondary rounded w-2/3 h-32 p-3 outline-none focus:outline-none" readOnly value={tx.vendorField}></textarea></td>
            </tr>
          </tbody>
        </table>
      </div>
            </Tab.Panel>
{slpTx [0] && <Tab.Panel key="slp" className="text-black dark:text-white">
            
            <div className="rounded bg-tertiary">
              <table className="w-full">
                <tbody>
                  <tr className="bg-quartish dark:bg-dark-quartish hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
                    <td className="pl-4 w-1/4 text-center font-bold">Version </td>
                    <td>
                      {slpTx[0].transactionDetails.versionType}
                    </td>
                  </tr>
                  <tr className="bg-quartish dark:bg-dark-quartish hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
                    <td className="pl-4 w-1/4 text-center font-black">
                      Token
                    </td>{" "}
                    <td>{slpTx[0].transactionDetails.tokenIdHex}</td>
                  </tr>
                  <tr className="bg-quartish dark:bg-dark-quartish hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
                    <td className="pl-4 w-1/4 text-center font-black">Type</td>
                    <td><span className="rounded p-1 bg-secondary dark:bg-dark-secondary lowercase">{slpTx[0].transactionDetails.transactionType}</span></td>
                  </tr>
                  {
                    slpTx[0].transactionDetails.sendOutput &&
                    <tr className="bg-quartish dark:bg-dark-quartish hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
                    <td className="pl-4 w-1/4 text-center font-black">Amount</td>
                    <td>{slpTx[0].transactionDetails.sendOutput.amount}</td>
                    </tr>
                  }
                  
                  {slpTx[0].transactionDetails.note &&
                    <tr className="bg-quartish dark:bg-dark-quartish hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
                    <td className="pl-4 w-1/4 text-center font-black">Note</td>
                    <td>{slpTx[0].transactionDetails.note}</td>
                  </tr>
                  }
                  <tr className="bg-quartish dark:bg-dark-quartish hover:bg-hoverish dark:hover:bg-dark-hoverish cursor-pointer even:bg-evenish dark:even:bg-dark-evenish w-full h-14 z-10">
                    <td className="pl-4 w-1/4 text-center font-black">Transaction Code</td>
                    
      
                     <td><textarea className="my-3 bg-secondary dark:bg-dark-secondary rounded w-2/3 h-48 p-3 outline-none focus:outline-none text-black dark:text-gray-400" readOnly value={tx.vendorField}></textarea></td>
                 </tr>
      
                </tbody>
              </table>
            </div>
      
                  </Tab.Panel>}
          </Tab.Panels>
        </div>
      </Tab.Group>
      
    </div>
  );
};
export default TransactionView;
