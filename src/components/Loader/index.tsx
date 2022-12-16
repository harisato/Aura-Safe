import styled from 'styled-components'

interface ILoaderProps {
  size?: number
  color?: string
  content?: any
}
const Wrap = styled.div`
  position: relative;
  .content-mockup {
    visibility: hidden;
  }
`
const LoaderWrap = styled.div<ILoaderProps>`
  position: absolute;
  top: calc(45% - ${(props) => (props.size ? props.size / 2 : '')}px);
  left: calc(50% - ${(props) => (props.size ? props.size / 2 : '')}px);
  border: ${(props) => (props.size ? props.size * 0.1 : '')}px solid ${(props) => props.color};
  border-radius: 50%;
  border-top: ${(props) => (props.size ? props.size * 0.1 : '')}px solid transparent;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  -webkit-animation: spin 1s linear infinite;
  animation: spin 1s linear infinite;
  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`
export default function Loader({ size = 16, color = '#868A97', content }: ILoaderProps) {
  return (
    <Wrap>
      <div className="content-mockup">{content}</div>
      <LoaderWrap size={size} color={color} />
    </Wrap>
  )
}
