import { Tab } from "@headlessui/react";
import React from "react";
import { BsCheck, BsFillPauseFill, BsX } from "react-icons/bs";
import { BlockchainContext } from "../BlockchainContext";
import DelegatesTable from "../components/tables/DelegatesTable";
import explorer from "../lib/api";
import { Blockchains } from "../lib/blockchains";
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function isForging(time: string): number {
  var d = new Date();
  var current = d.getTime();
  var previous = Date.parse(time);

  var elapsed = (current - previous) / 1000;

  if (elapsed < 16 * 60) {
    return 0;
  } else if (elapsed < 24 * 60) {
    return 1;
  } else {
    return 2;
  }
}
class Delegates extends React.Component<
  {},
  {
    forging_status: { missed: number; forging: number; notforging: number };
    height: number;
    delegates_count:number
  }
> {
  static contextType = BlockchainContext;

  constructor(props: any) {
    super(props);
    this.state = {
      forging_status: { missed: 0, notforging: 0, forging: 0 },
      height: 0,
      delegates_count: 51
    };
  }
  componentDidMount() {
    let blockchain = this.context;
    let missed = 0,
      forging = 0,
      notforging = 0;
      let delegates_count = Blockchains.find((bc) => bc.networks.find((network: { subdomain: any; }) => network.subdomain == blockchain)).delegates
      this.setState({delegates_count:delegates_count});
    explorer
      .on(blockchain)
      .core.api("delegates")
      .all({ limit: delegates_count})
      .then((d) => {
        d.body.data.map((delegate) => {
          switch (isForging(delegate.blocks.last.timestamp.human)) {
            case 0:
              forging += 1;
              break;
            case 1:
              missed += 1;
              break;
            case 2:
              notforging += 1;
              break;
          }
        });
        this.setState({
          forging_status: {
            forging: forging,
            missed: missed,
            notforging: notforging,
          },
        });
      });
    let getHeight = () => {
      explorer
        .on(blockchain)
        .core.get("blockchain")
        .then((response) => {
          this.setState({ height: parseInt(response.body.data.block.height) });
        });
    };
    getHeight();
    setInterval(getHeight, 8000);
  }
  render() {
    return (
      <div>
        <div className="relative h-[200px] bg-hoverish< dark:bg-dark-evenish -z-10"></div>

        <div className="max-w-7xl mx-auto text-black dark:text-white mt-[-200px]">
          <div className="my-12 text-3xl">Delegates</div>
          <div className="sm:grid sm:grid-cols-4 gap-4">
            <div className="sm:grid sm:grid-cols-3 sm:col-span-3 sm:divide-x-2 p-3 sm:divide-secondary sm:dark:divide-dark-secondary bg-tertiary dark:bg-dark-tertiary sm:rounded">
              <div className="flex">
                <div className="rounded-full bg-secondary dark:bg-dark-secondary p-3 my-3 items-center">
                  <BsCheck className="text-2xl" />
                </div>
                <div className="ml-4 my-2">
                  <div className="">Forging</div>
                  <div className="text-greenish text-2xl">
                    {this.state.forging_status.forging}
                  </div>
                </div>
              </div>
              <div className="flex sm:px-3">
                <div className="rounded-full bg-secondary dark:bg-dark-secondary p-3 my-3 items-center">
                  <BsFillPauseFill className="text-2xl" />
                </div>
                <div className="ml-4 my-2">
                  <div className="">Missed</div>
                  <div className="text-greenish text-2xl">
                    {this.state.forging_status.missed}
                  </div>
                </div>
              </div>
              <div className="flex sm:px-3">
                <div className="rounded-full bg-secondary dark:bg-dark-secondary p-3 my-3 items-center">
                  <BsX className="text-2xl" />
                </div>
                <div className="ml-4 my-2">
                  <div className="">Not forging</div>
                  <div className="text-greenish text-2xl">
                    {this.state.forging_status.notforging}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-tertiary dark:bg-dark-tertiary rounded p-3 mt-3 sm:mt-0">
              <div className="text-greenish text-3xl text-center">
                {this.state.height % this.state.delegates_count}/{this.state.delegates_count}
              </div>
              <div className="text-center">Current round</div>
            </div>
          </div>

          <div>
            <Tab.Group>
              <div className="w-full sm:w-1/2 justify-self-start mt-5">
                <Tab.List className="flex p-1 space-x-1 bg-tertiary dark:bg-dark-tertiary rounded-xl border-hoverish border drop-shadow-xl dark:border-0">
                  <Tab
                    key="active"
                    className={({ selected }) =>
                      classNames(
                        "w-full py-1 text-sm leading-5 font-medium text-black dark:text-white rounded-lg",
                        "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60",
                        selected
                          ? "bg-secondary dark:bg-dark-secondary shadow"
                          : "text-blue-100 hover:bg-white/[0.12] hover:text-black dark:text-white"
                      )
                    }
                  >
                    Active
                  </Tab>
                  <Tab
                    key="standby"
                    className={({ selected }) =>
                      classNames(
                        "w-full py-1 text-sm leading-5 font-medium text-black dark:text-white rounded-lg",
                        "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60",
                        selected
                          ? "bg-secondary dark:bg-dark-secondary shadow"
                          : "text-blue-100 hover:bg-white/[0.12] hover:text-black dark:text-white"
                      )
                    }
                  >
                    Standby
                  </Tab>
                  <Tab
                    key="resigned"
                    className={({ selected }) =>
                      classNames(
                        "w-full py-1 text-sm leading-5 font-medium text-black dark:text-white rounded-lg",
                        "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60",
                        selected
                          ? "bg-secondary dark:bg-dark-secondary shadow"
                          : "text-blue-100 hover:bg-white/[0.12] hover:text-black dark:text-white"
                      )
                    }
                  >
                    Resigned
                  </Tab>
                </Tab.List>
              </div>
              <Tab.Panels className="mt-4 rounded bg-tertiary dark:bg-dark-tertiary">
                <Tab.Panel key="active" className="text-black dark:text-white">
                  <DelegatesTable status="active" />
                </Tab.Panel>
                <Tab.Panel key="standby" className="text-black dark:text-white">
                  <DelegatesTable status="standby" />
                </Tab.Panel>
                <Tab.Panel
                  key="resigned"
                  className="text-black dark:text-white"
                >
                  <DelegatesTable status="resigned" />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    );
  }
}
export default Delegates;
