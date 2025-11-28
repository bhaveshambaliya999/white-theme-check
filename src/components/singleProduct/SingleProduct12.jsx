import React, { useCallback, useEffect, useRef, useState } from "react";
import ProductSlider1 from "./sliders/ProductSlider1";
import Size from "./Size";
import AdditionalInfo from "./AdditionalInfo";
import { useRouter } from "next/router";
import ShareComponent from "../common/ShareComponent";
import { useContextElement } from "@/context/Context";
import { useDispatch, useSelector } from "react-redux";
import commanService from "@/CommanService/commanService";
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
import { toast } from "react-toastify";
import BreadCumb from "../shoplist/BreadCumb";
import Loader from "@/CommanUIComp/Loader/Loader";
import OutsideClickHandler from "react-outside-click-handler";
import CertificateDiamond from "../shoplist/CertificateDiamond";
import {
  activeDIYtabs,
  activeImageData,
  ActiveStepsDiy,
  addedDiamondData,
  addedRingData,
  allFilteredData,
  caratVlaues,
  diamondDIYimage,
  diamondDIYName,
  diamondImage,
  diamondNumber,
  diamondPageChnages,
  diamondSelectShape,
  diamondShape,
  dimaondColorType,
  DiySteperData,
  engravingObj,
  filterData,
  filteredData,
  finalCanBeSetData,
  isFilter,
  isRingSelected,
  IsSelectedDiamond,
  jeweleryDIYimage,
  jeweleryDIYName,
  otherServiceData,
  previewImageDatas,
  saveEmbossings,
  serviceAllData,
  stepperDIY,
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
import DIYSteps from "../shoplist/DIYSteps";
import GIA from "@/assets/images/GIA.jpg";
import HRD from "@/assets/images/HRD.jpg";
import IGI from "@/assets/images/IGI.jpg";
import video from "@/assets/images/video.png";
import { Rating } from "react-simple-star-rating";
import Slider4 from "./sliders/Slider4";
import EmbossingPreview from "../modals/EmbossingPreview";
import { Tooltip } from "react-tooltip";
import DIYSetupAP from "../shoplist/DIYSetupAP";
import RelatedSlider from "./RelatedSlider";
import { useParams, usePathname } from "next/navigation";
import Image from "next/image";
import { Accordion } from "react-bootstrap";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function SingleProduct12(props) {
  const isCallRef = useRef(false);
  const { cartProducts, setCartProducts, getCountData } = useContextElement();
  const [quantity, setQuantity] = useState(1);
  const [qty, setQty] = useState(1);

  //State Declerations
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const reduxLoginData = useSelector((state) => state.loginData);
  const reduxStoreCurrency = useSelector((state) => state.storeCurrency);

  const loginDatas =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("loginData")) || reduxLoginData
      : reduxLoginData;

  const storeCurrencys =
    typeof window !== "undefined"
      ? sessionStorage.getItem("storeCurrency") || reduxStoreCurrency
      : reduxStoreCurrency;

  const storeSpecDatas = useSelector((state) => state.storeSpecData);
  const finalCanBeSetDatas = useSelector((state) => state.finalCanBeSetData);
  const addedDiamondDatas = useSelector((state) => state.addedDiamondData);
  const activeDIYtabss = useSelector((state) => state.activeDIYtabs);
  const IsSelectedDiamonds = useSelector((state) => state.IsSelectedDiamond);
  const isRingSelecteds = useSelector((state) => state.isRingSelected);
  const storeProdDatas = useSelector((state) => state.storeProdData);
  const serviceAllDatas = useSelector((state) => state.serviceAllData);
  const otherServiceDatas = useSelector((state) => state.otherServiceData);
  const storeSelectedDiamondPrices = useSelector(
    (state) => state.storeSelectedDiamondPrice
  );
  const storeSelectedDiamondDatas = useSelector(
    (state) => state.storeSelectedDiamondData
  );
  const addedRingDatas = useSelector((state) => state.addedRingData);
  const storeEmbossingDatas = useSelector((state) => state.storeEmbossingData);
  const previewImageDatass = useSelector((state) => state.previewImageDatas);
  const saveEmbossingss = useSelector((state) => state.saveEmbossings);
  const activeImageDatas = useSelector((state) => state.activeImageData);
  const DiySteperDatas = useSelector((state) => state.DiySteperData);
  const ActiveStepsDiys = useSelector((state) => state.ActiveStepsDiy);

  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const inputRef = useRef(null);
  var megaMenu = JSON.parse(
    sessionStorage.getItem("megaMenus")
  )?.navigation_data?.filter(
    (item) =>
      item.menu_name?.replaceAll(" ", "-")?.toLowerCase() ===
      params.verticalCode?.toLowerCase()
  )[0];
  let vertical_code = params.verticalCode
    ? megaMenu?.product_vertical_name ?? params.verticalCode
    : "";

  const { toggleWishlist, isAddedtoWishlist } = useContextElement();
  const { addProductToCart, isAddedToCartProducts } = useContextElement();
  const isJewelDiy = pathname.includes("start-with-a-setting");
  const isDiamoDiy = pathname.includes("start-with-a-diamond");
  const isItemDIY = pathname.includes("start-with-a-item");
  const paramsItems = isDiamoDiy || isJewelDiy || isItemDIY ? "DIY" : "PRODUCT";
  const [paramsItem, setparamsItem] = useState(paramsItems);
  var callingJewel = "false";
  const isLogin = loginDatas && Object.keys(loginDatas).length > 0;
  const varaintId = props.campaignId
    ? props.variantId.split("-").pop().toUpperCase()
    : isEmpty(props.variantId) !== ""
    ? props.variantId.split("-").pop().toUpperCase()
    : props.variantId;
  let allDataSpec = DiySteperDatas?.find(
    (item) => item.variant_id === varaintId
  );
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [itemsLength, setItemLength] = useState(Array.from({ length: 1 }));
  const [hasMore, setHasMore] = useState(true);
  const [onceUpdated, setOnceUpdated] = useState(false);
  const [filterProduct, setFilterProduct] = useState([]);
  const [itemId, setItemId] = useState("");
  const [storeVariantId, setStoreVariantId] = useState("");
  const [metalType, setMetalType] = useState("");
  const [productType, setProductType] = useState("");
  const [selectedShape, setselectedShape] = useState("");
  const [selectedColor, setselectedColor] = useState("");
  const [canBeSetData, setCanBeSetData] = useState([]);
  const [filterParameter, setFilterParameter] = useState([]);
  const [canBeSetWithVariant, setCanBesetWithVariant] = useState("");
  const [columName, setColumName] = useState("");
  const [tabDataone, setTabDataDone] = useState(true);
  const [productData, setProductData] = useState(
    pathname.includes("start-with-a-setting") || isItemDIY ? storeProdDatas : {}
  );
  const [specificationData, setSpecificationData] = useState(
    pathname.includes("start-with-a-diamond") ||
      pathname.includes("start-with-a-setting") ||
      isItemDIY
      ? storeSpecDatas
      : {}
  );
  const [relatedProductObj, setRelatedProductObj] = useState({});
  const [relatedProductData, setRelatedProductData] = useState([]);
  const [isEndReached, setIsEndReached] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [hasMoreRelated, setHasMoreRelated] = useState(false);
  const [count, setCount] = useState(1);
  const [totalPagesRelated, setTotalPagesRelated] = useState("");
  const [serviceData, setServiceData] = useState(serviceAllDatas ?? []);

  const [otherService, setOtherService] = useState(otherServiceDatas ?? []);

  const [storeVariantCount, setStoreVariantCount] = useState(0);
  var [active, setActive] = useState(0);
  var [lastActive, setLastActive] = useState(0);
  const [storeTabVariantInfo, setStoreTabVariant] = useState({
    a: "getStoreVariantDetails",
    miniprogram_id: "",
    tenant_id: "",
    product_variant: "",
    item_id: "",
    system_id: "",
    entity_id: "",
    secret_key: "",
    store_type: "B2C",
    product_diy: "",
    origin: "",
    SITDeveloper: "1",
    per_page: 0,
    number: 0,
  });
  const [bomDataList, setBomDataList] = useState([]);
  const [labourDataList, setLabourDataList] = useState([]);
  const [columnsForSpecification, setColumnsForSpecification] = useState([]);
  const [selectedTab, setSelectedTab] = useState([]);
  const [keyTabView, setKeyTabView] = useState("Specification");
  const [tabListClick, setTabListClick] = useState("Specification");
  const [diamondSummary, setdiamondSummary] = useState([]);
  const [diamondSummaryname, setdiamondSummaryname] = useState([]);
  const [secondDiamondSummary, setSecondDiamondSummary] = useState([]);
  const [secondDiamondSummaryname, setSecondDiamondSummaryname] = useState([]);
  const [currency, setCurrency] = useState(storeCurrencys);
  const [selectedOffer, setSelectedOffer] = useState([]);
  const [storeVariantDataList, setStoreVariantDataList] = useState([]);
  const [canBeSetWithDataList, setCanBeSetWithDataList] = useState([]);

  const [isOffers, setIsOffers] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [engravingText, setEngravingText] = useState(
    allDataSpec?.engravingText ?? ""
  );
  const [isItalicFont, setIsItalicFont] = useState(
    allDataSpec?.isItalicFont ?? false
  );
  const [isEngraving, setIsEngraving] = useState(
    allDataSpec?.isEngraving ?? false
  );
  const [engravingTexts, setEngravingTexts] = useState(
    allDataSpec?.engravingTexts ?? ""
  );

  const [saveEngraving, setSaveEngraving] = useState(
    allDataSpec?.saveEngraving ?? false
  );
  const [engravingFontSize, setEngravingFontSize] = useState("");
  const [engravingData, setEngravingData] = useState(
    allDataSpec?.engravingData ?? {}
  );
  // Grid and Table View
  const [viewType, setViewType] = useState("jewelery");
  // Set Stone model
  const [showStoneModal, setShowStoneModal] = useState(false);
  const [modalTrue, setModalTrue] = useState(false);

  // Review customer
  const [reviewCustomerData, setReviewCustomerData] = useState([]);
  const [reviewCutomer, setReviewCustomer] = useState([]);
  const [globalRating, setGlobalRating] = useState(0);
  const [globalRatingStar, setGlobalRatingStar] = useState(0);
  const [reviewSummary, setReviewSummary] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  //story
  const [storyDataList, setStoryDataList] = useState([]);

  // Set Stones
  const [stoneActive, setStoneActive] = useState({});
  const [DIYShapesDataList, setDIYShapesDataList] = useState([]);
  const [DIYSizeDataList, setDIYSizeDataList] = useState([]);
  const [DIYClarityDataList, setDIYClarityDataList] = useState([]);
  const [shapeStoneActive, setShapeStoneActive] = useState({});
  const [sizeStoneActive, setSizeStoneActive] = useState({});
  const [stonesNo, setStonesNo] = useState("");
  const [finalCanBeSet, setFinalCanBeSet] = useState(finalCanBeSetDatas ?? []);

  const [stoneTypeData, setStoneTypeData] = useState([]);
  const [stoneTypeDataActive, setStoneTypeDataActive] = useState({});
  const [stoneCanBeSetArr, setStoneCanBeSetArr] = useState([]);
  const [clarityWithColor, setClarityWithColor] = useState("");
  const [clarityColorObj, setClarityColorObj] = useState([]);
  const [finalStoneArr, setFinalStoneArr] = useState([]);

  const [selectedDiamond, setSelectedDiamond] = useState(
    addedDiamondDatas ?? {}
  );
  const [isDiamondSelected, setIsDiamondSelected] = useState(false);
  const [canBeSets, setCanBeSets] = useState("");
  // DIY Canbeset Data
  const [DIYBomId, setDIYBomId] = useState("");
  const [DIYComId, setDIYComId] = useState("");
  const [stoneTypeArr, setStoneTypeArr] = useState([]);
  var [verticalCode, setVerticalCode] = useState("");
  const [stoneElement, setStoneElement] = useState({});
  let [callFirstTime, setCallFirstTime] = useState(true);
  const [salesTotalPrice, setSalesTotalPrice] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [stonePrice, setStonePrice] = useState(0);
  const [stoneObj, setStoneObj] = useState({});
  const [deliveryDate, setDeliveryDate] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleShowConfirm = () => setShowConfirm(true);
  const handleClose = () => setShowConfirm(false);
  // Diamond Image Slider
  // let [diamondImage, setDiamondImage] = useState("");
  let [diamondArrayImage, setDiamondArrayImage] = useState([]);
  const [isStone, setIsStone] = useState(false);
  const [isStoneSelected, setIsStoneSelected] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(false);
  // List & Toggle slider
  const [listandToggle, setListandToggle] = useState(true);
  const [productSKU, setProductSKU] = useState("");
  const [finalTotal, setFinalTotal] = useState(0);

  //DIY Items
  const [activeStep, setActiveStep] = useState(ActiveStepsDiys ?? 0);
  const [typeViewDiy, setTypeViewDiy] = useState(false);

  //Embossing
  const [embossingData, setEmbossingData] = useState(storeEmbossingDatas ?? []);

  const [embossingArea, setEmbossingArea] = useState([]);
  const [embossingModalView, setEmbossingModalView] = useState(false);
  const [embossingPreviewModalView, setEmbossingPreviewModalView] =
    useState(false);
  const [embossingPreviewModalBaseView, setEmbossingPreviewModalBaseView] =
    useState(false);
  const [imageForPreview, setImageForPreview] = useState(false);
  const [previewImageData, setPreviewImageData] = useState(
    previewImageDatass ?? []
  );

  const [embossingPreview, setEmbossingPreview] = useState(false);
  const [SaveEmbossing, setSaveEmbossing] = useState(saveEmbossingss ?? false);
  const [logoSrc, setLogoSrc] = useState(null);
  const [localData, setLocalData] = useState(null);

  const [dialogRef, setDialogRef] = useState(null);

  const [callingFrom, setCallingFrom] = useState("");
  const [embPostionEle, setEmbPostionEle] = useState("");
  const [imageDataList, setImageDataList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [activeImg, setActiveImg] = useState(activeImageDatas ?? []);

  const [activeImgSave, setActiveImgSave] = useState(activeImageDatas ?? []);
  const [embImgPostion, setEmbImgPostion] = useState({});
  const [previewImage, setPreviewImage] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [upListener, setUpListener] = useState(null);
  const [moveListener, setMoveListener] = useState(null);
  const [boxes, setBoxes] = useState({});

  const [startX, setStartX] = useState({ left: 0, top: 0 });
  const [startY, setStartY] = useState({ width: 0, height: 0 });
  const [startXy, setStartXy] = useState({ left: 0, top: 0 });

  const imgContainer = useRef(null);
  const imgContainers = useRef(null);

  //Product breakup
  const [productBreakupData, setProductBreakupData] = useState({
    basePrice: "0",
    servicePrice: [],
    discountPrice: "0",
    unitPrice: "0",
    diamondPriceDIY: "0",
    subTotal: "0",
    qty: qty,
    taxPrice: "0",
    customDutyTax: "0",
    totalPrice: "0",
  });

  //Render side effect for getting image area
  useEffect(() => {
    if (imgContainer.current) {
      addBox(true);
    }
  }, [callingFrom, imageDataList, selectedIndex]);

  //Initial Call for getting embossing object data
  useEffect(() => {
    if (activeImg?.length === 0) {
      const Data = specificationData?.variant_data?.[0]?.image_urls;

      const datas = specificationData;
      let updatedImageDataList = [...imageDataList]; // Create a copy of the current state

      datas?.variant_data?.[0]?.image_types.forEach((type, index) => {
        // Condition to set previewImage only when necessary
        if (
          embImgPostion[index] && // Check if embImgPostion[index] is not empty
          previewImage["file_url"] === ""
        ) {
          setPreviewImage((prev) => ({
            ...prev,
            file_url: Data[index],
            image_area: embImgPostion[index],
          }));
        }

        // Add image to imageDataList if type is not 'Video' or '360 View' and embImgPostion is not empty
        if (type !== "Video" && type !== "360 View") {
          let parsedEmbossingArea = embossingArea[index];
          if (typeof parsedEmbossingArea === "string") {
            try {
              parsedEmbossingArea = JSON.parse(parsedEmbossingArea);
            } catch (e) {
              // console.error("Error parsing embossingArea:", e);
            }
          }
          updatedImageDataList.push({
            type: type,
            url: Data[index] || "",
            area: parsedEmbossingArea,
            price: embossingData?.[0]?.service_rate,
            currency: embossingData?.[0]?.msrv_currency,
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

      setActiveImg(updatedImageDataList.filter((item) => item.area !== ""));
      setActiveImgSave(updatedImageDataList.filter((item) => item.area !== ""));
      // dispatch(activeImageData(updatedImageDataList.filter(item => item.area !== "")))
      // Set the updated imageDataList after the loop
      setImageDataList(updatedImageDataList);
    }
    // Set the updated imageDataList

    // Cleanup listeners on component unmount
    return () => {
      document.removeEventListener("mousemove", imgOnMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", imgOnMouseMove);
      document.removeEventListener("touchend", onMouseUp);
    };
  }, [specificationData, dispatch, serviceData]);

  //function for getting image area
  const addBox = (isTrue) => {
    const container = imgContainer.current;
    if (isTrue) {
      if (embPostionEle["image_area"]) {
        const percentageValues = JSON.parse(embPostionEle["image_area"]);
        setBoxes({
          left: (percentageValues.left / 100) * container.width,
          top: (percentageValues.top / 100) * container.height,
          width: (percentageValues.width / 100) * container.width,
          height: (percentageValues.height / 100) * container.height,
        });
        setEmbImgPostion(percentageValues);
      }
    } else {
      setBoxes({
        left: container.width * 0.1,
        top: container.height * 0.1,
        width: container.width * 0.2,
        height: container.height * 0.2,
      });
      setEmbImgPostion({
        left: (0.1 * 100).toFixed(2),
        top: (0.1 * 100).toFixed(2),
        width: (0.2 * 100).toFixed(2),
        height: (0.2 * 100).toFixed(2),
      });
    }
  };

  // On click selected tab index store
  const changeImage = (data, i) => {
    // setActiveImg(data);
    setSelectedIndex(i);
  };

  // Getting Area in to inch
  const updateInchDimensions = () => {
    if (!imgContainers.current || !activeImg?.embImageArea) {
      console.error("Image container or active image area is not defined.");
      return;
    }

    const parentRect = imgContainers.current.getBoundingClientRect();
    const imgArea = activeImg.embImageArea;

    const currentPixelWidth = (parentRect.width * imgArea.width) / 100;
    const currentPixelHeight = (parentRect.height * imgArea.height) / 100;

    // Convert pixel dimensions to inches
    const pixelsToInchesRatio = 10;
    const widthInInches = (currentPixelWidth / pixelsToInchesRatio).toFixed(2);
    const heightInInches = (currentPixelHeight / pixelsToInchesRatio).toFixed(
      2
    );

    setActiveImg((prevState) =>
      prevState.map((item, i) => {
        if (i === selectedIndex) {
          return {
            ...item,
            widthInInches: widthInInches,
            heightInInches: heightInInches,
          };
        }
        return item;
      })
    );
  };

  // Onchcange event for upload embossing Image
  const changeEmboFile = (event) => {
    const extension = event.target.files[0]?.name
      .split(".")
      .pop()
      .toLowerCase();

    if (
      extension === "jpg" ||
      extension === "png" ||
      extension === "jpeg" ||
      extension === "webp"
    ) {
      activeImg.binaryFile = event.target.files[0];
      event.target.value = "";
      addEmbImage();
    } else {
      toast.error("Only JPG,JPEG,PNG AND WEBP Files Are Allowed.");
    }
  };

  //Update embossing Image
  const addEmbImage = async () => {
    const obj = {
      a: "UploadEmbossingImages",
      SITDeveloper: 1,
      item_id: itemId,
      create_by: storeEntityIds.mini_program_id,
      entity_id: storeEntityIds.entity_id,
      tenant_id: storeEntityIds.tenant_id,
    };

    const imageFormData = new FormData();
    if (activeImg.binaryFile) {
      imageFormData.append(
        "image",
        activeImg.binaryFile,
        activeImg.binaryFile.name
      );
    }
    imageFormData.append("json", JSON.stringify(obj));

    if (activeImg.binaryFile) {
      setLoading(true);
      commanService
        .postApi("/MasterTableSecond", imageFormData)
        .then((response) => {
          if (response.data.success === 1) {
            setActiveImg((prevState) =>
              prevState.map((item, i) => {
                if (i === selectedIndex) {
                  return {
                    ...item,
                    embImage: response.data.data,
                    binaryFile: null,
                    embImageArea: {
                      left: 20,
                      top: 20,
                      width: 50,
                      height: 50,
                    },
                  };
                }
                return item;
              })
            );

            setImageForPreview(true);
            // updateInchDimensions();
          } else {
            // setActiveImg((prevState) => ({ ...prevState, embImage: '' }));
          }
          setLoading(false);
        });
    }
  };

  //function for Dragging image in to selected area
  const imgStartDrag = (event, data, index) => {
    // event.preventDefault();

    const isTouch = event.type === "touchstart";
    const clientX = isTouch ? event.touches[0].clientX : event.clientX;
    const clientY = isTouch ? event.touches[0].clientY : event.clientY;

    if (!data?.embImageArea) return;

    const embossingArea = document
      .querySelector(`#embossing-img-${index}`)
      .getBoundingClientRect();
    const resizableImg = event.target
      .closest(`#resizable-img-${index}`)
      .getBoundingClientRect();

    let offsetX = clientX - resizableImg.left;
    let offsetY = clientY - resizableImg.top;

    const onMove = (moveEvent) => {
      const moveX = isTouch ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const moveY = isTouch ? moveEvent.touches[0].clientY : moveEvent.clientY;

      let newLeft = moveX - offsetX - embossingArea.left;
      let newTop = moveY - offsetY - embossingArea.top;

      newLeft = Math.max(
        0,
        Math.min(embossingArea.width - resizableImg.width, newLeft)
      );
      newTop = Math.max(
        0,
        Math.min(embossingArea.height - resizableImg.height, newTop)
      );

      setActiveImg((prevState) =>
        prevState.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              embImageArea: {
                ...item.embImageArea,
                left: (newLeft / embossingArea.width) * 100,
                top: (newTop / embossingArea.height) * 100,
              },
            };
          }
          return item;
        })
      );
    };

    const onEnd = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd);
  };

  // Handle Resizing
  const imgResizeStart = (event, data, index) => {
    // event.preventDefault();
    // event.stopPropagation();

    const isTouch = event.type === "touchstart";
    const clientX = isTouch ? event.touches[0].clientX : event.clientX;
    const clientY = isTouch ? event.touches[0].clientY : event.clientY;

    const embossingArea = document
      .querySelector(`#embossing-img-${index}`)
      .getBoundingClientRect();

    setIsResizing(true);
    setStartX({ left: clientX, top: clientY });
    setStartY({
      width: data.embImageArea.width,
      height: data.embImageArea.height,
    });

    const onMove = (moveEvent) => {
      const moveX = isTouch ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const moveY = isTouch ? moveEvent.touches[0].clientY : moveEvent.clientY;

      const deltaX = moveX - startX.left;
      const deltaY = moveY - startX.top;

      let newWidth = startY.width + (deltaX / embossingArea.width) * 100;
      let newHeight = startY.height + (deltaY / embossingArea.height) * 100;

      newWidth = Math.max(5, Math.min(100 - data.embImageArea.left, newWidth));
      newHeight = Math.max(5, Math.min(100 - data.embImageArea.top, newHeight));

      setActiveImg((prevState) =>
        prevState.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              embImageArea: {
                ...item.embImageArea,
                width: newWidth,
                height: newHeight,
              },
            };
          }
          return item;
        })
      );
    };

    const onEnd = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd);
  };

  //Function for Move Embossing image in to selected area
  const imgOnMouseMove = (event) => {
    if (!isDragging && !isResizing) return;

    const parentRect = document
      .querySelector(`#embossing-img`)
      .getBoundingClientRect();
    let updatedImageArea = { ...activeImg?.[selectedIndex]?.embImageArea };

    if (isResizing) {
      const deltaX = event.clientX - startX.left;
      const deltaY = event.clientY - startX.top;

      let newWidth = startY.width + (deltaX / parentRect.width) * 100;
      let newHeight = startY.height + (deltaY / parentRect.height) * 100;

      newWidth = Math.max(5, Math.min(100 - updatedImageArea.left, newWidth));
      newHeight = Math.max(5, Math.min(100 - updatedImageArea.top, newHeight));

      updatedImageArea.width = newWidth;
      updatedImageArea.height = newHeight;
    }

    setActiveImg((prevState) =>
      prevState.map((item, i) => {
        if (i === selectedIndex) {
          return {
            ...item,
            embImageArea: updatedImageArea,
          };
        }
        return item;
      })
    );
  };

  //State update when Mouse moves
  const onMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    document.removeEventListener("mousemove", imgOnMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  //Function for image Alignment to relative position
  const centerImage = (type) => {
    setActiveImg((prevState) =>
      prevState.map((item, i) => {
        if (i === selectedIndex) {
          const imgElement = item.embImageArea;
          const parentElement = document.querySelector(`#embossing-img-${i}`);

          if (!imgElement || !parentElement) return item;

          let updatedArea = { ...imgElement };

          // Horizontal update
          if (type === "horizontal") {
            const parentWidth = parentElement.clientWidth;
            const imgWidth = (parentWidth * imgElement.width) / 100;
            updatedArea.left =
              ((parentWidth - imgWidth) / 2 / parentWidth) * 100;
          }

          // Vertical update
          if (type === "vertical") {
            const parentHeight = parentElement.clientHeight;
            const imgHeight = (parentHeight * imgElement.height) / 100;
            updatedArea.top =
              ((parentHeight - imgHeight) / 2 / parentHeight) * 100;
          }

          // Return updated item
          return {
            ...item,
            embImageArea: updatedArea,
          };
        }

        // Return other items unchanged
        return item;
      })
    );
  };

  //Function function for image alignment accordingly
  const centerBoth = () => {
    centerImage("horizontal");
    centerImage("vertical");
  };

  //Hanlde to save Embossing details
  const setSaveEmbossDetail = () => {
    if (
      (imageForPreview &&
        activeImg?.some((item) => item.embImage !== "") == true) ||
      previewImageData?.length > 0
    ) {
      const savedData = activeImg?.filter((item) => item.embImage !== "");
      const parsedData = savedData.map((item) => {
        let areas = item.area;

        // if (typeof areas === 'string') {
        //   try {
        //     areas = JSON.parse(areas);
        //   } catch (e) {
        //     // console.error("Error parsing area:", e);
        //   }
        // }
        return { ...item, areas };
      });
      dispatch(activeImageData(activeImg));
      setActiveImgSave(activeImg);
      setPreviewImageData(parsedData);
      dispatch(previewImageDatas(parsedData));
      setEmbossingPreview(true);
      setSaveEmbossing(true);
      dispatch(saveEmbossings(true));
      setEmbossingModalView(false);
      setSelectedIndex(0);
    } else {
      setImageForPreview(false);
      setSaveEmbossing(false);
      dispatch(saveEmbossings(false));
      toast.error("Please Set Embossing Image");
      setEmbossingModalView(true);
    }
  };

  //Handle TO reset embossing Image details
  const setSaveEmbossDetailReset = () => {
    const activeImgObj = activeImg.map((item) => ({
      ...item,
      embImage: "",
      binaryFile: null,
      embImageArea: {
        left: 20,
        top: 20,
        width: 50,
        height: 50,
      },
    }));
    setActiveImg(activeImgObj);
    setActiveImgSave(activeImgObj);
    dispatch(activeImageData(activeImgObj));
    setSelectedIndex(0);
    setPreviewImageData([]);
    dispatch(previewImageDatas([]));
    setEmbossingPreview(false);
    setSaveEmbossing(false);
    dispatch(saveEmbossings(false));
    setEmbossingModalView(false);
    setEmbossingPreviewModalBaseView(false);
    setEmbossingPreviewModalView(false);
  };

  //function for updating state when open modal for embossing
  const handleSetStateChange = (value) => {
    setEmbossingModalView(false);
    setEmbossingPreviewModalBaseView(value);
    setEmbossingPreviewModalView(value);
    setSelectedIndex(0);
    // setActiveImg([])
  };

  //Set Stone Modal view or hide
  useEffect(() => {
    let bootstrap;
    (async () => {
      if (typeof window !== "undefined") {
        bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");

        const modalElement = document.getElementById("setStoneModal");
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement, { keyboard: false });
          showStoneModal ? modal.show() : modal.hide();
        }
      }
    })();
  }, [showStoneModal]);

  useEffect(() => {
    let bootstrap;
    (async () => {
      if (typeof window !== "undefined") {
        bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");

        const modalElement = document.getElementById("embossingPreview");
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement, { keyboard: false });
          embossingPreviewModalBaseView ? modal.show() : modal.hide();
        }
      }
    })();
  }, [embossingPreviewModalBaseView]);

  useEffect(() => {
    let bootstrap;
    (async () => {
      if (typeof window !== "undefined") {
        bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");

        const modalElement = document.getElementById("setEmbossing");
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement, { keyboard: false });
          embossingModalView ? modal.show() : modal.hide();
        }
      }
    })();
  }, [embossingModalView]);

  //Filter Item id to get Itemid wise product data form cart data
  const isIncludeCard = () => {
    const item = cartProducts.filter(
      (elm) => elm.data?.[0]?.item_id == specificationData.item_id
    )[0];

    return item;
  };

  //Filter Item id to get Itemid wise product data form cart data in DIY
  const isIncludeCardDiy = () => {
    return DiySteperDatas.map((spec) => {
      const itemInCart = cartProducts.find(
        (elm) => elm?.item_id === spec?.item_id && elm.quantity >= 1
      );
      return itemInCart || null;
    }).filter((item) => item !== null)[0];
  };

  // Update function for update quantity for DIY
  const setQuantityCartItem = (id, quantity) => {
    const updateCart = (uniqueId, quantity) => {
      const obj = {
        a: "updateCart",
        store_id: storeEntityIds.mini_program_id,
        unique_id: uniqueId.toString(),
        qty: quantity,
        member_id: isLogin ? loginDatas.member_id : RandomId,
      };
      commanService
        .postLaravelApi("/CartMaster", obj)
        .then((res) => {
          if (res.data.success === 1) {
            setCartProducts([...cartProducts]);
            toast.success(res.data.message);
            getCartItems();
          }
        })
        .catch((error) => {
          setLoading(false);
          // toast.error(error.message);
        });
    };

    if (isItemDIY) {
      if (quantity > 1) {
        const diyItemIds = DiySteperDatas.map((elm) => elm?.item_id).filter(
          (itemId) => itemId !== undefined
        );

        const filteredCartProducts = cartProducts.filter((cartItem) =>
          diyItemIds.every((itemId) =>
            cartItem?.data?.some((dataItem) => dataItem?.item_id === itemId)
          )
        );

        const cartIds = filteredCartProducts[0]?.data
          ?.map((elm) => elm?.cart_id)
          .filter((itemId) => itemId !== undefined);

        if (cartIds?.length) {
          setQty(quantity);
          updateCart(cartIds, quantity);
        }
      } else {
        setQty(quantity - 1 ? quantity : 1);
        setQuantity(quantity - 1 ? quantity : 1);
      }
    } else {
      const item = cartProducts.find((elm) => elm?.data?.[0]?.item_id == id);
      if (item && quantity >= 1) {
        item.quantity = quantity;
        setQty(quantity);
        updateCart(item.data?.[0]?.cart_id, quantity);
      } else {
        setQty(quantity - 1 ? quantity : 1);
        setQuantity(quantity - 1 ? quantity : 1);
      }
    }
  };

  //Get cart items list
  const getCartItems = () => {
    const obj = {
      a: "getCart",
      origin: storeEntityIds.cmp_origin,
      // SITDeveloper: "1",
      store_id: storeEntityIds.mini_program_id,
      user_id: isLogin ? loginDatas.member_id : RandomId,
      customer_name: isLogin ? loginDatas.first_name : "guest",
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      per_page: "0",
      secret_key: storeEntityIds.secret_key,
      number: "0",
      store_type: "B2C",
      //  SITDeveloper: "1",
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

  // function for save cart for single product
  const addToCart = () => {
    if (!isIncludeCard()) {
      const item = specificationData;
      item.quantity = quantity;
      const services = [];
      serviceData.forEach((element) => {
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
          serviceItem.type = isItalicFont ? "italic" : "bold";
          serviceItem.text = saveEngraving === true ? engravingTexts : "";
          serviceItem.is_selected = engravingTexts !== "" ? "1" : "0";
        }

        if (
          element?.service_code == "EMBOSSING" &&
          element.service_type === "Special"
        ) {
          serviceItem.image = activeImgSave;
          serviceItem.is_selected =
            activeImgSave.some((img) => img?.embImage !== "") == true
              ? "1"
              : "0";
        }

        otherService.forEach((ele) => {
          if (ele.service_unique_id == element?.service_unique_id) {
            serviceItem.is_selected = element.is_selected == true ? "1" : "0";
          }
        });
        services.push(serviceItem);
      });
      const saveData = {
        JEWEL: [
          {
            campaign_id: props.campaignId ? isEmpty(props.campaignId) : "",
            mi_unique_id: item.variant_data?.[0]?.mi_unique_id,
            price_type: item.variant_data?.[0]?.bom_type,
            item_id: itemId,
            variant_id: storeVariantId,
            vertical_code: item.variant_data?.[0]?.vertical_short_code,
            group_code: item.variant_data?.[0]?.item_group,
            qty: item.quantity,
            product_diy: paramsItem === "DIY" ? "DIY" : "PRODUCT",
            product_title:
              isEmpty(params.title) !== ""
                ? firstWordCapital(params.title.split("-").join(" "))
                : "",
            product_name:
              isEmpty(item.variant_data) !== "" &&
              isEmpty(item.variant_data[0].product_name) !== ""
                ? item.variant_data[0].product_name
                : "",
            variant_sku:
              isEmpty(item.variant_data) !== "" &&
              isEmpty(item.variant_data[0].product_sku) !== ""
                ? item.variant_data[0].product_sku
                : "",
            product_variant:
              isEmpty(item.variant_data) !== "" &&
              isEmpty(item.variant_data[0].product_variant) !== ""
                ? item.variant_data[0].product_variant
                : "",
            product_type:
              isEmpty(item.variant_data) !== "" &&
              isEmpty(item.variant_data[0].mi_jewellery_product_type) !== ""
                ? item.variant_data[0].mi_jewellery_product_type
                : "",
            short_summary: item?.short_summary,
            item_base_price: item.final_total_display,
            currency_base_symbol: item.base_currency_symbol,
            metal_type: metalType,
            service_json: serviceData.length > 0 ? services : [],
            // eng_font: isItalicFont ? "italic" : "bold",
            // eng_text: saveEngraving === true ? engravingTexts : "",
            // eng_price: engravingData?.service_rate,
            // eng_currency: engravingData?.msrv_currency,
            // eng_font_size: engravingData?.font_size,
            // eng_max_character: engravingData?.max_character,
            // eng_min_character: engravingData?.min_character,
            // engraving_unique_id: engravingData?.service_unique_id,
            // embossing_unique_id: embossingData?.[0]?.service_unique_id,
            // embossing_json: JSON.stringify(activeImgSave),
            offer_code:
              selectedOffer.length > 0 ? selectedOffer[0].coupon_code : "",
          },
        ],
        DIAMO: pathname.includes("start-with-a-diamond")
          ? [
              {
                id: addedDiamondDatas?.st_cert_no,
                vertical_code: addedDiamondDatas?.st_short_code,
                group_code: addedDiamondDatas?.mi_item_group,
                qty: 1,
                stone_position: canBeSets?.[0]?.stone_position,
                sequence: canBeSets?.[0]?.stone_sequence,
                // item_base_price:
                //   addedDiamondDatas?.final_total,
                currency_base_symbol: addedDiamondDatas?.currency_code,
              },
            ]
          : [],
      };

      const obj = {
        a: "saveCart",
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        currency: storeCurrencys,
        current_user: isLogin ? loginDatas.member_id : RandomId,
        // user_id: isLogin ? loginDatas.member_id : "",
        user_id: isLogin ? loginDatas.member_id : RandomId,
        store_id: storeEntityIds.mini_program_id,
        json_data: JSON.stringify(saveData),
        is_diy: "1",
        diy_type: "1",
        unique_id: "",
      };

      if (isLogin) {
        commanService
          .postLaravelApi("/CartMaster", obj)
          .then((res) => {
            if (res.data.success === 1) {
              toast.success(res.data.message);
              dispatch(storeEmbossingData([]));
              dispatch(serviceAllData([]));
              dispatch(saveEmbossings(false));
              dispatch(previewImageDatas([]));
              dispatch(activeImageData([]));
              dispatch(engravingObj({}));
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
            }
          })
          .catch((error) => {
            setLoading(false);
            // toast.error(error.message);
          });
      } else {
        toast.error("Please Login First!");
      }
    }
  };

  // function for save cart for DIY product
  const addToCartDIY = () => {
    var Jsons = DiySteperDatas;
    if (Jsons) {
      var detail_json = Jsons;
      var JEWEL_Data = [];
      for (let i = 0; i < detail_json.length - 1; i++) {
        JEWEL_Data.push({
          product_diy: paramsItem,
          price_type: detail_json[i]["price_type"],
          item_id: detail_json[i]["item_id"],
          variant_id: detail_json[i]["variant_id"],
          mi_unique_id: detail_json[i]["mi_unique_id"],
          vertical_code: detail_json[i]["vertical"],
          group_code: detail_json[i]["group_code"],
          qty: quantity,
          ref_id: new Date().getTime(),
          cart_id: detail_json?.[i]?.["cart_id"],
          product_title: detail_json?.[i]?.["product_title"],
          product_name: detail_json?.[i]?.["product_name"],
          variant_sku: detail_json?.[i]?.["variant_sku"],
          product_variant: detail_json?.[i]?.["product_variant"],
          product_type: detail_json?.[i]?.["product_type"],
          short_summary: detail_json?.[i]?.["short_summary"],
          item_base_price: detail_json?.[i]?.["item_base_price"],
          currency_base_symbol: detail_json?.[i]?.["currency_base_symbol"],
          metal_type: detail_json?.[i]?.["metal_type"],
          // eng_font: detail_json[i]['eng_font'],
          // eng_text: detail_json[i]['eng_text'],
          // eng_currency: detail_json[i]['eng_currency'],
          // eng_min_character: detail_json[i]['eng_min_character'],
          // eng_max_character: detail_json[i]['eng_max_character'],
          // eng_font_size: detail_json[i]['eng_font_size'],
          // engraving_unique_id: detail_json[i]['engraving_unique_id'],
          // embossing_unique_id: detail_json[i]['embossing_unique_id'],
          // embossing_json: detail_json[i]['embossing_json'],
          service_json: detail_json[i]["service_json"],
          display_name: detail_json[i]["display_name"],
          combination_id: detail_json[i]["combination_id"],
          diy_bom_id: detail_json[i]["diy_bom_id"],
          position: detail_json[i]["position"],
          images: detail_json[i]["images"],
          offer_code: detail_json[i]["offer_code"],
        });
        if (typeViewDiy === true) {
          JEWEL_Data.qty = quantity;
        }
      }
    }
    const services = [];
    serviceData.forEach((element) => {
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
        serviceItem.type = isItalicFont ? "italic" : "bold";
        serviceItem.text = saveEngraving === true ? engravingTexts : "";
        serviceItem.is_selected = engravingTexts !== "" ? "1" : "0";
      }

      if (
        element?.service_code == "EMBOSSING" &&
        element.service_type === "Special"
      ) {
        serviceItem.image = activeImgSave;
        serviceItem.is_selected =
          activeImgSave.some((img) => img?.embImage !== "") == true ? "1" : "0";
      }

      otherService.forEach((ele) => {
        if (ele.service_unique_id == element?.service_unique_id) {
          serviceItem.is_selected = element.is_selected == true ? "1" : "0";
        }
      });
      services.push(serviceItem);
    });
    var JEWEL = isItemDIY
      ? JEWEL_Data
      : [
          {
            mi_unique_id: specificationData?.mi_unique_id,
            price_type: pathname.includes("/start-with-a-setting")
              ? storeSpecDatas.bom_type
              : specificationData.bom_type,
            item_id: pathname.includes("/start-with-a-setting")
              ? storeSpecDatas.item_id
              : itemId,
            variant_id: pathname.includes("/start-with-a-setting")
              ? storeSpecDatas.variant_data[0].variant_unique_id
              : storeVariantId,
            vertical_code: pathname.includes("/start-with-a-setting")
              ? storeSpecDatas.variant_data[0].vertical_short_code
              : specificationData.variant_data[0].vertical_short_code,
            group_code: pathname.includes("/start-with-a-setting")
              ? storeSpecDatas?.variant_data[0].item_group
              : specificationData?.variant_data[0].item_group,
            qty: 1,
            product_diy: paramsItem,
            product_title:
              isEmpty(params.title) !== ""
                ? firstWordCapital(params.title.split("-").join(" "))
                : "",
            product_name: pathname.includes("/start-with-a-setting")
              ? isEmpty(storeSpecDatas.variant_data[0].product_name)
              : isEmpty(specificationData.variant_data[0].product_name),
            variant_sku: pathname.includes("/start-with-a-setting")
              ? isEmpty(storeSpecDatas.variant_data) !== "" &&
                isEmpty(storeSpecDatas.variant_data[0].product_sku) !== ""
                ? storeSpecDatas.variant_data[0].product_sku
                : ""
              : isEmpty(specificationData.variant_data) !== "" &&
                isEmpty(specificationData.variant_data[0].product_sku) !== ""
              ? specificationData.variant_data[0].product_sku
              : "",
            product_variant: pathname.includes("/start-with-a-setting")
              ? isEmpty(storeSpecDatas.variant_data) !== "" &&
                isEmpty(storeSpecDatas.variant_data[0].product_variant) !== ""
                ? storeSpecDatas.variant_data[0].product_variant
                : ""
              : isEmpty(specificationData.variant_data) !== "" &&
                isEmpty(specificationData.variant_data[0].product_variant) !==
                  ""
              ? specificationData.variant_data[0].product_variant
              : "",
            product_type: pathname.includes("/start-with-a-setting")
              ? isEmpty(storeSpecDatas.variant_data) !== "" &&
                isEmpty(
                  storeSpecDatas.variant_data[0].mi_jewellery_product_type
                ) !== ""
                ? storeSpecDatas.variant_data[0].mi_jewellery_product_type
                : ""
              : isEmpty(specificationData.variant_data) !== "" &&
                isEmpty(
                  specificationData.variant_data[0].mi_jewellery_product_type
                ) !== ""
              ? specificationData.variant_data[0].mi_jewellery_product_type
              : "",
            short_summary: pathname.includes("/start-with-a-setting")
              ? storeSpecDatas?.short_summary
              : specificationData?.short_summary,
            item_base_price: pathname.includes("/start-with-a-setting")
              ? storeSpecDatas.final_total_display
              : specificationData.final_total_display,
            currency_base_symbol: pathname.includes("/start-with-a-setting")
              ? storeSpecDatas.base_currency_symbol
              : specificationData.base_currency_symbol,
            service_json: serviceData.length > 0 ? services : [],
            metal_type: metalType,
            // eng_font: isItalicFont ? "italic" : "bold",
            // eng_text: saveEngraving === true ? engravingTexts : "",
            // eng_price: engravingData?.service_rate,
            // eng_currency: engravingData?.msrv_currency,
            // eng_font_size: engravingData?.font_size,
            // eng_max_character: engravingData?.max_character,
            // eng_min_character: engravingData?.min_character,
            // engraving_unique_id: engravingData?.service_unique_id,
            // embossing_unique_id: embossingData?.[0]?.service_unique_id,
            // embossing_json: JSON.stringify(activeImgSave),
            offer_code:
              selectedOffer.length > 0 ? selectedOffer[0].coupon_code : "",
          },
        ];
    var DIAMO = [];
    var LDIAM = [];

    for (let c = 0; c < finalCanBeSet.length; c++) {
      var data = finalCanBeSet[c]["no_of_stone_array"];
      for (let d = 0; d < data.length; d++) {
        if (
          data[d].vertical_code === "DIAMO" ||
          data[d].vertical_code === "GEDIA" ||
          data[d].vertical_code === "LGDIA"
        ) {
          var diamo_data = "";
          diamo_data = {
            id: data[d]["stone_arr"].st_cert_no,
            vertical_code: data[d].vertical_code,
            item_id: data[d]["stone_arr"].item_id,
            group_code: data[d]["stone_arr"].mi_item_group,
            qty: 1,
            stone_position: finalCanBeSet[c]["stone_position"],
            sequence: data[d]["sequence"],
            item_base_price: data[d]["stone_arr"].base_currency_price,
            currency_base_symbol: data[d]["stone_arr"].currency_code,
          };
          DIAMO.push(diamo_data);
        } else {
          if (
            data[d].vertical_code === "LDIAM" ||
            data[d].vertical_code === "GEMST"
          ) {
            var ldiam_data = "";
            ldiam_data = {
              item_id: data[d]["stone_arr"].item_id,
              variant_id: data[d]["stone_arr"].unique_id,
              vertical_code: data[d].vertical_code,
              group_code: data[d]["stone_arr"].item_group,
              qty: 1,
              stone_position: finalCanBeSet[c]["stone_position"],
              sequence: data[d]["sequence"],
            };
            LDIAM.push(ldiam_data);
          }
        }
      }
    }

    var json_data = {
      JEWEL: JEWEL,
      DIAMO: DIAMO,
      LDIAM: LDIAM,
    };
    const obj = {
      a: "saveCart",
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      currency: storeCurrencys,
      current_user: isLogin ? loginDatas.member_id : RandomId,
      user_id: isLogin ? loginDatas.member_id : RandomId,
      store_id: storeEntityIds.mini_program_id,
      json_data: JSON.stringify(json_data),
      unique_id: "",
    };
    if (isItemDIY) {
      obj.flag = "item_to_item";
    }
    if (isLogin) {
      setLoading(true);
      commanService.postLaravelApi("/CartMaster", obj).then((res) => {
        if (res.data.success === 1) {
          dispatch(storeEmbossingData([]));
          dispatch(serviceAllData([]));
          dispatch(saveEmbossings(false));
          dispatch(previewImageDatas([]));
          dispatch(activeImageData([]));
          dispatch(engravingObj({}));
          getCartItems();
          // dispatch(DiySteperData([]));
          // dispatch(ActiveStepsDiy(1));
          document
            .getElementById("cartDrawerOverlay")
            .classList.add("page-overlay_visible");
          typeof document !== "undefined" &&
            document
              .getElementById("cartDrawer")
              .classList.add("aside_visible");
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
          setLoading(false);
        }
      });
    } else {
      toast.error("Please Login First!");
    }
  };

  //State update hwn currency chnage
  useEffect(() => {
    if (currency !== storeCurrencys && isCallRef.current === true) {
      setCurrency(storeCurrencys);
      isCallRef.current = false;
      setOnceUpdated(false);
    }
  }, [storeCurrencys]);
  //State update for DIY page
  useEffect(() => {
    if (isItemDIY) {
      // dispatch(storeSpecData({}));
      // dispatch(storeProdData({}));
      setOnceUpdated(false);
      setEngravingData({});
      setSelectedOffer([]);
      setEngravingData({});
      setEmbossingData([]);
      dispatch(serviceAllData([]));
      dispatch(otherServiceData([]));
      setOtherService([]);
      setActiveImg([]);
      dispatch(activeImageData([]));
      setSaveEngraving(false);
      setSaveEmbossing(false);
      if (allDataSpec !== undefined) {
        isCallRef.current = false;
        setEngravingText(allDataSpec?.engravingText);
        setIsItalicFont(allDataSpec?.isItalicFont);
        setIsEngraving(allDataSpec?.isEngraving);
        setEngravingTexts(allDataSpec?.engravingTexts);
        setSaveEngraving(allDataSpec?.saveEngraving);
        setEngravingData(allDataSpec?.engravingData);
        setEmbossingArea(allDataSpec.embossingArea);
        dispatch(storeEmbossingData(allDataSpec?.embossingData));
        dispatch(previewImageDatas(allDataSpec.previewImageData));
        setPreviewImageData(allDataSpec.previewImageData);
        setSaveEmbossing(allDataSpec.SaveEmbossing);
        setActiveImg(allDataSpec.activeImg);
        setActiveImgSave(allDataSpec.activeImgSave);
        dispatch(activeImageData(allDataSpec.activeImg));
        dispatch(saveEmbossings(allDataSpec.SaveEmbossing));
        setServiceData(allDataSpec.service_json);
        setOtherService(
          allDataSpec.service_json.filter((item) => item.is_selected === "1")
        );
        dispatch(serviceAllData(allDataSpec.service_json));
        dispatch(
          otherServiceData(
            allDataSpec.service_json.filter((item) => item.is_selected === "1")
          )
        );
      }
    }
  }, [varaintId]);

  //Onchange Engraving text update
  const handleChangeText = (event) => {
    setEngravingText(event.target.value);
  };

  //Function for close engraving popup
  const handleCloseEngraving = () => {
    if (
      engravingText !== "" ||
      engravingText.length >= parseInt(specificationData.min_character)
    ) {
      setIsEngraving(false);
      setEngravingText(engravingText);
    } else if (engravingText === "") {
      setIsEngraving(false);
      // setSaveEngraving(false);
      setEngravingText("");
      // setEngravingTexts("");
    } else {
      setIsEngraving(false);
      setSaveEngraving(false);
    }
    if (engravingTexts === "") {
      setEngravingText("");
    } else {
      setEngravingText(engravingTexts);
    }
  };

  //Save Engraving
  const handleSaveEngraving = (item) => {
    if (
      (engravingText !== "" &&
        engravingText.length >= (parseInt(item.min_character) || 8)) ||
      engravingText.length === 0
    ) {
      if (engravingText.length === 0) {
        setIsEngraving(false);
        setEngravingText("");
        setEngravingTexts("");
        setSaveEngraving(false);
      } else {
        setSaveEngraving(true);
        setIsEngraving(false);
        setEngravingTexts(engravingText);
      }
    } else if (engravingText.length <= parseInt(item.min_character)) {
      toast.error(
        `Please enter atleast ${
          item.min_character ? item.min_character : " "
        } character`
      );
      setIsEngraving(true);
    } else {
      setSaveEngraving(false);
      setIsEngraving(false);
    }
  };

  //Default selected offer apply
  const handleCouponApply = (offer, index) => {
    const isAlreadyApplied = selectedOffer.some(
      (item) => item.coupon_code === offer.coupon_code
    );

    if (!isAlreadyApplied) {
      setSelectedOffer([offer]);
    }
  };

  //Apply selected offer
  const handleAppliedCode = (offer, index) => {
    setSelectedOffer((prev) =>
      prev.filter((item) => item.coupon_code !== offer.coupon_code)
    );
  };

  // API call for related Products
  const getRelatedProducts = (itemIds, relatedIds, counts) => {
    const obj = {
      a: "GetItemDetailsbyRelatedProductIDForStore",
      SITDeveloper: "1",
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      store_id: storeEntityIds.mini_program_id,
      item_id: itemIds,
      related_product_id: relatedIds,
      per_page: "10",
      number: counts,
      secret_key: storeEntityIds.secret_key,
      store_type: "B2C",
      extra_currency: storeCurrencys,
      product_diy: paramsItem,
      user_id: isLogin ? loginDatas.member_id : RandomId,
    };

    // setLoading(true);
    setRelatedProductObj(obj);

    commanService
      .postApi("/SetFamilyCategory", obj)
      .then((res) => {
        if (res.data.success === 1) {
          const data = res?.data?.data;
          setTotalPagesRelated(data?.total_rows);
          const newProducts = res?.data?.data?.resData || [];

          if (newProducts.length === 0) {
            // No more data — stop further right-clicks
            setHasMoreRelated(false);
          } else {
            if (counts > 1) {
              setRelatedProductData((prev) => [...prev, ...newProducts]);
            } else {
              setRelatedProductData(newProducts);
            }

            setCount(counts);

            if (
              newProducts.length < 10 ||
              relatedProductData.length + newProducts.length < 10
            ) {
              setHasMoreRelated(false);
            } else {
              setHasMoreRelated(true);
            }
          }
        } else {
          setHasMoreRelated(false);
        }
      })
      .catch((err) => {
        setHasMoreRelated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //Related product Swiper navigation Arrow onclick function
  const paginationLeftRight = useCallback(
    (value) => {
      if (value === "left" && count > 1) {
        setIsEndReached(false);
      }
      if (value === "right") {
        if (!hasMoreRelated) return;
        if (isEndReached) {
          const newCount = count + 1;
          // setLoading(true);
          getRelatedProducts(
            relatedProductObj.item_id,
            relatedProductObj.related_product_id,
            newCount
          );
          setIsEndReached(false);
        } else {
          swiperInstance?.slideNext();
        }
      }
    },
    [isEndReached, swiperInstance, hasMoreRelated]
  );

  //Function of to get Image types of products
  const consolidateImageTypesProduct = (data) => {
    const allImageUrls = new Set();

    data?.forEach((item) => {
      if (item.image_types && Array.isArray(item.image_types)) {
        item.image_types.forEach((url) => allImageUrls.add(url));
      }
    });

    return Array.from(allImageUrls);
  };
  //Function of to get Image Urls of products
  const consolidateImageUrlsProduct = (data) => {
    const allImageUrls = new Set();

    data?.forEach((item) => {
      if (item.image_urls && Array.isArray(item.image_urls)) {
        item.image_urls.forEach((url) => allImageUrls.add(url));
      }
    });

    return Array.from(allImageUrls);
  };

  //API call for get store specification product data
  const storeItemImageAndSpecificationDetails = useCallback(
    (obj, dataSearch) => {
      setLoading(true);
      commanService
        .postApi("/EmbeddedPageMaster", obj)
        .then((res) => {
          if (res?.data?.success === 1) {
            let storeObj = { ...res?.data?.data[0] };
            const images = [
              {
                image_urls: [
                  ...(storeObj?.variant_data?.[0]?.image_urls || []),
                  ...(storeObj?.image_urls || []),
                ],
              },
            ];
            let consolidatedImages = consolidateImageUrlsProduct(images);
            if (consolidatedImages instanceof Set) {
              consolidatedImages = Array.from(consolidatedImages);
            }

            // const combinationImage = finalCanBeSetDatas?.[0]?.combination_image;
            // if (combinationImage) {
            //   consolidatedImages = [combinationImage, ...consolidatedImages];
            // }

            storeObj.images = Array.from(new Set(consolidatedImages));

            const types = [
              {
                image_types: [
                  ...(storeObj?.variant_data?.[0]?.image_types || []),
                  ...(storeObj?.image_types || []),
                ],
              },
            ];

            let consolidatedTypes = consolidateImageTypesProduct(types);
            if (consolidatedTypes instanceof Set) {
              consolidatedTypes = Array.from(consolidatedTypes);
            }
            storeObj.image_types = Array.from(new Set(consolidatedTypes));

            if (pathname.includes("/start-with-a-diamond") || isItemDIY) {
              dispatch(storeSpecData(storeObj));
            }
            if (storeSpecDatas.length > 0) {
              dispatch(storeSpecData(storeObj));
            }
            setSpecificationData(storeObj);
            storyData(dataSearch?.item_id);
            reviewData(storeObj, "0", "0", "0", obj);

            // if(viewType === "review"){
            //   imageImportinSpecificationDiy();
            // }
            if (!allDataSpec && storeObj) {
              const initServiceData =
                storeObj?.variant_data?.[0]?.service_data?.map((item) => ({
                  ...item,
                  is_selected: false,
                }));
              setServiceData(initServiceData);
              dispatch(serviceAllData(initServiceData));
            }
            const otherData = storeObj?.variant_data?.[0]?.service_data?.filter(
              (item) => item.service_type === "Normal"
            );
            if (otherData?.length > 0) {
              setOtherService(otherData);
              dispatch(otherServiceData(otherData));
            }

            setEmbossingData(
              storeObj?.variant_data?.[0]?.service_data?.filter(
                (item) =>
                  item.service_code === "EMBOSSING" &&
                  item.service_type === "Special"
              )
            );
            setEmbossingArea(storeObj?.variant_data?.[0]?.image_area);
            dispatch(
              storeEmbossingData(
                storeObj?.variant_data?.[0]?.service_data?.filter(
                  (item) =>
                    item.service_code === "EMBOSSING" &&
                    item.service_type === "Special"
                )
              )
            );
            const engData = storeObj?.variant_data?.[0]?.service_data?.filter(
              (item) =>
                item.service_code === "ENGRAVING" &&
                item.service_type === "Special"
            );
            if (engData?.length > 0) {
              setEngravingData(engData[0]);
              dispatch(engravingObj(engData[0]));
            }
            if (res.data.data[0]) {
              setSelectedOffer([]);
              if (res.data.data[0]?.offers?.length) {
                setIsOffers(true);
                handleCouponApply([res.data.data[0]?.offers[0]]);
                setSelectedOffer([res.data.data[0]?.offers[0]]);
              } else {
                setIsOffers(false);
              }
              if (res.data.data[0].expected_delivery_date) {
                // Create a new Date object
                const date = new Date(res.data.data[0].expected_delivery_date);

                // Define options for formatting
                const options = {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                };

                // Format the date
                const formattedDate = date.toLocaleDateString("en-US", options);
                setDeliveryDate(formattedDate);
              }
              setStoreVariantCount(res.data.data[0].total_variant);
              var ring_info = isEmpty(res.data.data[0].ring_info);
              var final_data = [];
              for (let c = 0; c < ring_info.length; c++) {
                if (
                  isEmpty(ring_info[c].value) != "" &&
                  isEmpty(ring_info[c].title) != "Item Group Prefix"
                ) {
                  final_data.push(ring_info[c]);
                }
              }
              setColumnsForSpecification(final_data);
              if (
                isEmpty(res.data.data[0].diy_bom_id) != "" &&
                isEmpty(paramsItems) === "DIY"
              ) {
                var data = [
                  { title: "Specification" },
                  { title: "Can Be Set With" },
                ];
                setSelectedTab(data);
              } else {
                var data = [{ title: "Specification" }];
                setSelectedTab(data);
              }

              if (keyTabView === "Can Be Set With") {
                canBeSetWithData();
              }

              setProductType(
                res.data.data[0].variant_data[0][
                  "mi_jewellery_product_type_name"
                ]
              );

              // setProductSKU(res.data.data[0].display_product_sku);
              // setFinalTotal(res.data.data[0].final_total_display);

              var diamond_data = [];
              var dia_final_data = [];
              var extra_summary =
                res.data.data[0].short_summary["extra_summary"];
              const result = {};
              for (const { item_group_name, counter } of extra_summary) {
                result[item_group_name] =
                  (result[item_group_name] ?? 0) + counter;
              }

              var result_key = Object.keys(result);
              var result_value = Object.values(result);

              for (let k = 0; k < result_key.length; k++) {
                if (extra_summary[0]["item_group_name"] == result_key[k]) {
                  extra_summary[0]["show_counter"] = result_value[k];
                }
              }

              setdiamondSummaryname(
                extra_summary[0]["item_group_name"] +
                  (extra_summary[0]["show_counter"] > 1
                    ? "-" + extra_summary[0]["counter"]
                    : "") +
                  " Information"
              );
              diamond_data = [];
              if (isEmpty(extra_summary[0]["stone_shape_name"]) != "") {
                diamond_data.push({
                  title: "Shape",
                  value: extra_summary[0]["stone_shape_name"],
                });
              }
              if (isEmpty(extra_summary[0]["stone_type_name"]) != "") {
                diamond_data.push({
                  title: "Stone Type",
                  value: extra_summary[0]["stone_type_name"],
                });
              }
              if (isEmpty(extra_summary[0]["quantity"]) != "") {
                diamond_data.push({
                  title: "Quantity",
                  value: extra_summary[0]["quantity"],
                });
              }
              if (isEmpty(extra_summary[0]["international_color"]) != "") {
                diamond_data.push({
                  title: "Average Color",
                  value: extra_summary[0]["international_color"],
                });
              }
              if (isEmpty(extra_summary[0]["international_quality"]) != "") {
                diamond_data.push({
                  title: "Average Quality",
                  value: extra_summary[0]["international_quality"],
                });
              }
              dia_final_data.push(diamond_data);
              setdiamondSummary(dia_final_data);
              var sec_dia_final_data = [];
              var sec_diamond_data = [];
              var sec_dia_data_name = [];
              var sec_final_dia_data_name = [];

              for (let d = 0; d < extra_summary.length; d++) {
                for (let k = 0; k < result_key.length; k++) {
                  if (extra_summary[d]["item_group_name"] == result_key[k]) {
                    extra_summary[d]["show_counter"] = result_value[k];
                  }
                }
                sec_diamond_data = [];
                if (d != 0) {
                  sec_dia_data_name.push(
                    extra_summary[d]["item_group_name"] +
                      (extra_summary[d]["show_counter"] > 1
                        ? "-" + extra_summary[d]["counter"]
                        : "") +
                      " Information"
                  );
                  if (isEmpty(extra_summary[d]["stone_shape_name"]) != "") {
                    sec_diamond_data.push({
                      title: "Shape",
                      value: extra_summary[d]["stone_shape_name"],
                    });
                  }
                  if (isEmpty(extra_summary[d]["stone_type_name"]) != "") {
                    sec_diamond_data.push({
                      title: "Stone Type",
                      value: extra_summary[d]["stone_type_name"],
                    });
                  }
                  if (isEmpty(extra_summary[d]["quantity"]) != "") {
                    sec_diamond_data.push({
                      title: "Quantity",
                      value: extra_summary[d]["quantity"],
                    });
                  }
                  if (isEmpty(extra_summary[d]["international_color"]) != "") {
                    sec_diamond_data.push({
                      title: "Average Color",
                      value: extra_summary[d]["international_color"],
                    });
                  }
                  if (
                    isEmpty(extra_summary[d]["international_quality"]) != ""
                  ) {
                    sec_diamond_data.push({
                      title: "Average Clarity",
                      value: extra_summary[d]["international_quality"],
                    });
                  }
                  sec_dia_final_data.push(sec_diamond_data);
                  sec_final_dia_data_name.push(sec_dia_data_name);
                }
              }
              setSecondDiamondSummaryname(sec_dia_data_name);
              setSecondDiamondSummary(sec_dia_final_data);
            }
            const bomData = [...storeObj?.bom_details];
            if (bomData.length > 0) {
              setBomDataList(bomData);
            }
            const labourData = [...storeObj?.labour_lines_details?.details];
            if (labourData.length > 0) {
              setLabourDataList(labourData);
            }
            if (!pathname.includes("/start-with-a-diamond")) {
              canBeSetWithData();
            }
            var params = [];
            if (dataSearch.filter.length > 0) {
              params.push({ key: "master_jewelry_type", value: [] });
              dataSearch.filter.map((e1) => {
                if (e1.key === "master_jewelry_type") {
                  params = [];
                  params.push({
                    key: "master_jewelry_type",
                    value: [e1.selectedvalue],
                  });
                }
                return e1;
              });
            }

            const tabVariant = {
              ...storeTabVariantInfo,
              miniprogram_id: storeEntityIds.mini_program_id,
              tenant_id: storeEntityIds.tenant_id,
              item_id: dataSearch?.item_id,
              product_diy: paramsItem,
              system_id: dataSearch?.system_id,
              entity_id: storeEntityIds.entity_id,
              secret_key: storeEntityIds.secret_key,
              origin: storeEntityIds.cmp_origin,
              product_variant: "",
              params: JSON.stringify(params),
            };
            setStoreTabVariant(tabVariant);
            if (keyTabView === "Variant") {
              variantData(tabVariant);
            }
            const itemIds = storeObj?.item_id;
            const relatedId = storeObj?.store_related_product_id;
            if (isEmpty(itemIds) !== "" && isEmpty(relatedId) !== "") {
              setRelatedProductData([]);
              getRelatedProducts(itemIds, relatedId, 1);
              setCount(1);
            }
            setLoading(false);
          } else {
            setLoading(false);
            toast.error(res.data.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          // toast.error(error.message);
        });
    },
    [currency, varaintId, allDataSpec]
  );

  const imageImportinSpecificationDiy = useCallback(() => {
    let storeObj = { ...specificationData };
    const images = [
      {
        image_urls: [
          ...(storeObj?.variant_data?.[0]?.image_urls || []),
          ...(storeObj?.image_urls || []),
        ],
      },
    ];
    let consolidatedImages = consolidateImageUrlsProduct(images);
    if (consolidatedImages instanceof Set) {
      consolidatedImages = Array.from(consolidatedImages);
    }

    const combinationImage = finalCanBeSetDatas?.[0]?.combination_image;
    if (combinationImage && finalCanBeSetDatas?.length > 0) {
      consolidatedImages = [combinationImage, ...consolidatedImages];
    }

    storeObj.images = Array.from(new Set(consolidatedImages));

    const types = [
      {
        image_types: [
          ...(storeObj?.variant_data?.[0]?.image_types || []),
          ...(storeObj?.image_types || []),
        ],
      },
    ];

    let consolidatedTypes = consolidateImageTypesProduct(types);
    if (consolidatedTypes instanceof Set) {
      consolidatedTypes = Array.from(consolidatedTypes);
    }
    storeObj.image_types = Array.from(new Set(consolidatedTypes));

    setSpecificationData(storeObj);
    dispatch(storeSpecData(storeObj));
  }, [finalCanBeSetDatas, resetTrigger]);

  //API call for Variant Data list
  const variantData = useCallback((obj) => {
    commanService
      .postApi("/EmbeddedPageMaster", obj)
      .then((res) => {
        if (res.data.success === 1) {
          setTabDataDone(true);
          setStoreVariantDataList(res.data.data);
          setStoreVariantCount(res.data.data.length);
        } else {
          setTabDataDone(false);
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        // toast.error(error.message);
      });
  }, []);

  //Stone wise data setting function
  const setCanBeSet = (event) => {
    var total_stone_counter = 0;
    var match_stone_counter = 0;
    var multiple_stone_counter = 0;
    var canbeset = [...finalCanBeSet];
    let certNo = "";

    for (let i = 0; i < canbeset.length; i++) {
      if (event.stone_position == "CENTER") {
        if (
          event["no_of_stone_array"][0]["stone_arr"]["st_short_code"] ==
            "DIAMO" ||
          event["no_of_stone_array"][0]["stone_arr"]["st_short_code"] ==
            "GEDIA" ||
          event["no_of_stone_array"][0]["stone_arr"]["st_short_code"] == "LGDIA"
        ) {
          var data = [];
          if (
            isEmpty(
              event["no_of_stone_array"][0]["stone_arr"]["st_is_video"]
            ) != ""
          ) {
            if (
              isEmpty(
                event["no_of_stone_array"][0]["stone_arr"]["st_is_video"]
              ).includes("mp4") == true
            ) {
              data.push({
                type: "video",
                src: event["no_of_stone_array"][0]["stone_arr"]["st_is_video"],
                view: video,
              });
            } else {
              data.push({
                type: "video",
                src: event["no_of_stone_array"][0]["stone_arr"]["st_is_video"],
                view: video,
                iframe: true,
              });
            }
          }
          if (
            isEmpty(
              event["no_of_stone_array"][0]["stone_arr"]["st_is_photo"]
            ) != ""
          ) {
            data.push({
              type: "image",
              src: event["no_of_stone_array"][0]["stone_arr"]["st_is_photo"],
              view: event["no_of_stone_array"][0]["stone_arr"]["st_is_photo"],
            });
          }
          if (
            isEmpty(
              event["no_of_stone_array"][0]["stone_arr"]["display_image"]
            ) != ""
          ) {
            data.push({
              type: "v_image",
              src: event["no_of_stone_array"][0]["stone_arr"]["display_image"],
              view: event["no_of_stone_array"][0]["stone_arr"]["display_image"],
              length: event["no_of_stone_array"][0]["stone_arr"]["st_length"],
              width: event["no_of_stone_array"][0]["stone_arr"]["st_width"],
            });
          }
          if (
            isEmpty(event["no_of_stone_array"][0]["stone_arr"]["st_is_cert"]) !=
            ""
          ) {
            if (
              isEmpty(event["no_of_stone_array"][0]["stone_arr"]["st_lab"]) ==
              "GIA"
            ) {
              data.push({
                type: "cert",
                src: event["no_of_stone_array"][0]["stone_arr"]["st_is_cert"],
                view: GIA,
              });
            }
            if (
              isEmpty(event["no_of_stone_array"][0]["stone_arr"]["st_lab"]) ==
              "HRD"
            ) {
              data.push({
                type: "cert",
                src: event["no_of_stone_array"][0]["stone_arr"]["st_is_cert"],
                view: HRD,
              });
            }
            if (
              isEmpty(event["no_of_stone_array"][0]["stone_arr"]["st_lab"]) ==
              "IGI"
            ) {
              data.push({
                type: "cert",
                src: event["no_of_stone_array"][0]["stone_arr"]["st_is_cert"],
                view: IGI,
              });
            }
          }
          dispatch(
            diamondDIYName(
              isEmpty(
                event["no_of_stone_array"][0]["stone_arr"]["product_name"]
              )
            )
          );
          dispatch(
            diamondDIYimage(
              isEmpty(event["no_of_stone_array"][0]["stone_arr"]["st_is_photo"])
            )
          );
          setDiamondArrayImage(data);
        }
        if (i === 0) {
          setFinalStoneArr([...canbeset]);
        }
      }

      total_stone_counter += Number(canbeset[i]["no_of_stone"]);
      if (canbeset[i]["no_of_stone_array"].length != 0) {
        var position_wise_price = 0;
        for (let k = 0; k < canbeset[i]["no_of_stone_array"].length; k++) {
          if (canbeset[i]["no_of_stone_array"][k]["set_stone"] == 1) {
            position_wise_price += Number(
              canbeset[i]["no_of_stone_array"][k]["stone_arr"]["ex_store_price"]
            );
            match_stone_counter++;
            multiple_stone_counter += Number(
              canbeset[i]["no_of_stone_array"][k]["stone_arr"]["ex_store_price"]
            );
            if (event.group_by == true) {
              canbeset[i]["set_stone"] = 1;
            }
            certNo =
              canbeset[i]["no_of_stone_array"][k]["stone_arr"]["st_cert_no"];
          }
        }
        canbeset[i]["position_wise_price"] = position_wise_price.toFixed(2);
      }
    }

    setFinalCanBeSet([...canbeset]);
    dispatch(finalCanBeSetData([...canbeset]));
    setStoneCanBeSetArr([...canbeset]);
    setCertificateNumber(certNo);
    if (total_stone_counter == match_stone_counter) {
      setViewType("review");
      dispatch(activeDIYtabs("Complete"));
      setIsStoneSelected(true);
      setTimeout(() => {
        setStonePrice(multiple_stone_counter);
        setSalesTotalPrice(
          Number(
            Number(multiple_stone_counter) +
              Number(specificationData.final_total)
          ).toFixed(2)
        );
      }, 100);
    } else {
      // setViewType('diamond');
      setStonePrice(multiple_stone_counter);
      setSalesTotalPrice(
        Number(
          Number(multiple_stone_counter) + Number(specificationData.final_total)
        ).toFixed(2)
      );
    }
  };

  //DIY complete ring Navigation function
  function handleComplete() {
    setFinalCanBeSet(stoneCanBeSetArr);
    dispatch(finalCanBeSetData(stoneCanBeSetArr));
    dispatch(activeDIYtabs("Complete"));
    setIsStone(true);
    setViewType("review");
  }

  //DIY complete diamond Navigation function
  function diamondComplete() {
    setIsStone(true);
    dispatch(isRingSelected(true));
    setIsDiamondSelected(true);
    setIsStoneSelected(false);
    dispatch(activeDIYtabs("Complete"));
    imageImportinSpecificationDiy();
    setViewType("review");
    router.push(
      `/make-your-customization/start-with-a-diamond/jewellery/${addedRingDatas?.variant_data[0]?.product_name
        ?.replaceAll(" ", "-")
        ?.toLowerCase()}-${addedRingDatas?.variant_data[0]?.variant_unique_id?.toLowerCase()}`
    );
  }

  //DIY complete diamond second stpe Navigation function
  function diamondStepTwo() {
    dispatch(activeDIYtabs("Jewellery"));
    dispatch(isRingSelected(false));
    setIsStone(false);
    setIsDiamondSelected(false);
    setVerticalCode("");
  }

  //DIY complete diamond first step Navigation function
  function diamondStepFirst() {
    dispatch(activeDIYtabs("Diamond"));
    setIsDiamondSelected(true);
    dispatch(diamondPageChnages(false));
    router.push("/make-your-customization/start-with-a-diamond");
  }

  //Canbe set stone wise diamond data store
  const handleSetCanBeSet = () => {
    const data = [...finalCanBeSetDatas];
    const stoneArr = data[0]?.no_of_stone_array;

    if (stoneArr && stoneArr.length > 0) {
      if (!stoneArr[0].stone_arr) {
        stoneArr[0].stone_arr = {};
      }

      stoneArr[0] = { ...stoneArr[0], stone_arr: addedDiamondDatas };

      // setFinalCanBeSet(data);
      dispatch(finalCanBeSetData(data));
    }
  };

  //Function call for related dependencies
  useEffect(() => {
    if (pathname.includes("/start-with-a-diamond") && finalCanBeSetDatas) {
      handleSetCanBeSet();
    }
    imageImportinSpecificationDiy();
  }, [finalCanBeSet]);

  //Get DIY bom details for can be set with data
  const canBeSetWithData = () => {
    if (
      isEmpty(canBeSetWithVariant) !=
      specificationData.variant_data?.[0]?.product_variant
    ) {
      setCanBesetWithVariant(
        specificationData.variant_data?.[0]?.product_variant
      );
      // setLoading(true);

      var obj = {
        a: "getDIYBomDetails",
        diy_bom_id: specificationData?.diy_bom_id,
        item_id: specificationData?.item_id,
        variant_number: specificationData.variant_data?.[0]?.product_variant,
        tenant_id: storeEntityIds.tenant_id,
        SITDeveloper: "1",
      };

      commanService
        .postApi("/UniversalSearch2", obj)
        .then((res) => {
          if (res.data.success === 1) {
            const data = res.data.data;
            // if (isEmpty(data[0].mm) != "") {
            //   setColumName("MM");
            // } else {
            //   setColumName("LxWxD");
            // }
            setCanBeSetWithDataList(data);
            if (
              pathname.includes("/start-with-a-diamond") &&
              finalCanBeSetDatas.length === 0
            ) {
              newCanbeSetData(data[0]);
            }
            // handleSetCanBeSet()
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          // toast.error(error.message);
        });
    }
  };

  function handleSetCompleteRing() {
    window.scroll(0, 0);
    canBeSetWithData();
    imageImportinSpecificationDiy();
    // handleSetCanBeSet();
    dispatch(addedRingData(specificationData));
    dispatch(isRingSelected(true));
    setIsDiamondSelected(true);
    setIsStoneSelected(false);
    dispatch(activeDIYtabs("Complete"));
    setViewType("review");
    setIsStone(true);
  }

  //Get journey story details
  const storyData = (value) => {
    const obj = {
      a: "GetJournyDetail",
      type: "6",
      type_id: value,
      per_page: "0",
      number: "0",
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      SITDeveloper: "1",
    };
    commanService.postApi("/MasterTable", obj).then((res) => {
      if (res.data.success == 1) {
        setStoryDataList(res?.data?.data);
        // setLoading(false);
      } else {
        // setLoading(false);
      }
    });
  };

  //Customer Review
  const reviewData = (value, rate, page, key) => {
    const reviewObj = {
      a: "getItemReview",
      type: "B2C",
      store_id: storeEntityIds.mini_program_id,
      item_id: value ? value.item_id : "",
      user_id: isLogin ? loginDatas.member_id : RandomId,
      per_page: "3",
      number: page ? page : "0",
      rating: rate ? rate : "0",
      variant_number: value.variant_data[0].product_variant,
      variant_id: value.variant_data[0].variant_unique_id,
    };
    commanService
      .postLaravelApi("/ReviewController", reviewObj)
      .then((res) => {
        if (res.data.success === 1) {
          let Data = res.data.data;

          let ReviewData = Data.review.result;
          let ReviewCount = Data.review_count;

          if (ReviewData.length < 3) {
            setHasMore(false);
          }
          if (ReviewData.length > 0) {
            if (key === "1") {
              for (let index = 0; index < ReviewData.length; index++) {
                reviewCustomerData.push(ReviewData[index]);
              }
              setReviewCustomerData(reviewCustomerData);
            } else {
              let arr = [...ReviewData];
              setReviewCustomerData(arr);
            }
          } else {
            setReviewCustomerData(ReviewData);
          }
          setReviewCustomer(res.data.data);

          let sum = 0;
          let totalUserRev = res.data.data.global_rating;
          let totalAllRating = 0;
          setGlobalRating(totalUserRev);

          for (let index = 0; index < ReviewCount.length; index++) {
            let totalAvg = Number(
              ReviewCount[index].rating * ReviewCount[index].total_user_rating
            );
            sum += Number(totalAvg);
            if (totalUserRev === 0) {
              ReviewCount[index].percenatge = 0;
            } else {
              ReviewCount[index].percenatge = (
                (ReviewCount[index].total_user_rating * 100) /
                totalUserRev
              ).toFixed();
            }
            totalAllRating =
              totalUserRev === 0 ? 0 : Number((sum / totalUserRev).toFixed(2));
          }
          setReviewSummary(ReviewCount);
          setGlobalRatingStar(totalAllRating);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {});
  };

  //More review details
  const handleChangeRow = (e) => {
    reviewData(specificationData, "0", e.toString(), "1");
  };

  //function for more review details
  const handleShowMore = () => {
    const totalRows = reviewCutomer.review.total_pages
      ? reviewCutomer.review.total_pages
      : 1;
    if (itemsLength.length >= totalRows) {
      setHasMore(false);
      return;
    } else {
      setHasMore(true);
    }
    if (hasMore === true) {
      setTimeout(() => {
        setItemLength(itemsLength.concat(Array.from({ length: 1 })));
        handleChangeRow(itemsLength.concat(Array.from({ length: 1 })).length);
      }, 500);
    }
  };

  //get store Item Details
  const storeItemDetails = useCallback(
    (objStoreItem, dataSearch) => {
      setTabDataDone(true);
      const itemImageObj = {
        a: "getStoreItemImageAndSpecificationDetails",
        miniprogram_id: storeEntityIds.mini_program_id,
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        variant_unique_id: dataSearch?.variant_id,
        item_id: dataSearch?.item_id,
        system_id: dataSearch?.system_id,
        secret_key: storeEntityIds.secret_key,
        store_type: "B2C",
        product_diy: paramsItem,
        origin: storeEntityIds.cmp_origin,
        SITDeveloper: "1",
        lang_id: 1,
        extra_currency: storeCurrencys,
        extra_summary: "Yes",
        // params: JSON.stringify(params),
        diy_type: "1",
      };
      if (isItemDIY) {
        itemImageObj.diy_step =
          ActiveStepsDiys === 0 ? "" : ActiveStepsDiys.toString();
        itemImageObj.diy_bom_id =
          ActiveStepsDiys > 0
            ? DiySteperDatas?.filter(
                (item) => item.position === ActiveStepsDiys - 1
              )[0]?.diy_bom_id
            : "";
        itemImageObj.combination_id =
          ActiveStepsDiys > 0
            ? DiySteperDatas?.filter(
                (item) => item.position === ActiveStepsDiys - 1
              )[0]?.combination_id
            : "";
      }
      storeItemImageAndSpecificationDetails(itemImageObj, dataSearch);
    },
    [
      variantData,
      storeItemImageAndSpecificationDetails,
      keyTabView,
      paramsItem,
      storeEntityIds,
      storeTabVariantInfo,
      currency,
      varaintId,
      allDataSpec,
    ]
  );

  //get dynamic search Parameter
  const dynamicSearchParameter = useCallback(
    (objFilter) => {
      commanService
        .postApi("/EmbeddedPageMaster", objFilter)
        .then((res2) => {
          if (res2.data.success === 1) {
            const dataSearch = res2.data.data;
            if (Object.keys(dataSearch).length > 0) {
              setFilterProduct(dataSearch.filter);
              setItemId(dataSearch.item_id);
              setStoreVariantId(dataSearch.variant_id);
              if (dataSearch.filter.length > 0) {
                dataSearch.filter.map((e1) => {
                  if (e1.key === "master_primary_metal_type") {
                    setMetalType(e1.selectedvalue);
                  }
                  if (isEmpty(e1.key) === "master_gh_shape") {
                    setselectedShape(isEmpty(e1.selectedvalue));
                  }
                  if (isEmpty(e1.key) === "master_gh_color") {
                    setselectedColor(isEmpty(e1.selectedvalue));
                  }
                  return e1;
                });
              }

              const objStoreItem = {
                a: "getStoreItemDetails",
                SITDeveloper: "1",
                miniprogram_id: storeEntityIds.mini_program_id,
                tenant_id: storeEntityIds.tenant_id,
                entity_id: storeEntityIds.entity_id,
                variant_unique_id: dataSearch.variant_id,
                item_id: dataSearch.item_id,
                secret_key: storeEntityIds.secret_key,
                store_type: "B2C",
                extra_currency: storeCurrencys,
                product_diy: paramsItem,
                vertical_code: "",
                user_id: isLogin ? loginDatas.member_id : RandomId,
                diy_type: "1",
              };
              if (isItemDIY) {
                objStoreItem.diy_step =
                  ActiveStepsDiys === 0 ? "" : ActiveStepsDiys.toString();
                objStoreItem.diy_bom_id =
                  ActiveStepsDiys > 0
                    ? DiySteperDatas?.filter(
                        (item) => item.position === ActiveStepsDiys - 1
                      )[0]?.diy_bom_id
                    : "";
                objStoreItem.combination_id =
                  ActiveStepsDiys > 0
                    ? DiySteperDatas?.filter(
                        (item) => item.position === ActiveStepsDiys - 1
                      )[0]?.combination_id
                    : "";
              }

              storeItemDetails(objStoreItem, dataSearch);

              const arr = [];
              dataSearch.filter.map((e) => {
                let obj = { key: e.key, value: e.selectedvalue };
                arr.push(obj);
                return e;
              });
              setFilterParameter(arr);
            } else {
              setLoading(false);
            }
          } else {
            setLoading(false);
            toast.error(res2.data.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          // toast.error(error.message);
        });
    },
    [
      filterParameter,
      paramsItem,
      storeItemDetails,
      isLogin,
      loginDatas,
      varaintId,
      allDataSpec,
    ]
  );

  //Aplly filter
  const appliedFilter = (e, value, type) => {
    setActive(0);
    setSaveEmbossDetailReset();
    dispatch(storeEmbossingData([]));
    dispatch(serviceAllData([]));
    dispatch(activeImageData([]));
    dispatch(previewImageDatas([]));
    setActiveImg([]);
    setActiveImgSave([]);
    setImageDataList([]);
    if (pathname.includes("/start-with-a-setting")) {
      handleResetStartwithDIY();
    }
    const arr = [...filterParameter];
    setFilterParameter([]);
    if (type === undefined) {
      const valueArr = arr.filter((val) => val?.key === e?.key);
      valueArr[0].value = value?.key;
      e.selectedvalue = value?.key;
      setFilterParameter(arr);
    }

    const filterArrayData = [...filterParameter].map((item) =>
      item.key === e.key ? { key: e.key, value: e.selectedvalue } : item
    );
    filterArrayData.findIndex((item) => item.key === e.key);

    const newArr = [];
    for (
      let i = 0;
      i <= filterArrayData.findIndex((item) => item.key === e.key);
      i++
    ) {
      newArr.push(filterArrayData[i]);
    }

    const obj = {
      a: "getDynamicSearchParameter",
      SITDeveloper: "1",
      tenant_id: storeEntityIds.tenant_id,
      param: JSON.stringify(newArr),
      diamond_params: pathname.includes("start-with-a-diamond")
        ? JSON.stringify({
            shape: addedDiamondDatas?.st_shape,
            from_length: addedDiamondDatas?.st_length,
            from_width: addedDiamondDatas?.st_width,
            from_depth: addedDiamondDatas?.st_depth,
          })
        : "[]",
      variant_id: type === "variant" ? e.unique_id : "",
      item_id: type === "variant" ? e.item_id : itemId,
      src: type === "variant" ? "metal" : e.key,
      secret_key: storeEntityIds.secret_key,
      calling: "1",
      default_variant_id: varaintId !== null ? varaintId : props.variantId,
      is_customize: "1",
      is_dc: "1",
      is_smc: "0",
      stone_shape: "",
      product_diy: paramsItem === "DIY" && !isItemDIY ? "DIY" : "PRODUCT",
    };
    if (isItemDIY) {
      obj.diy_step = ActiveStepsDiys === 0 ? "" : ActiveStepsDiys.toString();
      obj.diy_type = "1";
      obj.diy_bom_id =
        ActiveStepsDiys > 0
          ? DiySteperDatas?.filter(
              (item) => item.position === ActiveStepsDiys - 1
            )[0]?.diy_bom_id
          : "";
      obj.combination_id =
        ActiveStepsDiys > 0
          ? DiySteperDatas?.filter(
              (item) => item.position === ActiveStepsDiys - 1
            )[0]?.combination_id
          : "";
    }
    dynamicSearchParameter(obj, false);
  };

  //Initial API call
  useEffect(() => {
    // setItemLength(Array.from({ length: 1 }));
    if (
      storeEntityIds &&
      Object.keys(storeEntityIds).length > 0 &&
      !isCallRef.current
    ) {
      if (!onceUpdated) {
        window.scrollTo(0, 0);
        setOnceUpdated(true);
        setLoading(true);
        const objFilter = {
          a: "getDynamicSearchParameter",
          product_diy: paramsItem === "DIY" && !isItemDIY ? "DIY" : "PRODUCT",
          SITDeveloper: "1",
          tenant_id: storeEntityIds.tenant_id,
          param: "[]",
          diamond_params: pathname.includes("start-with-a-diamond")
            ? JSON.stringify({
                shape: addedDiamondDatas?.st_shape,
                from_length: addedDiamondDatas?.st_length,
                from_width: addedDiamondDatas?.st_width,
                from_depth: addedDiamondDatas?.st_depth,
              })
            : "[]",
          variant_id: varaintId,
          item_id: "",
          src: "metal",
          secret_key: storeEntityIds.secret_key,
          calling: "1",
          default_variant_id: varaintId,
          is_customize: "1",
          is_dc: "1",
          is_smc: "0",
          stone_shape: "",
        };
        if (isItemDIY) {
          objFilter.diy_step =
            ActiveStepsDiys === 0 ? "" : ActiveStepsDiys.toString();
          objFilter.diy_type = "1";
          objFilter.diy_bom_id =
            ActiveStepsDiys > 0
              ? DiySteperDatas?.filter(
                  (item) => item.position === ActiveStepsDiys - 1
                )[0]?.diy_bom_id
              : "";
          objFilter.combination_id =
            ActiveStepsDiys > 0
              ? DiySteperDatas?.filter(
                  (item) => item.position === ActiveStepsDiys - 1
                )[0]?.combination_id
              : "";
        }
        dynamicSearchParameter(objFilter, true);
        isCallRef.current = true;
      }
    }
  }, [
    paramsItem,
    storeEntityIds,
    onceUpdated,
    isLogin,
    loginDatas,
    varaintId,
    currency,
  ]);

  //GEmstone Modal Stone Type
  const setGemStoneStoneType = (elm) => {
    const obj = {
      a: "getDIYCombinationStoneType",
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      combination_id: elm.combination_id,
      vertical_code: elm.vertical_code,
      SITDeveloper: "1",
    };
    commanService.postApi("/UniversalSearch2", obj).then((res) => {
      if (res.data.success === 1) {
        setShowStoneModal(true);
        setStoneTypeData(res.data.data);
        setModalTrue(true);
      }
    });
  };
  //DIY setStone Modal
  const setStoneModal = (value) => {
    if (complete) {
      handleComplete();
      return;
    }
    if (value != "") {
      callingJewel = "true";
    }
    setResetTrigger(false);
    setparamsItem("DIY");
    const obj = {
      a: "getDIYCombinationList",
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      variant_id: storeVariantId,
      item_id: itemId,
      metal_type: metalType,
      SITDeveloper: 1,
      shape: selectedShape,
    };
    commanService
      .postApi("/UniversalSearch2", obj)
      .then((res) => {
        if (res.data.success === 1) {
          const StoneName = res.data.data;

          if (StoneName.length > 0) {
            setStonesNo(res.data.data[0]?.no_of_stone);
            // if (isEmpty(StoneName[0].vertical_code) === "GEDIA") {
            //   setGemStoneStoneType(StoneName[0])
            // }
            if (isEmpty(selectedShape) != "") {
              if (res.data.data.length == 1) {
                setDIYBomId(res.data.data[0].diy_bom_id);
                setDIYComId(res.data.data[0].combination_id);
                if (pathname.includes("/start-with-a-setting")) {
                  setStoneTypeArr(StoneName);
                  setShowStoneModal(true);
                } else {
                  var s = {
                    combination_id: res.data.data[0].combination_id,
                    shape_code: selectedShape,
                    diy_bom_id: res.data.data[0].diy_bom_id,
                  };
                  verticalCode = res.data.data[0].vertical_code;
                  setVerticalCode(res.data.data[0].vertical_code);
                  DIYSizeData(s);
                }
              } else {
                setStoneTypeArr(StoneName);
                setShowStoneModal(true);
              }
            } else {
              setStoneTypeArr(StoneName);
              setShowStoneModal(true);
            }

            dispatch(diamondDIYimage(""));
            dispatch(diamondDIYName(""));
          } else {
            toast.error("Please Check Configuration");
          }
        } else {
          toast.error(res.data.message);
        }
      })
      .catch(() => {});
  };

  //Diamond filter for can be set
  const selectDiamond = (e, rowData) => {
    setShowStoneModal(false);
    setIsStone(true);
    verticalCode = e.vertical_code;
    setVerticalCode(e.vertical_code);
    if (e.no_of_stone === "1") {
      const getDIYShapeObj = {
        a: "getDIYCombinationShape",
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        SITDeveloper: 1,
        combination_id: rowData ? rowData.combination_id : e.combination_id,
        vertical_code: e.vertical_code,
      };
      commanService
        .postApi("/UniversalSearch2", getDIYShapeObj)
        .then((res) => {
          if (res.data.success === 1) {
            if (res.data.data.length > 0) {
              if (res.data.data.length == 1) {
                DIYSizeData(res.data.data[0]);
                setShapeStoneActive(res.data.data[0]);
                setDIYShapesDataList(res.data.data);
              } else {
                setShowStoneModal(true);
                setDIYShapesDataList(res.data.data);
              }
            }
          } else {
            toast.error(res.data.message);
          }
        })
        .catch(() => {});
    } else {
      clarityColorData(e, "");
    }
  };

  //get DIY size
  const DIYSizeData = (e) => {
    const obj = {
      a: "getDIYCombinationSize",
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      combination_id: e.combination_id,
      shape: e.shape_code,
      SITDeveloper: 1,
    };
    commanService
      .postApi("/UniversalSearch2", obj)
      .then((res) => {
        if (res.data.success === 1) {
          if (res.data.data.length > 0) {
            if (res.data.data.length == 1) {
              clarityColorData(e, res.data.data[0]);
            } else {
              setShowStoneModal(true);
              setDIYSizeDataList(res.data.data);
            }
          }
        } else {
          toast.error(res.data.message);
        }
      })
      .catch(() => {});
  };

  //get DIY color-clarity
  const clarityColorData = (e, sizeData) => {
    const clarityColorObj = {
      a: "getDIYCombinationClarityColor",
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      diy_bom_id: e.diy_bom_id,
      SITDeveloper: 1,
      variant_id: storeVariantId,
      item_id: itemId,
      combination_id: e.combination_id,
      shape: e.shape_code ? e.shape_code : "",
      size: sizeData !== undefined ? sizeData.size : "",
      color: isEmpty(selectedColor),
      vertical_code: isEmpty(verticalCode),
    };
    setClarityColorObj(clarityColorObj);
    var diy_bom_id = e.diy_bom_id;
    commanService
      .postApi("/UniversalSearch2", clarityColorObj)
      .then((res) => {
        if (res.data.success === 1) {
          const data = res.data.data;
          const arr = [...canBeSetData];
          if (data.length == 0) {
            if (arr.length > 0) {
              arr.map((e) => {
                e.clarity = [];
                e.color = [];
                return e;
              });
              setCanBeSetData(arr);
            }
            e.pv_unique_id = storeVariantId;
            e.diy_bom_id = diy_bom_id;
            newCanbeSetData(e);
          }
          if (data.length > 0) {
            if (data.length === 1 && data[0]["details"].length === 1) {
              if (arr.length > 0) {
                arr.map((e) => {
                  e.clarity = data[0].clarity;
                  e.color = data[0].color;
                  return e;
                });
                setCanBeSetData(arr);
              }
              e.pv_unique_id = data[0]["details"][0].pv_unique_id;
              e.diy_bom_id = diy_bom_id;
              newCanbeSetData(e);
            } else {
              for (let c = 0; c < data.length; c++) {
                var details = data[c]["details"];
                for (let d = 0; d < details.length; d++) {
                  details[d]["diy_bom_id"] = diy_bom_id;
                }
              }
              setDIYClarityDataList(data);
              setShowStoneModal(true);
            }
          }
        } else {
          toast.error(res.data.message);
        }
      })
      .catch(() => {});
  };

  //get DIY clarity
  const applyClarityFilter = (e, clarityData) => {
    const arr = [...canBeSetData];
    if (arr.length > 0) {
      arr.map((a) => {
        a.clarity = clarityData.clarity;
        a.color = e.color;
        return a;
      });
      setCanBeSetData(arr);
    }
    newCanbeSetData(e, clarityData);
  };

  //new can beset data for DIY
  const newCanbeSetData = (e, clarityData) => {
    if (
      !pathname.includes("/start-with-a-diamond") &&
      e.pv_unique_id !== storeVariantId &&
      verticalCode != "GEDIA"
    ) {
      // if (e.pv_unique_id !== storeVariantId && verticalCode != 'GEDIA') {
      const objFilter = {
        a: "getDynamicSearchParameter",
        product_diy: paramsItem === "DIY" ? "DIY" : "PRODUCT",
        SITDeveloper: "1",
        tenant_id: storeEntityIds.tenant_id,
        param: "[]",
        diamond_params: pathname.includes("start-with-a-diamond")
          ? JSON.stringify({
              shape: addedDiamondDatas?.st_shape,
              from_length: addedDiamondDatas?.st_length,
              from_width: addedDiamondDatas?.st_width,
              from_depth: addedDiamondDatas?.st_depth,
            })
          : "[]",
        variant_id: e.pv_unique_id,
        item_id: itemId,
        src: "metal",
        secret_key: storeEntityIds.secret_key,
        calling: "1",
        default_variant_id: e.pv_unique_id,
        is_customize: "1",
        is_dc: "1",
        is_smc: "0",
        stone_shape: "",
      };
      dynamicSearchParameter(objFilter, false);
      const obj = {
        a: "getDIYCanBeSetData",
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        combination_id: e.combination_id,
        diy_bom_id:
          clarityData !== undefined ? clarityData.diy_bom_id : e.diy_bom_id,
        SITDeveloper: 1,
        variant_id:
          e.pv_unique_id === undefined ? storeVariantId : e.pv_unique_id,
        item_id: itemId ?? specificationData?.item_id,
      };
      commanService
        .postApi("/UniversalSearch2", obj)
        .then((res) => {
          if (res.data.success === 1) {
            const data = res.data.data;
            if (data.length > 0) {
              for (let c = 0; c < data.length; c++) {
                data[c]["no_of_stone_array"] = [];
                var color = data[c]["details"]["shape"][0]["color"];
                var clarity = data[c]["details"]["shape"][0]["clarity"];
                var final_color = [];
                var final_clarity = [];
                if (color == undefined || color == null) {
                  color = [];
                }
                if (clarity == undefined || clarity == null) {
                  clarity = [];
                }
                if (color.length != 0 && color.includes("-")) {
                  final_color = color.split("-");
                } else {
                  final_color.push(color);
                }
                if (clarity.length != 0 && clarity.includes("-")) {
                  final_clarity = clarity.split("-");
                } else {
                  final_clarity.push(clarity);
                }
                data[c]["stone_types"] = [stoneTypeDataActive];
                data[c]["color"] = final_color;
                data[c]["clarity"] = final_clarity;
                data[c]["diy_bom_id"] = e.diy_bom_id;
                data[c]["combination_id"] = e.combination_id;
                data[c]["shape"] = data[c]["details"]["shape"];
                data[c]["set_stone"] = "0";
                data[c]["stone_size"] =
                  data[c]["details"][data[c]["shape"][0]["key"]];
                data[c]["vertical_code"] = data[c]["stone_type_arr"][0]["code"];
                data[c]["pv_unique_id"] = e.pv_unique_id;
                var array = [];
                for (let k = 1; k <= Number(data[c]["no_of_stone"]); k++) {
                  array.push({ sequence: k, set_stone: 0 });
                }
                data[c]["no_of_stone_array"] = array;
                data[c]["group_by"] = true;
                data[c]["showing_group"] = true;
                if (
                  data[c].vertical_code == "DIAMO" ||
                  data[c].vertical_code == "GEDIA" ||
                  data[c].vertical_code == "LGDIA"
                ) {
                  data[c]["group_by"] = false;
                  data[c]["showing_group"] = false;
                }
              }
              setFinalCanBeSet(data);
              dispatch(finalCanBeSetData(data));
              setStoneCanBeSetArr(data);
              if (isEmpty(stonesNo) == 1) {
                addStone(data[0], { sequence: 1, set_stone: 0 });
              }
              setShowStoneModal(false);
            }
          } else {
            toast.error(res.data.message);
          }
        })
        .catch(() => {});
    } else {
      const obj = {
        a: "getDIYCanBeSetData",
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        combination_id: e.combination_id,
        diy_bom_id: pathname.includes("/start-with-a-diamond")
          ? specificationData?.diy_bom_id
          : clarityData !== undefined
          ? clarityData.diy_bom_id
          : e.diy_bom_id,
        SITDeveloper: 1,
        variant_id:
          e.pv_unique_id === undefined ? storeVariantId : e.pv_unique_id,
        item_id: itemId ?? specificationData?.item_id,
      };
      commanService
        .postApi("/UniversalSearch2", obj)
        .then((res) => {
          if (res.data.success === 1) {
            const data = res.data.data;
            if (data.length > 0) {
              for (let c = 0; c < data.length; c++) {
                data[c]["no_of_stone_array"] = [];
                var color = data[c]["details"]["shape"][0]["color"];
                var clarity = data[c]["details"]["shape"][0]["clarity"];
                var final_color = [];
                var final_clarity = [];
                if (color == undefined || color == null) {
                  color = [];
                }
                if (clarity == undefined || clarity == null) {
                  clarity = [];
                }
                if (color.length != 0 && color.includes("-")) {
                  final_color = color.split("-");
                } else {
                  final_color.push(color);
                }

                if (clarity.length != 0 && clarity.includes("-")) {
                  final_clarity = clarity.split("-");
                } else {
                  final_clarity.push(clarity);
                }

                data[c]["color"] = final_color;
                data[c]["clarity"] = final_clarity;
                data[c]["diy_bom_id"] = e.diy_bom_id;
                data[c]["combination_id"] = e.combination_id;
                data[c]["shape"] = data[c]["details"]["shape"];
                data[c]["stone_types"] = [stoneTypeDataActive];
                data[c]["set_stone"] = "0";
                data[c]["stone_size"] =
                  data[c]["details"][data[c]["shape"][0]["key"]];
                data[c]["vertical_code"] = data[c]["stone_type_arr"][0]["code"];
                data[c]["pv_unique_id"] = e.pv_unique_id;
                var array = [];
                for (let k = 1; k <= Number(data[c]["no_of_stone"]); k++) {
                  array.push({ sequence: k, set_stone: 0 });
                }
                data[c]["no_of_stone_array"] = array;
                data[c]["group_by"] = true;
                data[c]["showing_group"] = true;
                if (
                  data[c].vertical_code == "DIAMO" ||
                  data[c].vertical_code == "GEDIA" ||
                  data[c].vertical_code == "LGDIA"
                ) {
                  data[c]["group_by"] = false;
                  data[c]["showing_group"] = false;
                }
              }

              setFinalCanBeSet(data);
              dispatch(finalCanBeSetData(data));
              setStoneCanBeSetArr(data);
              setShowStoneModal(false);
              if (isEmpty(stonesNo) == 1) {
                addStone(data[0], { sequence: 1, set_stone: 0 });
              }
            }
          } else {
            toast.error(res.data.message);
          }
        })
        .catch(() => {});
    }
  };

  //Set stone
  const setStone = (childData) => {
    setListandToggle(true);
    setVerticalCode("");
    setViewType("jewelery");
    if (callFirstTime === true) {
      const obj = {
        a: "getDIYCanBeSetData",
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        combination_id: childData.combination_id,
        diy_bom_id: childData.diy_bom_id,
        SITDeveloper: 1,
        variant_id: childData.pv_unique_id,
        item_id: itemId ?? specificationData?.item_id,
      };
      commanService.postApi("/UniversalSearch2", obj).then((res) => {
        if (res.data.success === 1) {
          imageImportinSpecificationDiy();
          setCallFirstTime(false);
          const data = res.data.data;
          var canbeset = [...finalCanBeSet];
          for (let c = 0; c < data.length; c++) {
            for (let i = 0; i < canbeset.length; i++) {
              if (canbeset[i].stone_position === data[c].stone_position) {
                canbeset[i]["details"] = data[c]["details"];
                canbeset[i]["stone_types"] = [stoneTypeDataActive];
                canbeset[i]["stone_size"] =
                  data[c]["details"][canbeset[i]["shape"][0]["key"]];
                canbeset[i]["combination_id"] = childData.combination_id;
                setCanBeSet(childData);
              }
            }
          }
          setFinalCanBeSet([...canbeset]);
          dispatch(finalCanBeSetData([...canbeset]));
          setStoneCanBeSetArr([...canbeset]);
          setIsStoneSelected(false);
        }
      });
      if (childData.vertical_code == "GEDIA") {
        var sub_data = childData.no_of_stone_array;
        for (let c = 0; c < sub_data.length; c++) {
          if (sub_data[c].set_stone == 1) {
            let claobj = {
              ...clarityColorObj,
              color: sub_data[c].stone_arr["st_col"],
            };
            setselectedColor(sub_data[c].stone_arr["st_col"]);

            commanService.postApi("/UniversalSearch2", claobj).then((res) => {
              if (res.data.success === 1) {
                const objFilter = {
                  a: "getDynamicSearchParameter",
                  product_diy: paramsItem === "DIY" ? "DIY" : "PRODUCT",
                  SITDeveloper: "1",
                  tenant_id: storeEntityIds.tenant_id,
                  param: "[]",
                  diamond_params: pathname.includes("start-with-a-diamond")
                    ? JSON.stringify({
                        shape: addedDiamondDatas?.st_shape,
                        from_length: addedDiamondDatas?.st_length,
                        from_width: addedDiamondDatas?.st_width,
                        from_depth: addedDiamondDatas?.st_depth,
                      })
                    : "[]",
                  variant_id: res.data.data[0].details[0].pv_unique_id,
                  item_id: itemId,
                  src: "metal",
                  secret_key: storeEntityIds.secret_key,
                  calling: "1",
                  default_variant_id: res.data.data[0].details[0].pv_unique_id,
                  is_customize: "1",
                  is_dc: "1",
                  is_smc: "0",
                  stone_shape: "",
                };
                dynamicSearchParameter(objFilter, false);
              }
            });
          }
        }
      }
    } else {
      setCanBeSet(childData);
      setIsStoneSelected(false);
    }
  };

  //Add stone
  const addStone = (c, item) => {
    if (pathname.includes("/start-with-a-diamond")) {
      diamondStepFirst();
    } else {
      setResetTrigger(false);
      if (item != "") {
        c["no_of_stone_sequence"] = item.sequence;
        setStoneElement(c);
      } else {
        c["no_of_stone_sequence"] = "1";
        setStoneElement(c);
      }

      setViewType("diamond");

      setVerticalCode(c.vertical_code);
    }
  };

  //Update stone Object
  function handleSetStone(item) {
    if (typeof item === "object") {
      setStoneObj(item);
    }
  }

  //Edit stone
  const editStoneMultiple = (c, item, index) => {
    if (pathname.includes("/start-with-a-diamond")) {
      diamondStepFirst();
    } else {
      if (typeof c === "object" && index !== undefined) {
        if (c["no_of_stone_array"]) {
          if (c["no_of_stone_array"][index]) {
            if (
              typeof c["no_of_stone_array"][index]["stone_arr"] === "object"
            ) {
              handleSetStone(c["no_of_stone_array"][index]["stone_arr"]);
            }
          }
        }
      }

      if (item != "") {
        c["no_of_stone_sequence"] = item.sequence;
        setStoneElement(c);
      } else {
        c["no_of_stone_sequence"] = "1";
        setStoneElement(c);
      }
      setViewType("diamond");
      setVerticalCode(c.vertical_code);
    }
  };

  //Remove Stone
  const removeStoneMultiple = (element, index, main_index) => {
    // if(location.pathname.includes("/start-with-a-diamond")){
    //     handleRemoveDiamond();
    // }else{

    var canbeset = [...finalCanBeSet];
    if (element.group_by == false) {
      if (index.toString() != "") {
        element["no_of_stone_array"][index]["st_stock_id"] = "";
        element["no_of_stone_array"][index]["st_shape"] = "";
        element["no_of_stone_array"][index]["stone_arr"] = [];
        element["no_of_stone_array"][index]["set_stone"] = 0;
        element["no_of_stone_array"][index]["vertical_code"] = "";
        canbeset[main_index] = element;
      } else {
        for (let c = 0; c < element["no_of_stone_array"].length; c++) {
          element["no_of_stone_array"][c]["st_stock_id"] = "";
          element["no_of_stone_array"][c]["st_shape"] = "";
          element["no_of_stone_array"][c]["stone_arr"] = [];
          element["no_of_stone_array"][c]["set_stone"] = 0;
          element["no_of_stone_array"][c]["vertical_code"] = "";
          canbeset[main_index] = element;
        }
      }

      if (
        pathname.includes("/start-with-a-setting") &&
        element["stone_position"] == "CENTER"
      ) {
        if (storeSelectedDiamondDatas.every((item) => item?.set_stone === 0)) {
          dispatch(diamondDIYName(""));
          dispatch(diamondDIYimage(""));
          dispatch(storeDiamondArrayImage([]));
        }
      } else {
        dispatch(diamondDIYName(""));
        dispatch(diamondDIYimage(""));
        dispatch(storeDiamondArrayImage([]));
      }
    } else {
      element["st_stock_id"] = "";
      element["st_shape"] = "";
      element["stone_arr"] = [];
      element["set_stone"] = 0;
      canbeset[main_index] = element;
      if (index.toString() == "") {
        for (let c = 0; c < element["no_of_stone_array"].length; c++) {
          element["no_of_stone_array"][c]["st_stock_id"] = "";
          element["no_of_stone_array"][c]["st_shape"] = "";
          element["no_of_stone_array"][c]["stone_arr"] = [];
          element["no_of_stone_array"][c]["set_stone"] = 0;
          element["no_of_stone_array"][c]["vertical_code"] = "";
          canbeset[main_index] = element;
        }
      }
      if (element["stone_position"] == "CENTER") {
        dispatch(diamondDIYName(""));
        dispatch(diamondDIYimage(""));
        dispatch(storeDiamondArrayImage([]));
      }
      // element['vertical_code'] = '';
    }
    setFinalCanBeSet([...canbeset]);
    dispatch(finalCanBeSetData([...canbeset]));
    setStoneCanBeSetArr(canbeset);
    setCanBeSet(canbeset);
    handleSetStone(canbeset);
    setIsStoneSelected(true);
    dispatch(diamondNumber(""));
    dispatch(addedDiamondData({}));
    dispatch(storeDiamondNumber(""));
    if (pathname.includes("/start-with-a-diamond")) {
      setSelectedDiamond({});
      setIsDiamondSelected(false);
      dispatch(IsSelectedDiamond(false));
    }
    // }
  };

  //Group By stone
  const groupByStone = (element) => {
    const canbesetArr = [...finalCanBeSet];
    for (let i = 0; i < canbesetArr.length; i++) {
      if (canbesetArr[i]["stone_position"] == element["stone_position"]) {
        removeStoneMultiple(canbesetArr[i], "", i);
        canbesetArr[i]["group_by"] = !canbesetArr[i]["group_by"];
      }
    }
    setFinalCanBeSet(canbesetArr);
    dispatch(finalCanBeSetData(canbesetArr));
    setStoneCanBeSetArr(canbesetArr);
  };

  //State update with dependencies
  useEffect(() => {
    if (viewType === "review") {
      setComplete(true);
      imageImportinSpecificationDiy();
    }
    // if (
    //   location.pathname.includes("/start-with-a-diamond") &&
    //   isRingSelecteds === true
    // ) {
    //   dispatch(activeDIYtabs("Complete"));
    // }
  }, [viewType]);

  //fucntion call with dependencies
  useEffect(() => {
    if (pathname.includes("/start-with-a-diamond") && finalCanBeSetDatas) {
      handleSetCanBeSet();
    } else {
    }
  }, [finalCanBeSet]);

  //DIY first step ring Navigation function
  function handleFirstStep() {
    setCallFirstTime(true);
    setIsStone(false);
    // setIsStoneSelected(true);
    setViewType("jewelery");
    setVerticalCode("");
    // setFinalCanBeSet([]);
    dispatch(activeDIYtabs("Jewellery"));
  }

  //back
  const backToList = () => {
    if (params?.value !== undefined && params?.slug[1] !== "campaign") {
      if (paramsItem === "DIY") {
        router.push(
          `/make-your-customization/start-with-a-setting/${params.value}`
        );
      } else if (isItemDIY === true) {
        if (activeStep >= 0) {
          setTypeViewDiy(false);
          dispatch(storeFilteredData({}));
          dispatch(storeActiveFilteredData({}));
          DiySteperDatas?.map((step, index) => {
            if (step.position === activeStep) {
              if (activeStep >= 0) {
                const previousStep = DiySteperDatas[activeStep - 1];
                const currentStep = step;
                dispatch(ActiveStepsDiy(activeStep));

                const diyBomId = previousStep?.diy_bom_id ?? "";
                const verticalCode = currentStep?.vertical;

                sessionStorage.setItem("DIYVertical", verticalCode);
                sessionStorage.setItem(
                  "itemToItemData",
                  JSON.stringify({
                    nextStepPosition: activeStep,
                    combination_id: previousStep?.combination_id ?? "",
                    diy_bom_id: diyBomId,
                    verticalCode: verticalCode,
                  })
                );
                return router.push(
                  "/make-your-customization/start-with-a-item"
                );
              } else {
              }
            }
          });
        }
      } else {
        const routerPath = sessionStorage.getItem("routerPath");
        if (routerPath) {
          router.push(`${routerPath}`);
        } else {
          router.push(`/products/${params?.slug[0]}`);
        }
        // if (params?.slug[1] == "offer") {
        //   router.push(`/products/${params?.slug[0]}/offer/${params?.slug[2]}`);
        // } else {
        //   router.push(`/products/${params?.slug[0]}/type/${params?.slug[2]}`);
        // }
      }
    } else {
      if (paramsItem === "DIY") {
        if (pathname.includes("/start-with-a-diamond")) {
          if (
            pathname.includes("/start-with-a-diamond/jewellery") &&
            activeDIYtabss === "Complete"
          ) {
            diamondStepTwo();
            dispatch(isRingSelected(false));
            dispatch(activeDIYtabs("Jewellery"));
          } else if (
            pathname.includes("/start-with-a-diamond/jewellery") &&
            activeDIYtabss === "Jewellery" &&
            isRingSelecteds === true
          ) {
            router.push("/make-your-customization/start-with-a-diamond");
            dispatch(activeDIYtabs("Diamond"));
            diamondStepFirst();
          } else {
            diamondStepFirst();
          }
        } else if (pathname.includes("/start-with-a-setting")) {
          if (
            pathname.includes("/start-with-a-setting") &&
            activeDIYtabss === "Complete"
          ) {
            handleBackToDiamond();
            dispatch(activeDIYtabs("Diamond"));
          } else if (
            pathname.includes("/start-with-a-setting") &&
            activeDIYtabss === "Diamond"
          ) {
            handleFirstStep();
            dispatch(activeDIYtabs("Jewellery"));
          } else {
            router.push("/make-your-customization/start-with-a-setting");
            dispatch(storeSelectedDiamondData({}));
            dispatch(isFilter(true));
            dispatch(filterData([]));
            dispatch(filteredData([]));
            dispatch(allFilteredData([]));
            dispatch(diamondSelectShape([]));
            dispatch(storeItemObject({}));
            dispatch(storeFilteredDiamondObj({}));
            dispatch(storeActiveFilteredData({}));
            dispatch(storeFilteredData({}));
            dispatch(diamondPageChnages(false));
            dispatch(diamondNumber(""));
            dispatch(storeSpecData({}));
            dispatch(storeProdData({}));
            dispatch(finalCanBeSetData([]));
            dispatch(storeSelectedDiamondData([]));
            dispatch(storeSelectedDiamondPrice(0));
            dispatch(jeweleryDIYName(""));
            dispatch(jeweleryDIYimage(""));
            dispatch(diamondDIYimage(""));
            dispatch(finalCanBeSetData([]));
            dispatch(activeDIYtabs("Jewellery"));
          }
        } else if (isItemDIY === true) {
          if (activeStep >= 0) {
            setTypeViewDiy(false);
            dispatch(storeFilteredData({}));
            dispatch(storeActiveFilteredData({}));
            DiySteperDatas.map((step, index) => {
              if (step.position === activeStep) {
                if (activeStep >= 0) {
                  const previousStep = DiySteperDatas[activeStep - 1];
                  const currentStep = step;
                  dispatch(ActiveStepsDiy(activeStep));

                  const diyBomId = previousStep?.diy_bom_id ?? "";
                  const verticalCode = currentStep.vertical;
                  sessionStorage.setItem("DIYVertical", verticalCode);
                  sessionStorage.setItem(
                    "itemToItemData",
                    JSON.stringify({
                      nextStepPosition: activeStep,
                      combination_id: previousStep?.combination_id ?? "",
                      diy_bom_id: diyBomId,
                      verticalCode: verticalCode,
                    })
                  );
                  return router.push(
                    "/make-your-customization/start-with-a-item"
                  );
                } else {
                }
              }
            });
          }
        }
      } else {
        // if (params.title !== undefined && pathname.includes("/type/")) {
        //   router.push(`/products/${props.verticalCode}/type/${params.title}`);
        // } else {
        //   router.push(`/products/${props.verticalCode}`);
        // }
        const routerPath = sessionStorage.getItem("routerPath");
        if (routerPath) {
          router.push(`${routerPath}`);
        } else {
          router.push(`/products/${params?.slug[0]}`);
        }
      }
    }
  };

  //DIY back
  const parentBack = () => {
    if (pathname.includes("/start-with-a-diamond") && props.backToList) {
      props.backToList();
    } else {
      var count = 0;
      for (let c = 0; c < finalCanBeSet.length; c++) {
        if (
          isEmpty(finalCanBeSet[c]["no_of_stone_array"][0].set_stone) == "1"
        ) {
          count++;
        }
      }
      if (count == 0) {
        setFinalCanBeSet([]);
      }
    }
    setVerticalCode("");
    setViewType("jewelery");
    dispatch(activeDIYtabs("Jewellery"));
  };

  //Diamond Back
  const handleBackToDiamond = () => {
    if (finalStoneArr.length) {
      if (typeof finalStoneArr[0] === "object") {
        const codeVal = finalStoneArr[0].vertical_code;
        if (codeVal) {
          editStoneMultiple(finalStoneArr[0], "");
          dispatch(diamondPageChnages(false));
          setVerticalCode(codeVal);
        }
      }
    }
  };

  //State update
  const go_to_review = () => {
    setViewType("review");
  };

  //DIY go to diamond
  const go_to_diamond = () => {
    for (let i = 0; i < finalCanBeSet.length; i++) {
      if (finalCanBeSet[i].stone_position == "CENTER") {
        if (
          finalCanBeSet[i]["no_of_stone_array"][0]["stone_arr"][
            "st_short_code"
          ] == "DIAMO" ||
          finalCanBeSet[i]["no_of_stone_array"][0]["stone_arr"][
            "st_short_code"
          ] == "LGDIA" ||
          finalCanBeSet[i]["no_of_stone_array"][0]["stone_arr"][
            "st_short_code"
          ] == "GEDIA"
        ) {
          editStoneMultiple(
            finalCanBeSet[i],
            finalCanBeSet[i]["no_of_stone_array"][0]
          );
        }
      }
    }
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
      saveEngraving && engravingData?.service_rate
        ? extractNumber(engravingData?.service_rate.toString()) || 0
        : 0;

    let embossingPrice =
      SaveEmbossing === true
        ? extractNumber(embossingData?.[0]?.service_rate.toString())
        : 0;

    let otherService = serviceData?.some(
      (item) =>
        (item.is_selected === true || item.is_selected === "1") &&
        item.service_type === "Normal"
    )
      ? serviceData
          ?.filter(
            (item) =>
              (item.is_selected === true || item.is_selected === "1") &&
              item.service_type === "Normal"
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

  // DIY Set Items
  const handleSetItemsDIY = () => {
    if (
      isItemDIY &&
      ActiveStepsDiys === DiySteperDatas[DiySteperDatas?.length - 2]?.position
    ) {
      const services = [];
      serviceData.forEach((element) => {
        const serviceItem = {
          text: "",
          type: "",
          image: "",
          is_selected: element.is_selected,
          currency: element?.msrv_currency,
          msrv_currency: element?.msrv_currency,
          price: element?.service_rate,
          font_size: element?.font_size,
          min_character: element?.min_character,
          max_character: element?.max_character,
          unique_id: element?.service_unique_id,
          service_code: element?.service_code,
          service_name: element?.service_name,
          service_type: element?.service_type,
          service_rate: element?.service_rate,
        };

        if (
          element?.service_code == "ENGRAVING" &&
          element.service_type === "Special"
        ) {
          serviceItem.type = isItalicFont ? "italic" : "bold";
          serviceItem.text = saveEngraving === true ? engravingTexts : "";
          serviceItem.is_selected = engravingTexts !== "" ? "1" : "0";
        }

        if (
          element?.service_code == "EMBOSSING" &&
          element.service_type === "Special"
        ) {
          serviceItem.image = activeImgSave;
          serviceItem.is_selected =
            activeImgSave.some((img) => img?.embImage !== "") == true
              ? "1"
              : "0";
        }

        otherService.forEach((ele) => {
          if (ele.service_unique_id == element?.service_unique_id) {
            serviceItem.is_selected = element.is_selected == true ? "1" : "0";
          }
        });
        services.push(serviceItem);
      });
      const updatedStepperData = DiySteperDatas?.map((step, index) => {
        if (step.position === activeStep) {
          const data = storeSpecDatas;
          return {
            ...step,
            qty: quantity,
            image_urls: data?.images,
            product_name: data?.variant_data?.[0]?.product_name,
            product_title:
              isEmpty(params.title) !== ""
                ? firstWordCapital(params.title.split("-").join(" "))
                : "",
            short_summary: data?.short_summary,
            item_base_price: data?.final_total_display,
            currency_base_symbol: data?.currency_symbol,
            metal_type: metalType,
            variant_sku: data?.variant_data?.[0]?.product_sku,
            product_variant: data?.variant_data?.[0]?.product_variant,
            vertical: data?.variant_data?.[0]?.vertical_short_code,
            price: calculatePrice(
              specificationData,
              selectedOffer,
              saveEngraving,
              SaveEmbossing,
              embossingData,
              serviceData
            ),
            new_price: calculatePrice(
              specificationData,
              selectedOffer,
              saveEngraving,
              SaveEmbossing,
              embossingData,
              serviceData
            ),
            old_price: calculatePrice(
              specificationData,
              [],
              saveEngraving,
              SaveEmbossing,
              embossingData,
              serviceData
            ),
            currency: data?.currency_symbol,
            nextStepPosition: activeStep,
            // combination_id: bomDetails?.combination_id,
            // diy_bom_id: bomDetails?.diy_bom_id,
            variant_unique_id: data?.variant_data?.[0]?.variant_unique_id,
            item_id: data?.item_id,
            mi_unique_id: data?.mi_unique_id,
            group_code: data?.variant_data?.[0]?.item_group,
            variant_id: data?.variant_data?.[0]?.variant_unique_id,
            price_type: data?.variant_data?.[0]?.bom_type,
            store_tax_included_in_price: data?.store_tax_included_in_price,
            is_engraving: data?.is_engraving,
            eng_font: isItalicFont ? "italic" : "bold",
            eng_text: saveEngraving === true ? engravingTexts : "",
            eng_price: engravingData?.service_rate,
            eng_currency: engravingData?.msrv_currency,
            eng_font_size: engravingData?.font_size,
            eng_max_character: engravingData?.max_character,
            eng_min_character: engravingData?.min_character,
            engraving_unique_id: engravingData?.service_unique_id,
            embossing_unique_id: embossingData?.[0]?.service_unique_id,
            embossing_json: JSON.stringify(activeImgSave),
            engravingData: engravingData,
            saveEngraving: saveEngraving,
            engravingTexts: engravingTexts,
            isEngraving: isEngraving,
            isItalicFont: isItalicFont,
            engravingText: engravingText,
            embossingArea: embossingArea,
            previewImageData: previewImageData,
            SaveEmbossing: SaveEmbossing,
            activeImg: activeImg,
            activeImgSave: activeImgSave,
            service_json: serviceData.length > 0 ? services : [],
            offer_code:
              selectedOffer.length > 0 ? selectedOffer[0].coupon_code : "",
          };
        }
        return step;
      });
      const nextStepPosition = activeStep + 1;
      dispatch(DiySteperData(updatedStepperData));
      setActiveStep(nextStepPosition);
      dispatch(ActiveStepsDiy(nextStepPosition));
      setTypeViewDiy(true);
    } else {
      setLoading(true);
      const obj = {
        a: "getDIYCombinationList",
        diy_bom_id:
          activeStep > 0
            ? DiySteperDatas?.filter(
                (item) => item.position === activeStep - 1
              )[0]?.diy_bom_id
            : "",
        combination_id:
          activeStep > 0
            ? DiySteperDatas?.filter(
                (item) => item.position === activeStep - 1
              )[0]?.combination_id
            : "",
        diy_step: activeStep + 1,
        diy_type: "1",
        entity_id: storeEntityIds.entity_id,
        item_id: itemId,
        metal_type: metalType,
        shape: selectedShape,
        tenant_id: storeEntityIds.tenant_id,
        variant_id: storeVariantId,
        SITDeveloper: 1,
      };
      commanService
        .postApi("/UniversalSearch2", obj)
        .then((res) => {
          if (res.data.success === 1) {
            const bomDetails = res?.data?.data?.[0];
            if (activeStep < DiySteperDatas?.length && bomDetails) {
              const services = [];
              serviceData.forEach((element) => {
                const serviceItem = {
                  text: "",
                  type: "",
                  image: "",
                  is_selected: element.is_selected,
                  currency: element?.msrv_currency,
                  msrv_currency: element?.msrv_currency,
                  price: element?.service_rate,
                  font_size: element?.font_size,
                  min_character: element?.min_character,
                  max_character: element?.max_character,
                  unique_id: element?.service_unique_id,
                  service_code: element?.service_code,
                  service_name: element?.service_name,
                  service_type: element?.service_type,
                  service_rate: element?.service_rate,
                };

                if (
                  element?.service_code == "ENGRAVING" &&
                  element.service_type === "Special"
                ) {
                  serviceItem.type = isItalicFont ? "italic" : "bold";
                  serviceItem.text =
                    saveEngraving === true ? engravingTexts : "";
                  serviceItem.is_selected = engravingTexts !== "" ? "1" : "0";
                }

                if (
                  element?.service_code == "EMBOSSING" &&
                  element.service_type === "Special"
                ) {
                  serviceItem.image = activeImgSave;
                  serviceItem.is_selected =
                    activeImgSave.some((img) => img?.embImage !== "") == true
                      ? "1"
                      : "0";
                }

                otherService.forEach((ele) => {
                  if (ele.service_unique_id == element?.service_unique_id) {
                    serviceItem.is_selected =
                      element.is_selected == true ? "1" : "0";
                  }
                });
                services.push(serviceItem);
              });
              const updatedStepperData = DiySteperDatas?.map((step, index) => {
                if (step.position === activeStep) {
                  const data = storeSpecDatas;
                  return {
                    ...step,
                    qty: quantity,
                    image_urls: data?.images,
                    product_name: data?.variant_data?.[0]?.product_name,
                    product_title:
                      isEmpty(params.title) !== ""
                        ? firstWordCapital(params.title.split("-").join(" "))
                        : "",
                    short_summary: data?.short_summary,
                    item_base_price: data?.final_total_display,
                    currency_base_symbol: data?.currency_symbol,
                    metal_type: metalType,
                    variant_sku: data?.variant_data?.[0]?.product_sku,
                    product_variant: data?.variant_data?.[0]?.product_variant,
                    vertical: data?.variant_data?.[0]?.vertical_short_code,
                    price: calculatePrice(
                      specificationData,
                      selectedOffer,
                      saveEngraving,
                      SaveEmbossing,
                      embossingData,
                      serviceData
                    ),
                    new_price: calculatePrice(
                      specificationData,
                      selectedOffer,
                      saveEngraving,
                      SaveEmbossing,
                      embossingData,
                      serviceData
                    ),
                    old_price: calculatePrice(
                      specificationData,
                      [],
                      saveEngraving,
                      SaveEmbossing,
                      embossingData,
                      serviceData
                    ),
                    currency: data?.currency_symbol,
                    nextStepPosition: activeStep,
                    combination_id: bomDetails?.combination_id,
                    diy_bom_id: bomDetails?.diy_bom_id,
                    variant_unique_id:
                      data?.variant_data?.[0]?.variant_unique_id,
                    item_id: data?.item_id,
                    mi_unique_id: data?.mi_unique_id,
                    group_code: data?.variant_data?.[0]?.item_group,
                    variant_id: data?.variant_data?.[0]?.variant_unique_id,
                    price_type: data?.variant_data?.[0]?.bom_type,
                    store_tax_included_in_price:
                      data?.store_tax_included_in_price,
                    is_engraving: data?.is_engraving,
                    eng_font: isItalicFont ? "italic" : "bold",
                    eng_text: saveEngraving === true ? engravingTexts : "",
                    eng_price: engravingData?.service_rate,
                    eng_currency: engravingData?.msrv_currency,
                    eng_font_size: engravingData?.font_size,
                    eng_max_character: engravingData?.max_character,
                    eng_min_character: engravingData?.min_character,
                    engraving_unique_id: engravingData?.service_unique_id,
                    embossing_unique_id: embossingData?.[0]?.service_unique_id,
                    embossing_json: JSON.stringify(activeImgSave),
                    engravingData: engravingData,
                    saveEngraving: saveEngraving,
                    engravingTexts: engravingTexts,
                    isEngraving: isEngraving,
                    isItalicFont: isItalicFont,
                    engravingText: engravingText,
                    embossingArea: embossingArea,
                    previewImageData: previewImageData,
                    SaveEmbossing: SaveEmbossing,
                    activeImg: activeImg,
                    activeImgSave: activeImgSave,
                    service_json: serviceData.length > 0 ? services : [],
                    offer_code:
                      selectedOffer.length > 0
                        ? selectedOffer[0].coupon_code
                        : "",
                  };
                }
                return step;
              });

              const nextStepPosition = activeStep + 1;
              dispatch(DiySteperData(updatedStepperData));

              setActiveStep(nextStepPosition);
              dispatch(ActiveStepsDiy(nextStepPosition));
              sessionStorage.setItem(
                "itemToItemData",
                JSON.stringify({
                  nextStepPosition: nextStepPosition,
                  combination_id: bomDetails?.combination_id,
                  diy_bom_id: bomDetails?.diy_bom_id,
                  verticalCode: bomDetails?.vertical_code,
                })
              );
              router.push("/make-your-customization/start-with-a-item");
              dispatch(storeEmbossingData([]));
              dispatch(serviceAllData([]));
              dispatch(saveEmbossings(false));
              dispatch(previewImageDatas([]));
              dispatch(activeImageData([]));
              dispatch(engravingObj({}));
            } else {
              toast.error("Please Check Your Configuration!");
            }
          } else {
            toast.error(res.data.message);
          }
        })
        .catch(() => {});
    }
  };

  //Chnage DIY item specification
  const handleOnChangeDiyItem = (data) => {
    setActiveStep(data?.position);
    dispatch(ActiveStepsDiy(data?.position));
    if (data?.position === DiySteperDatas?.length - 1) {
      setTypeViewDiy(true);
    } else {
      sessionStorage.setItem("DIYVertical", data?.vertical);
      setTypeViewDiy(false);
    }
    router.push(
      `/make-your-customization/start-with-a-item/${changeUrl(
        `${data.product_name + "-" + data.variant_unique_id}`
      )}`
    );
  };
  //Onchnage for Other services
  const onChangeService = (item, index) => {
    setServiceData((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        is_selected: updated[index].is_selected === "1" ? "0" : "1",
      };
      dispatch(serviceAllData(updated));
      return updated;
    });
  };

  //DIY price function
  const calculateTotalPrice = (data) => {
    return data.reduce((total, item) => {
      const price = parseFloat(extractNumber(item.price));
      const qty = parseFloat(item.qty);
      if (isNaN(price) || isNaN(qty)) {
        return total;
      }
      return total + price * qty;
    }, 0);
  };

  //Update states according to related conditions
  useEffect(() => {
    if (
      IsSelectedDiamonds === true &&
      activeDIYtabss === "Complete" &&
      pathname.includes("/start-with-a-diamond")
    ) {
      setViewType("review");
      setIsDiamondSelected(false);
      dispatch(IsSelectedDiamond(true));
      dispatch(isRingSelected(true));
      setIsStone(true);
    }
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
      isEmpty(sessionStorage.getItem("DIYVertical")) === "" &&
      isItemDIY === true
    ) {
      dispatch(DiySteperData([]));
      dispatch(ActiveStepsDiy(0));
      router.push("/make-your-customization");
    }
  }, []);

  //Update States with Initial Call
  useEffect(() => {
    if (paramsItems === "PRODUCT") {
      setdiamondSummary([]);
      setdiamondSummaryname([]);
      setSecondDiamondSummary([]);
      setSecondDiamondSummaryname([]);
      // setRelatedProductData([])
      setIsEndReached(false);
      setSwiperInstance(null);
      setHasMoreRelated(false);
      setCount(1);
      setOnceUpdated(false);
    }
  }, [params]);

  useEffect(() => {
    if (isIncludeCard()) {
      setQty(isIncludeCard().data?.[0]?.item_qty);
    } else {
      setQty(quantity);
    }
  }, [getCartItems]);

  useEffect(() => {
    if (!specificationData) return;

    let storeBasePrice = parseFloat(specificationData?.final_total) || 0;
    let offerPrice = 0;
    let customDuty = 0;
    let tax = 0;
    let total = 0;
    let diamondPriceDIY = 0;

    if (Array.isArray(selectedOffer) && selectedOffer.length > 0) {
      const discountValue = extractNumber(selectedOffer[0]?.discount) || 0;
      offerPrice =
        selectedOffer[0]?.offer_type === "FLAT"
          ? discountValue
          : parseFloat(((storeBasePrice * discountValue) / 100).toFixed(2)) ||
            0;
    }

    const engravingPrice =
      saveEngraving && engravingData?.service_rate
        ? extractNumber(engravingData.service_rate.toString()) || 0
        : 0;

    const embossingPrice =
      SaveEmbossing === true
        ? extractNumber(embossingData?.[0]?.service_rate?.toString()) || 0
        : 0;

    const otherService = Array.isArray(serviceData)
      ? serviceData.reduce((total, item) => {
          if (item.is_selected === true || item.is_selected === "1") {
            const price = parseFloat(extractNumber(item.service_rate));
            return isNaN(price) ? total : total + price;
          }
          return total;
        }, 0)
      : 0;

    const customPer = extractNumber(specificationData?.custom_per) || 0;
    const taxPer = extractNumber(specificationData?.tax1) || 0;
    // diamondPriceDIY = pathname.includes("start-with-a-setting")
    //   ? extractNumber(storeSelectedDiamondPrices)
    //   : pathname.includes("start-with-a-diamond")
    //   ? extractNumber(addedDiamondDatas.final_total_display)
    //   : 0;
    const subtotal =
      storeBasePrice -
      offerPrice +
      engravingPrice +
      embossingPrice +
      otherService;
    customDuty = parseFloat(((subtotal * customPer) / 100).toFixed(2)) || 0;
    tax =
      parseFloat((((subtotal + customDuty) * taxPer) / 100).toFixed(2)) || 0;
    total =
      storeBasePrice -
      offerPrice +
      engravingPrice +
      embossingPrice +
      otherService +
      customDuty +
      tax +
      diamondPriceDIY;
    const services = [];

    if (Array.isArray(serviceData)) {
      serviceData.forEach((element) => {
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
          element?.service_code === "ENGRAVING" &&
          element.service_type === "Special"
        ) {
          serviceItem.type = isItalicFont ? "italic" : "bold";
          serviceItem.text = saveEngraving === true ? engravingTexts : "";
          serviceItem.is_selected = engravingTexts !== "" ? "1" : "0";
        }

        if (
          element?.service_code === "EMBOSSING" &&
          element.service_type === "Special"
        ) {
          serviceItem.image = activeImgSave;
          serviceItem.is_selected = activeImgSave?.some(
            (img) => img?.embImage !== ""
          )
            ? "1"
            : "0";
        }

        services.push(serviceItem);
      });
    }

    setProductBreakupData({
      basePrice: storeBasePrice,
      unitPrice: storeBasePrice - offerPrice,
      servicePrice: services,
      discountPrice: offerPrice,
      discountPer: parseFloat(((offerPrice / storeBasePrice) * 100).toFixed(2)),
      diamondPriceDIY: diamondPriceDIY,
      subTotal:
        storeBasePrice -
        offerPrice +
        engravingPrice +
        embossingPrice +
        otherService,
      taxPrice: tax * qty,
      customDutyTax: customDuty * qty,
      qty: qty,
      totalPrice: total * qty,
    });
  }, [
    specificationData,
    selectedOffer,
    saveEngraving,
    SaveEmbossing,
    embossingData,
    serviceData,
    engravingData,
    isItalicFont,
    engravingTexts,
    activeImgSave,
    qty,
  ]);

  const handleResetStartwithDIY = () => {
    setResetTrigger(true);
    dispatch(diamondPageChnages(false));
    dispatch(diamondNumber(""));
    dispatch(storeSelectedDiamondPrice(0));
    dispatch(jeweleryDIYimage(""));
    dispatch(diamondDIYimage(""));
    dispatch(finalCanBeSetData([]));
    dispatch(caratVlaues([]));
    dispatch(activeDIYtabs("Jewellery"));
    dispatch(storeSelectedDiamondData({}));
    dispatch(storeSelectedDiamondData({}));
    dispatch(jeweleryDIYName(""));
    dispatch(jeweleryDIYimage(""));
    dispatch(diamondDIYimage(""));
    dispatch(storeDiamondNumber(""));
    dispatch(IsSelectedDiamond(false));
    dispatch(isRingSelected(false));
    dispatch(addedDiamondData({}));
    dispatch(storeDiamondArrayImage({}));
    dispatch(diamondSelectShape({}));
    dispatch(storeEmbossingData([]));
    dispatch(saveEmbossings(false));
    dispatch(activeImageData([]));
    dispatch(ActiveStepsDiy(0));
    dispatch(engravingObj({}));
    dispatch(diamondImage(""));
    dispatch(diamondShape(""));
    dispatch(serviceAllData([]));
    setComplete(false);
    setIsStone(false);
    dispatch(addedRingData({}));
    setFinalTotal("");
    setProductSKU("");
    setSalesTotalPrice("");
    setViewType("jewelery");
    dispatch(dimaondColorType("White"));
    dispatch(storeFilteredDiamondObj({}));
    dispatch(storeActiveFilteredData({}));
    dispatch(storeFilteredData({}));
    let storeObj = { ...specificationData };
    const images = [
      {
        image_urls: [
          ...(storeObj?.variant_data?.[0]?.image_urls || []),
          ...(storeObj?.image_urls || []),
        ],
      },
    ];
    let consolidatedImages = consolidateImageUrlsProduct(images);
    if (consolidatedImages instanceof Set) {
      consolidatedImages = Array.from(consolidatedImages);
    }

    // const combinationImage = finalCanBeSetDatas?.[0]?.combination_image;
    // if (combinationImage && finalCanBeSetDatas?.length > 0) {
    //   consolidatedImages = [combinationImage, ...consolidatedImages];
    // }

    storeObj.images = Array.from(new Set(consolidatedImages));

    const types = [
      {
        image_types: [
          ...(storeObj?.variant_data?.[0]?.image_types || []),
          ...(storeObj?.image_types || []),
        ],
      },
    ];

    let consolidatedTypes = consolidateImageTypesProduct(types);
    if (consolidatedTypes instanceof Set) {
      consolidatedTypes = Array.from(consolidatedTypes);
    }
    storeObj.image_types = Array.from(new Set(consolidatedTypes));

    setSpecificationData(storeObj);
    dispatch(storeSpecData(storeObj));
    // imageImportinSpecificationDiy();
    // router.replace(`${router.asPath}`)
    // window.location.reload();
  };

  const handleAccept = () => {
    handleResetStartwithDIY();
    setShowConfirm(false);
  };

  const handleDecline = () => {
    setShowConfirm(false);
  };

  const handleConfirmAction = () => {
    Swal.fire({
      title: "Your current customization settings will be lost!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Do you still want to continue?",
      cancelButtonText: "No, keep it",
      // reverseButtons: true,
      // focusCancel: true,
      customClass: {
        popup: "rounded-4 shadow-lg",
        confirmButton: "btn btn-outline-primary mx-2",
        cancelButton: "btn btn-outline-primary mx-2",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        handleAccept();
      } else if (result.isDismissed) {
        handleDecline();
      }
    });
  };

  return viewType == "jewelery" || viewType == "review" ? (
    <main className="page-wrapper">
      <section className="product-single container product-single__type-9 pt-3">
        {loading && <Loader />}
        {isItemDIY ? (
          <DIYSetupAP
            product_type="Product"
            setLoading={setLoading}
            setSelectedOffer={setSelectedOffer}
            setEngravingData={setEngravingData}
            calculatePrice={calculatePrice}
            activeStep={activeStep}
            setEmbossingArea={setEmbossingArea}
            setEmbossingData={setEmbossingData}
            position={activeStep}
            setActiveStep={setActiveStep}
            setTypeViewDiy={setTypeViewDiy}
          />
        ) : null}
        {paramsItems === "DIY" && !isItemDIY ? (
          <DIYSteps
            finalCanBeSet={finalCanBeSet}
            handleFirstStep={handleFirstStep}
            go_to_diamond={go_to_diamond}
            go_to_review={go_to_review}
            handleComplete={handleComplete}
            handleBackToDiamond={handleBackToDiamond}
            parentCallback={handleBackToDiamond}
            complete={complete}
            finalTotal={finalTotal}
            productSKU={productSKU}
            salesTotalPrice={numberWithCommas(salesTotalPrice)}
            backToList={backToList}
            diamondStepTwo={diamondStepTwo}
            diamondStepFirst={diamondStepFirst}
            diamondComplete={diamondComplete}
            isOffers={isOffers}
            specificationData={specificationData}
            selectedOffer={selectedOffer}
            isEngraving={saveEngraving}
            embossingData={embossingData}
            isEmbossing={SaveEmbossing}
            serviceData={serviceData}
            calculatePrice={calculatePrice}
            resetTrigger={resetTrigger}
          />
        ) : (
          ""
        )}
        <div className="d-flex justify-content-between pb-2">
          <div className="breadcrumb mb-0 flex-grow-1">
            <BreadCumb />
          </div>
          {!typeViewDiy && (
            <div className="mb-0 d-md-block ">
              <div
                className={`fs-15 menu-link menu-link_us-s add-to-wishlist cursor-pointer`}
                onClick={() => {
                  backToList();
                }}
              >
                <span>Back</span>
              </div>
            </div>
          )}
          {/* <!-- /.breadcrumb --> */}
        </div>
        {typeViewDiy && isItemDIY === true ? (
          <>
            <div className="row">
              <div className="col-lg-7">
                <ProductSlider1
                  productData={DiySteperDatas}
                  isStone={isStone}
                  type={"review"}
                />
              </div>
              <div className="col-lg-5">
                <div className="d-flex justify-content-between">
                  <h1 className="product-single__name">Review</h1>
                </div>
                {DiySteperDatas && DiySteperDatas?.length > 0
                  ? DiySteperDatas?.map((item, i) => {
                      if (item.display_name === "Complete") {
                        return;
                      }
                      return (
                        <div className="diy-steper-info" key={i}>
                          <div className="diy-steper-product">
                            {item?.image_urls?.[0] !== "" && (
                              <Image
                                src={item?.image_urls?.[0]}
                                width={100}
                                height={100}
                                alt="image"
                              />
                            )}
                            <div className="diy-steper-body">
                              <div className="diy-steper-title">
                                {item.product_name}
                              </div>
                              {item.variant_sku !== "" && (
                                <div className="diy-steper-sky">
                                  SKU: {item.variant_sku}
                                </div>
                              )}
                              {item.price !== "" && (
                                <div className="diy-steper-price">
                                  {DiySteperDatas[0]?.currency} {item.price}{" "}
                                  {isEmpty(item.offer_code) !== "" ? (
                                    <span className="old-price">
                                      {DiySteperDatas[0]?.currency}{" "}
                                      {item.old_price}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              )}
                              <div className="d-flex flex-column flex-wrap gap-2">
                                {DiySteperDatas?.length - 1 !== i &&
                                  item.service_json.map((elm, l) => {
                                    return (
                                      <React.Fragment key={l}>
                                        {elm?.service_code === "ENGRAVING" &&
                                        elm.service_type === "Special" &&
                                        elm.text !== "" ? (
                                          <div className="off_engraving">
                                            <div className="is_Engraving">
                                              <a className="engraving">
                                                Engraving Text :{" "}
                                                <span
                                                  className="text-decoration-underline"
                                                  style={
                                                    elm?.type === "italic"
                                                      ? {
                                                          fontStyle: "italic",
                                                        }
                                                      : {
                                                          fontStyle: "normal",
                                                        }
                                                  }
                                                  onClick={() => {
                                                    setIsItalicFont(
                                                      elm?.type === "italic"
                                                        ? true
                                                        : false
                                                    );
                                                    // setEngravingText(
                                                    //   elm?.text
                                                    // );
                                                  }}
                                                >
                                                  {elm?.text}
                                                </span>
                                              </a>
                                            </div>
                                          </div>
                                        ) : null}
                                        {elm?.service_code === "EMBOSSING" &&
                                        elm.service_type === "Special" &&
                                        elm.image?.length > 0 &&
                                        (elm.image.some(
                                          (img) => img?.embImage !== ""
                                        ) == true ||
                                          elm.image?.[0]?.embImage !== "") ? (
                                          <div className="image_preview engraving">
                                            <span className="fs-14px fw-400 ">
                                              Embossing
                                            </span>
                                            <span
                                              className="ms-1 cursor-pointer text-underline"
                                              onClick={() => {
                                                setEmbossingPreviewModalView(
                                                  true
                                                );
                                                setEmbossingPreviewModalBaseView(
                                                  true
                                                );
                                                setActiveImg(elm.image);
                                              }}
                                              data-toggle="modal"
                                              data-target="#embossingPreview"
                                              role="button"
                                            >
                                              <Image
                                                src={elm.image?.[0]?.embImage}
                                                className="img-fluid"
                                                width={100}
                                                height={100}
                                                alt="Embossing Preview"
                                              />
                                            </span>
                                          </div>
                                        ) : null}

                                        {elm.is_selected == "1" ? (
                                          <div>
                                            {elm.service_name}{" "}
                                            {elm.service_rate ? (
                                              <span className="fw-semibold">
                                                {"(" +
                                                  extractNumber(
                                                    elm.service_rate
                                                  ).toFixed(2) +
                                                  " " +
                                                  elm.currency +
                                                  ")"}
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                      </React.Fragment>
                                    );
                                  })}
                              </div>
                            </div>
                          </div>
                          <div className="diy-steper-change">
                            <a
                              className={`change-links`}
                              onClick={() => {
                                handleOnChangeDiyItem(item, i);
                              }}
                            >
                              <span>Change</span>
                            </a>
                          </div>
                        </div>
                      );
                    })
                  : ""}

                <div className="product-single__price mt-3">
                  {" "}
                  Total {DiySteperDatas[0]?.currency}{" "}
                  {numberWithCommas(
                    calculateTotalPrice(DiySteperDatas).toFixed(2)
                  )}
                </div>
                <div className="product-single__addtocart">
                  {isItemDIY && typeViewDiy ? (
                    <div className="qty-control position-relative">
                      <input
                        type="number"
                        name="quantity"
                        value={quantity}
                        min="1"
                        onChange={(e) => {
                          const value = Math.max(1, Number(e.target.value));
                          const newQuantity = parseInt(value, 10);
                          setQuantity(newQuantity);
                          setQuantityCartItem(DiySteperDatas, newQuantity);
                        }}
                        className="qty-control__number text-center"
                      />

                      <div
                        onClick={() => {
                          const newQuantity = Math.max(quantity - 1, 1);
                          setQuantity(newQuantity);
                          setQuantityCartItem(DiySteperDatas, newQuantity);
                        }}
                        className="qty-control__reduce"
                      >
                        -
                      </div>

                      <div
                        onClick={() => {
                          const newQuantity = quantity + 1;
                          setQuantity(newQuantity);
                          setQuantityCartItem(DiySteperDatas, newQuantity);
                        }}
                        className="qty-control__increase"
                      >
                        +
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="">
                    <button
                      className="btn btn-primary btn-addtocart js-open-aside"
                      onClick={() => addToCartDIY()}
                    >
                      {"Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="row">
            <div className="col-lg-7">
              <ProductSlider1
                productData={specificationData}
                isStone={isStone}
              />
            </div>
            <div className="col-lg-5">
              {activeDIYtabss === "Complete" ? (
                <div className="d-flex justify-content-between">
                  <h1 className="product-single__name">
                    {Object.keys(specificationData).length > 0
                      ? specificationData?.variant_data[0]?.product_name
                      : ""}
                  </h1>
                  <div className="mb-0 d-md-block ">
                    <div
                      className={`fs-15 menu-link menu-link_us-s add-to-wishlist cursor-pointer`}
                      onClick={() => {
                        if (pathname.includes("start-with-a-setting")) {
                          handleConfirmAction();
                        } else {
                          diamondStepTwo();
                        }
                      }}
                    >
                      <span>Change</span>
                    </div>
                  </div>
                </div>
              ) : (
                <h1 className="product-single__name">
                  {Object.keys(specificationData).length > 0
                    ? specificationData?.variant_data?.[0]?.product_name
                    : ""}
                </h1>
              )}
              <div className="product-single__meta-info mb-2">
                <div className="meta-item">
                  <label>SKU:</label>
                  <span>
                    {" "}
                    {specificationData?.variant_data?.[0]?.product_sku}
                  </span>
                </div>
              </div>
              <div className="product-single__price">
                {isEmpty(
                  calculatePrice(
                    specificationData,
                    selectedOffer,
                    saveEngraving,
                    SaveEmbossing,
                    embossingData,
                    serviceData
                  )
                ) !== "" ? (
                  <div className="product-single__price">
                    {/* Displaying Product price by varying with offers and engraving */}
                    <span
                      className={` pe-2 ${
                        selectedOffer?.length > 0 && isOffers
                          ? "special-price"
                          : "current-price"
                      }`}
                    >
                      {specificationData.currency_symbol}{" "}
                      {numberWithCommas(
                        (
                          extractNumber(
                            calculatePrice(
                              specificationData,
                              selectedOffer,
                              saveEngraving,
                              SaveEmbossing,
                              embossingData,
                              serviceData
                            )
                          ) * qty
                        ).toFixed(2)
                      )}
                    </span>
                    {selectedOffer[0] !== undefined && isOffers ? (
                      <span className="old-price">
                        {specificationData.currency_symbol}{" "}
                        {numberWithCommas(
                          (
                            extractNumber(
                              calculatePrice(
                                specificationData,
                                [],
                                saveEngraving,
                                SaveEmbossing,
                                embossingData,
                                serviceData
                              )
                            ) * qty
                          ).toFixed(2)
                        )}
                      </span>
                    ) : (
                      ""
                    )}
                    {specificationData?.store_tax_included_in_price === "1" ? (
                      <>
                        <span className="inclusive">
                          (Inclusive of all taxes)
                        </span>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>

              {isEmpty(specificationData?.short_summary) !== "" &&
              isEmpty(specificationData?.short_summary) != "" ? (
                <div className="d-flex flex-wrap gap-3 mb-3">
                  {isEmpty(specificationData?.short_summary?.gold_wt) != "" &&
                  specificationData?.short_summary?.gold_wt > 0 ? (
                    <div className="d-flex flex-column">
                      <label className="h6">Gold Weight</label>
                      <p className="mb-0">{`${specificationData?.short_summary?.gold_wt} ${specificationData?.short_summary?.gold_wt_unit}`}</p>
                    </div>
                  ) : (
                    ""
                  )}
                  {isEmpty(specificationData?.short_summary?.dia_wt) != "" &&
                  specificationData?.short_summary?.dia_wt > 0 ? (
                    <div className="d-flex flex-column">
                      <label className="h6">Diamond Weight</label>
                      <p className="mb-0">
                        {specificationData?.short_summary?.dia_wt}{" "}
                        {specificationData?.short_summary?.dia_first_unit}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                  {isEmpty(specificationData?.short_summary?.col_wt) != "" &&
                  specificationData?.short_summary?.col_wt > 0 ? (
                    <div className="d-flex flex-column">
                      <label className="h6">Gemstone Weight</label>
                      <p className="mb-0">
                        {specificationData?.short_summary?.col_wt}{" "}
                        {specificationData?.short_summary?.col_first_unit}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
              <form onSubmit={(e) => e.preventDefault()}>
                {(isStone === false && viewType === "jewelery") ||
                (isRingSelecteds === false &&
                  activeDIYtabss === "Jewellery" &&
                  pathname.includes("/start-with-a-diamond/jewellery")) ? (
                  <>
                    <div className="product-single__swatches">
                      <div className="product-swatch text-swatches">
                        {/* <label>Sizes</label> */}
                        <div className="swatch-list flex-column align-items-start flex-wrap">
                          <Size
                            specificationData={specificationData}
                            productData={specificationData}
                            metalType={metalType}
                            filterProduct={filterProduct}
                            appliedFilter={appliedFilter}
                          />
                          {serviceData && serviceData?.length > 0 && (
                            <div className="w-100">
                              <div className="h6">Services</div>
                              <div className="d-flex flex-column gap-2">
                                {serviceData?.length > 0 &&
                                  serviceData?.map((item, i) => {
                                    return (
                                      <React.Fragment key={i}>
                                        {item &&
                                        item.service_code === "ENGRAVING" &&
                                        item.service_type === "Special" ? (
                                          <OutsideClickHandler
                                            onOutsideClick={() =>
                                              handleCloseEngraving()
                                            }
                                          >
                                            <div className="EngravingTextRing">
                                              {engravingTexts.length > 0 ? (
                                                <div className="Engravingtitle">
                                                  <div
                                                    className="btnLink"
                                                    onClick={() => {
                                                      setIsEngraving(
                                                        !isEngraving
                                                      );
                                                    }}
                                                  >
                                                    <span>
                                                      Engraving Text :{" "}
                                                      {engravingTexts}
                                                    </span>
                                                  </div>
                                                </div>
                                              ) : (
                                                <div className="Engravingtitle">
                                                  <div
                                                    className="btnLink"
                                                    onClick={() => {
                                                      setIsEngraving(
                                                        !isEngraving
                                                      );
                                                    }}
                                                  >
                                                    <svg
                                                      width="16"
                                                      height="16"
                                                      aria-hidden="true"
                                                      className="icon"
                                                    >
                                                      <use xlinkHref="#icon_plus" />
                                                    </svg>
                                                    <span className="ps-2">
                                                      Add Engraving
                                                    </span>
                                                  </div>
                                                </div>
                                              )}

                                              {isEngraving ? (
                                                <div className="EngravingPopup">
                                                  <div
                                                    className="ClosePopup"
                                                    onClick={() => {
                                                      handleCloseEngraving();
                                                    }}
                                                  >
                                                    <i className="btn-close-xs position-absolute top-0 end-0 js-cart-item-remove"></i>
                                                  </div>
                                                  <div>
                                                    <div className="EngravingPopupTitle">
                                                      Enter Engraving{" "}
                                                      {item.service_rate ? (
                                                        <span className="fw-semibold">
                                                          {"(" +
                                                            extractNumber(
                                                              item.service_rate
                                                            ).toFixed(2) +
                                                            " " +
                                                            item.msrv_currency +
                                                            ")"}
                                                        </span>
                                                      ) : (
                                                        ""
                                                      )}
                                                    </div>
                                                    <div className="EngravingPopupInput">
                                                      <input
                                                        ref={inputRef}
                                                        placeholder="Enter Engraving"
                                                        className="w-100 line-normal form-control text-description"
                                                        type="text"
                                                        name="engravingText"
                                                        maxLength={
                                                          item.max_character
                                                            ? parseInt(
                                                                item.max_character
                                                              )
                                                            : 8
                                                        }
                                                        autoComplete="off"
                                                        onChange={(e) =>
                                                          setEngravingText(
                                                            e.target.value
                                                          )
                                                        }
                                                        value={engravingText}
                                                      />
                                                      <main className="d-flex justify-content-between">
                                                        <div className="fs-11px">
                                                          <span className="pe-2">
                                                            Min :{" "}
                                                            {item.min_character}
                                                          </span>
                                                          <span>
                                                            Max :{" "}
                                                            {item.max_character}
                                                          </span>
                                                        </div>
                                                        <div className="fs-11px">
                                                          Characters Left:{" "}
                                                          {item.max_character
                                                            ? parseInt(
                                                                item.max_character
                                                              ) -
                                                              engravingText.length
                                                            : ""}
                                                        </div>
                                                      </main>
                                                    </div>
                                                    <div className="ChooseFontFamily">
                                                      <h6 className="EngravingPopupTitle my-2">
                                                        Choose Font Family
                                                      </h6>
                                                      <div className="py-1">
                                                        <i
                                                          style={{
                                                            fontStyle: "normal",
                                                          }}
                                                          className={`me-1  cursor-pointer p-1 border border-black fw-normal fs-7 ${
                                                            isItalicFont
                                                              ? "border-1"
                                                              : "border-1 borderdark "
                                                          }`}
                                                          onClick={() =>
                                                            setIsItalicFont(
                                                              false
                                                            )
                                                          }
                                                        >
                                                          Aa
                                                        </i>
                                                        <i
                                                          style={{
                                                            fontStyle: "italic",
                                                          }}
                                                          className={`ms-1  cursor-pointer p-1 border border-black fs-7 ${
                                                            isItalicFont
                                                              ? "border-1 borderdark p-1"
                                                              : "border-1"
                                                          }`}
                                                          onClick={() =>
                                                            setIsItalicFont(
                                                              true
                                                            )
                                                          }
                                                        >
                                                          Aa
                                                        </i>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="EngravingPopupPreview">
                                                    <p className="EngravingPopupTitle my-2">
                                                      Preview
                                                    </p>
                                                    {specificationData
                                                      .variant_data?.[0]
                                                      ?.vertical_short_code ===
                                                    "JEWEL" ? (
                                                      <div className="engraving-ring ">
                                                        <div className="fs-6">
                                                          <svg viewBox="0 0 248 120">
                                                            <path
                                                              id="SVGID_x5F_2_x5F_"
                                                              d="M0,80 Q124,32 248,80"
                                                              fill="transparent"
                                                            ></path>
                                                            <text textAnchor="middle">
                                                              <textPath
                                                                href="#SVGID_x5F_2_x5F_"
                                                                startOffset="50%"
                                                              >
                                                                <tspan
                                                                  style={{
                                                                    fontStyle:
                                                                      isItalicFont
                                                                        ? "italic"
                                                                        : "normal",
                                                                    fontSize: `${item?.font_size}px`,
                                                                    letterSpacing:
                                                                      "1px",
                                                                    textShadow:
                                                                      "#979696 1px 1px",
                                                                  }}
                                                                  xlinkHref="#SVGID_x5F_2_x5F_"
                                                                >
                                                                  {
                                                                    engravingText
                                                                  }
                                                                </tspan>
                                                              </textPath>
                                                            </text>
                                                          </svg>
                                                        </div>
                                                      </div>
                                                    ) : (
                                                      <div
                                                        className={`engravingBox ${
                                                          specificationData
                                                            .variant_data?.[0]
                                                            ?.vertical_short_code ===
                                                          "FRAME"
                                                            ? "engraving-frame"
                                                            : "engraving-all"
                                                        }`}
                                                      >
                                                        <p
                                                          className="m-0"
                                                          style={{
                                                            fontStyle:
                                                              isItalicFont
                                                                ? "italic"
                                                                : "normal",
                                                            fontSize: `${item?.font_size}px`,
                                                          }}
                                                        >
                                                          {engravingText}
                                                        </p>
                                                      </div>
                                                    )}
                                                  </div>
                                                  <div className="EngravingBtn mt-2 text-end">
                                                    <button
                                                      className="btn btn-primary p-0 px-3 py-2"
                                                      onClick={() =>
                                                        handleSaveEngraving(
                                                          item
                                                        )
                                                      }
                                                    >
                                                      Save
                                                    </button>
                                                  </div>
                                                </div>
                                              ) : null}
                                            </div>
                                          </OutsideClickHandler>
                                        ) : (
                                          <></>
                                        )}

                                        {item.service_code === "EMBOSSING" &&
                                        item.service_type === "Special" &&
                                        item.image !== "" &&
                                        specificationData?.variant_data?.[0]
                                          ?.image_area?.length > 0 &&
                                        embossingArea?.filter(
                                          (item) => item !== ""
                                        )?.length > 0 ? (
                                          <div className="EngravingClick">
                                            <div>
                                              <div
                                                className="EngravingTextRing"
                                                onClick={() => {
                                                  setEmbossingModalView(true);
                                                }}
                                                data-toggle="modal"
                                                data-target="#setEmbossing"
                                                role="button"
                                              >
                                                <div className="Engravingtitle">
                                                  {SaveEmbossing === false ? (
                                                    <div className="btnLink">
                                                      <svg
                                                        width="16"
                                                        height="16"
                                                        aria-hidden="true"
                                                        className="icon"
                                                      >
                                                        <use xlinkHref="#icon_plus" />
                                                      </svg>
                                                      <span className="ps-2">
                                                        Add Embossing
                                                      </span>
                                                    </div>
                                                  ) : (
                                                    <div className="btnLink">
                                                      <span>Embossing</span>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>

                                            <div>
                                              <div className="preview-img ms-2">
                                                <div
                                                  onClick={() => {
                                                    setEmbossingPreviewModalView(
                                                      true
                                                    );
                                                    setEmbossingPreviewModalBaseView(
                                                      true
                                                    );
                                                    // setActiveImg(item.image);
                                                  }}
                                                  data-toggle="modal"
                                                  data-target="#embossingPreview"
                                                  role="button"
                                                >
                                                  <Image
                                                    width={43}
                                                    height={43}
                                                    src={
                                                      previewImageData?.[0]
                                                        ?.embImage ??
                                                      specificationData
                                                        ?.variant_data?.[0]
                                                        ?.image_urls[0]
                                                    }
                                                    className="engravingimage img-fluid"
                                                    alt="Embossing Preview"
                                                  />
                                                  <span>Preview</span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          ""
                                        )}

                                        {item.service_type === "Normal" && (
                                          <div
                                            className="form-check mb-0"
                                            key={item.service_code}
                                          >
                                            <input
                                              className="form-check-input form-check-input_fill"
                                              type="checkbox"
                                              checked={item.is_selected === "1"}
                                              onChange={() =>
                                                onChangeService(item, i)
                                              }
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor={`service_${item.service_code}`}
                                            >
                                              {item.service_name}
                                            </label>
                                            {item.service_rate ? (
                                              <span className="fw-semibold">
                                                {"(" +
                                                  extractNumber(
                                                    item.service_rate
                                                  ).toFixed(2) +
                                                  " " +
                                                  item.msrv_currency +
                                                  ")"}
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        )}
                                      </React.Fragment>
                                    );
                                  })}
                              </div>
                            </div>
                          )}
                          {specificationData.offers &&
                          specificationData.offers.length > 0 ? (
                            <div className="product-single__swatches w-100">
                              <div className="AvailableOffers">
                                <div className={`${isOffers ? "hidden" : ""}`}>
                                  <div
                                    className="btnLink h6"
                                    onClick={() => setIsOffers(!isOffers)}
                                  >
                                    Available Offers
                                  </div>
                                </div>
                                {isOffers &&
                                  specificationData.offers.map((offer, h) => {
                                    const isOfferApplied = selectedOffer.some(
                                      (item) =>
                                        item.coupon_code === offer.coupon_code
                                    );

                                    return (
                                      <div
                                        className="AppliedSuccessfully"
                                        key={h}
                                      >
                                        <div className="d-flex justify-content-between align-items-center">
                                          <div className="offer-section">
                                            <svg
                                              width="18"
                                              height="18"
                                              aria-hidden="true"
                                            >
                                              <use xlinkHref="#icon_gift" />
                                            </svg>
                                            {isOfferApplied ? (
                                              <span className="">
                                                Coupon code&nbsp;
                                                <b>{offer.coupon_code}</b>{" "}
                                                &nbsp;Applied Successfully.
                                              </span>
                                            ) : (
                                              <>
                                                <span>{`GET ${
                                                  offer.discount
                                                } ${offer.offer_type.replace(
                                                  "PERCENTAGE",
                                                  "%"
                                                )} DISCOUNT`}</span>
                                                <b>
                                                  &nbsp; Save {storeCurrencys}{" "}
                                                  {numberWithCommas(extractNumber(offer.discount_price.toString()).toFixed(2))}
                                                </b>
                                              </>
                                            )}
                                          </div>
                                          <div className="offer-links">
                                            {isOfferApplied ? (
                                              <a
                                                className="links-btn"
                                                onClick={() =>
                                                  handleAppliedCode(offer, h)
                                                }
                                              >
                                                Remove
                                              </a>
                                            ) : (
                                              <a
                                                className="links-btn"
                                                onClick={() =>
                                                  handleCouponApply(offer, h)
                                                }
                                              >
                                                Apply
                                              </a>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        {/* <a
                        href="#"
                        className="sizeguide-link"
                        data-bs-toggle="modal"
                        data-bs-target="#sizeGuide"
                      >
                        Size Guide
                      </a> */}
                      </div>
                      {/* <div className="product-swatch color-swatches">
                      <label>Color</label>
                      <div className="swatch-list">
                        <Colors />
                      </div>
                    </div> */}
                    </div>
                  </>
                ) : selectedDiamond &&
                  (IsSelectedDiamonds === true || isRingSelecteds === true) &&
                  activeDIYtabss === "Complete" &&
                  pathname.includes("/start-with-a-diamond") ? (
                  finalCanBeSet.length > 0 &&
                  finalCanBeSet.map((c, index) => (
                    <div className="mb-20px" key={index}>
                      <div className="mb-10px d-flex align-items-center justify-content-between">
                        <h2 className="fs-20px detail-sub-heading">
                          {c.stone_position_name} ({c.no_of_stone})
                        </h2>
                        {c.showing_group === true ? (
                          <button
                            className="btn fs-10px my-1"
                            onClick={() => groupByStone(c)}
                          >
                            {c.no_of_stone_array.length} Stones
                          </button>
                        ) : (
                          ""
                        )}
                      </div>

                      {c.group_by == false ? (
                        <React.Fragment>
                          {c.no_of_stone_array.length > 0 &&
                            c.no_of_stone_array.map((d, i) => (
                              <div
                                className="mb-3 StoneSetBox sec-bg-color"
                                key={i}
                              >
                                <div className="StoneSetBox_inner">
                                  <div className="stone_title">
                                    <p className="fs-20px">1</p>
                                  </div>

                                  <React.Fragment>
                                    <>
                                      {c.shape.length > 0 &&
                                        c.shape.map((a, id) => (
                                          <div
                                            className="StoneShapeSub"
                                            key={id}
                                          >
                                            <i
                                              className={`shape-color ${a.image}`}
                                            ></i>
                                            <div className="fs-12px fw-500">
                                              {a.value}
                                            </div>
                                          </div>
                                        ))}
                                      <div className="StoneShapeSub" key={i}>
                                        <h5>Stone Type </h5>
                                        {d.set_stone == "0" &&
                                        !addedDiamondDatas.st_cert_no ? (
                                          <div className="fs-12px">
                                            {c.stone_type}
                                          </div>
                                        ) : (
                                          <div className="fs-12px">
                                            <span>{c.stone_type} </span>
                                            <br></br>
                                            <span>
                                              ({d?.stone_arr?.["st_lab"]}{" "}
                                              {d.stone_arr?.["st_cert_no"]})
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      <div className="StoneShapeSub">
                                        {d.set_stone == "0" &&
                                        !addedDiamondDatas.st_cert_no ? (
                                          <>
                                            <h5>Size</h5>
                                            {c.stone_size.length > 0 &&
                                              c.stone_size.map((a, id) => (
                                                <span
                                                  className="fs-12px"
                                                  key={id}
                                                >
                                                  {a.key}
                                                  {id < c.stone_size.length - 1
                                                    ? ","
                                                    : ""}
                                                </span>
                                              ))}
                                          </>
                                        ) : (
                                          <>
                                            <h5>Size</h5>
                                            <span className="fs-12px">
                                              {d.stone_arr?.["st_size"]}
                                            </span>
                                          </>
                                        )}
                                      </div>
                                      {d.set_stone == "0" &&
                                      !addedDiamondDatas.st_cert_no ? (
                                        ""
                                      ) : (
                                        <>
                                          <div className="StoneShapeSub">
                                            <h5>Clarity</h5>
                                            <span className="fs-12px ml-2">
                                              {d.stone_arr?.["st_cla"]}
                                            </span>
                                          </div>
                                          <div className="StoneShapeSub">
                                            <h5>Color</h5>
                                            <span className="fs-12px ml-2">
                                              {d.stone_arr?.["st_col"]}
                                            </span>
                                          </div>
                                          <div className="StoneShapeSub">
                                            <h5>Price</h5>
                                            <span className="fs-14px ml-2">
                                              <b>
                                                {d.stone_arr?.["currency_code"]}{" "}
                                                {
                                                  d.stone_arr?.[
                                                    "ex_store_price"
                                                  ]
                                                }
                                              </b>
                                            </span>
                                          </div>
                                        </>
                                      )}
                                    </>
                                  </React.Fragment>

                                  <div className="btn-edit-remove">
                                    {(
                                      pathname.includes("/start-with-a-diamond")
                                        ? !addedDiamondDatas.st_cert_no
                                        : d.set_stone !== "0"
                                    ) ? (
                                      <div>
                                        <button
                                          className="btn btn-normal mt-1"
                                          onClick={() => {
                                            addStone(c, d);
                                            dispatch(diamondPageChnages(false));
                                          }}
                                        >
                                          Set Stone
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        <div>
                                          <button
                                            className="btn btn-normal"
                                            onClick={() => {
                                              editStoneMultiple(c, d, index);
                                              dispatch(
                                                diamondPageChnages(false)
                                              );
                                            }}
                                          >
                                            {" "}
                                            Edit Stone
                                          </button>
                                        </div>
                                        <div>
                                          <button
                                            className="btn btn-normal mt-1"
                                            onClick={() => {
                                              removeStoneMultiple(c, i, index);
                                              dispatch(
                                                diamondPageChnages(false)
                                              );
                                            }}
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <div className="mb-3 StoneSetBox sec-bg-color">
                            <div className="StoneSetBox_inner">
                              <div className="stone_title">
                                <p className="fs-20px">{c.no_of_stone}</p>
                              </div>
                              <React.Fragment>
                                {c.shape.length > 0 &&
                                  c.shape.map((a, id) => (
                                    <div className="StoneShapeSub" key={id}>
                                      <i
                                        className={`shape-color ${a.image}`}
                                      ></i>
                                      <div className="fs-12px fw-500">
                                        {a.value}
                                      </div>
                                    </div>
                                  ))}

                                <div className="StoneShapeSub">
                                  <h5>Stone Type </h5>
                                  <div className="fs-12px">{c.stone_type}</div>
                                </div>
                              </React.Fragment>

                              <React.Fragment>
                                <div className="bg-white  StoneSetBox_size">
                                  <div className="StoneSetBox_size_title">
                                    <h5>Size</h5>
                                  </div>
                                  <div className="StoneSetBox_size_dec">
                                    {c.stone_size.length > 0 &&
                                      c.stone_size.map((a, id) => (
                                        <span className="fs-12px" key={id}>
                                          {a.key}
                                          {id < c.stone_size.length - 1
                                            ? ","
                                            : ""}
                                        </span>
                                      ))}
                                  </div>
                                </div>
                              </React.Fragment>

                              <div className="btn-edit-remove">
                                {c.set_stone == "0" ? (
                                  <div>
                                    <button
                                      className="btn btn-dark-green fs-10px mb-1"
                                      onClick={() => {
                                        addStone(c, "");
                                      }}
                                    >
                                      Set Stone
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <div>
                                      <button
                                        className="btn btn-dark-green fs-10px mb-1"
                                        onClick={() => {
                                          editStoneMultiple(c, "", index);
                                        }}
                                      >
                                        Edit Stone
                                      </button>
                                    </div>
                                    <div>
                                      <button
                                        className="btn btn-remove fs-10px mb-1"
                                        onClick={() => {
                                          removeStoneMultiple(c, "", index);
                                        }}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      )}
                    </div>
                  ))
                ) : (
                  finalCanBeSet.length > 0 &&
                  finalCanBeSet.map((c, index) => (
                    <div className="mb-30px" key={index}>
                      <div className="mb-10px d-flex align-items-center justify-content-between">
                        <h2 className="fs-20px detail-sub-heading">
                          {c.stone_position_name} ({c.no_of_stone})
                        </h2>
                        {c.showing_group === true ? (
                          <button
                            className="btn fs-10px my-1"
                            onClick={() => groupByStone(c)}
                          >
                            {c.no_of_stone_array.length} Stones
                          </button>
                        ) : (
                          ""
                        )}
                      </div>

                      {c.group_by == false ? (
                        <React.Fragment>
                          {c.no_of_stone_array.length > 0 &&
                            c.no_of_stone_array.map((d, i) => (
                              <div className="StoneSetBox sec-bg-color" key={i}>
                                <div className="StoneSetBox_inner">
                                  <div className="StoneSetBox_sub_inner">
                                    <div className="stone_title">
                                      <p className="fs-20px">1</p>
                                    </div>

                                    <React.Fragment>
                                      <>
                                        {c.shape.length > 0 &&
                                          c.shape.map((a, id) => (
                                            <div
                                              className="StoneShapeSub"
                                              key={id}
                                            >
                                              <i
                                                className={` shape-color ${a.image}`}
                                              ></i>
                                              <div className="fs-12px fw-500">
                                                {a.value}
                                              </div>
                                            </div>
                                          ))}

                                        <div className="StoneShapeSub" key={i}>
                                          <h5>Stone Type </h5>
                                          {d.set_stone == "0" ? (
                                            <div className="fs-12px">
                                              {c.stone_type}
                                            </div>
                                          ) : (
                                            <div className="fs-12px">
                                              <span>{c.stone_type} </span>
                                              <br></br>
                                              <span>
                                                ({d.stone_arr["st_lab"]}{" "}
                                                {d.stone_arr["st_cert_no"]})
                                              </span>
                                            </div>
                                          )}
                                        </div>

                                        <div className="StoneShapeSub">
                                          {d.set_stone == "0" ? (
                                            <>
                                              <h5>Size</h5>
                                              {c.stone_size.length > 0 &&
                                                c.stone_size.map((a, id) => (
                                                  <span
                                                    className="fs-12px"
                                                    key={id}
                                                  >
                                                    {a.key}
                                                    {id <
                                                    c.stone_size.length - 1
                                                      ? ","
                                                      : ""}
                                                  </span>
                                                ))}
                                            </>
                                          ) : (
                                            <>
                                              <h5>Size</h5>
                                              <span className="fs-12px">
                                                {d.stone_arr["st_size"]}
                                              </span>
                                            </>
                                          )}
                                        </div>

                                        {d.set_stone == "0" ? (
                                          ""
                                        ) : (
                                          <>
                                            <div className="StoneShapeSub">
                                              <h5>Clarity</h5>
                                              <span className="fs-12px ml-2">
                                                {d.stone_arr["st_cla"]}
                                              </span>
                                            </div>
                                            <div className="StoneShapeSub">
                                              <h5>Color</h5>
                                              <span className="fs-12px ml-2">
                                                {d.stone_arr["st_col"]}
                                              </span>
                                            </div>
                                            <div className="StoneShapeSub">
                                              <h5>Price</h5>
                                              <span className="fs-12px ml-2 fw-500">
                                                <b>
                                                  {
                                                    d.stone_arr?.[
                                                      "currency_code"
                                                    ]
                                                  }{" "}
                                                  {
                                                    d.stone_arr[
                                                      "ex_store_price"
                                                    ]
                                                  }
                                                </b>
                                              </span>
                                            </div>
                                          </>
                                        )}
                                      </>
                                    </React.Fragment>
                                  </div>

                                  <div className="btn-edit-remove">
                                    {d.set_stone == "0" ? (
                                      <div>
                                        <button
                                          className="btn btn-normal"
                                          onClick={() => {
                                            addStone(c, d);
                                            dispatch(diamondPageChnages(false));
                                          }}
                                        >
                                          Set Stone
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        <div>
                                          <button
                                            className="btn btn-normal"
                                            onClick={() => {
                                              editStoneMultiple(c, d, index);
                                              dispatch(
                                                diamondPageChnages(false)
                                              );
                                            }}
                                          >
                                            {" "}
                                            Edit Stone
                                          </button>
                                        </div>
                                        <div>
                                          <button
                                            className="btn btn-normal mt-1"
                                            onClick={() => {
                                              removeStoneMultiple(c, i, index);
                                              dispatch(
                                                diamondPageChnages(false)
                                              );
                                            }}
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <div className="mb-3 StoneSetBox sec-bg-color">
                            <div className="StoneSetBox_inner">
                              <div className="stone_title">
                                <p className="fs-20px">{c.no_of_stone}</p>
                              </div>
                              <React.Fragment>
                                {c.shape.length > 0 &&
                                  c.shape.map((a, id) => (
                                    <div className="StoneShapeSub" key={id}>
                                      <i
                                        className={`shape-color ${a.image}`}
                                      ></i>
                                      <div className="fs-12px fw-500">
                                        {a.value}
                                      </div>
                                    </div>
                                  ))}
                                <div className="StoneShapeSub">
                                  <h5>Stone Type </h5>
                                  <div className="fs-12px">{c.stone_type}</div>
                                </div>
                              </React.Fragment>

                              <React.Fragment>
                                <div className="bg-white  StoneSetBox_size">
                                  <div className="StoneSetBox_size_title">
                                    <h5>Size</h5>
                                  </div>
                                  <div className="StoneSetBox_size_dec">
                                    {c.stone_size.length > 0 &&
                                      c.stone_size.map((a, id) => (
                                        <span className="fs-12px" key={id}>
                                          {a.key}
                                          {id < c.stone_size.length - 1
                                            ? ","
                                            : ""}
                                        </span>
                                      ))}
                                  </div>
                                </div>
                              </React.Fragment>

                              <div className="btn-edit-remove">
                                {c.set_stone == "0" ? (
                                  <div>
                                    <button
                                      className="btn btn-normal"
                                      onClick={() => {
                                        addStone(c, "");
                                      }}
                                    >
                                      Set Stone
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <div>
                                      <button
                                        className="btn btn-normal"
                                        onClick={() => {
                                          editStoneMultiple(c, "", index);
                                        }}
                                      >
                                        Edit Stone
                                      </button>
                                    </div>
                                    <div>
                                      <button
                                        className="btn btn-normal mt-1"
                                        onClick={() => {
                                          removeStoneMultiple(c, "", index);
                                        }}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      )}
                    </div>
                  ))
                )}

                <div className="product-single__addtocart">
                  {paramsItems === "PRODUCT" ||
                  (isItemDIY == true && typeViewDiy === true) ? (
                    <div className="qty-control position-relative">
                      <input
                        type="number"
                        name="quantity"
                        value={
                          isIncludeCard()
                            ? isIncludeCard().data?.[0]?.item_qty
                            : quantity
                        }
                        min="1"
                        onChange={(e) => {
                          const value = Math.max(1, Number(e.target.value));
                          setQty(
                            isIncludeCard()
                              ? Number(isIncludeCard().data?.[0]?.item_qty)
                              : value
                          );
                          setQuantityCartItem(specificationData.item_id, value);
                        }}
                        className="qty-control__number text-center"
                      />
                      <div
                        onClick={() => {
                          const newQuantity =
                            (isIncludeCard()?.data?.[0]?.item_qty || quantity) -
                            1;
                          setQuantityCartItem(
                            specificationData.item_id,
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
                            (Number(isIncludeCard()?.data?.[0]?.item_qty) || Number(quantity)) +
                            1;
                          setQuantityCartItem(
                            specificationData.item_id,
                            newQuantity
                          );
                        }}
                        className="qty-control__increase"
                      >
                        +
                      </div>

                      {/* <div
                  onClick={() =>
                    setQuantityCartItem(
                      specificationData.item_id,
                      isIncludeCard()?.data?.[0]?.item_qty - 1 || quantity - 1
                    )
                  }
                  className="qty-control__reduce"
                >
                  -
                </div>
                <div
                  onClick={() =>
                    setQuantityCartItem(
                      specificationData.item_id,
                      isIncludeCard()?.data?.[0]?.item_qty + 1 || quantity + 1
                    )
                  }
                  className="qty-control__increase"
                >
                  +
                </div> */}
                    </div>
                  ) : (
                    ""
                  )}
                  {/* <!-- .qty-control --> */}
                  <div className="d-flex gap-2">
                    {paramsItems === "DIY" && !isItemDIY ? (
                      isStone === false ? (
                        pathname.includes("/start-with-a-setting") &&
                        !pathname.includes("/start-with-a-diamond") ? (
                          isEmpty(specificationData.diy_bom_id) != "" && (
                            <button
                              type="submit"
                              className="btn btn-primary btn-addtocart js-open-aside"
                              data-toggle="modal"
                              data-target="#setStoneModal"
                              onClick={() => {
                                setStoneModal("");
                                dispatch(diamondPageChnages(false));
                                dispatch(storeSpecData(specificationData));
                                dispatch(storeProdData(specificationData));
                                setProductSKU(
                                  specificationData?.display_product_sku
                                );
                                setFinalTotal(specificationData?.final_total);
                                dispatch(
                                  jeweleryDIYName(
                                    specificationData?.variant_data[0]
                                      ?.product_name
                                  )
                                );
                                dispatch(
                                  jeweleryDIYimage(specificationData?.images[0])
                                );
                                dispatch(diamondNumber(""));
                                setStoneTypeData([]);
                                setStoneTypeDataActive({});
                                setDIYSizeDataList([]);
                                setShapeStoneActive({});
                                setSizeStoneActive({});
                                setDIYShapesDataList([]);
                                setClarityWithColor("");
                                setDIYClarityDataList([]);
                                window.scroll(0, 0);
                              }}
                            >
                              {complete ? "Select This Ring " : "SET STONES"}
                            </button>
                          )
                        ) : (
                          activeDIYtabss === "Jewellery" && (
                            <button
                              type="submit"
                              className="btn btn-primary btn-addtocart js-open-aside"
                              onClick={() => handleSetCompleteRing()}
                            >
                              {"SELECT THIS RING"}
                            </button>
                          )
                        )
                      ) : (
                        <>
                          <div className="">
                            {pathname.includes("/start-with-a-setting") ? (
                              <h2 className="fs-24px mb-6px sub-heading-title-01">
                                Total{" "}
                                {isEmpty(specificationData.currency_symbol)}{" "}
                                {numberWithCommas(
                                  (
                                    extractNumber(
                                      calculatePrice(
                                        specificationData,
                                        selectedOffer,
                                        saveEngraving,
                                        SaveEmbossing,
                                        embossingData,
                                        serviceData
                                      )
                                    ) +
                                    extractNumber(
                                      storeSelectedDiamondPrices !== ""
                                        ? storeSelectedDiamondPrices
                                        : 0
                                    )
                                  ).toFixed(2)
                                )}
                                {/* {numberWithCommas(
                              (
                                extractNumber(
                                  Object.keys(storeSpecDatas).length > 0
                                    ? saveEngraving
                                      ? engravingData.service_rate
                                        ? isEmpty(specificationData.currency_symbol) +
                                        " " +
                                        numberWithCommas(
                                          isEmpty(
                                            extractNumber(
                                              selectedOffer.length > 0 && isOffers
                                                ? selectedOffer?.[0]?.final_total_display
                                                : (storeSpecDatas.final_total_display ?? finalTotal)
                                            ) +
                                            extractNumber(
                                              engravingData.service_rate.toString()
                                            )
                                          ).toFixed(2)
                                        )
                                        : isEmpty(specificationData.currency_symbol) +
                                        " " +
                                        isEmpty(
                                          selectedOffer.length > 0 && isOffers
                                            ? selectedOffer[0].final_total_display
                                            : (storeSpecDatas.final_total_display ?? finalTotal)
                                        )
                                      : isEmpty(specificationData.currency_symbol) +
                                      " " +
                                      isEmpty(
                                        selectedOffer.length > 0 && isOffers
                                          ? selectedOffer[0].final_total_display
                                          : (storeSpecDatas.final_total_display ?? finalTotal)
                                      )
                                    : ""
                                ) +
                                extractNumber(
                                  storeSelectedDiamondPrices !== ""
                                    ? storeSelectedDiamondPrices
                                    : 0
                                )
                              ).toFixed(2)
                            )} */}
                                {/* {numberWithCommas(
                              (
                                extractNumber(
                                  storeSpecDatas.final_total_display ??
                                  finalTotal  ) +
                                  extractNumber(
                                    storeSelectedDiamondPrices !== ""
                                      ? storeSelectedDiamondPrices
                                      : 0
                                  )
                                ).toFixed(2)
                              )} */}
                              </h2>
                            ) : (
                              <h2 className="fs-24px mb-6px sub-heading-title-01">
                                Total{" "}
                                {isEmpty(specificationData.currency_symbol)}{" "}
                                {numberWithCommas(
                                  (
                                    extractNumber(
                                      calculatePrice(
                                        specificationData,
                                        selectedOffer,
                                        saveEngraving,
                                        SaveEmbossing,
                                        embossingData,
                                        serviceData
                                      )
                                    ) +
                                    extractNumber(
                                      addedDiamondDatas.final_total_display
                                    )
                                  ).toFixed(2)
                                )}
                                {/* Final Total {isEmpty(specificationData.currency_symbol)}{" "}
                            {numberWithCommas(
                              (
                                extractNumber(
                                  Object.keys(productData).length > 0
                                    ? saveEngraving
                                      ? engravingData.service_rate
                                        ? isEmpty(specificationData.currency_symbol) +
                                        " " +
                                        numberWithCommas(
                                          isEmpty(
                                            extractNumber(
                                              selectedOffer.length > 0 && isOffers
                                                ? selectedOffer?.[0]?.final_total_display
                                                : (storeSpecDatas.final_total_display ??
                                                  specificationData.final_total_display)
                                            ) +
                                            extractNumber(
                                              engravingData.service_rate.toString()
                                            )
                                          ).toFixed(2)
                                        )
                                        : isEmpty(specificationData.currency_symbol) +
                                        " " +
                                        isEmpty(
                                          selectedOffer.length > 0 && isOffers
                                            ? selectedOffer[0].final_total_display
                                            : (storeSpecDatas.final_total_display ??
                                              specificationData.final_total_display)
                                        )
                                      : isEmpty(specificationData.currency_symbol) +
                                      " " +
                                      isEmpty(
                                        selectedOffer.length > 0 && isOffers
                                          ? selectedOffer[0].final_total_display
                                          : (storeSpecDatas.final_total_display ??
                                            specificationData.final_total_display)
                                      )
                                    : ""
                                ) +
                                extractNumber(
                                  addedDiamondDatas.final_total_display
                                )
                              ).toFixed(2)
                            )} */}
                              </h2>
                            )}
                            {(isStoneSelected === false &&
                              isStone === true &&
                              viewType == "review" &&
                              pathname.includes("/start-with-a-setting")) ||
                            ((isDiamondSelected === false ||
                              isRingSelecteds === true) &&
                              IsSelectedDiamonds === true) ? (
                              <>
                                <div className="">
                                  <button
                                    className="btn btn-primary btn-addtocart js-open-aside"
                                    onClick={
                                      pathname.includes("/start-with-a-diamond")
                                        ? () => addToCart()
                                        : () => addToCartDIY()
                                    }
                                  >
                                    {isIncludeCard()
                                      ? "Already Added"
                                      : "Add to Cart"}
                                  </button>
                                </div>
                                {deliveryDate ? (
                                  <div className="preview-text mt-3">
                                    <svg
                                      width="20"
                                      height="20"
                                      aria-hidden="true"
                                    >
                                      <use xlinkHref="#icon_delivery_date" />
                                    </svg>
                                    <span className="ps-1">
                                      Expected Delivery Date :{" "}
                                      <span className="fw-medium">
                                        {deliveryDate}
                                      </span>
                                    </span>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </>
                            ) : (
                              ""
                            )}
                          </div>
                        </>
                      )
                    ) : isItemDIY ? (
                      <button
                        type="submit"
                        className="btn btn-primary btn-addtocart js-open-aside"
                        onClick={() => handleSetItemsDIY()}
                      >
                        {"Set Items"}
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-primary btn-addtocart js-open-aside"
                        onClick={() => addToCart()}
                      >
                        {isIncludeCard() ? "Already Added" : "Add to Cart"}
                      </button>
                    )}
                    {/* <button
                  type="submit"
                  className="btn btn-primary btn-addtocart js-open-aside"
                  onClick={() => addToCart()}
                >
                  {isIncludeCard() ? "Already Added" : "Add to Cart"}
                </button>
                {isEmpty(specificationData.diy_bom_id) != "" ? (
                  <button
                    type="submit"
                    className="btn btn-primary"
                  // onClick={() => setstone()}
                  >
                    {"SET STONES"}
                  </button>
                ) : (
                  ""
                )} */}
                  </div>
                </div>
              </form>
              {/* {perfumeVertical(specificationData?.variant_data?.[0]?.vertical_short_code) ? keyTabView === "Specification" && (
              <>
                <div className="accordion" id="specification">
                  <div className="accordion-item mb-4">
                    <h5 className="accordion-header border-bottom py-2" id="specificationHeading">
                      <button
                        className="accordion-button p-0 border-0 fs-5 text-uppercase"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#specificationInfo`}
                        aria-expanded="true"
                        aria-controls="specificationInfo"
                      >
                        Specification
                        <svg className="accordion-button__icon" viewBox="0 0 14 14">
                          <g aria-hidden="true" stroke="none" fillRule="evenodd">
                            <path
                              className="svg-path-vertical"
                              d="M14,6 L14,8 L0,8 L0,6 L14,6"
                            />
                            <path
                              className="svg-path-horizontal"
                              d="M14,6 L14,8 L0,8 L0,6 L14,6"
                            />
                          </g>
                        </svg>
                      </button>
                    </h5>
                    <div id={`specificationInfo`} className="accordion-collapse collapse show border-0" aria-labelledby="specificationHeading" data-bs-parent="#specification">
                      <div className="row d-flex justify-content-between">
                        {tabDataone === true && columnsForSpecification.length > 0 ? (
                          <div className="col-md-12 specification-addtional">
                            <div className="information-title">Information</div>
                            {columnsForSpecification.map((col, i) => {
                              return (
                                <div className="specification-details-list" key={i}> 
                                  <label className="specification-title text-nowrap">{col.title}</label>
                                  <span className="specification-text"> {col.value}</span>
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                        {tabDataone === true && diamondSummary.length > 0 ? (
                          <div className="col-12 specification-addtional">
                            {isEmpty(diamondSummaryname) !== "" && (
                              <div className="information-title">{diamondSummaryname}</div>
                            )}
                            {diamondSummary[0].map((col, j) => {
                              return (
                                <div className="specification-details-list" key={j}> 
                                  <label className="specification-title text-nowrap">{col.title}</label>
                                  <span className="specification-text"> {col.value}</span>
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                        {tabDataone === true && secondDiamondSummary.length > 0 ? (
                          secondDiamondSummary.map((col, i) => (
                            <div className="col-12 specification-addtional" key={`secondSummary-${i}`}>
                              <div className="information-title">
                                {secondDiamondSummaryname[i]}
                              </div>
                              {col.map((col1, index) => (
                                <div className="specification-details-list" key={col1.id || `${i}-${index}`}>
                                  <label className="specification-title text-nowrap">{col1.title} </label>
                                  <span className="specification-text"> {col1.value}</span>
                                </div>
                              ))}
                            </div>
                          ))
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null} */}
              <div className="product-single__addtolinks">
                <a
                  href="#"
                  className={`menu-link menu-link_us-s add-to-wishlist ${
                    isAddedtoWishlist(specificationData?.item_id)
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    const e = specificationData;
                    const data = {
                      vertical_code: e.variant_data[0]?.vertical_short_code,
                      item_group: e.variant_data[0]?.item_group,
                      qty: 1,
                      price_type: e.variant_data[0]?.bom_type,
                      item_id: e.item_id,
                      variant_unique_id: storeVariantId,
                      product_diy: paramsItem === "DIY" ? "DIY" : "PRODUCT",
                      jewellery_product_type_name: isEmpty(
                        e?.variant_data[0]?.mi_jewellery_product_type_name
                      ),
                      product_name: isEmpty(e?.variant_data[0]?.product_name),
                      unique_id: e.mi_unique_id,
                      coupon_code:
                        selectedOffer?.length > 0
                          ? selectedOffer?.[0]?.coupon_code
                          : "",
                    };
                    toggleWishlist(data);
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    aria-hidden="true"
                    className="wishlist-icon"
                    fill="currentColor"
                  >
                    <use
                      xlinkHref={`${
                        isAddedtoWishlist(specificationData?.item_id)
                          ? "#icon_heart_fill"
                          : "#icon_heart"
                      }`}
                    />
                  </svg>
                  <span>
                    {isAddedtoWishlist(specificationData?.item_id)
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"}
                  </span>
                </a>
                <ShareComponent title={props.product?.title} />
              </div>

              {isEmpty(specificationData?.item_description) !== "" && (
                <>
                  <Accordion className="faq-accordion accordion mb-3">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        Description
                        <svg
                          className="accordion-button__icon"
                          viewBox="0 0 14 14"
                        >
                          <g
                            aria-hidden="true"
                            stroke="none"
                            fillRule="evenodd"
                          >
                            <path
                              className="svg-path-vertical"
                              d="M14,6 L14,8 L0,8 L0,6 L14,6"
                            ></path>
                            <path
                              className="svg-path-horizontal"
                              d="M14,6 L14,8 L0,8 L0,6 L14,6"
                            ></path>
                          </g>
                        </svg>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div
                          className="product-single__short-desc mb-3"
                          dangerouslySetInnerHTML={{
                            __html: specificationData.item_description,
                          }}
                        ></div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </>
              )}

              {isEmpty(paramsItem) !== "" &&
                isEmpty(productBreakupData?.totalPrice) !== 0 && (
                  <Accordion className="faq-accordion accordion mb-5">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        {" "}
                        Price Breakup
                        <svg
                          className="accordion-button__icon"
                          viewBox="0 0 14 14"
                        >
                          <g
                            aria-hidden="true"
                            stroke="none"
                            fillRule="evenodd"
                          >
                            <path
                              className="svg-path-vertical"
                              d="M14,6 L14,8 L0,8 L0,6 L14,6"
                            ></path>
                            <path
                              className="svg-path-horizontal"
                              d="M14,6 L14,8 L0,8 L0,6 L14,6"
                            ></path>
                          </g>
                        </svg>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="mb-3 product-services">
                          <div className="d-flex flex-column gap-2 fs-15px">
                            {productBreakupData &&
                              isEmpty(productBreakupData?.basePrice) !== 0 && (
                                <div className="d-flex justify-content-between">
                                  <label>Product Price</label>
                                  <span>
                                    {storeCurrencys}{" "}
                                    {numberWithCommas(
                                      extractNumber(
                                        productBreakupData?.basePrice?.toString()
                                      )?.toFixed(2)
                                    )}
                                  </span>
                                </div>
                              )}
                            {productBreakupData &&
                              isEmpty(productBreakupData?.discountPrice) !==
                                0 && (
                                <div className="d-flex justify-content-between">
                                  <label>
                                    Discount{" "}
                                    {`(${numberWithCommas(
                                      extractNumber(
                                        productBreakupData?.discountPer?.toString()
                                      )?.toFixed(2)
                                    )}%)`}
                                  </label>
                                  <span>
                                    -{storeCurrencys}{" "}
                                    {`${numberWithCommas(
                                      extractNumber(
                                        productBreakupData?.discountPrice?.toString()
                                      )?.toFixed(2)
                                    )}`}
                                  </span>
                                </div>
                              )}
                            {/* {productBreakupData &&
                              isEmpty(productBreakupData?.unitPrice) !== 0 && (
                                <div className="d-flex justify-content-between">
                                  <label>Unit Price</label>
                                  <span>
                                    {storeCurrencys}{" "}
                                    {numberWithCommas(
                                      extractNumber(
                                        productBreakupData?.unitPrice?.toString()
                                      )?.toFixed(2)
                                    )}
                                  </span>
                                </div>
                              )} */}
                            {productBreakupData &&
                              productBreakupData?.servicePrice
                                ?.filter((item) => item?.is_selected === "1")
                                ?.map((elm, g) => {
                                  return (
                                    <div
                                      className="d-flex justify-content-between"
                                      key={g}
                                    >
                                      <label>{elm?.service_name}</label>
                                      <span>
                                        {storeCurrencys}{" "}
                                        {numberWithCommas(
                                          extractNumber(
                                            elm?.price?.toString()
                                          )?.toFixed(2)
                                        )}
                                      </span>
                                    </div>
                                  );
                                })}
                            {productBreakupData &&
                              isEmpty(productBreakupData?.subTotal) !== 0 && (
                                <div className="d-flex justify-content-between">
                                  <label>Sub Total</label>
                                  <span>
                                    {storeCurrencys}{" "}
                                    {numberWithCommas(
                                      extractNumber(
                                        productBreakupData?.subTotal?.toString()
                                      )?.toFixed(2)
                                    )}
                                  </span>
                                </div>
                              )}
                            {productBreakupData &&
                              isEmpty(productBreakupData?.qty) !== 0 && (
                                <div className="d-flex justify-content-between">
                                  <label>Quantity</label>
                                  <span>
                                    {numberWithCommas(
                                      extractNumber(
                                        productBreakupData?.qty?.toString()
                                      )?.toFixed(2)
                                    )}
                                  </span>
                                </div>
                              )}

                            {productBreakupData &&
                              isEmpty(productBreakupData?.taxPrice) !== 0 && (
                                <div className="d-flex justify-content-between">
                                  <label>{`${
                                    specificationData?.tax1_name
                                  } (${extractNumber(
                                    specificationData?.tax1
                                  ).toFixed(2)})`}</label>
                                  <span>
                                    {storeCurrencys}{" "}
                                    {numberWithCommas(
                                      extractNumber(
                                        productBreakupData?.taxPrice?.toString()
                                      )?.toFixed(2)
                                    )}
                                  </span>
                                </div>
                              )}
                            {productBreakupData &&
                              isEmpty(productBreakupData?.customDutyTax) !==
                                0 && (
                                <div className="d-flex justify-content-between">
                                  <label>{`${
                                    specificationData?.custom_duty_name
                                  } (${extractNumber(
                                    specificationData?.custom_per
                                  ).toFixed(2)})`}</label>
                                  <span>
                                    {storeCurrencys}{" "}
                                    {numberWithCommas(
                                      extractNumber(
                                        productBreakupData?.customDutyTax?.toString()
                                      )?.toFixed(2)
                                    )}
                                  </span>
                                </div>
                              )}
                            {productBreakupData &&
                              isEmpty(productBreakupData?.diamondPriceDIY) !==
                                0 && (
                                <div className="d-flex justify-content-between">
                                  <label>Diamond Price</label>
                                  <span>
                                    {numberWithCommas(
                                      extractNumber(
                                        productBreakupData?.diamondPriceDIY?.toString()
                                      )?.toFixed(2)
                                    )}
                                  </span>
                                </div>
                              )}
                            {productBreakupData &&
                              isEmpty(productBreakupData?.totalPrice) !== 0 && (
                                <div className="fw-semi-bold d-flex justify-content-between">
                                  <label>Grand Total</label>
                                  <span>
                                    {storeCurrencys}{" "}
                                    {numberWithCommas(
                                      extractNumber(
                                        productBreakupData?.totalPrice?.toString()
                                      )?.toFixed(2)
                                    )}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                )}
            </div>
          </div>
        )}
        <div className="product-single__details-list">
          {selectedTab.map((tab, index) => {
            if (tab.title === "Can Be Set With") {
              canBeSetWithData();
            }
            if (
              perfumeVertical(
                specificationData?.variant_data?.[0]?.vertical_short_code
              ) == true &&
              tab.title === "Can Be Set With" &&
              canBeSetWithDataList?.length === 0
            ) {
              return;
            }
            return (
              <React.Fragment key={index}>
                <h2
                  className={`${
                    index > 0 ? "mt-3" : "mb-3"
                  } product-single__details-list__title`}
                >
                  {tab.title}
                </h2>
                <div className="product-single__details-list__content mb-5">
                  <AdditionalInfo
                    selectedTab={selectedTab}
                    storeVariantDataList={storeVariantDataList}
                    secondDiamondSummary={secondDiamondSummary}
                    keyTabView={tab.title}
                    columnsForSpecification={columnsForSpecification}
                    tabDataone={tabDataone}
                    diamondSummary={diamondSummary}
                    secondDiamondSummaryname={secondDiamondSummaryname}
                    diamondSummaryname={diamondSummaryname}
                    bomDataList={bomDataList}
                    labourDataList={labourDataList}
                    canBeSetWithDataList={canBeSetWithDataList}
                    columName={columName}
                    storyDataList={storyDataList}
                  />
                </div>
              </React.Fragment>
            );
          })}
          {(storyDataList || []).length !== 0 && (
            <div className="product-story mt-3">
              <div className="story-css">
                {(storyDataList || [])?.map((s, idx) => (
                  <div className="pb-3" key={s.id || `${s.id}-${idx}`}>
                    <h3 className="text-center mb-3">{s.title}</h3>
                    {isEmpty(s.sub_title) !== "" && (
                      <h5 className="text-center mb-3">{s.sub_title}</h5>
                    )}
                    {Array.isArray(s?.images) &&
                      s?.images?.length > 0 &&
                      s?.images?.map((m, idx) => (
                        <div
                          className="mb-3 text-center"
                          key={m.id || `${s.id}-img-${idx}`}
                        >
                          {isEmpty(s.video_extension) === "" && (
                            <Image
                              src={m.image}
                              className="img-fluid mb-2 wh-auto"
                              width={970}
                              height={600}
                              alt="image"
                            />
                          )}
                        </div>
                      ))}
                    {isEmpty(s.video_extension) !== "" && (
                      <video
                        autoPlay
                        loop
                        preload="true"
                        src={s.video_url}
                        className="img-fluid mb-3 text-center"
                      >
                        <source id="mp4" />
                      </video>
                    )}
                    {isEmpty(s.description) !== "" && (
                      <div
                        dangerouslySetInnerHTML={{ __html: s.description }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {loading === false && paramsItems !== "DIY" && (
            <RelatedSlider
              isCallRef={isCallRef}
              isEndReached={isEndReached}
              swiperInstance={swiperInstance}
              totalPagesRelated={totalPagesRelated}
              hasMoreRelated={hasMoreRelated}
              setSwiperInstance={setSwiperInstance}
              setIsEndReached={setIsEndReached}
              count={count}
              paginationLeftRight={paginationLeftRight}
              relatedProductData={relatedProductData}
            />
          )}
          {reviewCustomerData.length > 0 && (
            <>
              <h2 className="product-single__details-list__title mb-3">
                Reviews
              </h2>
              <div className="product-single__details-list__content">
                <div className="customer-review">
                  <div className="">
                    <React.Fragment>
                      <div className="customer-review-info">
                        <div className="review-head-part">
                          <div className="review-head-row">
                            <div className="review-total">
                              <div className="review-head-title">
                                Total Reviews
                              </div>
                              <div className="review-mark">
                                <div className="total-mark">{globalRating}</div>
                              </div>
                            </div>
                            <div className="review-average-rating">
                              <div className="review-head-title">
                                Average Rating
                              </div>
                              <div className="review-detail">
                                <div className="review-mark">
                                  {globalRatingStar}
                                </div>
                                <div className="review-star">
                                  <Rating
                                    initialValue={globalRatingStar}
                                    readonly
                                    size={26}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="review-globle-rating">
                              <div className="global-ratings-dec">
                                {reviewSummary.length > 0 &&
                                  reviewSummary.map((data, i) => {
                                    return (
                                      <React.Fragment key={i}>
                                        <div className="global-ratings-inner">
                                          <div className="global-ratings-left ">
                                            <div className="star">
                                              {data.rating} star
                                            </div>
                                          </div>
                                          <div className="global-ratings-middle">
                                            <div
                                              onClick={() => {}}
                                              className={`progress ${
                                                data.percenatge === 0
                                                  ? ""
                                                  : "cursor-pointer"
                                              }}`}
                                            >
                                              <div
                                                className={`progress-bar progress-bar-striped ${
                                                  data.percenatge === 0
                                                    ? ""
                                                    : "bg-warnings"
                                                }`}
                                                style={{
                                                  width: data.percenatge + "%",
                                                }}
                                              ></div>
                                            </div>
                                          </div>
                                          <div className="global-ratings-right">
                                            <div className="fw-400 small-title">
                                              {data.percenatge}%
                                            </div>
                                          </div>
                                        </div>
                                      </React.Fragment>
                                    );
                                  })}
                              </div>
                            </div>
                          </div>
                        </div>
                        {reviewCustomerData?.length > 0 &&
                          reviewCustomerData.map((customReview, id) => {
                            let dates = new Date(customReview.created_date);
                            var Dated = dates.getDate();
                            var Month = dates.getMonth() + 1;
                            var Year = dates.getFullYear();
                            return (
                              <div className="review-data" key={id}>
                                <div className="review-datails">
                                  <div className="review-profile">
                                    <div className="profile-img">
                                      <Image
                                        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                        className="img-fluid"
                                        width={100}
                                        height={100}
                                        alt="Blank Profile Picture"
                                      />
                                    </div>
                                    <div className="w-100">
                                      <div className="profile-detail">
                                        <div className="profile-rating">
                                          <div>
                                            <div className="profile-heading">
                                              {customReview.user_name}
                                            </div>
                                            <p className="rating-date">
                                              Posted on {Dated}/{Month}/{Year}
                                            </p>
                                          </div>
                                          <div className="rating">
                                            <div className="rating-star">
                                              {[
                                                ...Array(customReview.rating),
                                              ].map((star, i) => {
                                                return (
                                                  <i
                                                    className="ic_star_fill me-2"
                                                    key={i}
                                                  ></i>
                                                );
                                              })}
                                              {[
                                                ...Array(
                                                  5 - customReview.rating
                                                ),
                                              ].map((star, i) => {
                                                return (
                                                  <i
                                                    className="ic_star me-2"
                                                    key={i}
                                                  ></i>
                                                );
                                              })}
                                            </div>
                                            <div className="profile-text">
                                              {customReview.rating == "5" && (
                                                <span>Perfect</span>
                                              )}
                                              {customReview.rating == "4" && (
                                                <span>Great</span>
                                              )}
                                              {customReview.rating == "3" && (
                                                <span>Average</span>
                                              )}
                                              {customReview.rating == "2" && (
                                                <span>Bad</span>
                                              )}
                                              {customReview.rating == "1" && (
                                                <span>Terrible</span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="review-ratings">
                                        <div className="review-dec">
                                          <div className="review-heading">
                                            {customReview.headline}
                                          </div>
                                          <div
                                            className={`review-text ${
                                              isExpanded ? "active" : ""
                                            }`}
                                            dangerouslySetInnerHTML={{
                                              __html:
                                                customReview.review_details,
                                            }}
                                          ></div>
                                          {customReview.review_details.length >
                                            450 && (
                                            <span
                                              className="show_more"
                                              onClick={toggleExpand}
                                            >
                                              {isExpanded
                                                ? "Show less"
                                                : "Show more"}
                                            </span>
                                          )}
                                        </div>

                                        <div className="product-slider">
                                          <div className="customer_review_info">
                                            <div className="image-show">
                                              {customReview.image_set.length >
                                                0 &&
                                                customReview.image_set
                                                  .slice(0, 3)
                                                  .map((imgUrl, id2) => {
                                                    return (
                                                      <div
                                                        className="images-upload cursor-pointer"
                                                        key={id2}
                                                      >
                                                        <Image
                                                          src={imgUrl}
                                                          className="img-fluid"
                                                          width={200}
                                                          height={200}
                                                          alt="Review Image"
                                                        />
                                                      </div>
                                                    );
                                                  })}
                                              {customReview.video !== "" ? (
                                                <div className="images-upload">
                                                  <video
                                                    width={100}
                                                    height={100}
                                                    controls
                                                  >
                                                    <source
                                                      src={customReview.video}
                                                      type="video/mp4"
                                                    />
                                                    Your browser does not
                                                    support the video tag.
                                                  </video>
                                                </div>
                                              ) : (
                                                ""
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </React.Fragment>
                    {reviewCustomerData?.length > 3 ? (
                      <>
                        <div className="text-center">
                          <a
                            className="btn-link btn-link_lg text-uppercase fw-medium"
                            onClick={() => handleShowMore()}
                          >
                            Show More
                          </a>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        {showStoneModal && (
          <div
            className="modal fade"
            id="setStoneModal"
            tabIndex="-1"
            aria-hidden="true"
            data-bs-backdrop="static"
            centered
          >
            <div className="modal-dialog setStoneModal">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Set Stone</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => {
                      setShowStoneModal(false);
                      setIsStone(false);
                      setModalTrue(false);
                      setDIYSizeDataList([]);
                      setShapeStoneActive({});
                      setSizeStoneActive({});
                      setDIYShapesDataList([]);
                      setClarityWithColor("");
                      setDIYClarityDataList([]);
                      setStoneTypeData([]);
                      setStoneTypeDataActive({});
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <h4 className="mb-2">Continue To The Next Step</h4>
                    <p>Please choose one of the options below</p>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    {stoneTypeArr &&
                      stoneTypeArr?.length > 0 &&
                      stoneTypeArr?.map((elm, i) => {
                        return (
                          <button
                            key={i}
                            className={`btn btn-primary fw-500  ${
                              elm.display_name === stoneActive.display_name
                                ? "active"
                                : ""
                            }`}
                            onClick={() => {
                              setStoneTypeData([]);
                              if (elm.vertical_code === "GEDIA") {
                                setGemStoneStoneType(elm);
                              } else {
                                selectDiamond(elm);
                              }
                              setStoneActive(elm);
                              setStoneTypeDataActive({});
                              setDIYSizeDataList([]);
                              setShapeStoneActive({});
                              setSizeStoneActive({});
                              setDIYShapesDataList([]);
                              setClarityWithColor("");
                              setDIYClarityDataList([]);
                              if (
                                stoneTypeData?.length > 0 ||
                                DIYShapesDataList?.length > 0 ||
                                DIYClarityDataList?.length > 0 ||
                                DIYSizeDataList?.length > 0
                              ) {
                                setShowStoneModal(true);
                              } else {
                                setShowStoneModal(false);
                              }
                              setModalTrue(true);
                            }}
                            data-bs-dismiss={
                              showStoneModal &&
                              (stoneTypeData?.length > 0 ||
                                DIYShapesDataList?.length > 0 ||
                                DIYClarityDataList?.length > 0 ||
                                DIYSizeDataList?.length > 0)
                                ? ""
                                : "modal"
                            }
                            aria-label="Close"
                            disabled={
                              showStoneModal &&
                              (DIYShapesDataList?.length > 0 ||
                                DIYClarityDataList?.length > 0 ||
                                DIYSizeDataList?.length > 0)
                                ? modalTrue
                                : ""
                            }
                          >
                            {elm.display_name}
                          </button>
                        );
                      })}
                  </div>

                  {stoneTypeData?.length > 0 && (
                    <div className="mb-20px mt-3">
                      <div className="row">
                        <div className="col-12">
                          <h4 className="fs-20px shape-field-title">
                            Stone Type
                          </h4>
                          <div className="d-flex flex-wrap diy_popup">
                            {stoneTypeData?.map((elm, i) => {
                              const isSelected =
                                stoneTypeDataActive?.stone_type_name ===
                                elm.stone_type_name
                                  ? "active"
                                  : "";
                              return (
                                <>
                                  <div
                                    className={`stone-area me-2 color-black ${
                                      isSelected ? "active" : ""
                                    }`}
                                    data-bs-dismiss={
                                      showStoneModal &&
                                      (DIYShapesDataList?.length > 0 ||
                                        DIYClarityDataList?.length > 0 ||
                                        DIYSizeDataList?.length > 0)
                                        ? ""
                                        : "modal"
                                    }
                                    aria-label="Close"
                                    onClick={() => {
                                      setDIYSizeDataList([]);
                                      // setShapeStoneActive({});
                                      setSizeStoneActive({});
                                      setDIYShapesDataList([]);
                                      setClarityWithColor("");
                                      setDIYClarityDataList([]);
                                      selectDiamond(stoneActive, elm);
                                      setStoneTypeDataActive(elm);
                                      if (
                                        DIYShapesDataList?.length > 0 ||
                                        DIYClarityDataList?.length > 0 ||
                                        DIYSizeDataList?.length > 0
                                      ) {
                                        setShowStoneModal(true);
                                        setModalTrue(true);
                                      } else {
                                        setShowStoneModal(false);
                                        setModalTrue(true);
                                      }
                                    }}
                                    disabled={
                                      showStoneModal &&
                                      (DIYShapesDataList?.length > 0 ||
                                        DIYSizeDataList?.length > 0 ||
                                        DIYClarityDataList?.length > 0)
                                        ? modalTrue
                                        : ""
                                    }
                                    key={i}
                                  >
                                    <div className="trans-effect">
                                      <div className="stone-name text-center fs-12px">
                                        {elm.stone_type_name}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {DIYShapesDataList?.length > 0 && (
                    <div className="mb-20px mt-3">
                      <div className="row">
                        <div className="col-12">
                          <h4 className="fs-20px shape-field-title">Shape</h4>
                          <div className="d-flex flex-wrap diy_popup">
                            {DIYShapesDataList?.map((elm, i) => {
                              return (
                                <>
                                  <div
                                    className={`stone-area me-2 color-black ${
                                      shapeStoneActive.shape_name ===
                                      elm.shape_name
                                        ? "active"
                                        : ""
                                    }`}
                                    data-bs-dismiss={
                                      showStoneModal &&
                                      (DIYClarityDataList?.length > 0 ||
                                        DIYSizeDataList?.length > 0)
                                        ? ""
                                        : "modal"
                                    }
                                    aria-label="Close"
                                    onClick={() => {
                                      setShapeStoneActive(elm);
                                      setDIYSizeDataList([]);
                                      DIYSizeData(elm);
                                      if (
                                        DIYClarityDataList?.length > 0 ||
                                        DIYSizeDataList?.length > 0
                                      ) {
                                        setShowStoneModal(true);
                                        setModalTrue(true);
                                      } else {
                                        setShowStoneModal(false);
                                        setModalTrue(true);
                                      }
                                      // setModalTrue(true);
                                    }}
                                    disabled={
                                      showStoneModal &&
                                      (DIYSizeDataList?.length > 0 ||
                                        DIYClarityDataList?.length > 0)
                                        ? modalTrue
                                        : ""
                                    }
                                    key={i}
                                  >
                                    <div className="trans-effect">
                                      <div className="d-flex justify-content-center shape-icon pb-1">
                                        <i
                                          className={`${elm.image} fs-30px`}
                                        ></i>
                                      </div>
                                      <div className="stone-name text-center fs-12px">
                                        {elm.shape_name}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {DIYSizeDataList.length > 0 && (
                    <div className="mb-20px mt-3">
                      <div className="row">
                        <div className="col-12">
                          <div>
                            <h4 className="fs-20px shape-heading shape-field-title mb3">
                              Size
                            </h4>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="StoneSize">
                            {DIYSizeDataList.map((elm, i) => {
                              return (
                                <>
                                  <button
                                    className={`btn btn-set-stone ${
                                      sizeStoneActive.size === elm.size
                                        ? "active"
                                        : ""
                                    }`}
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => {
                                      setSizeStoneActive(elm);
                                      setDIYClarityDataList([]);
                                      clarityColorData(shapeStoneActive, elm);
                                      if (DIYClarityDataList?.length > 0) {
                                        setShowStoneModal(true);
                                        setModalTrue(true);
                                      } else {
                                        setShowStoneModal(false);
                                        setModalTrue(false);
                                      }
                                    }}
                                    key={i}
                                  >
                                    {elm.size}
                                  </button>
                                </>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {DIYClarityDataList.length > 0 && (
                    <div className="mb-20px mt-3">
                      <h4 className="fs-20px shape-heading shape-field-title mb3">
                        Clarity
                      </h4>

                      <div className="StoneSize">
                        {DIYClarityDataList.map((elm, i) => {
                          return (
                            <>
                              <div key={i}>
                                <div className="stone-area me-2 color-black">
                                  <div className="stone-name">
                                    {elm.clarity}
                                  </div>
                                </div>
                                {elm.details.length > 0 && (
                                  <>
                                    <h4 className="fs-20px shape-heading shape-field-title mt-3">
                                      Color
                                    </h4>
                                    {elm.details.map((a, index) => {
                                      return (
                                        <button
                                          key={index}
                                          className={`btn btn-set-stone ${
                                            clarityWithColor ===
                                            a.color + elm.clarity
                                              ? "active"
                                              : ""
                                          }`}
                                          data-bs-dismiss="modal"
                                          aria-label="Close"
                                          onClick={() => {
                                            setShowStoneModal(false);
                                            setClarityWithColor(
                                              a.color + elm.clarity
                                            );
                                            applyClarityFilter(a, elm);
                                            setShowStoneModal(false);
                                            setModalTrue(false);
                                          }}
                                        >
                                          {a.color}
                                        </button>
                                      );
                                    })}
                                  </>
                                )}
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {embossingModalView && (
          <div
            className="modal fade EmbossingModal"
            id="setEmbossing"
            tabIndex="-1"
            aria-hidden="true"
            data-bs-backdrop="static"
          >
            <div className="modal-dialog size-guide">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Set Embossing Position{" "}
                    {`(${activeImg[0]?.currency} ${numberWithCommas(
                      Number(activeImg[0]?.price).toFixed(2)
                    )})`}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => {
                      handleSetStateChange(false);
                      setSelectedIndex(0);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="container-fluid px-0">
                    <div className="row">
                      <div className="col-md-6 col-12">
                        <div className="dragarea mt-1">
                          <div className="text-center">
                            <a onClick={() => imgContainer.current.click()}>
                              {"Click To Browse"}
                              <br />
                              <span className="text-grey font-15px">
                                ({"Single Image"})
                              </span>
                              <input
                                type="file"
                                ref={imgContainer}
                                style={{ display: "none" }}
                                onChange={(event) => changeEmboFile(event)}
                                accept=".png, .jpg, .jpeg, .webp, .PNG, .JPG, .JPEG, .WEBP"
                              />
                            </a>
                          </div>
                        </div>
                        {activeImg?.[selectedIndex]?.embImage &&
                          activeImg?.[selectedIndex]?.area && (
                            <div>
                              <div className="text-main mt-3">
                                <h6>Alignment</h6>
                              </div>
                              <div className="d-flex flex-wrap gap-2">
                                <button
                                  className="btn btn-dark"
                                  onClick={() => centerImage("horizontal")}
                                  data-tooltip-id="tooltip-top"
                                  data-tooltip-content="Horizontal Center"
                                >
                                  <svg
                                    width="30"
                                    height="30"
                                    aria-hidden="true"
                                  >
                                    <use xlinkHref="#horizontal_center"></use>
                                  </svg>
                                </button>

                                <button
                                  className="btn btn-dark"
                                  onClick={() => centerImage("vertical")}
                                  data-tooltip-id="tooltip-top"
                                  data-tooltip-content="Vertical Center"
                                >
                                  <svg
                                    width="30"
                                    height="30"
                                    aria-hidden="true"
                                  >
                                    <use xlinkHref="#vertical_center"></use>
                                  </svg>
                                  {/* <span>Vertical center</span> */}
                                </button>

                                <button
                                  className="btn btn-dark"
                                  onClick={centerBoth}
                                  data-tooltip-id="tooltip-top"
                                  data-tooltip-content="Both Center"
                                >
                                  <svg
                                    width="30"
                                    height="30"
                                    aria-hidden="true"
                                  >
                                    <use xlinkHref="#both_center"></use>
                                  </svg>
                                  {/* Both Center */}
                                </button>
                                <Tooltip
                                  id="tooltip-top"
                                  place="top"
                                  effect="solid"
                                />
                              </div>
                            </div>
                          )}
                      </div>
                      <div className="col-md-6 col-12">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                          {activeImg?.map((data, i) => (
                            <li
                              className="nav-item"
                              role="presentation"
                              key={i}
                            >
                              <a
                                className={`nav-link nav-link_underscore ${
                                  i === selectedIndex ? "active" : ""
                                }`}
                                id={`tab-${i}`}
                                data-bs-toggle="tab"
                                href={`#tab-content-${i}`}
                                role="tab"
                                aria-controls={`tab-content-${i}`}
                                aria-selected={i === selectedIndex}
                                onClick={() => changeImage(data, i)} // Change active tab
                              >
                                {data.type}
                              </a>
                            </li>
                          ))}
                        </ul>

                        <div className="tab-content" id="myTabContent">
                          {activeImg.map((data, i) => {
                            let areas = data?.area;
                            // if (typeof areas === 'string') {
                            //   try {
                            //     areas = JSON.parse(areas);
                            //   } catch (e) {
                            //   }
                            // }

                            return (
                              <div
                                key={i}
                                className={`tab-pane fade ${
                                  i === selectedIndex ? "show active" : ""
                                }`}
                                id={`tab-content-${i}`}
                                role="tabpanel"
                                aria-labelledby={`tab-${i}`}
                              >
                                <div className="main-img">
                                  <div className="singleProduct-view">
                                    <Image
                                      src={data?.url}
                                      className="img-fluid img-width d-block m-auto"
                                      alt={`Image ${i}`}
                                      width={442}
                                      height={442}
                                    />

                                    {areas?.width && areas?.height && (
                                      <div
                                        className="embossing-img"
                                        id={`embossing-img-${i}`}
                                        style={{
                                          left: `${areas.left}%`,
                                          top: `${areas.top}%`,
                                          width: `${areas.width}%`,
                                          height: `${areas.height}%`,
                                        }}
                                      >
                                        {data?.embImage && (
                                          <div
                                            className="resizable-img"
                                            id={`resizable-img-${i}`}
                                            style={{
                                              left: `${data.embImageArea.left}%`,
                                              top: `${data.embImageArea.top}%`,
                                              width: `${data.embImageArea.width}%`,
                                              height: `${data.embImageArea.height}%`,
                                            }}
                                            onMouseDown={(event) =>
                                              imgStartDrag(event, data, i)
                                            } // Implement your drag logic here
                                            onTouchStart={(event) =>
                                              imgStartDrag(event, data, i)
                                            }
                                          >
                                            <Image
                                              src={data.embImage}
                                              className="img-fluid img-width d-block m-auto"
                                              alt={`Embossed Image ${i}`}
                                              ref={imgContainers}
                                              width={100}
                                              height={100}
                                            />
                                            <div
                                              className="resize-btn"
                                              onMouseDown={(event) =>
                                                imgResizeStart(event, data, i)
                                              }
                                              onTouchStart={(event) =>
                                                imgResizeStart(event, data, i)
                                              }
                                            >
                                              ↘
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-dark"
                    data-bs-dismiss={`${
                      activeImg?.some((item) => item.embImage !== "")
                        ? "modal"
                        : ""
                    }`}
                    aria-label="Close"
                    onClick={() => setSaveEmbossDetail()}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setSaveEmbossDetailReset()}
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => {
                      handleSetStateChange(false);
                      setSelectedIndex(0);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <EmbossingPreview
          embossingPreviewModalBaseView={embossingPreviewModalBaseView}
          setEmbossingPreviewModalBaseView={setEmbossingPreviewModalBaseView}
          setSelectedIndex={setSelectedIndex}
          handleSetStateChange={handleSetStateChange}
          selectedIndex={selectedIndex}
          setActiveImg={setActiveImg}
          activeImg={activeImg}
        />
      </section>
    </main>
  ) : (
    <CertificateDiamond
      finalCanBeSet={finalCanBeSet}
      handleFirstStep={handleFirstStep}
      go_to_diamond={go_to_diamond}
      go_to_review={go_to_review}
      diamondComplete={diamondComplete}
      handleComplete={handleComplete}
      handleBackToDiamond={handleBackToDiamond}
      parentCallback={handleBackToDiamond}
      complete={complete}
      salesTotalPrice={numberWithCommas(salesTotalPrice)}
      productSKU={productSKU}
      finalTotal={finalTotal}
      selectedColor={selectedColor}
      product_type={productType}
      element={stoneElement}
      back={parentBack}
      setStone={setStone}
      can_be_set={finalCanBeSet}
      paramsItem={paramsItem}
      handleSetStone={handleSetStone}
      certificateNumber={stoneObj.st_cert_no}
      stonePrice={stoneObj.final_total_display}
      stoneImageUrl={stoneObj.st_is_photo}
      isStone={isStone}
      diamondStepTwo={diamondStepTwo}
      diamondStepFirst={diamondStepFirst}
      backToList={backToList}
      isEngraving={saveEngraving}
      engravingData={engravingData}
      specificationData={specificationData}
      isOffers={isOffers}
      selectedOffer={selectedOffer}
      embossingData={embossingData}
      isEmbossing={SaveEmbossing}
      serviceData={serviceData}
      calculatePrice={calculatePrice}
      imageImportinSpecificationDiy={imageImportinSpecificationDiy}
    />
  );
}
