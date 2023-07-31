// --Truffle os using:
// Mocha - Framework for testing internally
//  Chai - Assertion JS library

const CourseMarketplace = artifacts.require("CourseMarketplace");

const { catchRevert } = require("./utils/exceptions");

//  create helper functions

// get balance
// const getBalance = async address => web3.eth.getBalance(address)

// convert to bigNumber
const toBN = (value) => web3.utils.toBN(value);

// to fetch gas -
const getGas = async (result) => {
  const tx = await web3.eth.getTransaction(result.tx);
  const gasUsed = web3.utils.toBN(result.receipt.gasUsed);
  const gasPrice = web3.utils.toBN(tx.gasPrice);
  const gas = gasUsed.mul(gasPrice);

  return gas;
};

/**
 * SETTING UP THE CONTRACT
 */
contract("CourseMarketplace", (accounts) => {
  // params values
  const courseId = "0x00000000000000000000000000002132";
  const proof =
    "0x0000000000000000000000000000213200000000000000000000000000002132";

  //  New courseId and proof to test for deactivate, activate and repurchase course
  const courseId2 = "0x00000000000000000000000000003132";
  const proof2 =
    "0x0000000000000000000000000000313200000000000000000000000000003132";

  const value = "800000000";

  // contract values
  let _contract = null;
  let contractOwner = null;
  let buyer = null;
  let courseHash = null;

  /**
   * before
   */
  before(async () => {
    _contract = await CourseMarketplace.deployed();
    contractOwner = accounts[0];
    buyer = accounts[1];

    // console.log(_contract)
    // console.log(contractOwner)
    // console.log(buyer)
  });

  /**
   * Executing a function - purchaseCourse
   */
  describe("Purchase the new Course", () => {
    before(async () => {
      await _contract.purchaseCourse(courseId, proof, {
        from: buyer,
        value,
      });
    });

    // buyer should not be able to repurchase course
    it("should NOT allow to repurchase already owned course", async () => {
      await catchRevert(
        _contract.purchaseCourse(courseId, proof, {
          from: buyer,
          value,
        })
      );
    });

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

  /**
   * Executing a function - ActivateCourse
   */
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

  /**
   * Executing a function - transferOwnership
   */
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
      await _contract.transferOwnership(accounts[2], { from: currentOwner });
      const owner = await _contract.getContractOwner();

      assert.equal(owner, accounts[2], "Contract owner is not account[2]");
    });

    // testing transfer ownership - from new account back to previous account
    it("should transfer ownership back to initial contract owner ", async () => {
      await _contract.transferOwnership(contractOwner, { from: accounts[2] });
      const owner = await _contract.getContractOwner();

      assert.equal(owner, contractOwner, "Contract owner is not set");
    });
  });

  /**
   * Executing a function - deactivateCourse
   */
  describe("Deactivate Course", async () => {
    let courseHash2 = null;
    let currentOwner = null;

    // only contract owner can deactivate
    before(async () => {
      await _contract.purchaseCourse(courseId2, proof2, { from: buyer, value });
      courseHash2 = await _contract.getCourseHashAtIndex(1);
      currentOwner = await _contract.getContractOwner();
    });

    // Test buyer deactivating-(false) with catchRevert-(True)
    it("should NOT be able to deactivate course by NOT contract owners", async () => {
      await catchRevert(
        _contract.deactivateCourse(courseHash2, { from: buyer })
      );
    });

    // Test contract owner deactivating- True
    it("should have state of deactivated and price 0", async () => {
      // get Contract and buyer balance before tx
      const beforeTxContractBalance = await web3.eth.getBalance(
        _contract.address
      );
      const beforeTxBuyerBalance = await web3.eth.getBalance(buyer);
      // get current owner
      const beforeTxOwnerBalance = await web3.eth.getBalance(currentOwner);

      const result = await _contract.deactivateCourse(courseHash2, {
        from: contractOwner,
      });

      // get balance of contract and buyer after tx
      const afterTxContractBalance = await web3.eth.getBalance(
        _contract.address
      );
      const afterTxBuyerBalance = await web3.eth.getBalance(buyer);
      // get current owner
      const afterTxOwnerBalance = await web3.eth.getBalance(currentOwner);

      const course = await _contract.getCourseByHash(courseHash2);
      const expectedState = 2;
      const expectedPrice = 0;
      const gas = await getGas(result);

      assert.equal(course.state, expectedState, "COURSE is NOT deactivated");
      assert.equal(course.price, expectedPrice, "Course price is not 0!");

      // contract
      assert.equal(
        toBN(beforeTxContractBalance).sub(toBN(value)).toString(),
        afterTxContractBalance,
        "Contract balance is not the same!"
      );

      // buyer
      assert.equal(
        toBN(beforeTxBuyerBalance).add(toBN(value)).toString(),
        afterTxBuyerBalance,
        "Buyer balance is not the same!"
      );

      // current Owner
      assert.equal(
        toBN(beforeTxOwnerBalance).sub(gas).toString(),
        afterTxOwnerBalance,
        "Owner balance is not correct"
      );
    });

    //
    it("should NOT be able to activated deactivate course", async () => {
      await catchRevert(
        _contract.activateCourse(courseHash2, { from: contractOwner })
      );
    });
  });

  /**
   * EXecuting function repurchase course
   */
  // describe("Repurchase Course", () => {
  //   let courseHash2 = null;

  //   before(async () => {
  //     courseHash2 = await _contract.getCourseHashAtIndex(1);
  //   });

  //   // Testing when course hash does not exist
  //   it("should NOT repurchase when the course does not exist", async () => {
  //     const notExistingHash =
  //       "0x5ceb3ue6235bce64g35f32vcd2b36t7wu34wh54v2aw237673547";
  //     await catchRevert(
  //       _contract.repurchaseCourse(notExistingHash, { from: buyer })
  //     );
  //   });

  //   // Should not repurchase when not course owner
  //   it("Should not repurchase when not course owner", async () => {
  //     const notOwnerAddress = accounts[2];
  //     await catchRevert(
  //       _contract.repurchaseCourse(courseHash2, { from: notOwnerAddress })
  //     );
  //   });

  //   // Only original buy can repurchase the course
  //   it("Should be able to repurchase with original buyer", async () => {
  //     /**
  //      * Buyer Balance
  //      */
  //     // get balance of buyer before tx
  //     const beforeTxBuyerBalance = await web3.eth.getBalance(buyer);
  //     // get balance of buyer after tx
  //     const afterTxBuyerBalance = await web3.eth.getBalance(buyer);

  //     /**
  //      * Gas Price
  //      */
  //     const result = await _contract.repurchaseCourse(courseHash2, {
  //       from: buyer,
  //       value: value,
  //     });
  //     // get tx infos to get gasPrice
  //     const tx = await web3.eth.getTransaction(result.tx);
  //     // get value of tx total gas fee(!gasPrice)
  //     const gasUsed = web3.utils.toBN(result.receipt.gasUsed);
  //     // now gasPrice after getting tx
  //     const gasPrice = web3.utils.toBN(tx.gasPrice);
  //     const gas = gasUsed.mul(gasPrice);

  //     /**
  //      * Contract Balance
  //      */
  //     // get Contract balance before tx
  //     const beforeTxContractBalance = await web3.eth.getBalance(
  //       _contract.address
  //     );
  //     // get balance of contract after tx
  //     const afterTxContractBalance = await web3.eth.getBalance(
  //       _contract.address
  //     );

  //     const course = await _contract.getCourseByHash(courseHash2);
  //     const expectedState = 0;

  //     /**
  //      * assert
  //      */
  //     assert.equal(
  //       course.state,
  //       expectedState,
  //       "The course is NOT in purchase state"
  //     );

  //     assert.equal(
  //       course.price,
  //       value,
  //       `The course price is not equal to ${value}`
  //     );

  //     // calc deductions and make buyer balance correspond
  //     assert.equal(
  //       web3.utils
  //         .toBN(beforeTxBuyerBalance)
  //         .sub(web3.utils.toBN(value))
  //         .sub(gas)
  //         .toString(),
  //       afterTxBuyerBalance,
  //       "Buyer before and after bal is not the same"
  //     );

  //     // contract
  //     assert.equal(
  //       toBN(beforeTxContractBalance).add(toBN(value)).toString(),
  //       afterTxContractBalance,
  //       "Contract before and after bal is not the same"
  //     );
  //   });

  //   // should not be able to repurchase purchased course
  //   it("should not be able to repurchase purchased course", async () => {
  //     await catchRevert(
  //       _contract.repurchaseCourse(courseHash2, { from: buyer })
  //     );
  //   });
  // });

  //
  describe("Receive Funds", () => [
    it("should have transacted funds", async () => {
      const value = "100000000000000000";
      const contractBeforeTx = await getBalance(_contract.address);

      await web3.eth.sendTransaction({
        form: buyer,
        to: _contract.address,
        value,
      });

      const contractAfterTx = await web3.eth.getBalance(_contract.address);

      assert.equal(
        toBN(contractBeforeTx).add(toBN(value)).toString(),
        contractAfterTx,
        "Value after tx not matching"
      );
    }),
  ]);
});

// Run truffle test- to get output
//  the before- is initialization
//  the it - is executing the functions
//  the assert is the main test(comparison)

// get notes on cathRevert and exceptions from lesson 6

// assert.equal(expectedValue, actualValue, "Error Message")
