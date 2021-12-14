import React, { useEffect, useState } from 'react';
import './App.css';

// Clock documentation: https://projects.wojtekmaj.pl/react-clock/
// and https://github.com/wojtekmaj/react-clock
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';

function App() {
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(
      () => setValue(new Date()),
      1000
    );

    return () => {
      clearInterval(interval);
    }
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <div>
          <Clock value={value} />
        </div>
        <p>
          Hello World!
        </p>
      </header>
    </div>
  );
}

export default App;
