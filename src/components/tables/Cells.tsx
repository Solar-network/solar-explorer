import moment from "moment";
import Tooltip from "rc-tooltip";
import { BsCheck2All, BsFillEyeFill, BsClock } from "react-icons/bs";
import { FiCopy } from "react-icons/fi";
import { render } from "@testing-library/react";
import { BiRightArrowAlt } from "react-icons/bi";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import { RiUserReceived2Line } from "react-icons/ri";
import { useContext } from "react";
import { BlockchainContext } from "../../BlockchainContext";
import { Blockchains } from "../../lib/blockchains";
import explorer from "../../lib/api";
import { AiOutlineTeam } from "react-icons/ai";
type ShortIdProps = { id: string };
export const ShortId = ({ id }: ShortIdProps) => {
  let blockchain = useContext(BlockchainContext)
  return (
  <div className="content-center w-full flex px-2 justify-center">
    
    <a href={`/transactions/${id}`}><BsFillEyeFill className="mx-auto text-greenish" /></a>
  </div>
);}

type ShortCopyProps = { text: string };
export const ShortCopy = ({ text }: ShortCopyProps) => {
  let blockchain = useContext(BlockchainContext)
  return (
  <div className="text-greenish flex content-center">
  <div className="mx-auto `${className}`">
  <FiCopy className="text-gray-600 dark:text-gray-400 mr-1 pt-1 mb-2 hover:text-white inline-block" onClick={() => {copytoClipboard(text)}} />
  <a href="#" className="text-greenish hover:text-greenish hover:underline mb-1">{`${text}`}</a>
  </div>
</div>
);
  }

type BlockIdProps = { id: string, className?: string };
export const BlockId = ({ id, className = "" }: BlockIdProps) => {
  let blockchain = useContext(BlockchainContext)
  return (
  <div className={`${className} w-full flex`}>
    <a href={`/blocks/${id}`} className="text-greenish hover:text-greenish hover:underline">{`${id.substr(0, 10)}...${id.substr(-10)}`}</a>
  </div>
);}

type TokenIdProps = { id: string, className?: string };
export const TokenId = ({ id, className = "" }: TokenIdProps) => {
  let blockchain = useContext(BlockchainContext)
  return (
  <div className={`${className} w-full flex`}>
    <a href={`/token/${id}`} className="text-greenish hover:text-greenish hover:underline">{`${id.substr(0, 10)}...${id.substr(-10)}`}</a>
  </div>
);}

export const TxArrow = () => {
  let blockchain = useContext(BlockchainContext)
  return (
  <div className="rounded-full bg-[#e4e7ee] dark:bg-dark-hoverish items-center">
    <BiRightArrowAlt className="inline-block mb-1 text-greenish"/>
  </div>
);}

type ConfirmsProps = { confirms: number };
export const Confirms = ({ confirms }: ConfirmsProps) => {
  if (confirms > 51) {
    return <span className="dark:text-green-300 text-green-700">
        <BsCheck2All className="inline-block  mr-1 mb-1" />
        {confirms}
      </span>
    
  } else {
    return <span className="dark:text-yellow-300 text-yellow-600">
        <BsClock className="inline-block mr-1 mb-1"/>
        {confirms}
      </span>
    
  }
};

type ShortWalletProps = { id: string, multi?: Array<any>, className?: string };
function copytoClipboard(id:string) {
  if (!navigator.clipboard) {
    // Clipboard API not available
    return
  }
  try {
    navigator.clipboard.writeText(id)
  } catch (err) {
    console.error('Failed to copy!', err)
  }
}
export const ShortWallet = ({ id, multi }: ShortWalletProps) => {
  let blockchain = useContext(BlockchainContext)
  let known_wallet = explorer.on(blockchain).known_wallets().find((wallet) => wallet.address == id) 
  return (
    <div className="text-greenish flex content-center">
    <div className="mx-auto `${className}`">
    
    {multi.length == 0 && 
    <div>{known_wallet? <AiOutlineTeam className="text-greenish inline-block"/> : <FiCopy className="text-gray-600 dark:text-gray-400 mr-1 pt-1 mb-2 hover:text-white inline-block" onClick={() => {copytoClipboard(id)}} />} <a href={`/wallet/${id}`} className="text-greenish hover:text-greenish hover:underline mb-1">{known_wallet? known_wallet.name : `${id.substr(0, 5)}...${id.substr(-5)}`}</a></div>}
    {multi.length>0 &&
    <span className="text-greenish hover:underline mb-1"> <RiUserReceived2Line className="inline-block"/> {multi.length} recipients</span>
    }
    </div>
  </div>
  )
};

