
import { BrowserRouter as Router, Routes, Route , Link} from 'react-router-dom';
import Home from './Home';
import About from './About';
import Bonus from "./Bonus";


function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> 
        <Link to="/about">About</Link> 
        <Link to="/bonus">Bonus</Link> 
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} /> 
        <Route path="/bonus" element={<Bonus />} /> 
      </Routes>
    </Router>
  );
};

export default App;

