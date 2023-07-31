// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;


/**
  CONTRACT
 */
contract CourseMarketplace {


  enum State {
    Purchased,
    Activated,
    Deactivated
  }

  struct Course {
    uint id; // 32
    uint price; // 32
    bytes32 proof; // 32
    address owner; // 20
    State state; // 1
  }


  /**
    INNITIALIZATIONS OF STATE VARIABLES
   */

  /**
    in the eventualities of hacks, pause execution of contract so that only owner/admin can hve access
  */
  bool public isStopped = false;

  // mapping of courseHash to course data
  mapping(bytes32 => Course) private ownedCourses;

  // mapping of courseId to courseHash
  mapping(uint => bytes32) private ownedCoursHash;
  
  // number of all courses + id of the course
  uint private totalOwnedCourses;

  // administartor of the contract
  address payable private owner;

  constructor() {
    setContractOwner(msg.sender);
  }



  /**
    ERRORS!!!!
  */
  ///Course has invalid state
  error InvalidState();

  ///Course has not been created
  error CourseIsNotCreated();

  /// Errors- Course already has a owner
  error CourseHasOwner();

  /// Errors- sender Is Not a Course Owner
  error SenderIsNotCourseOwner();

  /// Only owner can transfer
  error OnlyOwner();



  /**
    MODIFIERS
  */
  // only owner should be able to transfer ownership
  modifier onlyOwner() {
    if(msg.sender != getContractOwner()) {
      revert OnlyOwner();
    }
    _;
  }

  // Allow execution  of function only when  isStopped = false
  modifier onlyWhenNotStopped() {
    require(!isStopped);
    _;
  }

  // Block execution  of function only when  isStopped = true
  modifier onlyWhenStopped() {
    require(isStopped);
    _;
  }





  /**
    CONTRACT UTILITY FUNCTIONS
  */
  // allow contract to make transactions
  receive() external payable{}


  // option to withdraw ether
   function withdraw(uint amount)
    external
    onlyOwner
  {
    (bool success, ) = owner.call{value: amount}("");
    require(success, "Transfer failed.");
  }

  // emergency withdrawal- withdraw whole bal at once
  function emergencyWithdraw()
    external
    onlyWhenStopped
    onlyOwner
  {
    (bool success, ) = owner.call{value: address(this).balance}("");
    require(success, "Transfer failed.");
  }


  // Destroy the Msart contract
  // function selfDestruct() external onlyWhenStopped onlyOwner {

  //   selfdestruct(owner);
  // }


  // Funtion to stop contract Execution
  function stopContract() external onlyOwner {
    isStopped = true;
  }

  // Funtion to resume contract Execution
  function resumeContract() external onlyOwner {
    isStopped = false;
  }




 /**
  CONTRACT FUNCTIONS
  */

  //  Purchase State
  function purchaseCourse (bytes16 courseId, bytes32 proof ) external payable onlyWhenNotStopped {  
    //0x00000000000000000000000007835667
    //0x0000000000000000000000000000000000000000000000000078356677835667
    

    // contructs a course hash by joining both course id and address of sender
    bytes32 courseHash = keccak256(abi.encodePacked(courseId, msg.sender));

    
    if(hasCourseOwnership(courseHash)) {
      revert CourseHasOwner();
    }

    uint id = totalOwnedCourses++;

    ownedCoursHash[id] = courseHash;
    
    ownedCourses[courseHash] = Course({
      id: id,
      price: msg.value,
      proof: proof,
      owner: msg.sender,
      state: State.Purchased
    });
  
  }


  //  repurchase functionality
  // function repurchaseCourse(bytes32 courseHash) external payable onlyWhenNotStopped {

  //   if(!isCourseCreated(courseHash)) {

  //     revert CourseIsNotCreated();
  //   }

  //   if (!hasCourseOwnership(courseHash)) {
  //     revert SenderIsNotCourseOwner();
  //   }

  //   // get course from Course storage
  //   Course storage course = ownedCourses[courseHash];

  //   if (course.state != State.Deactivated) {
  //     revert InvalidState();
  //   }

  //   course.state = State.Purchased;
  //   course.price = msg.value;
  // }


  // Admin access to activate course
  function activateCourse(bytes32 courseHash) external onlyWhenNotStopped onlyOwner {

    if(!isCourseCreated(courseHash)) {
      
      revert CourseIsNotCreated();
    }

    Course storage course = ownedCourses[courseHash];

    if (course.state != State.Purchased) {
      
      revert InvalidState();
    }


    course.state = State.Activated;
  }



  // Admin access to deactivate course
  function deactivateCourse(bytes32 courseHash) external onlyWhenNotStopped onlyOwner {

    if(!isCourseCreated(courseHash)) {

      revert CourseIsNotCreated();
    }

    Course storage course = ownedCourses[courseHash];

    if (course.state != State.Purchased) {
      
      revert InvalidState();
    }

    // we return the buyers money if we deactivate his purchased course
    (bool success, ) = course.owner.call{value: course.price}("");
    require(success, "Transfer failed");


    course.state = State.Deactivated;
    course.price = 0;
  }


  // Transfer ownership from owner to buyer
  function transferOwnership(address newOwner) external onlyOwner{
    setContractOwner(newOwner);
  }

  // get number of purchased courses
  function getCourseCount() external view returns(uint) {

    return totalOwnedCourses;
  }

  // get the course hash at specific index
  function getCourseHashAtIndex(uint index) external view returns (bytes32) {

    return ownedCoursHash[index];
  }

  // get course index, details by the hash
  function getCourseByHash(bytes32 courseHash) external view returns(Course memory) {

    return ownedCourses[courseHash];
  }
  

  // Retrieve contract owner
  function getContractOwner() public view returns(address) {
    return owner;
  }

  function setContractOwner(address newOwner) private {

    owner = payable(newOwner);
  }

  // chcek if course exist
  function isCourseCreated(bytes32 courseHash) private view returns(bool){

    return ownedCourses[courseHash].owner != 0x0000000000000000000000000000000000000000;
  }

  // checking for pre existing course hash inorder not to create same courseHash twice
  function hasCourseOwnership(bytes32 courseHash) private view returns(bool){

    return ownedCourses[courseHash].owner == msg.sender;
  }
}

















