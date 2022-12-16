import styled from 'styled-components'

interface IBreadcrumbProps {
  title: string
  subtitle?: string
  subtitleIcon?: any
}
const Wrap = styled.div<{ icon: any }>`
  margin-bottom: 16px;
  > .breadcrumb-title {
    font-weight: 700;
    font-size: 32px;
    line-height: 40px;
    color: #ffffff;
    margin: 0;
  }
  .breadcrumb-subtitle {
    margin: 0;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
  }
  > div {
    display: flex;
    align-items: center;
    > div {
      width: 16px;
      height: 16px;
      margin-right: 8px;
      background-color: white;
      mask-image: url(${(props) => props.icon});
      mask-repeat: no-repeat;
      mask-position: center;
      mask-size: contain;
    }
  }
`
export default function Breadcrumb({ title, subtitle, subtitleIcon }: IBreadcrumbProps) {
  return (
    <Wrap icon={subtitleIcon}>
      <p className="breadcrumb-title">{title}</p>
      {title && (
        <div>
          {subtitleIcon && <div />}
          <p className="breadcrumb-subtitle">{subtitle}</p>
        </div>
      )}
    </Wrap>
  )
}
