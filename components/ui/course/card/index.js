

// import { Button } from "@components/ui/common"
import Image from "next/image"
import Link from "next/link"

export default function Card({course, CardBtn, disabled}) {
  return (
    
    <div
        className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="flex h-full">
        <div className="flex h-full next-image-wrapper">
            <Image
            className={`object-cover ${disabled && "filter grayscale" }`}
            src={course.coverImage}
            width="240"
            height="200"
            alt={course.title}
            />
        </div>
        <div className="p-8 flex-1">
            <div
            className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            {course.type}
            </div>
            <Link legacyBehavior href={`/courses/${course.slug}`}>
              <a
                  className="h-12 block mt-1 text-lg leading-tight font-medium text-black hover:underline">
                  {course.title}
              </a>
            </Link>
            <p
            className="mt-2 text-gray-500">
            {course.description.substring(0, 70)}...
            </p>

            { CardBtn &&
              <CardBtn />
            }
            
        </div>
        </div>
    </div>

  )
}
