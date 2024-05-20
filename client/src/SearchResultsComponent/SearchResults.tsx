import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SearchResultsItem from './SearchResultItem';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import './searchResultsStyles.css';

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
        { id: 4, name: "Avatar"}
      ];
      const filterValue = buttonClicked ? "brightness(50%)" : "brightness(100%)";
      const style= {filter: filterValue};
    return(
      // <div className='search-results-container' style={style}>
        // <div className='search-results'>
                    
        //     {categoriesList.map(item => (
        //             <SearchResultsItem key={item.id} gameName={item.name} />
        //         ))}

        //   </div>
      // </div>
      <div className='searchresultscontainer'>
        
        <Grid container spacing={2} style={style}>
        {categoriesList.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card style={{ minHeight: '300px', backgroundColor: '#ADD8E6' }}>
              <CardContent>
                <Typography variant="h5">{item.name}</Typography>
                {/* You can place the SearchResultsItem here if it contains more complex structure */}
                <SearchResultsItem  key={item.id} gameName={item.name} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      </div>
     
         
    )

   

}