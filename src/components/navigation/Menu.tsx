import React from "react";
import i18n from "../../i18n/en.json";
import { BlockchainContext } from '../../BlockchainContext';
import { BsFillSunFill, BsSliders } from "react-icons/bs";
import { Blockchains } from "../../lib/blockchains";
import BlockchainMenu from './BlockchainMenu'
import SettingsMenu from "./SettingsMenu";
import { BiSearch } from "react-icons/bi";
import { MdKeyboardArrowDown } from "react-icons/md";
import Search from './../Search'
const { lang } = i18n;
const { navigation } = lang;

function toggleTheme() {
  if (localStorage.theme != 'dark') {
    document.documentElement.classList.add('dark')
    localStorage.theme = 'dark'
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.removeItem('theme')
  }
}

class Menu extends React.Component<{}, any> {
static contextType = BlockchainContext;

  constructor(props:any) {
    super(props)
    this.state = {
      showModal:false,
      showMobileMenu: false,
      query: ""
    }
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  go() {

  }

  handleSearch(event:React.FormEvent<HTMLInputElement>) {
    this.setState({query: event.currentTarget.value})
  }

  setModalShow(show: boolean) {
    this.setState({showModal: show});
  }

  toggleMobileMenu() {
    this.setState({showMobileMenu: !this.state.showMobileMenu});
  }

  render() {
    let blockchain = this.context;

    return (
      <div>
        <nav className="bg-greenish dark:bg-dark-tertiary drop-shadow-lg">
          <div className="max-w-7xl mx-auto py-2">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                  onClick={this.toggleMobileMenu}
                >
                  <span className="sr-only">Open main menu</span>
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>

                  <svg
                    className="hidden h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex-1 flex items-left justify-left ml-5 pl-6 sm:ml-0 sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <img
                    className="block lg:hidden h-12 w-auto"
                    src="/assets/img/logo-dark.png"
                    alt="Workflow"
                  />
                  <div className="rounded">
                  <img
                    className="hidden lg:block h-8 w-auto"
                    src="/assets/img/logo-dark.png"
                    alt="Workflow"
                  />
                  </div>
                </div>
                <div className="ml-5 hidden sm:inline">
                <input type="text" className=" appearance-none border-none rounded w-full py-2 px-3 text-black dark:text-white bg-secondary dark:bg-dark-secondary focus:outline-none " id="searchInput" placeholder="Search in the blockchain..." onChange={this.handleSearch} />
                <Search query={this.state.query} />
                </div>
              </div>              
<div>

<div className="py-2 none hidden sm:inline">
      <div className="mx-auto w-fit space-x-3">
              {navigation.links.map((hname, href) => (
                    <a
                    href={hname.route.url}
                    className="text-[#ffffff] py-2 rounded-md dark:hover:bg-dark-hoverish px-2"
                    aria-current="page"
                    onClick={this.go}
                    >
                  {hname.label}
                </a>
              ))}
            </div>
      </div>
</div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
<BlockchainMenu/>

                <div className="ml-3 relative">
                  <div>
                    <button onClick={toggleTheme} className="text-white text-1xl"><BsFillSunFill  /></button>
                    
                    
                  </div>
                </div>
                <div className="ml-3 relative">
                <SettingsMenu />
                </div>

              </div>
            </div>
          </div>
<div className="none">
<div className="py-2 inline sm:hidden">
<div className="  flex justify-content-center drop-shadow-lg mx-2">
                <input type="text" className="rounded appearance-none grow border-none mr-2 w-1/2 py-2 px-3 text-gray-600 dark:text-gray-400 bg-tertiary dark:bg-dark-tertiary hover:bg-hoverish dark:hover:bg-dark-hoverish focus-within:hover:bg-secondary focus-within:placeholder-transparent focus-within:bg-secondary dark:focus-within:bg-dark-hoverish focus:outline-none " placeholder="Search in the blockchain..." />
                
        </div>
  </div>
          <div className={this.state.showMobileMenu? 'inline sm:hidden' : 'hidden sm:hidden'} id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.links.map((hname, href) => (
              <a
              href={hname.route.url}
              className="text-white block px-3 py-2 rounded-md text-base font-medium"
              aria-current="page"
              
              onClick={this.go}
            >
              {hname.label}
            </a>
              ))}
              
            </div>
          </div>
</div>
        </nav>
        {this.state.showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none dark:text-white"
          >
            <div className="relative w-auto my-6 mx-auto max-w-md">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg  relative flex flex-col w-full bg-white  dark:bg-tertiary outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5  rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Choose your blockchain
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black dark:text-white opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => this.setModalShow(false)}
                  >
                    <span className="bg-transparent text-black dark:text-white opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  {Object.values(Blockchains).map((blockchain) => (
                    <div className="hover:bg-primary text-white py-2 px-4 grid grid-cols-6 gap-4 cursor-pointer">
                      <img src={blockchain.logo} className="h-6 px-2 col-start-1" alt="" />
                      <span className="text-lg col-start-2">{blockchain.title}</span>
                      <div className="col-start-5 col-end-7">
                        {Object.keys(blockchain.networks).map((network) => (
                          <a href="#" className="ml-3 uppercase hover:text-greenish font-bold">{network}</a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 rounded-b">
                  <button
                    className="text-greenish background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => this.setModalShow(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      
      </div>
    );
  }
}
export default Menu;
