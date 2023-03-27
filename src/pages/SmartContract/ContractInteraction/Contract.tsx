import { ReactElement } from 'react'
import styled from 'styled-components'

const Wrap = styled.div``

function Contract({ contractData }): ReactElement {
  console.log(contractData.executeMsgSchema)
  return <Wrap></Wrap>
}

export default Contract
