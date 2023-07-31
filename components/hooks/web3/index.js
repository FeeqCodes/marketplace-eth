import { useHooks, useWeb3 } from "@components/providers/web3";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";


// getting the state of our website when theres empty data
const _isEmpty = data => {

  return (
    data == null ||
    data === "" ||
    (Array.isArray(data) && data.length === 0) ||
    (data.constructor === Object && Object.keys(data).length === 0)
  )
}


// we use the enhance hook to wrap all our hooks
const enhanceHook = (swrRes) => {

  const { data, error} = swrRes
  const hasFirstResponse = (!!data || error)
  const isEmpty = hasFirstResponse && _isEmpty(data)

  return {
    // hasInitialResponse: swrRes.data || swrRes.error,
    ...swrRes,
    isEmpty,
    hasFirstResponse
  };
};



export const useNetwork = () => {
  const swrRes = enhanceHook(useHooks((hooks) => hooks.useNetwork)());
  return {
    network: swrRes,
  };
};


export const useAccount = () => {
  const swrRes = enhanceHook(useHooks((hooks) => hooks.useAccount)());
  return {
    account: swrRes,
  };
};

export  const useAdmin = ({redirectTo}) => {
  const {account} = useAccount()
  const { requireInstall } = useWeb3()
  const router = useRouter()

  useEffect(()=> {
    if (
      (requireInstall || account.hasFirstResponse && !account.isAdmin) || account.isEmpty
    ) {

      router.push(redirectTo)
    }
  }, [account])

  return { account }
}


// we receive the params passed from owned.js as (...args)
export const useOwnedCourses = (...args) => {
  const swrRes = enhanceHook(
    useHooks((hooks) => hooks.useOwnedCourses)(...args)
  );

  // the passed args is now in the ownedCourses because it was also passed in the hook function above
  return {
    ownedCourses: swrRes,
  };
};


// using single course
export const useOwnedCourse = (...args) => {
  const swrRes = enhanceHook(
    useHooks((hooks) => hooks.useOwnedCourse)(...args)
  );

  return {
    ownedCourse: swrRes,
  };
};


// Extract all purchased courses to the manage course page
export const useManagedCourses = (...args) => {
  const swrRes = enhanceHook(useHooks(hooks => hooks.useManagedCourses)(...args))

  return {
    managedCourses: swrRes
  }
}


// =========Without using enhance hooks
// export const useNetwork = () => {
//   return useHooks((hooks) => hooks.useNetwork)();
// };
// export const useAccount = () => {
//   return useHooks((hooks) => hooks.useAccount)();
// };



export const useWalletInfo = () => {
  const { account } = useAccount();
  const { network } = useNetwork();

  // determine when account and network is loading
  const isConnecting = !account.hasFirstResponse &&
  !network.hasFirstResponse
  
  return {
    account,
    network,
    isConnecting,
    canPurchaseCourse: !!(account.data && network.isSupported),
  };
};
