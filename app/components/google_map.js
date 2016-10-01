import React from 'react';
import {GoogleMapLoader, GoogleMap, Marker, InfoWindow} from "react-google-maps";
import styles from './home.css';

export default function SimpleMap (props) {
  var style = styles.map;
  var info = [], markers = [];

  if (!!props.markers) {
    markers = props.markers.map(function(marker, index) {
              return (
                <Marker
                  {...marker}
                  onClick={() => props.onMarkerClick(index)} 
                  onRightclick={() => props.onMarkerRightclick(index)} />
              );
            });
  }
  
  if (!!props.selected) {
        let marker = props.selected;
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
  
  return (
    <div className={style}>
    <section style={{height: "100%"}}>
      <GoogleMapLoader
        containerElement={
          <div
            {...props.containerElementProps}
            style={{
              height: "100%",
            }}
          />
        }
        googleMapElement={
          <GoogleMap
            ref={(map) => console.log(map)}
            defaultZoom={16}
            defaultCenter={{ lat: 37.9688918, lng: -122.1025406 }}
            onClick={props.onMapClick}
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