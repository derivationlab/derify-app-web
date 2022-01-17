/** axios package
 * Request interception, corresponding interception, unified error handling
 */
import axios from 'axios'
import QS from 'qs'

import router from '../router/index'
import store from '../store/index'
import cfg, {getCurrentServerEndPoint} from '../config'

// Environment switch
//axios.defaults.baseURL = getCurrentServerEndPoint();

// Request timeout
axios.defaults.timeout = 60000

// post request header
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// Request interceptor
axios.interceptors.request.use(
  config => {
    // Before each request is sent, determine whether there is a token. If it exists, the token will be added to the header of the http request. There is no need to manually add it for each request.
    // Even if there is a token locally, it is possible that the token is expired, so the return status should be judged in the response interceptor
    return config
  },
  error => {
    return Promise.error(error)
  })

// Response interceptor
axios.interceptors.response.use(
  response => {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  // When the server status code is not 200
  error => {
    console.error(`axios onReject ${error}`)

    if (error.response.status) {
      switch (error.response.status) {
        // 401: Not logged in
        // Jump to the login page if you are not logged in, and carry the path of the current page
        // Return to the current page after successful login, this step needs to be operated on the login page.
        case 401:
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }
          })
          break
          // 403 token expired
          // Prompt the user after login expiration
          // Clear the local token and empty the token object in vuex
          // Jump to login page
        case 403:
          // Toast({
          //   message: 'Login expired, please log in again\n',
          //   duration: 1000,
          //   forbidClick: true
          // })
          // Clear token
          // localStorage.removeItem('token')
          // store.commit('loginSuccess', null)
          // Jump to the login page, and pass the fullPath of the page to be browsed, after successful login, jump to the page that needs to be visited
          // setTimeout(() => {
          //   router.replace({
          //     path: '/login',
          //     query: {
          //       redirect: router.currentRoute.fullPath
          //     }
          //   })
          // }, 1000)
          break
          // 404 request does not exist
        case 404:
          // Toast({
          //   message: 'Network request does not exist\n',
          //   duration: 1500,
          //   forbidClick: true
          // })
          break
          // Other errors, throw an error prompt directly
        default:
          // Toast({
          //   message: error.response.data.message,
          //   duration: 1500,
          //   forbidClick: true
          // })
      }
      return Promise.reject(error.response)
    }
  }
)
/**
  * getMethod, corresponding to get request
 * @param {String} url [Requested url address]
  * @param {Object} params [Parameters carried in the request]
  */
export function get (url, params) {
  return new Promise((resolve, reject) => {
    axios.get(getUrlWithBase(url), {
      params: params
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        console.error(`axios get ${err}`)
        reject(err.data)
      })
  })
}
/**
  * post method, corresponding to post request
 * @param {String} url [Requested url address]
  * @param {Object} params [Parameters carried in the request]
 * @param config
  */
export function post (url, params, config = null) {
  return new Promise((resolve, reject) => {
    if(config) {
      axios.post(getUrlWithBase(url), params, config)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err.data)
        })
    }else {
      axios.post(url, QS.stringify(params))
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err.data)
        })
    }
  })
}


function getUrlWithBase(url){
  if(url.test(/^https?:\/\/.*/)){
    return url;
  }else{
    return getCurrentServerEndPoint() + url;
  }
}
