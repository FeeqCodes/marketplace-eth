

import { useHooks } from "@components/providers/web3"

export const useNetwork = ()=> {
    return useHooks(hooks => hooks.useNetwork)()
}


export const useAccount = ()=> {
    return useHooks(hooks => hooks.useAccount)()
}


//  if we want to get all metamask hooks at once
export const useWalletInfo = ()=> {
    const {account} = useAccount()
    const {network} = useNetwork()
    const canPurchaseCourse = !!(account.data && network.isSupported)

    return {
        account,
        network,
        canPurchaseCourse
    }
}