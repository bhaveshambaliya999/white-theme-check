"use client";

import { useEffect, useLayoutEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "@/CommanFunctions/commanFunctions";
import { cartCount, favCount, loginData } from "@/Redux/action";
import { useRouter } from "next/router";

export function Auth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const loginDataRedux = useSelector((state)=>state.loginData)
    const dispatch = useDispatch();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checking, setChecking] = useState(true);

    const checkAuthentication = useMemo(() => {
      return () => {
        // if (typeof window === "undefined") return;

        try {
          const loginDatas = JSON.parse(sessionStorage.getItem("loginData")) || loginDataRedux;

          if (!loginDatas || Object.keys(loginDatas)?.length === 0) {
            dispatch(loginData({}));
            dispatch(cartCount("0"));
            dispatch(favCount("0"));
            sessionStorage.removeItem("loginData");
            router.replace("/", undefined, { shallow: true });
            return;
          }

          const parsedData = loginDatas;
          dispatch(loginData(parsedData));
          sessionStorage.setItem("loginData", JSON.stringify(loginDatas))
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error checking authentication:", error);
          router.replace("/", undefined, { shallow: true });
        } finally {
          setChecking(false);
        }
      };
    }, [dispatch, router]);

    useLayoutEffect(() => {
      checkAuthentication();
    }, [checkAuthentication]);

    if (checking) return null;

    if (!isAuthenticated) return null;

    return <Component {...props} />;
  };
}
