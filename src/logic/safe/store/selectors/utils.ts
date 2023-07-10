import memoize from 'lodash/memoize'
import hash from 'object-hash'
import { createSelectorCreator } from 'reselect'

import { AppReduxState } from 'src/logic/safe/store'

const hashFn = (gatewayTransactions: AppReduxState['gatewayTransactions'], safeAddress: string): string =>
  hash(gatewayTransactions[safeAddress] ?? {})

export const createHashBasedSelector = createSelectorCreator(memoize as any, hashFn)
