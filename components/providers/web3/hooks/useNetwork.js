

import { useEffect } from "react"
import useSWR from "swr"


const NETWORKS = {
    1: "Ethereum Main Network",
    3: "Ropsten Test Network",
    5: "Goerli Test Network",
    11155111:"Sepolia Test Network",
    1337: "Ganache Network",
}


const targetNetwork = NETWORKS[process.env.NEXT_PUBLIC_TARGET_CHAIN_ID]

export const handler = (web3) => () => {
  const { data, ...rest } = useSWR(
    () => (web3 ? "web3/network" : null),
    async () => {
      const chainId = Number(
        await window.ethereum.request({ method: "eth_chainId" })
      );

      if (!chainId) {
        throw new Error(
          "Cannot retrieve a network, Please refresh the browser"
        );
      }

      return NETWORKS[chainId];
      //   return chainId
    }
  );


 /**Previous useEffects went here, getting provider as a dependency and mutate function in the swrRes before passing it to the return */
  

  return {
    // without using enhance Hooks
    // network: {
    // }

    data,
    target: targetNetwork,
    isSupported: data === targetNetwork,
    ...rest,
  };
};





















// useEffect(() => {
//   // provider && provider.on("chainChanged", chainId => mutate(chainId));

//   provider &&
//   provider.on("chainChanged", chainId => {
//       mutate(NETWORKS[parseInt(chainId, 16)])
//   } )

// }, [web3]);






// // reducing amount of rendering done by useEffect
//   useEffect(() => {
//     // const mutator = (chainId) => mutate(NETWORKS[parseInt(chainId, 16)]);

//     // reload on network change
//     const mutator = chainId => window.location.reload()
//     provider?.on("chainChanged", mutator);

//     // check the reduced rendering
//     // console.log("yuyuyu")

//     return () => {
//       provider?.removeListener("chainChanged", mutator);

//     // console.log(provider);

//     };

//   }, [provider]);