import axios from 'axios'
import * as _ from 'lodash'
import { _getChainId } from 'src/config/index'
import session from 'src/utils/storage/session'
import { JWT_TOKEN_KEY } from './constant/common'

axios.interceptors.request.use(
  async (config) => {
    const chainId = _getChainId()
    const arrayTemp = session.getItem(JWT_TOKEN_KEY) || []
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
