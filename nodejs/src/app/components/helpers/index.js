import React from 'react'

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
