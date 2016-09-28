import {
  default as React,
  Component,
} from "react";

import update from "react-addons-update";
import SimpleMap from "./google_map";
import $ from 'jquery';

export class DogList extends Component {
  state = {
    markers: [{
      position: {
        lat: 37.9688918,
        lng: -122.1025406
      },
      key: `here`,
      defaultAnimation: 2,
    }],
  };

  handleMapClick = this.handleMapClick.bind(this);
  handleMarkerRightclick = this.handleMarkerRightclick.bind(this);

  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  componentDidMount() {
    this.serverRequest = 
      $.getJSON('/api/dogs/' + props.type, 
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

  handleMarkerRightclick(index, event) {
    /*
     * All you modify is data, and the view is driven by data.
     * This is so called data-driven-development. (And yes, it's now in
     * web front end and even with google maps API.)
     */
    let { markers } = this.state;
    markers = update(markers, {
      $splice: [
        [index, 1],
      ],
    });
    this.setState({ markers });
  }

  render() {
    console.log(this.state.markers);
    return (
        <SimpleMap
                style={{height: "500px"}}
                markers={this.state.markers}
                onMapClick={this.handleMapClick}
                onMarkerRightclick={this.handleMarkerRightclick}
                onZoomChanged={this.handleZoomChanged}
              />
      );
  }
};

export class FoundDogList extends Component {
    render() {
        return (<DogList type="found"/>);
    }
}

export class LostDogList extends Component {
    render() {
        return (<DogList type="lost"/>);
    }
}
