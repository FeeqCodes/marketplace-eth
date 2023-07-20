import { useAccount, useOwnedCourses } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Button, Message } from "@components/ui/common";
import { OwnedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { getAllCourses } from "@content/courses/fetcher";
import Link from "next/dist/client/link";

import { useRouter } from "next/router";




export default function OwnedCourses({ courses }) {
  const { account } = useAccount();

  // pass the courses and account to the useOwnedCourses
  const { ownedCourses } = useOwnedCourses(courses, account.data);
  console.log(ownedCourses.data)
  // display error message when no metamask is detected
  const { requireInstall } = useWeb3();

  const router = useRouter();

  return (
    <>
      <div className="py-4">
        <MarketHeader />
      </div>
      <section className="grid grid-cols-1">
        {/* when the ownedCourses is empty */}
        {ownedCourses.isEmpty && (
          <div>
            <Message type="success">
              <div>You do not have any course </div>
              <Link href="/marketplace" className="font-normal hover:underline">
                <i>purchase Course</i>
              </Link>
            </Message>
          </div>
        )}
        {/* when there is no account connected */}
        {account.isEmpty && (
          <div>
            <Message type="success">
              <div>Please Connect to Metamask </div>
            </Message>
          </div>
        )}
        {/* when metamask is not installed */}
        {requireInstall.isEmpty && (
          <div>
            <Message type="success">
              <div>Please Install Metamask </div>
            </Message>
          </div>
        )}
        {/* Display the purchased courses */}
        {ownedCourses.data?.map((course) => (
          <OwnedCourseCard key={course.id} course={course}>
            <Button onClick={() => router.push(`/courses/${course.slug}`)}>
              Watch the course
            </Button>
          </OwnedCourseCard>
        ))}
      </section>
    </>
  );
}

export function getStaticProps() {
  const { data } = getAllCourses();
  return {
    props: {
      courses: data,
    },
  };
}

OwnedCourses.Layout = BaseLayout;
