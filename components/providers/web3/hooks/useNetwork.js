

import { useEffect } from "react"
import useSWR from "swr"


const NETWORKS = {
    1: "Ethereum Main Network",
    3: "Ropsten Test Network",
    5: "Goerli Test Network",
    1337: "Ganache Network",
}


const targetNetwork = NETWORKS[process.env.NEXT_PUBLIC_TARGET_CHAIN_ID]

export const handler = (web3, provider) => () => {
  const { data, mutate, ...rest } = useSWR(
    () => (web3 ? "web3/network" : null),
    async () => {
      const chainId = Number(await window.ethereum.request({ method: 'eth_chainId' }));
      
      return NETWORKS[chainId]
    //   return chainId
    }
  );

  useEffect(() => {
    // provider && provider.on("chainChanged", chainId => mutate(chainId));
    
    provider &&
    provider.on("chainChanged", chainId => {
        mutate(NETWORKS[parseInt(chainId, 16)])
    } )

  }, [web3]);

  return {
    // without using enhance Hooks
    // network: {
    // }

    data,
    mutate,
    target: targetNetwork,
    isSupported: data === targetNetwork,
    ...rest,
  };
};