// pragma solidity >=0.4.22 <0.9.0;

// contract CourseMarketplace {

//   enum State {
//     Purchased,
//     Activated,
//     Deactivated
//   }

//   struct Course {
//     uint256 id; // 32
//     uint256 price; // 32
//     bytes32 proof; // 32
//     address owner; // 20
//     State state; // 1
//   }

//   // mapping of courseHash to Course data
//   mapping(bytes32 => Course) private ownedCourses;

//   // mapping of courseID to courseHash
//   mapping(uint256 => bytes32) private ownedCourseHash;

//   // number of all courses + id of the course
//   uint256 private totalOwnedCourses;

//   address payable private owner;

//   constructor() {
//     setContractOwner(msg.sender);
//   }

//   /// Course has already a Owner!
//   error CourseHasOwner();

//   /// Only owner has an access!
//   error OnlyOwner();

//   modifier onlyOwner() {
//     if (msg.sender != getContractOwner()) {
//       revert OnlyOwner();
//     }
//     _;
//   }

//   function purchaseCourse(bytes16 hexCourseId, bytes32 proof) external payable {

//     bytes32 courseHash = keccak256(abi.encodePacked(hexCourseId, msg.sender));

//     if (hasCourseOwnership(courseHash)) {
//       revert CourseHasOwner();
//     }

//     uint256 id = totalOwnedCourses++;

//     ownedCourseHash[id] = courseHash;
    
//     ownedCourses[courseHash] = Course({
//       id: id,
//       price: msg.value,
//       proof: proof,
//       owner: msg.sender,
//       state: State.Purchased
//     });                             

//     // uint id = totalOwnedCourses++;

//     // ownedCoursHash[id] = courseHash;
//     // ownedCourses[courseHash] = Course({
//     //   id: id,
//     //   price: msg.value,
//     //   proof: proof,
//     //   owner: msg.sender,
//     //   state: State.Purchased
//     // });
//   }

//   function transferOwnership(address newOwner)
//     external
//     onlyOwner
//   {
//     setContractOwner(newOwner);
//   }

//   function getCourseCount()
//     external
//     view
//     returns (uint256)
//   {
//     return totalOwnedCourses;
//   }

//   function getCourseHashAtIndex(uint256 index)
//     external
//     view
//     returns (bytes32)
//   {
//     return ownedCourseHash[index];
//   }

//   function getCourseByHash(bytes32 courseHash)
//     external
//     view
//     returns (Course memory)
//   {
//     return ownedCourses[courseHash];
//   }

//   function getContractOwner()
//     public
//     view
//     returns (address)
//   {
//     return owner;
//   }

//   function setContractOwner(address newOwner) private {
//     owner = payable(newOwner);
//   }

//   function hasCourseOwnership(bytes32 courseHash)
//     private
//     view
//     returns (bool)
//   {
//     return ownedCourses[courseHash].owner == msg.sender;
//   }
// }

















// pragma solidity >=0.4.22 <0.9.0;

// contract CourseMarketplace {

//   enum State {
//     Purchased,
//     Activated,
//     Deactivated
//   }

//   struct Course {
//     uint id; // 32
//     uint price; // 32
//     bytes32 proof; // 32
//     address owner; // 20
//     State state; // 1
//   }

//   bool public isStopped = false;

//   // mapping of courseHash to Course data
//   mapping(bytes32 => Course) private ownedCourses;

//   // mapping of courseID to courseHash
//   mapping(uint => bytes32) private ownedCourseHash;

//   // number of all courses + id of the course
//   uint private totalOwnedCourses;

//   address payable private owner;

