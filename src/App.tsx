
import { BrowserRouter as Router, Routes, Route , Link} from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Home from './Home';
import About from './About';
import Bonus from "./Bonus";


function App() {
  return (
    <Router>
      <LocalizationProvider dateAdapter={AdapterDateFns} >
      <nav>
        <Link to="/">Home</Link> 
        <Link to="/about">About</Link> 
        <Link to="/bonus">Bonus</Link> 
      </nav>

      <Routes>
        <Route path="/"     element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} /> 
        <Route path="/bonus" element={<Bonus />} /> 
      </Routes>

      </LocalizationProvider>
    </Router>
  );
};

export default App;

