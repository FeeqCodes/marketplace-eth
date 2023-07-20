// SPDX-License-Identifier: MIT

// pragma solidity >=0.4.22 <0.9.0;


// // creating the state variables
// contract CourseMarketplace {

//   receive() external payable{}


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

//   // mapping of courseHash to course data
//   mapping(bytes32 => Course) private ownedCourses;

//   // mapping of courseId to courseHash
//   mapping(uint => bytes32) private ownedCoursHash;
  
//   // number of all courses + id of the course
//   uint private totalOwnedCourses;

//   // administartor of the contract
//   address payable private owner;

//   constructor() {
//     setContractOwner(msg.sender);
//   }

//   /// Errors- Course already has a owner
//   error CourseHasOwner();

//   /// Only owner can transfer
//   error OnlyOwner();

//   // only owner should be able to transfer ownership
//   modifier onlyOwner() {
//     if(msg.sender != getContractOwner()) {
//       revert OnlyOwner();
//     }
//     _;
//   }

//   //  Purchase State
//   function purchaseCourse (bytes16 courseId, bytes32 proof ) external payable {  
//     //0x00000000000000000000000007835667
//     //0x0000000000000000000000000000000000000000000000000078356677835667
    

//     // contructs a course hash by joining both course id and address of sender
//     bytes32 courseHash = keccak256(abi.encodePacked(courseId, msg.sender));

    
//     if(hasCourseOwnership(courseHash)) {
//       revert CourseHasOwner();
//     }

//     uint id = totalOwnedCourses++;

//     ownedCoursHash[id] = courseHash;
    
//     ownedCourses[courseHash] = Course({
//       id: id,
//       price: msg.value,
//       proof: proof,
//       owner: msg.sender,
//       state: State.Purchased
//     });
  
//   }


//   // Transfer ownership from owner to buyer
//   function transferOwnership(address newOwner) external onlyOwner{
//     setContractOwner(newOwner);
//   }

//   // get number of purchased courses
//   function getCourseCount() external view returns(uint) {

//     return totalOwnedCourses;
//   }

//   // get the course hash at specific index
//   function getCourseHashAtIndex(uint index) external view returns (bytes32) {

//     return ownedCoursHash[index];
//   }

//   // get course index, details by the hash
//   function getCourseByHash(bytes32 courseHash) external view returns(Course memory) {

//     return ownedCourses[courseHash];
//   }


//   // Retrieve contract owner
//   function getContractOwner() public view returns(address) {
//     return owner;
//   }

//   function setContractOwner(address newOwner) private {

//     owner = payable(newOwner);
//   }

//   // checking for pre existing course hash inorder not to create same courseHash twice
//   function hasCourseOwnership(bytes32 courseHash) private view returns(bool){

//     return ownedCourses[courseHash].owner == msg.sender;
//   }
// }

















pragma solidity >=0.4.22 <0.9.0;

contract CourseMarketplace {

  enum State {
    Purchased,
    Activated,
    Deactivated
  }

  struct Course {
    uint256 id; // 32
    uint256 price; // 32
    bytes32 proof; // 32
    address owner; // 20
    State state; // 1
  }

  // mapping of courseHash to Course data
  mapping(bytes32 => Course) private ownedCourses;

  // mapping of courseID to courseHash
  mapping(uint256 => bytes32) private ownedCourseHash;

  // number of all courses + id of the course
  uint256 private totalOwnedCourses;

  address payable private owner;

  constructor() {
    setContractOwner(msg.sender);
  }

  /// Course has already a Owner!
  error CourseHasOwner();

  /// Only owner has an access!
  error OnlyOwner();

  modifier onlyOwner() {
    if (msg.sender != getContractOwner()) {
      revert OnlyOwner();
    }
    _;
  }

  function purchaseCourse(bytes16 hexCourseId, bytes32 proof) external payable {

    bytes32 courseHash = keccak256(abi.encodePacked(hexCourseId, msg.sender));

    if (hasCourseOwnership(courseHash)) {
      revert CourseHasOwner();
    }

    uint256 id = totalOwnedCourses++;

    ownedCourseHash[id] = courseHash;
    
    ownedCourses[courseHash] = Course({
      id: id,
      price: msg.value,
      proof: proof,
      owner: msg.sender,
      state: State.Purchased
    });                             

    // uint id = totalOwnedCourses++;

    // ownedCoursHash[id] = courseHash;
    // ownedCourses[courseHash] = Course({
    //   id: id,
    //   price: msg.value,
    //   proof: proof,
    //   owner: msg.sender,
    //   state: State.Purchased
    // });
  }

  function transferOwnership(address newOwner)
    external
    onlyOwner
  {
    setContractOwner(newOwner);
  }

  function getCourseCount()
    external
    view
    returns (uint256)
  {
    return totalOwnedCourses;
  }

  function getCourseHashAtIndex(uint256 index)
    external
    view
    returns (bytes32)
  {
    return ownedCourseHash[index];
  }

  function getCourseByHash(bytes32 courseHash)
    external
    view
    returns (Course memory)
  {
    return ownedCourses[courseHash];
  }

  function getContractOwner()
    public
    view
    returns (address)
  {
    return owner;
  }

  function setContractOwner(address newOwner) private {
    owner = payable(newOwner);
  }

  function hasCourseOwnership(bytes32 courseHash)
    private
    view
    returns (bool)
  {
    return ownedCourses[courseHash].owner == msg.sender;
  }
}