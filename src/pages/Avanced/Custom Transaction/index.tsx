import Icon from 'src/assets/icons/FileText.svg'
import { ReactElement, useState } from 'react'
import { getInternalChainId } from 'src/config'
import styled from 'styled-components'
import Breadcrumb from 'src/components/Breadcrumb'
import MessageGenerator from './MessageGenerator'
import { FilledButton } from 'src/components/Button'
const Wrap = styled.div`
  background: #24262e;
  border-radius: 8px;
  padding: 24px;
  > .title {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 16px;
  }
`

function CustomTransaction(props): ReactElement {
  const internalChainId = getInternalChainId()
  const [message, setMessage] = useState([])
  return (
    <>
      <Breadcrumb title="Custom Transaction" subtitleIcon={Icon} subtitle="Custom Transaction / Custom Transaction" />
      <Wrap>
        <MessageGenerator setMessage={setMessage} />
        <FilledButton>Create Transaction</FilledButton>
      </Wrap>
    </>
  )
}

export default CustomTransaction
