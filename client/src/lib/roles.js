export function isAdmin(user) {
  return user?.role === "admin";
}

export function isTeacher(user) {
  return user?.role === "teacher";
}

export function isStaff(user) {
  // staff includes teachers and admins
  return isAdmin(user) || isTeacher(user);
}
