import { useHooks } from "@components/providers/web3";

const enhanceHook = (swrRes) => {
  return {
    ...swrRes,
    // hasInitialResponse: swrRes.data || swrRes.error,
    hasFirstResponse: swrRes.data || swrRes.error,
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

  return {
    account,
    network,
    canPurchaseCourse: !!(account.data && network.isSupported),
  };
};
