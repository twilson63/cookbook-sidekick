import Arweave from 'arweave'
import {
  always, compose, cond, equals, T, takeLast, join, split,
  identity
} from 'ramda'

const arweave = Arweave.init({
  host: getHost(),
  protocol: 'https',
  port: 443
})

export const dispatch = (dataItem) => arweave.createTransaction({ data: dataItem.data })
  .then(tx => {
    dataItem.tags.map(t => tx.addTag(t.name, t.value))
    return tx
  })
  .then(tx => window.arweaveWallet.dispatch(tx))
//.then(res => (console.log(res), res))



function getHost() {
  return compose(
    cond([
      [equals("gitpod.io"), always("arweave.net")],
      [equals("arweave.dev"), always("arweave.net")],
      [equals("localhost"), always("arweave.net")],
      [T, identity],
    ]),
    join("."),
    takeLast(2),
    split(".")
  )(location.hostname);
}