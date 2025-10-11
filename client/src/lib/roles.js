export function isAdmin(user) {
  return user?.role === "admin";
}

export function isTeacher(user) {
  return user?.role === "teacher";
}

export function isStaff(user) {
  return isAdmin(user) || isTeacher(user);
}
