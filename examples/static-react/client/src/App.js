import React, { useEffect, useState } from 'react';
import './App.css';

// Clock documentation: https://projects.wojtekmaj.pl/react-clock/
// and https://github.com/wojtekmaj/react-clock
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';

function App() {
  // initialize clocktime as a state variable
  const [clocktime, setClocktime] = useState(new Date());

  // update clocktime every second
  useEffect(() => {
    const interval = setInterval(
      () => setClocktime(new Date()),
      1000
    );

    return () => {
      clearInterval(interval);
    }
  }, []);

  // render the app, including the clock
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <Clock value={clocktime} />
        </div>
        <p>
          Hello World!
        </p>
      </header>
    </div>
  );
}

export default App;
