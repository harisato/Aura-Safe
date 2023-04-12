import { Accordion, AccordionDetails, AccordionSummary } from '@aura/safe-react-components'
import { ReactElement, useEffect, useState } from 'react'
import TextArea from 'src/components/Input/TextArea'
import { getInternalChainId } from 'src/config'
import styled from 'styled-components'
const Wrap = styled.div`
  display: flex;
  gap: 12px;
  > div {
    max-width: 50%;
    width: 100%;
  }
`

function MessageGenerator({ setMessage }): ReactElement {
  const internalChainId = getInternalChainId()
  const [rawMsg, setRawMsg] = useState('')
  const [parsedMsg, setParsedMsg] = useState<any[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  const parseMsg = () => {
    try {
      const parsedMessage = JSON.parse(rawMsg)
      if (typeof parsedMessage !== 'object' || !Array.isArray(parsedMessage)) {
        throw new Error('Input data is not an array')
      }
      setParsedMsg(parsedMessage)
      setMessage(parsedMessage)
    } catch (error) {
      setErrorMsg(error.message)
    }
  }
  useEffect(() => {
    setErrorMsg('')
    if (rawMsg != '') {
      parseMsg()
    }
  }, [rawMsg])
  return (
    <Wrap>
      <div>
        <p>Message</p>
        <TextArea value={rawMsg} onChange={setRawMsg} rows={25} />
        <p>{errorMsg}</p>
      </div>
      <div>
        {parsedMsg.map((msg, index) => {
          return <Message msgData={msg} key={index} />
        })}
      </div>
    </Wrap>
  )
}

export const NoPaddingAccordion = styled(Accordion)`
  margin-bottom: 16px !important;
  &.MuiAccordion-root {
    border: none !important;
    .MuiAccordionDetails-root {
      padding: 0;
    }
  }
`

export const StyledAccordionSummary = styled(AccordionSummary)`
  background-color: #24262e !important;
  border: none !important;
  height: 52px;
  &.Mui-expanded {
    background-color: #363843 !important;
  }
  .tx-nonce {
    margin: 0 16px 0 8px;
    min-width: 80px;
  }
`

const Message = ({ msgData }) => {
  return (
    <NoPaddingAccordion>
      <StyledAccordionSummary>{msgData?.typeUrl}</StyledAccordionSummary>
      <AccordionDetails>{JSON.stringify(msgData?.value)}</AccordionDetails>
    </NoPaddingAccordion>
  )
}

export default MessageGenerator
