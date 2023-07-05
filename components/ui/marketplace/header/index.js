


import { Breadcrumbs } from "@components/ui/common";
import { EthRates, WalletBar } from "@components/ui/web3"


const LINKS = [
  {
    href: "/marketplace",
    value: "Buy",
  },
  {
    href: "/marketplace/marketcourses/owned",
    value: "My courses",
  },
  {
    href: "/marketplace/marketcourses/manage",
    value: "Manage Courses",
  },
]

export default function MarketHeader() {
  return (
    <>
      <WalletBar />
      <EthRates />
      <div className="py-4 pb-4 sm:px-6 lg:px-8 flex flex-row-reverse">
        <Breadcrumbs items={LINKS} />
      </div>
    </>
  );
}
