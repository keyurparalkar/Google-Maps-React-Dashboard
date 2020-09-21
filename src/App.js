import React, {Component} from 'react';
import {Container} from '@material-ui/core';
import GoogleMapReact from 'google-map-react';

import jsonData from './location-158393297483727762_5th_9th_june.json';
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

    this.state = {
      startPoint: {
        lat:0,
        lng:0
      },
      endPoint:{
        lat:0,
        lng:0
      },
      paths:null
    }

    this.handleMapObjs = this.handleMapObjs.bind(this);
    this.getJSONData = this.getJSONData.bind(this);

  }

  getJSONData(){
    let temp = []
    let lenData = jsonData.length

    for (const obj of jsonData){
        if(obj.hasOwnProperty('multi_geo')){
            for(const geo of obj.multi_geo){
                let coord = {lat:geo.geocode.lat, lng:geo.geocode.lng}
                if(coord.lat != null || coord.lng != null){
                  temp.push(coord)
                }
            }
        }
    }

    return temp
  }

  handleMapObjs(args){

    let fligthPathPoints = this.getJSONData()

    this.setState({
      startPoint:{
        lat: fligthPathPoints[0].lat,
        lng: fligthPathPoints[0].lng
      },
      endPoint:{
       lat: fligthPathPoints[fligthPathPoints.length -1].lat,
       lng: fligthPathPoints[fligthPathPoints.length -1].lng
     } 
     })

    const arrow = {
      strokeColor:'white',
      strokeWeigth:1,
      scale:3,
      path:args.maps.SymbolPath.CIRCLE
    }

    const marker = new args.maps.Marker({map:args.map, icon:arrow})

    const fligthPath = new args.maps.Polyline({
      path:[],
      geodesic: false,
      strokeColor: "#FF0000",
      strokeOpacity: 2.0,
      strokeWeight: 2
    })

    for(let i=0;i<fligthPathPoints.length; i++){
      setTimeout(function(coords){
        let latlng = new args.maps.LatLng(coords.lat, coords.lng)
        fligthPath.getPath().push(latlng)
        marker.setPosition(latlng)
        args.map.panTo(latlng)
        fligthPath.setMap(args.map)
      },i, fligthPathPoints[i])

      clearInterval()
    }

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
