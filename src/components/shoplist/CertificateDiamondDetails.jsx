import React, { useCallback, useEffect, useState } from "react";
import BreadCumb from "./BreadCumb";
import { firstWordCapital, isEmpty, perfumeVertical, RandomId } from "@/CommanFunctions/commanFunctions";
import { useDispatch, useSelector } from "react-redux";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import commanService from "@/CommanService/commanService";
import ProductSlider1 from "../singleProduct/sliders/ProductSlider1";
import { useContextElement } from "@/context/Context";
import ShareComponent from "../common/ShareComponent";
import Loader from "@/CommanUIComp/Loader/Loader";
import Slider4 from "../singleProduct/sliders/Slider4";
import GIA from "@/assets/images/GIA.jpg";
import HRD from "@/assets/images/HRD.jpg";
import IGI from "@/assets/images/IGI.jpg";
import video from "@/assets/images/video.png";
import { toast } from "react-toastify";
import {
  activeDIYtabs,
  ActiveStepsDiy,
  addedDiamondData,
  diamondImage,
  diamondNumber,
  diamondPageChnages,
  diamondShape,
  DiySteperData,
  isRingSelected,
  IsSelectedDiamond,
  storeDiamondArrayImage,
  storeDiamondNumber,
} from "@/Redux/action";
import DIYSteps from "./DIYSteps";
import { useRouter } from "next/router";
// import * as bootstrap from "bootstrap";

