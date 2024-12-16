import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route , Link} from 'react-router-dom';
import Home from './Home';
import About from './About';
import Bonus from './Bonus';

import './index.css';


const App: React.FC = () => {
  return (
    <Router>
          <nav>
        <ul>
          <li>
            <Link to="/">Home</Link> 
          </li>
          <li>
            <Link to="/about">About</Link> 
          </li>
          <li>
            <Link to="/bonus">Bonus</Link> 
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} /> 
        <Route path="/bonus" element={<Bonus />} /> 
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
