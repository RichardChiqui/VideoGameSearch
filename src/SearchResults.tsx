import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SearchResultsItem from './SearchResultItem';

export type  SearchResultsItemType = {
    id: number;
    name: string;
  }
export default function SearchResults(){

    const categoriesList: SearchResultsItemType[] = [
        { id: 1, name: "OverWatch" },
        { id: 2, name: "Fornite" },
        { id: 3, name: "Modern Warfare 2" },
      ];
    return(
         <div className='search-results'>
            
            {categoriesList.map(item => (
                    <SearchResultsItem key={item.id} gameName={item.name} />
                ))}

        </div>
    )

   

}