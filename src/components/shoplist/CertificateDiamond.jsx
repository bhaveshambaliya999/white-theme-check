"use client";
import {
  changeUrl,
  extractNumber,
  firstWordCapital,
  isEmpty,
  jewelVertical,
  numberWithCommas,
  perfumeVertical,
  RandomId,
} from "@/CommanFunctions/commanFunctions";
import commanService from "@/CommanService/commanService";
import { Tooltip as ReactTooltip } from "react-tooltip";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useContextElement } from "@/context/Context";
import SkeletonModal from "@/CommanUIComp/Skeleton/SkeletonModal";
import { Slider } from "@mui/material";
import Select from "react-select";
import {
  activeDIYtabs,
  ActiveStepsDiy,
  caratVlaues,
  diamondNumber,
  diamondPageChnages,
  diamondSelectShape,
  dimaondColorType,
  DiySteperData,
  sectionDataListsProduct,
  stepperDIY,
  storeActiveFilteredData,
  storeFilteredData,
  storeFilteredDiamondObj,
} from "@/Redux/action";
import Loader from "@/CommanUIComp/Loader/Loader";
import BreadCumb from "./BreadCumb";
import { sortingOptions } from "@/data/products/productCategories";
import Skeleton from "react-loading-skeleton";
import CertificateDiamondDetails from "./CertificateDiamondDetails";
import DIYSteps from "./DIYSteps";
import InfiniteScroll from "react-infinite-scroll-component";
import { LazyLoadImage } from "react-lazy-load-image-component";
import NotFoundImg from "@/assets/images/RecordNotfound.png";
import Image from "next/image";
import { useRouter } from "next/router";

