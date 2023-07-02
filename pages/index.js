import { Hero } from "@components/ui/common"
import { CourseCard, CourseList } from "@components/ui/course"
import { BaseLayout } from "@components/ui/layout"
import { getAllCourses } from "@content/courses/fetcher"



// use the provider with the created useWeb3 Function
// import { useWeb3 } from "@components/providers"

export default function Home({courses}) {
  // const {test} = useWeb3()
  // const { web3, isLoading } = useWeb3()
  // console.log(web3)
  return (
    <>
      {/* {test} */}
      {/* { isLoading ? "Is Loading web3" : web3 ? "web3 ready" : "Please Install Metamask"} */}
      <Hero />

      {/* <CourseList
        courses={courses}
      /> */}
      

      {/* Traverse through course LIst for a different CourseCard */}
      <CourseList courses={courses}>
        { course => 
          <CourseCard 
            key={course.id} 
            course={course} 
          /> 
        }
      </CourseList>
    </>
  )
}

export function getStaticProps() {
  const { data } = getAllCourses()
  return {
    props: {
      courses: data,
      toto: data
    }
  }
}

Home.Layout = BaseLayout




