import {
  default as React,
  Component,
} from "react";

import update from "react-addons-update";
import SimpleMap from "./simple_map";
import $ from 'jquery';
import { browserHistory } from 'react-router';

export class DogList extends Component {
  state = {
  };

  handleMapClick = this.handleMapClick.bind(this);
  handleMarkerRightclick = this.handleMarkerRightclick.bind(this);
  handleMarkerClick = this.handleMarkerClick.bind(this);
  handleZoomChanged = this.handleZoomChanged.bind(this);
  handleNewReport = this.handleNewReport.bind(this);

  componentWillUnmount() {
    if (this.serverRequest) {
      this.serverRequest.abort();
    }
  }

  getServerData(location, zoom) {
    if (location != null) {
      console.log("Fetching server data based on " + location.lat + " / " + location.lng);
      this.setState( { center: location } );
    }

      this.serverRequest = $.getJSON('/api/dogs/' + ((this.props.showtype == "lost") ? "found" : "lost" + "?lat=" + location.lat + "&lng=" + location.lng + "&zoom=" + zoom), 
        function (result) {
          var markers = [];
          for (var i in result) {
            var incident = result[i];
            markers.push({
              position: {
                lat: incident['map_latitude'],
                lng: incident['map_longitude']
              },
              key: incident['id'],
              dog_id: incident['dog_id'],
              date: incident['incident_date'],
              state: incident['state'],
              resolution: incident['resolution'],
              defaultAnimation: 2
            });
          }
          this.setState({ markers });
        }.bind(this));
  }

  componentDidMount() {
    // fire off a geolocation request and re-center the map
    this.getServerData(null, 16);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          this.getServerData({ lat: position.coords.latitude, lng: position.coords.longitude });
        }.bind(this));
    }
  }

  handleZoomChanged() {
    // TODO: the refs thing doesn't work, don't know why
    //       when it does, change the query based on the area of the zoom
    const zoomLevel = this.refs.map.getZoom();
    if (zoomLevel !== this.state.zoomLevel) {
      // Notice: Check zoomLevel equality here,
      // or it will fire zoom_changed event infinitely
      this.setState({
        zoomLevel,
        content: `Zoom: ${zoomLevel}`,
      });
    }
  }

  handleMapClick(event) {
    // center the map on the location
    let newreport = 
        {
          position: event.latLng,
          defaultAnimation: 2,
          key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
          label: "!"
        }
    this.setState({ newreport });
  }

  handleMarkerClick(index, event) {
    let { markers } = this.state;
    let selected = markers[index];
    this.setState({ markers, selected });
  }

  handleMarkerRightclick(index, event) {
  }

  handleNewReport(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
      console.log("new report");
      console.log("position");
      browserHistory.push(this.props.showtype + "/new");
    }
  }

  render() {
    console.log(this.state.markers);
    return (
        <SimpleMap
                showtype={this.props.showtype}
                center={this.state.center}
                markers={this.state.markers}
                selected={this.state.selected}
                newreport={this.state.newreport}
                onMapClick={this.handleMapClick}
                onMarkerRightclick={this.handleMarkerRightclick}
                onMarkerClick={this.handleMarkerClick}
                onZoomChanged={this.handleZoomChanged}
                onNewReport={this.handleNewReport}
              />
      );
  }
};

export class FoundDogList extends Component {
    render() {
        return (<DogList showtype="lost"/>);
    }
}

export class LostDogList extends Component {
    render() {
        return (<DogList showtype="lost"/>);
    }
}