const CertificateDiamondDetails = ({
  toggleDiamondDetails,
  stoneImageUrl,
  stonePrice,
  certificateNumber,
  showDiamondDetails,
  diamondDetailsPage,
  handleReset,
  element,
  setStone,
  handleFirstStep,
  handleComplete,
  handleBackToDiamond,
  finalTotal,
  productSKU,
  salesTotalPrice,
  finalCanBeSet,
  isStone,
  complete,
  diamondComplete,
  diamondStepTwo,
  selectedOffer,
  calculatePrice,
  isOffers,
  setShowDiamondDetails,
  isEngraving,
  isEmbossing,
  embossingData,
  serviceData,
  getEmbededDiamondObj,
  imageImportinSpecificationDiy
}) => {

  //State Declerations
  const reduxLoginData = useSelector((state) => state.loginData);

const loginDatas =
  typeof window !== "undefined"
    ? JSON.parse(sessionStorage.getItem("loginData")) || reduxLoginData
    : reduxLoginData;

  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const addedRingDatas = useSelector((state) => state.addedRingData);
  const IsSelectedDiamonds = useSelector((state) => state.IsSelectedDiamond);
  const reduxStoreCurrency = useSelector((state) => state.storeCurrency);
const storeCurrencys =
  typeof window !== "undefined"
    ? sessionStorage.getItem("storeCurrency") || reduxStoreCurrency
    : reduxStoreCurrency;

  const diamondNumbers = useSelector((state) => state.diamondNumber);
  const dimaondColorTypes = useSelector((state) => state.dimaondColorType)
  const DiySteperDatas = useSelector((state) => state.DiySteperData);
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isLogin = Object.keys(loginDatas).length > 0;

  const { isAddedtoWishlist, toggleWishlist, cartProducts, setCartProducts, getCountData } =
    useContextElement();

  // Toast
  const [toastShow, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  // One time API call
  const [onceUpdated, setOnceUpdated] = useState(false);

  //state
  const [diamondData, setDiamondData] = useState([]);
  const [diamondDataList, setDiamondDataList] = useState([]);
  const [diamondArrayImage, setDiamondArrayImage] = useState([]);
  const [stockId, setStockId] = useState("");

  //modal
  const [certiModal, setCertiModal] = useState(false);
  const [ModalImageCertURl, setModalImageCertURl] = useState("");

  // Props Value
  var verticalCode = pathname.includes("certificate-") || pathname.includes("natural-certi") ? "DIAMO" : pathname.includes("lab-grown-certifi") || pathname.includes("lab-grown-diamond") || pathname.includes("start-with-a-diamond") ? "LGDIA" : "GEDIA";
  if (element !== undefined) {
    verticalCode = diamondDetailsPage.vertical_code;
  }

  // URL Data
  const isJewelDiy = pathname.includes("start-with-a-setting");
  const isDiamoDiy = pathname.includes("start-with-a-diamond");
  const isItemDIY = pathname.includes("start-with-a-item");
  const paramsItem =
    isDiamoDiy === true ? "DIY" : isJewelDiy === true ? "DIY" : "PRODUCT";
  var itemCode = params.item;

  //Modal settings
  useEffect(() => {
      let bootstrap;
      (async () => {
        if (typeof window !== "undefined") {
          bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");
  
          const modalElement = document.getElementById("certiModal");
          if (modalElement) {
            const modal = new bootstrap.Modal(modalElement, { keyboard: false });
            certiModal ? modal.show() : modal.hide();
          }
        }
      })();
    }, [certiModal]);

  //API call for Diamond details
  const diamondListData = useCallback(() => {
    const obj = {
      ...getEmbededDiamondObj,
      a: "GetEmbeddedPageDiamondListData",
      shape: "",
      carat_group: "",
      carat_min: "",
      carat_max: "",
      clarity: "",
      cut: "",
      color: "",
      color_type: isEmpty(dimaondColorTypes) !== "" ? isEmpty(dimaondColorTypes) : getEmbededDiamondObj.color_type,
      symmetry: "",
      certificate: "",
      polish: "",
      fluorescence: "",
      price_min: "",
      price_max: "",
      stock_id: "",
      json: "",
      per_page: "25",
      page_no: "1",
      extra_currency: storeCurrencys,
      user_id: isLogin ? loginDatas.member_id : RandomId,
      entity_id: storeEntityIds.entity_id,
      tenant_id: storeEntityIds.tenant_id,
      SITDeveloper: "1",
      store_id: storeEntityIds.mini_program_id,
      item_id: "",
      secret_key: storeEntityIds.secret_key,
      certificate_no: diamondNumbers,
      store_type: "B2C",
      vertical_code: verticalCode,
    };
    if (pathname.includes("/cart")) {
      obj.carat_min = "";
      obj.carat_max = ""
    }
    commanService
      .postApi("/EmbeddedPageMaster", obj)
      .then((res) => {
        if (res.data.success === 1) {
          setDiamondData(res.data.data);
          if (res.data.data.rowData?.length > 0) {
            setDiamondDataList(res.data.data.rowData[0]);
            setStockId(res.data.data.rowData[0]?.st_stock_id);

            dispatch(addedDiamondData(res.data.data.rowData[0]))
            let data = [];
            if (res.data.data.rowData?.[0]?.st_is_video != "") {
              if (
                res.data.data.rowData?.[0]?.st_is_video?.includes("mp4") == true
              ) {
                data.push({
                  type: "video",
                  src: res.data.data.rowData?.[0]?.st_is_video,
                  view: video,
                });
              } else {
                data.push({
                  type: "video",
                  src: res.data.data.rowData?.[0]?.st_is_video,
                  view: video,
                  iframe: true,
                });
              }
            }
            if (res.data.data.rowData?.[0]?.st_is_photo != "") {
              data.push({
                type: "image",
                src: res.data.data.rowData?.[0]?.st_is_photo,
                view: res.data.data.rowData?.[0]?.st_is_photo,
              });
            }
            if (res.data.data.rowData?.[0]?.display_image != "") {
              data.push({
                type: "v_image",
                src: res.data.data.rowData?.[0]?.display_image,
                view: res.data.data.rowData?.[0]?.display_image,
                length: res.data.data.rowData?.[0]?.st_length,
                width: res.data.data.rowData?.[0]?.st_width,
              });
            }
            if (res.data.data.rowData?.[0]?.st_is_cert != "") {
              if (res.data.data.rowData?.[0]?.st_lab == "GIA") {
                data.push({
                  type: "cert",
                  st_is_cert: res.data.data.rowData?.[0]?.st_is_cert,
                  st_certificate_file: res.data.data.rowData?.[0]?.st_certificate_file,
                  src: res.data.data.rowData?.[0]?.st_is_cert,
                  view: 'https://uq-datastorage.s3.ap-southeast-1.amazonaws.com/writable/uploads/comman/certificate_image/GIA.webp',
                });
              }
              if (res.data.data.rowData?.[0]?.st_lab == "PLD") {
                data.push({
                  type: "cert",
                  st_is_cert: res.data.data.rowData?.[0]?.st_is_cert,
                  st_certificate_file: res.data.data.rowData?.[0]?.st_certificate_file,
                  src: res.data.data.rowData?.[0]?.st_is_cert,
                  view: 'https://uq-datastorage.s3.ap-southeast-1.amazonaws.com/writable/uploads/comman/certificate_image/PLD.webp',
                });
              }
              if (res.data.data.rowData?.[0]?.st_lab == "HRD") {
                data.push({
                  type: "cert",
                  st_is_cert: res.data.data.rowData?.[0]?.st_is_cert,
                  st_certificate_file: res.data.data.rowData?.[0]?.st_certificate_file,
                  src: res.data.data.rowData?.[0]?.st_is_cert,
                  view: 'https://uq-datastorage.s3.ap-southeast-1.amazonaws.com/writable/uploads/comman/certificate_image/HRD.webp',
                });
              }
              if (res.data.data.rowData?.[0]?.st_lab == "NC") {
                data.push({
                  type: "cert",
                  st_is_cert: res.data.data.rowData?.[0]?.st_is_cert,
                  st_certificate_file: res.data.data.rowData?.[0]?.st_certificate_file,
                  src: res.data.data.rowData?.[0]?.st_is_cert,
                  view: 'https://uq-datastorage.s3.ap-southeast-1.amazonaws.com/writable/uploads/comman/certificate_image/OTHER.webp',
                });
              }
              if (res.data.data.rowData?.[0]?.st_lab == "GCAL") {
                data.push({
                  type: "cert",
                  st_is_cert: res.data.data.rowData?.[0]?.st_is_cert,
                  st_certificate_file: res.data.data.rowData?.[0]?.st_certificate_file,
                  src: res.data.data.rowData?.[0]?.st_is_cert,
                  view: 'https://uq-datastorage.s3.ap-southeast-1.amazonaws.com/writable/uploads/comman/certificate_image/GCAL.webp',
                });
              }
              if (res.data.data.rowData?.[0]?.st_lab == "IGI") {
                data.push({
                  type: "cert",
                  st_is_cert: res.data.data.rowData?.[0]?.st_is_cert,
                  st_certificate_file: res.data.data.rowData?.[0]?.st_certificate_file,
                  src: res.data.data.rowData?.[0]?.st_is_cert,
                  view: "https://uq-datastorage.s3.ap-southeast-1.amazonaws.com/writable/uploads/comman/certificate_image/IGI.webp",
                });
              }
              if (res.data.data.rowData?.[0]?.st_lab == "EGL") {
                data.push({
                  type: "cert",
                  st_is_cert: res.data.data.rowData?.[0]?.st_is_cert,
                  st_certificate_file: res.data.data.rowData?.[0]?.st_certificate_file,
                  src: res.data.data.rowData?.[0]?.st_is_cert,
                  view: 'https://uq-datastorage.s3.ap-southeast-1.amazonaws.com/writable/uploads/comman/certificate_image/EGL.webp',
                });
              }
              if (res.data.data.rowData?.[0]?.st_lab == "GSI") {
                data.push({
                  type: "cert",
                  st_is_cert: res.data.data.rowData?.[0]?.st_is_cert,
                  st_certificate_file: res.data.data.rowData?.[0]?.st_certificate_file,
                  src: res.data.data.rowData?.[0]?.st_is_cert,
                  view: 'https://uq-datastorage.s3.ap-southeast-1.amazonaws.com/writable/uploads/comman/certificate_image/GSI.webp',
                });
              }
              if (res.data.data.rowData?.[0]?.st_lab == "OTHER") {
                data.push({
                  type: "cert",
                  st_is_cert: res.data.data.rowData?.[0]?.st_is_cert,
                  st_certificate_file: res.data.data.rowData?.[0]?.st_certificate_file,
                  src: res.data.data.rowData?.[0]?.st_is_cert,
                  view: 'https://uq-datastorage.s3.ap-southeast-1.amazonaws.com/writable/uploads/comman/certificate_image/OTHER.webp',
                });
              }
              if (res.data.data.rowData?.[0]?.st_lab == "NONE") {
                data.push({
                  type: "cert",
                  st_is_cert: res.data.data.rowData?.[0]?.st_is_cert,
                  st_certificate_file: res.data.data.rowData?.[0]?.st_certificate_file,
                  src: res.data.data.rowData?.[0]?.st_is_cert,
                  view: 'https://uq-datastorage.s3.ap-southeast-1.amazonaws.com/writable/uploads/comman/certificate_image/OTHER.webp',
                });
              }
            }
            setDiamondArrayImage(data);
            dispatch(storeDiamondArrayImage(data));
            dispatch(activeDIYtabs("Diamond"));
            setLoading(false);
          } else {
            setLoading(false);
          }
        } else {
          setToastOpen(true);
          setIsSuccess(false);
          setToastMsg(res.data.message);
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  //Initial API call
  useEffect(() => {
    if (Object.keys(storeEntityIds).length > 0) {
      if (!onceUpdated) {
        window.scrollTo(0, 0);
        diamondListData();
        setOnceUpdated(true);
        setLoading(true);
      }
    }
  }, [
    storeEntityIds,
    verticalCode,
    isLogin,
    loginDatas,
    onceUpdated,
  ]);

  //Filter of cart products 
  const isIncludeCard = () => {
    const item = cartProducts.filter(
      (elm) => elm.data?.[0]?.cert_no == diamondDataList.st_cert_no
    )[0];
    return item;
  };

  const setQuantityCartItem = (id, quantity) => {
    if (isIncludeCard()) {
      if (quantity >= 1) {
        const item = cartProducts.filter(
          (elm) => elm.data?.[0]?.cert_no == id
        )[0];
        const items = [...cartProducts];
        const itemIndex = items.indexOf(item);
        item.quantity = quantity;
        items[itemIndex] = item;
        const obj = {
          a: "updateCart",
          store_id: storeEntityIds.mini_program_id,
          unique_id: item.data?.[0]?.cart_id,
          qty: item.quantity,
          member_id: isLogin
            ? loginDatas.member_id
            : RandomId,
        };
        commanService
          .postLaravelApi("/CartMaster", obj)
          .then((res) => {
            if (res.data.success === 1) {
              setCartProducts(items);
              toast.success(res.data.message);
              getCartItems();
            }
          })
          .catch((error) => {
            setLoading(false);
            // toast.error(error.message);
          });
      }
    } else {
      setQuantity(quantity - 1 ? quantity : 1);
    }
  };

  //get cart
  const getCartItems = () => {
    const obj = {
      a: "getCart",
      origin: storeEntityIds.cmp_origin,
      // SITDeveloper: "1",
      store_id: storeEntityIds.mini_program_id,
      user_id: isLogin
        ? loginDatas.member_id
        : RandomId,
      customer_name: isLogin ? loginDatas.first_name : "guest",
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      per_page: "0",
      secret_key: storeEntityIds.secret_key,
      number: "0",
      store_type: "B2C",
    };
    setLoading(true);
    commanService
      .postLaravelApi("/CartMaster", obj)
      .then((res) => {
        if (res.data.success === 1) {
          setCartProducts(res?.data?.data);
          getCountData();
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        // toast.error(error.message);
      });
  };

  //add to cart
  const addToCart = (row) => {
    if (!isIncludeCard()) {
      const saveData = {
        DIAMO: [
          {
            id: row.st_cert_no,
            vertical_code: row.st_short_code,
            group_code: row.mi_item_group,
            qty: 1,
            product_title:
              isEmpty(row.st_shape) !== ""
                ? firstWordCapital(row.st_shape.split("-").join(" "))
                : "",
            product_name: row.product_name,
            item_base_price: row.final_total_display,
            currency_base_symbol: row.currency_code,
            product_diy: "PRODUCT",
          },
        ],
      };
      const obj = {
        a: "saveCart",
        currency: storeCurrencys,
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        current_user: isLogin
          ? loginDatas.member_id
          : RandomId,
        user_id: isLogin
          ? loginDatas.member_id
          : RandomId,
        store_id: storeEntityIds.mini_program_id,
        json_data: JSON.stringify(saveData),
        unique_id: "",
      };
      if (isLogin) {
        commanService
          .postLaravelApi("/CartMaster", obj)
          .then((res) => {
            if (res.data.success === 1) {
              toast.success(res.data.message);
              getCartItems();
              document
                .getElementById("cartDrawerOverlay")
                .classList.add("page-overlay_visible");
              document
                .getElementById("cartDrawer")
                .classList.add("aside_visible");
              // setCartProducts((pre) => [...pre, item]);
              // navigate("/cart");
            } else {
              toast.error(res.data.message);
              document
                .getElementById("cartDrawerOverlay")
                .classList.add("page-overlay_visible");
              document
                .getElementById("cartDrawer")
                .classList.add("aside_visible");
            }
          })
          .catch(() => { });
      } else {
        toast.error("Please Login first");
      }
    }
  };

  //DIY diamond select
  const seletedThisDiamondNew = () => {
    if (
      pathname.includes("/start-with-a-diamond") &&
      (IsSelectedDiamonds === true ||
        IsSelectedDiamonds === false) &&
      addedRingDatas.variant_data?.length
    ) {
      dispatch(addedDiamondData(diamondDataList));
      dispatch(diamondImage(diamondDataList.display_image));
      dispatch(diamondShape(diamondDataList.shape_name));
      dispatch(storeDiamondNumber(diamondNumbers));
      dispatch(isRingSelected(true));
      dispatch(activeDIYtabs("Complete"));
      dispatch(IsSelectedDiamond(true));
      // dispatch(diamondPageChnages(true))
      router.push(
        `/make-your-customization/start-with-a-diamond/jewellery/${addedRingDatas?.variant_data[0]?.product_name
          .replaceAll(" ", "-")
          .toLowerCase()}-${addedRingDatas?.variant_data[0]?.variant_unique_id
        }`
      );
    } else {

      dispatch(activeDIYtabs("Jewellery"));
      dispatch(addedDiamondData(diamondDataList));
      dispatch(diamondImage(diamondDataList.display_image));
      dispatch(diamondShape(diamondDataList.shape_name));
      dispatch(storeDiamondNumber(diamondNumbers));
      dispatch(isRingSelected(false));
      // setIsSelected(true);
      dispatch(IsSelectedDiamond(true));
      router.push(
        `/make-your-customization/start-with-a-diamond/${diamondDataList.product_name
          .replaceAll(" ", "-")
          .toLowerCase()}-${diamondDataList.st_cert_no}`
      );
    }
    // imageImportinSpecificationDiy();
  };

  //Certificate modal
  const certificateModal = (value) => {
    setCertiModal(true);
    setModalImageCertURl(value);
  };

  //Show certificate
  const showCertificate = (src) => {
    window.open(src, '_blank', '');
  };

  //Click certi modal
  const handleClickCertiModal = (elm) => {
    if (elm?.st_certificate_file === "1") {
      showCertificate(elm?.st_is_cert);
    } else {
      certificateModal(elm?.src);
    }
  }
  
  //Update state 
  useEffect(() => {
    if ((isItemDIY === true && perfumeVertical(isEmpty(sessionStorage.getItem("DIYVertical"))) !== true) || ((isJewelDiy === true || isDiamoDiy === true) && DiySteperDatas?.length > 0)) {
      dispatch(DiySteperData([]))
      dispatch(ActiveStepsDiy(0))
      router.push("/make-your-customization")
    }
    if (isEmpty(sessionStorage.getItem("DIYVertical")) === "" && isItemDIY === true) {
      dispatch(DiySteperData([]))
      dispatch(ActiveStepsDiy(0))
      router.push("/make-your-customization")
    }
  }, [])

  //meta
  var seoDataMenu = JSON.parse(sessionStorage.getItem("megaMenus"))?.navigation_data?.filter((item) => item.product_vertical_name.toLowerCase() === verticalCode.toLowerCase())[0];

  return (
    <section className="product-single max-diamond-width">
      
      {loading && <Loader />}
      {paramsItem === "DIY" ? (
        <>
          <DIYSteps
            calculatePrice={calculatePrice}
            selectedOffer={selectedOffer}
            isEngraving={isEngraving}
            isOffers={isOffers}
            handleFirstStep={handleFirstStep}
            handleComplete={handleComplete}
            handleBackToDiamond={handleBackToDiamond}
            finalTotal={finalTotal}
            salesTotalPrice={salesTotalPrice}
            productSKU={productSKU}
            certificateNumber={certificateNumber}
            stonePrice={stonePrice}
            stoneImageUrl={stoneImageUrl}
            complete={complete}
            isStone={isStone}
            finalCanBeSet={finalCanBeSet}
            diamondComplete={diamondComplete}
            diamondStepTwo={diamondStepTwo}
            setShowDiamondDetails={setShowDiamondDetails}
            isEmbossing={isEmbossing}
            embossingData={embossingData}
            serviceData={serviceData}
          />
        </>
      ) : (
        <></>
      )}
      <>
        <div className="d-flex justify-content-between pb-2">
          <div className="breadcrumb mb-0 d-none d-md-block flex-grow-1">
            <BreadCumb
              diamondDataList={diamondDataList}
              showDiamondDetails={showDiamondDetails}
              handleReset={handleReset}
            />
          </div>
          <div className="mb-0 d-md-block ">
            <div
              className={`fs-15 menu-link menu-link_us-s add-to-wishlist cursor-pointer`}
              onClick={() => {
                toggleDiamondDetails(false);
                dispatch(diamondPageChnages(false));
                dispatch(diamondNumber(""));
                router.push(window.location.pathname);
              }}
            >
              <span>Back</span>
            </div>
          </div>
          {/* <!-- /.breadcrumb --> */}

          {/* <div className="product-single__prev-next d-flex align-items-center justify-content-between justify-content-md-end flex-grow-1">
              <a className="text-uppercase fw-medium">
                <svg
                  className="mb-1px"
                  width="10"
                  height="10"
                  viewBox="0 0 25 25"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_prev_md" />
                </svg>
                <span className="menu-link menu-link_us-s">Prev</span>
              </a>
              <a className="text-uppercase fw-medium">
                <span className="menu-link menu-link_us-s">Next</span>
                <svg
                  className="mb-1px"
                  width="10"
                  height="10"
                  viewBox="0 0 25 25"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_next_md" />
                </svg>
              </a>
            </div> */}
          {/* <!-- /.shop-acs --> */}
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-7 mb-3 mb-lg-0">
            <Slider4
              diamondDataList={diamondDataList}
              diamondArrayImage={diamondArrayImage}
              IGI={IGI}
              stockId={stockId}
            />
          </div>
          <div className="col-lg-5">

            <h1 className="product-single__name">
              {Object.keys(diamondDataList).length > 0
                ? diamondDataList.product_name
                : ""}
            </h1>
            <div className="product-single__price">
              <span className="current-price">
                {Object.keys(diamondDataList).length > 0
                  ? diamondDataList?.currency_code +
                  " " +
                  diamondDataList?.ex_store_price_display
                  : ""}
              </span>
            </div>
            <div className="d-flex flex-wrap flex-column gap-2 mb-4">
              <div className="d-flex flex-row gap-2">
                <label className="fs-16 fw-medium">Certificate No: </label>
                <p className="fs-16 text-secondary mb-0">
                  {" "}
                  {diamondDataList?.st_lab}{" "}
                  {diamondDataList.st_cert_no}
                </p>
              </div>
              <div className="d-flex flex-row gap-2">
                <label className="fs-16 fw-medium">Shape : </label>
                <p className="fs-16 text-secondary mb-0">
                  {" "}
                  {diamondDataList.st_shape}
                </p>
              </div>
              <div className="d-flex flex-row gap-2">
                <label className="fs-16 fw-medium">Size : </label>
                <p className="fs-16 text-secondary mb-0">
                  {" "}
                  {diamondDataList.st_size}
                </p>
              </div>
              <div className="d-flex flex-row gap-2">
                <label className="fs-16 fw-medium">Color : </label>
                <p className="fs-16 text-secondary mb-0">
                  {" "}
                  {diamondDataList.st_color_type === '0' ? diamondDataList.st_col : diamondDataList.st_fancy_color}
                </p>
              </div>
              <div className="d-flex flex-row gap-2">
                <label className="fs-16 fw-medium">Clarity : </label>
                <p className="fs-16 text-secondary mb-0">
                  {" "}
                  {diamondDataList.st_cla}
                </p>
              </div>
            </div>
            {/*           
          <div className="product-single__short-desc">
            <p>{diamondData.item_description}</p>
          </div> */}
            <div className="product-single__addtocart">
              {/* <div className="qty-control position-relative">
              <input
                type="number"
                name="quantity"
                value={
                  isIncludeCard()
                    ? isIncludeCard().data?.[0]?.item_qty
                    : quantity
                }
                min="1"
                onChange={(e) =>
                  setQuantityCartItem(
                    diamondDataList?.st_cert_no,
                    e.target.value
                  )
                }
                className="qty-control__number text-center"
              />
              <div
                onClick={() => {
                  const newQuantity =
                    (isIncludeCard()?.data?.[0]?.item_qty || quantity) - 1;
                  setQuantityCartItem(
                    diamondDataList?.st_cert_no,
                    Math.max(newQuantity, 1)
                  );
                }}
                className="qty-control__reduce"
              >
                -
              </div>
              <div
                onClick={() => {
                  const newQuantity =
                    (isIncludeCard()?.data?.[0]?.item_qty || quantity) + 1;
                  setQuantityCartItem(diamondDataList?.st_cert_no, newQuantity); 
                }}
                className="qty-control__increase"
              >
                +
              </div>
            </div> */}
              {/* <!-- .qty-control --> */}
              <div className="d-flex flex-wrap">
                {pathname.includes("start-with-a-diamond") ? (
                  <button
                    className="btn btn-primary btn-add-cart fw-500 me-2 my-1"
                    onClick={() => seletedThisDiamondNew()}
                  >
                    {IsSelectedDiamonds === true
                      ? "SELECT THIS DIAMOND"
                      : "SELECT THIS DIAMOND"}
                  </button>
                ) : element === undefined ? (
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary btn-addtocart js-open-aside"
                      onClick={() => addToCart(diamondDataList)}
                    >
                      {isIncludeCard() ? "Already Added" : "Add to Cart"}
                    </button>
                  </div>
                ) : (
                  <>
                    {diamondDetailsPage.checked !== undefined ? (
                      <React.Fragment>
                        {diamondDetailsPage.checked === "true" ? (
                          <button
                            className="btn btn-primary btn-addtocart fw-500 me-2 my-1"
                            onClick={() => setStone(diamondDataList)}
                          >
                            {verticalCode == "GEDIA"
                              ? "SELECTED THIS GEMSTONE"
                              : "SELECTED THIS DIAMOND"}
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary btn-addtocart fw-500 me-2 my-1"
                            onClick={() => setStone(diamondDataList)}
                          >
                            {verticalCode == "GEDIA"
                              ? "SELECT THIS GEMSTONE"
                              : "SELECT THIS DIAMOND"}
                          </button>
                        )}
                      </React.Fragment>
                    ) : (
                      <button
                        className="btn btn-primary btn-addtocart fw-500 me-2 my-1"
                        onClick={() => setStone(diamondDataList)}
                      >
                        {verticalCode == "GEDIA"
                          ? "SELECT THIS GEMSTONE"
                          : "SELECT THIS DIAMOND"}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="product-single__addtolinks">
              <a
                href="#"
                className={`menu-link menu-link_us-s add-to-wishlist ${isAddedtoWishlist(diamondDataList?.st_cert_no) ? "active" : ""
                  }`}
                onClick={() => toggleWishlist(diamondDataList, "diamond")}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href={`${isAddedtoWishlist(diamondDataList?.st_cert_no) ? "#icon_heart_fill" : "#icon_heart"}`} />
                </svg>
                <span>{isAddedtoWishlist(diamondDataList?.st_cert_no) ? "Remove from Wishlist" : "Add to Wishlist"}</span>
              </a>
              <ShareComponent title={diamondDataList.title} />
            </div>
          </div>
        </div>
        <div className="pt-0 pt-lg-5 product-single__details-list">
          <h2 className="mb-4 product-single__details-list__title">Product Details</h2>
          <div className="product-single__details-list__content mb-0">
            <div className="row">
              <div className="col-md-6 col-lg-5 mb-4 mb-md-0">
                <div className="specification-addtional">
                  {diamondArrayImage?.length > 0 && diamondArrayImage?.map((item, i) => {
                    if (item.type !== "cert") return;
                    return (
                      <div className="specification-details-list" key={i}>
                        <label className="specification-title text-nowrap">Certificate</label>
                        <div className="specification-text" data-toggle="modal" data-target="#certiModal" onClick={() => handleClickCertiModal(item)}>
                          <div className="CertificateView">
                            <img alt="image" className="img-fluid" src={item.view} />
                            <span>View Report</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div className="specification-details-list">
                    <label className="specification-title text-nowrap">Lab</label>
                    <span className="specification-text">{diamondDataList.st_lab}</span>
                  </div>
                  <div className="specification-details-list">
                    <label className="specification-title text-nowrap">Shape</label>
                    <span className="specification-text">{diamondDataList.st_shape}</span>
                  </div>
                  <div className="specification-details-list">
                    <label className="specification-title text-nowrap">Carat</label>
                    <span className="specification-text">{diamondDataList.st_size}</span>
                  </div>
                  <div className="specification-details-list">
                    <label className="specification-title text-nowrap">Color</label>
                    <span className="specification-text">{diamondDataList.st_color_type === '0' ? diamondDataList.st_col : diamondDataList.st_fancy_color}</span>
                  </div>
                  <div className="specification-details-list">
                    <label className="specification-title text-nowrap">Clarity</label>
                    <span className="specification-text">{diamondDataList.st_cla}</span>
                  </div>
                  <div className="specification-details-list">
                    <label className="specification-title text-nowrap">Cut</label>
                    <span className="specification-text">{diamondDataList.st_cut}</span>
                  </div>
                  <div className="specification-details-list">
                    <label className="specification-title text-nowrap">Polish</label>
                    <span className="specification-text">{diamondDataList.st_pol}</span>
                  </div>
                  <div className="specification-details-list">
                    <label className="specification-title text-nowrap">Symmetry</label>
                    <span className="specification-text">{diamondDataList.st_sym}</span>
                  </div>
                  <div className="specification-details-list">
                    <label className="specification-title text-nowrap">Fluorescence</label>
                    <span className="specification-text">{diamondDataList.st_flou}</span>
                  </div>
                  <div className="specification-details-list">
                    <label className="specification-title text-nowrap">Certificate</label>
                    <span className="specification-text"> {diamondDataList.st_cert_no}</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-5">
                <div className="specification-addtional">
                  <div className="specification-details-list">
                    <label className="specification-title text-nowrap">Pavilion Depth</label>
                    <span className="specification-text"> {diamondDataList.st_pav_dep}</span>
                  </div>
                  <div className="specification-details-list">
                    <label className="specification-title text-nowrap">Table %</label>
                    <span className="specification-text">{diamondDataList.st_table_percentage}</span>
                  </div>
                  <div className="specification-details-list">
                    <label className="specification-title text-nowrap">Girdle %</label>
                    <span className="specification-text"> {diamondDataList.st_gird_per}</span>
                  </div>
                  <div className="specification-details-list">
                    <label className="specification-title text-nowrap">Crown Angle</label>
                    <span className="specification-text"> {diamondDataList.st_cr_ang}</span>
                  </div>
                  <div className="specification-details-list">
                    <label className="specification-title text-nowrap">Pavilion Angle</label>
                    <span className="specification-text"> {diamondDataList.st_pav_ang}</span>
                  </div>
                  <div className="specification-details-list">
                    <label className="specification-title text-nowrap">Culet</label>
                    <span className="specification-text">{diamondDataList.st_culet}</span>
                  </div>
                  <div className="specification-details-list">
                    <label className="specification-title text-nowrap">Depth</label>
                    <span className="specification-text">{diamondDataList.st_depth}</span>
                  </div>
                  <div className="specification-details-list">
                    <label className="specification-title text-nowrap">Length</label>
                    <span className="specification-text"> {diamondDataList.st_length}</span>
                  </div>
                  <div className="specification-details-list">
                    <label className="specification-title text-nowrap">Width</label>
                    <span className="specification-text">{diamondDataList.st_width}</span>
                  </div>
                  <div className="specification-details-list">
                    <label className="specification-title text-nowrap">Measurement</label>
                    <span className="specification-text">
                      {" "}
                      {isEmpty(diamondDataList.st_length) +
                        " X " +
                        isEmpty(diamondDataList.st_width) +
                        " X " +
                        isEmpty(diamondDataList.st_depth)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
      {certiModal && (
        <div
          className="modal fade"
          id="certiModal"
          tabIndex="-1"
          aria-hidden="true"
          data-bs-backdrop="static"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Certificate #{stockId}</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    setCertiModal(false);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <iframe
                  aria-labelledby="test"
                  src={ModalImageCertURl}
                  width="100%"
                  height="500px"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CertificateDiamondDetails;
