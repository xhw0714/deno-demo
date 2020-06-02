import axios from 'axios'

export function postServer(payload = {}) {
  return axios.post('/api/addserver', payload);
}

export function getServer(payload = {}) {
  return axios.get('/api/getserver', payload);
}

export function fetchServer(payload = {}) {
  return axios.post('/api/fetch', payload);
}

export function postPool(payload = {}) {
  return axios.post('/api/addpool', payload);
}

export function getPool(payload = {}) {
  return axios.get('/api/getpool', payload);
}

export function postSite(payload = {}) {
  return axios.post('/api/addsite', payload);
}

export function delServer(payload = {}) {
  return axios.delete('/api/delserver', payload);
}

export function postOptions(payload = {}) {
  return axios.post('/api/addoptions', payload);
}

export function updateOptions(payload = {}) {
  return axios.post('/api/updateoptions', payload);
}

export function delOption(payload = {}) {
  return axios.delete('/api/deloption', payload);
}

export function update(payload = {}) {
  return axios.post('/api/update', payload);
}

export function updateServer(payload = {}) {
  return axios.post('/api/updateserver', payload);
}

export function delSite(payload = {}) {
  return axios.delete('/api/delsite', payload);
}

export function updateSite(payload = {}) {
  return axios.post('/api/updatesite', payload);
}

export function delPool(payload = {}) {
  return axios.delete('/api/delpool', payload);
}

export function updatePool(payload = {}) {
  return axios.post('/api/updatepool', payload);
}
