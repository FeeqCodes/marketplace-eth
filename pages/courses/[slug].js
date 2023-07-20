import { useAccount, useOwnedCourse } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Message, Modal } from "@components/ui/common";
import { CourseHero, Curriculum, Keypoints } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";

import { getAllCourses } from "@content/courses/fetcher";

export default function Course({ course }) {
  const { isLoading } = useWeb3()
  const { account } = useAccount();

  // pass it to the ownedCourse
  const { ownedCourse } = useOwnedCourse(course, account.data);
  console.log(ownedCourse);
  // get course state
  const courseState = ownedCourse.data?.state;
  // Checking other states[Hand coded]
  // const courseState = "deactivated"

  // create instance and pass to the curriculum[locked]
  const isLocked = 
  !courseState ||
  courseState === "purchased" || 
  courseState === "deactivated" 
  // courseState == null

  return (
    <>
      {/* Testing the ownedCourse data */}
      {/* {JSON.stringify(ownedCourse[4])} */}
      {/* {course.title} */}

      <div className="py-4">
        <CourseHero
          hasOwner={!!ownedCourse.data}
          title={course.title}
          description={course.description}
          image={course.coverImage}
        />
      </div>
      <Keypoints points={course.wsl} />

      { courseState && (
        <div className="max-w-5xl mx-auto">

          { courseState === "purchased" && (
            <Message type="success">
              Course is purchased and waiting for the activation. Process can
              take upto 24hrs
              <i className="block font-normal">
                In case of any questions, please contact admin.
              </i>
            </Message>
          )}

          { courseState === "activated" && (
            <Message type="success">
              Course Now Activated. Happy Watching!
            
            </Message>
          )}

          { courseState === "deactivated" && (
            <Message type="danger">
              Course is deactivated, Please contact admin
              
            </Message>
          )}

        </div>
      )}

      <Curriculum 
        isLoading={isLoading}
        locked={isLocked} 
        courseState={courseState}
      />
      <Modal />
    </>
  );
}

export function getStaticPaths() {
  const { data } = getAllCourses();

  return {
    paths: data.map((c) => ({
      params: {
        slug: c.slug,
      },
    })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const { data } = getAllCourses();
  const course = data.filter((c) => c.slug === params.slug)[0];

  return {
    props: {
      course,
    },
  };
}

Course.Layout = BaseLayout;
