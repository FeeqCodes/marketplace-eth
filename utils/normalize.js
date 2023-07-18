

export const COURSE_STATES = {
  0: "purchased",
  1: "activated",
  2: "deactivated",
};

export const normalizeOwnedCourse = () => (course, ownedCourse) => {
  return {
    ...course,
    ownedCourseId: ownedCourse.id,
    proof: ownedCourse.proof,
    owned: ownedCourse.owner,
    price: ownedCourse.price,
    state: COURSE_STATES[ownedCourse.state],
  };
};
