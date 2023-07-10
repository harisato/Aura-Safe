import { ReactElement, useState } from 'react'
import Breadcrumb from 'src/components/Breadcrumb'
import Tabs from 'src/components/Tabs/NormalTab'
import Tab from 'src/components/Tabs/NormalTab/Tab'
import styled from 'styled-components'
import Tokens from './Tokens'
import NFTs from './NFTs'
const Wrap = styled.div``

function Assets(props): ReactElement {
  const [tab, setTab] = useState(0)
  return (
    <>
      <Breadcrumb title="Assets" />
      <Tabs
        value={tab}
        onChange={(e, v) => {
          setTab(v)
        }}
      >
        <Tab label="Tokens" />
        <Tab label="NFTs" />
      </Tabs>
      {tab == 0 ? <Tokens /> : <NFTs />}
    </>
  )
}

export default Assets
