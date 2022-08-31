import React, { ReactElement } from 'react'
import styled from 'styled-components'

const BgDetail = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  border-radius: 8px;
  padding: 16px;
  background-color: rgba(19, 20, 25, 0.5);
`

const TitleDetail = styled.div`
  font-weight: 590;
  font-size: 20px;
  color: #e6e7e8;
`
const ContentDetail = styled.div`
  color: #b4b8c0;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
`

const Content = styled.div`
  margin-top: 10px;
`

function DetailVoting(props): ReactElement {
  return (
    <BgDetail>
      <TitleDetail>Make the Cosmos Hub the main sponsor of HackATOM Seoul 2022</TitleDetail>
      <Content>
        <TitleDetail>Summary</TitleDetail>
        <ContentDetail>
          We are requesting 37500 ATOM from the Cosmos Hub Community Pool to make the Hub the main sponsor of the event
          and cover the prizes of the HackATOM Seoul challenges.
        </ContentDetail>
      </Content>
      <Content>
        <TitleDetail>Details</TitleDetail>
        <ContentDetail>
          This is a community spend proposal to fund the prizes of the three main challenges that are part of the
          upcoming HackATOM in Seoul. Previous HackATOMs have demonstrated to directly benefit the Cosmos ecosystem and
          the Cosmos Hub by enabling the creation of innovative projects that spin off into successful products (e.g.
          CosmWasm, Osmosis, and many more)
        </ContentDetail>
        <Content>
          <ContentDetail>
            We are requesting 37500 ATOM that will be sent to a multisig maintained by a committee that consists of:
          </ContentDetail>
          <ContentDetail> &ensp;&bull;&ensp;Zaki Manian | Co-Founder Sommelier</ContentDetail>
          <ContentDetail>
            &ensp;&bull;&ensp;lelén Diuric | Interchain Security Product Manager & Maketing Lead informal Systems
          </ContentDetail>
        </Content>
      </Content>
    </BgDetail>
  )
}

export default DetailVoting
