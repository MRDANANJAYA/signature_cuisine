import React, { createContext, useState, useMemo, useEffect } from "react";

export const LoginContext = createContext(null);

export const LoginProvider = ({ children }) => {
  const [isLogin, setLogin] = useState(null);

  const values = useMemo(
    () => ({
      isLogin,
      setLogin,
    }),
    [isLogin]
  );

  return (
    <LoginContext.Provider value={values}>{children}</LoginContext.Provider>
  );
};
