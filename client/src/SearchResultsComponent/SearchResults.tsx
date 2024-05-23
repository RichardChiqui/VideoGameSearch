import React, { useEffect } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SearchResultsItem from './SearchResultItem';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import './searchResultsStyles.css';
import { useSelector } from 'react-redux';
import { RootState } from '../Store';
import { MainFiltersEnum } from '../ENUMS';
import { loadUsers } from '../FetchCalls/loadUsers';
import { Email } from '@mui/icons-material';

export type  SearchResultsItemType = {
    id: number;
    name: string;
  }
  interface UserData {
    id:number;
    name: string;
    email:string
  }
interface SearchResultsProps {
    buttonClicked: boolean; // Define the type of the buttonClicked prop
}
export default function SearchResults({ buttonClicked }: SearchResultsProps){

    const mainFilter = useSelector((state:RootState) => state.mainfilter.value);
    console.log("Testing if this actuall worked:" + mainFilter);

    
    const [peoplesList, setPeoplesList] = React.useState<UserData[]>([]);
    
    const [successFullyLoadedUsers, setSuccessFullyLoadedUsers] = React.useState(false)

    const categoriesList: SearchResultsItemType[] = [
        { id: 1, name: "OverWatch" },
        { id: 2, name: "Fornite" },
        { id: 3, name: "Modern Warfare 2" },
        { id: 4, name: "Avatar"}
      ];
      //let peoplesList: UserData[] = [];
      const filterValue = buttonClicked ? "brightness(50%)" : "brightness(100%)";
      console.log("What is main fitler:" + mainFilter);
      useEffect(() => {
        if(mainFilter === MainFiltersEnum.People) {
            console.log("Interesting, do we go in here");
            const fetchUsers = async () => {
                try {
                    const usersData = await loadUsers();
                    console.log("Success loading users");
                    if (usersData.users.length <= 0) {
                        console.log("No data received from the server");
                    } else {
                        console.log("Data was found, trying to place into list");
                        const formattedUsers = usersData.users.map((user: UserData) => ({
                            id: user.id,
                            email : user.email,
                            name: user.name 
                        }));
                        console.log("Formatted users list:", formattedUsers);
                        setPeoplesList(formattedUsers);
                        setSuccessFullyLoadedUsers(true);
                    }
                } catch (err) {
                    console.log("Failed to load users:", err);
                }
            };

            fetchUsers();
        }
    }, [mainFilter]);
      
      const style= {filter: filterValue};
      console.log("This wont work will it:" + successFullyLoadedUsers );
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
       {successFullyLoadedUsers? peoplesList.map((item : UserData) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card style={{ minHeight: '300px', backgroundColor: '#ADD8E6' }}>
              <CardContent>
                <Typography variant="h5">{item.name}</Typography>
                {/* You can place the SearchResultsItem here if it contains more complex structure */}
                <SearchResultsItem  key={item.id} gameName={item.email} />
              </CardContent>
            </Card>
          </Grid>
        )) : categoriesList.map((item : SearchResultsItemType) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card style={{ minHeight: '300px', backgroundColor: '#ADD8E6' }}>
              <CardContent>
                <Typography variant="h5">{item.name}</Typography>
                {/* You can place the SearchResultsItem here if it contains more complex structure */}
                <SearchResultsItem  key={item.id} gameName={item.name} />
              </CardContent>
            </Card>
          </Grid>
        )) }
      </Grid>
      </div>
     
         
    )

   

}