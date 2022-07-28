import { ReactElement, useEffect, useState } from 'react'
import { useField, useForm } from 'react-final-form'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import { useStepper } from 'src/components/Stepper/stepperContext'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import { lg } from 'src/theme/variables'
import { AddressBookEntry, makeAddressBookEntry } from '../../../logic/addressBook/model/addressBook'
import { currentNetworkAddressBookAsMap } from '../../../logic/addressBook/store/selectors'
import { currentChainId } from '../../../logic/config/store/selectors'
import {
  FIELD_ALLOW_CUSTOM_SAFE_NAME,
  FIELD_ALLOW_IS_LOADING_SAFE_ADDRESS,
  FIELD_ALLOW_SAFE_ID,
  FIELD_ALLOW_SUGGESTED_SAFE_NAME,
  FIELD_SAFE_OWNER_LIST,
  FIELD_SAFE_THRESHOLD,
} from '../fields/allowFields'

import { getMSafeInfo } from 'src/services'

const BlockWithPadding = styled(Block)`
  padding: ${lg};
`

const FieldContainer = styled(Block)`
  display: flex;
  max-width: 480px;
  margin-top: 12px;
`

export const nameNewSafeStepLabel = 'Name'

function NameAllowSafeStep(): ReactElement {
  const allowSafeForm = useForm()
  const formValues = allowSafeForm.getState().values
  const ownersList = formValues[FIELD_SAFE_OWNER_LIST]

  const [threshold, setThreshold] = useState<number>()

  const [ownersWithName, setOwnersWithName] = useState<AddressBookEntry[]>(ownersList)

  const provider = useSelector(providerNameSelector)

  const addressBook = useSelector(currentNetworkAddressBookAsMap)
  const chainId = useSelector(currentChainId)

  const { setCurrentStep } = useStepper()

  const {
    input: { value: safeId },
  } = useField(FIELD_ALLOW_SAFE_ID)

  const {
    input: { value: safeOwners },
  } = useField(FIELD_SAFE_OWNER_LIST)

  useEffect(() => {
    if (!provider) {
      setCurrentStep(0)
    }
  }, [provider, setCurrentStep])

  useEffect(() => {
    const checkSafeAddress = async () => {
      if (!safeId) {
        return
      }

      try {
        const { owners, threshold } = await getMSafeInfo(safeId)

        const ownersWithName = owners.map((address, index) =>
          makeAddressBookEntry(addressBook[address] || { address, name: safeOwners[index].name, chainId }),
        )

        setOwnersWithName(ownersWithName)
        setThreshold(threshold)
      } catch (error) {
        setOwnersWithName([])
        setThreshold(undefined)
      }
    }

    checkSafeAddress()
  }, [safeId, addressBook, chainId, allowSafeForm, safeOwners])

  useEffect(() => {
    if (threshold) {
      allowSafeForm.change(FIELD_SAFE_THRESHOLD, threshold)
    }
  }, [threshold, allowSafeForm])

  useEffect(() => {
    if (ownersWithName) {
      allowSafeForm.change(FIELD_SAFE_OWNER_LIST, ownersWithName)
    }
  }, [ownersWithName, allowSafeForm])

  return (
    <BlockWithPadding data-testid={'create-safe-name-step'}>
      <Block margin="md">
        <Paragraph color="primary" noMargin size="lg">
          You are about to give your permission to co-create a new Safe with one or more other owners. First, let&#39;s
          give your new Safe a name. This name is only stored locally and will never be shared with Pyxis Safe or any
          third parties. The new Safe will ONLY be available on <NetworkLabel />
        </Paragraph>
      </Block>
      <label htmlFor={FIELD_ALLOW_CUSTOM_SAFE_NAME}>Name of the new Safe</label>
      <FieldContainer margin="lg">
        <Col xs={11}>
          <Field
            component={TextField}
            name={FIELD_ALLOW_CUSTOM_SAFE_NAME}
            placeholder={formValues[FIELD_ALLOW_SUGGESTED_SAFE_NAME]}
            text="Safe name"
            type="text"
            testId="create-safe-name-field"
          />
        </Col>
      </FieldContainer>
      <Block margin="lg">
        <Paragraph color="primary" noMargin size="lg">
          By continuing you consent with our terms of use and privacy policy. All assets inside the Safe are in total
          control of Safe owners and cannot be accessed by Pyxis Safe at any point.
        </Paragraph>
      </Block>
    </BlockWithPadding>
  )
}

export const loadSafeStepValidations = (values: {
  [FIELD_ALLOW_IS_LOADING_SAFE_ADDRESS]: string
}): Record<string, string> => {
  const isLoadingSafeAddress = values[FIELD_ALLOW_IS_LOADING_SAFE_ADDRESS]

  if (isLoadingSafeAddress) {
    return {
      [FIELD_ALLOW_SUGGESTED_SAFE_NAME]: 'Loading Safe Info...',
    }
  }

  return {}
}

export default NameAllowSafeStep
