import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);
  const [userType,setUserType]=useState(false)
  const [active,setActive] = useState(true)
  const { currentuser } = JSON.parse(localStorage.getItem("userData")) || {}; // Récupérer l'utilisateur actuel
  const [currentUser, setCurrentUser] = useState(currentuser); // Mettre à jour l'état de l'utilisateur actuel
  
  const login = useCallback(
    (uid, token, userType,active) => {
      setToken(token);
      setUserId(uid);
      setUserType(userType);
      setActive(active)
      const tokenExpirationDate = new Date(
        new Date().getTime() + 1000 * 60 * 60
      );
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: uid,
          token: token,
          expiration: tokenExpirationDate.toISOString(),
          currentUser: { id: uid },
          userType:userType,
          active:active
          
        })
      );
      setCurrentUser({ id: uid });
     
    },

    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setUserType(null);
    setActive(null)
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      storedData.userType &&
      storedData.active &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token,storedData.userType,storedData.active);
    }
  }, [login]);

  return { token, login, logout, userId, currentUser ,userType,active};
};
