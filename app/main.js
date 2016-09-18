var React = require("react");
var ReactDOM = require("react-dom");
var Flux = require("flux");
$ = jQuery = require("jquery");
var Bootstrap = require("bootstrap");

var App = require("./components/App.react")

ReactDOM.render(<App />, document.getElementById('app'));