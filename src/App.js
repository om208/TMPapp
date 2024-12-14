import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { TopNavBar } from './components/TopNavBar';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <TopNavBar />
        {/* Add other components here */}
      </div>
    </Provider>
  );
}

export default App;

