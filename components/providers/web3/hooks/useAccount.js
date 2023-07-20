import { useEffect, useState } from "react";
import useSWR from "swr";

const adminAddresses = {
  "0xdDa2274b467b9589FB9EE651454E0e3C34E22Eac": true,
};

export const handler = (web3, provider) => () => {
  // const [account, setAccount] = useState(null)
  const { data, mutate, ...rest } = useSWR(
    () => {
      return web3 ? "web3/accounts" : null;
    },
    async () => {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      // we check if our account is undefined or null so we throw an error
      if (!account) {
        throw new Error("Cannot Retrieve account, Please refresh browser");
      }

      return account;
    }
  );

  // useEffect(() => {
  //   const getAccount = async () => {
  //     const accounts = await web3.eth.getAccounts()
  //     setAccount(accounts[0])
  //   }

  //   web3 && getAccount()
  // }, [web3])

 // // Listen for account changes and refresh
  // useEffect(() => {

  //   provider?.on("accountsChanged", (accounts) => mutate(accounts[0] ?? null));

  // }, [provider]);


  // Listen for account changes and refresh
  useEffect(()=> {

    const mutator = (accounts) => mutate(accounts[0] ?? null);
    provider?.on("accountsChanged", mutator)

    // reducing amount of rendering done by useEffect
    return () => {
      provider?.removeListener("accountsChanged", mutator);
    }

  }, [provider])

  return {
    // without using enhance hooks
    // account: {
    // }

    data,
    isAdmin: (data && adminAddresses[data]) ?? false,
    mutate,
    ...rest,
  };
};
