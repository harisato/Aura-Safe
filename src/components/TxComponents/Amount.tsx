import { getNativeCurrency } from 'src/config'

export default function Amount({ label = 'Amount', amount = '0' }: { label?: string; amount?: string }) {
  const nativeCurrency = getNativeCurrency()
  return (
    <div className="total-amount">
      <p className="title"> {label}</p>
      <div className="amount">
        <img alt={'nativeCurrencyLogoUri'} height={25} src={nativeCurrency.logoUri} />
        <p>{amount}</p>
      </div>
    </div>
  )
}
