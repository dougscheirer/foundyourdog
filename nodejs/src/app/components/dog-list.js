import React, { Component } from "react";

import SimpleMap from "./simple_map";
import $ from 'jquery';
import { browserHistory } from 'react-router';
import ListMapToggle from "./listMapToggle";
import { loginRequired, getIncidentInfo } from "../actions";
import { connect } from 'react-redux';
import ShowInfoCard from './info-card'

export class DogList extends Component {
  state = {
  };

  default_location = { lat : 37.976761, lng: -122.090577}
  handleMapClick = this.handleMapClick.bind(this);
  handleMarkerClick = this.handleMarkerClick.bind(this);
  handleZoomChanged = this.handleZoomChanged.bind(this);
  handleNewReport = this.handleNewReport.bind(this);
  handleCenterChanged = this.handleCenterChanged.bind(this);

  componentWillUnmount() {
    if (this.serverRequest) {
      this.serverRequest.abort();
    }
  }

  showCard(e, incident) {
    e.preventDefault();
    this.props.dispatch(getIncidentInfo(incident.uuid));
  }

  incidentToLink(incident) {
    return (
        <a href="" onClick={ (e) => this.showCard(e, incident) } >
        [{ (!!incident.dog_name) ? incident.dog_name : "no name" }]&nbsp;
        {incident.dog_gender.toLowerCase() === 'f' ? 'female' : 'male' }{" : "}
        {incident.dog_color}{" : "}
        {incident.dog_basic_type}
        </a>)
  }

  incidentToInfo(incident) {
    const theDate = new Date(incident.incident_date);
    return (
      <div>{ theDate.toDateString() }&nbsp;
        { this.incidentToLink(incident) }</div>)
  }

  zoomFromAccuracy(accuracy) {
     // Use min(width, height) (to properly fit the screen
    const screenSize = Math.min(window.screen.availWidth, window.screen.availHeight);

    // Equators length
    const equator = 40075004;

    // The meters per pixel required to show the whole area the user might be located in
    const requiredMpp = accuracy/screenSize;

    // Calculate the zoom level
    return Math.round(((Math.log(equator / (256 * requiredMpp))) / Math.log(2)) + 1);
  }

  getServerData(location, zoom) {
    if (location != null) {
      if (!!!zoom) {
        zoom = 16;
      }
      console.log("Fetching server data based on " + location.lat + " / " + location.lng + " zoom: " + zoom);
      this.setState( { center: location, zoom: zoom } );
      // TODO: switch to fetch and an action for the store
      this.serverRequest = $.getJSON('/api/dogs/' + this.props.showtype + "?lat=" + location.lat + "&lng=" + location.lng + "&zoom=" + zoom,
        function (result) {
          var markers = [];
          for (var i=0; i<result.length; i++) {
            const incident = result[i];
            markers.push({
              position: {
                lat: incident['map_latitude'],
                lng: incident['map_longitude']
              },
              incident: incident,
              key: incident['uuid'],
              defaultAnimation: 2,
              incidentInfo: this.incidentToInfo(incident)
            });
          }
          this.setState({ markers: markers });
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
          // TODO: use positions.accuracy to set the zoom
          this.getServerData(
            { lat: position.coords.latitude, lng: position.coords.longitude }, this.zoomFromAccuracy(position.coords.accuracy));
        }.bind(this),
        function (error) {
          console.log("geolocation error: ");
          console.log(error);
          this.getServerData(this.default_location);
        });
    }
  }

  handleZoomChanged(a,b,c) {
    // TODO: the refs thing doesn't work, don't know why
    //       when it does, change the query based on the area of the zoom
    const zoomLevel = this.map.map.getZoom();
    if (zoomLevel !== this.state.zoomLevel) {
      // Notice: Check zoomLevel equality here,
      // or it will fire zoom_changed event infinitely
      this.setState({
        zoom: zoomLevel
      });
    }
  }

  handleCenterChanged() {
    if (this.map != null) {
      this.getServerData({ lat: this.map.map.getCenter().lat(), lng: this.map.map.getCenter().lng() }, this.state.zoom );
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
    this.setState({ newreport: newreport, selected: undefined });
  }

  handleMarkerClick(index, event) {
    let selected = this.state.markers[index];
    this.setState({ newreport: undefined, selected: selected });
  }

  handleSelectedClosed() {
    this.setState({selected: undefined})
  }

  handleNewReport(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
      let queryUrl = (this.props.showtype === "lost" ? "found" : "lost") + "/new?" +
            "lat=" + this.state.newreport.position.lat() +
            "&lng=" + this.state.newreport.position.lng();
      this.props.dispatch(loginRequired(() => {
        browserHistory.push(queryUrl);
      }));
    }
  }

  render() {
    if (this.props.displaytype === "list") {
      var rows = [];
      this.state.markers.forEach((marker) => {
        const theDate = new Date(marker.incident.incident_date);
        rows.push(<tr key={marker.key}>
            <td>{ theDate.toString() }</td>
            <td>{ this.incidentToLink(marker.incident) }</td>
            <td>Lat: {marker.position.lat}, Lng: {marker.position.lng}</td>
            <td>{marker.incident.resolution}</td>
            <td>{marker.incident.state}</td>
            </tr>);
      });
      return (
        <div>
        <ShowInfoCard />
          <table style={{width: "100%"}}>
          <thead>
            <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Position</th>
            <th>Resolution</th>
            <th>State</th>
            </tr>
          </thead>
          <tbody>
          {  rows }
          </tbody>
          </table>
        </div>);
    } else {
      return (
          <div className="search-map">
          <ShowInfoCard />
          <SimpleMap
                  ref={(map) => this.map = map}
                  showtype={this.props.showtype}
                  center={this.state.center}
                  zoom={this.state.zoom}
                  markers={this.state.markers}
                  selected={this.state.selected}
                  newreport={this.state.newreport}
                  onCenterChanged={this.handleCenterChanged}
                  onMapClick={this.handleMapClick}
                  onMarkerClick={this.handleMarkerClick}
                  onZoomChanged={this.handleZoomChanged}
                  onNewReport={this.handleNewReport}
                  onSelectedClose={this.handleSelectedClosed.bind(this)}
                />
          </div>
        );
    }
  }
};

DogList = connect()(DogList);

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
