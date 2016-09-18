var React = require("react");
var ReactDOM = require("react-dom");
var Flux = require("flux");
$ = require("jquery");

var HelloWorld = React.createClass({
	  render: function(){
	    return (
	      <div>
	        Hello World!
	      </div>
	    )
	  }
	});

ReactDOM.render(<HelloWorld />, document.getElementById('app'));