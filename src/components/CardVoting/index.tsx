import { ReactElement } from 'react'
import BoxCard from '../BoxCard'
import { Breadcrumb, BreadcrumbElement, Menu, Text } from '@aura/safe-react-components'
import Col from 'src/components/layout/Col'
import styled from 'styled-components'
import StatusCard from '../StatusCard'
import Row from '../layout/Row'
const TitleNumberStyled = styled.div`
  font-weight: 510;
  font-size: 20px;
  line-height: 26px;
  color: #b4b8c0;
`

const TitleStyled = styled.div`
  font-weight: 510;
  font-size: 20px;
  line-height: 26px;
  color: rgba(255, 255, 255, 1);
`

function CardVoting(props): ReactElement {
  return (
    <BoxCard>
      <Col start="sm" layout="column" sm={6} xs={12}>
        <TitleNumberStyled>#60</TitleNumberStyled>
        <TitleStyled>Increase MaxValidator value</TitleStyled>
      </Col>
      <Col end="sm" sm={6} xs={12}>
        <StatusCard />
      </Col>
      <Row>hello</Row>
    </BoxCard>
  )
}

export default CardVoting
