import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import { openCart } from "@/utlis/openCart";
import CartLength from "./components/CartLength";

import User from "./components/User";
import commanService, { domain } from "@/CommanService/commanService";
import { useDispatch, useSelector } from "react-redux";
import {
  addedDiamondData,
  addedRingData,
  diamondDIYimage,
  diamondImage,
  diamondNumber,
  diamondPageChnages,
  diamondShape,
  filterData,
  filteredData,
  finalCanBeSetData,
  isFilter,
  isLoginModal,
  isRegisterModal,
  isRingSelected,
  IsSelectedDiamond,
  jeweleryDIYimage,
  jeweleryDIYName,
  loginData,
  naviGationMenuData,
  storeActiveFilteredData,
  storeCurrencyData,
  storeDiamondNumber,
  storeEntityId,
  storeFilteredData,
  storeFilteredDiamondObj,
  storeHeaderFavLogo,
  storeHeaderLogo,
  storeItemObject,
  storeProdData,
  storeSelectedDiamondData,
  storeSelectedDiamondPrice,
  storeSpecData,
} from "@/Redux/action";
import { useContextElement } from "@/context/Context";
import FavCount from "./components/FavCount";
import { isEmpty } from "@/CommanFunctions/commanFunctions";
import Nav from "./components/Nav";
import Image from "next/image";

