import { useEffect, Fragment, useState } from 'react'
import Card from '@material-ui/core/Card'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import Item from './components/Item'
import Paragraph from 'src/components/layout/Paragraph'
import { nftAssetsFromNftTokensSelector, orderedNFTAssets } from 'src/logic/collectibles/store/selectors'
import SendModal from 'src/routes/safe/components/Balances/SendModal'
import { useAnalytics, SAFE_EVENTS } from 'src/utils/googleAnalytics'
import { NFTToken } from 'src/logic/collectibles/sources/collectibles.d'
import { styles } from './styles'
const useStyles = makeStyles(styles)

const Collectibles = (): React.ReactElement => {
  const { trackEvent } = useAnalytics()
  const classes = useStyles()
  const [selectedToken, setSelectedToken] = useState<NFTToken | undefined>()
  const [sendNFTsModalOpen, setSendNFTsModalOpen] = useState(false)

  const nftTokens = useSelector(orderedNFTAssets)
  const nftAssetsFromNftTokens = useSelector(nftAssetsFromNftTokensSelector)

  useEffect(() => {
    trackEvent(SAFE_EVENTS.COLLECTIBLES)
  }, [trackEvent])

  const handleItemSend = (nftToken: NFTToken) => {
    setSelectedToken(nftToken)
    setSendNFTsModalOpen(true)
  }

  return (
    <Card className={classes.cardOuter}>
      <div className={classes.cardInner}>
        {/* No collectibles */}
        {nftAssetsFromNftTokens.length === 0 && (
          <Paragraph className={classes.noData}>No collectibles available</Paragraph>
        )}

        {/* collectibles List*/}
        {nftAssetsFromNftTokens.length > 0 &&
          nftAssetsFromNftTokens.map((nftAsset) => {
            return (
              <Fragment key={nftAsset.slug}>
                <div className={classes.title}>
                  <div className={classes.titleImg} style={{ backgroundImage: `url(${nftAsset.image || ''})` }} />
                  <h2 className={classes.titleText}>{nftAsset.name}</h2>
                  <div className={classes.titleFiller} />
                </div>
                <div className={classes.gridRow}>
                  {nftTokens
                    .filter(({ assetAddress }) => nftAsset.address === assetAddress)
                    .map((nftToken) => (
                      <Item
                        data={nftToken}
                        key={`${nftAsset.slug}_${nftToken.tokenId}`}
                        onSend={() => handleItemSend(nftToken)}
                      />
                    ))}
                </div>
              </Fragment>
            )
          })}
      </div>
      <SendModal
        activeScreenType="sendCollectible"
        isOpen={sendNFTsModalOpen}
        onClose={() => setSendNFTsModalOpen(false)}
        selectedToken={selectedToken}
      />
    </Card>
  )
}

export default Collectibles
