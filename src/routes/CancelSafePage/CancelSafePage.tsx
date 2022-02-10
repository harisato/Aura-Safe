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
import styled from 'styled-components'
import GnoForm from '../../components/forms/GnoForm'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import { ALLOW_SPECIFIC_SAFE_ROUTE, CANCEL_SPECIFIC_SAFE_ROUTE, extractPrefixedSafeAddress } from '../routes'
import ReviewAllowStep from './steps/ReviewAllowStep'
import Hairline from '../../components/layout/Hairline'
import {
  CancelSafeFormValues,
  FIELD_CREATE_CUSTOM_SAFE_NAME,
  FIELD_CREATE_SUGGESTED_SAFE_NAME,
  FIELD_SAFE_THRESHOLD,
  FIELD_SAFE_OWNERS_LIST,
  FIELD_MAX_OWNER_NUMBER,
  OwnerFieldItem,
} from './fields/cancelSafeFields'
import { getMSafeInfo } from 'src/services'
import { OwnerFieldListItem } from './fields/loadFields'

function Cancel(): ReactElement {
  const history = useHistory()
  const isStepLabelClickable = true
  const classes = useStyles({ isStepLabelClickable })
  const { safeAddress, shortName, safeId } = extractPrefixedSafeAddress(undefined, CANCEL_SPECIFIC_SAFE_ROUTE)
  const safeRandomName = useMnemonicSafeName()
  const [initialFormValues, setInitialFormValues] = useState<CancelSafeFormValues>()

  useEffect(() => {
    // const initialValues: CancelSafeFormValues = JSON.parse(`{
    //   "suggestedSafeName": "astonishing-rinkeby-safe",
    //   "safeAddress": "0x7e2fE2302d6c02cc2d900cEc29B8f45F30a9369a",
    //   "isLoadingSafeAddress": false,
    //   "safeOwnerList": [
    //       {
    //           "address": "0x8Aaec6068610E46Ae770da1bb5E18F80d1701985",
    //           "name": "",
    //           "chainId": "4"
    //       },
    //       {
    //           "address": "0x6e0Ee569FFc8982cc60B3f450e0C2E5509727212",
    //           "name": "",
    //           "chainId": "4"
    //       }
    //   ],
    //   "safeThreshold": 2,
    //   "owner-address-0x8Aaec6068610E46Ae770da1bb5E18F80d1701985": "",
    //   "owner-address-0x6e0Ee569FFc8982cc60B3f450e0C2E5509727212": ""
    // }`)

    // setInitialFormValues(initialValues)

    const checkSafeAddress = async () => {
      if (!safeId) {
        return
      }

      const initialValues: CancelSafeFormValues = {
        [FIELD_CREATE_SUGGESTED_SAFE_NAME]: '',
        [FIELD_CREATE_CUSTOM_SAFE_NAME]: '',
        [FIELD_SAFE_OWNERS_LIST]: [],
        [FIELD_SAFE_THRESHOLD]: 0,
        [FIELD_MAX_OWNER_NUMBER]: 0,
      }

      try {
        const { owners, threshold } = await getMSafeInfo(safeId)

        
        
        const ownerList: Array<OwnerFieldItem> = owners.map((address) => ({
          address: address,
          name: '',
        }))
        console.log(ownerList);

        initialValues[FIELD_SAFE_OWNERS_LIST] = [...ownerList]
        initialValues[FIELD_SAFE_THRESHOLD] = threshold
        initialValues[FIELD_MAX_OWNER_NUMBER] = ownerList.length

        setInitialFormValues(initialValues)
      } catch (error) {}
    }

    checkSafeAddress()
  }, [safeAddress, safeRandomName, safeId])

  const onSubmitCancelSafe = async (values: CancelSafeFormValues): Promise<void> => {
    console.log('onSubmitCancelSafe values:', values)
  }

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
          {() => {
            return (
              <Paper elevation={1} className={classes.root}>
                <ReviewAllowStep />

                <Hairline />
                <Row align="center" grow className={classes.controlStyle}>
                  <Col center="xs" xs={12}>
                    <Button onClick={history.goBack} size="small" className={classes.backButton} type="button">
                      {backButtonLabel}
                    </Button>
                    <Button
                      color="primary"
                      type="submit"
                      size="small"
                      className={classes.nextButton}
                      variant="contained"
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
