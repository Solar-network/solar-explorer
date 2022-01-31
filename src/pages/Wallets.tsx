import React from 'react';
import WalletsTable from '../components/tables/WalletsTable';

class Wallets extends React.Component {

    render() {
        return (
            <div className="max-w-7xl mx-auto mt-4">
                <div className="my-12">
                <span className="text-3xl text-black dark:text-white">
                    Wallets
                </span>
                </div>
                <div className="mt-4 text-black dark:text-white bg-tertiary dark:bg-dark-tertiary rounded">
                
                <WalletsTable/>
            </div>
            </div>
            
        );
    }
    
}
export default Wallets;