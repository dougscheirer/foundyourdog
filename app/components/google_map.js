import React from 'react';
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";
import styles from './home.css';

export default function SimpleMap (props) {
  console.log(props);
  var style = "jumbotron " + styles.homemain;
  var markers = null;
  if (!!props.markers) {
    markers = props.markers.map(function(marker, index) {
              return (
                <Marker
                  {...marker}
                  onRightclick={() => props.onMarkerRightclick(index)} />
              );
            });
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
          </GoogleMap>
        }
      />
    </section>
    </div>
  );
}