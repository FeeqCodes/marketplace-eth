



import { useWeb3 } from "@components/providers"
import Button from "@components/ui/common/button"
import { useAccount } from "@components/hooks/web3"

// hide address on specific routes
import { useRouter } from "next/router"
import ActiveLink from "../link"


 

export default function Navbar() {
  const { connect, isLoading, requireInstall } = useWeb3()
  const { account } = useAccount()
  const {pathname} = useRouter()

  return (
    <section>
      <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
        <nav className="relative" aria-label="Global">
          <div className="flex justify-between items-center">
            <div>
              <ActiveLink legacyBehavior href="/" >
                <a
                  className="font-medium mr-8 text-gray-500 hover:text-gray-900">
                  Home
                </a>
              </ActiveLink>
              <ActiveLink legacyBehavior href="/marketplace" >
                <a
                  className="font-medium mr-8 text-gray-500 hover:text-gray-900">
                  Marketplace
                </a>
              </ActiveLink>
              <ActiveLink legacyBehavior href="/blog" >
                <a
                  className="font-medium mr-8 text-gray-500 hover:text-gray-900">
                  Blogs
                </a>
              </ActiveLink>
            </div>
            <div>
              <ActiveLink legacyBehavior href="/wishlist" >
                <a
                  className="font-medium mr-8 text-gray-500 hover:text-gray-900">
                  Wishlist
                </a>
              </ActiveLink>
              
              { isLoading ? 
                <Button
                  disabled={true}
                  onClick={connect}>
                  Loading...
                </Button> : 

                account.data ?
                <Button 
                hoverable={false}
                variant="blue"
                className="cursor-default">
                  Hi There { account.isAdmin && "Admin"}
                </Button> :

                requireInstall ?
                <Button
                  onClick={() => window.push("https://metamask.io/download.html", "_blank")}>Install Metamask
                </Button> :

                <Button
                  onClick={connect}>
                  Connect
                </Button> 
              }
              
            </div>
          </div>
        </nav>
      </div>
      { account.data &&
        !pathname.includes("/marketplace") &&
        <div className="flex justify-end pt-1 sm:px-6 lg:px-8">
          <div className="text-white bg-indigo-600 rounded-md p-2">
            {account.data}
          </div>
        </div>
      }
    </section>
  )
}
