import React, { Component } from "react";

import SimpleMap from "./simple_map";
import { browserHistory } from 'react-router';
import { loginRequired, getIncidentInfo, getDogIncidents } from "../actions";
import { connect } from 'react-redux';
import { Tab, TabContainer } from './tabs'
import { humanTimestamp, incidentToString } from './helpers'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

class DogMap extends Component {
  state = {

  };

  handleMapClick(event) {
    // center the map on the location?
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
    let selected = this.props.incidents[index];
    this.setState({ newreport: undefined, selected: selected });
  }

  handleSelectedClosed() {
    this.setState({selected: undefined})
  }

  handleNewReport(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
      let queryUrl = (this.props.showtype === "lost" ? "/found" : "/lost") + "/new?" +
            "lat=" + this.state.newreport.position.lat() +
            "&lng=" + this.state.newreport.position.lng();
      this.props.dispatch(loginRequired(() => {
        browserHistory.push(queryUrl);
      }));
    }
  }

  incidentToInfo(incident) {
    return (
      <div>
      Reported { incident.state } on { humanTimestamp(incident.incident_date) }<br />
      <a href="" onClick={ (e) => this.props.showCard(e, incident) } >
      <strong>[ { (!!incident.dog_name) ? incident.dog_name : "no name" } ]</strong><br />
      { incidentToString(incident) }
      </a>
      </div>)
  }

  markerFromIncident(incident) {
    if (!!!incident) return undefined
    return {
      position: {
        lat: incident['map_latitude'],
        lng: incident['map_longitude']
      },
      incident: incident,
      key: incident['uuid'],
      defaultAnimation: 2,
      incidentInfo: this.incidentToInfo(incident)
    };
  }

  markersFromIncidents(incidents) {
    if (!!!incidents) return []
    return incidents.map( (incident, key) => {
      return this.markerFromIncident(incident)
    })
  }

  render() {
      const markers = this.markersFromIncidents(this.props.incidents)
      return (
          <div className="search-map">
          <SimpleMap
                  ref={(map) => this.map = map}
                  showtype={this.props.showtype}
                  center={this.props.center}
                  zoom={this.props.zoom}
                  markers={markers}
                  selected={this.markerFromIncident(this.state.selected)}
                  newreport={this.state.newreport}
                  onCenterChanged={ () => this.props.onCenterChanged(this.map.map) }
                  onMapClick={this.handleMapClick.bind(this)}
                  onMarkerClick={this.handleMarkerClick.bind(this)}
                  onZoomChanged={() => this.props.onZoomChanged(this.map.map) }
                  onNewReport={this.handleNewReport.bind(this)}
                  onSelectedClose={this.handleSelectedClosed.bind(this)}
                />
          </div>
        );
  }
}

DogMap = connect()(DogMap)

class DogList extends Component {

  render() {
    const columns = [
      { header: "Date", id: "date", accessor: (incident) => incident.incident_date, render: ({value}) => <span>{ humanTimestamp(value) }</span> },
      { header: "Name", accessor: "dog_name" },
      { header: "Description", id: "description", accessor: (incident) => incident,
        render: ({value}) => <span><a href="" onClick={ (e) => this.props.showCard(e, value) }>{ incidentToString(value) }</a></span> },
      { header: "Location", id: "location", accessor: (incident) => incident,
        render: ({value}) => <span>Lat: {value.map_latitude}, Lng: {value.map_longitude}</span> },
      { header: "Resolution", accessor: "resolution" },
      { header: "State", accessor: "state" }
    ]

    return (<ReactTable data={ this.props.incidents } columns={columns} pageSize={ Math.max(1, this.props.incidents.length) } />)
  }
}

class DogViewController extends Component {
  state = {
  };

  default_location = { lat : 37.976761, lng: -122.090577}

  showCard(e, incident) {
    e.preventDefault();
    this.props.getIncidentInfo(incident.uuid);
  }

  componentDidMount() {
    // fire off a geolocation request and re-center the map
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

  handleZoomChanged(map) {
    // TODO: the refs thing doesn't work, don't know why
    //       when it does, change the query based on the area of the zoom
    const zoomLevel = map.getZoom();
    if (zoomLevel !== this.state.zoom) {
      const location = { lat: map.getCenter().lat(), lng: map.getCenter().lng() }
      this.getServerData( location, zoomLevel )
    }
  }

  handleCenterChanged(map) {
    if (map != null) {
      const location = { lat: map.getCenter().lat(), lng: map.getCenter().lng() }
      const zoom = this.state.zoom

      this.getServerData( location, zoom );
    }
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

      this.setState( { center: location, zoom: zoom })
      console.log("Fetching server data based on " + location.lat + " / " + location.lng + " zoom: " + zoom);
      this.props.getIncidentsInArea( this.props.showtype, location, zoom );
    }
  }

  activePath(pathname) {
    const parts = pathname.split('/')
    for (let last = parts.length -1; last >= 0; last--) {
      if (parts[last] !== '') {
        return (parts[last].toLowerCase() !== "list") ? "map" : "list"
      }
    }
  }

  render() {
    const basePath = "/" + this.props.baselink + "/"
    const active = this.activePath(this.props.location.pathname)

    return (<div>
        <TabContainer activeTab={ active } >
          <Tab tabId="map" name="Map" link={ basePath + "map" } >
            <DogMap { ...this.props }
              incidents={ this.props.incidents }
              dataCallback={ this.getServerData.bind(this) }
              showCard={ this.showCard.bind(this) }
              center={ this.state.center }
              zoom={ this.state.zoom }
              onCenterChanged={ this.handleCenterChanged.bind(this) }
              onZoomChanged={ this.handleZoomChanged.bind(this) } />
          </Tab>
          <Tab tabId="list" name="List" link={ basePath + "list"} >
            <DogList { ...this.props }
              incidents={ this.props.incidents }
              dataCallback={ this.getServerData.bind(this) }
              showCard={ this.showCard.bind(this) } />
          </Tab>
      </TabContainer>
      </div>)
  }
}

const mapStateToProps = (state, myprops) => ({
  incidents: (state.incidents ? state.incidents[myprops.showtype] : [])
})

const mapDispatchToProps = (dispatch, myprops) => ({
  getIncidentsInArea: (type, location, zoom) => { dispatch(getDogIncidents(type, location, zoom)) },
  getIncidentInfo: (incident) => { dispatch(getIncidentInfo(incident)) }
})

DogViewController = connect(mapStateToProps, mapDispatchToProps)(DogViewController);

export class FoundDogs extends DogViewController {
    render() {
        return (
          <div>
            <DogViewController showtype="lost" baselink="found" location={this.props.location} />
          </div>);
    }
}

export class LostDogs extends DogViewController {
    render() {
        return (
          <div>
            <DogViewController showtype="found" baselink="lost" location={this.props.location} />
          </div>);
    }
}
