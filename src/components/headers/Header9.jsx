import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { openCart } from "../../utlis/openCart";
import CartLength from "./components/CartLength";
import User from "./components/User";
import commanService, { domain } from "../../CommanService/commanService";
import { useDispatch, useSelector } from "react-redux";
import {
  activeImageData,
  ActiveStepsDiy,
  addedDiamondData,
  addedRingData,
  caratVlaues,
  diamondDIYimage,
  diamondImage,
  diamondNumber,
  diamondPageChnages,
  diamondShape,
  DIYName,
  DiySteperData,
  engravingObj,
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
  previewImageDatas,
  saveEmbossings,
  showMoreValue,
  storeActiveFilteredData,
  storeCurrency,
  storeCurrencyData,
  storeDiamondNumber,
  storeEmbossingData,
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
  thresholdValue,
} from "../../Redux/action";
const FavCount = dynamic(() => import("./components/FavCount"), { ssr: false });
import {
  changeUrl,
  isEmpty,
  safeParse,
} from "../../CommanFunctions/commanFunctions";
import { useContextElement } from "../../context/Context";
import Image from "next/image";
import dynamic from "next/dynamic";
import createPersistedState from "use-persisted-state";
import Nav from "./components/Nav";
// const Nav = dynamic(() => import("./components/Nav"), { ssr: false });

const useNavMenuStateData = createPersistedState("navigationData");

