
import { Button, Hero, Modal } from "@components/ui/common"
import { CourseCard, CourseList } from "@components/ui/course"
import { OrderModal } from "@components/ui/order"

import { BaseLayout } from "@components/ui/layout"
import { EthRates, WalletBar } from "@components/ui/web3"

import { getAllCourses } from "@content/courses/fetcher"
import { useAccount, useNetwork } from "@components/hooks/web3"

import { useEthPrice } from "@components/hooks/useEthPrice"

import { useState } from "react"



export default function Marketplace({courses}) {
  // Handling modal events
  const [selectedCourse, setSelectedCourse] = useState(null)
	//pass user account to wallet bar
	const { account } = useAccount()
  const { network } = useNetwork()
  // fetch eth price data
  const { eth } = useEthPrice()
  
  // Disable btn when user is not connected or connected to wrong network
  const canPurchaseCourse = !!(account.data && network.isSupported)


  return (
    <>
      <div className="py-4">
        <WalletBar
          address={account.data}
          network={{
            data: network.data,
            target: network.target,
            isSupported: network.isSupported,
            hasFirstResponse: network.hasFirstResponse,
          }}
        />
        <EthRates 
          eth={eth.data}
          perItem={eth.perItem}
        />
      </div>
      {/* Having different course list in different pages */}
      <CourseList courses={courses}>
        {(course) => (
          <CourseCard
            key={course.id}
            course={course}
            disabled={!canPurchaseCourse}
            CardBtn={() => (
              <div className="mt-4">
                <Button
                  onClick={() => setSelectedCourse(course)}
                  variant="lightPurple"
                  disabled={!canPurchaseCourse}
                >
                  Purchase
                </Button>
              </div>
            )}
          />
        )}
      </CourseList>
      {/* { selectedCourse &&
        <OrderModal course={selectedCourse} /> 
      } */}
      {selectedCourse ? 
        <OrderModal 
          course={selectedCourse} 
          onClose={ ()=> setSelectedCourse(null)}
        /> : ""}
    </>
  );
}

export function getStaticProps() {
  const { data } = getAllCourses()
  return {
    props: {
      courses: data,
      // toto: data
    }
  }
}

Marketplace.Layout = BaseLayout
