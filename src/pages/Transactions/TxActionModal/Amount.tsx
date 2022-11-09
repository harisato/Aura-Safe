import { getNativeCurrency } from 'src/config'
import { formatNativeToken } from 'src/utils'

export default function Amount({ amount = 0 }) {
  const nativeCurrency = getNativeCurrency()
  return (
    <div className="total-amount">
      <p className="title"> Amount</p>
      <div className="amount">
        <img alt={'nativeCurrencyLogoUri'} height={25} src={nativeCurrency.logoUri} />
        <p>{formatNativeToken(amount)}</p>
      </div>
    </div>
  )
}
