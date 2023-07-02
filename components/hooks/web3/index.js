

import { useHooks } from "@components/providers/web3"

export const useNetwork = ()=> {
    return useHooks(hooks => hooks.useNetwork)()
}


export const useAccount = ()=> {
    return useHooks(hooks => hooks.useAccount)()
}