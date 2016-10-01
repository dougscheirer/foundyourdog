import {
  default as React,
  Component,
} from "react";

import update from "react-addons-update";
import SimpleMap from "./google_map";
import $ from 'jquery';

export class DogList extends Component {
  state = {
  };

  handleMapClick = this.handleMapClick.bind(this);
  handleMarkerRightclick = this.handleMarkerRightclick.bind(this);
  handleMarkerClick = this.handleMarkerClick.bind(this);
  handleZoomChanged = this.handleZoomChanged.bind(this);

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  componentDidMount() {
    this.serverRequest = 
      $.getJSON('/api/dogs/' + ((this.props.showtype == "lost") ? "found" : "lost"), 
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

  state = {
    zoomLevel: 4,
    content: `Change the zoom level`,
  }

  handleZoomChanged() {
    // TODO: the refs thing doesn't work, don't know why
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

  /*
   * This is called when you click on the map.
   * Go and try click now.
   */
  handleMapClick(event) {
    // TODO: record the location for later
    let { markers } = this.state;
    markers = update(markers, {
      $push: [
        {
          position: event.latLng,
          defaultAnimation: 2,
          key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
        },
      ],
    });
    this.setState({ markers });
  }

  handleMarkerClick(index, event) {
    let { markers } = this.state;
    let selected = markers[index];
    this.setState({ markers, selected });
  }

  handleMarkerRightclick(index, event) {
    /*
     * All you modify is data, and the view is driven by data.
     * This is so called data-driven-development. (And yes, it's now in
     * web front end and even with google maps API.)
     */
  }

  render() {
    console.log(this.state.markers);
    return (
        <SimpleMap
                markers={this.state.markers}
                selected={this.state.selected}
                onMapClick={this.handleMapClick}
                onMarkerRightclick={this.handleMarkerRightclick}
                onMarkerClick={this.handleMarkerClick}
                onZoomChanged={this.handleZoomChanged}
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
