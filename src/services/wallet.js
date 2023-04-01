import { ArweaveWebWallet } from 'arweave-wallet-connector'

const wallet = new ArweaveWebWallet({ name: 'sidekick' })
wallet.setUrl('arweave.app')

export const connect = () =>
  Promise.resolve(window.arweaveWallet)
    .then(w => w ? w.connect(['DISPATCH']) : wallet.connect())