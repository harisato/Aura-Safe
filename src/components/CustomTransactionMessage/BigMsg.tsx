import { Accordion, AccordionSummary, AccordionDetails } from '@aura/safe-react-components'
import styled from 'styled-components'

export const NoPaddingAccordion = styled(Accordion)`
  margin-bottom: 16px !important;
  border-radius: 8px !important;
  &.MuiAccordion-root {
    border: none !important;
    .MuiAccordionDetails-root {
      padding: 0;
    }
  }
`

export const StyledAccordionSummary = styled(AccordionSummary)`
  background-color: #363843 !important;
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
export const StyledAccordionDetails = styled(AccordionDetails)`
  padding: 16px !important;
  background: #34353a !important; ;
`

export const Message = ({ msgData, index }) => {
  if (!msgData.typeUrl || !msgData.value) return <></>
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
  const beutifyJson = () => {
    const prettyJson = JSON.stringify(msgData?.value, undefined, 4)
    const json = prettyJson.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const formattedJson = json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        var cls = 'number'
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key'
          } else {
            cls = 'string'
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean'
        } else if (/null/.test(match)) {
          cls = 'null'
        }
        return '<span class="' + cls + '">' + match + '</span>'
      },
    )
    return formattedJson
  }
  return (
    <NoPaddingAccordion>
      <StyledAccordionSummary>
        {index + 1}. {msgData?.typeUrl?.split('Msg')?.at(-1)}
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Wrap dangerouslySetInnerHTML={{ __html: beutifyJson() }} />
      </StyledAccordionDetails>
    </NoPaddingAccordion>
  )
}
