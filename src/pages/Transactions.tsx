import React from "react";
import { BlockchainContext } from "../BlockchainContext";
import explorer from "../lib/api";
import TransactionsTable from "../components/tables/TransactionsTable";
import Select from "react-select";
import { Menu, Tab } from "@headlessui/react";
import LatestBlocksTable from "../components/tables/LatestBlocksTable";
import { MdKeyboardArrowDown } from "react-icons/md";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const TransactionTypeSelectStyle = {
    control: (provided:any) => ({
        ...provided,
        width: 300,
        border: 'none',
        visibility: 'hidden'
      }),
}

class Transactions extends React.Component<{}, any> {
  static contextType = BlockchainContext;

  constructor(props: any) {
    super(props);
    this.state = {
      transactions: [],
      transactions_types: [
        {
          value: "Transfer",
          label: "Transfer"
        }
      ],
      transaction_type: -1
    };
    this.handleType = this.handleType.bind(this);

  }

  componentDidMount() {
    let blockchain = this.context
    let bf_tt: { value: number; label: string; }[] = [];
    bf_tt.push({value: -1, label: "All transactions"})
    let index_type = 0;
    explorer.on(blockchain).core
      .api("transactions")
      .types()
      .then((t) => {
        Object.keys(t.body.data[1]).map((tt) => {
            bf_tt.push({value: index_type, label: tt})
            index_type++
        })
        console.log(bf_tt)
        this.setState({transactions_types: bf_tt})
      });
  }

  handleType(type: number) {

        this.setState({transaction_type: type})

  }

  render() {
    let blockchain = this.context;

    return (
      <div className='max-w-7xl mx-auto'>
        <div className='my-12'>
          <span className='text-3xl text-black dark:text-white'>Latest transactions</span>
        </div>
        <Tab.Group>
          <div className='mt-2 flex'>
            <div className='w-96 justify-self-start'>
              <Tab.List className='flex p-1 space-x-1 bg-tertiary dark:bg-dark-tertiary rounded-xl border-hoverish border drop-shadow-lg dark:border-0'>
                <Tab
                  key='txs'
                  className={({ selected }) =>
                    classNames(
                      'w-full py-1 text-sm leading-5 font-medium text-black dark:text-white rounded-lg',
                      'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                      selected
                        ? 'bg-secondary dark:bg-dark-secondary shadow'
                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-black dark:text-white'
                    )
                  }
                >
                  Latest transactions
                </Tab>
                <Tab
                  key='blocks'
                  className={({ selected }) =>
                    classNames(
                      'w-full py-1 text-sm leading-5 font-medium text-black dark:text-white rounded-lg',
                      'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                      selected
                        ? 'bg-secondary dark:bg-dark-secondary shadow'
                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-black dark:text-white'
                    )
                  }
                >
                  Latest blocks
                </Tab>
              </Tab.List>
            </div>
            <div className='grow'></div>
            <div className=''>
              <Menu
                as='div'
                className='relative inline-block text-left rounded-xl border-hoverish border drop-shadow-xl dark:border-0 z-10'
              >
                <Menu.Button className=' bg-secondary dark:bg-dark-secondary p-1 rounded  text-black dark:text-white bg-white dark:bg-dark-secondary focus:outline-none  py-1 px-2 focus:ring-white flex font-bold'>
                  {this.state.transaction_type >= 0
                    ? this.state.transactions_types[this.state.transaction_type + 1].label
                    : 'All transactions'}{' '}
                  <MdKeyboardArrowDown className='mt-1 ml-2' />
                </Menu.Button>
                <Menu.Items className='absolute right-0  w-72 mt-2 origin-top-right bg-white  rounded drop-shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-10'>
                  {this.state.transactions_types.map((ttype: any) => (
                    <Menu.Item
                      onClick={() => {
                        this.handleType(ttype.value)
                      }}
                    >
                      <div className='h-15 px-2 py-2 bg-secondary dark:bg-dark-secondary text-black dark:text-white flex cursor-pointe br hover:bg-tertiary dark:hover:bg-dark-tertiary cursor-pointer'>
                        <span className='grow'>{ttype.label}</span>
                      </div>
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Menu>
            </div>
          </div>
          <div className=' text-black dark:text-white rounded bg-tertiary dark:bg-dark-tertiary border-hoverish dark:border-0 border drop-shadow-xl mt-2'>
            <Tab.Panels className='mt-2'>
              <Tab.Panel key='txs' className='text-black dark:text-white'>
                <TransactionsTable type={this.state.transaction_type} />
              </Tab.Panel>
              <Tab.Panel key='blocks' className='text-black dark:text-white'>
                <LatestBlocksTable />
              </Tab.Panel>
            </Tab.Panels>
          </div>
        </Tab.Group>
      </div>
    )
  }
}
export default Transactions;
