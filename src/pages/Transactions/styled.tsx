import { Text, Accordion, AccordionDetails, AccordionSummary, EthHashInfo } from '@aura/safe-react-components'
import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  > .head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 16px;
    > div {
      margin: 0;
    }
  }
`

export const StyledText = styled.span`
  color: #98989b;
  font-size: 14px;
`

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  color: white;
`

export const ColumnDisplayAccordionDetails = styled(AccordionDetails)`
  flex-flow: column;
`

export const AccordionWrapper = styled.div<{ hasSameSeqTxAfter?: boolean; hasSameSeqTxBefore?: boolean }>`
  background: #24262e;
  border: 1px solid #363843;
  border-radius: 4px;
  margin-bottom: 16px;
  overflow: hidden;
  &.history-tx {
    border-top: ${(props) => (props.hasSameSeqTxAfter ? '1px solid #363843' : 'unset')};
    border-bottom: ${(props) => (props.hasSameSeqTxBefore ? '1px solid #363843' : 'unset')};
    border-left: 1px solid #363843;
    border-right: 1px solid #363843;
    margin-bottom: ${(props) => (props.hasSameSeqTxAfter ? 'unset' : '16px')};
    border-bottom-left-radius: ${(props) => (props.hasSameSeqTxAfter ? 'unset' : '4px')};
    border-bottom-right-radius: ${(props) => (props.hasSameSeqTxAfter ? 'unset' : '4px')};
    border-top-left-radius: ${(props) => (props.hasSameSeqTxBefore ? 'unset' : '4px')};
    border-top-right-radius: ${(props) => (props.hasSameSeqTxBefore ? 'unset' : '4px')};
    border-top: ${(props) => (props.hasSameSeqTxBefore ? '1px solid #404047 !important;' : 'unset')};
  }
  &.merged-tx {
    > div:not(:first-child) {
      border-top: 1px solid #404047 !important;
    }
    .notice {
      font-weight: 600;
      font-size: 14px;
      line-height: 18px;
      color: #ffffff;
      background: #494c58;
      padding: 8px 0px;
      background: #494c58;
      position: relative;
      p {
        margin: 0;
        text-align: center;
      }
      > div {
        position: absolute;
        left: 16px;
      }
    }
  }
`
export const NoPaddingAccordion = styled(Accordion)`
  &.MuiAccordion-root {
    border: none !important;
    .MuiAccordionDetails-root {
      padding: 0;
    }
  }
`

export const ActionAccordion = styled(Accordion)`
  &.MuiAccordion-root {
    background-color: #1d1d1f;
    &:first-child {
      border-top: none;
    }

    &.Mui-expanded {
      border-bottom: none !important;
      &:last-child {
        border-bottom: none;
      }
    }

    .MuiAccordionDetails-root {
      padding: 16px;
    }
  }
`

export const StyledTransactionsGroup = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 16px 8px;
  width: 98%;
`

export const H2 = styled.h2`
  text-transform: uppercase;
  font-size: smaller;
`

export const SubTitle = styled.p`
  margin: 16px 0px 8px 0px;
  font-size: 0.76em;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
`

export const StyledTransactions = styled.div`
  background-color: #121212;
  border-radius: 8px;
  box-shadow: #00000026 0 4px 12px 0;
  overflow: hidden;
  width: 100%;

  & > .MuiAccordion-root {
    &:first-child {
      border-top: none;
    }

    &:last-child {
      border-bottom: none;
    }

    &:last-of-type {
      div {
        row-gap: 0px;
      }
    }
  }
`

export const GroupedTransactionsCard = styled(StyledTransactions)`
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  background-color: transparent;
  border-radius: 0;
  box-shadow: none;

  &:not(:last-child) {
    border-bottom: none;
  }

  .MuiAccordion-root,
  .MuiAccordionSummary-root,
  .MuiAccordionDetails-root {
    background-color: transparent;

    &:hover,
    &.Mui-expanded {
      background-color: transparent;
      border-bottom: none !important;
    }
  }

  // &:hover {
  //   background-color: ${({ theme }) => theme.colors.background};

  //   .MuiAccordionDetails-root {
  //     div[class^='tx-'] {
  //       background-color: ${({ theme }) => theme.colors.background};
  //     }
  //   }

  //   .disclaimer-container {
  //     background-color: ${({ theme }) => theme.colors.inputField};
  //   }
  // }