export default function Header1({ storeData }) {
  //state declerations;
  const isCallRef = useRef(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const menuContainerRef = useRef(null);
  const logoRef = useRef(null);
  const rightIconsRef = useRef(null);
  const { getCartItems, getWishListFavourit } = useContextElement();
  const reduxLoginData = useSelector((state) => state.loginData);
  const loginDatas =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("loginData")) || reduxLoginData
      : reduxLoginData;

  const storeEntityIds = storeData;

  const reduxStoreCurrency = useSelector((state) => state.storeCurrency);
  const storeCurrencys =
    typeof window !== "undefined"
      ? sessionStorage.getItem("storeCurrency") || reduxStoreCurrency
      : reduxStoreCurrency;
  const reduxStoreNav = useSelector((state) => state.naviGationMenuData);
  const naviGationMenuDatas =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("navMenuData")) || reduxStoreNav
      : reduxStoreNav;

  const storeHeaderLog = useSelector((state) => state.storeHeaderLogo);
  const storeHeaderFavLogos = useSelector((state) => state.storeHeaderFavLogo);
  const showMoreValues = useSelector((state) => state.showMoreValue);
  const isLogin = loginDatas && Object.keys(loginDatas)?.length > 0;
  const [scrollDirection, setScrollDirection] = useState("down");
  const [loader, setLoader] = useState(false);
  const [storeHeaderLogos, setStoreHeaderLogos] = useState(
    storeHeaderLog ?? []
  );
  const [navigationData, setNavigationData] = useNavMenuStateData([]);
  const [showMore, setShowMore] = useState(showMoreValues ?? false);
  const [currencyCode, setCurrencyCode] = useState([]);

  var megaMenu =
    typeof window !== "undefined" && sessionStorage.getItem("megaMenus");

  //Header logo settings
  const setHeaderLogo = useCallback((data) => {
    const filterLogo = data
      ? data.filter((h) => h.logo_type === "HEADER")
      : JSON.parse(megaMenu)?.logo_data.filter((h) => h.logo_type === "HEADER");
    setStoreHeaderLogos(filterLogo);
    dispatch(storeHeaderLogo(filterLogo));
    const filterFavLogo = data
      ? data.filter((h) => h.logo_type === "FAVICON")
      : JSON.parse(megaMenu)?.logo_data.filter(
          (h) => h.logo_type === "FAVICON"
        );
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

  //URL convert with dash
  function getAlias(e, link, type, child) {
    const alias = changeUrl(e.menu_name);
    const verticalCode = e.product_vertical_name.toLowerCase();

    if (child) {
      const isDiy = child.detaills?.some((d) => d.logic_code === "DIY");
      if (isDiy) {
        return "/make-your-customization";
      } else {
        return link
          .toLowerCase()
          .replace(
            `/${verticalCode}`,
            `/${alias}/type/${changeUrl(child.childMenuName)}`
          );
      }
    }
    if (link.toLowerCase().includes(`/${verticalCode}`) && !type) {
      return link.toLowerCase().replace(`/${verticalCode}`, `/${alias}`);
    } else if (link.toLowerCase().includes("/diy")) {
      return link.toLowerCase().replace(`/diy`, `/make-your-customization`);
    } else {
      return `/${alias}`;
    }
  }

  //Menu navigation store
  const handleNavigationMenu = (navigation_data) => {
    for (let c = 0; c < navigation_data?.length; c++) {
      if (
        ["LGDIA", "DIAMO", "GEDIA", "LDIAM", "GEMST"].includes(
          navigation_data[c].product_vertical_name
        )
      ) {
        let sub_menu = navigation_data[c]["sub_menu"];

        for (let d = 0; d < sub_menu.length; d++) {
          let diy_jsons = safeParse(sub_menu[d]?.diy_json) || [];
          let detaills = [];

          for (let m = 0; m < diy_jsons.length; m++) {
            let item = diy_jsons[m];
            if (!item) continue;

            if (item.logic_code === "size_group") item.logic_code = "carat";
            if (item.logic_code === "master_gh_color")
              item.logic_code = "color";
            if (item.logic_code === "master_gh_shape")
              item.logic_code = "stone-type";

            item.titles = item.value.replaceAll(" ", "-");
            item.unique_id = navigation_data[c].unique_id || "";

            let baseAlias = getAlias(
              navigation_data[c],
              navigation_data[c].router_link
            );
            item.router_link = item.router_link?.includes("/start-with-a")
              ? `/make-your-customization${item.router_link}`
              : `${baseAlias}/${item.logic_code}/${item.titles.toLowerCase()}`;

            detaills.push({
              unique_id: item.unique_id,
              type: item.diy_type || "0",
              title: item.value,
              router_link: item.router_link,
              icon: item.icon || "",
              vertical_code: item.vertical || "",
              logic_code: item.router_link?.includes("/start-with-a")
                ? "DIY"
                : item.logic_code,
            });
          }

          sub_menu[d].detaills = detaills;
          sub_menu[d].childs = detaills.length
            ? [
                {
                  childMenuName: "",
                  childMenuStatus: "1",
                  childMenuSequence: sub_menu[d].sequence,
                  detaills: JSON.parse(JSON.stringify(detaills)),
                },
              ]
            : [];
        }

        navigation_data[c].sub_menus = JSON.parse(JSON.stringify(sub_menu));
      } else {
        const originalSubMenus = navigation_data[c]?.segmantion_data || [];
        let combinedSubMenu = null;

        const groupedByTitleArray = [];
        const titleIndexMap = new Map();

        originalSubMenus.forEach((subMenu) => {
          const {
            unique_id,
            product_vertical,
            sub_category,
            display_name,
            sequence,
            router_link,
            filter_json,
            vertical_code,
            item_group,
            ...rest
          } = subMenu;

          if (!combinedSubMenu) {
            combinedSubMenu = {
              unique_id,
              product_vertical,
              sub_category,
              display_name,
              sequence,
              ...rest,
            };
          }

          const detailsArray = filter_json ? safeParse(filter_json) : [];

          detailsArray
            .sort((a, b) => (a.subMenuSequence || 0) - (b.subMenuSequence || 0))
            .forEach((detail) => {
              if (detail.subMenuStatus === "1" || detail.subMenuStatus === "") {
                const subMenuName = detail.subMenuName;

                if (!titleIndexMap.has(subMenuName)) {
                  titleIndexMap.set(subMenuName, groupedByTitleArray.length);
                  groupedByTitleArray.push({
                    display_name: subMenuName,
                    product_vertical: vertical_code || product_vertical || "",
                    item_group: item_group || "",
                    childs: [],
                    detaills: [],
                  });
                }

                const groupIndex = titleIndexMap.get(subMenuName);

                if (!groupedByTitleArray[groupIndex]._childIndexMap) {
                  groupedByTitleArray[groupIndex]._childIndexMap = new Map();
                }
                const childIndexMap =
                  groupedByTitleArray[groupIndex]._childIndexMap;

                if (Array.isArray(detail.childs)) {
                  detail.childs
                    .sort(
                      (a, b) =>
                        (a.childMenuSequence || 0) - (b.childMenuSequence || 0)
                    )
                    .forEach((child) => {
                      const {
                        childMenuName = "",
                        childMenuSequence = "",
                        childMenuStatus = "",
                        seo_titles = "",
                        seo_description = "",
                        seo_keyword = "",
                        seo_permalink = "",
                      } = child;

                      let childObjIndex = childIndexMap.get(childMenuName);
                      let childObj;

                      if (childObjIndex === undefined) {
                        childObj = {
                          childMenuName,
                          childMenuSequence,
                          childMenuStatus,
                          seo_titles,
                          seo_description,
                          seo_keyword,
                          seo_permalink,
                          detaills: [],
                        };
                        childObj.router_link = "";
                        groupedByTitleArray[groupIndex].childs.push(childObj);
                        childIndexMap.set(
                          childMenuName,
                          groupedByTitleArray[groupIndex].childs.length - 1
                        );
                      } else {
                        childObj =
                          groupedByTitleArray[groupIndex].childs[childObjIndex];
                      }

                      if (Array.isArray(child.fields)) {
                        child.fields.forEach((field) => {
                          const selectedValues = Array.isArray(
                            field.child_menu_selected_value
                          )
                            ? field.child_menu_selected_value
                            : [];
                          selectedValues.forEach((sel) => {
                            const detaillObj = {
                              unique_id:
                                detail.unique_id ||
                                navigation_data[c]?.unique_id ||
                                "",
                              logic_code:
                                field.msf_key || field.logic_code || "",
                              logic_code_dimen:
                                field.msf_keys || field.logic_code || "",
                              code: sel.key || "",
                              type: field.msf_key === "DIY" ? "1" : "0",
                              vertical_code:
                                field.msf_key === "DIY"
                                  ? field.vertical || ""
                                  : navigation_data[c]?.product_vertical_name ||
                                    product_vertical ||
                                    "",
                              title: sel.value || field.msf_title || "",
                              icon: field.icon || "",
                              master_code: field.master_code || "",
                              titlesKey: field.titlesKey || "",
                              router_link:
                                field.msf_key === "DIY"
                                  ? getAlias(
                                      navigation_data[c],
                                      `/${field.msf_key.toLowerCase()}${
                                        sel.router_link || ""
                                      }`,
                                      "diy"
                                    )
                                  : field.msf_key.split("_").pop()
                                  ? getAlias(
                                      navigation_data[c],
                                      `${
                                        navigation_data[c].router_link
                                      }/${field.msf_key.split("_").pop()}/${(
                                        sel.value || ""
                                      )
                                        .replaceAll(" ", "-")
                                        .toLowerCase()}`
                                    )
                                  : getAlias(
                                      navigation_data[c],
                                      `${navigation_data[c].router_link}/${
                                        field.msf_key
                                      }/${(sel.value || "")
                                        .replaceAll(" ", "-")
                                        .toLowerCase()}`
                                    ),
                            };
                            childObj.router_link = detaillObj.router_link;
                            groupedByTitleArray[groupIndex].detaills.push(
                              detaillObj
                            );
                            childObj.detaills.push(detaillObj);
                          });
                        });
                      }
                    });
                }
              }
            });
        });
        groupedByTitleArray.forEach((g) => {
          delete g._childIndexMap;
        });
        navigation_data[c]["sub_menus"] = groupedByTitleArray;
      }
    }
    const n = 2;
    const result = [];

    for (let i = 0; i < navigation_data?.length; i++) {
      result.push(navigation_data[i]);
    }
    setNavigationData([...result]);
    sessionStorage.setItem("navMenuData", JSON.stringify([...result]));
    dispatch(naviGationMenuData([...result]));
  };

  //get Home Navigation
  const headerSectionData = useCallback((data) => {
    setLoader(true);
    const obj = {
      a: "GetHomeNavigation",
      SITDeveloper: "1",
      store_id: data.mini_program_id ?? storeEntityIds.mini_program_id,
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      origin: data.cmp_origin ?? storeEntityIds.cmp_origin,
      type: "B2C",
    };
    commanService
      .postApi("/StoreCart", obj)
      .then((res) => {
        if (res.data.success === 1) {
          const data = res.data.data;
          sessionStorage.setItem("megaMenus", JSON.stringify(data));
          var logo_data = data.logo_data;
          var navigation_data = data.navigation_data;
          var currency_data = data.currency_data;
          setHeaderLogo(logo_data);
          setCurrencyCode(currency_data);
          if (navigation_data?.length > 0) {
            handleNavigationMenu(navigation_data);
          }
          // setNavigationData(navigation_data);

          // dispatch(naviGationMenuData(navigation_data));
          dispatch(thresholdValue(null));
          dispatch(showMoreValue(false));
          if (currency_data && currency_data.length > 0) {
            const arr1 = currency_data;
            if (arr1.length > 0) {
              if (arr1.length > 1) {
                dispatch(storeCurrencyData(arr1));
                sessionStorage.setItem(
                  "storeCurrencyData",
                  JSON.stringify(arr1)
                );
              } else {
                dispatch(storeCurrencyData(arr1));
                sessionStorage.setItem(
                  "storeCurrencyData",
                  JSON.stringify(arr1)
                );
              }
            }
          }
          // router.push(`${pathname}${search ? `?${search}` : ""}`);
          setLoader(false);
        } else {
          setLoader(false);
        }
      })
      .catch(() => {});
  }, []);

  //Home page Navigation
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
    dispatch(storeEmbossingData([]));
    dispatch(saveEmbossings(false));
    dispatch(previewImageDatas([]));
    dispatch(activeImageData([]));
    dispatch(DiySteperData([]));
    dispatch(ActiveStepsDiy(0));
    dispatch(caratVlaues([]));
    dispatch(engravingObj({}));
    sessionStorage.removeItem("DIYVertical");
    sessionStorage.removeItem("productFilterState");
    dispatch(DIYName(""));
  };

  const lastScrollY = useRef(0);

  //API call and Scrolling function
  useEffect(() => {
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    if (storeHeaderFavLogos?.length > 0) {
      link.href = storeHeaderFavLogos[0].image;
    }
    if (
      megaMenu !== null &&
      megaMenu !== undefined &&
      megaMenu !== false &&
      storeEntityIds?.store_domain === domain
    ) {
      setNavigationData(navigationData);
      setLoader(false);
      setHeaderLogo();
    } else {
      if (storeEntityIds?.store_domain !== domain) {
        // sessionStorage.clear();
        // localStorage.clear();
        // dispatch(loginData({}));
        // dispatch(thresholdValue(null));
        // dispatch(showMoreValue(false))
      }
      // homePageNavigation();

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
  useEffect(() => {
    const data =
      typeof window !== "undefined" && JSON.parse(megaMenu)?.navigation_data;
    if (
      !isCallRef.current &&
      storeEntityIds &&
      Object.keys(storeEntityIds)?.length > 0 &&
      data === undefined
    ) {
      headerSectionData(storeEntityIds);
      isCallRef.current = true;
    } else {
      // setNavigationData(navigationData);
      // $(window).unload(function () {
      //   localStorage.removeItem("journeyList")
      //   localStorage.removeItem("sectionDataLists")
      //   localStorage.removeItem("sliderData")
      // });
      // handleNavigationMenu(data);
    }
  }, []);
  //Showmore menu navigation with state update for thresold value
  const handleSetShowMore = useCallback((value) => {
    setShowMore(value);
    dispatch(showMoreValue(value));
  }, []);

  return (
    <>
      <header
        id="header"
        className={`header header_sticky header-fullwidth header_sticky-active`}
      >
        <div className="container">
          <div className="header-desk header-desk_type_5 ">
            <div className="logo" ref={logoRef}>
              {storeHeaderLogos && storeHeaderLogos?.length > 0
                ? storeHeaderLogos?.map((h, index) => (
                    <Link
                      href="/"
                      key={index}
                      onClick={() => homePageNavigation()}
                      className="logo__link"
                      aria-label={h?.logo_type || "HomePage Logo"}
                    >
                      <picture>
                        <Image
                          src={h?.image}
                          width={128}
                          height={52}
                          alt={h?.logo_type || "HomePage Logo"}
                          className="logo__image d-block"
                          priority
                          loading="eager"
                          fetchPriority="high"
                        />
                      </picture>
                    </Link>
                  ))
                : ""}
            </div>
            {/* <!-- /.logo --> */}
            {/* <!-- /.header-search --> */}
            {/* <div className="header-right"> */}
            <nav className="navigation" ref={menuContainerRef}>
              <ul
                className="navigation__list list-unstyled d-flex"
                id="menuContainer"
              >
                <Nav
                  storeData={storeData}
                  logoRef={logoRef}
                  rightIconsRef={rightIconsRef}
                  getAlias={getAlias}
                  useNavMenuStateData={useNavMenuStateData}
                  navigationDatas={navigationData}
                  setShowMore={handleSetShowMore}
                  showMore={showMore}
                  menuContainerRef={menuContainerRef}
                />
              </ul>
              {/* <!-- /.navigation__list --> */}
            </nav>
            {/* <!-- /.navigation --> */}

            <div
              className="header-tools d-flex align-items-center"
              ref={rightIconsRef}
            >
              {/* <SearchPopup /> */}
              {/* <!-- /.header-tools__item hover-container --> */}

              {!isLogin ? (
                <div className="hover-container">
                  <div className="header-tools__item js-open-aside cursor-pointer">
                    <User />
                  </div>
                </div>
              ) : (
                <Link
                  href="/account_dashboard"
                  className="userLogin"
                  aria-label="Account Dashboard"
                >
                  <div className="hover-container">
                    <div className="header-tools__item js-open-aside">
                      <svg
                        className={`d-block ${
                          window.location.pathname.includes("/account") &&
                          !window.location.pathname.includes(
                            "/account_wishlist"
                          )
                            ? "menu-active"
                            : ""
                        }`}
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <use xlinkHref="#icon_user" />
                      </svg>
                      <span className="cart-amount d-block position-absolute js-cart-items-count">
                        <svg width="9" height="9">
                          <use href="#icon_check"></use>
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              <Link
                className="hover-container"
                href="/account_wishlist"
                aria-label="Account Wishlist"
              >
                <div className="header-tools__item header-tools__cart js-open-aside">
                  <svg
                    className={`d-block ${
                      pathname.includes("/account_wishlist")
                        ? "menu-active"
                        : ""
                    }`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <use xlinkHref="#icon_heart" />
                  </svg>
                  <span className="cart-amount d-block position-absolute js-cart-items-count">
                    <FavCount />
                  </span>
                </div>
              </Link>

              <div
                onClick={() => openCart()}
                className="header-tools__item header-tools__cart js-open-aside cursor-pointer"
              >
                <svg
                  className="d-block"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use xlinkHref="#icon_cart" />
                </svg>
                <span className="cart-amount d-block position-absolute js-cart-items-count">
                  <CartLength />
                </span>
              </div>
            </div>
            {/* </div> */}
            {/* <!-- /.header__tools --> */}
          </div>
        </div>
      </header>
    </>
  );
}
