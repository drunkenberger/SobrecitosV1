export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // In a real app, this should be hashed
  createdAt: string;
}

const USERS_KEY = "budget_users";
const CURRENT_USER_KEY = "budget_current_user";

export const getUsers = (): User[] => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
};

export const getCurrentUser = (): User | null => {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
  } catch {
    return null;
  }
};

export const registerUser = (
  email: string,
  password: string,
  name: string,
): User | null => {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    return null; // User already exists
  }

  const newUser = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    password, // In a real app, this should be hashed
    name,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return newUser;
};

export const loginUser = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }
  return null;
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};
