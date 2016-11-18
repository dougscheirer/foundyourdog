import { default as React, Component } from 'react';
import {GoogleMapLoader, GoogleMap, Marker, InfoWindow} from "react-google-maps";
import './home.css';

export default class SimpleMap extends Component {

    newReport() {
        this.props.onNewReport();
    }

    onMarkerClick(index) {
      if (this.props.onMarkerClick) {
        this.props.onMarkerClick(index)
      }
    }

    onCenterChanged(map) {
      if (this.props && this.props.onCenterChanged) {
        this.props.onCenterChanged(map)
      }
    }

    onZoomChanged(e) {
      if (this.props && this.props.onZoomChanged) {
        this.props.onZoomChanged(e)
      }
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
                      key={index}
                      onClick={ () => this.onMarkerClick(index) } />
                  );
                }.bind(this));
      }

      if (!!this.props.selected) {
            let marker = this.props.selected;
            // TODO: make this better, preview an image, more info etc.
            info = <InfoWindow
                      onCloseclick={ () => { if (!!this.props.onSelectedClose) { this.props.onSelectedClose(); } } }
                      {...marker}>
                      <div className="incident-info">
                      {marker.incidentInfo}
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
                zoom={zoom}
                defaultZoom={zoom}
                defaultCenter={ center }
                center={ center }
                onClick={this.props.onMapClick}
                onDragEnd={this.onCenterChanged.bind(this)}
                onIdle={this.onCenterChanged.bind(this)}
                onZoomChanged={this.onZoomChanged.bind(this)}
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