import axios from 'axios'
import { _getChainId } from 'src/config/index'
import * as _ from 'lodash'

axios.interceptors.request.use(
  async (config) => {
    const chainId = _getChainId()
    const arrayTemp = JSON.parse(window.localStorage.getItem('TOKEN') || '[]') || []

    const token = _.find(arrayTemp, ['name', chainId])?.token
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  (error) => {
    Promise.reject(error)
  },
)
