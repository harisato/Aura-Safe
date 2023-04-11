import Icon from 'src/assets/icons/FileText.svg'
import { ReactElement } from 'react'
import { getInternalChainId } from 'src/config'
import styled from 'styled-components'
import Breadcrumb from 'src/components/Breadcrumb'
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

function CustomTransaction(props): ReactElement {
  const internalChainId = getInternalChainId()
  return (
    <Wrap>
      <Breadcrumb title="Custom Transaction" subtitleIcon={Icon} subtitle="Custom Transaction / Custom Transaction" />
    </Wrap>
  )
}

export default CustomTransaction
