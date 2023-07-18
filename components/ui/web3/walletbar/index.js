

// import { useAccount, useNetwork } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers"


// use metamask hooks at once
import { useWalletInfo } from "@components/hooks/web3"
import { Button } from "@components/ui/common";

export default function WalletBar() {
  const { account, network} = useWalletInfo()

  const { requireInstall } = useWeb3()

  
  return (
    <section className="text-white bg-indigo-600 rounded-lg">
      <div className="p-8">
        <h1 className="xs:text-xl text-base break-words">
          Hello, {account.data}
        </h1>
        <h2 className="subtitle mb-5 text-sm xs:text-base">
          I hope you are having a great day!
        </h2>
        <div className="flex justify-between items-center">
          <div className="sm:flex sm:justify-center lg:justify-start">
            <Button 
              variant="white"
              className="mr-2 text-sm xs:text-lg p-2"
            >
              Learn how to purchase
            </Button>
          </div>
          <div>
            {network.hasFirstResponse && !network.isSupported && (
              <div className="bg-red-400 rounded-lg p-3">
                <div>Connected to the wrong network</div>
                <div>
                  Connect to: {` `}
                  <strong className="text-1xl">{network.target}</strong>
                </div>
              </div>
            )}

            {requireInstall && (
              <div className="bg-yellow-500 p-4 rounded-lg p-3">
                Cannot connect to network please install Metamask
              </div>
            )}

            {network.data && (
              <div>
                <span>Currently on </span>
                <strong className="text-2xl">{network.data}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


/////////////////

