import { ReactElement, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
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
} from './fields/allowFields'
import { ALLOW_SPECIFIC_SAFE_ROUTE, extractPrefixedSafeAddress, extractPrefixedSafeId } from '../routes'
import NameAllowSafeStep, { nameNewSafeStepLabel } from './steps/NameAllowSafeStep'


function Allow(): ReactElement {
  const dispatch = useDispatch()
  const history = useHistory()
  const { safeAddress, shortName, safeId } = extractPrefixedSafeAddress(undefined, ALLOW_SPECIFIC_SAFE_ROUTE)
  const safeRandomName = useMnemonicSafeName()
  const [initialFormValues, setInitialFormValues] = useState<AllowSafeFormValues>()

  useEffect(() => {
    const initialValues: AllowSafeFormValues = {
      [FIELD_ALLOW_SUGGESTED_SAFE_NAME]: safeRandomName,
      [FIELD_ALLOW_IS_LOADING_SAFE_ADDRESS]: false,
      [FIELD_ALLOW_SAFE_ID]: safeId,
      [FIELD_SAFE_OWNER_LIST]: [],
      [FIELD_ALLOW_CUSTOM_SAFE_NAME]: '',
      [FIELD_SAFE_THRESHOLD]: 0,
    }

    setInitialFormValues(initialValues)
  }, [safeAddress, safeId, safeRandomName])

  const onSubmitLoadSafe = async (values: AllowSafeFormValues): Promise<void> => {


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
        <StepperForm initialValues={initialFormValues} testId="load-safe-form" onSubmit={onSubmitLoadSafe} key={safeId}>
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
