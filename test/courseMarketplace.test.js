const { assert } = require("ethers");




const CourseMarketplace = artifacts.require("CourseMarketplace");

  // --Truffle os using: 
  // Mocha - Framework for testing internally
  //  Chai - Assertion JS library



/**
 * SETTING UP THE CONTRACT
 */
contract("CourseMarketplace", accounts => {
  // params values
  const courseId = "0x00000000000000000000000000003132";
  const proof =
    "0x0000000000000000000000000000313200000000000000000000000000003132";
  const value = "800000000";

  // contract values
  let _contract = null;
  let contractOwner = null;
  let buyer = null;
  let courseHash = null;

  before(async () => {
    _contract = await CourseMarketplace.deployed();
    contractOwner = accounts[0];
    buyer = accounts[1];

    // console.log(_contract)
    // console.log(contractOwner)
    // console.log(buyer)
  });

  // Executing a function - purchaseCourse
  describe("Purchase the new Course", () => {
    before(async () => {
      await _contract.purchaseCourse(courseId, proof, {
        from: buyer,
        value,
      });
    });


    // buyer should not be able to repurchase course
    it("should NOT allow to repurchase already owned course", async ()=> {
      await catchRevert(_contract.purchaseCourse(courseId, proof, {
        from: buyer,
        value,
      })) 
    })



    // retrieving a value - getCourseHashAtIndex
    it("can get the purchase course hash by index", async () => {
      const index = 0;
      courseHash = await _contract.getCourseHashAtIndex(index);
      const expectedHash = web3.utils.soliditySha3(
        { type: "bytes16", value: courseId },
        { type: "address", value: buyer }
      );

      assert.equal(
        courseHash,
        expectedHash,
        "CourseHash not matching expectedHash"
      );
    });

    // check for id and state
    it("should match the data of the course Purchased", async () => {
      const expectedIndex = 0;
      const expectedState = 0;

      const course = await _contract.getCourseByHash(courseHash);

      assert.equal(
        course.id,
        expectedIndex,
        "Course does not match with expected Index"
      );
      assert.equal(
        course.price,
        value,
        "Course price does not match with expected value"
      );
      assert.equal(
        course.proof,
        proof,
        "Course does not match with expected proof"
      );
      assert.equal(
        course.owner,
        buyer,
        "Course does not match with expected buyer"
      );
      assert.equal(
        course.state,
        expectedState,
        "Course does not match with expected state"
      );
    });
  });

  // Executing a function - ActivateCourse
  describe("Activate the Purchased Course", () => {
    before(async () => {
      await _contract.activateCourse(courseHash, { from: contractOwner });
    });

    it("should have ACTIVATED state", async () => {
      const course = await _contract.getCourseByHash(courseHash);
      const expectedState = 1;

      assert.equal(
        course.state,
        expectedState,
        "Course should have 'activated' state "
      );
    });
  });


  // Executing a function - transferOwnership
  describe("Testing transfer ownership", () => {
    let currentOwner = null;

    before(async () => {
      currentOwner = await _contract.getContractOwner();
    });

    // testing transfer ownership - from right account
    it("getContractOwner should return deployer address", async () => {
      assert.equal(
        contractOwner,
        currentOwner,
        "Contract owner is not matching the one from getContractOwner Function"
      );
    });

    //testing transfer ownership - from wrong account
    it("should NOT transfer ownership when contract owner is not sending TX", async () => {
      await catchRevert(
        _contract.transferOwnership(accounts[3], { from: accounts[4] })
      );
    });



    // testing transfer ownership - from current account to new account
    it("should transfer ownership to 3rd address from 'accounts' ", async () => {
      await _contract.transferOwnership(accounts[2], {from: currentOwner})
      const owner = await _contract.getContractOwner();

      assert.equal(owner, accounts[2], "Contract owner is not account[2]")
    });


    // testing transfer ownership - from new account back to previous account
    it("should transfer ownership back to initial contract owner ", async () => {
      await _contract.transferOwnership(contractOwner, {from: accounts[2]})
      const owner = await _contract.getContractOwner();

      assert.equal(owner, contractOwner, "Contract owner is not set")
    });

  });

}) 



// Run truffle test- to get output
//  the before- is initialization
//  the it - is executing the functions
//  the assert is the main test(comparison)

// get notes on cathRevert and exceptions from lesson 6