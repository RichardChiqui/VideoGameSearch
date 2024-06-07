import React from 'react';
import DropDownItems from './DropDownCat';
import DropDownMenu from './DropDownMenu';

import './categoriesStyles.css';


export type  GenreCategory = {
    id: number;
    name: string;
  }

interface CategoriesNavBarProps {
    buttonClicked: boolean;
  }
export default function CategoriesNavBar({ buttonClicked }: CategoriesNavBarProps){
    const customClassName = "catButtons";

    const [show, setShow] = React.useState(false)

    function displayDropDown(){
        setShow(!show);
   
    }

    const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
        if (event.currentTarget === event.target) {
            setShow(false);
        }
      };

    const categoriesList: GenreCategory[] = [
        { id: 1, name: "RPG" },
        { id: 2, name: "Action" },
        { id: 3, name: "Shooter" },
      ];


    const filterValue = buttonClicked ? "brightness(50%)" : "brightness(100%)";
    const style= {filter: filterValue};
    return(
        <div className="categories-bar"  style={style}>
           
           <div className='category-container'>

               {/* // <div className='catButtons'> */}
                    <button className='catButtons'  onClick={displayDropDown} onBlur={(e: React.FocusEvent<HTMLButtonElement>): void => dismissHandler(e)}>Genre</button>
                    {show && <DropDownMenu classNameProp='dropDownMenu' categories={categoriesList}/>}
               {/* // </div> */}
                <button className='catButtons'>Newest</button>
                <button className='catButtons'>Popular</button>
           </div>
            

           
            

        </div>
    )

   

}