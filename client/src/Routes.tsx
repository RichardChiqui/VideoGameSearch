import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUpForm from './SignUpComponent/SignUpForm';
import HomePage from './HomePage';


function RouterComponent() {
    return (
        <BrowserRouter>
             <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignUpForm />} />
            {/* Add more routes as needed */}
        </Routes>
        </BrowserRouter>
        
    );
}

export default RouterComponent;
