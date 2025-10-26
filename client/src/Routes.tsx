import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUpForm from './Components/SignUpComponent/SignUpForm';
import HomePage from './Components/HomePageComponent/HomePage';
import AccountInfo from './Components/SignUpComponent/AdditionalInfoForm';
import { useSocket } from './hooks/useSocket';
import { useMessaging } from './hooks/useMessaging';
import { useAuth } from './hooks/useAuth';

function RouterComponent() {
    // Initialize auth, socket and messaging services
    const { isLoading: authLoading } = useAuth();
    const socket = useSocket();
    useMessaging(); // This handles Redux integration

    // Show loading while checking authentication
    if (authLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '18px'
            }}>
                Loading...
            </div>
        );
    }

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
