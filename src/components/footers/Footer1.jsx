import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import commanService, { domain } from "../../CommanService/commanService";
import {
  activChildMenu,
  activeDIYtabs,
  activeIdMenu,
  activeImageData,
  ActiveStepsDiy,
  addedDiamondData,
  addedRingData,
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
  footerAllContactData,
  footerAllContentData,
  footerLogoData,
  footerNavData,
  footerServiceAllData,
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
  socialUrlData,
  storeActiveFilteredData,
  storeCurrency,
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
} from "../../Redux/action";
import Loader from "../../CommanUIComp/Loader/Loader";
import { toast } from "react-toastify";
import {
  changeUrl,
  isEmpty,
  jewelVertical,
  RandomId,
  safeParse,
} from "../../CommanFunctions/commanFunctions";
import Features from "../common/features/Features";
import Image from "next/image";
import paymentGateways from "@/assets/images/payment-options.webp";
import { FormSelect } from "react-bootstrap";
import Svgs from "@/components/common/Svgs";

export default function Footer1({ storeData }) {
  //State Declerations
  const isRefCall = useRef(false);
  const reduxLoginData = useSelector((state) => state.loginData);

  const loginDatas =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("loginData")) || reduxLoginData
      : reduxLoginData;

  const storeEntityIds =
    storeData || useSelector((state) => state.storeEntityId);
  const reduxStoreCurrency = useSelector((state) => state.storeCurrency);
  const storeCurrencys =
    typeof window !== "undefined"
      ? sessionStorage.getItem("storeCurrency") || reduxStoreCurrency
      : reduxStoreCurrency;

  const reduxStoreCurrencyData = useSelector(
    (state) => state.storeCurrencyData
  );
  const storeCurrencyDatas =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("storeCurrencyData")) ||
        reduxStoreCurrencyData
      : reduxStoreCurrencyData;
  const isLogin = loginDatas && Object.keys(loginDatas).length > 0;
  const footerAllContentDatas = useSelector(
    (state) => state.footerAllContentData
  );
  const footerAllContactDatas = useSelector(
    (state) => state.footerAllContactData
  );

  const socialUrlDatas = useSelector((state) => state.socialUrlData);
  const footerLogoDatas = useSelector((state) => state.footerLogoData);
  const footerServiceDatas = useSelector((state) => state.footerServiceAllData);
  const reduxStoreNav = useSelector((state) => state.footerNavData);
  const naviGationMenuDatas =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("footerNavMenuData")) || reduxStoreNav
      : reduxStoreNav;
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const activeIdMenus = useSelector((state) => state.activeIdMenu);
  const activChildMenus = useSelector((state) => state.activChildMenu);
  const [loader, setLoader] = useState(false);
  const [activeId, setActiveId] = useState(activeIdMenus ?? "");
  const [activChild, setActiveChild] = useState(activChildMenus ?? "");
  // Tost Msg
  const [toastShow, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Footer Active
  const [FooterActive, setFooterActive] = useState("");

  // Footer Data
  const [footerNavMenu, setFooterNavMenu] = useState(naviGationMenuDatas ?? []);
  const [footerLogo, setFooterLogo] = useState(footerLogoDatas ?? []);
  const [footerContent, setFooterContent] = useState(
    footerAllContentDatas ?? []
  );
  const [footerSocialLink, setfooterSocialLink] = useState(
    socialUrlDatas ?? []
  );
  const [footerContact, setFooterContact] = useState(
    footerAllContactDatas ?? []
  );
  const [footerService, setFooterService] = useState(footerServiceDatas ?? []);

  // Form email
  const [email, setEmail] = useState("");

  const obj = {
    SITDeveloper: "1",
    a: "SetupDiyVertical",
    store_id: storeEntityIds.mini_program_id,
    tenant_id: storeEntityIds.tenant_id,
    entity_id: storeEntityIds.entity_id,
    origin: domain,
    unique_id: "",
  };

  //Get Home Footer Details Data
  const footerData = useCallback(
    (data) => {
      setLoader(true);
      const obj = {
        a: "getHomeFooterDetail",
        SITDeveloper: 1,
        store_id: storeEntityIds.mini_program_id,
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        origin: storeEntityIds.cmp_origin,
        store_id: data.mini_program_id,
        user_id:
          Object.keys(loginDatas).length > 0 ? loginDatas.member_id : RandomId,
        type: "B2C",
      };
      commanService
        .postApi("/StoreCart", obj)
        .then((res) => {
          if (res["data"]["success"] === 1) {
            // setFooterContent([]);
            // dispatch(footerAllContentData([]));
            const footerData = res["data"]["data"];
            if (Object.keys(footerData).length > 0) {
              const footerLogo = footerData?.logo_data;
              const footerContentData = footerData?.content_data;
              const footerSocialData = footerData?.socialmedia_link;
              const footerContact = footerData?.contact_data;
              const footerServiceData = footerData?.footer_service;
              const footerNavigationMenu = footerData?.navigation_footer_data;

              if (footerNavigationMenu.length > 0) {
                handleNavigationMenu(footerNavigationMenu);
              }
              if (footerLogo.length > 0) {
                setFooterLogo(footerLogo);
                dispatch(footerLogoData(footerLogo));
              }
              setFooterContent(footerContentData);
              dispatch(footerAllContentData(footerContentData));
              if (footerSocialData.length > 0) {
                setfooterSocialLink(footerSocialData);
                dispatch(socialUrlData(footerSocialData));
              }
              if (footerContact.length > 0) {
                footerContact[0]["address"] = footerContact[0]["building"];
                if (footerContact[0]["building_name"] != "") {
                  footerContact[0]["address"] =
                    footerContact[0]["address"] +
                    ", " +
                    footerContact[0]["building_name"];
                }
                footerContact[0]["address"] =
                  footerContact[0]["address"] +
                  ", " +
                  footerContact[0]["street"];
                // if (footerContact[0]["description"] != "") {
                //   footerContact[0]["address"] =
                //     footerContact[0]["address"] +
                //     ", " +
                //     footerContact[0]["description"];
                // }
                if (footerContact[0]["city_name"] != "") {
                  footerContact[0]["address"] =
                    footerContact[0]["address"] +
                    ", " +
                    footerContact[0]["city_name"];
                }
                if (footerContact[0]["pincode"] != "") {
                  footerContact[0]["address"] =
                    footerContact[0]["address"] +
                    "-" +
                    footerContact[0]["pincode"];
                }
                footerContact[0]["address"] =
                  footerContact[0]["address"] +
                  ", " +
                  footerContact[0]["state_name"] +
                  ", " +
                  footerContact[0]["country_name"] +
                  ".";
                setFooterContact(footerContact);
                dispatch(footerAllContactData(footerContact));
              }
              if (footerServiceData?.length > 0) {
                if (Array.isArray(footerServiceData)) {
                  const sortedFooterServiceData = [...footerServiceData].sort(
                    (a, b) => (a.position || 0) - (b.position || 0)
                  );
                  setFooterService(sortedFooterServiceData);
                  dispatch(footerServiceAllData(sortedFooterServiceData));
                }
              }
            } else {
              let arr = [];
              arr.push(
                { code: "blog", name: "Blog" },
                { code: "about-us", name: "About Us" },
                { code: "contact-us", name: "Contact Us" }
              );
              setFooterContent(arr);
              dispatch(footerAllContentData(arr));
            }
            setLoader(false);
          } else {
            let arr = [];
            arr.push(
              { code: "blog", name: "Blog" },
              { code: "about-us", name: "About Us" },
              { code: "contact-us", name: "Contact Us" }
            );
            setFooterContent(arr);
            dispatch(footerAllContentData(arr));
            setLoader(false);
          }
        })
        .catch(() => {
          let arr = [];
          arr.push(
            { code: "blog", name: "Blog" },
            { code: "about-us", name: "About Us" },
            { code: "contact-us", name: "Contact Us" }
          );
          setFooterContent(arr);
          dispatch(footerAllContentData(arr));
          setLoader(false);
        });
    },
    [loginDatas, dispatch]
  );

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
    setFooterNavMenu([...result]);
    sessionStorage.setItem("footerNavMenuData", JSON.stringify([...result]));
    dispatch(footerNavData([...result]));
  };

  //call of function of footerData
  useEffect(() => {
    const data = storeEntityIds;
    if (
      data &&
      Object.keys(data).length > 0 &&
      !isRefCall.current &&
      footerAllContentDatas?.length === 0
    ) {
      footerData(data);
      isRefCall.current = true;
    } else {
      setFooterLogo(footerLogoDatas);
      setFooterContent(footerAllContentDatas);
      setFooterContact(footerAllContactDatas);
      setfooterSocialLink(socialUrlDatas);
    }
  }, [storeEntityIds, loginDatas, storeCurrencyDatas]);

  //Update currency
  const updateCartCurrency = (e) => {
    const obj = {
      a: "updateCartCurrency",
      store_id: storeEntityIds.mini_program_id,
      SITDeveloper: "1",
      origin: storeEntityIds.origin,
      member_id:
        Object.keys(loginDatas).length > 0 ? loginDatas.member_id : RandomId,
      new_currency: e,
    };
    commanService
      .postApi("/StoreCart ", obj)
      .then((res) => {
        if (res.data.success === 1) {
          router.reload();
          if (pathname.includes("/start-with-a-")) {
            dispatch(storeEmbossingData([]));
            dispatch(saveEmbossings(false));
            dispatch(previewImageDatas([]));
            dispatch(activeImageData([]));
            dispatch(engravingObj({}));
            dispatch(DiySteperData([]));
            dispatch(ActiveStepsDiy(0));
            sessionStorage.removeItem("DIYVertical");
            router.push("/make-your-customization");
          }
        }
      })
      .catch(() => {});
  };

  //Onchange Currency update
  const changeCurrency = (e) => {
    const data = storeCurrencyDatas.filter(
      (s) => s.mp_store_price === e.target.value
    );
    if (data?.[0]?.mp_b2c_url && data?.[0].is_store !== 1) {
      window.open(data[0]?.mp_b2c_url, "_blank", "");
    } else {
      dispatch(storeCurrency(data?.[0]?.mp_store_price));
      sessionStorage.setItem("storeCurrency", data?.[0]?.mp_store_price);
      updateCartCurrency(data?.[0].mp_store_price);
      router.push(pathname.includes("_checkout") ? "/shop_cart" : pathname);
      window.scroll(0, 0);
    }
  };

  //Click function for To Subscribe Email
  const subscribeEmail = () => {
    const obj = {
      a: "AddUpdateSubscribers",
      unique_id: "",
      store_id: storeEntityIds.mini_program_id,
      email: email,
    };

    setLoader(true);
    if (email != "") {
      commanService
        .postLaravelApi("/Subscribers", obj)
        .then((res) => {
          if (res.data.success === 1) {
            setEmail("");
            toast.success(res.data.message);
            if (!isLogin) {
              router.push("/login_register");
              dispatch(isRegisterModal(false));
              dispatch(isLoginModal(true));
            }
            setLoader(false);
          } else {
            setLoader(false);
            toast.error(res.data.message);
          }
          window.scroll(0, 0);
          setEmail("");
        })
        .catch(() => {});
    } else {
      setLoader(false);
    }
  };

  //Active-Deactive Menu
  const isMenuActive = (menu, item) => {
    return pathname
      .toLowerCase()
      .toString()
      .includes(`/${menu.split(" ").join("-").toLowerCase()}`);
  };

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

  return loader ? (
    <Loader />
  ) : (
    <>
      <footer className="footer footer_type_1 pb-2 pb-sm-0">
        <Svgs />
        {footerService?.length > 0 && (
          <div className="footer-top container">
            <Features footerService={footerService} />
          </div>
        )}
        <div className="footer-middle container">
          <div className="row row-cols-lg-5 row-cols-2">
            <div className="footer-column footer-store-info col-12 mb-4 mb-lg-0">
              {footerLogo?.length > 0 &&
                footerLogo?.map((L, i) => {
                  return (
                    <React.Fragment key={i}>
                      {L.image !== "" ? (
                        <React.Fragment>
                          {L.logo_type === "FOOTER" && (
                            <div className="logo">
                              <Link href="/" aria-label="Footer Logo">
                                <picture>
                                  <Image
                                    src={L.image}
                                    width={128}
                                    height={52}
                                    alt="B2C Footer Logo"
                                    className="logo__image d-block"
                                    priority
                                    fetchPriority="high"
                                  />
                                </picture>
                              </Link>
                            </div>
                          )}
                        </React.Fragment>
                      ) : (
                        ""
                      )}
                    </React.Fragment>
                  );
                })}

              {/* <!-- /.logo --> */}
              {footerContact?.length > 0 &&
                footerContact?.map((e, i) => (
                  <React.Fragment key={i}>
                    <div className="footer-address">{e.address}</div>
                    {(isEmpty(e?.email) !== "" ||
                      isEmpty(e?.mobile) !== "") && (
                      <>
                        {isEmpty(e?.email) !== "" && (
                          <div className="mb-2 d-flex align-items-center">
                            <svg width="15" height="15" aria-hidden="true">
                              <use xlinkHref="#icon_envelope"></use>
                            </svg>
                            <Link
                              className="fw-medium ms-1"
                              href={`mailto:${e?.email}`}
                              aria-label={e?.email}
                            >
                              {e.email}
                            </Link>
                          </div>
                        )}
                        {isEmpty(e?.mobile) !== "" && (
                          <div className="mb-4 d-flex align-items-center">
                            <svg width="15" height="15" aria-hidden="true">
                              <use xlinkHref="#icon_telephone"></use>
                            </svg>

                            <Link
                              className="fw-medium ms-1"
                              href={`tel:${e?.mobile}`}
                              aria-label={e?.mobile}
                            >
                              {e.mobile}
                            </Link>
                          </div>
                        )}
                      </>
                    )}
                  </React.Fragment>
                ))}
              <h3 className="sub-menu__title text-uppercase h5 mb-3">
                Stay Connected
              </h3>
              <ul className="social-links list-unstyled d-flex flex-wrap mb-0">
                {footerSocialLink &&
                  footerSocialLink?.length > 0 &&
                  footerSocialLink?.map((s, i) => (
                    <li key={i}>
                      <Link
                        className="footer__social-link d-block"
                        target={"_blank"}
                        href={s.url}
                        aria-label="Footer Social Media"
                      >
                        <picture>
                          <Image
                            src={s.image}
                            alt="Social Images"
                            className="img-fluid"
                            width={20}
                            height={20}
                          />
                        </picture>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
            {/* <!-- /.footer-column --> */}

            <div className="footer-column footer-menu mb-4 mb-lg-0">
              {footerContent?.length > 0 &&
                footerContent?.map((e, i) => {
                  if (e.category_name === "Customer Service") {
                    return (
                      <React.Fragment key={i}>
                        <h3 className="sub-menu__title text-uppercase h5">
                          {e.category_name}
                        </h3>
                        <ul className="sub-menu__list list-unstyled">
                          {(e.data || []).map((d, index) => {
                            return (
                              <li key={index} className="sub-menu__item">
                                <Link
                                  href={`/${d?.ecm_code.toLowerCase()}`}
                                  aria-label={d?.ecm_name}
                                  className={`${
                                    isMenuActive(d?.ecm_code.toLowerCase())
                                      ? "menu-active"
                                      : ""
                                  } menu-link menu-link_us-s`}
                                >
                                  {d?.ecm_name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </React.Fragment>
                    );
                  }
                })}
            </div>
            {/* <!-- /.footer-column --> */}
            <div className="footer-column footer-menu mb-4 mb-lg-0">
              {footerContent?.length > 0 &&
                footerContent?.map((e, i) => {
                  if (e.category_name === "About Us") {
                    return (
                      <React.Fragment key={i}>
                        <h3 className="sub-menu__title text-uppercase h5">
                          {e.category_name}
                        </h3>
                        <ul className="sub-menu__list list-unstyled">
                          {/* <li className="sub-menu__item">
                            <Link className={`${pathname.includes("/about-us") ? "menu-active" : ""} menu-link menu-link_us-s`} href={"/about-us"}>
                              About Us
                            </Link>
                          </li> */}
                          {(e.data || []).map((d, index) => {
                            return (
                              <li key={index} className="sub-menu__item">
                                <Link
                                  href={
                                    d.ecm_code === "ABOUTUS"
                                      ? "/about-us"
                                      : `/${d.ecm_code.toLowerCase()}`
                                  }
                                  className={`${
                                    d.ecm_code === "ABOUTUS" &&
                                    pathname.includes("/about-us")
                                      ? "menu-active"
                                      : isMenuActive(d?.ecm_code.toLowerCase())
                                      ? "menu-active"
                                      : ""
                                  } menu-link menu-link_us-s`}
                                  aria-label={d?.ecm_name}
                                >
                                  {d?.ecm_name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </React.Fragment>
                    );
                  }
                })}
            </div>
            {/* <!-- /.footer-column --> */}
            <div className="footer-column footer-menu mb-4 mb-lg-0">
              {footerContent?.length > 0 &&
                footerContent?.map((e, i) => {
                  if (e.category_name === "Why") {
                    return (
                      <React.Fragment key={i}>
                        <h3 className="sub-menu__title text-uppercase h5">
                          {e.category_name}
                        </h3>
                        <ul className="sub-menu__list list-unstyled">
                          {/* <li className="sub-menu__item">
                            <Link className={`${pathname.includes("/contact") ? "menu-active" : ""} menu-link menu-link_us-s`} href={"/contact-us"}>
                              24/7 Customer Support
                            </Link>
                          </li> */}
                          {(e.data || []).map((d, index) => {
                            return (
                              <li key={index} className="sub-menu__item">
                                <Link
                                  href={
                                    d.ecm_code === "CUSTOMERSUPPORT"
                                      ? "/contact-us"
                                      : `/${d.ecm_code.toLowerCase()}`
                                  }
                                  aria-label={d?.ecm_name}
                                  className={`${
                                    d.ecm_code === "CUSTOMERSUPPORT" &&
                                    pathname.includes("/contact")
                                      ? "menu-active"
                                      : isMenuActive(d?.ecm_code.toLowerCase())
                                      ? "menu-active"
                                      : ""
                                  } menu-link menu-link_us-s`}
                                >
                                  {d?.ecm_name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </React.Fragment>
                    );
                  }
                })}
            </div>
            {/* <!-- /.footer-column --> */}
            <div className="footer-column footer-newsletter col-12 mb-4 mb-lg-0">
              <h3 className="sub-menu__title text-uppercase h5">Subscribe</h3>
              <p>
                Be the first to get the latest news about trends, promotions,
                and much more!
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="footer-newsletter__form position-relative"
              >
                <input
                  className="form-control border-white"
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  required
                  autoComplete="username"
                />
                <input
                  className="btn-link fw-medium bg-white position-absolute top-0 end-0 h-100"
                  type="submit"
                  defaultValue="Submit"
                  onClick={() => {
                    subscribeEmail();
                  }}
                />
              </form>

              <div className="mt-4">
                <strong className="fw-medium sub-menu__title text-uppercase mb-3">
                  Secure payments
                </strong>
                <div className="my-2 payment-options">
                  <picture>
                    <Image
                      loading="lazy"
                      width={384}
                      height={27}
                      src={paymentGateways}
                      alt="Acceptable payment gateways"
                    />
                  </picture>
                </div>
              </div>
            </div>
            {/* <!-- /.footer-column --> */}
          </div>
          {/* <!-- /.row-cols-5 --> */}
        </div>
        {/* <!-- /.footer-middle container --> */}

        <div className="footer-bottom container">
          <div className="d-block d-md-flex align-items-center">
            <span className="footer-copyright me-auto">
              Copyright © {new Date().getFullYear()} {storeEntityIds.store_name}
            </span>
            {Object.keys(storeEntityIds).length > 0 &&
              storeCurrencyDatas?.length > 0 && (
                <div className="footer-settings d-block d-md-flex align-items-center">
                  <div className="d-flex align-items-center">
                    <label
                      htmlFor="footerSettingsCurrency"
                      className="ms-md-3 me-2 text-light1"
                    >
                      Currency
                    </label>
                    {Object.keys(storeEntityIds).length > 0
                      ? storeCurrencyDatas?.length > 0 && (
                          <FormSelect
                            id="footerSettingsCurrency"
                            className="form-select form-select-sm bg-transparent border-0"
                            aria-label="Default select example"
                            name="store-language"
                            value={storeCurrencys}
                            onChange={(e) => changeCurrency(e)}
                          >
                            {storeCurrencyDatas &&
                              storeCurrencyDatas.map((e, i) => {
                                return (
                                  <option
                                    className="footer-select__option"
                                    key={i}
                                    value={e.mp_store_price}
                                  >
                                    {e.mp_store_price}
                                  </option>
                                );
                              })}
                          </FormSelect>
                        )
                      : ""}
                  </div>
                </div>
              )}
          </div>
        </div>
        {/* <!-- /.footer-bottom container --> */}
      </footer>
      {footerNavMenu?.length > 0 && (
        <div className="footer-hyperlink">
          {footerNavMenu
            ?.filter((item) =>
              item?.sub_menus?.some((sub) =>
                sub?.childs?.some(
                  (child) =>
                    !!child?.childMenuName ||
                    !jewelVertical(item.product_vertical_name)
                )
              )
            )
            .map((item, i) => {
              const capitalizeEachWord = (str) =>
                str
                  ?.split(" ")
                  ?.map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ");

              return (
                <div className="hyperlink-row" key={i}>
                  <div className="hyperlink-title">{item.menu_name}</div>

                  <div className="hyper-links">
                    <ul>
                      {item.sub_menus?.map((sub, subIndex) =>
                        sub.childs
                          ?.filter(
                            (child) =>
                              child?.childMenuName ||
                              !jewelVertical(item.product_vertical_name)
                          )
                          .map((child, childIndex) => {
                            if (child.childMenuStatus === "0") return null;

                            const validDetaills =
                              child?.detaills?.filter((d) => d.title !== "") ??
                              [];

                            if (validDetaills.length === 0) return null;

                            const diyMenus = validDetaills.filter(
                              (elm) => elm.logic_code === "DIY"
                            );
                            const petaMenus = child.detaills.filter(
                              (elm) => elm.logic_code === "DIY"
                            );

                            return (
                              <li key={`${i}-${subIndex}-${childIndex}`}>
                                {child.childMenuName && (
                                  <>
                                    <Link
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
                                          changeUrl(activChild.toLowerCase())
                                          ? "menu-active"
                                          : ""
                                      }`}
                                      href={
                                        diyMenus?.length > 0
                                          ? diyMenus[0]?.router_link
                                          : getAlias(
                                              item,
                                              item.router_link,
                                              {},
                                              child
                                            )
                                      }
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

                                        if (router.asPath === targetHref) {
                                          router.replace(targetHref);
                                          router.reload();
                                        } else {
                                          router.replace(targetHref);
                                        }

                                        if (
                                          item?.product_vertical_name === "DIY"
                                        ) {
                                          setActiveChild("");
                                          dispatch(activChildMenu(""));
                                        } else {
                                          setActiveChild(child.childMenuName);
                                          dispatch(
                                            activChildMenu(child.childMenuName)
                                          );
                                          setActiveId(item?.unique_id);
                                          dispatch(
                                            activeIdMenu(item?.unique_id)
                                          );
                                        }
                                        handleRouteData(e);
                                        if (petaMenus?.length > 0) {
                                          dispatch(DIYName(petaMenus[0].title));
                                          sessionStorage.setItem(
                                            "DIYVertical",
                                            petaMenus[0].vertical_code
                                          );
                                          allProductData(obj, petaMenus[0]);
                                        }
                                      }}
                                    >
                                      {child.childMenuName}
                                    </Link>
                                    {validDetaills.length > 0 && <span>|</span>}
                                  </>
                                )}

                                {!jewelVertical(item.product_vertical_name) &&
                                  validDetaills.map((petaMenu, m) => (
                                    <React.Fragment key={m}>
                                      <Link
                                        href={petaMenu.router_link}
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
                                              activChild?.toLowerCase()
                                            ) &&
                                          petaMenu.unique_id === activeIdMenus
                                            ? "menu-active"
                                            : ""
                                        }`}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setActiveChild(petaMenu.title);
                                          dispatch(
                                            activChildMenu(petaMenu.title)
                                          );

                                          const target = petaMenu.router_link;
                                          if (router.asPath === target) {
                                            router.replace(target);
                                            router.reload();
                                          } else {
                                            router.replace(target);
                                          }

                                          setActiveId(petaMenu.unique_id);
                                          dispatch(
                                            activeIdMenu(petaMenu.unique_id)
                                          );

                                          handleRouteData(e);
                                          dispatch(DIYName(petaMenu.title));

                                          sessionStorage.setItem(
                                            "DIYVertical",
                                            petaMenu.vertical_code
                                          );

                                          if (petaMenu.type === "1")
                                            allProductData(obj, petaMenu);
                                        }}
                                        style={{
                                          textTransform: "capitalize",
                                        }}
                                      >
                                        {petaMenu.icon && (
                                          <span
                                            className={`${petaMenu.icon} me-2 shape-icon`}
                                          />
                                        )}
                                        {capitalizeEachWord(petaMenu.title)}
                                      </Link>

                                      <span>|</span>
                                    </React.Fragment>
                                  ))}
                              </li>
                            );
                          })
                      )}
                    </ul>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
}
