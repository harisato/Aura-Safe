import { ReactElement, useState } from 'react'
import TextArea from 'src/components/Input/TextArea'
import { getInternalChainId } from 'src/config'
import styled from 'styled-components'
const Wrap = styled.div`
  background: #24262e;
  border-radius: 8px;
  padding: 24px;
  max-width: 800px;
  > .title {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 16px;
  }
`

function MessageGenerator(props): ReactElement {
  const internalChainId = getInternalChainId()
  const [rawMsg, setRawMsg] = useState('')
  return (
    <Wrap>
      <div>
        <p>Message</p>
        <TextArea value={rawMsg} onChange={setRawMsg} />
      </div>
      <div></div>
    </Wrap>
  )
}

export default MessageGenerator
