import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

interface DropDownCat {
    catType: string;
    key: number;
  }
export default function DropDownCats(props: DropDownCat){
    return(
         <div className="DropDownCatItem">
            {props.catType}
          
            

        </div>
    )

   

}