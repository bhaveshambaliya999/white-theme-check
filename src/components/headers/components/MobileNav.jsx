import { useCallback, useEffect, useState } from "react";
import React from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  activChildMenu,
  activeDIYtabs,
  activeIdMenu,
  activeIdMenuMobile,
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
  previewImageDatas,
  saveEmbossings,
  serviceAllData,
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
} from "@/Redux/action";
import {
  changeUrl,
  isEmpty,
  jewelVertical,
  safeParse,
} from "@/CommanFunctions/commanFunctions";
import commanService from "@/CommanService/commanService";
import { domain } from "@/CommanService/commanServiceSSR";

export default function MobileNav({ naviGationMenuDatas, show, setShow }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const reduxStoreNav = useSelector((state) => state.naviGationMenuData);
  // const naviGationMenuDatas =
  //   typeof window !== "undefined"
  //     ? safeParse(sessionStorage.getItem("navMenuData")) || reduxStoreNav
  //     : reduxStoreNav;
  const activeIdMenus = useSelector((state) => state.activeIdMenuMobile);
  const activeVerticalCode =
    typeof window !== "undefined" && sessionStorage.getItem("DIYVertical");
  const activChildMenus = useSelector((state) => state.activChildMenu);
  const [activChild, setActiveChild] = useState(activChildMenus ?? "");
  const [activeId, setActiveId] = useState(activeIdMenus ?? "");
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
  const isActiveParentMenu = (menus, item) => {
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
  if (typeof window === "undefined") return;

  const selectors = {
    mobileMenuActivator: ".mobile-nav-activator",
    mobileMenu: ".header-mobile__navigation",
    mobileMenuActiveClass: "mobile-menu-opened",
    mobileSubNavOpen: ".js-nav-right",
    mobileSubNavClose: ".js-nav-left",
    mobileSubNavHiddenClass: "d-none",
  };

  const mobileMenuActivator = document.querySelector(selectors.mobileMenuActivator);
  const mobileDropdown = document.querySelector(selectors.mobileMenu);

  if (!mobileDropdown) return;

  let transformLeft = 0;
  const mobileMenu = mobileDropdown.querySelector(".navigation__list");
  const menuMaxHeight = mobileMenu?.offsetHeight || 0;

  // ---- Handlers ----
   const toggleMobileMenu = (event) => {
      event?.preventDefault();

      const isOpen = document.body.classList.contains(
        selectors.mobileMenuActiveClass
      );

      if (isOpen) {
        document.body.classList.remove(selectors.mobileMenuActiveClass);
        document.body.style.paddingRight = "";
        mobileDropdown.style.paddingRight = "";
      } else {
        const scrollWidth =
          window.innerWidth - document.documentElement.clientWidth;
        document.body.classList.add(selectors.mobileMenuActiveClass);
        document.body.style.paddingRight = `${scrollWidth}px`;
        mobileDropdown.style.paddingRight = `${scrollWidth}px`;
      }
    };

  const handleOpen = (btn) => (event) => {
    event.preventDefault();
    btn.nextElementSibling?.classList.remove(selectors.mobileSubNavHiddenClass);
    transformLeft -= 100;

    const subMenuHeight = btn.nextElementSibling?.offsetHeight || 0;
    mobileMenu.style.transform = `translateX(${transformLeft}%)`;
    mobileMenu.style.minHeight = `${Math.max(menuMaxHeight, subMenuHeight)}px`;
  };

  const handleClose = (btn) => (event) => {
    event.preventDefault();
    transformLeft += 100;

    mobileMenu.style.transform = `translateX(${transformLeft}%)`;
    btn.parentElement?.classList.add(selectors.mobileSubNavHiddenClass);
  };

  // ---- Attach listeners & keep references ----
  const openButtons = Array.from(mobileMenu.querySelectorAll(selectors.mobileSubNavOpen));
  const closeButtons = Array.from(mobileMenu.querySelectorAll(selectors.mobileSubNavClose));

  const openHandlers = openButtons.map((btn) => {
    const fn = handleOpen(btn);
    btn.addEventListener("click", fn);
    return fn;
  });

  const closeHandlers = closeButtons.map((btn) => {
    const fn = handleClose(btn);
    btn.addEventListener("click", fn);
    return fn;
  });

  mobileMenuActivator?.addEventListener("click", toggleMobileMenu);

  // ---- Cleanup (now works correctly) ----
  return () => {
    mobileMenuActivator?.removeEventListener("click", toggleMobileMenu);

    openButtons.forEach((btn, i) =>
      btn.removeEventListener("click", openHandlers[i])
    );

    closeButtons.forEach((btn, i) =>
      btn.removeEventListener("click", closeHandlers[i])
    );
  };
}, [activeIdMenus, show]);


  // Close mobile menu on route change
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mobileDropdown = document.querySelector(".header-mobile__navigation");
    if (
      mobileDropdown &&
      document.body.classList.contains("mobile-menu-opened")
    ) {
      document.body.classList.remove("mobile-menu-opened");
      document.body.style.paddingRight = "";
      mobileDropdown.style.paddingRight = "";
    }
  }, [pathname]);
  
  const handleOnClick = () => {
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
      {naviGationMenuDatas?.length > 0 &&
        naviGationMenuDatas?.map((item, i) => (
          <li
            className="navigation__item d-flex align-items-center justify-content-between"
            key={`menu-${i}`}
          >
            <Link
              href={getAlias(item, item.router_link)}
              className={`${
                !item?.sub_menus?.length ||
                item?.product_vertical_name === "DIY"
                  ? "navigation__link"
                  : "navigation__link d-flex align-items-center"
              } ${
                isActiveParentMenu(getAlias(item, item.router_link), item) ||
                activeId === item?.unique_id
                  ? "menu-active"
                  : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleOnClick();
                dispatch(activeIdMenuMobile(item?.unique_id));
                setActiveChild("");
                dispatch(activChildMenu(""));
                dispatch(activeIdMenu(item?.unique_id));

                const targetHref = getAlias(item, item.router_link);

                if (router.asPath === targetHref) {
                  router.replace(targetHref);
                  router.reload();
                } else {
                  router.replace(targetHref);
                }
              }}
            >
              {item?.menu_name}
            </Link>

            {item?.sub_menus?.length > 0 &&
              item.product_vertical_name !== "DIY" && (
                <span
                  className={`navigation__link js-nav-right not-before ${
                    isActiveParentMenu(
                      getAlias(item, item?.router_link),
                      item
                    ) || activeIdMenus === item?.unique_id
                      ? "menu-active"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveChild("");
                    dispatch(activChildMenu(""));
                    setActiveId(item?.unique_id);
                    dispatch(activeIdMenu(item?.unique_id));
                  }}
                >
                  <svg
                    className="ms-auto"
                    width="7"
                    height="11"
                    viewBox="0 0 7 11"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <use href="#icon_next_sm" />
                  </svg>
                </span>
              )}

            {item?.sub_menus?.length > 0 &&
              item?.product_vertical_name !== "DIY" && (
                <div className="sub-menu position-absolute top-0 start-100 w-100 d-none">
                  <div
                    className="navigation__link js-nav-left d-flex align-items-center border-bottom mb-3"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveChild("");
                      dispatch(activChildMenu(""));
                      setActiveId(item.unique_id);
                      dispatch(activeIdMenu(item.unique_id));
                    }}
                  >
                    <svg
                      className="me-2"
                      width="7"
                      height="11"
                      viewBox="0 0 7 11"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <use href="#icon_prev_sm" />
                    </svg>
                    {item?.menu_name}
                  </div>

                  {isEmpty(item?.submenu) === 1 && (
                    <ul className="sub-menu__wrapper list-unstyled">
                      {item.sub_menus.map((subMenu, k) => {
                        const hasChilds =
                          subMenu.childs?.length > 0 && subMenu.display_name;

                        if (hasChilds) {
                          return (
                            <li key={`submenu-${i}-${k}`}>
                              <div
                                className="navigation__link js-nav-right d-flex align-items-center"
                                onClick={(e) => {
                                  e.preventDefault();
                                }}
                              >
                                {subMenu.display_name}
                                <svg
                                  className="ms-auto"
                                  width="7"
                                  height="11"
                                  viewBox="0 0 7 11"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <use href="#icon_next_sm" />
                                </svg>
                              </div>

                              <div className="sub-menu__wrapper position-absolute top-0 start-100 w-100 d-none">
                                <div
                                  className="navigation__link js-nav-left d-flex align-items-center border-bottom mb-2"
                                  onClick={(e) => {
                                    e.preventDefault();
                                  }}
                                >
                                  <svg
                                    key={`prev-${i}-${k}`}
                                    className="me-2"
                                    width="7"
                                    height="11"
                                    viewBox="0 0 7 11"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <use href="#icon_prev_sm" />
                                  </svg>
                                  {subMenu.display_name}
                                </div>

                                <ul className="sub-menu__list list-unstyled">
                                  {subMenu.childs?.map((child, o) => {
                                    if (child.childMenuStatus === "0")
                                      return null;

                                    const validDetaills =
                                      child.detaills?.filter(
                                        (d) => d.title?.trim() !== ""
                                      ) || [];

                                    if (
                                      validDetaills.length === 0 &&
                                      !child.childMenuName
                                    )
                                      return null;
                                    const chunkSize =
                                      validDetaills.length >= 20
                                        ? Math.ceil(validDetaills.length / 2)
                                        : validDetaills.length;

                                    const chunks = [
                                      validDetaills.slice(0, chunkSize),
                                      ...(chunkSize < validDetaills.length
                                        ? [validDetaills.slice(chunkSize)]
                                        : []),
                                    ];
                                    const petaMenus = child.detaills.filter(
                                      (elm) => elm.logic_code === "DIY"
                                    );
                                    return (
                                      <li
                                        className="sub-menu__item"
                                        key={`child-${i}-${k}-${o}`}
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
                                                `/${changeUrl(item.menu_name)}`
                                              ) &&
                                              pathname.includes(
                                                `/${changeUrl(
                                                  activChild?.toLowerCase()
                                                )}`
                                              ) &&
                                              child.childMenuName === activChild
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
                                                  activeIdMenu(item?.unique_id)
                                                );
                                              }
                                              handleOnClick(e);
                                              if (petaMenus?.length > 0) {
                                                dispatch(
                                                  DIYName(petaMenus[0].title)
                                                );
                                                sessionStorage.setItem(
                                                  "DIYVertical",
                                                  petaMenus.vertical_code
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
                                            <ul className="list-unstyled ps-3">
                                              {validDetaills.map(
                                                (detail, dIdx) => (
                                                  <li
                                                    key={`detail-${i}-${k}-${o}-${dIdx}`}
                                                  >
                                                    <Link
                                                      href={
                                                        detail.router_link ||
                                                        "#"
                                                      }
                                                      className={`menu-link ${
                                                        isMenuActive(
                                                          detail.title,
                                                          detail,
                                                          child,
                                                          subMenu,
                                                          item
                                                        )
                                                          ? "menu-active"
                                                          : ""
                                                      }`}
                                                      style={{
                                                        textTransform:
                                                          "capitalize",
                                                      }}
                                                      onClick={(e) => {
                                                        e.preventDefault();

                                                        const targetHref =
                                                          detail.router_link;

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
                                                        dispatch(
                                                          activeIdMenuMobile(
                                                            detail.unique_id
                                                          )
                                                        );
                                                        dispatch(
                                                          DIYName(detail.title)
                                                        );
                                                        handleOnClick(e);
                                                      }}
                                                    >
                                                      {detail.icon && (
                                                        <span
                                                          className={`${detail.icon} me-2`}
                                                        />
                                                      )}
                                                      {detail.title}
                                                    </Link>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          )}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </li>
                          );
                        } else {
                          // Direct submenu
                          return (
                            <li
                              className="navigation__item"
                              key={`submenu-${i}-${k}`}
                            >
                              <Link
                                href={subMenu.router_link || item.router_link}
                                className={`navigation__link ${
                                  isMenuActive(
                                    subMenu.display_name,
                                    subMenu,
                                    {},
                                    item
                                  )
                                    ? "menu-active"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  dispatch(activeIdMenuMobile(item.unique_id));
                                  dispatch(DiySteperData([]));
                                  dispatch(ActiveStepsDiy(0));
                                  handleOnClick?.(e);
                                }}
                                style={{ textTransform: "capitalize" }}
                              >
                                {subMenu.display_name}
                              </Link>
                            </li>
                          );
                        }
                      })}
                    </ul>
                  )}
                </div>
              )}
          </li>
        ))}

      {/* Static About and Contact Links */}
      <li className="navigation__item">
        <Link
          href="/about-us"
          className={`navigation__link ${
            pathname == "/about" ? "menu-active" : ""
          }`}
          onClick={() => handleOnClick()}
        >
          About
        </Link>
      </li>
      <li className="navigation__item">
        <Link
          href="/contact-us"
          className={`navigation__link ${
            pathname == "/contact" ? "menu-active" : ""
          }`}
          onClick={() => handleOnClick()}
        >
          Contact
        </Link>
      </li>
    </>
  );
}
