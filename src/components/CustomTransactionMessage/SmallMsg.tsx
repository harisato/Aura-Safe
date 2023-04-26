import { Accordion, AccordionDetails, AccordionSummary } from '@aura/safe-react-components'
import { beutifyJson } from 'src/utils'
import styled from 'styled-components'

const NoPaddingAccordion = styled(Accordion)`
  margin-bottom: 8px !important;
  border-radius: 4px !important;
  &.MuiAccordion-root {
    border: none !important;
    .MuiAccordionDetails-root {
      padding: 0;
    }
  }
`

const StyledAccordionSummary = styled(AccordionSummary)`
  background-color: #363843 !important;
  border: none !important;
  min-height: 24px !important;
  font-size: 12px;
  &.Mui-expanded {
    background-color: #363843 !important;
  }
  .tx-nonce {
    margin: 0 16px 0 8px;
    min-width: 80px;
  }
  > div {
    padding: 0px !important;
    margin: 0px !important;
  }
`
const StyledAccordionDetails = styled(AccordionDetails)`
  padding: 8px !important;
  background: #34353a !important;
  font-size: 12px !important;
`

export const Message = ({ msgData, index }) => {
  const Wrap = styled.div`
    white-space: pre-wrap;
    .string {
      color: #ce9178;
    }
    .number {
      color: #aac19e;
    }
    .boolean {
      color: #266781;
    }
    .null {
      color: #d33a3a;
    }
    .key {
      color: #569cd6;
    }
  `

  return (
    <NoPaddingAccordion>
      <StyledAccordionSummary>
        {index + 1}. {msgData?.typeUrl.split('Msg').at(-1)}
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Wrap dangerouslySetInnerHTML={{ __html: beutifyJson(msgData?.value) }} />
      </StyledAccordionDetails>
    </NoPaddingAccordion>
  )
}
