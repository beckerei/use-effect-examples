import React, { useState, useCallback } from 'react';
import { Polling } from './Polling';
import './main.css';

type Routes = 'home' | 'polling';

const App = () => {
  const [route, setRoute] = useState<Routes>('home');

  const renderRoutes = useCallback(() => {
    switch(route) {
      case 'polling': return <Polling />;
      case 'polling':
      default: return null;
    }
  }, [route]);

  return (
    <>
      <div>
        <button onClick={() => setRoute('home')}>Home</button>
        <button onClick={() => setRoute('polling')}>polling with rxjs</button>
      </div>
      <div>{renderRoutes()}</div>
    </>
  );
};

export default App;
