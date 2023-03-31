import styled from 'styled-components'

const Wrap = styled.div`
  position: relative;
  &:hover {
    > span {
      display: unset;
    }
  }
  > span {
    position: absolute;
    width: max-content;
    background: #494c58;
    border: 1px solid #494c58;
    border-radius: 4px;
    padding: 8px;
    font-size: 12px;
    top: -43px;
    left: 0%;
    transform: translateX(-50%);
    display: none;
  }
`
export default function Tooltip({ children, tooltip }) {
  return (
    <Wrap>
      <span className="tooltip">{tooltip}</span>
      {children}
    </Wrap>
  )
}
