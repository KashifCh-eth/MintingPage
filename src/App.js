import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import { NotificationContainer } from 'react-notifications';

import { Home } from './pages/home/home';
import { Info } from './pages/info/info';
import { Gallery } from './pages/gallery/gallery';
import { Nav } from './components/nav';
import { Footer } from './components/footer';
import { Web3ContextProvider } from "./components/web3Context";
import './App.css';


function App() {
  return (
    <Web3ContextProvider>
      <Router>
        <div className="poosail-main">
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/info" element={<Info />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
          <Footer />
        </div>
        <NotificationContainer />
      </Router>
    </Web3ContextProvider>
  );
}

export default App;
