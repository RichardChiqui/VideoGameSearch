import React from 'react';
import DropDownItems from './DropDownCat';
import { GenreCategory } from './CategoriesNavBar';

interface ChildProps {
    classNameProp: string;
    categories: GenreCategory[];

}

export default function DropDownMenu(props: ChildProps){
    const [show, setShow] = React.useState(false)

    function displayDropDown(){
        setShow(!show);
    }

    const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
        if (event.currentTarget === event.target) {
            setShow(false);
        }
      };

    const categoriesList = [
        { id: 1, name: "RPG" },
        { id: 2, name: "Action" },
        { id: 3, name: "Shooter" },
      ];
    return(
            <div className={props.classNameProp}>
              {props.categories.map(item => (
                    <DropDownItems key={item.id} catType={item.name} />
                ))}
           
          
         

           
            

        </div>
    )

   

}