export default function Header1() {
  // const selector = useSelector((state) => state);
  const location = useLocation()
  const dispatch = useDispatch();
  const reduxLoginData = useSelector((state) => state.loginData);

  const loginDatas =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("loginData")) || reduxLoginData
      : reduxLoginData;

  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const storeCurrency = useSelector((state) => state.storeCurrency);
  const storeHeaderLog = useSelector((state) => state.storeHeaderLogo);
  const naviGationMenuDatas = useSelector((state) => state.naviGationMenuData);
  const isLogin = Object.keys(loginDatas).length > 0;
  const { getCartItems, getWishListFavourit } = useContextElement();
  const [scrollDirection, setScrollDirection] = useState("down");
  const [loader, setLoader] = useState(false);
  const [storeHeaderLogos, setStoreHeaderLogos] = useState(
    storeHeaderLog ?? []
  );
  const [navigationData, setNavigationData] = useState(
    naviGationMenuDatas ?? []
  );
  const [currencyCode, setCurrencyCode] = useState([]);

  var megaMenu = sessionStorage.getItem("megaMenus");

  const setHeaderLogo = useCallback((data) => {
    const filterLogo = data ? data.filter((h) => h.logo_type === "HEADER") : [];
    setStoreHeaderLogos(filterLogo);
    dispatch(storeHeaderLogo(filterLogo));
    const filterFavLogo = data
      ? data.filter((h) => h.logo_type === "FAVICON")
      : [];
    if (isEmpty(filterFavLogo) !== "" && filterFavLogo.length > 0) {
      var link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      if (filterFavLogo.length > 0) {
        link.href = filterFavLogo[0].image;
      }
    }
    dispatch(storeHeaderFavLogo(filterFavLogo));
  }, []);

  const headerSectionData = useCallback((data) => {
    setLoader(true);
    const obj = {
      a: "GetHomeNavigation",
      store_id: data.mini_program_id ?? storeEntityIds.mini_program_id,
      type: "B2C",
    };
    commanService
      .postLaravelApi("/NavigationMegamenu", obj)
      .then((res) => {
        if (res.data.success === 1) {
          const data = res.data.data;
          sessionStorage.setItem("megaMenus", JSON.stringify(data));
          var logo_data = data.logo_data;
          var navigation_data = data.navigation_data;
          var currency_data = data.currency_data;
          setHeaderLogo(logo_data);
          setNavigationData(navigation_data);
          setCurrencyCode(currency_data);
          dispatch(naviGationMenuData(navigation_data));

          if (currency_data && currency_data.length > 0) {
            const arr1 = currency_data;
            if (arr1.length > 0) {
              if (arr1.length > 1) {
                dispatch(storeCurrencyData(arr1));
              } else {
                dispatch(storeCurrencyData(arr1));
              }
            }
          }
          router.replace(`${pathname}${searchParams ? "?" + searchParams.toString() : ""}`);
          setLoader(false);
        } else {
          setLoader(false);
        }
      })
      .catch(() => { });
  }, []);

  const handleGetStoreData = useCallback(() => {
    setLoader(true);
    const getEntityId = {
      a: "GetStoreData",
      store_domain: domain,
      SITDeveloper: "1",
    };
    commanService
      .postApi("/EmbeddedPageMaster", getEntityId)
      .then((res) => {
        if (res.data.success === 1) {
          const data = res.data.data;
          sessionStorage.setItem("storeNavData", JSON.stringify(data));
          if (Object.keys(data)?.length > 0) {
            headerSectionData(data);
            // getCartItems();
            // getWishListFavourit();
            dispatch(storeEntityId(data));
            dispatch(storeCurrency(data.store_currency));
          }
        } else {
          setLoader(false);
        }
      })
      .catch(() => { });
  }, [domain, storeCurrency]);

  const homePageNavigation = () => {
    dispatch(isRegisterModal(false));
    dispatch(isLoginModal(false));
    dispatch(filteredData([]));
    dispatch(filterData([]));
    dispatch(isFilter(false));
    dispatch(storeItemObject({}));
    dispatch(storeFilteredDiamondObj({}));
    dispatch(storeActiveFilteredData({}));
    dispatch(storeFilteredData({}));
    dispatch(diamondPageChnages(false));
    dispatch(diamondNumber(""));
    dispatch(storeSelectedDiamondPrice(""));
    dispatch(finalCanBeSetData([]));
    dispatch(diamondDIYimage(""));
    dispatch(storeSpecData({}));
    dispatch(storeProdData({}));
    dispatch(storeSelectedDiamondData([]));
    dispatch(jeweleryDIYName(""));
    dispatch(jeweleryDIYimage(""));
    dispatch(storeDiamondNumber(""));
    dispatch(addedRingData({}));
    dispatch(IsSelectedDiamond(false));
    dispatch(isRingSelected(false));
    dispatch(addedDiamondData({}));
    dispatch(diamondImage(""));
    dispatch(diamondShape(""));
  };

  useEffect(() => {
    var storeData = JSON.parse(sessionStorage.getItem("storeNavData"));
    if (
      megaMenu !== null &&
      megaMenu !== undefined &&
      megaMenu !== false && (storeEntityIds.store_domain === domain)
    ) {
      setLoader(false);
    } else {
      // if(storeEntityIds.store_domain !== domain){
      //   sessionStorage.clear();
      //   localStorage.clear();
      //   dispatch(loginData({}));
      // }
      // homePageNavigation();
      handleGetStoreData();
      if (isLogin) {
        getCartItems();
        getWishListFavourit();
      }
    }
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 250) {
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down
          setScrollDirection("down");
        } else {
          // Scrolling up
          setScrollDirection("up");
        }
      } else {
        // Below 250px
        setScrollDirection("down");
      }

      lastScrollY.current = currentScrollY;
    };

    const lastScrollY = { current: window.scrollY };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup: remove event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // const handleRouteData = (e) => {
  //   dispatch({
  //     type: "CLEAR_ALL_STATE",
  //   });
  //   dispatch(isFilter(true));
  //   dispatch(filterData([]));
  //   dispatch(allFilteredData([]));
  //   dispatch(filteredData([]));
  //   dispatch(storeItemObject({}));
  //   dispatch(storeFilteredDiamondObj({}));
  //   dispatch(storeActiveFilteredData({}));
  //   dispatch(storeFilteredData({}));
  //   dispatch(diamondPageChnages(false));
  //   dispatch(diamondNumber(""));
  //   dispatch(storeSelectedDiamondPrice(""));
  //   dispatch(finalCanBeSetData([]));
  //   dispatch(diamondDIYimage(""));
  //   dispatch(storeSpecData({}));
  //   dispatch(storeProdData({}));
  //   dispatch(storeSelectedDiamondData([]));
  //   dispatch(jeweleryDIYName(""));
  //   dispatch(jeweleryDIYimage(""));
  //   dispatch(storeDiamondNumber(""));
  //   dispatch(addedRingData({}));
  //   dispatch(IsSelectedDiamond(false));
  //   dispatch(isRingSelected(false));
  //   dispatch(addedDiamondData({}));
  //   dispatch(diamondImage(""));
  //   dispatch(diamondShape(""));
  //   if (location.pathname.includes("/start-with-a-setting")) {
  //     dispatch(activeDIYtabs("Jewellery"));
  //     dispatch(storeItemObject({}));
  //   }
  //   if (location.pathname.includes("/start-with-a-diamond")) {
  //     dispatch(activeDIYtabs("Diamond"));
  //     dispatch(storeItemObject({}));
  //     dispatch(diamondPageChnages(false));
  //   }
  //   // e.preventDefault();
  // };

  return (
    <header
      id="header"
      className={`header header_sticky header_sticky-active`}
    >
      {/* {loader && <Loader />} */}
      <div className="container">
        <div className="header-desk header-desk_type_1">
          <div className="logo">
            {storeHeaderLogos && storeHeaderLogos.length > 0
              ? storeHeaderLogos.map((h, index) => (
                // <React.Fragment key={index}>
                <Link
                  to="/"
                  key={index}
                  onClick={() => homePageNavigation()}
                  className="logo__link"
                >
                  <Image
                    src={h.image}
                    alt="B2C Logo"
                    className="img-fluid logo__image logo_link_image d-block"
                    width={123}
                    height={50}
                  />
                </Link>
                // </React.Fragment>
              ))
              : ""}
          </div>
          {/* <!-- /.logo --> */}

          <nav className="navigation navigation-menu">
            <ul className="navigation__list list-unstyled d-flex">
              <Nav navigationDatas={navigationData} />
            </ul>
            {/* <!-- /.navigation__list --> */}
          </nav>
          {/* <!-- /.navigation --> */}

          <div className="header-tools d-flex align-items-center">
            {/* <SearchPopup /> */}

            {/* <!-- /.header-tools__item hover-container --> */}
            {!isLogin ? (
              <div className="hover-container">
                <a className="header-tools__item js-open-aside">
                  <User />
                </a>
              </div>
            ) : (
              <Link to="/account_dashboard" className="userLogin">
                <div className="hover-container">
                  <div className="header-tools__item js-open-aside">
                    <svg
                      className={`d-block ${window.location.pathname.includes("/account") &&
                        !window.location.pathname.includes("/account_wishlist")
                        ? "menu-active"
                        : ""
                        }`}
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <use href="#icon_user" />
                    </svg>
                    <span className="cart-amount d-block position-absolute js-cart-items-count">
                      <i className="ic_check"></i>
                    </span>
                  </div>
                </div>
              </Link>
            )}

            <Link className="hover-container" to="/account_wishlist">
              <div className="header-tools__item header-tools__cart js-open-aside">
                <svg
                  className={`d-block ${window.location.pathname.includes("/account_wishlist")
                    ? "menu-active"
                    : ""
                    }`}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_heart" />
                </svg>
                <span className="cart-amount d-block position-absolute js-cart-items-count">
                  <FavCount />
                </span>
              </div>
            </Link>
            <div className="hover-container">
              <a
                onClick={() => openCart()}
                className="header-tools__item header-tools__cart js-open-aside"
              >
                <svg
                  className={`d-block ${window.location.pathname.includes("/shop_cart")
                    ? "menu-active"
                    : ""
                    }`}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_cart" />
                </svg>
                <span className="cart-amount d-block position-absolute js-cart-items-count">
                  <CartLength />
                </span>
              </a>
            </div>

            {/* <a
              className="header-tools__item"
              href="#"
              data-bs-toggle="modal"
              data-bs-target="#siteMap"
            >
              <svg
                className="nav-icon"
                width="25"
                height="18"
                viewBox="0 0 25 18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href="#icon_nav" />
              </svg>
            </a> */}
          </div>
          {/* <!-- /.header__tools --> */}
        </div>
        {/* <!-- /.header-desk header-desk_type_1 --> */}
      </div>
      {/* <!-- /.container --> */}
    </header>
  );
}
