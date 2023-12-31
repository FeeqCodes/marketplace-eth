// import { Button } from "@components/ui/common"
import { Message } from "@components/ui/common";
import Image from "next/image";
import Link from "next/link";
/**{pending} animation-
 * https://react-simple-animate.vercel.app/ */ 
import { AnimateKeyframes } from "react-simple-animate";

export default function Card({ course, CardBtn, disabled, state }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="flex h-full">
        <div className="flex h-full next-image-wrapper">
          <Image
            className={`object-cover ${disabled && "filter grayscale"}`}
            src={course.coverImage}
            width="240"
            height="200"
            alt={course.title}
          />
        </div>
        <div className="p-8 flex-1">
          <div className="flex items-center">
            <div className="uppercase mr-2 tracking-wide text-sm text-indigo-500 font-semibold">
              {course.type}
            </div>

            <div>
              {state === "activated" && (
                <div className="text-xs text-black bg-green-200 p-1 px-3 rounded-full">
                  Activated
                </div>
              )}

              {state === "deactivated" && (
                <div className="text-xs text-black bg-red-200 p-1 px-3 rounded-full">
                  Deactivated
                </div>
              )}

              {state === "purchased" && (
                <AnimateKeyframes
                  play
                  duration={2.5}
                  keyframes={["opacity: 0.2", "opacity: 1"]}
                  iterationCount="infinite"
                >
                  <div className="text-xs text-black bg-yellow-200 p-1 px-3 rounded-full">
                    Pending
                  </div>
                </AnimateKeyframes>
              )}
            </div>
          </div>

          <Link legacyBehavior href={`/courses/${course.slug}`}>
            <a className="h-12 block mt-1 text-sm sm:text-base leading-tight font-medium text-black hover:underline">
              {course.title}
            </a>
          </Link>
          <p className="mt-2 mb-4 text-sm sm:text-base text-gray-500">
            {course.description.substring(0, 70)}...
          </p>

          {CardBtn && <CardBtn />}
        </div>
      </div>
    </div>
  );
}
