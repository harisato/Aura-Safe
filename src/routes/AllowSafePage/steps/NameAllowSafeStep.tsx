import { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useField, useForm } from 'react-final-form'
import styled from 'styled-components'

import Block from 'src/components/layout/Block'
import { lg, secondary } from 'src/theme/variables'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import { FIELD_CREATE_CUSTOM_SAFE_NAME, FIELD_CREATE_SUGGESTED_SAFE_NAME } from '../fields/createSafeFields'
import { useStepper } from 'src/components/Stepper/stepperContext'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import { FIELD_ALLOW_SAFE_ID, FIELD_SAFE_OWNER_LIST } from '../fields/allowFields'
import { currentNetworkAddressBookAsMap } from '../../../logic/addressBook/store/selectors'
import { currentChainId } from '../../../logic/config/store/selectors'
import { AddressBookEntry, makeAddressBookEntry } from '../../../logic/addressBook/model/addressBook'

import {
  FIELD_LOAD_IS_LOADING_SAFE_ADDRESS,
  FIELD_LOAD_SAFE_ID,
  FIELD_SAFE_THRESHOLD,
} from '../../LoadSafePage/fields/loadFields'

import { getMSafeInfo } from 'src/services'

export const nameNewSafeStepLabel = 'Name'

function NameAllowSafeStep(): ReactElement {
  const [isSafeInfoLoading, setIsSafeInfoLoading] = useState<boolean>(false)
  const [threshold, setThreshold] = useState<number>()

  const [ownersWithName, setOwnersWithName] = useState<AddressBookEntry[]>([])

  const provider = useSelector(providerNameSelector)

  const addressBook = useSelector(currentNetworkAddressBookAsMap)
  const chainId = useSelector(currentChainId)

  const { setCurrentStep } = useStepper()
  const allowSafeForm = useForm()

  const {
    input: { value: safeId },
  } = useField(FIELD_ALLOW_SAFE_ID)

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

      setIsSafeInfoLoading(true)
      try {
        const { owners, threshold } = await getMSafeInfo(safeId)

        setIsSafeInfoLoading(false)
        const ownersWithName = owners.map((address) =>
          makeAddressBookEntry(addressBook[address] || { address, name: '', chainId }),
        )

        setOwnersWithName(ownersWithName)
        setThreshold(threshold)
      } catch (error) {
        setOwnersWithName([])
        setThreshold(undefined)
      }
      setIsSafeInfoLoading(false)
    }

    checkSafeAddress()
  }, [safeId, addressBook, chainId, allowSafeForm])

  useEffect(() => {
    if (threshold) {
      allowSafeForm.change(FIELD_SAFE_THRESHOLD, threshold)
    }
  }, [threshold, allowSafeForm])

  useEffect(() => {
    allowSafeForm.change(FIELD_LOAD_IS_LOADING_SAFE_ADDRESS, isSafeInfoLoading)
  }, [isSafeInfoLoading, allowSafeForm])

  useEffect(() => {
    if (ownersWithName) {
      allowSafeForm.change(FIELD_SAFE_OWNER_LIST, ownersWithName)
    }
  }, [ownersWithName, allowSafeForm])

  const formValues = allowSafeForm.getState().values

  return (
    <BlockWithPadding data-testid={'create-safe-name-step'}>
      <Block margin="md">
        <Paragraph color="primary" noMargin size="lg">
          You are about to create a new Aura Safe wallet with one or more owners. First, let&apos;s give your new wallet
          a name. This name is only stored locally and will never be shared with Aura or any third parties. The new Safe
          will ONLY be available on <NetworkLabel />
        </Paragraph>
      </Block>
      <label htmlFor={FIELD_CREATE_CUSTOM_SAFE_NAME}>Name of the new Safe</label>
      <FieldContainer margin="lg">
        <Col xs={11}>
          <Field
            component={TextField}
            name={FIELD_CREATE_CUSTOM_SAFE_NAME}
            placeholder={formValues[FIELD_CREATE_SUGGESTED_SAFE_NAME]}
            text="Safe name"
            type="text"
            testId="create-safe-name-field"
          />
        </Col>
      </FieldContainer>
      <Block margin="lg">
        <Paragraph color="primary" noMargin size="lg">
          By continuing you consent with the{' '}
          <Link href="https://gnosis-safe.io/terms" rel="noopener noreferrer" target="_blank">
            terms of use
          </Link>{' '}
          and{' '}
          <Link href="https://gnosis-safe.io/privacy" rel="noopener noreferrer" target="_blank">
            privacy policy
          </Link>
          . Most importantly, you confirm that your funds are held securely in the Aura Safe, a smart contract on the
          Ethereum blockchain. These funds cannot be accessed by Aura at any point.
        </Paragraph>
      </Block>
    </BlockWithPadding>
  )
}

export default NameAllowSafeStep

const BlockWithPadding = styled(Block)`
  padding: ${lg};
`

const FieldContainer = styled(Block)`
  display: flex;
  max-width: 480px;
  margin-top: 12px;
`

const Link = styled.a`
  color: ${secondary};
`
