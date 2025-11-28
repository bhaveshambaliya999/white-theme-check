import React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  activChildMenu,
  activeDIYtabs,
  activeIdMenu,
  activeImageData,
  ActiveStepsDiy,
  addedDiamondData,
  addedRingData,
  allFilteredData,
  caratVlaues,
  diamondDIYimage,
  diamondImage,
  diamondNumber,
  diamondPageChnages,
  diamondSelectShape,
  diamondShape,
  dimaondColorType,
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
  overflowItemsData,
  previewImageDatas,
  saveEmbossings,
  serviceAllData,
  showMoreValue,
  storeActiveFilteredData,
  storeDiamondArrayImage,
  storeDiamondNumber,
  storeEmbossingData,
  storeFilteredData,
  storeFilteredDiamondObj,
  storeItemObject,
  storeProdData,
  storeSelectedDiamondData,
  storeSelectedDiamondPrice,
  storeSpecData,
  thresholdValue,
} from "../../../Redux/action";
import { useDispatch, useSelector } from "react-redux";
import {
  changeUrl,
  isEmpty,
  jewelVertical,
} from "../../../CommanFunctions/commanFunctions";
import commanService, { domain } from "../../../CommanService/commanService";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Nav(props) {
  const {
    navigationDatas,
    showMore,
    setShowMore,
    menuContainerRef,
    getAlias,
    useNavMenuStateData,
    rightIconsRef,
    logoRef,
  } = props;
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const initialThreshold = useSelector((state) => state.thresholdValue);
  const storeEntityIds =
    props.storeData || useSelector((state) => state.storeEntityId);
  const showMoreValues = useSelector((state) => state.showMoreValue);
  const activeIdMenus = useSelector((state) => state.activeIdMenu);
  const activChildMenus = useSelector((state) => state.activChildMenu);
  const activeVerticalCode =
    typeof window !== "undefined" && sessionStorage.getItem("DIYVertical");
  // const [navigationDatas, setNavigationDatas] = useNavMenuStateData([]);
  const [threshold, setThreshold] = useState(initialThreshold ?? null);
  const [hasMeasuredInitial, setHasMeasuredInitial] = useState(false);
  const [activeId, setActiveId] = useState(activeIdMenus ?? "");
  const [activChild, setActiveChild] = useState(activChildMenus ?? "");
  // console.log(activChild, "5555");
  const itemRefs = useRef([]);

  //Object for api call require
  const obj = {
    SITDeveloper: "1",
    a: "SetupDiyVertical",
    store_id: storeEntityIds.mini_program_id,
    tenant_id: storeEntityIds.tenant_id,
    entity_id: storeEntityIds.entity_id,
    origin: domain,
    unique_id: "",
  };

  const measureItemsPerLine = useCallback(() => {
    if (!menuContainerRef.current || navigationDatas?.length === 0) return;

    const menuContainer = menuContainerRef.current;

    // Full header width
    const headerWidth = menuContainer.offsetWidth;

    // Dynamically measure left logo + right icons
    const logoWidth = logoRef.current?.offsetWidth || 0;
    const rightIconsWidth = rightIconsRef.current?.offsetWidth || 0;

    // Final usable width for menu items
    const containerWidth = window.innerWidth;

    let currentLineWidth = 0;
    let itemsOnCurrentLine = 0;
    let localThreshold = null;

    for (let index = 0; index < navigationDatas?.length; index++) {
      const itemRef = itemRefs.current[index];
      if (itemRef && itemRef.offsetWidth) {
        const itemWidth = Math.ceil(itemRef.offsetWidth);
        const itemMarginRight =
          Math.ceil(parseFloat(window.getComputedStyle(itemRef).marginRight)) ||
          0;
        const totalItemWidth = itemWidth + itemMarginRight * 4;

        currentLineWidth += totalItemWidth;
        itemsOnCurrentLine++;
        if (
          currentLineWidth + logoWidth + rightIconsWidth + 380 >=
          containerWidth
        ) {
          localThreshold = itemsOnCurrentLine;
          break;
        }
      }
    }

    if (localThreshold !== threshold) {
      setThreshold(localThreshold);
      dispatch(thresholdValue(localThreshold));
    }

    const shouldShowMore =
      localThreshold !== null &&
      navigationDatas?.slice(localThreshold)?.length > 0;

    if (shouldShowMore !== showMore) {
      setShowMore(shouldShowMore);
      dispatch(showMoreValue(shouldShowMore));
    }
  }, [navigationDatas, dispatch]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let timeoutId;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        measureItemsPerLine();
      }, 100);
    };

    measureItemsPerLine();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [measureItemsPerLine, navigationDatas]);

  // useEffect(() => {
  //   let timeoutId;

  //   const measure = () => {
  //     const menuContainer = menuContainerRef.current;
  //     if (navigationDatas?.length > 0 && menuContainer) {
  //       measureItemsPerLine();
  //       if (
  //         threshold !== null &&
  //         navigationDatas?.slice(threshold)?.length > 0
  //       ) {
  //         setShowMore(true);
  //         dispatch(showMoreValue(true));
  //         dispatch(thresholdValue(threshold));
  //       }
  //     }
  //   };

  //   const handleResize = () => {
  //     clearTimeout(timeoutId);
  //     timeoutId = setTimeout(measure, 100);
  //   };

  //   // Initial measure

  //   measure();

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //     clearTimeout(timeoutId);
  //   };
  // }, [
  //   measureItemsPerLine,
  //   navigationDatas,
  //   threshold,
  //   dispatch,
  //   setShowMore,
  //   menuContainerRef,
  // ]);

  //Active Sub menu
  const isMenuActive = (menu, item = {}, sub = {}, parent = {}) => {
    const lowerPath = pathname?.toLowerCase() || "";
    const menuSlug = changeUrl(menu)?.toLowerCase();

    const linksToCheck = [
      item?.router_link,
      sub?.display_name,
      parent?.unique_id,
    ]
      .filter(Boolean)
      .map((link) => changeUrl(link)?.toLowerCase());

    for (const link of linksToCheck) {
      if (
        lowerPath.includes(link) &&
        activeIdMenus === item?.unique_id &&
        activeVerticalCode ===
          (item?.vertical_code ?? item?.product_vertical_name)
      ) {
        return true;
      }
    }

    return false;
  };

  //Active Parent Menu
  const isActiveParentMenu = (menus, item = {}) => {
    const lowerPath = pathname?.toLowerCase() || "";
    if (
      (menus && menus === pathname && activeIdMenus === item.unique_id) ||
      (pathname.includes(menus) && activeIdMenus === item.unique_id)
    ) {
      return true;
    }
    if (
      pathname.includes(`/${changeUrl(menus)}`) &&
      pathname.includes(`/type/${changeUrl(activChild)}`) &&
      activeIdMenus === item.unique_id
    ) {
      return true;
    }
    if (
      item?.product_vertical_name === "DIY" &&
      lowerPath.includes("start-with-a") &&
      activeIdMenus === item.unique_id
    ) {
      return true;
    }
    if (Array.isArray(item?.sub_menus) && activeIdMenus === item.unique_id) {
      for (const subMenu of item.sub_menus) {
        if (Array.isArray(subMenu?.detaills)) {
          for (const petaMenu of subMenu.detaills) {
            if (
              petaMenu?.router_link &&
              lowerPath.toLowerCase()?.includes(petaMenu.router_link) &&
              activeIdMenus === petaMenu?.unique_id
            ) {
              return true;
            }
          }
        }
        if (
          subMenu?.router_link &&
          lowerPath.toLowerCase()?.includes(subMenu.router_link) &&
          activeIdMenus === item?.unique_id
        ) {
          return true;
        }
      }
    }

    return false;
  };

  useEffect(() => {
    function setBoxMenuPosition(menu) {
      const scrollBarWidth = 17;
      const limitR = window.innerWidth - menu.offsetWidth - scrollBarWidth;
      const limitL = 0;
      const menuPaddingLeft = parseInt(
        window.getComputedStyle(menu, null).getPropertyValue("padding-left")
      );
      const parentPaddingLeft = parseInt(
        window
          .getComputedStyle(menu.previousElementSibling, null)
          .getPropertyValue("padding-left")
      );
      const centerPos =
        menu.previousElementSibling.offsetLeft -
        menuPaddingLeft +
        parentPaddingLeft;

      let menuPos = centerPos;
      if (centerPos < limitL) {
        menuPos = limitL;
      } else if (centerPos > limitR) {
        menuPos = limitR;
      }

      menu.style.left = `${menuPos}px`;
    }
    document.querySelectorAll(".box-menu").forEach((el) => {
      setBoxMenuPosition(el);
    });
  }, []);

  //menu click event
  const homePageNavigation = () => {
    dispatch(activeDIYtabs("Jewellery"));
    dispatch(isRegisterModal(false));
    dispatch(filteredData([]));
    dispatch(filterData([]));
    dispatch(isLoginModal(false));
    dispatch(isFilter(false));
    dispatch(storeItemObject({}));
    dispatch(storeFilteredDiamondObj({}));
    dispatch(storeActiveFilteredData({}));
    dispatch(storeFilteredData({}));
    dispatch(diamondPageChnages(false));
    dispatch(diamondNumber(""));
    dispatch(storeSelectedDiamondPrice(""));
    dispatch(jeweleryDIYimage(""));
    dispatch(diamondDIYimage(""));
    dispatch(finalCanBeSetData([]));
    dispatch(caratVlaues([]));
    // dispatch(activeDIYtabs("Jewellery"));
    dispatch(storeSpecData({}));
    dispatch(storeProdData({}));
    dispatch(storeSelectedDiamondData([]));
    dispatch(jeweleryDIYName(""));
    dispatch(jeweleryDIYimage(""));
    dispatch(diamondDIYimage(""));
    dispatch(storeDiamondNumber(""));
    dispatch(addedRingData({}));
    dispatch(IsSelectedDiamond(false));
    dispatch(isRingSelected(false));
    dispatch(addedDiamondData({}));
    dispatch(storeDiamondArrayImage({}));
    dispatch(diamondImage(""));
    dispatch(diamondShape(""));
    dispatch(diamondSelectShape({}));
    dispatch(storeEmbossingData([]));
    dispatch(saveEmbossings(false));
    dispatch(previewImageDatas([]));
    dispatch(activeImageData([]));
    dispatch(DiySteperData([]));
    dispatch(ActiveStepsDiy(0));
    dispatch(engravingObj({}));
    dispatch(serviceAllData([]));
    sessionStorage.removeItem("routerPath");
    sessionStorage.removeItem("DIYVertical");
    sessionStorage.removeItem("itemToItemData");
    sessionStorage.removeItem("productFilterState");
    dispatch(DIYName(""));
    dispatch(dimaondColorType("White"));
  };

  //Submenu click event
  const handleRouteData = (e) => {
    dispatch(isRegisterModal(false));
    dispatch(filteredData([]));
    dispatch(filterData([]));
    dispatch(isLoginModal(false));
    dispatch(isFilter(false));
    dispatch(storeItemObject({}));
    dispatch(storeFilteredDiamondObj({}));
    dispatch(storeActiveFilteredData({}));
    dispatch(storeFilteredData({}));
    dispatch(diamondPageChnages(false));
    dispatch(diamondNumber(""));
    dispatch(storeSelectedDiamondPrice(""));
    dispatch(jeweleryDIYimage(""));
    dispatch(diamondDIYimage(""));
    dispatch(finalCanBeSetData([]));
    dispatch(caratVlaues([]));
    // dispatch(activeDIYtabs("Jewellery"));
    dispatch(activeDIYtabs("Jewellery"));
    dispatch(storeSpecData({}));
    dispatch(storeProdData({}));
    dispatch(storeSelectedDiamondData([]));
    dispatch(jeweleryDIYName(""));
    dispatch(jeweleryDIYimage(""));
    dispatch(diamondDIYimage(""));
    dispatch(storeDiamondNumber(""));
    dispatch(addedRingData({}));
    dispatch(IsSelectedDiamond(false));
    dispatch(isRingSelected(false));
    dispatch(addedDiamondData({}));
    dispatch(storeDiamondArrayImage({}));
    dispatch(diamondImage(""));
    dispatch(diamondShape(""));
    dispatch(diamondSelectShape({}));
    dispatch(storeEmbossingData([]));
    dispatch(saveEmbossings(false));
    dispatch(previewImageDatas([]));
    dispatch(activeImageData([]));
    dispatch(DiySteperData([]));
    dispatch(ActiveStepsDiy(0));
    dispatch(engravingObj({}));
    dispatch(serviceAllData([]));
    dispatch(dimaondColorType("White"));
    sessionStorage.removeItem("routerPath");
    sessionStorage.removeItem("DIYVertical");
    sessionStorage.removeItem("itemToItemData");
    sessionStorage.removeItem("productFilterState");
    if (pathname.includes("/start-with-a-setting")) {
      dispatch(activeDIYtabs("Jewellery"));
      dispatch(storeItemObject({}));
    }
    if (pathname.includes("/start-with-a-item")) {
      dispatch(DiySteperData([]));
      dispatch(ActiveStepsDiy(0));
    }
    if (pathname.includes("/start-with-a-diamond")) {
      dispatch(activeDIYtabs("Diamond"));
      dispatch(storeItemObject({}));
      dispatch(diamondPageChnages(false));
    }
    // e.preventDefault();
  };

  // useEffect(()=>{
  //   handleRouteData();
  // },[pathname])

  //API call for DIY type is 1
  const allProductData = useCallback((obj, data) => {
    commanService
      .postApi("/Diy", obj)
      .then((res) => {
        if (res.data.success === 1) {
          const stepps = res.data.data.filter((item) =>
            data.router_link.includes(item.router_link)
          )[0];
          if (
            stepps?.details &&
            Array.isArray(stepps?.details) &&
            data.router_link.includes("/start-with-a-item")
          ) {
            const updatedSteps = [
              {
                position: 0,
                display_name: stepps?.from_display_name,
                vertical: stepps?.vertical_code,
              },
              ...stepps.details.map((step, index) => ({
                ...step,
                position: index + 1,
              })),
              {
                position: stepps?.details.length + 1,
                display_name: "Complete",
              },
            ];
            dispatch(DiySteperData(updatedSteps));
            // dispatch(DIYName(stepps?.name))
          } else {
            dispatch(DiySteperData([]));
          }
          sessionStorage.setItem("DIYVertical", stepps.vertical_code);
        }
      })
      .catch((error) => {});
  }, []);
  return (
    <>
      {navigationDatas?.length > 0 &&
        navigationDatas?.map((item, i) => {
          const capitalizeEachWord = (str) =>
            str
              ?.split(" ")
              ?.map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(" ");
          if (threshold !== null && i >= threshold) {
            return;
          }
          return (
            <li
              className="navigation__item"
              key={i}
              ref={(el) => (itemRefs.current[i] = el)}
              onMouseEnter={() => setActiveId(item?.unique_id)}
              onMouseLeave={() => setActiveId(null)}
            >
              <Link
                className={`navigation__link ${
                  isActiveParentMenu(getAlias(item, item.router_link), item) ||
                  activeId === item?.unique_id
                    ? "menu-active"
                    : ""
                }`}
                href={getAlias(item, item.router_link)}
                aria-label={item?.menu_name || "Menu Link"}
                onClick={(e) => {
                  e.preventDefault();

                  
                  setActiveId(item?.unique_id);
                  setActiveChild("");
                  dispatch(activChildMenu(""));
                  dispatch(activeIdMenu(item?.unique_id));
                  homePageNavigation(e);
                  const targetHref = getAlias(item, item.router_link);

                  if (router.asPath === targetHref) {
                    router.replace(targetHref);
                    router.reload();
                  } else {
                    router.replace(targetHref);
                  }
                }}
                // refresh="true"
              >
                {item.menu_name}
              </Link>
              {isEmpty(item?.submenu.toString()) === "1" &&
                activeId === item?.unique_id &&
                item.product_vertical_name !== "DIY" && (
                  <div
                    className={`${
                      item.sub_menus?.length !== 0 &&
                      item.product_vertical_name !== "DIY"
                        ? "mega-menu"
                        : ""
                    }`}
                  >
                    <div
                      className={`${
                        item.product_vertical_name !== "DIY"
                          ? "container mega-menu-row"
                          : "default-menu"
                      }`}
                    >
                      <div className="col">
                        <div className="row mx-8">
                          {item?.sub_menus?.length > 0 &&
                            item.sub_menus.map((subMenu, subIndex) => {
                              return (
                                <div
                                  key={`sub-${subIndex}`}
                                  className="col-3 px-2 mb-3"
                                >
                                  {subMenu.display_name && (
                                    <div className="sub-menu__title">
                                      {subMenu.display_name}
                                    </div>
                                  )}

                                  {subMenu.childs?.length > 0 &&
                                    subMenu.childs.map((child, childIndex) => {
                                      if (child.childMenuStatus === "0") {
                                        return null;
                                      }
                                      const validDetaills =
                                        child.detaills?.filter(
                                          (d) => d.title !== ""
                                        ) || [];
                                      if (
                                        validDetaills.length === 0 &&
                                        !child.childMenuName
                                      )
                                        return null;

                                      const n =
                                        validDetaills.length >= 16
                                          ? Math.ceil(validDetaills.length / 2)
                                          : validDetaills.length;

                                      const petaMenus = child.detaills.filter(
                                        (elm) => elm.logic_code === "DIY"
                                      );
                                      return (
                                        <div
                                          className="px-1 mb-1"
                                          key={`${subIndex}-${childIndex}`}
                                        >
                                          {child.childMenuName && (
                                            <Link
                                              href={
                                                petaMenus?.length > 0
                                                  ? petaMenus[0]?.router_link
                                                  : getAlias(
                                                      item,
                                                      item.router_link,
                                                      {},
                                                      child
                                                    )
                                              }
                                              className={`menu-link menu-link_us-s ${
                                                pathname.includes(
                                                  `/${changeUrl(
                                                    item.menu_name.toLowerCase()
                                                  )}`
                                                ) &&
                                                pathname.includes(
                                                  `/${changeUrl(
                                                    activChild?.toLowerCase()
                                                  )}`
                                                ) &&
                                                changeUrl(
                                                  child.childMenuName.toLowerCase()
                                                ) ===
                                                  changeUrl(
                                                    activChild.toLowerCase()
                                                  )
                                                  ? "menu-active"
                                                  : ""
                                              }`}
                                              style={{
                                                textTransform: "capitalize",
                                              }}
                                              onClick={(e) => {
                                                e.preventDefault();

                                                const targetHref =
                                                  petaMenus?.length > 0
                                                    ? petaMenus[0]?.router_link
                                                    : getAlias(
                                                        item,
                                                        item.router_link,
                                                        {},
                                                        child
                                                      );

                                                if (
                                                  router.asPath === targetHref
                                                ) {
                                                  router.replace(targetHref);
                                                  router.reload();
                                                } else {
                                                  router.replace(targetHref);
                                                }

                                                if (
                                                  item?.product_vertical_name ===
                                                  "DIY"
                                                ) {
                                                  setActiveChild("");
                                                  dispatch(activChildMenu(""));
                                                } else {
                                                  setActiveChild(
                                                    child.childMenuName
                                                  );
                                                  dispatch(
                                                    activChildMenu(
                                                      child.childMenuName
                                                    )
                                                  );
                                                  setActiveId(item?.unique_id);
                                                  dispatch(
                                                    activeIdMenu(
                                                      item?.unique_id
                                                    )
                                                  );
                                                }
                                                handleRouteData(e);
                                                if (petaMenus?.length > 0) {
                                                  dispatch(
                                                    DIYName(petaMenus[0].title)
                                                  );
                                                  sessionStorage.setItem(
                                                    "DIYVertical",
                                                    petaMenus[0].vertical_code
                                                  );
                                                  allProductData(
                                                    obj,
                                                    petaMenus[0]
                                                  );
                                                }
                                              }}
                                              aria-label={child.childMenuName}
                                            >
                                              {child.childMenuName}
                                            </Link>
                                          )}
                                          {validDetaills.length > 0 &&
                                            !jewelVertical(
                                              item.product_vertical_name
                                            ) && (
                                              <div className="row">
                                                <div className="col">
                                                  <ul className="list-unstyled">
                                                    {validDetaills
                                                      .slice(0, n)
                                                      .map((petaMenu, i) => (
                                                        <li
                                                          key={i}
                                                          className="sub-menu__item"
                                                        >
                                                          <Link
                                                            href={
                                                              petaMenu.router_link
                                                            }
                                                            aria-label={capitalizeEachWord(
                                                              petaMenu.title
                                                            )}
                                                            className={`menu-link menu-link_us-s ${
                                                              pathname.includes(
                                                                `/${changeUrl(
                                                                  item.menu_name.toLowerCase()
                                                                )}`
                                                              ) &&
                                                              pathname.includes(
                                                                `/${changeUrl(
                                                                  activChild?.toLowerCase()
                                                                )}`
                                                              ) &&
                                                              changeUrl(
                                                                petaMenu.title.toLowerCase()
                                                              ) ===
                                                                changeUrl(
                                                                  activChild.toLowerCase()
                                                                ) &&
                                                              petaMenu.unique_id ===
                                                                activeIdMenus
                                                                ? "menu-active"
                                                                : ""
                                                            }`}
                                                            onClick={(e) => {
                                                              e.preventDefault();
                                                              setActiveChild(
                                                                petaMenu.title
                                                              );
                                                              dispatch(
                                                                activChildMenu(
                                                                  petaMenu.title
                                                                )
                                                              );
                                                              const targetHref =
                                                                petaMenu.router_link;

                                                              if (
                                                                router.asPath ===
                                                                targetHref
                                                              ) {
                                                                router.replace(
                                                                  targetHref
                                                                );
                                                                router.reload();
                                                              } else {
                                                                router.replace(
                                                                  targetHref
                                                                );
                                                              }

                                                              setActiveId(
                                                                petaMenu.unique_id
                                                              );
                                                              dispatch(
                                                                activeIdMenu(
                                                                  petaMenu.unique_id
                                                                )
                                                              );
                                                              handleRouteData(
                                                                e
                                                              );
                                                              dispatch(
                                                                DIYName(
                                                                  petaMenu.title
                                                                )
                                                              );
                                                              sessionStorage.setItem(
                                                                "DIYVertical",
                                                                petaMenu.vertical_code
                                                              );
                                                              if (
                                                                petaMenu.type ===
                                                                "1"
                                                              )
                                                                allProductData(
                                                                  obj,
                                                                  petaMenu
                                                                );
                                                            }}
                                                            style={{
                                                              textTransform:
                                                                "capitalize",
                                                            }}
                                                          >
                                                            {petaMenu.icon && (
                                                              <span
                                                                className={`${petaMenu.icon} me-2 shape-icon`}
                                                              />
                                                            )}
                                                            {capitalizeEachWord(
                                                              petaMenu.title
                                                            )}
                                                          </Link>
                                                        </li>
                                                      ))}
                                                  </ul>
                                                </div>

                                                {n < validDetaills.length && (
                                                  <div className="col">
                                                    <ul className="list-unstyled">
                                                      {validDetaills
                                                        .slice(n)
                                                        .map((petaMenu, i) => (
                                                          <li
                                                            key={i}
                                                            className="sub-menu__item"
                                                          >
                                                            <Link
                                                              href={
                                                                petaMenu.router_link
                                                              }
                                                              aria-label={capitalizeEachWord(
                                                                petaMenu.title
                                                              )}
                                                              className={`menu-link menu-link_us-s ${
                                                                pathname.includes(
                                                                  `/${changeUrl(
                                                                    item.menu_name.toLowerCase()
                                                                  )}`
                                                                ) &&
                                                                pathname.includes(
                                                                  `/${changeUrl(
                                                                    activChild?.toLowerCase()
                                                                  )}`
                                                                ) &&
                                                                changeUrl(
                                                                  petaMenu.title.toLowerCase()
                                                                ) ===
                                                                  changeUrl(
                                                                    activChild.toLowerCase()
                                                                  ) &&
                                                                petaMenu.unique_id ===
                                                                  activeIdMenus
                                                                  ? "menu-active"
                                                                  : ""
                                                              }`}
                                                              onClick={(e) => {
                                                                setActiveChild(
                                                                  petaMenu.title
                                                                );
                                                                dispatch(
                                                                  activChildMenu(
                                                                    petaMenu.title
                                                                  )
                                                                );
                                                                setActiveId(
                                                                  petaMenu.unique_id
                                                                );
                                                                dispatch(
                                                                  activeIdMenu(
                                                                    petaMenu.unique_id
                                                                  )
                                                                );
                                                                handleRouteData(
                                                                  e
                                                                );
                                                                dispatch(
                                                                  DIYName(
                                                                    petaMenu.title
                                                                  )
                                                                );
                                                                sessionStorage.setItem(
                                                                  "DIYVertical",
                                                                  petaMenu.vertical_code
                                                                );
                                                                if (
                                                                  petaMenu.type ===
                                                                  "1"
                                                                )
                                                                  allProductData(
                                                                    obj,
                                                                    petaMenu
                                                                  );
                                                              }}
                                                              style={{
                                                                textTransform:
                                                                  "capitalize",
                                                              }}
                                                            >
                                                              {petaMenu.icon && (
                                                                <span
                                                                  className={`${petaMenu.icon} me-2`}
                                                                />
                                                              )}
                                                              {capitalizeEachWord(
                                                                petaMenu.title
                                                              )}
                                                            </Link>
                                                          </li>
                                                        ))}
                                                    </ul>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                        </div>
                                      );
                                    })}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                      {item &&
                        item.sub_menus?.length > 0 &&
                        item.image !== "" && (
                          <div
                            className="mega-menu__media col position-relative"
                            key={i}
                          >
                            <picture>
                              <Image
                                loading="lazy"
                                // unoptimized={true}
                                className="mega-menu__img"
                                src={item.image}
                                width={472}
                                height={360}
                                alt="New Horizons"
                              />
                            </picture>
                          </div>
                        )}
                    </div>
                  </div>
                )}
              {/* <!-- /.box-menu --> */}
            </li>
          );
        })}
      {showMore && (
        <li className="navigation__item">
          {navigationDatas?.slice(threshold) &&
            navigationDatas?.slice(threshold)?.length > 0 && (
              <>
                <span className={`navigation__link`}>Show More</span>
                <div className="navigation__item">
                  <div className={""}>
                    <div className={"default-menu list-unstyled"}>
                      {navigationDatas?.slice(threshold)?.map((menu, q) => {
                        return (
                          <div className="col ShowMoreItem" key={q}>
                            <div className="sub-menu__item">
                              <Link
                                href={getAlias(menu, menu.router_link)}
                                aria-label={menu?.menu_name}
                                onClick={(e) => {
                                  setActiveId(menu.unique_id);
                                  setActiveChild("");
                                  dispatch(activChildMenu(""));
                                  dispatch(activeIdMenu(menu?.unique_id));
                                  homePageNavigation(e);
                                  sessionStorage.setItem(
                                    "DIYVertical",
                                    menu.product_vertical_name
                                  );
                                }}
                                onMouseEnter={() =>
                                  setActiveId(menu?.unique_id)
                                }
                                onMouseLeave={() => setActiveId(null)}
                                // refresh="true"
                                className="menu-link menu-link_us-s"
                              >
                                <span
                                  className={`menu__title ${
                                    isActiveParentMenu(
                                      getAlias(menu, menu.router_link),
                                      menu
                                    ) || activeId === menu?.unique_id
                                      ? "menu-active"
                                      : ""
                                  }`}
                                >
                                  {menu.menu_name}
                                </span>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
        </li>
      )}
    </>
  );
}
