import { makeStyles, Paper } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import { ReactElement, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Block from 'src/components/layout/Block'
import Heading from 'src/components/layout/Heading'
import Page from 'src/components/layout/Page'
import Row from 'src/components/layout/Row'
import { useMnemonicSafeName } from 'src/logic/hooks/useMnemonicName'
import { boldFont, lg, secondary, sm } from 'src/theme/variables'
import { isValidAddress } from 'src/utils/isValidAddress'
import styled from 'styled-components'
import GnoForm from '../../components/forms/GnoForm'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import { ALLOW_SPECIFIC_SAFE_ROUTE, extractPrefixedSafeAddress } from '../routes'
import { FIELD_ALLOW_SAFE_ADDRESS, LoadSafeFormValues as AllowSafeFormValues } from './fields/loadFields'
import ReviewAllowStep from './steps/ReviewAllowStep'
import Hairline from '../../components/layout/Hairline'

function Cancel(): ReactElement {
  // const dispatch = useDispatch()
  const history = useHistory()
  const isStepLabelClickable = true
  const classes = useStyles({ isStepLabelClickable })
  const { safeAddress } = extractPrefixedSafeAddress(undefined, ALLOW_SPECIFIC_SAFE_ROUTE)
  const safeRandomName = useMnemonicSafeName()
  const [initialFormValues, setInitialFormValues] = useState<AllowSafeFormValues>()
  // const addressBook = useSelector(currentNetworkAddressBookAsMap)
  // const chainId = useSelector(currentChainId)

  useEffect(() => {
    const initialValues: AllowSafeFormValues = JSON.parse(`{
      "suggestedSafeName": "astonishing-rinkeby-safe",
      "safeAddress": "0x7e2fE2302d6c02cc2d900cEc29B8f45F30a9369a",
      "isLoadingSafeAddress": false,
      "safeOwnerList": [
          {
              "address": "0x8Aaec6068610E46Ae770da1bb5E18F80d1701985",
              "name": "",
              "chainId": "4"
          },
          {
              "address": "0x6e0Ee569FFc8982cc60B3f450e0C2E5509727212",
              "name": "",
              "chainId": "4"
          }
      ],
      "safeThreshold": 2,
      "owner-address-0x8Aaec6068610E46Ae770da1bb5E18F80d1701985": "",
      "owner-address-0x6e0Ee569FFc8982cc60B3f450e0C2E5509727212": ""
    }`)
    // const initialValues: AllowSafeFormValues = {
    //   [FIELD_ALLOW_SUGGESTED_SAFE_NAME]: safeRandomName,
    //   [FIELD_ALLOW_SAFE_ADDRESS]: safeAddress,
    //   [FIELD_ALLOW_IS_LOADING_SAFE_ADDRESS]: false,
    //   [FIELD_SAFE_OWNER_LIST]: [],
    // }

    setInitialFormValues(initialValues)
  }, [safeAddress, safeRandomName])

  // const updateAddressBook = (values: AllowSafeFormValues) => {
  //   const ownerList = values[FIELD_SAFE_OWNER_LIST] as AddressBookEntry[]

  //   const ownerEntries = ownerList
  //     .map((owner) => {
  //       const ownerFieldName = `owner-address-${owner.address}`
  //       const ownerNameValue = values[ownerFieldName]
  //       return {
  //         ...owner,
  //         name: ownerNameValue,
  //       }
  //     })
  //     .filter((owner) => !!owner.name)

  //   const safeEntry = makeAddressBookEntry({
  //     address: checksumAddress(values[FIELD_ALLOW_SAFE_ADDRESS] || ''),
  //     name: getLoadSafeName(values, addressBook),
  //     chainId,
  //   })

  //   dispatch(addressBookSafeLoad([...ownerEntries, safeEntry]))
  // }

  const onSubmitCancelSafe = async (values: AllowSafeFormValues): Promise<void> => {
    console.log('onSubmitCancelSafe values:', values)

    const address = values[FIELD_ALLOW_SAFE_ADDRESS]
    if (!isValidAddress(address)) {
      return
    }

    // updateAddressBook(values)

    // const checksummedAddress = checksumAddress(address || '')
    // const safeProps = await buildSafe(checksummedAddress)
    // const storedSafes = loadStoredSafes() || {}
    // storedSafes[checksummedAddress] = safeProps

    // saveSafes(storedSafes)
    // dispatch(addOrUpdateSafe(safeProps))

    // // Go to the newly added Safe
    // history.push(
    //   generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, {
    //     shortName: getShortName(),
    //     safeAddress: checksummedAddress,
    //   }),
    // )
  }

  const onClickPreviousStep = () => {}
  const backButtonLabel = 'Back'
  const nextButtonLabel = 'Cancel Safe'

  return (
    <Page>
      <Block>
        <Row align="center">
          <BackIcon disableRipple onClick={history.goBack}>
            <ChevronLeft />
          </BackIcon>
          <Heading tag="h2">Cancel Safe Creation</Heading>
        </Row>

        <GnoForm initialValues={initialFormValues} onSubmit={onSubmitCancelSafe}>
          {/* <ReviewAllowStep /> */}
          {() => {
            return (
              <Paper elevation={1} className={classes.root}>
                <ReviewAllowStep />

                <Hairline />
                <Row align="center" grow className={classes.controlStyle}>
                  <Col center="xs" xs={12}>
                    <Button onClick={onClickPreviousStep} size="small" className={classes.backButton} type="button">
                      {backButtonLabel}
                    </Button>
                    <Button
                      color="primary"
                      type="submit"
                      size="small"
                      className={classes.nextButton}
                      variant="contained"
                      disabled
                    >
                      {nextButtonLabel}
                    </Button>
                  </Col>
                </Row>
              </Paper>
            )
          }}
        </GnoForm>

        {/* key={safeAddress} ensures that it goes to step 1 when the address changes */}
      </Block>
    </Page>
  )
}

export default Cancel

const BackIcon = styled(IconButton)`
  color: ${secondary};
  padding: ${sm};
  margin-right: 5px;
`
const useStyles = makeStyles((theme) => ({
  root: {
    margin: '10px 0 10px 10px',
    maxWidth: '770px',
    boxShadow: '0 0 10px 0 rgba(33,48,77,0.10)',
  },
  controlStyle: {
    backgroundColor: 'white',
    padding: lg,
    borderRadius: sm,
  },
  backButton: {
    marginRight: sm,
    fontWeight: boldFont,
    color: theme.palette.secondary.main,
  },
  nextButton: {
    fontWeight: boldFont,
  },
  stepLabel: {
    cursor: ({ isStepLabelClickable }: any) => (isStepLabelClickable ? 'pointer' : 'inherit'),
  },
}))
