"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BreadCumb from "./BreadCumb";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useContextElement } from "@/context/Context";
const itemPerRow = [2, 3, 4];

import { openModalShopFilter } from "@/utlis/aside";
import { sortingOptions } from "@/data/products/productCategories";
import { useDispatch, useSelector } from "react-redux";
import commanService, { domain } from "@/CommanService/commanService";
import Loader from "@/CommanUIComp/Loader/Loader";
import {
  activeDIYtabs,
  activeImageData,
  ActiveStepsDiy,
  allFilteredData,
  diamondDIYimage,
  diamondNumber,
  diamondPageChnages,
  DiySteperData,
  engravingObj,
  filterData,
  filteredData,
  finalCanBeSetData,
  isFilter,
  jeweleryDIYimage,
  jeweleryDIYName,
  naviGationMenuData,
  previewImageDatas,
  saveEmbossings,
  storeEmbossingData,
  storeFilteredDiamondObj,
  storeItemObject,
  storeProdData,
  storeSelectedDiamondData,
  storeSelectedDiamondPrice,
  storeSpecData,
} from "@/Redux/action";
import SkeletonModal from "@/CommanUIComp/Skeleton/SkeletonModal";
import { toast } from "react-toastify";
import {
  changeUrl,
  extractNumber,
  firstWordCapital,
  isEmpty,
  jewelVertical,
  numberWithCommas,
  perfumeVertical,
  RandomId,
  safeParse,
} from "@/CommanFunctions/commanFunctions";
import DIYSteps from "./DIYSteps";
import InfiniteScroll from "react-infinite-scroll-component";
import DIYSetupAP from "./DIYSetupAP";
import Image from "next/image";
import NotFoundImg from "@/assets/images/RecordNotfound.png";

