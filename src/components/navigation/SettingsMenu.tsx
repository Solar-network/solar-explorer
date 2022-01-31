import { Menu } from '@headlessui/react'
import { useContext } from 'react'
import { BsSliders } from 'react-icons/bs'
import { useState } from "react";
export function SettingsMenu() {
    const [currency, setCurrency] = useLocalStorage("currency", localStorage.getItem("currency")? localStorage.getItem("currency") : "eur");
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className=" p-1 rounded  text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 py-1 px-2 focus:ring-white flex font-bold">
      {currency.toUpperCase()}
    </Menu.Button>
      <Menu.Items className="absolute right-0 mt-2 origin-top-right rounded shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none drop-shadow z-10">
        {
            ["eur", "usd", "gbp", "jpy", "chf", "cad"].map((currency) => (
                <Menu.Item>
                    <div className="h-15 px-2 py-2 bg-primary dark:bg-dark-primary even:bg-evenish dark:even:bg-dark-evenish text-black dark:text-white flex cursor-pointer hover:bg-hoverish dark:hover:bg-dark-hoverish" onClick={() => {setCurrency(currency);document.getElementById("update_currency").click();}}>
                        <span className="text-lg grow">{currency.toUpperCase()}</span>
                    </div>                          
                </Menu.Item>
            ))
        }
      </Menu.Items>
    </Menu>
  )
}

function useLocalStorage(key:string, initialValue:string) {
    const [storedValue, setStoredValue] = useState(() => {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.log(error);
        return initialValue;
      }
    });
    const setValue = (value:any) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, value);
      } catch (error) {
        console.log(error);
      }
    };
  
    return [storedValue, setValue];
  }

export default SettingsMenu