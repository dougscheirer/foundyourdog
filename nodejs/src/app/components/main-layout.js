import React, { Component } from 'react';
import { Link } from 'react-router';
import 'bootstrap-loader';
import AuthNavbar from './auth-navbar';
import { LoginPopup } from './login';
import Signup from './signup';
import { connect } from 'react-redux';
import DevTools from '../devtools';
import ShowInfoCard from './info-card'
import SendNotification from './send-notification'
import toastr from 'toastr'
import WSComponent from './wscomponent'
import Toolbar from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

class MainLayout extends Component {

  state = { }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    toastr.options = { "positionClass": "toast-top-left", "timeOut": "5000" }

    const buttonStyle = {
        backgroundColor: 'transparent',
        color: 'white',
        verticalAlign: 'middle'
      };

    return (
      <MuiThemeProvider>
        <Toolbar style={{backgroundColor: "rgb(0, 188, 212)"}}
          title="Found your dog!">
            <FlatButton style={buttonStyle} label="Home" />
            <FlatButton style={buttonStyle} label="Sign in" />
            <FlatButton style={buttonStyle} label="Sign up" />
            <FlatButton style={buttonStyle} label="Feedback" />
        </Toolbar>
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = (state, myprops) => ({
})

const mapDispatchToProps = (dispatch, myprops) => ({
});

export default MainLayout = connect(mapStateToProps, mapDispatchToProps)(MainLayout);
