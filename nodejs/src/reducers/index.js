// show the auth form(s)
const authForms = (state = 'NO_AUTH', action) => {
  switch (action.type) {
    case 'SHOW_AUTH':
      return action.filter
    default:
      return state
  }
}

export default authForms;
