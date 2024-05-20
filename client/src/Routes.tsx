import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUpForm from './SignUpComponent/SignUpForm';
import HomePage from './HomePageComponent/HomePage';
import AccountInfo from './SignUpComponent/AdditionalInfoForm';


function RouterComponent() {
    return (
        <BrowserRouter>
             <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignUpForm />} />
                <Route path="/accountinfo" element={<AccountInfo />} />

            {/* Add more routes as needed */}
        </Routes>
        </BrowserRouter>
        
    );
}

export default RouterComponent;
