import React from 'react'

export function incidentToString(incident) {
  return (
      // basic format is: {sex} {primary[/secondary] color} {primary[/secondary] type}
      <div>
      { incident.dog_gender.toLowerCase() === 'f' ? 'female' : 'male' }
      { " " }
      { optionalString(incident.dog_primary_color, incident.dog_secondary_color) }
      { " " }
      { optionalString(incident.dog_primary_type, incident.dog_secondary_type) }
      </div>)
}

export function optionalString(pri, sec) {
  return pri + (!!sec ? "/" + sec : "" )
}

export function coatDescription(pri, sec, type) {
  let retVal = optionalString(pri, sec);
  if (!!type)
    retVal += " " + type;
  return retVal
}
