import { default as React, Component } from 'react';
import {GoogleMapLoader, GoogleMap, Marker, InfoWindow} from "react-google-maps";
import './home.css';

export default class SimpleMap extends Component {
    newReport() {
        window.onNewReport();
    }

    componentDidMount() {
        window.onNewReport = this.props.onNewReport;
    }

    componentWillUnmount() {
        window.onNewReport = null;
    }

    render() {
      let info = [], markers = [];
      const zoom = this.props.zoom || 16;
      const center = this.props.center || { lat: 0, lng: 0 }
      if (!!this.props.markers) {
        markers = this.props.markers.map(function(marker, index) {
                  return (
                    <Marker
                      {...marker}
                      onClick={() => this.props.onMarkerClick(index)} />
                  );
                }.bind(this));
      }

      if (!!this.props.selected) {
            let marker = this.props.selected;
            // TODO: make this better, preview an image, more info etc.
            info = <InfoWindow
                      {...marker}>
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
                  {...marker}>
                  <div className="incident-info">
                    <a href="#" onClick={callback}> Click here to start a new report </a>
                  </div>
                </InfoWindow>
      }

      return (
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
                ref={(map) => this.map = map}
                defaultZoom={zoom}
                defaultCenter={ center }
                center={ center }
                onClick={this.props.onMapClick}
                onDragEnd={this.props.onCenterChanged}
                onIdle={this.props.onCenterChanged}
              >
                {markers}
                {info}
              </GoogleMap>
            }
          />
        </section>
      );
  }
}