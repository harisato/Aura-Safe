import { getNativeCurrency } from 'src/config'
import { formatNativeCurrency, formatNativeToken } from 'src/utils'

export default function TotalAllocationAmount({ amount = 0 }) {
  const nativeCurrency = getNativeCurrency()
  const finalAmount = parseFloat((+amount).toFixed(nativeCurrency.decimals))
  return (
    <div className="total-amount">
      <p className="title"> Total Allocation Amount</p>
      <div className="amount">
        <img alt={'nativeCurrencyLogoUri'} height={25} src={nativeCurrency.logoUri} />
        <p>{formatNativeCurrency(finalAmount)}</p>
      </div>
    </div>
  )
}
