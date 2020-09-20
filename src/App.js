import React, {Component} from 'react';
import {Container} from '@material-ui/core';
import GoogleMapReact from 'google-map-react';

import './App.css';

class SideDrawer extends Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <h1>SideBar component</h1>
    )
  }
}

class Marker extends Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <div style={{backgroundColor:'red',width:20, height:20}}>
        {this.props.text}
      </div>
    )
  }
}
class LoadGoogleMap extends Component{
  constructor(props){
    super(props)

    this.handleMapObjs = this.handleMapObjs.bind(this)
  }

  handleMapObjs(args){
    let fligthPathPoints = [
      {lat:15.527665, lng:74.907585},
      {lat:15.503681666666667, lng:74.95155666666666},
      {lat:13.6113, lng:76.95476833333333}
    ]

    const fligthPath = new args.maps.Polyline({
      path:fligthPathPoints,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    })

    fligthPath.setMap(args.map)
  }

  render(){
    return(
      <div style={{height:'100vh', width:'100%'}}>
        <h1> Google Maps</h1>
          <GoogleMapReact 
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          yesIWantToUseGoogleMapApiInternals 
          onGoogleApiLoaded={this.handleMapObjs}
          >

            <Marker lat={15.527665} lng={74.907585} text="A"/>
            <Marker lat={13.6113} lng={76.95476833333333} text="B"/>
          </GoogleMapReact>
      </div>
    )
  }
}

LoadGoogleMap.defaultProps = {
  center:{
    lat:15.527665,
    lng:74.907585
  },
  zoom: 7
 }

function App() {
  return (
    <Container className="App">
        <LoadGoogleMap/>
    </Container>
  );
}

export default App;
