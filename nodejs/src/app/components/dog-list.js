import React, { Component } from "react";

import SimpleMap from "./simple_map";
import $ from 'jquery';
import { browserHistory } from 'react-router';
import ListMapToggle from "./listMapToggle";

export class DogList extends Component {
  state = {
  };

  handleMapClick = this.handleMapClick.bind(this);
  handleMarkerRightclick = this.handleMarkerRightclick.bind(this);
  handleMarkerClick = this.handleMarkerClick.bind(this);
  handleZoomChanged = this.handleZoomChanged.bind(this);
  handleNewReport = this.handleNewReport.bind(this);
  handleCenterChanged = this.handleCenterChanged.bind(this);

  componentWillUnmount() {
    if (this.serverRequest) {
      this.serverRequest.abort();
    }
  }

  getServerData(location, zoom) {
    if (location != null) {
      if (!!!zoom) {
        zoom = 16;
      }
      console.log("Fetching server data based on " + location.lat + " / " + location.lng);
      this.setState( { center: location } );
      this.serverRequest = $.getJSON('/api/dogs/' + this.props.showtype + "?lat=" + location.lat + "&lng=" + location.lng + "&zoom=" + zoom,
        function (result) {
          var markers = [];
          for (var i=0; i<result.length; i++) {
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
        }.bind(this))
        .fail( function(error) {
          console.log("failed to get server data");
      });
    }
  }

  componentDidMount() {
    // fire off a geolocation request and re-center the map
    this.getServerData(null, 16);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          console.log(position);
          this.getServerData({ lat: position.coords.latitude, lng: position.coords.longitude });
        }.bind(this),
        function (error) {
          console.log("geolocation error: ");
          console.log(error);
        });
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

  handleCenterChanged() {
    if (this.map != null) {
      this.getServerData({ lat: this.map.map.getCenter().lat(), lng: this.map.map.getCenter().lng() }, this.map.map.getZoom());
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
      // showtype is the opposite of the user's state (if they found a dog, they see lost dogs, but report a found one)
      browserHistory.push((this.props.showtype === "lost" ? "found" : "lost") + "/new");
    }
  }

  render() {
    console.log(this.state.markers);
    if (this.props.displaytype === "list") {
      var rows = [];
      this.state.markers.forEach((marker) => {
        rows.push(<tr>
            <td>{marker.date}</td>
            <td>{marker.dog_id}</td>
            <td>Lat: {marker.position.lat}, Lng: {marker.position.lng}</td>
            <td>{marker.resolution}</td>
            <td>{marker.state}</td>
            </tr>);
      });
      return (
        <div>
          <table style={{width: "100%"}}>
          <thead>
            <th>Date</th>
            <th>DogId</th>
            <th>Position</th>
            <th>Resolution</th>
            <th>State</th>
          </thead>
          <tbody>
          {  rows }
          </tbody>
          </table>
        </div>);
    } else {
      return (
          <SimpleMap
                  ref={(map) => this.map = map}
                  showtype={this.props.showtype}
                  center={this.state.center}
                  markers={this.state.markers}
                  selected={this.state.selected}
                  newreport={this.state.newreport}
                  onCenterChanged={this.handleCenterChanged}
                  onMapClick={this.handleMapClick}
                  onMarkerRightclick={this.handleMarkerRightclick}
                  onMarkerClick={this.handleMarkerClick}
                  onZoomChanged={this.handleZoomChanged}
                  onNewReport={this.handleNewReport}
                />
        );
    }
  }
};

class BaseDogs extends Component {
    constructor(props) {
      super(props);
      this.state = {
        displaytype: 'map'
      }
    }

    handleToggle = this.handleToggle.bind(this);

    handleToggle(displayType) {
      this.setState({ displaytype: displayType });
    }
}

export class FoundDogs extends BaseDogs {
    render() {
        return (
          <div>
            <ListMapToggle displaytype={this.state.displaytype} onToggle={this.handleToggle}/>
            <DogList showtype="lost" displaytype={this.state.displaytype}/>
          </div>);
    }
}

export class LostDogs extends BaseDogs {
    render() {
        return (
          <div>
            <ListMapToggle displaytype={this.state.displaytype} onToggle={this.handleToggle}/>
            <DogList showtype="found" displaytype={this.state.displaytype}/>
          </div>);
    }
}
