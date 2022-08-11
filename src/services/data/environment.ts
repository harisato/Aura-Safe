interface IConfiguration {
  apiGateway: string | null
  chainId: string | null
  chainInfo: any[]
}

export const getGatewayUrl = async (): Promise<IConfiguration> => {
  return fetch('config.json')
    .then((res) => res.json())
    .then((config: any) => {
      const data = {
        apiGateway: config['api-gateway'],
        chainInfo: config['chain_info'],
        chainId: config['chain_id'],
      }
      return data
    })
    .catch((err: any) => {
      console.error(err)
      return {
        apiGateway: null,
        chainId: null,
        chainInfo: [],
      }
    })
}

export function getExplorerUrl(chainId: string, baseUrl: string, type: 'txHash' | 'address' | 'api'): string {
  switch (type) {
    case 'txHash':
      return getExplorerUrlTxHash(chainId, baseUrl)
    case 'address':
      return `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}account/{{address}}`
    case 'api':
      return `${
        baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'
      }api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}`
    default:
      return baseUrl
  }
}

function getExplorerUrlTxHash(chainId: string, baseUrl: string): string {
  switch (chainId) {
    case 'evmos_9000-4':
      return `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}txs/{{txHash}}`
    case 'theta-testnet-001':
      return `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}transactions/{{txHash}}`
    default:
      return `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}transaction/{{txHash}}`
  }
}
