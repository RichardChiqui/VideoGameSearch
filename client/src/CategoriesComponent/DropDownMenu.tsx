import React from 'react';
import DropDownItems from './DropDownCat';
import { GenreCategory } from './CategoriesNavBar';
import './categoriesStyles.css';

interface ChildProps {
    classNameProp: string;
    categories: GenreCategory[];

}

export default function DropDownMenu(props: ChildProps){

    return(
            <div className={props.classNameProp}>
              {props.categories.map(item => (
                    <DropDownItems key={item.id} catType={item.name} />
                ))}
           
          
         

           
            

        </div>
    )

   

}