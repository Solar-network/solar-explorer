import React from 'react';
import LatestBlocksTable from '../components/tables/LatestBlocksTable';

class LatestBlocks extends React.Component {

    render() {
        return (
            <div className="max-w-7xl mx-auto mt-4 text-white bg-tertiary rounded">
                <LatestBlocksTable/>
            </div>
        );
    }
    
}
export default LatestBlocks;