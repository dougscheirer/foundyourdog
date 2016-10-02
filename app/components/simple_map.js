import { default as React, Component } from 'react';
import {GoogleMapLoader, GoogleMap, Marker, InfoWindow} from "react-google-maps";
import styles from './home.css';

import Signin from "./signin"

export default class SimpleMap extends Component {
    newReport() {
        window.onNewReport();
    }

    componentDidMount() {
        window.onNewReport = this.props.onNewReport();
    }

    componentWillUnmount() {
        window.onNewReport = null;
    }
        
    render() {
      var style = styles.map;
      var info = [], markers = [];
      var zoom = this.props.zoom || 16;
      var center = this.props.center || { lat: 39.9688918, lng: -122.1025406 }
      if (!!this.props.markers) {
        markers = this.props.markers.map(function(marker, index) {
                  return (
                    <Marker
                      {...marker}
                      onClick={() => props.onMarkerClick(index)} 
                      onRightclick={() => props.onMarkerRightclick(index)} />
                  );
                });
      }
      
      if (!!this.props.selected) {
            let marker = this.props.selected;
            info = <InfoWindow 
                      {...marker}
                      visible="false"
                      onRightclick={() => props.onMarkerRightclick(index)}>
                      <div className="incident-info">
                      {marker.date} : 
                      {marker.dog_id} :
                      {marker.state} : 
                      {marker.resolution} :
                      </div>
                    </InfoWindow>
      }

      if (!!this.props.newreport) {
        var marker = this.props.newreport;
        var callback = this.props.onNewReport;
        info =  <InfoWindow 
                  {...marker}
                  visible="false">
                  <div className="incident-info">
                    <a href="#" onClick={callback}> Click here to start a new report </a>
                  </div>
                </InfoWindow>
      } 

      return (
        <div className={style}>
        <section style={{height: "100%"}}>
          <GoogleMapLoader
            containerElement={
              <div
                {...this.props.containerElementProps}
                style={{
                  height: "100%",
                }}
              />
            }
            googleMapElement={
              <GoogleMap
                ref={(map) => console.log(map)}
                defaultZoom={zoom}
                defaultCenter={ center }
                center={ center }
                onClick={this.props.onMapClick}
              >
                {markers}
                {info}
              </GoogleMap>
            }
          />
        </section>
        </div>
      );
  }
}