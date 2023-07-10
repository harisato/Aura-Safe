interface IConfiguration {
  apiGateway: string | null
  chainId: string | null
  chainInfo: any[]
  env: string
}

export const getGatewayUrl = async (): Promise<IConfiguration> => {
  return fetch('config.json')
    .then((res) => res.json())
    .then((config: any) => {
      const data = {
        apiGateway: config['api-gateway'],
        chainInfo: config['chain_info'],
        chainId: config['chain_id'],
        env: config['environment'],
      }
      return data
    })
    .catch((err: any) => {
      console.error(err)
      return {
        apiGateway: null,
        chainId: null,
        chainInfo: [],
        env: 'development',
      }
    })
}

export function getExplorerUrl(
  chainId: string,
  baseUrl: string,
  type: 'txHash' | 'address' | 'api' | 'proposals' | 'contract',
): string {
  switch (type) {
    case 'txHash':
      return getExplorerUrlTxHash(chainId, baseUrl)
    case 'contract':
      return `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}contracts/{{contract}}`
    case 'address':
      // if (baseUrl.includes('canto')) {
      //   return `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}accounts/{{address}}`
      // }
      return `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}account/{{address}}`
    case 'proposals':
      if (baseUrl.includes('aura')) {
        return `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}votings/{{proposalsId}}`
      }
      // if (baseUrl.includes('canto')) {
      //   return `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}votes/{{proposalsId}}`
      // }
      return `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}proposals/{{proposalsId}}`

    case 'api':
      return `${
        baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'
      }api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}`
    default:
      return baseUrl
  }
}

function getExplorerUrlTxHash(chainId: string, baseUrl: string): string {
  if (chainId.includes('evmos') || chainId.includes('canto')) {
    return `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}tx/{{txHash}}`
  }
  if (chainId.includes('theta')) {
    return `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}transactions/{{txHash}}`
  }
  return `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}transaction/{{txHash}}`
}
