import React from 'react';
import DropDownItems from './DropDownCat';
import DropDownMenu from './DropDownMenu';


export type  GenreCategory = {
    id: number;
    name: string;
  }
export default function CategoriesNavBar(){
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
    return(
        <div className="categories-bar">
           
           <div className='category-container'>

                <div className='dropDownButton'>
                    <button className='catButtons' onClick={displayDropDown} onBlur={(e: React.FocusEvent<HTMLButtonElement>): void => dismissHandler(e)}>Genre</button>
                    {show && <DropDownMenu classNameProp='' categories={categoriesList}/>}
                </div>
                
              
              
                <button className='catButtons'>Newest</button>
                <button className='catButtons'>Popular</button>
           </div>
            

           
            

        </div>
    )

   

}