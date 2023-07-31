import {
  useAccount,
  useAdmin,
  useManagedCourses,
} from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Button, Message } from "@components/ui/common";
import { CourseFilter, ManagedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { normalizeOwnedCourse } from "@utils/normalize";
import { withToast } from "@utils/toast";
import { useState } from "react";





const VerificationInput = ({ onVerify }) => {
  const [email, setEmail] = useState("");

  return (
    <div className="flex mr-2 relative rounded-md">
      <input
        value={email}
        onChange={({ target: { value } }) => setEmail(value)}
        type="text"
        name="account"
        id="account"
        className="w-96 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
        placeholder="0x2341ab..."
      />
      <Button
        onClick={() => {
          onVerify(email);
        }}
      >
        Verify
      </Button>
    </div>
  );
};






export default function ManagedCourses() {
  const { web3, contract } = useWeb3();
  const { account } = useAdmin({ redirectTo: "/marketplace" });
  // const {account} = useAccount()
  const { managedCourses } = useManagedCourses(account);
  // console.log(managedCourses.data);
  // The returned infos

  const [proofedOwnership, setProofedOwnership] = useState({});

  // search Course
  const [searchedCourse, setSearchedCourse] = useState(null)
  // filter course
  const [ filters, setFilters ] = useState({state: "all"})

  const verifyCourse = (email, { hash, proof }) => {
    // console.log(email)
    // console.log(hash)
    // console.log(proof);

    if(!email) {
      return;
    }

    const emailHash = web3.utils.sha3(email);

    const proofToCheck = web3.utils.soliditySha3(
      { type: "bytes32", value: emailHash },
      { type: "bytes32", value: hash }
    );

    proofToCheck === proof
      ? setProofedOwnership({
          ...proofedOwnership,
          [hash]: true,
        })
      : setProofedOwnership({
          ...proofedOwnership,
          [hash]: false,
        });
  };

  // active course
  // const activateCourse = async (courseHash) => {
  //   try {
  //     const result1 = await contract.methods
  //       .activateCourse(courseHash)
  //       .send({ from: account.data });
  //     console.log(result1);
  //   } catch (e) {
  //     // console.error(e.message)
  //   }
  // };

  // // deactivate course
  // const deactivateCourse = async (courseHash) => {
  //   try {
  //     const result2 = await contract.methods
  //       .deactivateCourse(courseHash)
  //       .send({ from: account.data });
  //     console.log(result2);
  //   } catch (e) {
  //     // console.error(e.message)
  //   }
  // };

  /**
   * to comply with DRY principles, we can merge both activate and deactivate into one function and create a separation of concern
   */
  const changeCourseState = async (courseHash, methodName)=> {
    try {
      const result = await contract.methods
      [methodName](courseHash)
      .send({from: account.data})

      // managedCourses.mutate()
      return result;

    } catch(e) {
      // console.error(e.message)
      throw new Error(e.message)
    }
  }

  const activateCourse = async ()=> {
    withToast(changeCourseState(courseHash, "activateCourse"))
  }
  const deactivateCourse = async ()=> {
    withToast(changeCourseState(courseHash, "deactivateCourse"))
  }




  

  // search Courses
  const searchCourse = async (hash) => {
    // check if string is hex js
    const re =/[0-9A-Fa-f]{6}/g;

    if(hash && hash.length === 66 && re.test(hash)) {

      const course = await contract.methods.getCourseByHash(hash).call()
        
      if(course.owner !== "0x0000000000000000000000000000000000000000"){
        const normalized = normalizeOwnedCourse(web3)({hash}, course)
        setSearchedCourse(normalized)

        return;
      }

      // alert('valid hex')

    }
    else {
      alert('invalid hex')
    }

    setSearchedCourse(null)
    // if (!hash) {
    //   return;
    // }

    // alert(hash);
  };

  
  
  // CREATE A FUNCTION TO RENDER CARD COMPONENT
  const renderCard = (course, isSearched)=> {
    return (
      <ManagedCourseCard
        key={course.ownedCourseId}
        course={course}
        isSearched={isSearched}
      >
        <VerificationInput
          onVerify={(email) => {
            verifyCourse(email, { hash: course.hash, proof: course.proof });
          }}
        />

        {proofedOwnership[course.hash] && (
          <div className="mt-2">
            <Message>Verified</Message>
          </div>
        )}

        {proofedOwnership[course.hash] === false && (
          <div className="mt-2">
            <Message type="danger">Wrong Proof!</Message>
          </div>
        )}

        {course.state === "purchased" && (
          <div className="mt-2">
            <Button onClick={() => activateCourse(course.hash)} variant="green">
              Activate
            </Button>
            <Button onClick={() => deactivateCourse(course.hash)} variant="red">
              Deactivate
            </Button>
          </div>
        )}
      </ManagedCourseCard>
    );
  }
  




  if (!account.isAdmin) {
    return null;
  }
  

  // CREATE FILTERED COURSES VARIABLE
  const filteredCourses = managedCourses.data
    ?.filter((course) => {
      if (filters.state === "all") {
        return true;
      }
      return course.state === filters.state;
    })
    .map((course) => renderCard(course));

  // {hash: "0x523336a7f236094d2b589851191371c47a28805a525f9467a74b9b93ea840baf";
  // owned: "0xdDa2274b467b9589FB9EE651454E0e3C34E22Eac";
  // ownedCourseId: 4;
  // price: "0.007925";
  // proof: "0x51cef20181d1e656677e26456713b818643e9b243c3cfd267a4424a686eabd1f";
  // state: "purchased";}


  return (
    <>
      <div className="py-4">
        <MarketHeader />
        <CourseFilter 
          onSearchSubmit={searchCourse} 
          onFilterSelect={(value)=> setFilters({state: value})}
        />
      </div>
      <section className="grid grid-cols-1">
        {searchedCourse && (
          <div>
            <h1 className="text-2xl font-bold p-5 ">Search</h1>
            {renderCard(searchedCourse, true)}
          </div>
        )}
        <h1 className="text-2xl font-bold p-5 ">All Courses:</h1>
        { filteredCourses }
        { filteredCourses?.length === 0 &&
          <Message type="warning">
            No courses to display
          </Message>
        }
      </section>
    </>
  );
}

ManagedCourses.Layout = BaseLayout;

{
  /* <OwnedCourseCard>
  <div className="flex mr-2 relative rounded-md">
    <input
      type="text"
      name="account"
      id="account"
      className="w-96 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
      placeholder="0x2341ab..."
    />
    <Button>Verify</Button>
  </div>
</OwnedCourseCard> */
}




