`
const gridColumns = {
  // nonce: '0.5fr',
  type: '3fr',
  info: '3fr',
  time: '2.5fr',
  votes: '1.5fr',
  actions: '1.5fr',
  status: '2.5fr',
}

const willBeReplaced = css`
  .will-be-replaced * {
    color: gray !important;
    text-decoration: line-through !important;
    filter: grayscale(1) opacity(0.8) !important;
  }
`

const failedTransaction = css`
  &.failed-transaction {
    div[class^='tx-']:not(.tx-status):not(.tx-nonce) {
      opacity: 0.5;
    }
  }
`

const onChainRejection = css`
  &.on-chain-rejection {
    background-color: ${({ theme }) => theme.colors.errorTooltip};
    border-left: 4px solid ${({ theme }) => theme.colors.error};
    border-radius: 4px;
    padding-left: 7px;
    height: 22px;
    max-width: 165px;

    > div {
      height: 17px;
      align-items: center;
      padding-top: 3px;
    }

    p {
      font-size: 11px;
      line-height: 16px;
      letter-spacing: 1px;
      font-weight: bold;
      text-transform: uppercase;
      margin-left: -2px;
    }
  }
`

export const StyledTransaction = styled.div<{ shouldBlur?: boolean }>`
  ${willBeReplaced};
  ${failedTransaction};
  display: flex;
  width: 100%;
  color: ${(props) => (props.shouldBlur ? '#5C606D!important' : '')};
  font-weight: 600;
  & > div {
    flex: 1;
    align-self: center;
  }
  p {
    margin: 0;
  }
  .tx-seq {
    flex: unset;
    margin-right: 10%;
    width: 0%;
  }
  .tx-type,
  .tx-exe {
    display: flex;
    align-items: center;

    > :nth-child(1) {
      margin-right: 8px;
    }
  }
  .tx-exe {
    color: #98989b;
    width: 260px;
    > p {
      white-space: nowrap;
    }
  }
  .tx-amount {
    display: flex;
    align-items: center;
  }
  .native-token-img {
    width: 24px;
    height: 24px;
    margin-right: 6px;
  }

  .tx-votes {
    justify-self: center;
  }

  .tx-actions {
    visibility: hidden;
    justify-self: end;
  }

  .tx-status {
    justify-self: end;
    margin-right: 8px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: end;

    p {
      margin-left: 8px;
    }
  }

  &:hover {
    .tx-actions {
      visibility: visible;

      &.will-be-replaced {
        visibility: hidden;
      }
    }
  }
`

export const StyledGroupedTransactions = styled(StyledTransaction)`
  // no \`tx-nonce\` column required
  grid-template-columns: ${Object.values(gridColumns).slice(1).join(' ')};
  font-family: 'Inter !important';
`

export const GroupedTransactions = styled(StyledTransaction)`
  // add a bottom division line for all elements but the last
  &:not(:last-of-type) {
    border-bottom: none;
  }

  // builds the tree-view layout
  .tree-lines {
    height: 100%;
    margin-left: 30px;
    position: relative;
    width: 30%;

    // this is a special case, the first element in the list needs to have a block child component
    // add tree lines line to the first item of the list
    .first-node {
      display: block;
      position: absolute;
      top: -16px;
      width: 100%;

      &::before {
        border-bottom: none;
        border-left: none;
        content: '';
        height: 22px;
        position: absolute;
        top: 8px;
        width: 100%;
      }
    }

    // add tree lines to all elements of the list (except for the last one)
    // :last-of-type won't work with classes selector (HTML elements only)
    // as we need block-level elements, we're using paragraphs for .tree-lines and .first-node
    // given that divs are already being used for the transaction row, and both (p and div) are siblings
    &:not(:last-of-type) {
      &::before {
        border-bottom: none;
        border-left: none;
        content: '';
        height: 100%;
        margin-top: 14px;
        position: absolute;
        width: 100%;
      }
    }
  }

  // overrides Accordion styles, as grouped txs behave differently
  > .MuiAccordion-root {
    transition: none;
    border: 0;
    grid-column-end: span 6;
    grid-column-start: 2;

    &:first-child {
      border: 0;
    }

    &.Mui-expanded {
      justify-self: center;
      width: calc(100% - 32px);
      background-color: rgba(62, 63, 64, 1) !important;
      &:not(:last-of-type) {
        border-bottom: none;
      }

      &:not(:first-of-type) {
        border-top: none;
        // if two consecutive accordions are expanded, borders will get duplicated
        // this rule is to overlap them
        margin-top: -2px;
      }

      > .MuiAccordionSummary-root {
        background-color: #0e0e0f !important;
        border-bottom: none !important;
        border-top: none;
        padding: 0;
      }
    }
  }
