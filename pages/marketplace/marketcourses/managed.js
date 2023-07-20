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
  const { web3 } = useWeb3();
  const { account } = useAdmin({ redirectTo: "/marketplace" });
  // const {account} = useAccount()
  const { managedCourses } = useManagedCourses(account);
  // console.log(managedCourses.data);
  // The returned infos

  const [proofedOwnership, setProofedOwnership] = useState({});

  const verifyCourse = (email, { hash, proof }) => {
    // console.log(email)
    // console.log(hash)
    // console.log(proof);

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

  if (!account.isAdmin) {
    return null
  }

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
        <CourseFilter />
      </div>
      <section className="grid grid-cols-1">
        {managedCourses.data?.map((course) => (
          <ManagedCourseCard key={course.ownedCourseId} course={course}>
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
          </ManagedCourseCard>
        ))}
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
