import React from 'react'
import moment from 'moment'

export function logged_in(state) {
  return (state.login.status === "success")
}

export function auth_user(state) {
  return (logged_in(state)) ? state.login.data : undefined
}

export function incidentToString(incident) {
  return (
      // basic format is: {sex} {primary[/secondary] color} {primary[/secondary] type}
      <div>
      { incident.dog_gender.toLowerCase() === 'f' ? 'female' : 'male' }
      { ", " }
      { optionalColor(incident.dog_primary_color, incident.dog_secondary_color) }
      { ", " }
      { optionalBreed(incident.dog_primary_type, incident.dog_secondary_type) }
      </div>)
}

export function optionalBreed(pri, sec) {
  return pri + (!!sec ? " + " + sec + " mix" : "" )
}

export function optionalColor(pri, sec) {
  return pri + (!!sec ? " + " + sec : "" )
}

export function coatDescription(pri, sec, type) {
  let retVal = optionalColor(pri, sec);
  if (!!type)
    retVal += " " + type;
  return retVal
}

export function dogFromIncident(incident) {
    return (incident.dog_gender.toLowerCase() === 'f' ? 'female' : 'male') + ", "
      + optionalColor(incident.dog_primary_color, incident.dog_secondary_color) + ", "
      + optionalBreed(incident.dog_primary_type, incident.dog_secondary_type)
}

export function humanTimestamp(ts) {
  // TODO: make this use timeago (sometimes)
  const m = moment(ts)
  return m.format("ddd MMM Do YYYY") + " at " + m.format("h:mm A (ZZ)")
}

export function ws_send(socket, message, type = "USER_MESSAGE", displayType: undefined, duration = undefined) {
  const ws = socket.getRawSocket()
  if (!!ws && ws.readyState === 1)
    ws.send(JSON.stringify({type: type, messageText: message, displayType: undefined, duration: duration}));
  else {
    console.log("Could not send to socket: " + ((!!!ws) ? "socket undefined" : "readyState = " + ws.readyState))
  }
}

export function ws_ping(socket) {
  ws_send(socket, undefined, "PING");
}