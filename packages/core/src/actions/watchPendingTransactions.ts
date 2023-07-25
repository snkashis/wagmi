import {
  type WatchPendingTransactionsParameters as viem_WatchPendingTransactionsParameters,
  type WatchPendingTransactionsReturnType as viem_WatchPendingTransactionsReturnType,
  watchPendingTransactions as viem_watchPendingTransactions,
} from 'viem/actions'

import type { Config } from '../config.js'
import type { ChainIdParameter } from '../types/properties.js'
import type { Evaluate } from '../types/utils.js'

export type WatchPendingTransactionsParameters<config extends Config = Config> =
  Evaluate<
    viem_WatchPendingTransactionsParameters & {
      syncConnectedChain?: boolean | undefined
    } & ChainIdParameter<config>
  >

export type WatchPendingTransactionsReturnType =
  viem_WatchPendingTransactionsReturnType

// TODO: wrap in viem's `observe` to avoid duplicate invocations.
/** https://wagmi.sh/core/actions/watchPendingTransactions */
export function watchPendingTransactions<config extends Config>(
  config: config,
  parameters: WatchPendingTransactionsParameters<config>,
) {
  const {
    onError,
    onTransactions,
    syncConnectedChain = config._internal.syncConnectedChain,
    ...rest
  } = parameters

  let unwatch: WatchPendingTransactionsReturnType | undefined
  const listener = (chainId: number | undefined) => {
    if (unwatch) unwatch()

    const client = config.getClient({ chainId })
    unwatch = viem_watchPendingTransactions(client, {
      ...rest,
      onTransactions,
      onError,
      poll: true,
    })
    return unwatch
  }

  // set up listener for transaction changes
  const unlisten = listener(parameters.chainId)

  // set up subscriber for connected chain changes
  let unsubscribe: (() => void) | undefined
  if (syncConnectedChain && !parameters.chainId)
    unsubscribe = config.subscribe(
      ({ chainId }) => chainId,
      async (chainId) => {
        return listener(chainId)
      },
    )

  return () => {
    unlisten?.()
    unsubscribe?.()
  }
}
