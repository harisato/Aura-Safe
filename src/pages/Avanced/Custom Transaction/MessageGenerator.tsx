import { Accordion, AccordionDetails, AccordionSummary } from '@aura/safe-react-components'
import { ReactElement, useEffect, useState } from 'react'
import TextArea from 'src/components/Input/TextArea'
import { getInternalChainId } from 'src/config'
import styled from 'styled-components'
import CodeMirror from '@uiw/react-codemirror'
import { githubDark } from '@uiw/codemirror-theme-github'
import { StreamLanguage } from '@codemirror/language'
import { json } from '@codemirror/lang-json'
import { javascript } from '@codemirror/lang-javascript'

const Wrap = styled.div`
  display: flex;
  gap: 24px;
  > div {
    max-width: 50%;
    width: 100%;
  }
  .cm-editor {
    border-radius: 8px;
    overflow: hidden;
  }
  .error > .cm-editor {
    outline: #d5625e 1px solid;
  }
  .error-msg {
    color: #d5625e;
    font-size: 12px;
    line-height: 16px;
  }
  .preview-msg {
    max-height: 54vh;
    overflow: auto;
  }
`

function MessageGenerator({ setMessage }): ReactElement {
  const internalChainId = getInternalChainId()
  const [rawMsg, setRawMsg] = useState('')
  const [parsedMsg, setParsedMsg] = useState<any[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  const onMsgChange = (msg) => {
    try {
      setErrorMsg('')
      setMessage([])
      setParsedMsg([])
      setRawMsg(msg)

      if (!msg) {
        setRawMsg('')
        return
      }
      const parsedMessage = JSON.parse(msg)
      const prettyJson = JSON.stringify(parsedMessage, undefined, 4)
      setRawMsg(prettyJson)
      if (typeof parsedMessage !== 'object' || !Array.isArray(parsedMessage)) {
        throw new Error('Input data is not an array')
      }
      setParsedMsg(parsedMessage)
      setMessage(parsedMessage)
    } catch (error) {
      setErrorMsg(error.message)
    }
  }

  return (
    <Wrap>
      <div>
        <p>Message</p>
        <CodeMirror
          className={errorMsg ? 'error' : ''}
          theme={githubDark}
          extensions={[json()]}
          value={rawMsg}
          height="54vh"
          onChange={(value, viewUpdate) => onMsgChange(value)}
        />
        <p className="error-msg">{errorMsg}</p>
      </div>
      <div className="preview">
        <p>Transaction Preview</p>
        <div className="preview-msg">
          {parsedMsg.map((msg, index) => {
            return <Message msgData={msg} key={index} />
          })}
        </div>
      </div>
    </Wrap>
  )
}

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

const Message = ({ msgData }) => {
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
      <StyledAccordionSummary>{msgData?.typeUrl.split('Msg').at(-1)}</StyledAccordionSummary>
      <StyledAccordionDetails>
        <Wrap dangerouslySetInnerHTML={{ __html: beutifyJson() }} />
      </StyledAccordionDetails>
    </NoPaddingAccordion>
  )
}

export default MessageGenerator
