import { Menu } from '@headlessui/react'
import React, { ReactInstance } from 'react'
import { useContext, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { BlockchainContext } from '../BlockchainContext'
import explorer from '../lib/api'
import { Blockchains } from '../lib/blockchains'

import { RefObject } from 'react'


function useEventListener<K extends keyof WindowEventMap>(

  eventName: K,

  handler: (event: WindowEventMap[K]) => void,

): void

function useEventListener<

  K extends keyof HTMLElementEventMap,

  T extends HTMLElement = HTMLDivElement,

>(

  eventName: K,

  handler: (event: HTMLElementEventMap[K]) => void,

  element: RefObject<T>,

): void


function useEventListener<

  KW extends keyof WindowEventMap,

  KH extends keyof HTMLElementEventMap,

  T extends HTMLElement | void = void,

>(

  eventName: KW | KH,

  handler: (

    event: WindowEventMap[KW] | HTMLElementEventMap[KH] | Event,

  ) => void,

  element?: RefObject<T>,

) {

  // Create a ref that stores handler

  const savedHandler = useRef<typeof handler>()


  useEffect(() => {

    // Define the listening target

    const targetElement: T | Window = element?.current || window

    if (!(targetElement && targetElement.addEventListener)) {

      return

    }


    // Update saved handler if necessary

    if (savedHandler.current !== handler) {

      savedHandler.current = handler

    }


    // Create event listener that calls handler function stored in ref

    const eventListener: typeof handler = event => {

      // eslint-disable-next-line no-extra-boolean-cast

      if (!!savedHandler?.current) {

        savedHandler.current(event)

      }

    }


    targetElement.addEventListener(eventName, eventListener)


    // Remove event listener on cleanup

    return () => {

      targetElement.removeEventListener(eventName, eventListener)

    }

  }, [eventName, element, handler])

}


type Handler = (event: MouseEvent) => void


function useOnClickOutside<T extends HTMLElement = HTMLElement>(

  ref: RefObject<T>,

  handler: Handler,

  mouseEvent: 'mousedown' | 'mouseup' = 'mousedown',

): void {

  useEventListener(mouseEvent, event => {

    const el = ref?.current


    // Do nothing if clicking ref's element or descendent elements
    console.log((event.target as HTMLElement).id);
    if (!el || el.contains(event.target as Node) || (event.target as HTMLElement).id == "searchInput") {
        
      return

    }


    handler(event)

  })

}

export function Search(props: {query:string}) {
  let blockchain = useContext(BlockchainContext)
  const [show, toggleShow] = useState(true)
  const [result, setResult] = useState({query: "", searchResult: "", searchType: "", searchLink: ""});

  const ref = useRef(null)


  const handleClickOutside = () => {

    toggleShow(false)
    

  }
  useOnClickOutside(ref, handleClickOutside)

    if (props.query != "" && result.query != props.query) {
        
        console.log(result.searchResult)
        explorer
        .on(blockchain)
        .core.api("wallets").get(props.query).then((d) => {
            if (d.body.data) {
                setResult({query: props.query, searchResult: d.body.data.address, searchType:"Wallet", searchLink: `/${blockchain}/wallet/${d.body.data.address}`});
                toggleShow(true)
            }
        }).catch(() => {
            explorer
            .on(blockchain)
            .core.api("transactions").get(props.query).then((d) => {
                if (d.body.data) {
                    setResult({query: props.query,searchResult: d.body.data.id, searchType:"Transaction", searchLink: `/${blockchain}/transactions/${d.body.data.id}`});
                    toggleShow(true)
                }
            }).catch(() => {
                explorer
                .on(blockchain)
                .core.api("delegates").get(props.query).then((d) => {
                    if (d.body.data) {
                        setResult({query: props.query, searchResult: d.body.data.address, searchType:"Delegate", searchLink: ""});
                        toggleShow(true)
                    }
                }).catch(() => {
                    toggleShow(true)
                });
            });
        }); 
    } else {
        
    }

    
  return (
    <div className={`rounded z-1000 bg-tertiary dark:bg-dark-tertiary drop-shadow-lg mt-2 ${show? 'absolute' :'hidden'}`} ref={ref}>
        {result.query != props.query && props.query != "" &&
        <div className="p-4 py-2 text-center m-3 bg-secondary dark:bg-dark-secondary text-black dark:text-white">No matching records</div>}
        {result.searchResult.length> 0 && result.query == props.query &&
            <div className="text-black dark:text-gray-400 px-4 my-4">
                <div className="border-b border-secondary dark:border-dark-secondary italic">{result.searchType}</div>
                <div className=" py-3"><a className="text-greenish" href={result.searchLink}>{result.searchResult}</a></div>
            </div>
        }
    </div>
  )
}

export default Search