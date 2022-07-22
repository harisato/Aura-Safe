import { Text } from '@aura/safe-aura-components'
import { makeStyles, Paper } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import { ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import ButtonGradient from 'src/components/ButtonGradient'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Heading from 'src/components/layout/Heading'
import Page from 'src/components/layout/Page'
import Row from 'src/components/layout/Row'
import { currentNetworkAddressBookAsMap } from 'src/logic/addressBook/store/selectors'
import { useMnemonicSafeName } from 'src/logic/hooks/useMnemonicName'
import { enhanceSnackbarForAction, ERROR, SUCCESS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { cancelMSafe, getMSafeInfo, ISafeCancel } from 'src/services'
import { MESSAGES_CODE } from 'src/services/constant/message'
import { boldFont, lg, secondary, sm } from 'src/theme/variables'
import { loadFromStorage } from 'src/utils/storage'
import styled from 'styled-components'
import GnoForm from '../../components/forms/GnoForm'
import Hairline from '../../components/layout/Hairline'
import { PendingSafeListStorage } from '../CreateSafePage/CreateSafePage'
import { SAFES_PENDING_STORAGE_KEY } from '../CreateSafePage/fields/createSafeFields'
import { CANCEL_SPECIFIC_SAFE_ROUTE, extractPrefixedSafeAddress, ROOT_ROUTE } from '../routes'
import {
  CancelSafeFormValues,
  FIELD_ALLOW_SAFE_ADDRESS,
  FIELD_CREATE_CUSTOM_SAFE_NAME,
  FIELD_CREATE_SUGGESTED_SAFE_NAME,
  FIELD_SAFE_CREATED_ADDRESS,
  FIELD_SAFE_OWNERS_LIST,
  FIELD_SAFE_THRESHOLD,
  OwnerFieldItem,
} from './fields/cancelSafeFields'
import ReviewAllowStep from './steps/ReviewAllowStep'

function Cancel(): ReactElement {
  const history = useHistory()
  const dispatch = useDispatch()
  const isStepLabelClickable = true
  const classes = useStyles({ isStepLabelClickable })
  const { safeAddress, safeId } = extractPrefixedSafeAddress(undefined, CANCEL_SPECIFIC_SAFE_ROUTE)
  const safeRandomName = useMnemonicSafeName()
  const myAddress = useSelector(userAccountSelector)

  const addressBook = useSelector(currentNetworkAddressBookAsMap)

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
        [FIELD_ALLOW_SAFE_ADDRESS]: '',
        [FIELD_SAFE_CREATED_ADDRESS]: '',
      }

      try {
        const { owners, threshold, createdAddress } = await getMSafeInfo(safeId)

        const safesPending = await Promise.resolve(loadFromStorage<PendingSafeListStorage>(SAFES_PENDING_STORAGE_KEY))
        const pendingSafe = safesPending?.find((e) => e.id === safeId)

        if (pendingSafe) {
          initialValues[FIELD_CREATE_SUGGESTED_SAFE_NAME] =
            pendingSafe[FIELD_CREATE_CUSTOM_SAFE_NAME] || pendingSafe[FIELD_CREATE_SUGGESTED_SAFE_NAME]
        }

        const ownerList: Array<OwnerFieldItem> = owners.map((address) => ({
          address: address,
          name: addressBook[address]?.name || '',
        }))

        initialValues[FIELD_SAFE_OWNERS_LIST] = [...ownerList]
        initialValues[FIELD_SAFE_THRESHOLD] = threshold
        initialValues[FIELD_SAFE_CREATED_ADDRESS] = createdAddress || ''

        setInitialFormValues(initialValues)
      } catch (error) {}
    }

    checkSafeAddress()
  }, [safeAddress, safeRandomName, safeId, addressBook])

  const onSubmitCancelSafe = async (values?: CancelSafeFormValues): Promise<void> => {
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
        <StyledFormContainer>
          <GnoForm initialValues={initialFormValues} onSubmit={() => {}}>
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
                      <ButtonGradient size="lg" onClick={() => onSubmitCancelSafe()}>
                        <Text size="xl" color="white">
                          {nextButtonLabel}
                        </Text>
                      </ButtonGradient>
                    </Col>
                  </Row>
                </Paper>
              )
            }}
          </GnoForm>
        </StyledFormContainer>
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
const StyledFormContainer = styled.div`
  max-width: 770px;
`

const useStyles = makeStyles((_) => ({
  root: {
    margin: '10px 0 10px 10px',
    maxWidth: '770px',
    boxShadow: '0 0 10px 0 rgba(33,48,77,0.10)',
  },
  controlStyle: {
    padding: lg,
    borderRadius: sm,
  },
  backButton: {
    marginRight: sm,
    fontWeight: boldFont,
  },
  stepLabel: {
    cursor: ({ isStepLabelClickable }: any) => (isStepLabelClickable ? 'pointer' : 'inherit'),
  },
}))