ShortWallet.defaultProps = {multi: []}

export const ShortTx = ({ id }: ShortWalletProps) => {
  let blockchain = useContext(BlockchainContext)
  return (
  <div className="text-greenish flex content-center">
    <div className="mx-auto `${className}`">
    <FiCopy className="text-gray-600 dark:text-gray-400 mr-1 pt-1 mb-2 hover:text-white inline-block" onClick={() => {copytoClipboard(id)}} />
    <a href={`/transactions/${id}`} className="text-greenish hover:text-greenish hover:underline mb-1">{`${id.substr(0, 5)}...${id.substr(-5)}`}</a>
    </div>
  </div>
);}



export const LongWallet = ({ id, className }: ShortWalletProps) => {
  let blockchain = useContext(BlockchainContext)
  return (
  <div className="text-greenish flex content-center">
    <div className={className}>
    <FiCopy className="text-gray-600 dark:text-gray-400 mr-1 pt-1 mb-2 hover:text-white inline-block" onClick={() => {copytoClipboard(id)}} />
    <a href={`/wallet/${id}`} className="text-greenish hover:text-greenish hover:underline mb-1 inline-block">{`${id.substr(0, 10)}...${id.substr(-10)}`}</a>
    </div>
  </div>
);}

type AmountProps = { value: number };
export const Amount = ({ value }: AmountProps) => {
  let blockchain = useContext(BlockchainContext)
  let symbol = Blockchains.find((bc) => bc.networks.find((network) => network.subdomain == blockchain)).networks.find((network) => network.subdomain == blockchain).symbol
  return (
  <div className="">{parseFloat(parseFloat((value / 100000000).toString()).toFixed(2).replace(/\.0+$/,'')).toLocaleString("us")} {symbol}</div>
);}

type BoolBadgeProps = { value: boolean };
export const BoolBadge = ({ value }: BoolBadgeProps) => {
  if (value) {
    return <MdCheckCircle className="mx-auto"/>
  } else {
    return <MdCancel className="mx-auto"/>
  }
};

type TimestampProps = { value: string };
export const Timestamp = ({ value }: TimestampProps) => (
  <div>
  {/* <Tooltip placement="right" trigger={['hover']} overlay={<span>{moment(value).toLocaleString()}</span>}>
    <a href="#"></a>
  </Tooltip> */}
  
  <span className="text-gray-600 dark:text-gray-400 italic"><BsClock className="inline-block mr-1 mb-1"/> {moment(value).fromNow()}</span>
    {/* <a data-tip="React-tooltip" className="text-gray-600 dark:text-gray-400 italic" >{moment(value).fromNow()}</a>
    <ReactTooltip place="top" type="dark" effect="float">
      {moment(value).toLocaleString()}
    </ReactTooltip> */}
  </div>
);

export const LongTimestamp = ({ value }: TimestampProps) => (
  <div>
  {/* <Tooltip placement="right" trigger={['hover']} overlay={<span>{moment(value).toLocaleString()}</span>}>
    <a href="#"></a>
  </Tooltip> */}
  
  <span className="text-gray-600 dark:text-gray-400 italic"><BsClock className="inline-block mr-1 mb-1"/> {moment(value).fromNow()} ({moment(value).toLocaleString()})</span>
    
  </div>
);

type SmartBridgeProps = { value: string };
export const SmartBridge = ({ value }: SmartBridgeProps) => {
  if (value) {
    if (isJson(value)) {
      return <a href="#">JSON</a>;
    } else {
      if (value.length > 32) {
        return (
          <span className="text-gray-600 dark:text-gray-400 italic">
            {value.replace(/(\r\n|\n|\r)/gm, "").substr(0, 29) + "..."}
          </span>
        );
      } else {
        return <span className="text-gray-600 dark:text-gray-400 italic">{value.replace(/(\r\n|\n|\r)/gm, "")}</span>;
      }
    }
  } else {
    return <span>-</span>;
  }
};

function isJson(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
