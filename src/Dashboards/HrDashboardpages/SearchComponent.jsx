import React, { useState } from 'react';
import DasboardNavbar from './DasboardNavbar';

const SearchComponent = () => {
    const [search, setSearch] = useState('');

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    return (
        <div>
            <DasboardNavbar
                isSidebarOpen={true}
                toggleSidebar={() => { }}
                onSearchChange={handleSearchChange}
                searchValue={search}
            />
        </div>
    );
}
export default SearchComponent;