export default function Shop1(props) {
  //State Declerations
  const isCallRef = useRef(false);
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevSlugRef = useRef(params.slug || []);
  const lastAbortController = useRef();

  // Home filter data

  const initialItemToItem = (() => {
    const saved = sessionStorage.getItem("itemToItemData");
    if (saved) {
      return JSON.parse(saved);
    }
    return null;
  })();

  const [itemToItem, setItemToItem] = useState(initialItemToItem);

  const nextStepPosition = itemToItem?.nextStepPosition;
  const combination_id = itemToItem?.combination_id;
  const diy_bom_id = itemToItem?.diy_bom_id;

  const DIYvertical = pathname?.includes("start-with-a-diamond")
    ? "JEWEL"
    : itemToItem?.verticalCode ??
      (() => {
        const diy = sessionStorage.getItem("DIYVertical");
        if (diy) {
          return diy;
        }
        return null;
      })();

  const initialFilterState = (() => {
    const saved = sessionStorage.getItem("productFilterState");
    if (saved) {
      return JSON.parse(saved);
    }
    return null;
  })();

  const [filterState, setFilterState] = useState(initialFilterState);

  //Home filter data
  const getAllFilteredHome = initialFilterState?.getAllFilteredHome;
  const dimension = initialFilterState?.dimension;
  const item_group = initialFilterState?.item_group;
  const segment = initialFilterState?.segments;
  const verticalOffer = initialFilterState?.vertical_code;
  const activeIdMenus =
    useSelector((state) => state.activeIdMenu) ||
    useSelector((state) => state.activeIdMenuMobile);
  const naviGationMenuDatas = useSelector((state) => state.naviGationMenuData);
  const storeEntityIds =
    useSelector((state) => state.storeEntityId) || props.storeEntityIds || {};
  const reduxLoginData = useSelector((state) => state.loginData);
  const reduxStoreFooterNav = useSelector((state) => state.footerNavData);
  const reduxStoreNav = useSelector((state) => state.naviGationMenuData);
  const loginDatas =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("loginData")) || reduxLoginData
      : reduxLoginData;

  const reduxStoreCurrency = useSelector((state) => state.storeCurrency);
  const storeCurrencys =
    typeof window !== "undefined"
      ? sessionStorage.getItem("storeCurrency") || reduxStoreCurrency
      : reduxStoreCurrency;
  const filterDat = useSelector((state) => state.filterData);
  const filteredDatas = useSelector((state) => state.filteredData);
  const storeItemObjects = useSelector((state) => state.storeItemObject);
  const isFilters = useSelector((state) => state.isFilter);
  const addedDiamondDatas = useSelector((state) => state.addedDiamondData);
  const storeProdDatas = useSelector((state) => state.storeSpecData);
  const DiySteperDatas = useSelector((state) => state.DiySteperData);
  const engravingAllData = useSelector((state) => state.engravingObj);
  const ActiveStepsDiys = useSelector((state) => state.ActiveStepsDiy);

  const isLogin = loginDatas && Object.keys(loginDatas).length > 0;
  const dispatch = useDispatch();

  // const [filterDatas, setFilterDatas] = useState(filterDat ?? []);
  const [loader, setLoader] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [storeSkeletonArr, setStoreSkeletonArr] = useState([]);
  const [storeFilterArr, setStoreFilterArr] = useState(filteredDatas ?? []);
  const [productDataList, setProductDataList] = useState([]);
  const [productAll, setProductAll] = useState({});
  const [totalPages, setTotalPages] = useState();
  const [orignalData, setOrignalData] = useState([]);
  const [storeItemObj, setStoreItemObj] = useState(storeItemObjects ?? {});
  const [itemsLength, setItemLength] = useState(Array.from({ length: 1 }));
  const [clickPageScroll, setClickPageScroll] = useState(false);
  const [selectedSortingValue, setSelectedSortingValue] = useState(
    storeItemObjects?.sort_by ?? ""
  );

  const [sortBy, setSortBy] = useState("");
  const [onceUpdated, setOnceUpdated] = useState(false);
  const [verticalCode, setVerticalCode] = useState(
    props.vertical_code || params.slug?.[0] || ""
  );

  const isJewelDiy = pathname?.includes("start-with-a-setting");
  const isDiamoDiy = pathname?.includes("start-with-a-diamond");
  const isItemDIY = pathname?.includes("start-with-a-item");
  const diySetupFor = isJewelDiy || isDiamoDiy || isItemDIY;
  const paramsItem = isDiamoDiy || isJewelDiy || isItemDIY ? "DIY" : "PRODUCT";

  const { toggleWishlist, isAddedtoWishlist } = useContextElement();
  const [selectedColView, setSelectedColView] = useState(4);

  //DIY stepper
  const [steps, setSteps] = useState(DiySteperDatas ?? []);
  const [activeIndex, setActiveIndex] = useState();
  const { addProductToCart, isAddedToCartProducts } = useContextElement();

  // eslint-disable-next-line no-unused-vars
  let megaMenu = {};
  let getProduct = "";
  let product_key = "offer";

  if (typeof window !== "undefined") {
    const sessionData1 = safeParse(sessionStorage.getItem("navMenuData")) || naviGationMenuDatas;
    const sessionData2 = safeParse(sessionStorage.getItem("footerNavMenuData")) || reduxStoreFooterNav;
    const storedMenus = [...sessionData1, ...sessionData2];
    if (storedMenus) {
      try {
        megaMenu = storedMenus?.filter(
          (item) =>
            item.menu_name?.replaceAll(" ", "-")?.toLowerCase() ===
          (params.slug?.[0]?.toLowerCase() ?? "make-your-customization")
        )[0] || props.fetchedData;
      } catch (e) {
        console.error("Invalid JSON in sessionStorage.megaMenus", e);
      }
    }
  }
  if (pathname?.includes("offer")) {
    getProduct = params.slug[2];
  }else{
    getProduct = ""
  }
  let vertical_code = megaMenu?.product_vertical_name ?? params?.slug?.[0];

  let title = params?.slug?.[0] ? params?.slug?.[0] : "";

  const [currency, setCurrency] = useState(storeCurrencys);

  //Currency Update
  useEffect(() => {
    if (currency !== storeCurrencys && isCallRef.current === true) {
      setCurrency(storeCurrencys);
      isCallRef.current = false;
      setOnceUpdated(false);
      setHasMore(true);
      setClickPageScroll(false);
      setItemLength(Array.from({ length: 1 }));
      window.scrollTo(0, 0);
    }
  }, [storeCurrencys]);

  //get All Product data
  let jewellerydata = [];
  const productData = useCallback(
    (obj, key, signal) => {
      // setLoader(true);
      commanService
        .postApi("/EmbeddedPageMaster", obj, signal)
        .then((res) => {
          if (res.data.success === 1) {
            const jewelData = res.data.data.resData;
            setProductDataList(res?.data?.data?.resData);
            setProductAll(res?.data?.data);
            setTotalPages(res?.data?.data?.total_pages);
            if (jewelData.length === 0) {
              setOrignalData([]);
              setHasMore(false);
              // setLoader(false);
            }
            if (key === "1" && jewelData) {
              if (jewelData.length > 0) {
                var data = [];
                jewellerydata = [];
                for (let c = 0; c < jewelData.length; c++) {
                  data.push(jewelData[c]);
                  jewellerydata.push(jewelData[c]);
                }
                setOrignalData(data);
                // setLoader(false);
              }
            } else if (key === "0" && jewelData) {
              if (jewelData.length > 0) {
                var data = [...jewellerydata];
                for (let c = 0; c < jewelData.length; c++) {
                  data.push(jewelData[c]);
                }
                jewellerydata = data;
                setOrignalData(data);
                // setLoader(false);
              }
            }
            dispatch(allFilteredData(data));
            let arr1 = [];
            for (let i = 0; i < Number(9); i++) {
              arr1.push(i);
            }
            setStoreSkeletonArr(arr1);
            setLoader(false);
            setClickPageScroll(false);
            dispatch(isFilter(false));
            setOnceUpdated(false);
          }
        })
        .catch((error) => {
          setLoader(false);
          // toast.error(error.message);
        });
    },
    [currency]
  );

  //Get Filters Data
  const getFilterItems = useCallback(() => {
    const obj = {
      SITDeveloper: "1",
      a: "GetItemSearchFiltersForJewellery",
      entity_id: storeEntityIds.entity_id,
      miniprogram_id: storeEntityIds.mini_program_id,
      secret_key: storeEntityIds.secret_key,
      tenant_id: storeEntityIds.tenant_id,
      vertical_code: diySetupFor
        ? DiySteperDatas?.filter(
            (item) => item.position === nextStepPosition
          )[0]?.vertical ?? isEmpty(DIYvertical)
        : props.vertical_code || vertical_code?.toUpperCase(),
    };
    setLoader(true);
    commanService
      .postApi("/EmbeddedPageMaster", obj)
      .then((res) => {
        if (res?.data?.success === 1) {
          const storeArr = [];
          const dimenArr = [];
          // setFilterDatas(res?.data?.data);
          setOnceUpdated(true);
          dispatch(filterData(res?.data?.data));
          const filteredArray = [...res?.data?.data];
          const dimensionArray = [];
          if (filteredArray.length > 0) {
            for (let i = 0; i < filteredArray.length; i++) {
              filteredArray[i]["selected_values"] = [];

              for (let j = 0; j < filteredArray[i]?.value?.length; j++) {
                const dataValueSlug = filteredArray[i]?.value[j]?.data_value
                  ?.split(" ")
                  ?.join("-")
                  ?.toLowerCase();
                if (params.slug?.[0] && !params.slug[2]) {
                  if (params.slug?.[0].toLowerCase() === dataValueSlug) {
                    filteredArray[i]["selected_values"].push(
                      filteredArray[i]?.value[j]?.data_key
                    );
                  }
                }

                if (params.slug?.[0] && params.slug[2]) {
                  if (params.slug[2].toLowerCase() === dataValueSlug) {
                    filteredArray[i]["selected_values"].push(
                      filteredArray[i]?.value[j]?.data_key
                    );
                  }
                }
              }
            }
            const navDatas =
              typeof window !== undefined &&
              JSON.parse(sessionStorage.getItem("navMenuData")) || reduxStoreNav;
            const navDatasFooter =
              typeof window !== undefined &&
              JSON.parse(sessionStorage.getItem("footerNavMenuData")) || reduxStoreFooterNav;
            const navAllData = [...navDatas, ...navDatasFooter]
            if (!diySetupFor) {
              if (navAllData && params.slug?.length > 1) {
                const menu = navAllData.find(
                  (item) =>
                    changeUrl(item?.menu_name)?.toLowerCase() ===
                    changeUrl(params.slug?.[0])?.toLowerCase()
                );

                menu?.sub_menus?.forEach((sub) => {
                  sub?.childs?.forEach((child) => {
                    if (
                      changeUrl(child?.childMenuName)?.toLowerCase() ===
                      changeUrl(params.slug?.[2])?.toLowerCase()
                    ) {
                      child?.detaills?.forEach((detail) => {
                        const key =
                          detail.titlesKey === "dimensions"
                            ? detail.logic_code_dimen
                            : detail.logic_code;
                        const code = detail.code;
                        if (!key) return;

                        const targetArray =
                          detail.titlesKey === "dimensions"
                            ? dimensionArray
                            : filteredArray;

                        const existingIndex = targetArray.findIndex(
                          (f) => f.fielter_key === key
                        );

                        if (existingIndex === -1) {
                          targetArray.push({
                            fielter_key: key,
                            selected_values: [code],
                            value: [
                              {
                                data_value: key,
                                data_key: code,
                                selected: 1,
                              },
                            ],
                          });
                        } else {
                          const existingItem = targetArray[existingIndex];

                          if (!existingItem.selected_values.includes(code)) {
                            existingItem.selected_values.push(code);
                          }

                          const valIndex = existingItem.value.findIndex(
                            (v) => v.data_key === code
                          );

                          if (valIndex === -1) {
                            existingItem.value.push({
                              data_key: code,
                              data_value: key,
                              selected: 1,
                            });
                          } else {
                            existingItem.value[valIndex].selected = 1;
                          }
                        }
                      });
                    }
                  });
                });
              } else if (navAllData && params.slug?.length === 1) {
                const menu = navAllData.find(
                  (item) =>
                    changeUrl(item?.menu_name)?.toLowerCase() ===
                    changeUrl(params.slug?.[0])?.toLowerCase()
                );

                const menuDetails = menu?.filter_json
                  ? safeParse(menu.filter_json)
                  : [];
                const flatMenuDetails = Array.isArray(menuDetails[0])
                  ? menuDetails.flat()
                  : menuDetails;

                flatMenuDetails.forEach((detail) => {
                  const key =
                    detail.titlesKey === "dimensions"
                      ? detail.msf_keys
                      : detail.msf_key;
                  if (!key) return;

                  const selectedValues = detail.selected_value || [];
                  const valueArray = (
                    detail.child_menu_selected_value || []
                  ).map((item) => ({
                    data_key: item.key,
                    data_value: item.value,
                    selected: selectedValues.includes(item.key) ? 1 : 0,
                  }));

                  const targetArray =
                    detail.titlesKey === "dimensions"
                      ? dimensionArray
                      : filteredArray;

                  const existingIndex = targetArray.findIndex(
                    (f) => f.fielter_key === key
                  );

                  if (existingIndex === -1) {
                    targetArray.push({
                      fielter_key: key,
                      fielter_title: detail.display_title || detail.title || "",
                      value: valueArray,
                      selected_values: selectedValues,
                    });
                  } else {
                    const existingItem = targetArray[existingIndex];

                    selectedValues.forEach((selKey) => {
                      if (!existingItem.selected_values.includes(selKey)) {
                        existingItem.selected_values.push(selKey);
                      }
                    });

                    existingItem.value = existingItem.value.map((v) => ({
                      ...v,
                      selected: selectedValues.includes(v.data_key) ? 1 : 0,
                    }));
                  }
                });
              }
            } else {
              const menu = navAllData.find(
                (item) => item.unique_id === activeIdMenus
              );
              menu?.sub_menus?.forEach((sub) => {
                sub?.childs?.forEach((child) => {
                  if (
                    pathname.includes(
                      changeUrl(child?.childMenuName?.toLowerCase())
                    )
                  ) {
                    child?.detaills?.forEach((detail) => {
                      const key =
                        detail.titlesKey === "dimensions"
                          ? detail.logic_code_dimen
                          : detail.logic_code;
                      const code = detail.code;
                      if (!key) return;

                      const targetArray =
                        detail.titlesKey === "dimensions"
                          ? dimensionArray
                          : filteredArray;

                      const existingIndex = targetArray.findIndex(
                        (f) => f.fielter_key === key
                      );

                      if (existingIndex === -1) {
                        targetArray.push({
                          fielter_key: key,
                          selected_values: [code],
                          value: [
                            {
                              data_value: key,
                              data_key: code,
                              selected: 1,
                            },
                          ],
                        });
                      } else {
                        const existingItem = targetArray[existingIndex];

                        if (!existingItem.selected_values.includes(code)) {
                          existingItem.selected_values.push(code);
                        }

                        const valIndex = existingItem.value.findIndex(
                          (v) => v.data_key === code
                        );

                        if (valIndex === -1) {
                          existingItem.value.push({
                            data_key: code,
                            data_value: key,
                            selected: 1,
                          });
                        } else {
                          existingItem.value[valIndex].selected = 1;
                        }
                      }
                    });
                  }
                });
              });
            }

            filteredArray.forEach((item) => {
              storeArr.push({
                key: item.fielter_key,
                value: item.selected_values || [],
              });
            });
            dimensionArray.forEach((item) => {
              dimenArr.push({
                key: item.fielter_key,
                value: item.selected_values || [],
              });
            });
            setStoreFilterArr(storeArr);
            setOnceUpdated(true);
            dispatch(filteredData(storeArr));
          }
          setClickPageScroll(false);
          let arr1 = [];
          for (let i = 0; i < Number(8); i++) {
            arr1.push(i);
          }
          setStoreSkeletonArr(arr1);

          const obj = {
            a: "getStoreItems",
            user_id: isLogin ? loginDatas.member_id : RandomId,
            SITDeveloper: "1",
            miniprogram_id: storeEntityIds.mini_program_id,
            tenant_id: storeEntityIds.tenant_id,
            entity_id: storeEntityIds.entity_id,
            per_page: "16",
            number: "1",
            filters: JSON.stringify(storeArr),
            diamond_params: pathname?.includes("start-with-a-diamond")
              ? JSON.stringify({
                  shape: addedDiamondDatas?.st_shape,
                  from_length: addedDiamondDatas?.st_length,
                  from_width: addedDiamondDatas?.st_width,
                  from_depth: addedDiamondDatas?.st_depth,
                })
              : "[]",
            from_price: "",
            to_price: "",
            sort_by: selectedSortingValue,
            extra_currency: storeCurrencys,
            secret_key: storeEntityIds.secret_key,
            product_diy: nextStepPosition ? "PRODUCT" : paramsItem,
            store_type: "B2C",
            dimension: dimenArr?.length > 0 ? JSON.stringify(dimenArr) : "",
            vertical_code: getAllFilteredHome ? verticalOffer : diySetupFor
              ? DiySteperDatas?.filter(
                  (item) => item.position === nextStepPosition
                )[0]?.vertical ?? isEmpty(DIYvertical)
              : (props.vertical_code || vertical_code?.toUpperCase()) ??
                isEmpty(DIYvertical),
            // vertical_code: "OIL",
            offer_code:
              isEmpty(product_key) == "offer" ? isEmpty(getProduct) : "",
          };
          if (isItemDIY) {
            obj.diy_bom_id = diy_bom_id;
            obj.combination_id = combination_id;
            obj.diy_step =
              nextStepPosition !== 0 ? isEmpty(nextStepPosition) ?? "1" : "";
            obj.diy_type = "1";
          }
          if (getAllFilteredHome) {
            obj.dimension = dimension;
            obj.item_group = item_group;
            obj.segments = segment;
          }
          setStoreItemObj(obj);
          dispatch(storeItemObject(obj));
          productData(obj, "1");
          // setLoader(false);
          // dispatch(isFilter(false));
        } else {
          // setLoader(false);
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        setLoader(false);
        // toast.error(error.message);
      });
  }, [
    hasMore,
    params,
    isFilters,
    currency,
    nextStepPosition,
    DIYvertical,
    verticalCode,
  ]);

  //Api call for Next Data with hase more
  useEffect(() => {
    if (
      filteredDatas?.length > 0 &&
      !isFilters &&
      filterDat?.length > 0 &&
      onceUpdated === false &&
      storeItemObj !== ""
    ) {
      setLoader(true);
      setClickPageScroll(true);
      setItemLength(Array.from({ length: 1 }));
      const obj = {
        ...storeItemObjects,
        extra_currency: storeCurrencys,
        page: "1",
        number: "1",
        product_diy: nextStepPosition ? "PRODUCT" : paramsItem,
        sort_by: selectedSortingValue,
        filters: JSON.stringify(filteredDatas),
        vertical_code: diySetupFor
          ? DiySteperDatas?.filter(
              (item) => item.position === nextStepPosition
            )[0]?.vertical ?? isEmpty(DIYvertical)
          : vertical_code?.toUpperCase() ?? isEmpty(DIYvertical),
      };
      if (isItemDIY) {
        obj.diy_bom_id = diy_bom_id;
        obj.combination_id = combination_id;
        obj.diy_step =
          nextStepPosition !== 0 ? isEmpty(nextStepPosition) ?? "1" : "";
        obj.diy_type = "1";
      } else {
        delete obj.diy_bom_id;
        delete obj.combination_id;
        delete obj.diy_step;
        delete obj.diy_type;
      }
      dispatch(storeItemObject(obj));
      productData(obj, "1");
      setHasMore(true);
    }
  }, [filteredDatas]);

  //Initial Api call with back and forward conditional functionality
  useEffect(() => {
    if (storeEntityIds && Object.keys(storeEntityIds)?.length === 0) return;

    const currentSlug = params.slug || [];

    const hasSlugChanged =
      currentSlug.length !== prevSlugRef.current.length ||
      currentSlug.some((seg, i) => seg !== prevSlugRef.current[i]);

    const shouldGetFilters =
      hasSlugChanged ||
      !onceUpdated ||
      Object.keys(storeItemObjects).length === 0 ||
      (vertical_code && Object.keys(storeProdDatas).length === 0) ||
      paramsItem === "DIY" ||
      (!onceUpdated &&
        vertical_code &&
        !isFilters &&
        filteredDatas.some((item) => item?.value?.length > 0) &&
        Object.keys(storeProdDatas).length === 0) ||
      currency;

    if (
      shouldGetFilters &&
      !isCallRef.current &&
      storeFilterArr?.length === 0
    ) {
      getFilterItems();
      isCallRef.current = true;
      prevSlugRef.current = currentSlug;
    }
  }, [
    params.slug,
    currency,
    vertical_code,
    nextStepPosition,
    DIYvertical,
    verticalCode,
    storeEntityIds,
    paramsItem,
  ]);

  //Update pages with has more data
  const handleChangeRow = (e) => {
    if (lastAbortController.current) {
      lastAbortController.current.abort();
    }
    const currentAbortController = new AbortController();
    lastAbortController.current = currentAbortController;
    const obj = {
      ...storeItemObj,
      filters: JSON.stringify(filteredDatas),
      number: e.toString(),
    };
    if (isItemDIY) {
      obj.diy_bom_id = diy_bom_id;
      obj.combination_id = combination_id;
      obj.diy_step =
        nextStepPosition !== 0 ? isEmpty(nextStepPosition) ?? "1" : "";
      obj.diy_type = "1";
    }
    setStoreItemObj(obj);
    dispatch(storeItemObject(obj));
    if (clickPageScroll === false) {
      setLoader(true);
      let arr1 = [];
      for (let i = 0; i < Number(8); i++) {
        arr1.push(i);
      }
      setStoreSkeletonArr(arr1);
      productData(obj, "0", currentAbortController.signal);
    }
    window.scrollTo({ top: window.scrollY, behavior: "smooth" });
  };

  //Show more Product data
  const handleShowMore = () => {
    if (totalPages) {
      const totalRows = totalPages ? totalPages : 1;
      if (itemsLength.length >= totalRows) {
        setHasMore(false);
        return;
      } else {
        setHasMore(true);
      }
      if (clickPageScroll === false) {
        setTimeout(() => {
          setItemLength(itemsLength.concat(Array.from({ length: 1 })));
          handleChangeRow(itemsLength.concat(Array.from({ length: 1 })).length);
        }, 500);
      }
      window.scrollTo({ top: window.scrollY, behavior: "smooth" });
    }
  };

  //APi call for Show more data
  const fetchPosts = useCallback(
    async (obj) => {
      if (lastAbortController.current) {
        lastAbortController.current.abort();
      }
      const currentAbortController = new AbortController();
      lastAbortController.current = currentAbortController;
      await productData(obj, "1", currentAbortController.signal);
    },
    [productData]
  );

  const onCheckSortBy = (val, e) => {
    // dispatch(filteredData([]));
    setLoader(true);
    setSelectedSortingValue(e.target.value);
    window.scrollTo(0, 0);
    let arr1 = [];
    for (let i = 0; i < Number(8); i++) {
      arr1.push(i);
    }
    setStoreSkeletonArr(arr1);
    setOrignalData([]);
    setClickPageScroll(true);
    if (e.target.value) {
      setSortBy(e.target.value);
    } else {
      setSortBy("");
    }
    setItemLength(Array.from({ length: 1 }));
    const obj = {
      ...storeItemObj,
      filters: JSON.stringify(filteredDatas),
      sort_by: e.target.value,
      number: "1",
    };
    setStoreItemObj(obj);
    dispatch(storeItemObject(obj));
    fetchPosts(obj);
    setHasMore(true);
  };

  // Handle vertical code update on URL change
  // useEffect(() => {
  //   const newVerticalCode = params.slug?.[0] || "";
  //   if (newVerticalCode !== verticalCode) {
  //     setVerticalCode(newVerticalCode);
  //     isCallRef.current = false;
  //   }
  // }, [pathname]);

  useEffect(() => {
    const currentSlug = params.slug || [];

    const hasSlugChanged =
      currentSlug.length !== prevSlugRef.current.length ||
      currentSlug.some((seg, i) => seg !== prevSlugRef.current[i]);

    if (hasSlugChanged) {
      prevSlugRef.current = currentSlug;

      setItemLength(Array.from({ length: 1 }));
      dispatch(storeProdData({}));
      if (paramsItem === "DIY") {
        dispatch(filteredData({}));
      }
      setClickPageScroll(true);
      setHasMore(true);
      setStoreSkeletonArr(Array.from({ length: 8 }, (_, i) => i));
      setOrignalData([]);
      setProductDataList([]);
      setProductAll({});
      setTotalPages("");
      setStoreItemObj({});
      dispatch(storeItemObject({}));
      dispatch(filteredData([]));

      if (currentSlug?.[2] !== undefined) {
        dispatch(isFilter(true));
        setOnceUpdated(false);
      } else {
        dispatch(filteredData([]));
        dispatch(isFilter(false));
        setOnceUpdated(true);
      }

      isCallRef.current = false;

      if (storeEntityIds && Object.keys(storeEntityIds).length > 0) {
        getFilterItems();
        isCallRef.current = true;
      }
    }
  }, [params.slug, storeEntityIds, getFilterItems]);

  // offer and engraving price plus
  const calculatePrice = (
    specificationData,
    selectedOffer,
    saveEngraving,
    SaveEmbossing,
    embossingData,
    serviceData
  ) => {
    let storeBasePrice = parseFloat(specificationData?.final_total) || 0;
    let offerPrice = 0;
    let customDuty = 0;
    let tax = 0;
    let price = 0;

    if (Array.isArray(selectedOffer) && selectedOffer.length > 0) {
      let discountValue = extractNumber(selectedOffer[0]?.discount) || 0;
      if (selectedOffer[0]?.offer_type === "FLAT") {
        offerPrice = discountValue;
      } else {
        offerPrice =
          parseFloat(((storeBasePrice * discountValue) / 100).toFixed(2)) || 0;
      }
    }

    let engravingPrice =
      saveEngraving && engravingData?.service_rate
        ? extractNumber(engravingData?.service_rate.toString()) || 0
        : 0;

    let embossingPrice =
      SaveEmbossing === true
        ? extractNumber(embossingData?.[0]?.service_rate.toString())
        : 0;

    let otherService = serviceData?.some(
      (item) => item.is_selected === true || item.is_selected === "1"
    )
      ? serviceData
          ?.filter(
            (item) => item.is_selected === true || item.is_selected === "1"
          )
          .reduce((total, item) => {
            const price = parseFloat(extractNumber(item.service_rate));
            return isNaN(price) ? total : total + price;
          }, 0)
      : 0;

    let customPer = extractNumber(specificationData?.custom_per) || 0;
    let taxPer = extractNumber(specificationData?.tax1) || 0;

    customDuty =
      parseFloat(
        (
          ((storeBasePrice -
            offerPrice +
            engravingPrice +
            embossingPrice +
            otherService) *
            customPer) /
          100
        ).toFixed(2)
      ) || 0;
    tax =
      parseFloat(
        (
          ((storeBasePrice -
            offerPrice +
            customDuty +
            engravingPrice +
            embossingPrice +
            otherService) *
            taxPer) /
          100
        ).toFixed(2)
      ) || 0;

    price =
      storeBasePrice -
      offerPrice +
      engravingPrice +
      embossingPrice +
      otherService +
      customDuty +
      tax;
    return numberWithCommas(price.toFixed(2));
  };

  //DIY Initial reset for data with required dependencies
  useEffect(() => {
    if (diySetupFor === true) {
      if (ActiveStepsDiys < DiySteperDatas?.length - 1) {
        dispatch(storeSpecData({}));
        dispatch(storeProdData({}));
      }
      dispatch(storeEmbossingData([]));
      dispatch(saveEmbossings(false));
      dispatch(previewImageDatas([]));
      dispatch(activeImageData([]));
      dispatch(engravingObj({}));

      if (
        (isEmpty(
          typeof window !== "undefined" && sessionStorage.getItem("DIYVertical")
        ) === "" &&
          DIYvertical === null &&
          paramsItem === "DIY" &&
          isDiamoDiy == false) ||
        (isEmpty(
          typeof window !== "undefined" && sessionStorage.getItem("DIYVertical")
        ) === "" &&
          DIYvertical !== null &&
          paramsItem === "DIY" &&
          isDiamoDiy === false)
      ) {
        dispatch(DiySteperData([]));
        dispatch(ActiveStepsDiy(0));
        router.push("/make-your-customization");
      }

      if (
        (isItemDIY === true &&
          perfumeVertical(DIYvertical) !== true &&
          DiySteperDatas?.length === 0) ||
        ((isJewelDiy === true || isDiamoDiy === true) &&
          DiySteperDatas?.length > 0) ||
        (isJewelDiy === true && jewelVertical(DIYvertical) !== true) ||
        (isDiamoDiy === true && jewelVertical(DIYvertical) !== true)
      ) {
        dispatch(DiySteperData([]));
        dispatch(ActiveStepsDiy(0));
        router.push("/make-your-customization");
      }
    }
  }, [diySetupFor, params, isDiamoDiy, isJewelDiy, isItemDIY]);

  //Add to cart
  const handleAddProductToCart = (data) => {
    let updatedImageDataList = [];

    data?.image_types.forEach((type, index) => {
      if (type !== "Video" && type !== "360 View") {
        let parsedEmbossingArea = data.image_area?.[index];
        if (typeof parsedEmbossingArea === "string") {
          try {
            parsedEmbossingArea = JSON.parse(parsedEmbossingArea);
          } catch (e) {
            // console.error("Error parsing embossingArea:", e);
          }
        }
        updatedImageDataList.push({
          type: type,
          url: data?.image_urls[index] || "",
          area: parsedEmbossingArea,
          price: data?.service_data?.filter(
            (item) =>
              item.service_code === "EMBOSSING" &&
              item.service_type === "Special"
          )?.[0]?.service_rate,
          currency: data?.service_data?.filter(
            (item) =>
              item.service_code === "EMBOSSING" &&
              item.service_type === "Special"
          )?.[0]?.msrv_currency,
          embImage: "",
          embImageArea: {
            left: 20,
            top: 20,
            width: 50,
            height: 50,
          },
          widthInInches: null,
          heightInInches: null,
          binaryFile: null,
        });
      }
    });

    // setActiveImg(updatedImageDataList.filter(item => item.area !== ""));
    const initServiceData = data.service_data.map((item) => ({
      ...item,
      is_selected: false,
    }));
    const services = [];
    initServiceData.forEach((element) => {
      const serviceItem = {
        text: "",
        type: "",
        image: "",
        is_selected: element.is_selected,
        currency: element?.msrv_currency,
        price: element?.service_rate,
        font_size: element?.font_size,
        min_character: element?.min_character,
        max_character: element?.max_character,
        unique_id: element?.service_unique_id,
        service_code: element?.service_code,
        service_name: element?.service_name,
        service_type: element?.service_type,
      };

      if (
        element?.service_code == "ENGRAVING" &&
        element.service_type === "Special"
      ) {
        serviceItem.type = "";
        serviceItem.text = "";
        serviceItem.is_selected = "0";
      }

      if (
        element?.service_code == "EMBOSSING" &&
        element.service_type === "Special"
      ) {
        serviceItem.image = updatedImageDataList.filter(
          (item) => item.area !== ""
        );
        serviceItem.is_selected =
          updatedImageDataList
            .filter((item) => item.area !== "")
            .some((img) => img?.embImage !== "") == true
            ? "1"
            : "0";
      }

      data.service_data
        .filter((item) => item.service_type === "Normal")
        .forEach((ele) => {
          if (ele.service_unique_id == element?.service_unique_id) {
            serviceItem.is_selected = "0";
          }
        });
      services.push(serviceItem);
    });
    data.service_json = services;
    addProductToCart(data);
  };

  return (
    <main className="page-wrapper">
      {loader && <Loader />}
      <div className="mb-4 pb-lg-3"></div>
      <section className="shop-main container">
        {paramsItem === "DIY" && !isItemDIY ? (
          <DIYSteps product_type="Product" calculatePrice={calculatePrice} />
        ) : null}
        {paramsItem === "DIY" && isItemDIY ? (
          <DIYSetupAP
            product_type="Product"
            calculatePrice={calculatePrice}
            steps={steps}
            setActiveIndex={setActiveIndex}
          />
        ) : null}
        <div className="d-flex justify-content-between pb-md-2">
          <div className="breadcrumb mb-0 d-none d-md-block flex-grow-1">
            <BreadCumb /> {diySetupFor ? `(${productAll?.total_rows})` : ""}
            {!diySetupFor && (
              <div className="d-flex justify-content-start pb-2">
                <p className="fs-18 text-capitalize fw-medium my-1">
                  {params.slug?.[params.slug.length - 1]
                    ? firstWordCapital(
                        params.slug?.[params.slug.length - 1]
                          ?.split("-")
                          ?.slice(0)
                          ?.join(" ")
                      )
                    : ""}{" "}
                  ({productAll?.total_rows})
                </p>
              </div>
            )}
          </div>
          <div className="shop-acs d-flex align-items-center justify-content-between justify-content-md-end flex-grow-1">
            <select
              className="shop-acs__select form-select w-auto border-0 py-0 order-1 order-md-0"
              aria-label="Sort Items"
              name="total-number"
              value={selectedSortingValue}
              onChange={(e) => {
                onCheckSortBy("", e);
              }}
            >
              {sortingOptions.map((option, index) => (
                <option
                  key={index}
                  value={option.value}
                  className="text-capitalize"
                >
                  {option.label}
                </option>
              ))}
            </select>

            {/* <div className="shop-asc__seprator mx-3 bg-light d-none d-md-block order-md-0"></div> */}

            {/* <div className="col-size align-items-center order-1 d-none d-lg-flex">
              <span className="text-uppercase fw-medium me-2">View</span>
              {itemPerRow.map((elm, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColView(elm)}
                  className={`btn-link fw-medium me-2 js-cols-size ${
                    selectedColView == elm ? "btn-link_active" : ""
                  } `}
                >
                  {elm}
                </button>
              ))}
            </div> */}
            {/* <!-- /.col-size --> */}
            {filteredDatas?.length > 0 && (
              <>
                <div className="shop-asc__seprator mx-3 bg-light d-none d-lg-block order-md-1"></div>

                <div className="shop-filter d-flex align-items-center order-0 order-md-3">
                  <button
                    className="btn-link btn-link_f d-flex align-items-center ps-0 js-open-aside"
                    onClick={openModalShopFilter}
                  >
                    <svg width="18" height="18" aria-hidden="true">
                      <use xlinkHref="#icon_sort_filter"></use>
                    </svg>

                    <span className="text-uppercase fw-medium d-inline-block align-middle ps-1">
                      Filter
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {/* <!-- /.d-flex justify-content-between --> */}
        <InfiniteScroll
          className={`products-grid row row-cols-1 row-cols-md-3 row-cols-lg-${selectedColView}`}
          id="products-grid"
          dataLength={orignalData?.length}
          next={handleShowMore}
          hasMore={hasMore}
          scrollThreshold={0.7}
          loader={
            loader === true && (
              <SkeletonModal
                page="product"
                storeSkeletonArr={storeSkeletonArr}
              />
            )
          }
        >
          {orignalData?.length > 0
            ? orignalData?.map((elm, i) => {
                // var megaMenu =
                //   typeof window !== "undefined" &&
                //     JSON.parse(sessionStorage.getItem("megaMenus")
                // ).navigation_data?.filter(
                //   (item) => item.product_vertical_name === elm.vertical_code
                // )[0];
                return (
                  <div key={i} className="product-card-wrapper">
                    <div className="product-card mb-3 mb-md-4">
                      <div className="pc__img-wrapper">
                        <Swiper
                          className="shop-list-swiper   swiper-container swiper-initialized swiper-horizontal swiper-backface-hidden background-img js-swiper-slider"
                          slidesPerView={1}
                          modules={[Navigation]}
                          lazy={"true"}
                          navigation={{
                            prevEl: ".prev" + i,
                            nextEl: ".next" + i,
                          }}
                        >
                          {/* {elm?.image_urls?.map((elm2, i) => ( */}
                          <SwiperSlide key={i} className="swiper-slide">
                            <Link
                              onClick={() => {
                                if (
                                  pathname?.includes("start-with-a-diamond")
                                ) {
                                  dispatch(filteredData(filteredDatas));
                                  dispatch(activeDIYtabs("Jewellery"));
                                } else {
                                  dispatch(filteredData(filteredDatas));
                                  dispatch(activeDIYtabs("Jewellery"));
                                  sessionStorage.setItem(
                                    "routerPath",
                                    router.asPath
                                  );
                                }
                              }}
                              href={
                                pathname?.includes("start-with-a-diamond")
                                  ? `/make-your-customization/start-with-a-diamond/jewellery/${changeUrl(
                                      `${
                                        elm.product_name +
                                        "-" +
                                        elm.variant_unique_id
                                      }`
                                    )}`
                                  : pathname?.includes("start-with-a-item")
                                  ? `/make-your-customization/start-with-a-item/${changeUrl(
                                      `${
                                        elm.product_name +
                                        "-" +
                                        elm.variant_unique_id
                                      }`
                                    )}`
                                  : pathname?.includes("start-with-a-setting")
                                  ? `${pathname}/${changeUrl(
                                      `${
                                        elm.product_name +
                                        "-" +
                                        elm.variant_unique_id
                                      }`
                                    )}`
                                  : `/products/${params?.slug?.[0]?.toLowerCase()}/${changeUrl(
                                      `${
                                        elm.product_name +
                                        "-" +
                                        elm.variant_unique_id
                                      }`
                                    )}`
                              }
                              refresh="true"
                            >
                              <Image
                                src={elm?.image_urls[0]}
                                width={330}
                                height={400}
                                loading="lazy"
                                // quality={100}
                                // unoptimized={true}
                                alt={`${elm.product_name}-${i}`}
                                className="pc__img"
                              />
                              {elm?.image_urls?.length > 1 ? (
                                <picture>
                                  <Image
                                    src={elm?.image_urls[1]}
                                    width={330}
                                    height={400}
                                    loading="lazy"
                                    // quality={100}
                                    // unoptimized={true}
                                    className="pc__img pc__img-second"
                                    alt={`${elm.product_name}-${i}`}
                                  />
                                </picture>
                              ) : (
                                ""
                              )}
                            </Link>
                          </SwiperSlide>
                          {/* ))} */}

                          <span
                            className={`cursor-pointer pc__img-prev ${
                              "prev" + i
                            } `}
                          >
                            <svg
                              width="7"
                              height="11"
                              viewBox="0 0 7 11"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <use href="#icon_prev_sm" />
                            </svg>
                          </span>
                          <span
                            className={`cursor-pointer pc__img-next ${
                              "next" + i
                            } `}
                          >
                            <svg
                              width="7"
                              height="11"
                              viewBox="0 0 7 11"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <use href="#icon_next_sm" />
                            </svg>
                          </span>
                        </Swiper>
                        {/* {paramsItem !== "DIY" && (
                          <button
                            className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside"
                            onClick={() => handleAddProductToCart(elm)}
                            title={
                              isAddedToCartProducts(elm.item_id)
                                ? "Already Added"
                                : "Add to Cart"
                            }
                          >
                            {isAddedToCartProducts(elm.item_id)
                              ? "Already Added"
                              : "Add To Cart"}
                          </button>
                        )} */}
                      </div>

                      <div className="pc__info position-relative">
                        {/* <p className="pc__category">
                          {elm.jewellery_product_type_name}
                        </p> */}
                        <h2 className="pc__title">
                          <Link
                            href={
                              pathname?.includes("start-with-a-diamond")
                                ? `/make-your-customization/start-with-a-diamond/jewellery/${changeUrl(
                                    `${
                                      elm.product_name +
                                      "-" +
                                      elm.variant_unique_id
                                    }`
                                  )}`
                                : pathname?.includes("start-with-a-item")
                                ? `/make-your-customization/start-with-a-item/${changeUrl(
                                    `${
                                      elm.product_name +
                                      "-" +
                                      elm.variant_unique_id
                                    }`
                                  )}`
                                : pathname?.includes("start-with-a-setting")
                                ? `${pathname}/${changeUrl(
                                    `${
                                      elm.product_name +
                                      "-" +
                                      elm.variant_unique_id
                                    }`
                                  )}`
                                : `/products/${params?.slug?.[0]?.toLowerCase()}/${changeUrl(
                                    `${
                                      elm.product_name +
                                      "-" +
                                      elm.variant_unique_id
                                    }`
                                  )}`
                            }
                          >
                            {elm.product_name}
                          </Link>
                        </h2>
                        <div className="product-card__price d-flex align-items-center">
                          {elm.coupon_code ? (
                            <>
                              {" "}
                              <span className="money price price-sale pe-2 fs-18">
                                {elm.currency_symbol} {elm.final_total_display}
                              </span>
                              <span className="money price price-old">
                                {elm.currency_symbol} {numberWithCommas(extractNumber(elm.origional_price.toString()).toFixed(2))}
                              </span>
                            </>
                          ) : (
                            <span className="money price">
                              {elm.currency_symbol} {elm.final_total_display}
                            </span>
                          )}
                        </div>

                        <button
                          className={`pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist ${
                            isAddedtoWishlist(elm?.item_id) ? "active" : ""
                          }`}
                          onClick={() => toggleWishlist(elm)}
                          title="Add To Wishlist"
                          aria-label="Add To Wishlist"
                        >
                          <svg
                            width="20"
                            height="20"
                            aria-hidden="true"
                            className="wishlist-icon"
                            fill="currentColor"
                          >
                            <use
                              xlinkHref={
                                isAddedtoWishlist(elm.item_id)
                                  ? "#icon_heart_fill"
                                  : "#icon_heart"
                              }
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            : loader === false &&
              orignalData?.length === 0 && (
                <div className="d-flex justify-content-center w-100">
                  <Image
                    src={NotFoundImg}
                    loading="lazy"
                    width={500}
                    height={500}
                    alt="Record Not found"
                  />
                </div>
              )}
        </InfiniteScroll>
      </section>
    </main>
  );
}
