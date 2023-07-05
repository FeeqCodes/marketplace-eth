

import { useState } from "react"

import { Breadcrumbs, Button, Hero, Modal } from "@components/ui/common"
import { CourseCard, CourseList } from "@components/ui/course"
import { OrderModal } from "@components/ui/order"

import { MarketHeader } from "@components/ui/marketplace"

import { BaseLayout } from "@components/ui/layout"

// Fetch Courses
import { getAllCourses } from "@content/courses/fetcher"

// use metamask hooks at once
import { useWalletInfo } from "@components/hooks/web3"


export default function Marketplace({courses}) {
  // Handling modal events
  const [selectedCourse, setSelectedCourse] = useState(null)
	
  // use metamask hooks at once
  const {canPurchaseCourse} = useWalletInfo()

  // get purchase details
  const purchaseCourse = (order)=> {
    alert(JSON.stringify(order))
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