export default function CertificateDiamond(props) {
  //State declarations
  const $ = window.$;
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const reduxLoginData = useSelector((state) => state.loginData);

  const loginDatas =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("loginData")) || reduxLoginData
      : reduxLoginData;

  const storeFilteredValuess = useSelector(
    (state) => state.storeFilteredValues
  );
  const storeActiveFilteredDatas = useSelector(
    (state) => state.storeActiveFilteredData
  );
  const reduxStoreCurrency = useSelector((state) => state.storeCurrency);
  const storeCurrencys =
    typeof window !== "undefined"
      ? sessionStorage.getItem("storeCurrency") || reduxStoreCurrency
      : reduxStoreCurrency;

  const caratVlauess = useSelector((state) => state.caratVlaues);
  const diamondNumbers = useSelector((state) => state.diamondNumber);
  const storeDiamondNumbers = useSelector((state) => state.storeDiamondNumber);
  const engravingAllData = useSelector((state) => state.engravingObj);
  const dimaondColorTypes = useSelector((state) => state.dimaondColorType);
  const DiySteperDatas = useSelector((state) => state.DiySteperData);
  const lastAbortController = useRef();
  const {
    isAddedToCartProducts,
    isAddedtoWishlist,
    toggleWishlist,
    addProductToCart,
    cartProducts,
  } = useContextElement();

  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const isLogin = Object.keys(loginDatas).length > 0;
  const [selectedColView, setSelectedColView] = useState(4);
  const [storeSkeletonArr, setStoreSkeletonArr] = useState([]);
  // Pagination
  const [page, setPage] = useState("16");
  const [pgValue, setPgvalue] = useState();
  const [count, setCount] = useState("1");
  const [totalPages, setTotalPages] = useState();
  const [totalRows, setTotalRows] = useState();
  const [pageRange, setPageRange] = useState();
  const [selectedSortingValue, setSelectedSortingValue] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Toast
  const [loader, setLoading] = useState(false);
  const [toastShow, setToastOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Infinite Scroll
  const [itemsLength, setItemLength] = useState(Array.from({ length: 1 }));
  const [hasMore, setHasMore] = useState(true);
  const [skeletonLoader, setSkeletonLoader] = useState(false);
  const [favLoader, setFavLoader] = useState({});
  const [favStopClick, setFavStopClick] = useState(false);

  // One time Update
  let [onceUpdated, setOnceUpdated] = useState(false);

  // carat
  const [caratValue, setCaratValue] = useState(caratVlauess ?? []);
  const [caratValueDiy, setCaratValueDiy] = useState([]);
  const [caratInputFrom, setCaratInputFrom] = useState(caratValue[0] ?? "");
  const [caratInputTo, setCaratInputTo] = useState(caratValue[1] ?? "");

  const [maxValueCarat, setMaxValueCarat] = useState(0);
  const [caratArrayLabel, setCaratArrayLabel] = useState([]);

  // Diamond Data
  const [parameterDataList, setParameterDataList] = useState({});
  const [diamondDataList, setDiamondDataList] = useState({});
  const [diamondAllDataList, setDiamondAllDataList] = useState([]);

  // Diamond List Obj
  const [getEmbededDiamondObj, setEmbededDiamondObj] = useState({});
  const [clickPageScroll, setClickPageScroll] = useState(false);
  const [productId, setProductId] = useState(null);

  // Filter values
  let [storeFilteredValues, setStoreFilteredValues] = useState(
    storeFilteredValuess ?? {}
  );
  const [activeFilter, setActiveFilter] = useState({});
  const [labelsForRangeBar, setLabelsForRangeBar] = useState({});
  const [minMaxValueRangeBar, setMinMaxValueRangeBar] = useState(
    storeActiveFilteredDatas ?? {}
  );
  const [valueLength, setValueLength] = useState({});
  let [diamondDetailsPage, setDiamondDetailsPage] = useState([]);
  const [showDiamondDetails, setShowDiamondDetails] = useState(false);
  const [clarityRange, setClarityRange] = useState([]);
  const [clarityRangeDiy, setClarityRangeDiy] = useState([]);
  const [colorRange, setColorRange] = useState([]);
  const [colorRangeDiy, setColorRangeDiy] = useState([]);

  const [selectedValue, setSelectedValue] = useState([]);
  // Set Timer
  let [timer, setTimer] = useState(null);

  //DIY
  const [DiyDiamondData, setDIYDiamondData] = useState([]);

  // List & Grid View
  const [view, setView] = useState(true);
  const itemPerRow = [2, 3, 4];

  // Table Hover Data Changes
  const [mouseOverDetailList, setMouseOverDetailList] = useState({});

  //currecy update
  const [currency, setCurrency] = useState(storeCurrencys);

  // Diamond DropDowan Filter
  const [colorDropDown, setColorDropDown] = useState([]);

  const [colorType, setColorType] = useState("White");

  useEffect(() => {
    if (storeCurrencys) {
      setCurrency(storeCurrencys);
      setShowDiamondDetails(false);
      setOnceUpdated(false);
      setClickPageScroll(false);
      setItemLength(Array.from({ length: 1 }));
      window.scrollTo(0, 0);
    }
  }, [storeCurrencys]);

  // URL
  const isJewelDiy = pathname.includes("start-with-a-setting");
  const isDiamoDiy = pathname.includes("start-with-a-diamond");
  const isItemDIY = pathname.includes("start-with-a-item");
  var paramsItem = isDiamoDiy || isJewelDiy ? "DIY" : "PRODUCT";
  if (isEmpty(props.paramsItem) != "") {
    paramsItem = "DIY";
  }
  //query params
  // const getQueryParams = (url) => {
  //   const paramss = new URLSearchParams(url.search);
  //   return paramss.get('details');
  // };
  // const id = getQueryParams(location);
  const id = searchParams.get("details");
  const regex = /(\d+)$/;
  const certiNumber = id?.match(regex)[0];

  // Props value
  var getVerticalCode =
    pathname.includes("certificate-") || pathname.includes("natural-certifi")
      ? "DIAMO"
      : pathname.includes("lab-grown-certified") ||
        pathname.includes("lab-grown-diamond")
      ? "LGDIA"
      : pathname.includes("start-with-a-diamond")
      ? sessionStorage.getItem("DIYVertical")
      : "GEDIA";
  if (isEmpty(props.element) != "") {
    getVerticalCode = props.element.vertical_code;
  }
  // Local Storage & sessionStorage
  const homeFilters =
    typeof window !== "undefined" && sessionStorage.getItem("collection");
  const getItemCode = params.slug?.[params.slug?.length - 1];

  const megaMenu = JSON.parse(
    typeof window !== "undefined" && sessionStorage.getItem("megaMenus")
  );
  const moduleName = isEmpty(
    isEmpty(megaMenu) == "" ? [] : megaMenu.navigation_data
  );

  //Meta
  var seoDataMenu = JSON.parse(
    sessionStorage.getItem("megaMenus")
  )?.navigation_data?.filter(
    (item) => item.product_vertical_name === getVerticalCode
  )[0];
  const metaConfig = {
    title: `${seoDataMenu?.seo_titles}`,
    description: `${seoDataMenu?.seo_description}`,
    keywords: `${seoDataMenu?.seo_keyword}`,
    url: window.location.href,
  };

  // Table Header
  const [columns, setColumns] = useState([
    {
      id: "",
      title: paramsItem === "DIY" ? "Set" : "",
    },
    {
      id: "",
      title: "Add To Cart",
    },
    {
      id: "st_stock_id",
      title: "Stock Id",
    },
    {
      id: "st_shape",
      title: "Shape",
    },
    {
      id: "st_size",
      title: "Carat",
    },
    {
      id: "st_cla",
      title: "Clarity",
    },
    {
      id: "st_color_type",
      title: "Colour",
    },
    {
      id: "st_cut",
      title: "Cut",
    },
    {
      id: "st_flou",
      title: "Fluroscene",
    },
    {
      id: "st_lab",
      title: "Certificate",
    },
    {
      id: "ex_store_price_display",
      title: "Price",
    },
  ]);

  var diamondDatas = [];

  //get diamond listing data
  const diamondListData = useCallback((obj, key, signal) => {
    // setLoading(true);
    commanService
      .postApi("/EmbeddedPageMaster", obj, signal)
      .then((res) => {
        if (res.data.success === 1) {
          setPgvalue(res?.data?.data?.pg_value?.toString().split(" - ")[1]);
          setTotalPages(res.data.data.total_pages);
          setTotalRows(res?.data?.data?.total_rows);
          setPageRange(res?.data?.data?.pg_value);
          setDIYDiamondData(res.data.data.rowData);
          if (Object.keys(res.data.data).length > 0) {
            const Diadatas = res.data.data.rowData;
            if (Diadatas.length === 0) {
              setMouseOverDetailList({});
              setDiamondAllDataList([]);
            }
            if (Diadatas.length < 16) {
              setHasMore(false);
            }
            if (key === "1") {
              if (Diadatas.length > 0) {
                setMouseOverDetailList(Diadatas[0]);
                var data = [];
                diamondDatas = [];
                for (let c = 0; c < Diadatas.length; c++) {
                  data.push(Diadatas[c]);
                  diamondDatas.push(Diadatas[c]);
                }
                setDiamondAllDataList([...data]);
              }
            } else if (key === "0") {
              if (Diadatas.length > 0) {
                setMouseOverDetailList(Diadatas[0]);
                var data = [...diamondDatas];
                for (let c = 0; c < Diadatas.length; c++) {
                  data.push(Diadatas[c]);
                }
                diamondDatas = data;
                setDiamondAllDataList([...data]);
              }
            }
            var rowData = res.data.data.rowData;
            if (isEmpty(rowData) == "") {
              rowData = [];
            }
            if (isEmpty(props.element) != "") {
              for (let c = 0; c < props.element.no_of_stone_array.length; c++) {
                if (
                  props.element.no_of_stone_array[c].sequence ==
                  props.element.no_of_stone_sequence
                ) {
                  var stock_id = isEmpty(
                    props.element.no_of_stone_array[c].st_stock_id
                  );
                }
              }

              for (let c = 0; c < rowData.length; c++) {
                if (rowData[c]["st_stock_id"] == stock_id) {
                  rowData[c]["checked"] = "true";
                }
                for (let d = 0; d < props.can_be_set.length; d++) {
                  if (
                    props.can_be_set[d].vertical_code == "DIAMO" ||
                    props.can_be_set[d].vertical_code == "GEDIA" ||
                    props.can_be_set[d].vertical_code == "LGDIA"
                  ) {
                    var datas = props.can_be_set[d]["no_of_stone_array"];
                    for (let e = 0; e < datas.length; e++) {
                      if (datas[e].set_stone == "1") {
                        if (datas[e]["st_stock_id"] == rowData[c].st_stock_id) {
                          rowData[c]["selected"] = "true";
                          rowData[c]["checked"] = "true";
                        }
                      }
                    }
                  }
                }
              }
              res.data.data.rowData = rowData;
            }
            setDiamondDataList(res.data.data);
            setLoading(false);
            setTimeout(() => {
              setSkeletonLoader(false);
            });
          } else {
            setLoading(false);
            setStoreSkeletonArr([]);
            setSkeletonLoader(false);
          }
          if (homeFilters !== null) {
            sessionStorage.removeItem("collection");
          }
        } else {
          setToastOpen(true);
          setSkeletonLoader(false);
          setIsSuccess(false);
          setToastMsg(res.data.message);
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  //get diamond filter data
  const diamondParamsData = useCallback(
    (objToGetShapes, object1) => {
      commanService
        .postApi("/EmbeddedPageMaster", objToGetShapes)
        .then((res) => {
          if (res.data.success === 1) {
            dispatch(activeDIYtabs("Diamond"));
            sessionStorage.setItem("storeUrl", pathname);
            const DataFilter = res.data.data;
            if (Object.keys(DataFilter).length > 0) {
              // color dropdown
              const dropdownKeys = [
                "Fancy Color",
                "Fancy Intensity",
                "Fancy Overtone",
              ];
              const colorDropDownData = [];
              dropdownKeys.forEach((key) => {
                const data = DataFilter[key] || [];
                if (data?.length) {
                  data.forEach((item) => {
                    item.value = item.dp_parameters_code;
                    item.label = item.dp_parameters_name;
                  });
                }
                colorDropDownData.push({ keyName: key, data });
              });
              setColorDropDown(colorDropDownData);
              setParameterDataList(DataFilter);
              setDiamondAllDataList([]);
              var datas = [];
              let caratMaxArr = [];

              for (const [key, value] of Object.entries(DataFilter)) {
                activeFilter[key] = {};
                let storePosition = [];
                let nameArr = [];
                value.length > 0 &&
                  value.map((e, i) => {
                    let obj1 = {
                      value: i,
                      label:
                        key === "Size Group"
                          ? e.dp_parameters_name.replace("CT", "")
                          : e.dp_parameters_name,
                    };
                    nameArr.push(obj1);
                    if (key === "Size Group") {
                      const caratArr = e.dp_parameters_code.split("-");
                      caratArr.map((c) => {
                        caratMaxArr.push(parseFloat(c));
                      });
                    }
                    if (key === "Size Group") {
                      if (caratMaxArr.length > 0) {
                        setMaxValueCarat(Math.max(...caratMaxArr));
                        setCaratArrayLabel([
                          { value: 0.0, label: (0.0).toString() },
                          {
                            value: Math.max(...caratMaxArr),
                            label: Math.max(...caratMaxArr).toString(),
                          },
                        ]);
                        setCaratValue([
                          Math.min(...caratMaxArr),
                          Math.max(...caratMaxArr),
                        ]);
                        dispatch(
                          caratVlaues([
                            Math.min(...caratMaxArr),
                            Math.max(...caratMaxArr),
                          ])
                        );
                      }
                    }
                    if (isEmpty(homeFilters) === "") {
                      if (isEmpty(getItemCode) !== "") {
                        const UrlName = getItemCode.split(",");
                        UrlName.length > 0 &&
                          UrlName.map((u) => {
                            if (key === "Size Group") {
                              if (u === e.dp_parameters_name.toLowerCase()) {
                                storePosition.push(e.dp_position);
                                activeFilter[key][e.dp_parameters_code] = true;
                                setTimeout(() => {
                                  caratMaxArr = [];
                                  const caratArr = e.dp_parameters_name
                                    .replace("CT", "")
                                    .split("-");
                                  caratArr.map((c) => {
                                    caratMaxArr.push(parseFloat(c));
                                  });
                                  setCaratValue([
                                    Math.min(...caratMaxArr),
                                    Math.max(...caratMaxArr),
                                  ]);
                                  dispatch(
                                    caratVlaues([
                                      Math.min(...caratMaxArr),
                                      Math.max(...caratMaxArr),
                                    ])
                                  );
                                });
                              }
                            } else {
                              if (
                                u.replace("-", " ") ===
                                e.dp_parameters_name.toLowerCase() && key !== "Stone Type"
                              ) {
                                if(key === "Shape" && pathname.includes("/shape")){
                                  storePosition.push(e.dp_parameters_code);
                                  activeFilter[key][e.dp_parameters_code] = true;
                                }else{
                                  storePosition.push(e.dp_parameters_code);
                                  activeFilter[key][e.dp_parameters_code] = true;
                                  if (key === "Size Group") {
                                    setTimeout(() => {
                                      caratMaxArr = [];
                                      const caratArr = e.dp_parameters_name
                                        .replace("CT", "")
                                        .split("-");
                                      caratArr.map((c) => {
                                        caratMaxArr.push(parseFloat(c));
                                      });
                                      setCaratValue([
                                        Math.min(...caratMaxArr),
                                        Math.max(...caratMaxArr),
                                      ]);
                                      dispatch(
                                        caratVlaues([
                                          Math.min(...caratMaxArr),
                                          Math.max(...caratMaxArr),
                                        ])
                                      );
                                    }, 1000);
                                  } else if (
                                    key === "Color" &&
                                    pathname.includes(u)
                                  ) {
                                    if (
                                      u.replace("-", "") ===
                                      e.dp_parameters_code.toLowerCase()
                                    ) {
                                      storePosition.push(e.dp_parameters_code.toUpperCase());
                                      activeFilter[key][
                                        e.dp_parameters_code
                                      ] = true;
                                    }
                                  } else if (
                                    key === "Fancy Color" &&
                                    pathname.includes("/color") &&
                                    getItemCode && getVerticalCode !== "GEDIA"
                                  ) {
                                    setColorType("Fancy");
                                    dispatch(dimaondColorType("Fancy"));
                                    const code = getItemCode.replace("-", "").toUpperCase();
  
                                    setSelectedValue((prev) => {
                                      const current = prev["Fancy Color"] || [];
                                      const updated = current?.includes(code)
                                        ? current
                                        : [...current, code];
                                      return { ...prev, "Fancy Color": updated };
                                    });
  
                                    setStoreFilteredValues((prev) => ({
                                      ...prev,
                                      "Fancy Color": [code],
                                    }));
  
                                    storePosition.push(code);
                                    activeFilter[key][code] = true;
  
                                    setColorType("Fancy");
                                    dispatch(dimaondColorType("Fancy"));
                                  }
                                }
                              }else if(key === "Stone Type" && getVerticalCode === "GEDIA" && u.replace("-", " ") ===
                                e.dp_parameters_name.toLowerCase()){
                                storePosition.push(e.dp_parameters_code);
                                activeFilter[key][e.dp_parameters_code] = true;
                              }
                            }
                            setActiveFilter(activeFilter);
                            return u;
                          });
                        storeFilteredValues[key] = storePosition;
                        setStoreFilteredValues(storeFilteredValues);
                        setActiveFilter(activeFilter);
                      }
                    } else if (homeFilters !== null) {
                      const UrlName = homeFilters.split(",");
                      UrlName.length > 0 &&
                        UrlName.map((u) => {
                          if (key === "Shape") {
                            if (
                              u.replace("-", " ") ===
                              e.dp_parameters_code.toLowerCase()
                            ) {
                              storePosition.push(e.dp_parameters_code);
                              activeFilter[key][e.dp_parameters_code] = true;
                              if (key === "Size Group") {
                                setTimeout(() => {
                                  caratMaxArr = [];
                                  const caratArr = e.dp_parameters_name
                                    .replace("CT", "")
                                    .split("-");
                                  caratArr.map((c) => {
                                    caratMaxArr.push(parseFloat(c));
                                  });
                                  setCaratValue([
                                    Math.min(...caratMaxArr),
                                    Math.max(...caratMaxArr),
                                  ]);
                                  dispatch(
                                    caratVlaues([
                                      Math.min(...caratMaxArr),
                                      Math.max(...caratMaxArr),
                                    ])
                                  );
                                }, 1000);
                              }
                            }
                          }
                          setActiveFilter(activeFilter);
                          return u;
                        });
                      storeFilteredValues[key] = storePosition;
                      setStoreFilteredValues(storeFilteredValues);
                      setActiveFilter(activeFilter);
                    } else {
                      if (key === "Size Group") {
                        if (caratMaxArr.length > 0) {
                          setCaratValue([
                            Math.min(...caratMaxArr),
                            Math.max(...caratMaxArr),
                          ]);
                          dispatch(
                            caratVlaues([
                              Math.min(...caratMaxArr),
                              Math.max(...caratMaxArr),
                            ])
                          );
                        }
                      }
                    }
                    return e;
                  });

                if (value.length > 0) {
                  valueLength[key] = value.length - 1;
                  setValueLength(valueLength);
                  minMaxValueRangeBar[key] = [
                    storeActiveFilteredDatas?.[key]?.[0] ?? 0,
                    storeActiveFilteredDatas?.[key]?.[1] ?? nameArr.length - 1,
                  ];
                  setMinMaxValueRangeBar(minMaxValueRangeBar);
                } else {
                  valueLength[key] = 0;
                  setValueLength(valueLength);
                  minMaxValueRangeBar[key] = [0, 0];
                  setMinMaxValueRangeBar(minMaxValueRangeBar);
                }
                labelsForRangeBar[key] = nameArr;
                setLabelsForRangeBar(labelsForRangeBar);
              }

              var Shape = DataFilter["Shape"];
              var Sizegrp = DataFilter["Size Group"];
              var Color = DataFilter["Color"];
              var stone_types = DataFilter["Stone Type"];
              var Clarity = DataFilter["Clarity"];
              // var Polish = DataFilter['Polish'];

              if (paramsItem !== "DIY") {
                for (let d = 0; d < Shape.length; d++) {
                  Shape[d]["visible"] = "true";
                }
                for (let d = 0; d < stone_types.length; d++) {
                  stone_types[d]["visible"] = "true";
                }
                for (let d = 0; d < Color.length; d++) {
                  Color[d]["visible"] = "true";
                }
                for (let d = 0; d < stone_types.length; d++) {
                  stone_types[d]["visible"] = "true";
                }
                for (let d = 0; d < Clarity.length; d++) {
                  Clarity[d]["visible"] = "true";
                }
                // for (let d = 0; d < Polish.length; d++) {
                //     Polish[d]['visible'] = 'true';
                // }
                for (let d = 0; d < Shape.length; d++) {
                  Shape[d]["Sizegrp"] = "true";
                }
                DataFilter["Shape"] = Shape;
                DataFilter["Size Group"] = Sizegrp;
                DataFilter["Color"] = Color;
                DataFilter["Stone Type"] = stone_types;
                DataFilter["Clarity"] = Clarity;
                // DataFilter['Polish'] = Polish;
                setParameterDataList(DataFilter);
              }

              if (isEmpty(props.element) != "") {
                var element_shapes = props.element["details"]["shape"];
                var element_color = props.element["color"];
                var element_stone_types = props.element["stone_types"];
                var element_clarity = props.element["clarity"];
                // var element_polish = props.element['polish'];
                var final_array = [];
                var final_array2 = [];
                var display = [];
                var ShapePostion = [];
                let storePositionSize = [];
                let storePositionColor = [];
                let storePositionstone_types = [];
                let storePositionClarity = [];
                // let storePositionPolish = [];
                var colorSlider = [];
                var claritySlider = [];
                // var polishSlider = [];
                for (let c = 0; c < element_stone_types.length; c++) {
                  for (let d = 0; d < stone_types.length; d++) {
                    if (element_stone_types[c].stone_type == stone_types[d].dp_parameters_code) {
                      // stone_types[d]["visible"] = "true";
                      activeFilter["Stone Type"][stone_types[d].dp_parameters_code] = true;
                      // display.push(stone_types[d].dp_parameters_code);
                      storePositionstone_types.push(stone_types[d].dp_parameters_code);
                      storeFilteredValues["Stone Type"] = storePositionstone_types;
                    }
                  }
                }
                for (let c = 0; c < element_shapes.length; c++) {
                  for (let d = 0; d < Shape.length; d++) {
                    if (element_shapes[c].key == Shape[d].dp_parameters_code) {
                      Shape[d]["visible"] = "true";
                      activeFilter["Shape"][Shape[d].dp_parameters_code] = true;
                      display.push(Shape[d].dp_parameters_code);
                      ShapePostion.push(Shape[d].dp_parameters_code);
                      storeFilteredValues["Shape"] = ShapePostion;
                    }
                  }
                }

                caratMaxArr = [];
                for (let c = 0; c < display.length; c++) {
                  var element_sizegrp = props.element["details"][display[c]];
                  for (let d = 0; d < element_sizegrp.length; d++) {
                    for (let e = 0; e < Sizegrp.length; e++) {
                      if (
                        Sizegrp[e].dp_parameters_code == element_sizegrp[d].key
                      ) {
                        var data =
                          props.element["details"]["LWD"][display[c]][
                            element_sizegrp[d].key
                          ];
                        var datas = {
                          shape: display[c],
                          from_length: data.from_length,
                          from_width: data.from_width,
                          from_depth: data.from_depth,
                          from_mm: data.from_mm,
                        };
                        final_array2.push(datas);
                        final_array.push(datas);
                        Sizegrp[e]["visible"] = "true";
                        activeFilter["Size Group"][
                          Sizegrp[e].dp_position
                        ] = true;
                        storePositionSize.push(Sizegrp[e].dp_position);
                        storeFilteredValues["Size Group"] = storePositionSize;
                      }
                    }
                    const caratArr = element_sizegrp[d].value
                      .replace("CT", "")
                      .split("-");
                    caratArr.map((c) => {
                      caratMaxArr.push(parseFloat(c));
                    });
                    setCaratValue([
                      Math.min(...caratMaxArr),
                      Math.max(...caratMaxArr),
                    ]);
                    setCaratValueDiy([
                      Math.min(...caratMaxArr),
                      Math.max(...caratMaxArr),
                    ]);
                    dispatch(
                      caratVlaues([
                        Math.min(...caratMaxArr),
                        Math.max(...caratMaxArr),
                      ])
                    );
                  }
                }
                for (let c = 0; c < display.length; c++) {
                  var data = props.element["details"]["LWD"][display[c]];
                  //eslint-disable-next-line
                  for (const [key, value] of Object.entries(data)) {
                    final_array.push({
                      shape: display[c],
                      from_length: value.from_length,
                      from_width: value.from_width,
                      from_depth: value.from_depth,
                      from_mm: value.from_mm,
                    });
                  }
                }
                for (let c = 0; c < element_color.length; c++) {
                  for (let d = 0; d < Color.length; d++) {
                    if (isEmpty(props.selectedColor) == "") {
                      if (element_color[c] == Color[d].dp_parameters_code) {
                        Color[d]["visible"] = "true";
                        activeFilter["Color"][
                          Color[d].dp_parameters_code
                        ] = true;
                        storePositionColor.push(Color[d].dp_parameters_code);
                        storeFilteredValues["Color"] = storePositionColor;
                      }
                    } else {
                      if (props.selectedColor == Color[d].dp_parameters_code) {
                        Color[d]["visible"] = "true";
                        activeFilter["Color"][
                          Color[d].dp_parameters_code
                        ] = true;
                        storePositionColor.push(Color[d].dp_parameters_code);
                        storeFilteredValues["Color"] = storePositionColor;
                      }
                    }
                  }
                  if (labelsForRangeBar["Color"].length > 0) {
                    for (
                      let b = 0;
                      b < labelsForRangeBar["Color"].length;
                      b++
                    ) {
                      if (
                        labelsForRangeBar["Color"][b].label === element_color[c]
                      ) {
                        colorSlider.push(labelsForRangeBar["Color"][b].value);
                      }
                    }
                    if (colorSlider.length > 0) {
                      minMaxValueRangeBar["Color"] = [
                        Math.min(...colorSlider),
                        Math.max(...colorSlider),
                      ];
                      setMinMaxValueRangeBar(minMaxValueRangeBar);
                      setColorRange([
                        Math.min(...colorSlider),
                        Math.max(...colorSlider),
                      ]);
                      setColorRangeDiy([
                        Math.min(...colorSlider),
                        Math.max(...colorSlider),
                      ]);
                    }
                  }
                }

                for (let c = 0; c < element_clarity.length; c++) {
                  for (let d = 0; d < Clarity.length; d++) {
                    if (element_clarity[c] == Clarity[d].dp_parameters_code) {
                      Clarity[d]["visible"] = "true";
                      activeFilter["Clarity"][
                        Clarity[d].dp_parameters_code
                      ] = true;
                      storePositionClarity.push(Clarity[d].dp_parameters_code);
                      storeFilteredValues["Clarity"] = storePositionClarity;
                    }
                  }
                  if (labelsForRangeBar["Clarity"].length > 0) {
                    for (
                      let b = 0;
                      b < labelsForRangeBar["Clarity"].length;
                      b++
                    ) {
                      if (
                        labelsForRangeBar["Clarity"][b].label ===
                        element_clarity[c]
                      ) {
                        claritySlider.push(
                          labelsForRangeBar["Clarity"][b].value
                        );
                      }
                    }
                    if (claritySlider.length > 0) {
                      minMaxValueRangeBar["Clarity"] = [
                        Math.min(...claritySlider),
                        Math.max(...claritySlider),
                      ];
                      setMinMaxValueRangeBar(minMaxValueRangeBar);
                      setClarityRange([
                        Math.min(...claritySlider),
                        Math.max(...claritySlider),
                      ]);
                      setClarityRangeDiy([
                        Math.min(...claritySlider),
                        Math.max(...claritySlider),
                      ]);
                    }
                  }
                }
                for (let c = 0; c < element_stone_types.length; c++) {
                    for (let d = 0; d < stone_types.length; d++) {
                        if (element_stone_types[c] == stone_types[d].dp_parameters_code) {
                            stone_types[d]['visible'] = 'true';
                            activeFilter['stone_types'][stone_types[d].dp_parameters_code] = true;
                            storePositionstone_types.push(stone_types[d].dp_parameters_code);
                            storeFilteredValues['stone_types'] = storePositionstone_types;
                        }
                    }
                }
                setStoreFilteredValues(storeFilteredValues);
                setActiveFilter(activeFilter);
                DataFilter["Shape"] = Shape;
                DataFilter["Size Group"] = Sizegrp;
                DataFilter["Color"] = Color;
                DataFilter["Clarity"] = Clarity;
                DataFilter["Stone Type"] = stone_types;
                // DataFilter['Polish'] = Polish;

                setParameterDataList(DataFilter);
              }

              setTimeout(() => {
                if (paramsItem === "DIY") {
                  let abc = {
                    ...object1,
                    json:
                      final_array?.length > 0
                        ? JSON.stringify(final_array)
                        : "",
                    shape:
                      storeFilteredValues.Shape !== undefined
                        ? storeFilteredValues.Shape.toString()
                        : "",
                    color: storeFilteredValues.Color
                      ? storeFilteredValues?.Color.toString()
                      : "",
                    clarity: storeFilteredValues.Clarity
                      ? storeFilteredValues?.Clarity.toString()
                      : "",
                    stone_type: storeFilteredValues?.["Stone Type"]
                        ? storeFilteredValues?.["Stone Type"].toString()
                        : "",
                    // polish: storeFilteredValues.Polish ? storeFilteredValues?.Polish.toString() : "",
                    // carat_group: storeFilteredValues["Size Group"]
                    //   ? storeFilteredValues["Size Group"].toString()
                    //   : "",
                    carat_group: "",
                    carat_min: Math.min(...caratMaxArr).toString(),
                    carat_max: Math.max(...caratMaxArr).toString(),
                  };
                  setEmbededDiamondObj(abc);
                  diamondListData(abc, "1");
                } else {
                  let abc = {
                    ...object1,
                    json: "",
                    shape:
                      storeFilteredValues.Shape !== undefined
                        ? storeFilteredValues.Shape.toString()
                        : "",
                        stone_type: storeFilteredValues?.["Stone Type"]
                        ? storeFilteredValues?.["Stone Type"].toString()
                        : "",
                    // carat_group:
                    //   storeFilteredValues["Size Group"] !== undefined
                    //     ? storeFilteredValues["Size Group"].toString()
                    //     : "",
                    carat_group: "",
                    carat_min:
                      caratValue[0]?.toString() ??
                      Math.min(...caratMaxArr).toString(),
                    carat_max:
                      caratValue[1]?.toString() ??
                      Math.max(...caratMaxArr).toString(),
                  };
                  setEmbededDiamondObj(abc);
                  diamondListData(abc, "1");
                }
              });
            }
          } else {
            setLoading(false);
            setToastOpen(true);
            setIsSuccess(false);
            setToastMsg(res.data.message);
            diamondListData(object1, "1");
          }
        })
        .catch(() => {
          setLoading(false);
          diamondListData(object1, "1");
        });
    },
    [
      paramsItem,
      dispatch,
      diamondListData,
      activeFilter,
      storeFilteredValues,
      labelsForRangeBar,
      minMaxValueRangeBar,
      valueLength,
      currency,
    ]
  );

  //Initial call for Initial state update
  const initiallyRenderFunction = useCallback(() => {
    if (Object.keys(storeEntityIds).length > 0) {
      if (!onceUpdated) {
        window.scrollTo(0, 0);
        setEmbededDiamondObj({});
        let arr = [];
        for (let i = 0; i < Number(8); i++) {
          arr.push(i);
        }
        setStoreSkeletonArr(arr);
        setOnceUpdated(true);
      }
    }
  }, [storeEntityIds, onceUpdated]);

  //State updates based on dependencies
  useEffect(() => {
    setDiamondAllDataList([]);
    if (isEmpty(getItemCode) !== "") {
      setDiamondDetailsPage({});
      setStoreFilteredValues({});
      setOnceUpdated(false);
      setItemLength(Array.from({ length: 1 }));
    }

    if (getVerticalCode || storeCurrencys) {
      setOnceUpdated(false);
      setItemLength(Array.from({ length: 1 }));
      handleReset();
    }
  }, [paramsItem, getItemCode, getVerticalCode]);

  //Initial call for diamond filter
  useEffect(() => {
    if (Object.keys(storeEntityIds).length > 0) {
      if (!showDiamondDetails) {
        if (!onceUpdated) {
          setLoading(true);
          setEmbededDiamondObj({});
          // setCaratValue([]);
          dispatch(caratVlaues([]));
          setOnceUpdated(true);
          setSkeletonLoader(true);
          setCount(1);
          const obj = {
            a: "GetEmbeddedPageDiamondListData",
            shape: storeFilteredValuess.Shape?.toString() ?? "",
            // carat_group: storeFilteredValuess["Size Group"]?.toString() ?? "",
            carat_group: "",
            carat_min: caratValue[0] ? caratValue[0].toString() : "",
            carat_max: caratValue[1] ? caratValue[1].toString() : "",
            clarity: storeFilteredValuess.Clarity?.toString() ?? "",
            cut: storeFilteredValuess.Cut?.toString() ?? "",
            color: storeFilteredValuess.Color?.toString() ?? "",
            symmetry: storeFilteredValuess.Symmetry?.toString() ?? "",
            certificate: storeFilteredValuess.Certificate?.toString() ?? "",
            polish: storeFilteredValuess.Polish?.toString() ?? "",
            fluorescence: storeFilteredValuess.Fluorescence?.toString() ?? "",
            fancy_color: pathname.includes("/color") ? getItemCode.toString() : storeFilteredValuess["Fancy Color"]?.toString() ?? "",
            stone_type: storeFilteredValuess?.["Stone Type"]
                        ? storeFilteredValuess?.["Stone Type"].toString()
                        : "",
            fancy_intensity:
            storeFilteredValuess["Fancy Intensity"]?.toString() ?? "",
            fancy_overtone:
              storeFilteredValuess["Fancy Overtone"]?.toString() ?? "",
            color_type: pathname.includes("/color") ? "Fancy" : colorType,
            price_min: "",
            price_max: "",
            json: "",
            extra_currency: storeCurrencys,
            stock_id: "",
            per_page: "16",
            page_no: "1",
            entity_id: storeEntityIds.entity_id,
            tenant_id: storeEntityIds.tenant_id,
            SITDeveloper: "1",
            store_id: storeEntityIds.mini_program_id,
            item_id: "",
            secret_key: storeEntityIds.secret_key,
            certificate_no: "",
            store_type: "B2C",
            user_id: isLogin ? storeEntityIds.member_id : RandomId,
            vertical_code: getVerticalCode,
          };
          setEmbededDiamondObj(obj);
          const objToGetShapes = {
            a: "GetDiamondSettingList",
            entity_id: storeEntityIds.entity_id,
            tenant_id: storeEntityIds.tenant_id,
            mini_program_id: storeEntityIds.mini_program_id,
            business_unit_id: storeEntityIds.business_unit_id,
            customer_id: storeEntityIds.customer_id,
            SITDeveloper: "1",
            secret_key: storeEntityIds.secret_key,
            vertical_code: getVerticalCode,
          };
          diamondParamsData(objToGetShapes, obj);
          dispatch(activeDIYtabs("Diamond"));

          const newArr = [...columns];
          let colArr = [];
          if (paramsItem === "DIY") {
            colArr = newArr.filter((e) => e.title !== "Add To Cart");
          } else {
            colArr = newArr.filter((e) => e.title !== "Set");
          }
          setColumns(colArr);
        }
      } else {
        if (getItemCode != "cart" && getItemCode != "whishlist") {
          // dispatch(diamondPageChnages(false));
          // setShowDiamondDetails(false)
        }
      }
    }
  }, [
    storeEntityIds,
    getItemCode,
    diamondListData,
    paramsItem,
    getVerticalCode,
    diamondParamsData,
    onceUpdated,
    loginDatas,
    isLogin,
  ]);

  //Initial Render function
  useEffect(() => {
    if (!showDiamondDetails) {
      initiallyRenderFunction();
    } else {
      if (getItemCode != "cart" && getItemCode != "whishlist") {
        // setShowDiamondDetails(false)
        dispatch(diamondPageChnages(false));
      }
    }
  }, [initiallyRenderFunction]);

  //apply filter
  const caratInputChange = (e, val) => {
    const inputValue = Number(e.target.value);
    if (val === "From") {
      if (Number(inputValue) <= Number(maxValueCarat)) {
        setCaratInputFrom(inputValue);
        setCaratValue([inputValue, caratValue[1]]);
        dispatch(caratVlaues([inputValue, caratValue[1]]));
      } else {
        setCaratInputFrom(caratInputFrom);
      }
    } else {
      if (Number(inputValue) <= Number(maxValueCarat)) {
        setCaratInputTo(inputValue);
        setCaratValue([caratValue[0], inputValue]);
        dispatch(caratVlaues([caratValue[0], inputValue]));
      } else {
        setCaratInputTo(caratInputTo);
      }
    }
  };

  //Apply filter other then slider
  const applyFilters = (title, filterValue, position) => {
    setLoading(true);
    setHasMore(true);
    setClickPageScroll(false);
    setItemLength(Array.from({ length: 1 }));
    setCount(1);
    setDiamondAllDataList([]);
    diamondDatas = [];
    activeFilter[title][filterValue] = !activeFilter[title][filterValue];
    setActiveFilter(activeFilter);

    let arr1 = [];
    arr1 =
      isEmpty(storeFilteredValues[title]) !== ""
        ? storeFilteredValues[title]
        : [];
    if (
      storeFilteredValues[title] &&
      storeFilteredValues[title].includes(position)
    ) {
      const index = storeFilteredValues[title].indexOf(position);
      if (index > -1) {
        storeFilteredValues[title].splice(index, 1);
      }
    } else {
      arr1.push(position);
    }
    storeFilteredValues[title] = arr1;
    setStoreFilteredValues(storeFilteredValues);
    const obj = {
      ...getEmbededDiamondObj,
      shape: storeFilteredValues.Shape
        ? storeFilteredValues?.Shape.toString()
        : "",
      stone_type: storeFilteredValues["Stone Type"]
                  ? storeFilteredValues["Stone Type"].toString()
                  : "",
      // carat_group: storeFilteredValues["Size Group"]
      //   ? storeFilteredValues["Size Group"]?.toString()
      //   : "",
      carat_group: "",
      carat_min: caratValue[0] ? caratValue[0].toString() : "",
      carat_max: caratValue[1] ? caratValue[1].toString() : "",
      clarity: storeFilteredValues.Clarity
        ? storeFilteredValues?.Clarity?.toString()
        : "",
      cut: storeFilteredValues.Cut ? storeFilteredValues?.Cut?.toString() : "",
      color: storeFilteredValues.Color
        ? storeFilteredValues.Color?.toString()
        : "",
      symmetry: storeFilteredValues.Symmetry
        ? storeFilteredValues?.Symmetry?.toString()
        : "",
      certificate: storeFilteredValues.Certificate
        ? storeFilteredValues?.Certificate?.toString()
        : "",
      polish: storeFilteredValues.Polish
        ? storeFilteredValues?.Polish?.toString()
        : "",
      fluorescence: storeFilteredValues.Fluorescence
        ? storeFilteredValues?.Fluorescence?.toString()
        : "",
      fancy_color: storeFilteredValues["Fancy Color"]
        ? storeFilteredValues["Fancy Color"]?.toString()
        : "",
      fancy_intensity: storeFilteredValues["Fancy Intensity"]
        ? storeFilteredValues["Fancy Intensity"].toString()
        : "",
      fancy_overtone: storeFilteredValues["Fancy Overtone"]
        ? storeFilteredValues["Fancy Overtone"].toString()
        : "",
      page_no: "1",
    };
    setEmbededDiamondObj(obj);
    dispatch(storeFilteredDiamondObj(obj));
    diamondListData(obj, "1");
  };

  //Apply slider filter
  const applyFilterSlider = (title, arr, minValue, maxValue) => {
    setHasMore(true);
    setClickPageScroll(false);
    setItemLength(Array.from({ length: 1 }));
    setCount(1);
    setDiamondAllDataList([]);
    diamondDatas = [];
    if (title === "Size Group") {
      setCaratValue([minValue, maxValue]);
      dispatch(caratVlaues([minValue, maxValue]));
      var sizeGroup = [];
      arr.map((v) => {
        var newArr = v.dp_parameters_code.split("-");
        if (
          minValue < parseFloat(newArr[1]) &&
          maxValue > parseFloat(newArr[0])
        ) {
          sizeGroup.push(v.dp_position);
        }
      });
      storeFilteredValues[title] = sizeGroup;
    } else {
      const newArr = arr.slice(minValue, maxValue + 1);
      let arrPosition = [];
      newArr.map((e) => {
        arrPosition.push(e.dp_parameters_code);
        return e;
      });
      let arr1 = [];
      arr1 =
        isEmpty(storeFilteredValues[title]) !== ""
          ? storeFilteredValues[title]
          : [];
      arr1 = [];
      arr1.push(arrPosition.toString());
      storeFilteredValues[title] = arr1;
    }
    setStoreFilteredValues(storeFilteredValues);
    const obj = {
      ...getEmbededDiamondObj,
      shape: storeFilteredValues.Shape
        ? storeFilteredValues?.Shape.toString()
        : "",
      // carat_group: storeFilteredValues["Size Group"]
      //   ? storeFilteredValues["Size Group"].toString()
      //   : "",
      carat_group: "",
      carat_min:
        title === "Size Group" ? minValue.toString() : caratValue[0].toString(),
      carat_max:
        title === "Size Group" ? maxValue.toString() : caratValue[1].toString(),
      clarity: storeFilteredValues.Clarity
        ? storeFilteredValues?.Clarity?.toString()
        : "",
      cut: storeFilteredValues.Cut ? storeFilteredValues?.Cut?.toString() : "",
      color: storeFilteredValues.Color
        ? storeFilteredValues.Color?.toString()
        : "",
      symmetry: storeFilteredValues.Symmetry
        ? storeFilteredValues?.Symmetry?.toString()
        : "",
      certificate: storeFilteredValues.Certificate
        ? storeFilteredValues?.Certificate?.toString()
        : "",
      polish: storeFilteredValues.Polish
        ? storeFilteredValues?.Polish?.toString()
        : "",
      fluorescence: storeFilteredValues.Fluorescence
        ? storeFilteredValues?.Fluorescence?.toString()
        : "",
      fancy_color: storeFilteredValues["Fancy Color"]
        ? storeFilteredValues["Fancy Color"]?.toString()
        : "",
      fancy_intensity: storeFilteredValues["Fancy Intensity"]
        ? storeFilteredValues["Fancy Intensity"].toString()
        : "",
      fancy_overtone: storeFilteredValues["Fancy Overtone"]
        ? storeFilteredValues["Fancy Overtone"].toString()
        : "",
      page_no: "1",
    };
    setEmbededDiamondObj(obj);
    dispatch(storeFilteredDiamondObj(obj));
    setLoading(true);
    diamondListData(obj, "1");
  };

  //Changes Dropdown Color options
  const changeDropdownColor = (ele, e, index) => {
    const filteredData = storeFilteredValues;
    filteredData[ele.keyName] = e.map((childEle) => childEle.value);
    setSelectedValue(filteredData);
    setStoreFilteredValues(filteredData);
    const obj = {
      ...getEmbededDiamondObj,
      shape: storeFilteredValues.Shape
        ? storeFilteredValues?.Shape.toString()
        : "",
      // carat_group: storeFilteredValues["Size Group"]
      //   ? storeFilteredValues["Size Group"].toString()
      //   : "",
      carat_group: "",
      carat_min: caratValue[0] ? caratValue[0].toString() : "",
      carat_max: caratValue[1] ? caratValue[1].toString() : "",
      clarity: storeFilteredValues.Clarity
        ? storeFilteredValues?.Clarity?.toString()
        : "",
      cut: storeFilteredValues.Cut ? storeFilteredValues?.Cut?.toString() : "",
      color: storeFilteredValues.Color
        ? storeFilteredValues.Color?.toString()
        : "",
      symmetry: storeFilteredValues.Symmetry
        ? storeFilteredValues?.Symmetry?.toString()
        : "",
      certificate: storeFilteredValues.Certificate
        ? storeFilteredValues?.Certificate?.toString()
        : "",
      polish: storeFilteredValues.Polish
        ? storeFilteredValues?.Polish?.toString()
        : "",
      fluorescence: storeFilteredValues.Fluorescence
        ? storeFilteredValues?.Fluorescence?.toString()
        : "",
      fancy_color: storeFilteredValues["Fancy Color"]
        ? storeFilteredValues["Fancy Color"]?.toString()
        : "",
      fancy_intensity: storeFilteredValues["Fancy Intensity"]
        ? storeFilteredValues["Fancy Intensity"].toString()
        : "",
      fancy_overtone: storeFilteredValues["Fancy Overtone"]
        ? storeFilteredValues["Fancy Overtone"].toString()
        : "",
      page_no: "1",
    };
    setEmbededDiamondObj(obj);
    dispatch(storeFilteredDiamondObj(obj));
    setLoading(true);
    setHasMore(true);
    setItemLength(Array.from({ length: 1 }));
    diamondListData(obj, "1");
  };

  //On Change color type
  const changeColorType = (value) => {
    setColorType(value);
    dispatch(dimaondColorType(value));
    if (value === "White") {
      storeFilteredValues["Fancy Color"] = [];
      storeFilteredValues["Fancy Intensity"] = [];
      storeFilteredValues["Fancy Overtone"] = [];
      setStoreFilteredValues(storeFilteredValues);
    } else if (value === "Fancy") {
      storeFilteredValues["Color"] = [];
      minMaxValueRangeBar["Color"] = [0, valueLength["Color"]];
      setMinMaxValueRangeBar(minMaxValueRangeBar);
      setStoreFilteredValues(storeFilteredValues);
    }
    const obj = {
      ...getEmbededDiamondObj,
      shape: storeFilteredValues.Shape
        ? storeFilteredValues?.Shape.toString()
        : "",
      // carat_group: storeFilteredValues["Size Group"]
      //   ? storeFilteredValues["Size Group"].toString()
      //   : "",
      carat_group: "",
      carat_min: caratValue[0] ? caratValue[0].toString() : "",
      carat_max: caratValue[1] ? caratValue[1].toString() : "",
      clarity: storeFilteredValues.Clarity
        ? storeFilteredValues?.Clarity?.toString()
        : "",
      cut: storeFilteredValues.Cut ? storeFilteredValues?.Cut?.toString() : "",
      color: storeFilteredValues.Color
        ? storeFilteredValues.Color?.toString()
        : "",
      symmetry: storeFilteredValues.Symmetry
        ? storeFilteredValues?.Symmetry?.toString()
        : "",
      certificate: storeFilteredValues.Certificate
        ? storeFilteredValues?.Certificate?.toString()
        : "",
      polish: storeFilteredValues.Polish
        ? storeFilteredValues?.Polish?.toString()
        : "",
      fluorescence: storeFilteredValues.Fluorescence
        ? storeFilteredValues?.Fluorescence?.toString()
        : "",
      fancy_color: storeFilteredValues["Fancy Color"]
        ? storeFilteredValues["Fancy Color"]?.toString()
        : "",
      fancy_intensity: storeFilteredValues["Fancy Intensity"]
        ? storeFilteredValues["Fancy Intensity"].toString()
        : "",
      fancy_overtone: storeFilteredValues["Fancy Overtone"]
        ? storeFilteredValues["Fancy Overtone"].toString()
        : "",
      page_no: "1",
      color_type: value,
    };
    setEmbededDiamondObj(obj);
    dispatch(storeFilteredDiamondObj(obj));
    setLoading(true);
    setTotalPages("");
    setItemLength(Array.from({ length: 1 }));
    setHasMore(true);
    diamondListData(obj, "1");
  };

  //Handle show more onchange update
  const handleChangeRow = (e) => {
    if (lastAbortController.current) {
      lastAbortController.current.abort();
    }
    const currentAbortController = new AbortController();
    lastAbortController.current = currentAbortController;
    const obj = {
      ...getEmbededDiamondObj,
      page_no: e.toString(),
    };
    setEmbededDiamondObj(obj);
    if (clickPageScroll === false) {
      diamondListData(obj, "0", currentAbortController.signal);
    }
  };

  //Show more Diamonds
  const handleShowMore = () => {
    if (view === true && totalPages) {
      const totalRowss = totalPages ? totalPages : 1;
      let counts = count;

      if (itemsLength.length >= totalRowss) {
        setHasMore(false);
        setClickPageScroll(true);
        return;
      } else {
        setHasMore(true);
        setClickPageScroll(false);
      }
      if (clickPageScroll === false) {
        counts++;
        setCount(counts);
        setTimeout(() => {
          setItemLength(itemsLength.concat(Array.from({ length: 1 })));
          handleChangeRow(itemsLength.concat(Array.from({ length: 1 })).length);
        }, 500);
      }
    }
  };

  //fetch Posts for Show more products
  const fetchPosts = useCallback(
    async (obj) => {
      if (lastAbortController.current) {
        lastAbortController.current.abort();
      }
      const currentAbortController = new AbortController();
      lastAbortController.current = currentAbortController;
      await diamondListData(obj, "1");
    },
    [diamondListData]
  );

  //Sorting
  const onCheckSortBy = (val, e) => {
    // dispatch(filteredData([]));
    setSelectedSortingValue(e.target.value);
    window.scrollTo(0, 0);
    let arr1 = [];
    for (let i = 0; i < Number(8); i++) {
      arr1.push(i);
    }
    setStoreSkeletonArr(arr1);
    setDiamondAllDataList([]);
    if (e.target.value) {
      setSortBy(e.target.value);
    } else {
      setSortBy("");
    }
    setItemLength(Array.from({ length: 1 }));
    const obj = {
      ...getEmbededDiamondObj,
      sort_by: e.target.value,
      page_no: "1",
    };
    setEmbededDiamondObj(obj);
    fetchPosts(obj);
  };

  //Show table view
  const showTableView = () => {
    // setLoading(true);
    setView(false);
    setPage(16);
    setCount(1);
    const obj = { ...getEmbededDiamondObj, per_page: 16, page_no: "1" };
    setEmbededDiamondObj(obj);
    diamondListData(obj, "1");
  };

  //Load More data
  const handleViewChange = () => {
    setView(true);
    setLoading(true);
    setItemLength(Array.from({ length: 1 }));
    setDiamondAllDataList([]);
    setCount(1);
    const obj = { ...getEmbededDiamondObj, per_page: 16, page_no: "1" };
    setEmbededDiamondObj(obj);
    diamondListData(obj, "1");
  };

  //hover row
  const tableDiamondHover = (data, i) => {
    setMouseOverDetailList(data);
  };

  //Onchange Pagination show more data
  const onChangePagination = (event) => {
    setLoading(true);
    setPage(event.target.value);
    setCount(1);
    const obj = {
      ...getEmbededDiamondObj,
      per_page: event.target.value,
      page_no: "1",
    };
    setEmbededDiamondObj(obj);
    diamondListData(obj, "0");
  };

  //Onclick Pagination
  const paginationLeftRight = (value) => {
    if (count >= 1 || count < totalPages) {
      let counts = count;
      if (value === "left") {
        if (counts > 1) {
          counts--;
          setCount(counts);
          setLoading(true);
        }
      } else {
        if (count < totalPages) {
          counts++;
          setCount(counts);
          setLoading(true);
        } else {
          return;
        }
      }
      const obj = {
        ...getEmbededDiamondObj,
        page_no: counts,
      };
      setEmbededDiamondObj(obj);
      diamondListData(obj, "0");
    } else {
      return null;
    }
  };

  //diamond detail
  const diamondDetailPage = (e) => {
    var data = {
      st_cert_no: e.st_cert_no,
      vertical_code: getVerticalCode,
      checked: e.checked,
      shapeName: e.shape_name,
      color_type: colorType,
    };
    setDiamondDetailsPage(data);
    setShowDiamondDetails(true);
    dispatch(diamondPageChnages(true));
    dispatch(diamondNumber(e.st_cert_no));
    dispatch(diamondSelectShape(data));
    if (!pathname.includes("start-with-a")) {
      router.push(
        `${router.asPath}?details=${e.product_name
          ?.replaceAll(" ", "-")
          ?.toLowerCase()}-${e.st_cert_no}`
      );
    }
    // if (location.pathname.includes("/start-with-a-diamond")) {
    //     dispatch(storeFilteredData(storeFilteredValues))
    // }
  };

  //Reset
  const handleReset = () => {
    setColorType("White");
    setSelectedValue([]);
    dispatch(dimaondColorType("White"));
    dispatch(storeFilteredDiamondObj({}));
    dispatch(caratVlaues([]));
    dispatch(storeActiveFilteredData({}));
    dispatch(storeFilteredData({}));
    dispatch(diamondNumber(""));
    setParameterDataList({});
    setDiamondDataList({});
    setOnceUpdated(false);
    setEmbededDiamondObj({});
    setDiamondAllDataList([]);
    setHasMore(true);
    setClickPageScroll(false);
    setItemLength(Array.from({ length: 1 }));
    setCount(1);
    setDiamondAllDataList([]);
    setStoreFilteredValues({});
    setCaratValue([]);
    setShowDiamondDetails(false);
    sessionStorage.setItem(
      "storeUrl",
      getVerticalCode === "DIAMO"
        ? "/certificate-diamond"
        : getVerticalCode === "LGDIA"
        ? "/lab-grown-diamond"
        : "/lab-grown-gemstone"
    );
    initiallyRenderFunction();
  };

  //DIY
  const setStone = (element) => {
    if (typeof props.handleSetStone === "function") {
      props.handleSetStone(element);
      if (props.complete === true) {
        if (typeof props.handleComplete() === "function") {
          props.handleComplete();
          return;
        }
      }
    }
    var data = props.element["details"][element.st_shape];
    for (let c = 0; c < data?.length; c++) {
      var key = data[c].key.split("-");
      if (
        Number(key[0]) <= Number(element.st_size) &&
        Number(key[1]) >= Number(element.st_size)
      ) {
        props.element["combination_id"] = data[c].combination_id;
      }
    }

    for (let k = 0; k < props.element["no_of_stone_array"].length; k++) {
      if (props.element["group_by"] != true) {
        if (
          props.element["no_of_stone_sequence"] ==
          props.element["no_of_stone_array"][k]["sequence"]
        ) {
          props.element["no_of_stone_array"][k]["stone_arr"] = element;
          props.element["no_of_stone_array"][k]["st_stock_id"] =
            element.st_stock_id;
          props.element["no_of_stone_array"][k]["st_shape"] = element.st_shape;
          props.element["no_of_stone_array"][k]["vertical_code"] =
            getVerticalCode;
          props.element["no_of_stone_array"][k]["set_stone"] = 1;
          props.element["set_stone"] = 1;
          element["st_short_code"] = getVerticalCode;
          props.setStone(props.element);
        }
      } else {
        props.element["no_of_stone_array"][k]["stone_arr"] = element;
        props.element["no_of_stone_array"][k]["st_stock_id"] =
          element.st_stock_id;
        props.element["no_of_stone_array"][k]["st_shape"] = element.st_shape;
        props.element["no_of_stone_array"][k]["vertical_code"] =
          getVerticalCode;
        props.element["no_of_stone_array"][k]["set_stone"] = 1;
        props.element["set_stone"] = 1;
        element["st_short_code"] = getVerticalCode;
        element["set_stone"] = 1;
        props.setStone(props.element);
      }
    }
    props.imageImportinSpecificationDiy()
  };

  const parentBack = () => {
    props.back();
  };

  const go_to_review = () => {
    props.go_to_review();
  };

  //Update state
  useEffect(() => {
    dispatch(diamondNumber(""));
    setColumns([
      {
        id: "",
        title: paramsItem === "DIY" ? "Set" : "",
      },
      {
        id: "",
        title: "Add To Cart",
      },
      {
        id: "st_stock_id",
        title: "Stock Id",
      },
      {
        id: "st_shape",
        title: "Shape",
      },
      {
        id: "st_size",
        title: "Carat",
      },
      {
        id: "st_cla",
        title: "Clarity",
      },
      {
        id: "st_col",
        title: "Colour",
      },
      {
        id: "st_cut",
        title: "Cut",
      },
      {
        id: "st_flou",
        title: "Fluroscene",
      },
      {
        id: "st_lab",
        title: "Certificate",
      },
      {
        id: "ex_store_price_display",
        title: "Price",
      },
    ]);
    setColorType("White");
    dispatch(dimaondColorType("White"));
    // dispatch(diamondPageChnages(false));
  }, [paramsItem]);

  const toggleDiamondDetails = (value) => {
    setShowDiamondDetails(value);
  };

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
      saveEngraving && props.engravingData?.service_rate
        ? extractNumber(props.engravingData?.service_rate.toString()) || 0
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

  //DIY navigation based on dependencies
  useEffect(() => {
    if (
      (isItemDIY === true &&
        perfumeVertical(isEmpty(sessionStorage.getItem("DIYVertical"))) !==
          true) ||
      ((isJewelDiy === true || isDiamoDiy === true) &&
        DiySteperDatas?.length > 0)
    ) {
      dispatch(DiySteperData([]));
      dispatch(ActiveStepsDiy(0));
      router.push("/make-your-customization");
    }
    if (
      ((jewelVertical(isEmpty(sessionStorage.getItem("DIYVertical"))) !==
        false ||
        isEmpty(sessionStorage.getItem("DIYVertical")) === "") &&
        isDiamoDiy === true) ||
      (isJewelDiy === true &&
        jewelVertical(isEmpty(sessionStorage.getItem("DIYVertical"))) !==
          true) ||
      (isDiamoDiy === true &&
        (jewelVertical(isEmpty(sessionStorage.getItem("DIYVertical"))) ===
          true ||
          perfumeVertical(isEmpty(sessionStorage.getItem("DIYVertical"))) ===
            true))
    ) {
      dispatch(DiySteperData([]));
      dispatch(ActiveStepsDiy(0));
      router.push("/make-your-customization");
    }
  }, [isDiamoDiy, isJewelDiy, isItemDIY]);

  //Search params details with update states
  useEffect(() => {
    if (isEmpty(certiNumber) !== "") {
      setOnceUpdated(false)
      setShowDiamondDetails(true);
      dispatch(diamondNumber(certiNumber));
      dispatch(diamondPageChnages(true));
    }
  }, []);
  return (
    <main className="page-wrapper">
      <section className="pt-3 shop-main container">
        {showDiamondDetails ||
        isEmpty(certiNumber) !== "" ||
        pathname.includes("/shape/cart") ? (
          <>
            <CertificateDiamondDetails
              getEmbededDiamondObj={getEmbededDiamondObj}
              selectedOffer={props.selectedOffer}
              isEngraving={props.isEngraving}
              isOffers={props.isOffers}
              embossingData={props.embossingData}
              isEmbossing={props.isEmbossing}
              calculatePrice={calculatePrice}
              diamondDetailsPage={diamondDetailsPage}
              toggleDiamondDetails={toggleDiamondDetails}
              showDiamondDetails={showDiamondDetails}
              setShowDiamondDetails={setShowDiamondDetails}
              handleReset={handleReset}
              product_type={props.product_type}
              back={parentBack}
              go_to_review={go_to_review}
              element={props.element}
              setStone={setStone}
              productSKU={props.productSKU}
              finalTotal={props.finalTotal}
              salesTotalPrice={props.salesTotalPrice}
              certificateNumber={props.certificateNumber}
              stonePrice={props.stonePrice}
              stoneImageUrl={props.stoneImageUrl}
              handleComplete={props.handleComplete}
              complete={props.complete}
              isStone={props.isStone}
              handleFirstStep={props.handleFirstStep}
              handleBackToDiamond={props.handleBackToDiamond}
              diamondStepTwo={props.diamondStepTwo}
              diamondStepFirst={props.diamondStepFirst}
              diamondBack={props.back}
              can_be_set={props.can_be_set}
              finalCanBeSet={props.finalCanBeSet}
              diamondComplete={props.diamondComplete}
              serviceData={props.serviceData}
              imageImportinSpecificationDiy={props.imageImportinSpecificationDiy}
              certiNumber={certiNumber}
            />
          </>
        ) : (
          <>
            {paramsItem === "DIY" && (
              <DIYSteps
                selectedOffer={props.selectedOffer}
                isOffers={props.isOffers}
                embossingData={props.embossingData}
                isEmbossing={props.isEmbossing}
                calculatePrice={calculatePrice}
                isEngraving={props.isEngraving}
                back={parentBack}
                product_type={props.product_type}
                go_to_review={go_to_review}
                productSKU={props.productSKU}
                finalTotal={props.finalTotal}
                handleFirstStep={props.handleFirstStep}
                parentCallback={parentBack}
                salesTotalPrice={props.salesTotalPrice}
                certificateNumber={props.certificateNumber}
                stonePrice={props.stonePrice}
                stoneImageUrl={props.stoneImageUrl}
                handleComplete={props.handleComplete}
                element={props.element}
                complete={props.complete}
                isStone={props.isStone}
                finalCanBeSet={props.finalCanBeSet}
                diamondComplete={props.diamondComplete}
                diamondStepTwo={props.diamondStepTwo}
                setShowDiamondDetails={setShowDiamondDetails}
                serviceData={props.serviceData}
              />
            )}
            <div className="d-flex justify-contents-between">
              <div className="breadcrumb mb-0 d-none d-md-block flex-grow-1">
                <BreadCumb
                  showDiamondDetails={showDiamondDetails}
                  handleReset={handleReset}
                />
              </div>
              {pathname.includes("/start-with-a-setting") && (
                <div className="mb-0 d-md-block ">
                  <div
                    className={`fs-15 menu-link menu-link_us-s add-to-wishlist cursor-pointer`}
                    onClick={
                      pathname.includes("/start-with-a-setting")
                        ? () => {
                            props.backToList();
                            props.back();
                          }
                        : props.back()
                    }
                  >
                    <span>Back</span>
                  </div>
                </div>
              )}
            </div>
            <div className="d-flex justify-content-between pb-2">
              <p className="fs-18 text-capitalize fw-medium my-1">
                {moduleName?.map((e) => {
                  return e.product_vertical_name === getVerticalCode
                    ? firstWordCapital(e.menu_name)
                    : "";
                })}
              </p>
              {paramsItem !== "DIY" && (
                <div>
                  <div
                    className="btn btn-primary btn-reset"
                    onClick={() => {
                      handleReset();
                    }}
                  >
                    RESET
                  </div>
                </div>
              )}
            </div>
            <div className="diamond-info mb-2">
              {parameterDataList?.['Stone Type']?.length > 0 && (
                <>
                  <h3 className="sub-title mb-0">Stone Type</h3>
                  <div className="d-flex gap-2 flex-wrap justify-content-start"> 
                    {parameterDataList?.['Stone Type'] &&
                                  parameterDataList?.['Stone Type'].length > 0 && (
                                    <React.Fragment>
                                      <div className="d-flex flex-wrap">
                                        {parameterDataList?.['Stone Type'].map(
                                          (e, index) => {
                                            const isSelectFilter =
                                              storeFilteredValues?.['Stone Type'] &&
                                              storeFilteredValues?.['Stone Type'].some(
                                                (find) =>
                                                  find === e.dp_parameters_code
                                              );
                                            return (
                                              <div
                                                key={index}
                                                className={`me-2 my-1 ${
                                                  isEmpty(props.selectedColor) !=
                                                  ""
                                                    ? "disabled"
                                                    : ""
                                                }`}
                                                onClick={() =>
                                                  applyFilters(
                                                    "Stone Type",
                                                    e.dp_parameters_code,
                                                    e.dp_parameters_code,
                                                    e.dp_parameters_code,
                                                    "singleSelect"
                                                  )
                                                }
                                              >
                                                <button
                                                  className={`btn certificate-stone-name text-center  ${
                                                    pathname.includes(
                                                      "/start-with-a-diamond"
                                                    )
                                                      ? isSelectFilter ??
                                                        (activeFilter['Stone Type'] &&
                                                          activeFilter['Stone Type'][
                                                            e.dp_parameters_code
                                                          ])
                                                        ? "active"
                                                        : ""
                                                      : isSelectFilter ||
                                                        (activeFilter['Stone Type'] &&
                                                          activeFilter['Stone Type'][
                                                            e.dp_parameters_code
                                                          ])
                                                      ? "active"
                                                      : ""
                                                  }`}
                                                >
                                                  {e.dp_parameters_name}
                                                </button>
                                              </div>
                                            );
                                          }
                                        )}
                                      </div>
                                    </React.Fragment>
                                  )}
                  </div>
                </>
              )}
            </div>
            <div className="diamond-info">
              {parameterDataList.Shape?.length > 0 && (
                <>
                  <h3 className="sub-title mb-0 w-100">Shape</h3>
                  <div className="d-flex gap-2 flex-wrap justify-content-start">
                    {parameterDataList.Shape?.map((e, index) => {
                      const isSelectFilter =
                        storeFilteredValuess?.Shape &&
                        storeFilteredValuess?.Shape.some(
                          (find) => find === e.dp_parameters_code
                        );

                      const tooltipContent = e?.dp_parameters_name;

                      return (
                        <React.Fragment key={index}>
                          <label
                            className={`shape-wrap swatch js-swatch h-50 text-center d-flex flex-column p-2 ${
                              pathname.includes("/start-with-a-diamond")
                                ? isSelectFilter ??
                                  (activeFilter.Shape &&
                                    activeFilter.Shape[e.dp_parameters_code])
                                  ? "filter-active hover"
                                  : "cursor-pointer"
                                : pathname.includes("/start-with-a-setting")
                                ? isSelectFilter ||
                                  (activeFilter.Shape &&
                                    activeFilter.Shape[e.dp_parameters_code])
                                  ? "active hover"
                                  : e?.visible === "true"
                                  ? ""
                                  : "avoid-clicks"
                                : isSelectFilter ||
                                  (activeFilter.Shape &&
                                    activeFilter.Shape[e.dp_parameters_code])
                                ? "active hover"
                                : ""
                            } ${
                              paramsItem === "DIY"
                                ? e?.visible === "true"
                                  ? ""
                                  : e.dp_flag_selected === 1
                                  ? "cursor-pointer"
                                  : "avoid-clicks"
                                : e.dp_flag_selected === 1
                                ? ""
                                : "avoid-clicks"
                            }
                  `}
                            // Ensure it’s a valid string
                            onClick={() =>
                              applyFilters(
                                "Shape",
                                e?.dp_parameters_code,
                                e?.dp_parameters_code,
                                e?.dp_parameters_code,
                                "singleSelect"
                              )
                            }
                          >
                            <div className="d-flex justify-content-center">
                              <i
                                className={`fs-30px ${e.dp_icon}`}
                                data-tooltip-id={e.dp_parameters_code}
                              ></i>
                            </div>
                          </label>

                          <ReactTooltip
                            id={e.dp_parameters_code} // Ensure unique IDs (use e.dp_parameters_code if possible)
                            place="top"
                            effect="solid"
                            className="my-custom-tooltip"
                            content={tooltipContent} // Optional: add `effect="solid"` for better display
                          />
                        </React.Fragment>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            <div className="row my-3">
              <div className="col-12 col-md-6 mb-2">
                {parameterDataList?.["Size Group"] &&
                  parameterDataList?.["Size Group"].length > 0 && (
                    <React.Fragment>
                      <div className="d-flex justify-content-between">
                        <div className="d-flex align-items-center justify-content-between">
                          <h3 className="sub-title mb-0">Carat</h3>
                        </div>
                        <div className="text-end">
                          <input
                            type={"text"}
                            className="numeric w-25 border fs-12"
                            value={caratValue?.[0]}
                            disabled={paramsItem === "DIY"}
                            onChange={(e) => {
                              if (e.target.value > 0) {
                                setCaratValue([e.target.value, caratValue[1]]);
                                clearTimeout(timer);
                                timer = setTimeout(() => {
                                  applyFilterSlider(
                                    "Size Group",
                                    parameterDataList?.["Size Group"],
                                    e.target.value,
                                    caratInputTo === ""
                                      ? maxValueCarat
                                      : caratInputTo
                                  );
                                  caratInputChange(e, "From");
                                }, 600);
                                setTimer(timer);
                              }
                            }}
                            max={maxValueCarat}
                          ></input>
                          <span className="mx-2 fs-12">To</span>
                          <input
                            type={"text"}
                            className="numeric w-25 border fs-12"
                            value={caratValue?.[1]}
                            disabled={paramsItem === "DIY"}
                            onChange={(e) => {
                              if (e.target.value > 0) {
                                setCaratValue([caratValue[0], e.target.value]);
                                clearTimeout(timer);
                                timer = setTimeout(() => {
                                  applyFilterSlider(
                                    "Size Group",
                                    parameterDataList?.["Size Group"],
                                    caratInputFrom === ""
                                      ? caratValue[0]
                                      : caratInputFrom,
                                    e.target.value
                                  );
                                  caratInputChange(e, "To");
                                }, 600);
                                setTimer(timer);
                              }
                            }}
                            max={maxValueCarat}
                          ></input>
                        </div>
                      </div>
                      <div className="range-slider-wrap">
                        <Slider
                          value={caratValue}
                          max={maxValueCarat}
                          min={0}
                          onChange={(e) => {
                            const [min, max] = caratValueDiy;
                            const [newMin, newMax] = e.target.value;
                            if (
                              isJewelDiy &&
                              ((newMin < min && newMax >= min) ||
                                (newMax > max && newMin <= max))
                            ) {
                              return;
                            } else {
                              if (
                                pathname.includes("/start-with-a-diamond") ||
                                pathname.includes("/lab-grown-certi") ||
                                pathname.includes("/certificate-") ||
                                pathname.includes("natural-certifi")
                              ) {
                                setMinMaxValueRangeBar((prevFields) => {
                                  const newFields = { ...prevFields };
                                  if (!Array.isArray(newFields["Size Group"])) {
                                    newFields["Size Group"] = [];
                                  }
                                  if (
                                    Array.isArray(e.target.value) &&
                                    e.target.value.length >= 2
                                  ) {
                                    newFields["Size Group"] = [
                                      e.target.value[0],
                                      e.target.value[1],
                                    ];
                                  }

                                  return newFields;
                                });
                              }
                              setCaratValue([
                                e.target.value[0],
                                e.target.value[1],
                              ]);
                              // dispatch(caratVlaues([
                              //   e.target.value[0],
                              //   e.target.value[1],
                              // ]));

                              setCaratInputFrom(e.target.value[0]);
                            }
                            clearTimeout(timer);
                            timer = setTimeout(() => {
                              applyFilterSlider(
                                "Size Group",
                                parameterDataList?.["Size Group"],
                                e.target.value[0],
                                e.target.value[1]
                              );
                            }, 500);
                            setTimer(timer);
                          }}
                          marks={caratArrayLabel}
                          // disabled={
                          //   paramsItem === "DIY" || !Array.isArray(caratValue)
                          // }
                          valueLabelDisplay="auto"
                          step={0.01}
                        />
                      </div>
                    </React.Fragment>
                  )}
              </div>
              <div className="col-12 col-md-6 mb-2">
                <h3 className="sub-title mb-0">Clarity</h3>
                {parameterDataList?.Clarity &&
                  parameterDataList?.Clarity.length > 0 && (
                    <React.Fragment>
                      <div className="range-slider-wrap">
                        <Slider
                          className="Clarity"
                          track="inverted"
                          aria-labelledby="track-inverted-range-slider"
                          max={valueLength["Clarity"]}
                          min={0}
                          defaultValue={minMaxValueRangeBar?.Clarity}
                          value={isJewelDiy ? clarityRange : undefined}
                          valueLabelDisplay="auto"
                          // ✅ Format labels instead of using jQuery
                          valueLabelFormat={(value) =>
                            labelsForRangeBar["Clarity"][value]
                              ? labelsForRangeBar["Clarity"][value].label
                              : value
                          }
                          onChange={(e, newValue) => {
                            const [min, max] = clarityRangeDiy;
                            const [newMin, newMax] = newValue;

                            if (
                              paramsItem === "DIY" &&
                              ((newMin < min && newMax >= min) ||
                                (newMax > max && newMin <= max))
                            ) {
                              return;
                            }

                            if (
                              pathname.includes("/start-with-a-diamond") ||
                              pathname.includes("/lab-grown-certi") ||
                              pathname.includes("/start-with-a-setting") ||
                              pathname.includes("/certificate-") ||
                              pathname.includes("natural-certifi")
                            ) {
                              setClarityRange([newMin, newMax]);
                            }

                            clearTimeout(timer);
                            timer = setTimeout(() => {
                              applyFilterSlider(
                                "Clarity",
                                parameterDataList?.Clarity,
                                newValue[0],
                                newValue[1]
                              );
                            }, 500);
                            setTimer(timer);
                          }}
                          marks={labelsForRangeBar["Clarity"]}
                          step={1}
                        />
                      </div>
                    </React.Fragment>
                  )}
              </div>
              {
                <div className="col-12 col-md-6 mb-2">
                  <div className="diamond-color-type">
                    <div className="diamond-color-title">
                      <h3 className="sub-title mb-0">Color</h3>
                      {getVerticalCode != "GEDIA" && (
                        <div className="d-flex">
                          <div className="form-check mb-0">
                            <input
                              name="colorFilter"
                              className="form-check-input form-check-input_fill"
                              type="radio"
                              value="White"
                              checked={colorType === "White"}
                              onChange={(e) => changeColorType("White")}
                            />
                            <label className="form-check-label text-secondary">
                              White
                            </label>
                          </div>
                          {paramsItem !== "DIY" && (
                            <div className="form-check mb-0 ms-2">
                              <input
                                name="colorFilter"
                                className="form-check-input form-check-input_fill"
                                type="radio"
                                value="Fancy"
                                checked={colorType === "Fancy"}
                                onChange={(e) => changeColorType("Fancy")}
                              />
                              <label className="form-check-label text-secondary">
                                Fancy
                              </label>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="diamond-color-body">
                      {colorType === "Fancy" && (
                        <div className="row mt-2">
                          {colorDropDown.map((ele, index) => {
                            return (
                              <div className="col-12 col-md-4 mb-2" key={index}>
                                <h3 className="sub-title mb-0">
                                  {ele.keyName}
                                </h3>
                                <Select
                                  options={ele.data}
                                  value={ele.data.filter((obj) =>
                                    selectedValue[ele.keyName]?.includes(
                                      obj.value
                                    )
                                  )}
                                  placeholder={ele.keyName}
                                  onChange={(e) =>
                                    changeDropdownColor(ele, e, index)
                                  }
                                  isSearchable={true}
                                  isMulti={true}
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                  className="custom-react-select-container w-100"
                                  classNamePrefix="custom-react-select"
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {colorType === "White" && (
                        <div>
                          {getVerticalCode != "GEDIA" ? (
                            <>
                              {parameterDataList?.Color &&
                                parameterDataList?.Color.length > 0 && (
                                  <React.Fragment>
                                    <div className="range-slider-wrap">
                                      <Slider
                                        className="Color"
                                        track="inverted"
                                        aria-labelledby="track-inverted-range-slider"
                                        max={valueLength["Color"]}
                                        min={0}
                                        valueLabelDisplay="auto"
                                        defaultValue={minMaxValueRangeBar.Color}
                                        value={
                                          isJewelDiy ? colorRange : undefined
                                        }
                                        onChange={(_, newValue) => {
                                          const [min, max] = colorRangeDiy;
                                          const [newMin, newMax] = newValue;

                                          // Prevent invalid DIY changes
                                          if (
                                            paramsItem === "DIY" &&
                                            ((newMin < min && newMax >= min) ||
                                              (newMax > max && newMin <= max))
                                          ) {
                                            return;
                                          }

                                          // Update state only on specific pages
                                          if (
                                            pathname.includes(
                                              "/start-with-a-diamond"
                                            ) ||
                                            pathname.includes(
                                              "/start-with-a-setting"
                                            ) ||
                                            pathname.includes(
                                              "/lab-grown-certi"
                                            ) ||
                                            pathname.includes(
                                              "/certificate-"
                                            ) ||
                                            pathname.includes(
                                              "natural-certifi"
                                            ) ||
                                            pathname.includes(
                                              "/lab-grown-gemstone"
                                            )
                                          ) {
                                            setColorRange([newMin, newMax]);
                                          }

                                          // Apply filter with debounce
                                          clearTimeout(timer);
                                          timer = setTimeout(() => {
                                            applyFilterSlider(
                                              "Color",
                                              parameterDataList?.Color,
                                              newMin,
                                              newMax
                                            );
                                          }, 500);
                                          setTimer(timer);
                                        }}
                                        marks={labelsForRangeBar["Color"]}
                                        step={1}
                                      />
                                    </div>
                                  </React.Fragment>
                                )}
                            </>
                          ) : (
                            <>
                              {parameterDataList?.Color &&
                                parameterDataList?.Color.length > 0 && (
                                  <React.Fragment>
                                    <div className="d-flex flex-wrap">
                                      {parameterDataList?.Color.map(
                                        (e, index) => {
                                          const isSelectFilter =
                                            storeFilteredValuess?.Color &&
                                            storeFilteredValuess?.Color.some(
                                              (find) =>
                                                find === e.dp_parameters_code
                                            );
                                          return (
                                            <div
                                              key={index}
                                              className={`me-2 my-1 ${
                                                isEmpty(props.selectedColor) !=
                                                ""
                                                  ? "disabled"
                                                  : ""
                                              }`}
                                              onClick={() =>
                                                applyFilters(
                                                  "Color",
                                                  e.dp_parameters_code,
                                                  e.dp_parameters_code,
                                                  e.dp_parameters_code,
                                                  "singleSelect"
                                                )
                                              }
                                            >
                                              <button
                                                className={`btn certificate-stone-name text-center  ${
                                                  pathname.includes(
                                                    "/start-with-a-diamond"
                                                  )
                                                    ? isSelectFilter ??
                                                      (activeFilter.Color &&
                                                        activeFilter.Color[
                                                          e.dp_parameters_code
                                                        ])
                                                      ? "active"
                                                      : ""
                                                    : isSelectFilter ||
                                                      (activeFilter.Color &&
                                                        activeFilter.Color[
                                                          e.dp_parameters_code
                                                        ])
                                                    ? "active"
                                                    : ""
                                                }`}
                                              >
                                                {e.dp_parameters_name}
                                              </button>
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  </React.Fragment>
                                )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              }
              <div className="col-12 col-md-6 mb-2">
                {parameterDataList?.Cut &&
                  parameterDataList?.Cut.length > 0 && (
                    <React.Fragment>
                      <h3 className="sub-title mb-0">Cut</h3>
                      <div className="range-slider-wrap">
                        <Slider
                          className="Cut"
                          track="inverted"
                          aria-labelledby="track-inverted-range-slider"
                          max={valueLength["Cut"]}
                          min={0}
                          valueLabelDisplay="auto"
                          value={minMaxValueRangeBar["Cut"]}
                          onChange={(_, newValue) => {
                            if (
                              pathname.includes("/start-with-a-diamond") ||
                              pathname.includes("/start-with-a-setting") ||
                              pathname.includes("/lab-grown-certi") ||
                              pathname.includes("/certificate-") ||
                              pathname.includes("natural-certifi") ||
                              pathname.includes("/lab-grown-gemstone")
                            ) {
                              setMinMaxValueRangeBar((prevFields) => {
                                const newFields = { ...prevFields };
                                if (!Array.isArray(newFields["Cut"])) {
                                  newFields["Cut"] = [];
                                }
                                if (
                                  Array.isArray(newValue) &&
                                  newValue.length >= 2
                                ) {
                                  newFields["Cut"] = [newValue[0], newValue[1]];
                                }
                                return newFields;
                              });
                            }

                            clearTimeout(timer);
                            timer = setTimeout(() => {
                              applyFilterSlider(
                                "Cut",
                                parameterDataList?.Cut,
                                newValue[0],
                                newValue[1]
                              );
                            }, 500);
                            setTimer(timer);
                          }}
                          marks={labelsForRangeBar["Cut"]}
                          step={1}
                          valueLabelFormat={(val) =>
                            labelsForRangeBar["Cut"][val]?.label || val
                          }
                        />
                      </div>
                    </React.Fragment>
                  )}
              </div>

              <div className="col-12 col-md-6 mb-2">
                <h3 className="sub-title mb-0">Certificate</h3>
                {parameterDataList?.Certificate &&
                  parameterDataList?.Certificate.length > 0 && (
                    <React.Fragment>
                      <div className="d-flex flex-wrap">
                        {parameterDataList?.Certificate.map((e, index) => {
                          const isSelectFilter =
                            storeFilteredValuess?.Certificate &&
                            storeFilteredValuess?.Certificate.some(
                              (find) => find === e.dp_parameters_code
                            );
                          return (
                            <div
                              key={index}
                              className={`me-2 my-1`}
                              onClick={() =>
                                applyFilters(
                                  "Certificate",
                                  e.dp_parameters_code,
                                  e.dp_parameters_code,
                                  e.dp_parameters_code,
                                  "singleSelect"
                                )
                              }
                            >
                              <button
                                className={`btn btn-certi  ${
                                  pathname.includes("/start-with-a-diamond")
                                    ? isSelectFilter ??
                                      (activeFilter.Certificate &&
                                        activeFilter.Certificate[
                                          e.dp_parameters_code
                                        ])
                                      ? "active"
                                      : ""
                                    : (activeFilter.Certificate &&
                                        activeFilter.Certificate[
                                          e.dp_parameters_code
                                        ]) ||
                                      isSelectFilter
                                    ? "active"
                                    : ""
                                }`}
                              >
                                {e.dp_parameters_name}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </React.Fragment>
                  )}
              </div>

              {parameterDataList?.Polish &&
                parameterDataList?.Polish.length > 0 && (
                  <div className="col-12 col-md-6 mb-2">
                    <h3 className="sub-title mb-0">Polish</h3>
                    <React.Fragment>
                      <div className="range-slider-wrap">
                        <Slider
                          className="Polish"
                          track="inverted"
                          aria-labelledby="track-inverted-range-slider"
                          max={valueLength["Polish"]}
                          min={0}
                          valueLabelDisplay="auto"
                          value={minMaxValueRangeBar["Polish"]}
                          onChange={(_, newValue) => {
                            if (
                              pathname.includes("/start-with-a-diamond") ||
                              pathname.includes("/start-with-a-setting") ||
                              pathname.includes("/lab-grown-certi") ||
                              pathname.includes("/certificate-") ||
                              pathname.includes("natural-certifi") ||
                              pathname.includes("/lab-grown-gemstone")
                            ) {
                              setMinMaxValueRangeBar((prevFields) => {
                                const newFields = { ...prevFields };
                                if (!Array.isArray(newFields["Polish"])) {
                                  newFields["Polish"] = [];
                                }
                                if (
                                  Array.isArray(newValue) &&
                                  newValue.length >= 2
                                ) {
                                  newFields["Polish"] = [
                                    newValue[0],
                                    newValue[1],
                                  ];
                                }
                                return newFields;
                              });
                            }

                            clearTimeout(timer);
                            timer = setTimeout(() => {
                              applyFilterSlider(
                                "Polish",
                                parameterDataList?.Polish,
                                newValue[0],
                                newValue[1]
                              );
                            }, 500);
                            setTimer(timer);
                          }}
                          marks={labelsForRangeBar["Polish"]}
                          step={1}
                          valueLabelFormat={(val) =>
                            labelsForRangeBar["Polish"][val]?.label || val
                          }
                        />
                      </div>
                    </React.Fragment>
                  </div>
                )}
            </div>

            <>
              {loader && <Loader />}
              {/* <div className="mb-4 pb-lg-3"></div> */}
              <div className="d-flex justify-content-between align-items-center flex-wrap mb-3 pb-md-2">
                <React.Fragment>
                  <h6 className="fs-14px me-2 my-1 profile-sub-heading">
                    Showing {diamondDataList?.total_rows ?? 0} Results
                  </h6>
                  {diamondDataList?.total_rows && view === false && (
                    <div className="d-flex flex-wrap justify-content-end align-items-center">
                      <div className="my-0">
                        <select
                          className="border h-36px rounded-0"
                          aria-label="Default select example"
                          value={page}
                          onChange={(e) => onChangePagination(e)}
                        >
                          <option value={16}>16</option>
                          <option value={32}>32</option>
                          <option value={80}>80</option>
                        </select>
                      </div>
                      <div className="mx-2">
                        <nav aria-label="Page navigation example">
                          <ul className="pagination mb-0">
                            {count > 1 ? (
                              <li
                                className="page-item previous-next"
                                onClick={() => paginationLeftRight("left")}
                              >
                                <Link
                                  href="#"
                                  className="page-link"
                                  aria-label="Previous"
                                >
                                  <span aria-hidden="true">«</span>
                                </Link>
                              </li>
                            ) : (
                              <li className="page-item previous-next" disabled>
                                <Link
                                  href="#"
                                  className="page-link"
                                  aria-label="Previous"
                                >
                                  <span aria-hidden="true">«</span>
                                </Link>
                              </li>
                            )}
                            <li className="page-item">
                              <Link href="#" className="page-link">
                                {pageRange}
                              </Link>
                            </li>
                            {count < totalPages ? (
                              <li
                                className="page-item previous-next"
                                onClick={() => paginationLeftRight("right")}
                              >
                                <Link
                                  href="#"
                                  className="page-link"
                                  aria-label="Next"
                                >
                                  <span aria-hidden="true">»</span>
                                </Link>
                              </li>
                            ) : (
                              <li className="page-item previous-next" disabled>
                                <Link
                                  href="#"
                                  className="page-link"
                                  aria-label="Next"
                                >
                                  <span aria-hidden="true">»</span>
                                </Link>
                              </li>
                            )}
                          </ul>
                        </nav>
                      </div>
                    </div>
                  )}
                </React.Fragment>
                <div className="shop-acs d-flex align-items-center justify-content-between justify-content-md-end flex-grow-1">
                  {view ? (
                    <>
                      <div className="col-size align-items-center order-1 d-none d-lg-flex">
                        <span className="text-uppercase fw-medium me-2">
                          View
                        </span>
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
                      </div>
                      <div className="shop-asc__seprator mx-3 bg-light d-none d-lg-block order-md-1"></div>
                    </>
                  ) : (
                    <></>
                  )}
                  {/* <!-- /.col-size --> */}

                  <div className="shop-filter d-flex align-items-center order-0 order-md-3">
                    <button
                      className={`bar-module me-2 rounded-0 ${
                        view ? "active" : "border border-black"
                      }`}
                      onClick={() => {
                        handleViewChange();
                      }}
                    >
                      <i className="ic_grid_view"></i>
                    </button>
                    <button
                      className={`bar-module rounded-0 ${
                        view ? "border border-black" : "active"
                      }`}
                      onClick={() =>
                        view && count !== 1 ? showTableView() : setView(false)
                      }
                    >
                      <i className="ic_list_view"></i>
                    </button>
                  </div>
                  {/* <!-- /.col-size d-flex align-items-center ms-auto ms-md-3 --> */}
                </div>
                {/* <!-- /.shop-acs --> */}
              </div>
              {view === true ? (
                <InfiniteScroll
                  className={`products-grid row row-cols-1 row-cols-md-3 row-cols-lg-${selectedColView}`}
                  id="products-grid"
                  dataLength={diamondAllDataList?.length}
                  next={handleShowMore}
                  hasMore={hasMore}
                  scrollThreshold={paramsItem === "DIY" ? 0.8 : 0.9}
                  loader={
                    <SkeletonModal
                      page="product"
                      storeSkeletonArr={storeSkeletonArr}
                    />
                  }
                >
                  {diamondAllDataList?.length > 0
                    ? diamondAllDataList.map((elm, i) => {
                        const diamond = pathname.includes(
                          "/start-with-a-diamond"
                        )
                          ? storeDiamondNumbers
                          : diamondNumbers;
                        const isSelected = diamond === elm.st_cert_no;
                        return (
                          <div key={i}>
                            <div
                              className={`product-card selectCard mb-3 mb-md-4 ${
                                pathname.includes("/start-with-a-diamond")
                                  ? isSelected ?? elm.checked == "true"
                                    ? "activeCard"
                                    : ""
                                  : isSelected || elm.checked == "true"
                                  ? "activeCard"
                                  : ""
                              }`}
                            >
                              <div className="pc__img-wrapper">
                                <Swiper
                                  className="shop-list-swiper swiper-container swiper-initialized swiper-horizontal swiper-backface-hidden background-img js-swiper-slider"
                                  slidesPerView={1}
                                  modules={[Navigation]}
                                  lazy={"true"}
                                  navigation={{
                                    prevEl: ".prev" + i,
                                    nextEl: ".next" + i,
                                  }}
                                >
                                  <SwiperSlide key={i} className="swiper-slide">
                                    <Link
                                      href="#"
                                      onClick={(event) => {
                                        if (
                                          pathname.includes(
                                            "/start-with-a-diamond"
                                          ) ||
                                          pathname.includes(
                                            "/start-with-a-setting"
                                          )
                                        ) {
                                          if (
                                            isSelected ||
                                            elm?.checked === "true"
                                          ) {
                                            event.preventDefault();
                                          } else {
                                            event.preventDefault();
                                            sessionStorage.setItem(
                                              "storeUrl",
                                              pathname
                                            );
                                            diamondDetailPage(elm);
                                          }
                                        } else {
                                          event.preventDefault();
                                          sessionStorage.setItem(
                                            "storeUrl",
                                            pathname
                                          );
                                          diamondDetailPage(elm);
                                        }
                                      }}
                                      // to={`${location.pathname}/${changeUrl(
                                      //   `${
                                      //     elm.product_name + "-" + elm.variant_unique_id
                                      //   }`
                                      // )}`}
                                    >
                                      <LazyLoadImage
                                        effect="blur"
                                        loading="lazy"
                                        src={elm.st_is_photo}
                                        width="330"
                                        height="400"
                                        alt={elm.product_name}
                                        className="pc__img"
                                        style={{objectFit: 'cover'}}
                                      />
                                    </Link>
                                  </SwiperSlide>

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
                                    onClick={() =>
                                      addProductToCart(elm, "diamond")
                                    }
                                    title={
                                      isAddedToCartProducts(elm.st_cert_no)
                                        ? "Already Added"
                                        : "Add to Cart"
                                    }
                                  >
                                    {isAddedToCartProducts(elm.st_cert_no)
                                      ? "Already Added"
                                      : "Add To Cart"}
                                  </button>
                                )} */}
                              </div>
                              <div className="pc__info position-relative">
                                {/* <p className="pc__category">{elm.shape_name}</p> */}
                                <h2 className="pc__title mb-2">
                                  <Link href="#">{elm.product_name}</Link>
                                </h2>
                                <p className="pc__category">
                                  Certificate {elm.st_lab} : {elm.st_cert_no}
                                </p>
                                {/* <div className="product-card__price d-flex"> */}
                                <div className="pt-0 product-detail d-flex flex-row justify-content-between">
                                  <div className="fw-400 fs-14px d-flex flex-column  mb-0 lh-1 gap-1 ">
                                    <span className="pc__title">
                                      Total Price
                                    </span>
                                    <p className="pc__category">
                                      {elm.currency_code}{" "}
                                      {elm.ex_store_price_display}
                                    </p>
                                  </div>
                                  {isEmpty(elm.ex_rap_price_cts) !== "" && (
                                    <div className="fw-400 fs-14px d-flex flex-column  mb-0 lh-1 gap-1 ">
                                      <span className=" pc__title">
                                        Price/Ct
                                      </span>
                                      <p className="pc__category">
                                        {elm.currency_code}{" "}
                                        {numberWithCommas(
                                          extractNumber(
                                            elm.ex_rap_price_cts
                                          ).toFixed(2)
                                        )}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                {/* <span className="money price">
                                  {storeCurrencys} {elm.final_total_display}
                                </span>
                              </div> */}
                                {/* {elm.colors && ( */}
                                {/* <div className="d-flex align-items-center mt-1">
                      {" "}
                      <ColorSelection />{" "}
                    </div> */}
                                {/* )} */}
                                {/* {elm.reviews && ( */}
                                {/* <div className="product-card__review d-flex align-items-center">
                      <div className="reviews-group d-flex">
                        <Star stars={elm.rating} />
                      </div>
                      <span className="reviews-note text-lowercase text-secondary ms-1">
                        {elm.reviews}
                      </span>
                    </div> */}
                                {/* )} */}

                                <button
                                  className={`pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist ${
                                    isAddedtoWishlist(elm?.st_cert_no)
                                      ? "active"
                                      : ""
                                  }`}
                                  onClick={() => toggleWishlist(elm, "diamond")}
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
                                      xlinkHref={`${
                                        isAddedtoWishlist(elm?.st_cert_no)
                                          ? "#icon_heart_fill"
                                          : "#icon_heart"
                                      }`}
                                    />
                                  </svg>
                                </button>
                              </div>
                              {/* {elm.discont && ( */}
                              {/* <div className="pc-labels position-absolute top-0 start-0 w-100 d-flex justify-content-between">
                    <div className="pc-labels__right ms-auto">
                      <span className="pc-label pc-label_sale d-block text-white">
                        -5{elm.discont}%
                      </span>
                    </div>
                  </div> */}
                              {/* )} */}
                              {/* {elm.isNew && ( */}
                              {/* <div className="pc-labels position-absolute top-0 start-0 w-100 d-flex justify-content-between">
                    <div className="pc-labels__left">
                      <span className="pc-label pc-label_new d-block bg-white">
                        NEW
                      </span>
                    </div>
                  </div> */}
                              {/* )} */}
                            </div>
                          </div>
                        );
                      })
                    : loader === false &&
                      skeletonLoader === false &&
                      (diamondAllDataList?.length === 0 ||
                        diamondAllDataList === undefined) && (
                        <div className="d-flex justify-content-center w-100 not-found">
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
              ) : (
                <div className="certificate-diamondDetail">
                  <div className="row">
                    <div
                      className={`size-guide__detail ${
                        Object.keys(mouseOverDetailList).length > 0 &&
                        DiyDiamondData?.length > 0
                          ? "col-9"
                          : "col-12"
                      }`}
                    >
                      <div className="overflow-auto mb-3">
                        <table className="certificat-table">
                          <thead
                            className="position-sticky"
                            style={{ top: "0" }}
                          >
                            <tr>
                              {columns.map((column, idx) => (
                                <th className="" key={idx}>
                                  <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ textTransform: "capitalize" }}
                                  >
                                    {column.id === "ex_store_price_display"
                                      ? column.title +
                                        " (" +
                                        storeCurrencys +
                                        ")"
                                      : column.title}
                                    {/* <span className="d-flex align-items-center flex-column arrow-up-down ms-3">
                                        <i className="ic_sort_up_fill mb-1"></i>
                                        <i className="ic_sort_down_fill"></i>
                                      </span> */}
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {DiyDiamondData?.length > 0 &&
                              DiyDiamondData?.map((row, i) => {
                                return (
                                  <tr
                                    key={i}
                                    onMouseOver={() =>
                                      tableDiamondHover(row, i)
                                    }
                                    className={`text-center cursor-pointer align-middle ${
                                      row.checked === "true" ? "active" : ""
                                    }`}
                                    onClick={() => {
                                      if (
                                        (pathname.includes(
                                          "/start-with-a-diamond"
                                        ) ||
                                          pathname.includes(
                                            "/start-with-a-setting"
                                          )) &&
                                        row.checked !== "true"
                                      ) {
                                        diamondDetailPage(row);
                                      }
                                    }}
                                  >
                                    {columns.map((column, index) => {
                                      const value = row[column.id];
                                      return (
                                        <React.Fragment key={index}>
                                          {column.title !== "" ? (
                                            <React.Fragment>
                                              {column.title !== "Image" ? (
                                                column.title === "Set" ? (
                                                  <React.Fragment>
                                                    <td className="text-center">
                                                      <button
                                                        className="btn btn-primary btn-details fs-10px cart-table-btn"
                                                        onClick={() => {
                                                          if (
                                                            row.checked !==
                                                              "true" &&
                                                            !pathname.includes(
                                                              "/start-with-a-diamond"
                                                            )
                                                          ) {
                                                            setStone(row);
                                                          } else if (
                                                            row.checked !==
                                                              "true" &&
                                                            pathname.includes(
                                                              "/start-with-a-diamond"
                                                            )
                                                          ) {
                                                            diamondDetailPage(
                                                              row
                                                            );
                                                          }
                                                        }}
                                                      >
                                                        {row.checked ===
                                                          "true" ||
                                                        row.st_cert_no ===
                                                          storeDiamondNumbers
                                                          ? "Selected"
                                                          : "Set"}
                                                      </button>
                                                    </td>
                                                  </React.Fragment>
                                                ) : column.title ===
                                                  "Add To Cart" ? (
                                                  <td className="text-center">
                                                    <button
                                                      className="btn btn-primary btn-addtocart js-open-aside cart-table-btn"
                                                      onClick={() =>
                                                        addProductToCart(
                                                          row,
                                                          "diamond"
                                                        )
                                                      }
                                                      title={
                                                        isAddedToCartProducts(
                                                          row.st_cert_no
                                                        )
                                                          ? "Already Added"
                                                          : "Add to Cart"
                                                      }
                                                    >
                                                      {isAddedToCartProducts(
                                                        row.st_cert_no
                                                      )
                                                        ? "Already Added"
                                                        : "Add To Cart"}
                                                    </button>
                                                  </td>
                                                ) : column.title ===
                                                  "Colour" ? (
                                                  <td
                                                    onClick={() => {
                                                      if (
                                                        row.checked !== "true"
                                                      ) {
                                                        diamondDetailPage(row);
                                                      }
                                                    }}
                                                  >
                                                    {row["st_color_type"] ===
                                                    "1"
                                                      ? row["st_fancy_color"]
                                                      : row["st_col"]}
                                                  </td>
                                                ) : (
                                                  <td
                                                    onClick={() => {
                                                      if (
                                                        row.checked !== "true"
                                                      ) {
                                                        diamondDetailPage(row);
                                                      }
                                                    }}
                                                  >
                                                    {isEmpty(value)}
                                                  </td>
                                                )
                                              ) : (
                                                ""
                                              )}
                                            </React.Fragment>
                                          ) : paramsItem !== "DIY" ? (
                                            <React.Fragment>
                                              <td className="text-center">
                                                <button
                                                  className={`bg-transparent border-0 js-add-wishlist ${
                                                    isAddedtoWishlist(
                                                      row?.st_cert_no
                                                    )
                                                      ? "active"
                                                      : ""
                                                  }`}
                                                  onClick={() =>
                                                    toggleWishlist(
                                                      row,
                                                      "diamond"
                                                    )
                                                  }
                                                  title="Add To Wishlist"
                                                >
                                                  <i
                                                    className={`${
                                                      isAddedtoWishlist(
                                                        row?.st_cert_no
                                                      )
                                                        ? "ic_heart_fill"
                                                        : "ic_heart"
                                                    }`}
                                                  ></i>
                                                </button>
                                              </td>
                                            </React.Fragment>
                                          ) : (
                                            ""
                                          )}
                                        </React.Fragment>
                                      );
                                    })}
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                        {!loader &&
                          !skeletonLoader &&
                          (DiyDiamondData?.length === 0 ||
                            DiyDiamondData === undefined) && (
                            <div className="d-flex justify-content-center w-100 not-found">
                              <Image
                                src={NotFoundImg}
                                loading="lazy"
                                width={500}
                                height={500}
                                alt="Record Not found"
                              />
                            </div>
                          )}
                      </div>
                      {/* Right Side Detail */}
                    </div>
                    {Object.keys(mouseOverDetailList).length > 0 && (
                      <div className="col-3">
                        {Object.keys(mouseOverDetailList).length > 0 && (
                          <div
                            className="position_sticky dia-measure-process mb-3 p-3"
                            id="rightSide"
                          >
                            <div className="dia-lw mb-3">
                              <Image
                                src={mouseOverDetailList.display_image}
                                className="img-fluid w-100"
                                width={500}
                                height={500}
                                alt={
                                  mouseOverDetailList.product_name || "image"
                                }
                              />
                              <div className="dia-l">
                                {mouseOverDetailList.st_length}
                              </div>
                              <div className="dia-w">
                                {mouseOverDetailList.st_width}
                              </div>
                            </div>
                            <div className="mb-3">
                              <div className="text-center">
                                {mouseOverDetailList.product_name}
                              </div>
                            </div>
                            <div className="row mx-0">
                              <div className="col-6">
                                <div className="mb-4">
                                  <h6 className="dia-measure mb-2 fs-15px fw-500">
                                    Certificate No
                                  </h6>
                                  <p className="dia-measure-detail fs-14px">
                                    {mouseOverDetailList.st_cert_no}
                                  </p>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="mb-4">
                                  <h6 className="dia-measure mb-2 fs-15px fw-500">
                                    SYMMENTRY
                                  </h6>
                                  <p className="dia-measure-detail fs-14px">
                                    {mouseOverDetailList.st_sym}
                                  </p>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="mb-4">
                                  <h6 className="dia-measure mb-2 fs-15px fw-500">
                                    MEASUREMENTS
                                  </h6>
                                  <p className="dia-measure-detail fs-14px">
                                    {mouseOverDetailList.st_length} X{" "}
                                    {mouseOverDetailList.st_width} X{" "}
                                    {mouseOverDetailList.st_depth}
                                  </p>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="mb-4">
                                  <h6 className="dia-measure mb-2 fs-15px fw-500">
                                    POLISH
                                  </h6>
                                  <p className="dia-measure-detail fs-14px">
                                    {mouseOverDetailList.st_pol}
                                  </p>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="mb-4">
                                  <h6 className="dia-measure mb-2 fs-15px fw-500">
                                    TABLE
                                  </h6>
                                  <p className="dia-measure-detail fs-14px">
                                    {mouseOverDetailList.st_table_percentage} %
                                  </p>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="mb-4">
                                  <h6 className="dia-measure mb-2 fs-15px fw-500">
                                    GIRDLE
                                  </h6>
                                  <p className="dia-measure-detail fs-14px">
                                    {mouseOverDetailList.st_gird_min}
                                  </p>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="mb-4">
                                  <h6 className="dia-measure mb-2 fs-15px fw-500">
                                    GIRDLE
                                  </h6>
                                  <p className="dia-measure-detail fs-14px">
                                    {mouseOverDetailList.st_depth_percentage} %
                                  </p>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="mb-4">
                                  <h6 className="dia-measure mb-2 fs-15px fw-500">
                                    CULET
                                  </h6>
                                  <p className="dia-measure-detail fs-14px">
                                    {mouseOverDetailList.st_culet}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          </>
        )}
      </section>
      <div className="mb-5 pb-xl-3"></div>
    </main>
  );
}
