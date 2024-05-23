import React from 'react';
import { Link } from 'react-router-dom';
import './filtersNavBar.css';            

interface SignUpForm {
    username: string;
    password:String;
    email:String;

}

export default function FiltersNavBar(){

    return(
        <div className='leftsidefilters'>
            <div style={{ textAlign: 'left' }}>
                <h2>Filters</h2>
            </div>
    
            <div className='filterTypes'>
                <h5>Popular</h5>
            </div>
            <div className='filterTypes'>
                <h5>New</h5>
            </div>
            <div className='filterTypes'>
                <h5>Platform</h5>
            </div>
              
                
                
           
           
            
            

        </div>
    )
   

}