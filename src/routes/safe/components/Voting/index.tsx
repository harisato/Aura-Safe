import React, { ReactElement } from 'react'
import { Breadcrumb, BreadcrumbElement, Menu, Text } from '@aura/safe-react-components'
import Col from 'src/components/layout/Col'
import CardVoting from 'src/components/CardVoting'
import Block from 'src/components/layout/Block'

function Voting(props): ReactElement {
  return (
    <>
      <Menu>
        <Col start="sm" sm={12} xs={12}>
          <Breadcrumb>
            <BreadcrumbElement
              color="white"
              iconType="votingAura"
              text="Voting"
              // counter={addressBook?.length.toString()}
            />
          </Breadcrumb>
        </Col>
      </Menu>
      <Block>
        {' '}
        <Col start="sm" sm={6} xs={12}>
          <CardVoting />
        </Col>
      </Block>
    </>
  )
}

export default Voting
