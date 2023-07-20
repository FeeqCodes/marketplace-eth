// import { useState } from "react";

// import { Button } from "@components/ui/common";
// import { CourseCard, CourseList } from "@components/ui/course";
// import { OrderModal } from "@components/ui/order";

// import { MarketHeader } from "@components/ui/marketplace";

// import { BaseLayout } from "@components/ui/layout";

// // Fetch Courses
// import { getAllCourses } from "@content/courses/fetcher";

// import { useWeb3 } from "@components/providers";

// // use metamask hooks at once
// import { useWalletInfo } from "@components/hooks/web3";

// export default function Marketplace({ courses }) {
//   const { web3, contract } = useWeb3();

//   /**
//    *  use metamask hooks at once
//    */
//   const { canPurchaseCourse, account } = useWalletInfo();

//   /**
//    * Handling modal events
//    */
//   const [selectedCourse, setSelectedCourse] = useState(null);

//   /**
//    *  get purchase details for smart contract
//    */
//   // const purchaseCourse = async (order) => {
//   //   /**
//   //    * Test purchase by getting a stringified data as an alert
//   //    */
//   //   // alert(JSON.stringify(order))

//   //   // Illustration
//   //   /**hex course ID: CHange courseId to hex
//   //     0x31343130343734000000000000000000

//   //     address: Account Address
//   //     0xf8929048D74164582E5FA0897fC654CbF0c096C6

//   //     hex course ID + address = 36bytes
//   //     0x31343130343734000000000000000000f8929048D74164582E5FA0897fC654CbF0c096C6

//   //     Order Hash = Keccak256(hex course ID + address)
//   //     0x2e0b409e2bf77ce6466df3990199f3a7377f305fef2c55556a8cae5decbdd0e5

//   //     Email Hash =
//   //     0xaf257bcc3cf653863a77012256c927f26d8ab55c5bea3751063d049d0538b902
//   //     31343130343734

//   //     af257bcc3cf653863a77012256c927f26d8ab55c5bea3751063d049d0538b902
//   //     proof =
//   //     0xb9fc503fa267a62c6054c94b93e5cd732683cb6cf37ce0e356db3821b82813a7
//   //    *
//   //    */

//   //   // hexCourseId
//   //   const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id);
//   //   console.log(hexCourseId);

//   //   // courseHash
//   //   const orderHash = web3.utils.soliditySha3(
//   //     { type: "bytes16", value: hexCourseId },
//   //     { type: "address", value: account.data }
//   //   );
//   //   console.log(orderHash);

//   //   // emailHash
//   //   const emailHash = web3.utils.sha3(order.email);
//   //   console.log(emailHash);

//   //   // construct proof = emailHash + courseHash
//   //   const proof = web3.utils.soliditySha3(
//   //     { type: "bytes32", value: emailHash },
//   //     { type: "bytes32", value: orderHash }
//   //   );
//   //   console.log(proof);

//   //   // get eth course price and change to wei
//   //   console.log(String(order.price));
//   //   console.log(order);

//   //   const value = web3.utils.toWei(order.price, "ether");
//   //   console.log(value);

//   //   const value2 = web3.utils.toWei(String(order.price));
//   //   console.log(value2)

//   //   // Pass values to smart contract
//   //   try {
//   //     const result = await contract.methods.purchaseCourse(hexCourseId, proof).send({ from: account.data, value });

//   //     console.log(result)
//   //   } catch {
//   //     console.log("Purchase course: Operation has failed!");
//   //   }

//   //   if (value) {
//   //     await contract.methods
//   //       .purchaseCourse(orderHash, proof)
//   //       .send({ from: account.data, value });
//   //   } else {
//   //     console.log("real error");
//   //   }
//   // };

//   const purchaseCourse = async (order) => {
//     // Lets add zero padding to fill up the remaining bytes16
//     const selectedCourseId = selectedCourse.id;
//     const paddedCourseId = selectedCourseId.padEnd(16, "0");
//     const hexCourseId = web3.utils.utf8ToHex(paddedCourseId);
//     console.log(hexCourseId);

//     const orderHash = web3.utils.soliditySha3(
//       { type: "bytes16", value: hexCourseId },
//       { type: "address", value: account.data }
//     );
//     console.log(orderHash);
//     // f3650095244dfd1afba136029f402b3852d5d566aaa212c66d3ecf1983d5b8fe

