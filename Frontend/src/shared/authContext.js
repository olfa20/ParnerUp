import React from "react";
import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  userType: null,
  active: null,
  login: () => {},
  logout: () => {},
});

/* export const AuthContext = AuthContext1; */
