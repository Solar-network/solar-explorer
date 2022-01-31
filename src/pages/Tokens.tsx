import React from "react";
import TokenTable from "../components/tables/TokenTable";

class Tokens extends React.Component {
  render() {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="my-12">
          <span className="text-3xl text-black dark:text-white">Tokens</span>
        </div>
        <div className="rounded bg-tertiary dark:bg-dark-tertiary text-black dark:text-white">
          <TokenTable />
        </div>
      </div>
    );
  }
}
export default Tokens;
