import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SearchResultsItem from './SearchResultItem';

export type  SearchResultsItemType = {
    id: number;
    name: string;
  }
interface SearchResultsProps {
    buttonClicked: boolean; // Define the type of the buttonClicked prop
}
export default function SearchResults({ buttonClicked }: SearchResultsProps){

    const categoriesList: SearchResultsItemType[] = [
        { id: 1, name: "OverWatch" },
        { id: 2, name: "Fornite" },
        { id: 3, name: "Modern Warfare 2" },
        { id: 4, name: "Avator"}
      ];
      const filterValue = buttonClicked ? "brightness(50%)" : "brightness(100%)";
      const style= {filter: filterValue};
    return(
      <div className='search-results-container' style={style}>
        <div className='search-results'>
                    
            {categoriesList.map(item => (
                    <SearchResultsItem key={item.id} gameName={item.name} />
                ))}

          </div>
      </div>
         
    )

   

}