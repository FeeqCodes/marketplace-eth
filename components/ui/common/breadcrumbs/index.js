
import { ActiveLink } from "@components/ui/common"
import React from "react";


/**
 * we can seperate our logic with seperation of concern
 */

// const BreadcrumbItem = ({item, index}) {
//   return(
//     <li
//       className={`${
//         index === 0 ? "pr-4" : "px-4"
//       } font-medium text-gray-500 hover:text-gray-900`}
//     >
//       <ActiveLink legacyBehavior href={item.href}>
//         <a>{item.value}</a>
//       </ActiveLink>
//     </li>
//   )
// }
// And then we pass it to our default function
  // <BreadcrumbItem item={item} index={i}>

  // </BreadcrumbItem>



export default function Breadcrumbs({items, isAdmin}) {

  return (
    <nav aria-label="breadcrumb">
      <ol className="flex leading-none text-indigo-600 divide-x divide-indigo-400">
        {items.map((item, index) => (
          <React.Fragment key={item.href}>
            {!item.requireAdmin && (
              <li
                className={`${
                  index === 0 ? "pr-4" : "px-4"
                } font-medium text-gray-500 hover:text-gray-900`}
              >
                <ActiveLink legacyBehavior href={item.href}>
                  <a>{item.value}</a>
                </ActiveLink>
              </li>
            )}

            {item.requireAdmin && isAdmin && (
              <li
                className={`${
                  index === 0 ? "pr-4" : "px-4"
                } font-medium text-gray-500 hover:text-gray-900`}
              >
                <ActiveLink legacyBehavior href={item.href}>
                  <a>{item.value}</a>
                </ActiveLink>
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
