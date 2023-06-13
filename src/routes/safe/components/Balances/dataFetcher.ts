import { List } from 'immutable'
import { TableColumn } from 'src/components/Table/types.d'
import { Token } from 'src/logic/tokens/store/model/token'
import { formatAmountInUsFormat } from 'src/logic/tokens/utils/formatAmount'
import { formatNativeCurrency } from 'src/utils'
export const BALANCE_TABLE_ASSET_ID = 'asset'
export const BALANCE_TABLE_BALANCE_ID = 'balance'
const BALANCE_TABLE_VALUE_ID = 'value'

const getTokenPriceInCurrency = (balance: string, currencySelected?: string): string => {
  if (!currencySelected) {
    return Number('').toFixed(6)
  }
  return `${formatAmountInUsFormat(Number(balance).toFixed(6))} ${currencySelected}`
}

export interface BalanceData {
  asset: { name: string; logoUri: string; address: string; symbol: string }
  assetOrder: string
  balance: string
  balanceOrder: number
  value: string
  valueOrder: number
}
export const getBalanceData = (safeTokens: List<Token>, currencySelected?: string): List<BalanceData> => {
  return safeTokens.map((token) => {
    const { tokenBalance, fiatBalance } = token.balance
    return {
      [BALANCE_TABLE_ASSET_ID]: {
        name: token.name,
        logoUri: token.logoUri || '',
        address: token.address,
        symbol: token.symbol,
      },
      assetOrder: token.name,
      [BALANCE_TABLE_BALANCE_ID]: `${formatNativeCurrency(tokenBalance || '0.000000')}`,
      balanceOrder: Number(tokenBalance),
      [BALANCE_TABLE_VALUE_ID]: getTokenPriceInCurrency(fiatBalance || '0.000000', currencySelected),
      valueOrder: Number(tokenBalance),
    }
  })
}

export const generateColumns = (): List<TableColumn> => {
  const assetColumn: TableColumn = {
    id: BALANCE_TABLE_ASSET_ID,
    order: true,
    disablePadding: false,
    label: 'Name',
    custom: false,
    static: true,
    width: 300,
  }

  const balanceColumn: TableColumn = {
    id: BALANCE_TABLE_BALANCE_ID,
    align: 'right',
    order: true,
    disablePadding: false,
    label: 'Balance',
    custom: false,
    static: true,
  }

  const actions: TableColumn = {
    id: 'actions',
    order: false,
    disablePadding: false,
    label: '',
    custom: true,
    static: true,
  }

  /*   const value: TableColumn = {
    id: BALANCE_TABLE_VALUE_ID,
    align: 'right',
    order: true,
    label: 'Value',
    custom: false,
    static: true,
    disablePadding: false,
   }
*/
  return List([assetColumn, balanceColumn, /* value, */ actions])
}
