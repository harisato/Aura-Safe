import { createSelector } from 'reselect'

import { ChainId } from 'src/config/chain.d'
import { AddressBookEntry, ADDRESS_BOOK_DEFAULT_NAME } from 'src/logic/addressBook/model/addressBook'
import { currentChainId } from 'src/logic/config/store/selectors'
import { AppReduxState } from 'src/logic/safe/store'
import { Overwrite } from 'src/types/helpers'

export const addressBookState = (state: AppReduxState): AppReduxState['addressBook'] => state['addressBook']

export type AddressBookMap = {
  [address: string]: AddressBookEntry
}

type AddressBookMapByChain = {
  [chainId: string]: AddressBookMap
}

const addressBookAsMap = createSelector([addressBookState], (addressBook): AddressBookMapByChain => {
  const addressBookMap = {}

  addressBook.forEach((entry) => {
    const { address, chainId } = entry
    if (!addressBookMap[chainId]) {
      addressBookMap[chainId] = { [address]: entry }
    } else {
      addressBookMap[chainId][address] = entry
    }
  })

  return addressBookMap
})

const getNameByAddress = (addressBook, address: string, chainId: ChainId): string => {
  // if (!isValidAddress(address)) {
  //   return ''
  // }
  return addressBook?.[chainId]?.[address]?.name || ''
}


type GetNameParams = Overwrite<Partial<AddressBookEntry>, { address: string }>

export const addressBookEntryName = createSelector(
  [
    addressBookAsMap,
    currentChainId,
    (_, { address, chainId }: GetNameParams): { address: string; chainId?: ChainId } => ({
      address,
      chainId,
    }),
  ],
  (addressBook, curChainId, { address, chainId }) => {
    return getNameByAddress(addressBook, address, chainId || curChainId) || ADDRESS_BOOK_DEFAULT_NAME
  },
)

export const addressBookName = createSelector(
  [
    addressBookAsMap,
    currentChainId,
    (_, { address, chainId }: GetNameParams): { address: string; chainId?: ChainId } => ({
      address,
      chainId,
    }),
  ],
  (addressBook, curChainId, { address, chainId }) => {
    return getNameByAddress(addressBook, address, chainId || curChainId)
  },
)

/*********************/
/* Connected Network */
/*********************/

export const currentNetworkAddressBook = createSelector(
  [addressBookState, currentChainId],
  (addressBook, curChainId): AppReduxState['addressBook'] => {
    return addressBook.filter(({ chainId }) => chainId.toString() === curChainId)
  },
)

export const currentNetworkAddressBookAddresses = createSelector(
  [currentNetworkAddressBook],
  (addressBook): string[] => {
    return addressBook.map(({ address }) => address)
  },
)

export const currentNetworkAddressBookAsMap = createSelector(
  [currentNetworkAddressBook],
  (addressBook): AddressBookMap => {
    const addressBookMap = {}

    addressBook.forEach((entry) => {
      addressBookMap[entry.address] = entry
    })

    return addressBookMap
  },
)
