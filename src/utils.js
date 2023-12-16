import axios from "axios"

const host = '/api'

const getToken = () => {
  let userInfo = window.localStorage.getItem('userInfo')
  if (userInfo) {
    userInfo = JSON.parse(userInfo)
    return userInfo.token
  } else {
    return ''
  }
}

export const get = (url) => {
  const token = getToken();
  const headers = token ? {
    Authorization: `Bearer ${token}`
  } : {}
  return axios.get(host + url, { headers })
}

export const post = (url, data) => {
  const token = getToken();
  const headers = token ? {
    Authorization: `Bearer ${token}`
  } : {}
  return axios.post(host + url, data, { headers })
}

export const put = (url, data) => {
  const token = getToken();
  const headers = token ? {
    Authorization: `Bearer ${token}`
  } : {}
  return axios.put(host + url, data, { headers })
}

export const del = (url, data) => {
  const token = getToken();
  const headers = token ? {
    Authorization: `Bearer ${token}`
  } : {}
  return axios({
    method: 'DELETE',
    url: host + url,
    data,
    headers
  })
}