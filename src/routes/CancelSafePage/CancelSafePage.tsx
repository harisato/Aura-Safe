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
import { CANCEL_SPECIFIC_SAFE_ROUTE, extractPrefixedSafeAddress, ROOT_ROUTE } from '../routes'
import ReviewAllowStep from './steps/ReviewAllowStep'
import Hairline from '../../components/layout/Hairline'
import {
  CancelSafeFormValues,
  FIELD_CREATE_CUSTOM_SAFE_NAME,
  FIELD_CREATE_SUGGESTED_SAFE_NAME,
  FIELD_SAFE_THRESHOLD,
  FIELD_SAFE_OWNERS_LIST,
  OwnerFieldItem,
} from './fields/cancelSafeFields'
import { cancelMSafe, getMSafeInfo, ISafeCancel } from 'src/services'
import { useDispatch, useSelector } from 'react-redux'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { enhanceSnackbarForAction, ERROR, SUCCESS } from 'src/logic/notifications'
import { MESSAGES_CODE } from 'src/services/constant/message'

function Cancel(): ReactElement {
  const history = useHistory()
  const dispatch = useDispatch()
  const isStepLabelClickable = true
  const classes = useStyles({ isStepLabelClickable })
  const { safeAddress, safeId } = extractPrefixedSafeAddress(undefined, CANCEL_SPECIFIC_SAFE_ROUTE)
  const safeRandomName = useMnemonicSafeName()
  const myAddress = useSelector(userAccountSelector)

  const [initialFormValues, setInitialFormValues] = useState<CancelSafeFormValues>()

  useEffect(() => {

    const checkSafeAddress = async () => {
      if (!safeId) {
        return
      }

      const initialValues: CancelSafeFormValues = {
        [FIELD_CREATE_SUGGESTED_SAFE_NAME]: '',
        [FIELD_CREATE_CUSTOM_SAFE_NAME]: '',
        [FIELD_SAFE_OWNERS_LIST]: [],
        [FIELD_SAFE_THRESHOLD]: 0,
      }

      try {
        const { owners, threshold } = await getMSafeInfo(safeId)

        const ownerList: Array<OwnerFieldItem> = owners.map((address) => ({
          address: address,
          name: '',
        }))

        initialValues[FIELD_SAFE_OWNERS_LIST] = [...ownerList]
        initialValues[FIELD_SAFE_THRESHOLD] = threshold

        setInitialFormValues(initialValues)
      } catch (error) {}
    }

    checkSafeAddress()
  }, [safeAddress, safeRandomName, safeId])

  const onSubmitCancelSafe = async (values: CancelSafeFormValues): Promise<void> => {
    if (!safeId) {
      return
    }

    const cancelSafePayload: ISafeCancel = {
      myAddress,
    }

    const { ErrorCode, Message } = await cancelMSafe(safeId, cancelSafePayload)

    if (ErrorCode === MESSAGES_CODE.SUCCESSFUL.ErrorCode) {
      dispatch(
        enqueueSnackbar(
          enhanceSnackbarForAction({
            message: Message,
            options: { variant: SUCCESS, persist: false, autoHideDuration: 5000 },
          }),
        ),
      )

      history.push(ROOT_ROUTE)
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
