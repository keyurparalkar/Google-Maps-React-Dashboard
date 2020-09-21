import React, {Component} from 'react';
import {Container, Button, Slider} from '@material-ui/core';
import GoogleMapReact from 'google-map-react';

import jsonData from './location-158393297483727762_5th_9th_june.json';
import './App.css';

const marks = [200,400,600,800,1000]

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
      sliderVal: 1000,
      arrayPos:null,
      timerId:null,
      trackStatus:'playing'
     }

    this.handleMapObjs = this.handleMapObjs.bind(this);
    this.getJSONData = this.getJSONData.bind(this);
    this.startTracking = this.startTracking.bind(this);
    this.pauseTracking = this.pauseTracking.bind(this);
    // this.stopTracking = this.stopTracking.bind(this);
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
      trackStatus:'paused'
    })
    clearInterval(this.state.timerId)
  }

  startTracking(){
    var timerid = null

    // for(let i=0;i<this.state.fligthPathPoints.length; i++){
    //   // clearInterval(timerid)
    //   var delay = this.state.sliderVal
    //   this.setState({
    //     timer:i
    //   })
    //   timerid = setTimeout(function(coords){
    //     let latlng = new this.state.maps.LatLng(coords.lat, coords.lng)
    //     this.state.polyline.getPath().push(latlng)
    //     this.state.marker.setPosition(latlng) 
    //     this.state.map.panTo(latlng)
    //     this.state.polyline.setMap(this.state.map)
    //   }.bind(this),2*i, this.state.fligthPathPoints[i])
    // }

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
        i++;

        this.setState({
          arrayPos: i,
          timerId: timerid
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

    // for(let i=0;i<fligthPathPoints.length; i++){
    //   setTimeout(function(coords){
    //     let latlng = new args.maps.LatLng(coords.lat, coords.lng)
    //     fligthPath.getPath().push(latlng)
    //     marker.setPosition(latlng)
    //     args.map.panTo(latlng)
    //     fligthPath.setMap(args.map)
    //   },i, fligthPathPoints[i])
    // }

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
    return(
      <div style={{height:'100vh', width:'100%'}}>
        <h1> Google Maps = {this.state.arrayPos}</h1>
        <Button variant="contained" onClick={this.startTracking}>START</Button>
        <Button variant="contained" onClick={this.pauseTracking}>PAUSE</Button>
        <Slider 
        defaultValue={600}
        step={200}
        aria-labelledby="discrete-slider"
        getAriaValueText={(val)=>'${val}x'}
        valueLabelDisplay="auto"
        min={200}
        max={1000}
        marks
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
