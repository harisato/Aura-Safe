import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import { ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import Block from 'src/components/layout/Block'
import Heading from 'src/components/layout/Heading'
import Page from 'src/components/layout/Page'
import Row from 'src/components/layout/Row'
import StepperForm, { StepFormElement } from 'src/components/StepperForm/StepperForm'
import { getShortName } from 'src/config'
import { AddressBookEntry, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addressBookSafeLoad } from 'src/logic/addressBook/store/actions'
import { currentNetworkAddressBookAsMap } from 'src/logic/addressBook/store/selectors'
import { currentChainId } from 'src/logic/config/store/selectors'
import { useMnemonicSafeName } from 'src/logic/hooks/useMnemonicName'
import { getKeplrKey, WalletKey } from 'src/logic/keplr/keplr'
import { enhanceSnackbarForAction, ERROR } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { SafeStatus } from 'src/logic/safe/hooks/useOwnerSafes'
import { addOrUpdateSafe } from 'src/logic/safe/store/actions/addOrUpdateSafe'
import { buildMSafe } from 'src/logic/safe/store/actions/fetchSafe'
import { loadStoredSafes, saveSafes } from 'src/logic/safe/utils'
import { PendingSafeListStorage } from 'src/routes/CreateSafePage/CreateSafePage'
import { SAFES_PENDING_STORAGE_KEY } from 'src/routes/CreateSafePage/fields/createSafeFields'
import { allowMSafe, getMSafeInfo } from 'src/services'
import { MESSAGES_CODE } from 'src/services/constant/message'
import { secondary, sm } from 'src/theme/variables'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { WALLETS_NAME } from '../../logic/wallets/constant/wallets'
import { loadLastUsedProvider } from '../../logic/wallets/store/middlewares/providerWatcher'
import {
  ALLOW_SPECIFIC_SAFE_ROUTE,
  extractPrefixedSafeAddress,
  generateSafeRoute,
  SAFE_ROUTES,
  WELCOME_ROUTE,
} from '../routes'
import {
  AllowSafeFormValues,
  FIELD_ALLOW_CUSTOM_SAFE_NAME,
  FIELD_ALLOW_IS_LOADING_SAFE_ADDRESS,
  FIELD_ALLOW_SAFE_ID,
  FIELD_ALLOW_SUGGESTED_SAFE_NAME,
  FIELD_SAFE_OWNERS_LIST,
  FIELD_SAFE_OWNER_LIST,
  FIELD_SAFE_THRESHOLD,
  OwnerFieldListItem,
} from './fields/allowFields'
import { getLoadSafeName } from './fields/utils'
import AllowSafeOwnersStep, { loadSafeOwnersStepLabel } from './steps/AllowSafeOwnersStep'
import NameAllowSafeStep, { loadSafeStepValidations, nameNewSafeStepLabel } from './steps/NameAllowSafeStep'
import ReviewAllowStep, { reviewLoadStepLabel } from './steps/ReviewAllowStep'
import _ from 'lodash'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'

const BackIcon = styled(IconButton)`
  color: ${secondary};
  padding: ${sm};
  margin-right: 5px;
`

function Allow(): ReactElement {
  const dispatch = useDispatch()
  const history = useHistory()
  const { safeId } = extractPrefixedSafeAddress(undefined, ALLOW_SPECIFIC_SAFE_ROUTE)
  const safeRandomName = useMnemonicSafeName()

  const [initialFormValues, setInitialFormValues] = useState<AllowSafeFormValues>()
  const addressBook = useSelector(currentNetworkAddressBookAsMap)
  const chainId = useSelector(currentChainId)

  const userAccount = useSelector(userAccountSelector)

  useEffect(() => {
    if (!safeId) {
      return
    }

    const initialValues: AllowSafeFormValues = {
      [FIELD_ALLOW_SUGGESTED_SAFE_NAME]: safeRandomName,
      [FIELD_ALLOW_IS_LOADING_SAFE_ADDRESS]: true,
      [FIELD_ALLOW_SAFE_ID]: safeId,
      [FIELD_SAFE_OWNER_LIST]: [],
      [FIELD_ALLOW_CUSTOM_SAFE_NAME]: '',
      [FIELD_SAFE_THRESHOLD]: 0,
    }

    Promise.all([
      Promise.resolve(loadFromStorage<PendingSafeListStorage>(SAFES_PENDING_STORAGE_KEY, `${userAccount}_`)),
      getMSafeInfo(safeId),
    ])
      .then(([pendingSafes, mSafeInfo]) => {
        const pendingSafe = pendingSafes?.find((e) => e.id === safeId)
        const { owners, threshold } = mSafeInfo

        const ownerList: Array<OwnerFieldListItem> = owners.map((address, idx) => {
          const pendingOwnerList = pendingSafe?.[FIELD_SAFE_OWNERS_LIST] || []
          const pendingOwner = pendingOwnerList[idx] // ?.nameFieldName

          const name = pendingSafe && pendingOwner ? pendingSafe[pendingOwner.nameFieldName] : ''

          return {
            address: address,
            name, // : pendingSafe && pendingOwner ? pendingSafe[pendingOwner] : '',
          }
        })

        initialValues[FIELD_SAFE_OWNER_LIST] = [...ownerList]
        initialValues[FIELD_SAFE_THRESHOLD] = threshold
        initialValues[FIELD_ALLOW_IS_LOADING_SAFE_ADDRESS] = false

        setInitialFormValues(initialValues)
      })
      .catch((error) => {
        console.log('error AllowSafeFormValues', error)
        dispatch(
          enqueueSnackbar(
            enhanceSnackbarForAction({
              message: 'Can not load Safe',
              options: { variant: ERROR, persist: false, autoHideDuration: 5000 },
            }),
          ),
        )
      })
  }, [safeId, dispatch, safeRandomName, userAccount])

  const updateAddressBook = (newAddress: string, values: AllowSafeFormValues) => {
    const ownerList = values[FIELD_SAFE_OWNER_LIST] as AddressBookEntry[]
    const ownerEntries = ownerList
      .map((owner) => {
        const ownerFieldName = `owner-address-${owner.address}`
        const ownerNameValue = values[ownerFieldName]
        return {
          ...owner,
          name: ownerNameValue,
          chainId,
        }
      })
      .filter((owner) => !!owner.name)

    if (newAddress) {
      ownerEntries.push(
        makeAddressBookEntry({
          address: newAddress,
          name: getLoadSafeName(values, addressBook),
          chainId,
        }),
      )
    }

    dispatch(addressBookSafeLoad([...ownerEntries]))
  }

  const onSubmitAllowSafe = async (values: AllowSafeFormValues): Promise<void> => {
    const id = values[FIELD_ALLOW_SAFE_ID]

    const safeName = values[FIELD_ALLOW_CUSTOM_SAFE_NAME] || values[FIELD_ALLOW_SUGGESTED_SAFE_NAME]

    const lastUsedProvider = await loadLastUsedProvider()

    let walletKey: WalletKey | undefined

    if (lastUsedProvider === WALLETS_NAME.Keplr) {
      walletKey = await getKeplrKey(chainId)
    }

    if (!id || !walletKey) {
      return
    }

    const { ErrorCode, Message, Data: safeData } = await allowMSafe(id, walletKey)

    if (ErrorCode === MESSAGES_CODE.SUCCESSFUL.ErrorCode) {
      const { safeAddress, id } = safeData
      updateAddressBook(safeAddress, values)

      if (safeData.status === SafeStatus.Created) {
        const safeProps = await buildMSafe(safeAddress, id)

        const storedSafes = loadStoredSafes() || {}

        storedSafes[safeAddress] = safeProps

        saveSafes(storedSafes)

        dispatch(addOrUpdateSafe(safeProps))

        history.push(
          generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, {
            shortName: getShortName(),
            safeAddress: safeAddress,
            safeId: id,
          }),
        )
      } else {
        const safesPending = loadFromStorage<PendingSafeListStorage>(SAFES_PENDING_STORAGE_KEY, `${userAccount}_`) || []

        const safe = _.find(safesPending, ['id', id])

        if (safe) {
          _.assign(safe, {
            suggestedSafeName: safeName,
          })
        } else {
          _.assign(safesPending, [
            ...safesPending,
            {
              id,
              suggestedSafeName: safeName,
            },
          ])
        }

        saveToStorage(SAFES_PENDING_STORAGE_KEY, safesPending, `${userAccount}_`)

        history.push(WELCOME_ROUTE)
      }
    } else {
      dispatch(
        enqueueSnackbar(
          enhanceSnackbarForAction({
            message: Message,
            options: { variant: ERROR, persist: false, autoHideDuration: 5000 },
          }),
        ),
      )
    }
  }

  return (
    <Page>
      <Block>
        <Row align="center">
          <BackIcon disableRipple onClick={history.goBack}>
            <ChevronLeft />
          </BackIcon>
          <Heading tag="h2">Allow New Safe</Heading>
        </Row>

        {/* key={safeAddress} ensures that it goes to step 1 when the address changes */}
        <StepperForm
          initialValues={initialFormValues}
          testId="load-safe-form"
          onSubmit={onSubmitAllowSafe}
          key={safeId}
        >
          <StepFormElement label={nameNewSafeStepLabel} nextButtonLabel="Continue" validate={loadSafeStepValidations}>
            <NameAllowSafeStep />
          </StepFormElement>
          <StepFormElement label={loadSafeOwnersStepLabel} nextButtonLabel="Continue">
            <AllowSafeOwnersStep />
          </StepFormElement>
          <StepFormElement label={reviewLoadStepLabel} nextButtonLabel="Allow">
            <ReviewAllowStep />
          </StepFormElement>
        </StepperForm>
      </Block>
    </Page>
  )
}

export default Allow
