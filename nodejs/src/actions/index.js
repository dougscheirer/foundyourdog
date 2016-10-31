// 3-states of showing auth: sign in, sign up, neither, with an optional redirect
export const showAuth = (filter, redirect) => ({
  type: 'SHOW_AUTH',
  redirect_url: redirect,
  filter
})

// TODO: add getting map data, picture upload, etc.