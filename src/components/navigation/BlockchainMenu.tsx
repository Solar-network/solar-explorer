import { Menu } from '@headlessui/react'
import { useContext } from 'react'
import { BlockchainContext } from '../../BlockchainContext'
import { Blockchains } from '../../lib/blockchains'



export function BlockchainMenu() {
  let current_blockchain = useContext(BlockchainContext)

  function handleNetwork(subdomain:string) {
    var windost = window.location.toString();
        var opens = windost.replace(`/${current_blockchain}/`, `/${subdomain}/`);
        window.location.replace(opens)
  }

  console.log(current_blockchain)
  return (
    <div className="relative inline-block text-left">
      <div className="border border-[#ffffff] p-1 rounded  text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 py-1 px-2 focus:ring-white flex font-bold">
      {Blockchains.find((blockchain) => blockchain.networks.find((network) => network.subdomain == current_blockchain)).networks.find((network) => network.subdomain == current_blockchain).title}
      </div>
    </div>
  )
}

export default BlockchainMenu