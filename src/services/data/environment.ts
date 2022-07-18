import axios from 'axios'

interface IConfiguration {
  apiGateway: string | null
}

export const getGatewayUrl = async (): Promise<IConfiguration> => {
  return fetch('config.json')
    .then((res) => res.json())
    .then((config: any) => {
      const data = {
        apiGateway: config['api-gateway'],
        chainInfo: config['chain_info'],
      }
      return data
    })
    .catch((err: any) => {
      console.error(err)
      return {
        apiGateway: null,
      }
    })
}
