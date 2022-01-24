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
import { isValidAddress } from 'src/utils/isValidAddress'
import { AddressBookEntry, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addressBookSafeLoad } from 'src/logic/addressBook/store/actions'
import { checksumAddress } from 'src/utils/checksumAddress'
import { buildSafe } from 'src/logic/safe/store/actions/fetchSafe'
import { loadStoredSafes, saveSafes } from 'src/logic/safe/utils'
import { addOrUpdateSafe } from 'src/logic/safe/store/actions/addOrUpdateSafe'
import {
  FIELD_ALLOW_IS_LOADING_SAFE_ADDRESS,
  FIELD_ALLOW_SAFE_ADDRESS,
  FIELD_ALLOW_SUGGESTED_SAFE_NAME,
  FIELD_SAFE_OWNER_LIST,
  LoadSafeFormValues as AllowSafeFormValues,
} from './fields/loadFields'
import { ALLOW_SPECIFIC_SAFE_ROUTE, extractPrefixedSafeAddress, generateSafeRoute, SAFE_ROUTES } from '../routes'
import { getShortName } from 'src/config'
import { currentNetworkAddressBookAsMap } from 'src/logic/addressBook/store/selectors'
import { getLoadSafeName } from './fields/utils'
import { currentChainId } from 'src/logic/config/store/selectors'
import NameAllowSafeStep, { nameNewSafeStepLabel } from './steps/NameAllowSafeStep'

function Allow(): ReactElement {
  const dispatch = useDispatch()
  const history = useHistory()
  const { safeAddress } = extractPrefixedSafeAddress(undefined, ALLOW_SPECIFIC_SAFE_ROUTE)
  const safeRandomName = useMnemonicSafeName()
  const [initialFormValues, setInitialFormValues] = useState<AllowSafeFormValues>()
  const addressBook = useSelector(currentNetworkAddressBookAsMap)
  const chainId = useSelector(currentChainId)

  useEffect(() => {
    const initialValues: AllowSafeFormValues = {
      [FIELD_ALLOW_SUGGESTED_SAFE_NAME]: safeRandomName,
      [FIELD_ALLOW_SAFE_ADDRESS]: safeAddress,
      [FIELD_ALLOW_IS_LOADING_SAFE_ADDRESS]: false,
      [FIELD_SAFE_OWNER_LIST]: [],
    }

    setInitialFormValues(initialValues)
  }, [safeAddress, safeRandomName])

  const updateAddressBook = (values: AllowSafeFormValues) => {
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
      address: checksumAddress(values[FIELD_ALLOW_SAFE_ADDRESS] || ''),
      name: getLoadSafeName(values, addressBook),
      chainId,
    })

    dispatch(addressBookSafeLoad([...ownerEntries, safeEntry]))
  }

  const onSubmitLoadSafe = async (values: AllowSafeFormValues): Promise<void> => {
    const address = values[FIELD_ALLOW_SAFE_ADDRESS]
    if (!isValidAddress(address)) {
      return
    }

    updateAddressBook(values)

    const checksummedAddress = checksumAddress(address || '')
    const safeProps = await buildSafe(checksummedAddress)
    const storedSafes = loadStoredSafes() || {}
    storedSafes[checksummedAddress] = safeProps

    saveSafes(storedSafes)
    dispatch(addOrUpdateSafe(safeProps))

    // Go to the newly added Safe
    history.push(
      generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, {
        shortName: getShortName(),
        safeAddress: checksummedAddress,
      }),
    )
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
          onSubmit={onSubmitLoadSafe}
          key={safeAddress}
        >
          <StepFormElement label={nameNewSafeStepLabel} nextButtonLabel="Continue">
            <NameAllowSafeStep />
          </StepFormElement>
          <StepFormElement label={loadSafeOwnersStepLabel} nextButtonLabel="Continue">
            <AllowSafeOwnersStep />
          </StepFormElement>
          <StepFormElement label={reviewLoadStepLabel} nextButtonLabel="Add">
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
