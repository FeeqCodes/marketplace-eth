

import { useState } from "react"

import { Breadcrumbs, Button, Hero, Modal } from "@components/ui/common"
import { CourseCard, CourseList } from "@components/ui/course"
import { OrderModal } from "@components/ui/order"

import { MarketHeader } from "@components/ui/marketplace"

import { BaseLayout } from "@components/ui/layout"

// Fetch Courses
import { getAllCourses } from "@content/courses/fetcher"

import { useWeb3 } from "@components/providers"

// use metamask hooks at once
import { useWalletInfo } from "@components/hooks/web3"


export default function Marketplace({courses}) {
  const {web3} = useWeb3()
	
  // use metamask hooks at once
  const {canPurchaseCourse, account} = useWalletInfo()

  // Handling modal events
  const [selectedCourse, setSelectedCourse] = useState(null)
  
  // get purchase details
  const purchaseCourse = (order)=> {
    // alert(JSON.stringify(order))
    const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id)

    // courseHash
    const orderHash = web3.utils.soliditySha3(
      { type: "byte16", value: hexCourseId},
      { type: "address", value: account.data}
    )
    // emailHash
    const emailHash = web3.utils.sha3(order.email)

    // construct proof = emailHash + courseHash
    const proof = web3.utils.soliditySha3(
      { type: "bytes32", value: emailHash },
      { type: "bytes32", value: orderHash }
    )
  }


  return (
    <>
      <div className="py-4">
       <MarketHeader />
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
          onSubmit={purchaseCourse}
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
