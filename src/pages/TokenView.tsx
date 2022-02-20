import { Tab } from "@headlessui/react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BlockchainContext } from "../BlockchainContext";
import { BlockId, LongWallet, ShortId, Timestamp } from "../components/tables/Cells";
import TokenHoldersTable from "../components/tables/TokenHoldersTable";
import TokenMetadataTable from "../components/tables/TokenMetadataTable";
import TokenTransactionsTable from "../components/tables/TokenTransactionsTable";
import explorer from "../lib/api";
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }
  
  const tabClass = ({ selected }: { selected: boolean }) =>
    classNames(
      "w-full py-1 text-sm leading-5 font-medium text-black dark:text-white rounded-lg",
      "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60",
      selected
        ? "bg-secondary dark:bg-dark-secondary shadow"
        : "text-blue-100 hover:bg-white/[0.12] hover:text-black dark:text-white"
    );

 function TokenView() {
  const { token_address } = useParams();
  const [documentUri, setDocumentUri] = useState("");
  const [token, setToken] = useState({
    type: "",
    tokenDetails: { name: "", documentUri: "", tokenIdHex: "", decimals: 0, ownerAddress: "", genesis_timestamp: "", symbol: ""},
    tokenStats: {qty_token_circulating_supply: "", creation_transaction_id: "", block_created_id: ""}
  });
  const blockchain = useContext(BlockchainContext);

  useEffect(() => {
    explorer
      .on(blockchain)
      .slp.token(token_address)
      .then((d:any) => {
        setToken(d);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-4 text-black dark:text-white">
      <div className="mt-12 mb-4">
        <div className="flex">
          <img
            src={token.tokenDetails.documentUri}
            className="w-16 rounded-full border-secondary mr-3 bg-secondary dark:bg-dark-secondary dark:border-dark-secondary"
            alt=""
          />
          <div>
            <span className="text-3xl text-black dark:text-white">Token Details</span>
            <span className="text-xl text-gray-500 ml-2 pb-1">
              {token.tokenDetails.name}
            </span>
            <br />
            <span>{token.type}</span>
          </div>
        </div>
      </div>
      <div className="sm:grid sm:grid-cols-2 sm:space-x-3 space-y-3 sm:space-y-0">
        <div className="rounded mt-4 bg-tertiary">
          <table className="w-full">
            <tbody>
              <tr className="bg-quartish dark:bg-dark-quartish dark:hover:bg-dark-hoverish dark:even:bg-dark-evenish hover:bg-hoverish cursor-pointer even:bg-evenish w-full h-14 z-10">
                <td className="pl-4 w-1/4 text-center font-black">
                  Token address
                </td>
                <td><LongWallet id={token.tokenDetails.tokenIdHex}/></td>
              </tr>
              <tr className="bg-quartish dark:bg-dark-quartish dark:hover:bg-dark-hoverish dark:even:bg-dark-evenish hover:bg-hoverish cursor-pointer even:bg-evenish w-full h-14 z-10">
                <td className="pl-4 w-1/4 text-center font-black">Decimals</td>
                <td>{token.tokenDetails.decimals}</td>
              </tr>
              <tr className="bg-quartish dark:bg-dark-quartish dark:hover:bg-dark-hoverish dark:even:bg-dark-evenish hover:bg-hoverish cursor-pointer even:bg-evenish w-full h-14 z-10">
                <td className="pl-4 w-1/4 text-center font-black">Supply</td>
                <td>{token.tokenStats.qty_token_circulating_supply} {token.tokenDetails.symbol}</td>
              </tr>
              <tr className="bg-quartish dark:bg-dark-quartish dark:hover:bg-dark-hoverish dark:even:bg-dark-evenish hover:bg-hoverish cursor-pointer even:bg-evenish w-full h-14 z-10">
                <td className="pl-4 w-1/4 text-center font-black">
                  Properties
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="rounded mt-4 bg-tertiary">
        <table className="w-full">
            <tbody>
              <tr className="bg-quartish dark:bg-dark-quartish dark:hover:bg-dark-hoverish dark:even:bg-dark-evenish hover:bg-hoverish cursor-pointer even:bg-evenish w-full h-14 z-10">
                <td className="pl-4 w-1/4 text-center font-black">
                  Owner address
                </td>
                <td><LongWallet id={token.tokenDetails.ownerAddress}/></td>
              </tr>
              <tr className="bg-quartish dark:bg-dark-quartish dark:hover:bg-dark-hoverish dark:even:bg-dark-evenish hover:bg-hoverish cursor-pointer even:bg-evenish w-full h-14 z-10">
                <td className="pl-4 w-1/4 text-center font-black">Timestamp</td>
                <td><Timestamp value={token.tokenDetails.genesis_timestamp} /></td>
              </tr>
              {/* <tr className="bg-quartish dark:bg-dark-quartish dark:hover:bg-dark-hoverish dark:even:bg-dark-evenish hover:bg-hoverish cursor-pointer even:bg-evenish w-full h-14 z-10">
                <td className="pl-4 w-1/4 text-center font-black">Block</td>
                <td><BlockId id={token.tokenStats.block_created_id}/></td>
              </tr> */}
              {/* <tr className="bg-quartish dark:bg-dark-quartish dark:hover:bg-dark-hoverish dark:even:bg-dark-evenish hover:bg-hoverish cursor-pointer even:bg-evenish w-full h-14 z-10">
                <td className="pl-4 w-1/4 text-center font-black">
                  Transaction
                </td>
                <td><ShortId id={token.tokenStats.creation_transaction_id}/></td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
      <Tab.Group>
        <div className="rounded bg-tertiary dark:bg-dark-tertiary drop-shadow-lg mt-2">
          <div className="w-full sm:w-2/4 mt-4">
            <Tab.List className="flex p-1 space-x-1 bg-tertiary dark:bg-dark-tertiary rounded-xl">
              <Tab key="txs" className={tabClass}>
                Transactions
              </Tab>
              <Tab key="holders" className={tabClass}>
                Holders
              </Tab>
              <Tab key="meta" className={tabClass}>
                Meta details
              </Tab>
              <Tab key="analytics" className={tabClass}>
                Analytics
              </Tab>
            </Tab.List>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-4 text-black dark:text-white rounded drop-shadow-lg bg-tertiary dark:bg-dark-tertiary">
          <Tab.Panels className="mt-2">
            <Tab.Panel key="txs" className="text-black dark:text-white"><TokenTransactionsTable token_id={token_address}/></Tab.Panel>
            <Tab.Panel key="holders" className="text-black dark:text-white"><TokenHoldersTable token_id={token_address}/></Tab.Panel>
            <Tab.Panel key="meta" className="text-black dark:text-white">
            <TokenMetadataTable token_id={token_address}/>
            </Tab.Panel>
            <Tab.Panel key="analytics" className="text-black dark:text-white">
                
            </Tab.Panel>
          </Tab.Panels>
        </div>
      </Tab.Group>

      
    </div>
  );
}

export default TokenView