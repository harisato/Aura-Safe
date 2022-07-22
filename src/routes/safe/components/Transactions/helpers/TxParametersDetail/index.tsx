import { Accordion, AccordionDetails, AccordionSummary, ButtonLink, Text } from '@aura/safe-aura-components'
import { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { currentSafe } from 'src/logic/safe/store/selectors'
import { getLastTxNonce } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { ethereumTxParametersTitle, ParametersStatus } from '../utils'

const TxParameterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const AccordionContainer = styled(Accordion)`
  background-color: rgba(14, 14, 15, 1);

  border: 1px solid #404047 !important;

  /* > :nth-child(1) {
    :hover {
      p {
        color: rgba(14, 14, 15, 1);
      }
    }
  } */
`

const AccordionDetailsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
const StyledText = styled(Text)`
  margin: 8px 0 0 0;
`

const ColoredText = styled(Text)<{ isOutOfOrder: boolean }>`
  color: ${(props) => (props.isOutOfOrder ? props.theme.colors.error : props.color)};
`

const StyledButtonLink = styled(ButtonLink)`
  padding-left: 0;
  margin: 8px 0 0 0;

  > p {
    margin-left: 0;
  }
`

const StyledAccordionSummary = styled(AccordionSummary)`
  background-color: #1d1d1f !important;

  border-bottom: 1px solid #404047 !important;
  &::hover {
    color: #98989b;
  }
`

const StyledTextGas = styled.span`
  color: #98989b;
`
const StyledTitleText = styled(Text)`
  color: #98989b;

  &::hover {
    color: #98989b;
  }
`

type Props = {
  txParameters: TxParameters
  onEdit: () => void
  compact?: boolean
  parametersStatus?: ParametersStatus
  isTransactionCreation: boolean
  isTransactionExecution: boolean
  isOffChainSignature: boolean
}

export const TxParametersDetail = ({
  onEdit,
  txParameters,
  compact = true,
  isTransactionCreation,
  isTransactionExecution,
  isOffChainSignature,
}: Props): ReactElement | null => {
  const { nonce } = useSelector(currentSafe)

  const [isTxNonceOutOfOrder, setIsTxNonceOutOfOrder] = useState(false)
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(true)

  const { safeNonce = '' } = txParameters
  const safeNonceNumber = parseInt(safeNonce, 10)
  const lastQueuedTxNonce = useSelector(getLastTxNonce)

  useEffect(() => {
    if (Number.isNaN(safeNonceNumber)) return
    if (safeNonceNumber === nonce) return
    if (lastQueuedTxNonce === undefined && safeNonceNumber !== nonce) {
      setIsAccordionExpanded(true)
      setIsTxNonceOutOfOrder(true)
    }
    if (lastQueuedTxNonce && safeNonceNumber !== lastQueuedTxNonce + 1) {
      setIsAccordionExpanded(true)
      setIsTxNonceOutOfOrder(true)
    }
  }, [lastQueuedTxNonce, nonce, safeNonceNumber])

  if (!isTransactionExecution && !isTransactionCreation && isOffChainSignature) {
    return null
  }

  const onChangeExpand = () => {
    setIsAccordionExpanded(!isAccordionExpanded)
  }

  return (
    <AccordionContainer compact={compact} expanded={isAccordionExpanded} onChange={onChangeExpand}>
      <StyledAccordionSummary>
        <StyledTitleText size="xl">Advanced options</StyledTitleText>
      </StyledAccordionSummary>
      <AccordionDetails>
        <AccordionDetailsWrapper>
          {/* <StyledText size="md" color="placeHolder">
            Safe transaction
          </StyledText>

          <TxParameterWrapper>
            <ColoredText
              size="lg"
              isOutOfOrder={isTxNonceOutOfOrder}
              color={areSafeParamsEnabled(parametersStatus || defaultParameterStatus) ? 'text' : 'secondaryLight'}
            >
              Safe nonce
            </ColoredText>
            <ColoredText
              size="lg"
              isOutOfOrder={isTxNonceOutOfOrder}
              color={areSafeParamsEnabled(parametersStatus || defaultParameterStatus) ? 'text' : 'secondaryLight'}
            >
              {txParameters.safeNonce}
            </ColoredText>
          </TxParameterWrapper> */}

          {/* {showSafeTxGas && (
            <TxParameterWrapper>
              <Text
                size="lg"
                color={areSafeParamsEnabled(parametersStatus || defaultParameterStatus) ? 'text' : 'secondaryLight'}
              >
                SafeTxGas
              </Text>
              <Text
                size="lg"
                color={areSafeParamsEnabled(parametersStatus || defaultParameterStatus) ? 'text' : 'secondaryLight'}
              >
                {txParameters.safeTxGas}
              </Text>
            </TxParameterWrapper>
          )} */}

          {/* {areEthereumParamsVisible(parametersStatus || defaultParameterStatus) && (
            
          )} */}
          <>
            <TxParameterWrapper>
              <StyledText size="md" color="placeHolder">
                {ethereumTxParametersTitle(isTransactionExecution)}
              </StyledText>
            </TxParameterWrapper>

            {/* <TxParameterWrapper>
                <Text size="lg">Nonce</Text>
                <Text size="lg">{txParameters.ethNonce}</Text>
              </TxParameterWrapper> */}

            <TxParameterWrapper>
              <StyledTextGas>Gas limit</StyledTextGas>
              <Text size="lg" color="white">
                {txParameters.ethGasLimit}
              </Text>
            </TxParameterWrapper>

            <TxParameterWrapper>
              <StyledTextGas>Gas price</StyledTextGas>
              <Text size="lg" color="white">
                {txParameters.ethGasPrice}
              </Text>
            </TxParameterWrapper>
          </>
          {isTransactionExecution ? null : (
            <StyledButtonLink color="primary" textSize="xl" onClick={onEdit}>
              Edit
            </StyledButtonLink>
          )}
        </AccordionDetailsWrapper>
      </AccordionDetails>
    </AccordionContainer>
  )
}