`

export const DisclaimerContainer = styled(StyledTransaction)`
  background-color: ${({ theme }) => theme.colors.inputField} !important;
  border-radius: 4px;
  margin: 12px 8px 0 12px;
  padding: 8px 12px;
  width: calc(100% - 48px);

  .nonce {
    grid-column-start: 1;
  }

  .disclaimer {
    grid-column-start: 2;
    grid-column-end: span 6;
  }
`

export const TxDetailsContainer = styled.div<{ ownerRows?: number }>`
  ${willBeReplaced};

  background-color: #24262e !important;
  column-gap: 1px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: minmax(min-content, max-content);
  grid-template-rows: [tx-summary] minmax(min-content, max-content) [tx-details] minmax(min-content, 1fr);
  width: 100%;
  position: relative;
  .recipient {
    display: flex;
    align-items: center;
    margin: 0 !important;
    > p {
      margin: 0px 4px 0px;
    }
  }
  & > div {
    line-break: anywhere;
    overflow: hidden;
    word-break: break-all;
  }

  .tx-summary {
    border-bottom: 1px solid #484852;
    padding: 16px;
    .tx-hash {
    }
    > * {
      margin: 0px 0px 12px;
      line-height: 21px;
      letter-spacing: 0.05em;
      color: #98989b;
      :last-child {
        margin-bottom: 0px;
      }
    }
    span {
      color: #ffff;
    }
  }
  .tx-msg {
    padding: 16px;
    max-height: 200px;
    overflow: auto;
    .token {
      color: #5ee6d0;
    }
    > strong {
      display: block;
    }
    > * {
      margin: 0px 0px 12px;
      :last-child {
        margin-bottom: 0px;
      }
    }
    .function-name {
      font-weight: 600;
      font-size: 16px;
      line-height: 20px;
    }
    .field__label {
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;
      color: #b4b8c0;
      margin-bottom: 2px;
    }
    .field__data {
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;
    }
  }

  .tx-share {
    float: right;
  }

  .tx-exe {
    padding: 16px;
    border-left: 1px solid #484852;
  }
  .tx-action {
    display: flex;
    justify-content: center;
    align-items: center;
    .buttons {
      display: flex;
      flex: 1;
      justify-content: flex-end;
    }
  }

  .tx-owners {
    padding: 24px;
    grid-column-start: 2;
    grid-row-end: span ${({ ownerRows }) => ownerRows || 2};
    grid-row-start: 1;
  }

  .tx-details-actions {
    align-items: center;
    display: flex;
    height: 60px;
    justify-content: center;

    button {
      color: ${({ theme }) => theme.colors.white};
      margin: 0 8px;

      &.error {
        background-color: ${({ theme }) => theme.colors.error};
      }

      &.primary {
        background-color: ${({ theme }) => theme.colors.primary};
      }
    }
  }
  .tx-sequence {
    position: absolute;
    display: flex;
    top: 16px;
    right: 16px;
    > div {
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    > div:first-child {
      margin-right: 16px;
    }
  }
`

export const OwnerList = styled.ul`
  list-style: none;
  margin: 0;
  padding-left: 6px;

  .legend {
    left: 15px;
    padding-bottom: 0.86em;
    position: relative;
    top: -3px;

    .owner-info {
      margin: 5px;
    }

    span::first-of-type {
      color: #03a9f4;
      font-weight: bold;
    }
  }

  ul {
    margin-top: 0;
  }

  .icon {
    left: -7px;
    position: absolute;
    width: 16px;
    z-index: 2;
  }
`

export const OwnerListItem = styled.li`
  display: flex;
  position: relative;

  &::before {
    border-left: 1px #666769 solid;
    border-radius: 1px;
    content: '';
    height: calc(100% - 26px);
    top: 22px;
    left: 1px;
    position: absolute;
    z-index: 1;
  }
  &.isPending::before {
    border: none;
  }
`

export const InlineEthHashInfo = styled(EthHashInfo)`
  display: inline-flex;
  color: #e6e7e8 !important;
  span {
    font-weight: normal;
  }
`

export const StyledScrollableBar = styled.div`
  scrollbar-color: darkgrey #dadada;
  scrollbar-width: thin;
`

export const ScrollableTransactionsContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  .gap-div {
    height: 16px;
  }
  .section-title {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    color: #ffffff;
    margin: 0px 0px 16px;
  }
  .section-title:last-of-type {
    margin-top: 32px;
  }
`
export const Centered = styled.div<{ padding?: number }>`
  width: 100%;
  height: 100%;
  display: flex;
  padding: ${({ padding }) => `${padding}px`};
  justify-content: center;
  align-items: center;
`

export const HorizontallyCentered = styled(Centered)<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  height: 100px;
`

export const StyledAccordionSummary = styled(AccordionSummary)`
  background-color: #24262e !important;
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
export const AlignItemsWithMargin = styled.div`
  display: flex;
  align-items: center;

  span:first-child {
    margin-right: 6px;
  }
`
export const NoTransactions = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 60px;
`

export const ReviewTxPopupWrapper = styled.div`
  padding: 24px;
  width: 540px;
  .recipient {
    display: flex;
    align-items: center;
    > span {
      margin: 0px 8px;
    }
  }
  .proposal-title {
    font-weight: 600;
    margin: 0;
    line-height: 150%;
    letter-spacing: 0.05em;
  }
  .label {
    font-weight: 510;
    font-size: 12px;
    line-height: 150%;
    color: #98989b;
    margin: 0;
    margin-bottom: 4px;
  }
  > .tx-detail {
    margin-bottom: 24px;
    p {
      margin: 0;
    }
    > div:nth-child(2) {
      margin: 4px 0px;
    }

    .voting-detail {
      display: flex;
      width: 100%;
      justify-content: space-between;
      font-weight: 400;
      font-size: 12px;
      line-height: 150%;
      text-transform: capitalize;
    }
  }
  .tx-fee {
    margin-bottom: 24px;
    p {
      margin: 0;
    }
    .title {
      font-size: 16px;
      line-height: 24px;
      margin: 0px 0px 8px;
    }
    .fee {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > .fee-amount {
        display: flex;
        align-items: center;
        letter-spacing: 0.05em;
      }
      img {
        margin-right: 4px;
      }
    }
    .edit-fee-section {
      display: flex;
      align-items: center;
      margin-top: 8px;
      > div:nth-child(1) {
        margin-right: 16px;
      }
      button {
        min-width: 88px !important;
      }
    }
  }
  .total-amount {
    p {
      margin: 0;
    }
    .title {
      font-size: 16px;
      line-height: 24px;
      margin: 0px 0px 8px;
    }

    > .amount {
      display: flex;
      align-items: center;
      letter-spacing: 0.05em;
    }
    img {
      margin-right: 4px;
    }
  }
  .notice {
    font-size: 12px;
    line-height: 150%;
    letter-spacing: 0.05em;
    color: #98989b;
    margin-top: 16px;
  }
  .balance {
    background: #404047;
    border-radius: 4px;
    padding: 4px 12px;
    font-size: 12px;
    line-height: 140%;
    width: fit-content;
    margin-left: 38px;
    margin-top: 4px;
  }

  .function-name {
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    color: #b4b8c0;
    margin-top: 8px;
  }
  .field__label {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #b4b8c0;
    margin-top: 6px;
  }
  .field__data {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
  }
`
