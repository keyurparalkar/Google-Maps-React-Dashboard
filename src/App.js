import React, {Component} from 'react';
import {Container, Button, Slider,Drawer} from '@material-ui/core';
import GoogleMapReact from 'google-map-react';

import jsonData from './location-158393297483727762_5th_9th_june.json';
import './App.css';


const marks = [
  {
    value: 1,
    label: '1x',
  },
  {
    value: 2,
    label: '2x',
  },
  {
    value: 3,
    label: '3x',
  },
  {
    value: 4,
    label: '4x',
  },
  {
    value: 5,
    label: '5x',
  }
];

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


class LoadGoogleMap extends Component{
  constructor(props){
    super(props)

    this.state = {
      fligthPathPoints:null,
      arrow_icon: null,
      marker: null,
      polyline: null,
      map:null,
      maps:null,
      sliderVal: 1,
      arrayPos:null,
      timerId:null,
      trackStatus:'playing',
      disabled:false
     }

    this.handleMapObjs = this.handleMapObjs.bind(this);
    this.getJSONData = this.getJSONData.bind(this);
    this.startTracking = this.startTracking.bind(this);
    this.pauseTracking = this.pauseTracking.bind(this);
    this.stopTracking = this.stopTracking.bind(this);
    this.changeSliderValue = this.changeSliderValue.bind(this);

  }

  changeSliderValue(event, newVal){
    this.setState((state)=>{
      return{
        sliderVal: newVal
      }
    })

  }

  pauseTracking(){
    this.setState({
      trackStatus:'paused',
      disabled: false
    })
    clearInterval(this.state.timerId)
  }

  stopTracking(){
    this.state.polyline.setMap(null)
    this.state.marker.setPosition(null)
    this.state.polyline.setPath([])
    clearInterval(this.state.timerId)
    this.setState({
      arrayPos:0,
      timerId:null,
      disabled:false
    })
  }

  startTracking(){
    var timerid = null

    let i =0;
    let fligthLen = this.state.fligthPathPoints.length

     timerid = setInterval(function(){
       if(this.state.trackStatus == 'paused'){
        i=this.state.arrayPos
       }
       
      let coords = this.state.fligthPathPoints[i]
      let latlng = new this.state.maps.LatLng(coords.lat, coords.lng)
        this.state.polyline.getPath().push(latlng)
        this.state.marker.setPosition(latlng) 
        this.state.map.panTo(latlng)
       this.state.polyline.setMap(this.state.map)
       
        if(i==fligthLen - 1){
          clearInterval(timerid)
        }

        i = i + this.state.sliderVal;

        this.setState({
          arrayPos: i,
          timerId: timerid,
          disabled:true
        })
        
    }.bind(this), 10)

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

    const arrow = {
      anchor: new args.maps.Point(10,10),
      strokeColor:'black',
      strokeWeigth:10,
      scale:2,
      fillColor:'black',
      path:'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z'
    }

    const marker = new args.maps.Marker({map:args.map, icon:arrow})

    const fligthPath = new args.maps.Polyline({
      path:[],
      geodesic: false,
      strokeColor: "#f0a500",
      strokeOpacity: 2.0,
      strokeWeight: 3
    })

    this.setState({
      fligthPathPoints:fligthPathPoints,
      arrow_icon: arrow,
      marker: marker,
      polyline: fligthPath,
      map: args.map,
      maps: args.maps
     })

  }
  

  render(){
    console.log(this.state.sliderVal)
    return(
      <div style={{height:'100vh', width:'100%'}}>
        <h1> Google Maps = {this.state.arrayPos}</h1>
        <Button variant="contained" onClick={this.startTracking} disabled={this.state.disabled}>START/RESUME</Button>
        <Button variant="contained" onClick={this.pauseTracking}>PAUSE</Button>
        <Button variant="contained" onClick={this.stopTracking}>STOP</Button>
        <Slider 
        defaultValue={1}
        step={1}
        aria-labelledby="discrete-slider-custom"
        getAriaValueText={(val)=>`${val}x`}
        valueLabelDisplay="auto"
        min={1}
        max={5}
        marks={marks}
        onChange={this.changeSliderValue}
        />
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
  zoom: 10
 }

function App() {
  return (
    <Container className="App">
        <LoadGoogleMap/>
    </Container>
  );
}

export default App;
