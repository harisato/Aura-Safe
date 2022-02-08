import { ReactElement, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'

import Block from 'src/components/layout/Block'
import Page from 'src/components/layout/Page'
import Heading from 'src/components/layout/Heading'
import Row from 'src/components/layout/Row'
import { secondary, sm } from 'src/theme/variables'
import AllowSafeOwnersStep, { loadSafeOwnersStepLabel } from './steps/AllowSafeOwnersStep'
import ReviewAllowStep, { reviewLoadStepLabel } from './steps/ReviewAllowStep'
import { useMnemonicSafeName } from 'src/logic/hooks/useMnemonicName'
import StepperForm, { StepFormElement } from 'src/components/StepperForm/StepperForm'
import {
  FIELD_ALLOW_CUSTOM_SAFE_NAME,
  FIELD_ALLOW_IS_LOADING_SAFE_ADDRESS,
  FIELD_ALLOW_SAFE_ID,
  FIELD_ALLOW_SUGGESTED_SAFE_NAME,
  FIELD_SAFE_OWNER_LIST,
  FIELD_SAFE_THRESHOLD,
  LoadSafeFormValues as AllowSafeFormValues,
  OwnerFieldListItem,
} from './fields/allowFields'
import {
  ALLOW_SPECIFIC_SAFE_ROUTE,
  extractPrefixedSafeAddress,
  generateSafeRoute,
  SAFE_ROUTES,
  WELCOME_ROUTE,
} from '../routes'
import NameAllowSafeStep, { nameNewSafeStepLabel } from './steps/NameAllowSafeStep'
import { allowMSafe, getMSafeInfo } from 'src/services'
import { AddressBookEntry, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { currentNetworkAddressBookAsMap } from 'src/logic/addressBook/store/selectors'
import { getLoadSafeName } from './fields/utils'
import { currentChainId } from 'src/logic/config/store/selectors'
import { addressBookSafeLoad } from 'src/logic/addressBook/store/actions'
import { getKeplrKey } from 'src/logic/keplr/keplr'
import { MESSAGES_CODE } from 'src/services/constant/message'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { enhanceSnackbarForAction, ERROR } from 'src/logic/notifications'
import { SafeStatus } from 'src/logic/safe/hooks/useOwnerSafes'
import { buildMSafe } from 'src/logic/safe/store/actions/fetchSafe'
import { addOrUpdateSafe } from 'src/logic/safe/store/actions/addOrUpdateSafe'
import { getShortName, _getChainId } from 'src/config'
import { loadStoredSafes, saveSafes } from 'src/logic/safe/utils'

function Allow(): ReactElement {
  const dispatch = useDispatch()
  const history = useHistory()
  const { safeAddress, shortName, safeId } = extractPrefixedSafeAddress(undefined, ALLOW_SPECIFIC_SAFE_ROUTE)
  const safeRandomName = useMnemonicSafeName()
  const [initialFormValues, setInitialFormValues] = useState<AllowSafeFormValues>()
  const addressBook = useSelector(currentNetworkAddressBookAsMap)
  const chainId = useSelector(currentChainId)

  console.log({ safeAddress, shortName, safeId })

  useEffect(() => {
    const checkSafeAddress = async () => {
      if (!safeId) {
        return
      }

      const initialValues: AllowSafeFormValues = {
        [FIELD_ALLOW_SUGGESTED_SAFE_NAME]: safeRandomName,
        [FIELD_ALLOW_IS_LOADING_SAFE_ADDRESS]: false,
        [FIELD_ALLOW_SAFE_ID]: safeId,
        [FIELD_SAFE_OWNER_LIST]: [],
        [FIELD_ALLOW_CUSTOM_SAFE_NAME]: '',
        [FIELD_SAFE_THRESHOLD]: 0,
      }

      try {
        const { owners, threshold } = await getMSafeInfo(safeId)

        const ownerList: Array<OwnerFieldListItem> = owners.map((address) => ({
          address: address,
          name: '',
        }))

        initialValues[FIELD_SAFE_OWNER_LIST] = [...ownerList]
        initialValues[FIELD_SAFE_THRESHOLD] = threshold

        setInitialFormValues(initialValues)
      } catch (error) {}
    }

    checkSafeAddress()
  }, [safeAddress, safeId, safeRandomName])

  const updateAddressBook = (newAddress: string, values: AllowSafeFormValues) => {
    const ownerList = values[FIELD_SAFE_OWNER_LIST] as AddressBookEntry[]

    const ownerEntries = ownerList
      .map((owner) => {
        const ownerFieldName = `owner-address-${owner.address}`
        const ownerNameValue = values[ownerFieldName]
        return {
          ...owner,
          name: ownerNameValue,
        }
      })
      .filter((owner) => !!owner.name)

    const safeEntry = makeAddressBookEntry({
      address: newAddress,
      name: getLoadSafeName(values, addressBook),
      chainId,
    })

    dispatch(addressBookSafeLoad([...ownerEntries, safeEntry]))
  }

  const onSubmitAllowSafe = async (values: AllowSafeFormValues): Promise<void> => {
    const id = values[FIELD_ALLOW_SAFE_ID]
    const walletKey = await getKeplrKey(chainId)

    if (!id || !walletKey) {
      return
    }

    const { ErrorCode, Message, Data: safeData } = await allowMSafe(id, walletKey)

    if (ErrorCode === MESSAGES_CODE.SUCCESSFUL.ErrorCode) {
      if (safeData.status === SafeStatus.Created) {
        const { safeAddress, id } = safeData
        const safeProps = await buildMSafe(safeAddress, id)

        const storedSafes = loadStoredSafes() || {}

        storedSafes[safeAddress] = safeProps

        saveSafes(storedSafes)
        updateAddressBook(safeAddress, values)

        dispatch(addOrUpdateSafe(safeProps))

        history.push(
          generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, {
            shortName: getShortName(),
            safeAddress: safeAddress,
            safeId: id,
          }),
        )
      } else {
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
          <StepFormElement label={nameNewSafeStepLabel} nextButtonLabel="Continue">
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

const BackIcon = styled(IconButton)`
  color: ${secondary};
  padding: ${sm};
  margin-right: 5px;
`