//   constructor() {
//     setContractOwner(msg.sender);
//   }

//   /// Course has invalid state!
//   error InvalidState();

//   /// Course is not created!
//   error CourseIsNotCreated();

//   /// Course has already a Owner!
//   error CourseHasOwner();

//   /// Sender is not course owner!
//   error SenderIsNotCourseOwner();

//   /// Only owner has an access!
//   error OnlyOwner();

//   modifier onlyOwner() {
//     if (msg.sender != getContractOwner()) {
//       revert OnlyOwner();
//     }
//     _;
//   }

//   modifier onlyWhenNotStopped {
//     require(!isStopped);
//     _;
//   }

//   modifier onlyWhenStopped {
//     require(isStopped);
//     _;
//   }

//   receive() external payable {}

//   function withdraw(uint amount)
//     external
//     onlyOwner
//   {
//     (bool success, ) = owner.call{value: amount}("");
//     require(success, "Transfer failed.");
//   }

//   function emergencyWithdraw()
//     external
//     onlyWhenStopped
//     onlyOwner
//   {
//     (bool success, ) = owner.call{value: address(this).balance}("");
//     require(success, "Transfer failed.");
//   }

//   function selfDestruct()
//     external
//     onlyWhenStopped
//     onlyOwner
//   {
//     selfdestruct(owner);
//   }

//   function stopContract()
//     external
//     onlyOwner
//   {
//     isStopped = true;
//   }

//   function resumeContract()
//     external
//     onlyOwner
//   {
//     isStopped = false;
//   }

//   function purchaseCourse(
//     bytes16 courseId, // 0x00000000000000000000000000003130
//     bytes32 proof // 0x0000000000000000000000000000313000000000000000000000000000003130
//   )
//     external
//     payable
//     onlyWhenNotStopped
//   {
//     bytes32 courseHash = keccak256(abi.encodePacked(courseId, msg.sender));

//     if (hasCourseOwnership(courseHash)) {
//       revert CourseHasOwner();
//     }

//     uint id = totalOwnedCourses++;

//     ownedCourseHash[id] = courseHash;
//     ownedCourses[courseHash] = Course({
//       id: id,
//       price: msg.value,
//       proof: proof,
//       owner: msg.sender,
//       state: State.Purchased
//     });
//   }

//   function repurchaseCourse(bytes32 courseHash)
//     external
//     payable
//     onlyWhenNotStopped
//   {
//     if (!isCourseCreated(courseHash)) {
//       revert CourseIsNotCreated();
//     }

//     if (!hasCourseOwnership(courseHash)) {
//       revert SenderIsNotCourseOwner();
//     }

//     Course storage course = ownedCourses[courseHash];

//     if (course.state != State.Deactivated) {
//       revert InvalidState();
//     }

//     course.state = State.Purchased;
//     course.price = msg.value;
//   }

//   function activateCourse(bytes32 courseHash)
//     external
//     onlyWhenNotStopped
//     onlyOwner
//   {
//     if (!isCourseCreated(courseHash)) {
//       revert CourseIsNotCreated();
//     }

//     Course storage course = ownedCourses[courseHash];

//     if (course.state != State.Purchased) {
//       revert InvalidState();
//     }

//     course.state = State.Activated;
//   }

//   function deactivateCourse(bytes32 courseHash)
//     external
//     onlyWhenNotStopped
//     onlyOwner
//   {
//     if (!isCourseCreated(courseHash)) {
//       revert CourseIsNotCreated();
//     }

//     Course storage course = ownedCourses[courseHash];

//     if (course.state != State.Purchased) {
//       revert InvalidState();
//     }

//     (bool success, ) = course.owner.call{value: course.price}("");
//     require(success, "Transfer failed!");

//     course.state = State.Deactivated;
//     course.price = 0;
//   }

//   function transferOwnership(address newOwner)
//     external
//     onlyOwner
//   {
//     setContractOwner(newOwner);
//   }

//   function getCourseCount()
//     external
//     view
//     returns (uint)
//   {
//     return totalOwnedCourses;
//   }

//   function getCourseHashAtIndex(uint index)
//     external
//     view
//     returns (bytes32)
//   {
//     return ownedCourseHash[index];
//   }

//   function getCourseByHash(bytes32 courseHash)
//     external
//     view
//     returns (Course memory)
//   {
//     return ownedCourses[courseHash];
//   }

//   function getContractOwner()
//     public
//     view
//     returns (address)
//   {
//     return owner;
//   }

//   function setContractOwner(address newOwner) private {
//     owner = payable(newOwner);
//   }

//   function isCourseCreated(bytes32 courseHash)
//     private
//     view
//     returns (bool)
//   {
//     return ownedCourses[courseHash].owner != 0x0000000000000000000000000000000000000000;
//   }

//   function hasCourseOwnership(bytes32 courseHash)
//     private
//     view
//     returns (bool)
//   {
//     return ownedCourses[courseHash].owner == msg.sender;
//   }
// }