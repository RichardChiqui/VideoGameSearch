import React from 'react';
import logo from './logo.svg';
import './App.css';
import HomePage from './HomePageComponent/HomePage';
import RouterComponent from './Routes';
import { Provider } from 'react-redux'; // Import Provider from react-redux
import { store } from './Store'; // Import the Redux store

function App() {
  return (

    <Provider store={store}> {/* Provide the Redux store to your application */}
      <div className="App">
          <RouterComponent/>
      </div>
    </Provider>


      
     
  );
}

export default App;
