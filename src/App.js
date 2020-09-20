import React, {Component} from 'react';
import GoogleMapReact from 'google-map-react';

import './App.css';


class LoadGoogleMap extends Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <div style={{height:'100vh', width:'100%'}}>
        <h1> Google Maps</h1>
        <GoogleMapReact 
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY }}
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
        />
      </div>
    )
  }
}

LoadGoogleMap.defaultProps = {
  center:{
    lat:59,
    lng:30
  },
  zoom: 10
 }

function App() {
  return (
    <div className="App">
      <header className="App-header">
       <LoadGoogleMap />
       </header>
    </div>
  );
}

export default App;
