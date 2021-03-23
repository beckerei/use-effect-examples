import React, { useState, useCallback } from 'react';
import { StateMachine, Polling } from './Polling';
import { Timeout } from './Timeout';
import { Fetch } from './Fetch';
import './main.css';

type Routes = 'home' | 'polling' | 'timeout' | 'fetch' | 'stateMachine';

const App = () => {
  const [route, setRoute] = useState<Routes>('home');

  const renderRoutes = useCallback(() => {
    switch (route) {
      case 'stateMachine':
        return <StateMachine />;
      case 'polling':
        return <Polling />;
      case 'timeout':
        return <Timeout />;
      case 'fetch':
        return <Fetch />;
      default:
        return null;
    }
  }, [route]);

  return (
    <>
      <div>
        <button onClick={() => setRoute('home')}>Home</button>
        <button onClick={() => setRoute('timeout')}>setTimeout</button>
        <button onClick={() => setRoute('fetch')}>fetch</button>
        <button onClick={() => setRoute('polling')}>polling with rxjs</button>
        <button onClick={() => setRoute('stateMachine')}>polling with a state machine</button>
      </div>
      <div>{renderRoutes()}</div>
    </>
  );
};

export default App;
