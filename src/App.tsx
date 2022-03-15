import React from "react";

import Menu from "./components/navigation/Menu";

import { Outlet, useParams } from "react-router-dom";

import { BlockchainContext } from "./BlockchainContext";
import { Blockchains } from "./lib/blockchains";

function App() {
  return (
    <div className="App">
      <BlockchainContext.Provider value={"devnet"}><Menu />
      <div className="min-h-screen">
      <Outlet/>
      </div>
      <div className="mt-8 h-12  border-t-2 border-secondary dark:border-dark-secondary text-center text-white">
        <div className="max-w-7xl mx-auto py-6 text-black dark:text-white">
            2022 <a href="https://solar.org" className="text-greenish">Solar Network</a> | Market Data by <a href="https://coingecko.com/" className="text-greenish">coingecko</a> 
        </div>
      </div>
      </BlockchainContext.Provider>
    </div>
  );
}

export default App;