//     const emailHash = web3.utils.sha3(order.email);
//     console.log(emailHash);

//     const proof = web3.utils.soliditySha3(
//       { type: "bytes", value: emailHash },
//       { type: "bytes32", value: orderHash }
//     );
//     console.log(proof);
//     // af257bcc3cf653863a77012256c927f26d8ab55c5bea3751063d049d0538b902

//     const value = web3.utils.toWei(order.price, "ether");

//     try {
//       const result = await contract.methods
//         .purchaseCourse(hexCourseId, proof)
//         .send({ from: account.data, value });
//       console.log(result);
//     } catch {
//       console.error("Purchase course: Operation has failed.");
//     }
//   };

//   //  af257bcc3cf653863a77012256c927f26d8ab55c5bea3751063d049d0538b902

//   return (
//     <>
//       <div className="py-4">
//         <MarketHeader />
//       </div>
//       {/* Having different course list in different pages */}
//       <CourseList courses={courses}>
//         {(course) => (
//           <CourseCard
//             key={course.id}
//             course={course}
//             disabled={!canPurchaseCourse}
//             CardBtn={() => (
//               <div className="mt-4">
//                 <Button
//                   onClick={() => setSelectedCourse(course)}
//                   variant="lightPurple"
//                   disabled={!canPurchaseCourse}
//                 >
//                   Purchase
//                 </Button>
//               </div>
//             )}
//           />
//         )}
//       </CourseList>
//       {/* { selectedCourse &&
//         <OrderModal course={selectedCourse} /> 
//       } */}
//       {selectedCourse ? (
//         <OrderModal
//           course={selectedCourse}
//           onSubmit={purchaseCourse}
//           onClose={() => setSelectedCourse(null)}
//         />
//       ) : (
//         ""
//       )}
//     </>
//   );
// }

// export function getStaticProps() {
//   const { data } = getAllCourses();
//   return {
//     props: {
//       courses: data,
//       // toto: data
//     },
//   };
// }

// Marketplace.Layout = BaseLayout;











import { CourseCard, CourseList } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";
import { useWalletInfo } from "@components/hooks/web3";
import { Button } from "@components/ui/common";
import { OrderModal } from "@components/ui/order";
import { useState } from "react";
import { MarketHeader } from "@components/ui/marketplace";
import { useWeb3 } from "@components/providers";


export default function Marketplace({ courses }) {
  
  const { web3, contract } = useWeb3();
  const { canPurchaseCourse, account } = useWalletInfo();
  const [selectedCourse, setSelectedCourse] = useState(null);

  const purchaseCourse = async (order) => {
    // const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id);
    // console.log(hexCourseId);

    const selectedCourseId = selectedCourse.id;
    const paddedCourseId = selectedCourseId.padEnd(16, "0");
    const hexCourseId = web3.utils.utf8ToHex(paddedCourseId);
    console.log(hexCourseId);
    // 31343130343734343839333734373434

    const courseHash = web3.utils.soliditySha3(
      { type: "bytes16", value: hexCourseId },
      { type: "address", value: account.data }
    );
    console.log(courseHash);
    // 9b8f199c03097f32debf5f67747e7c1bad0172863081c5e1afae696628abfb46

    const emailHash = web3.utils.sha3(order.email);
    console.log(emailHash);

    const proof = web3.utils.soliditySha3(
      { type: "bytes", value: emailHash },
      { type: "bytes", value: courseHash }
    );
    console.log(proof);
    // 0a3e0fbaf6655567c3efec3f697a7ec70e37d94c8cbd7476e9b494f3dacdcb4c
    // 184a81a131cba0df4dec1d0393007d222c7dfd953314b50e2c97133afac09a84

    const value = web3.utils.toWei(order.price, "ether");

    try {
      const result = await contract.methods
        .purchaseCourse(hexCourseId, proof)
        .send({ from: account.data, value });
      console.log(result);
    } catch {
      console.error("Purchase course: Operation has failed.");
    }
  };

  return (
    <>
      <div className="py-4">
        <MarketHeader />
      </div>
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
                  disabled={!canPurchaseCourse}
                  variant="lightPurple"
                >
                  Purchase
                </Button>
              </div>
            )}
          />
        )}
      </CourseList>
      {selectedCourse && (
        <OrderModal
          course={selectedCourse}
          onSubmit={purchaseCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
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





Marketplace.Layout = BaseLayout;