// import L from "leaflet";
// import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
// import icons from "../src/assets/favicon.ico";
import Map from './pages/Map';
import { BrowserRouter as Router ,Route,Routes } from 'react-router-dom';
import User from './components/User';
import MyMap from './pages/MyMap';
import Profile from './pages/Profile';

function App() {

  return (
    <Router>
    <div className="app">
    <User />
      <Routes>
      <Route exact path='/' element={ <Map /> }></Route>
      <Route path='/mymap' element={ <MyMap /> }></Route>
      <Route exact path='/profile/:uid' element={ <Profile /> }></Route>
      </Routes>
    </div>
    </Router>
  );
}

export default App;
