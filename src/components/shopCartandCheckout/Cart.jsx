"use client";

import { useRouter } from "next/router";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import { useCallback, useEffect, useRef, useState } from "react";
import commanService from "@/CommanService/commanService";
import { useDispatch, useSelector } from "react-redux";
import {
  changeUrl,
  extractNumber,
  isEmpty,
  jewelVertical,
  numberWithCommas,
  RandomId,
  safeParse,
} from "@/CommanFunctions/commanFunctions";
import Loader from "@/CommanUIComp/Loader/Loader";
import { toast } from "react-toastify";
import SkeletonModal from "@/CommanUIComp/Skeleton/SkeletonModal";
import AddEngraving from "../modals/AddEngraving";
import { openEngraving } from "@/utlis/openEngraving";
import { closeEngraving } from "@/utlis/closeEngraving";
import { openModalUserlogin } from "@/utlis/aside";
import {
  activeDIYtabs,
  activeImageData,
  ActiveStepsDiy,
  appliedCoupon,
  couponCodeApplied,
  DefaultBillingAddress,
  diamondDIYimage,
  diamondNumber,
  diamondPageChnages,
  dimaondColorType,
  discountCouponData,
  discountedPrice,
  displayPricesTotal,
  DiySteperData,
  donationDataLists,
  engravingObj,
  finalCanBeSetData,
  foundationArrayData,
  jeweleryDIYimage,
  jeweleryDIYName,
  previewImageDatas,
  saveEmbossings,
  stepperCompletedPage,
  storeEmbossingData,
  storeFilteredDiamondObj,
  storeItemObject,
  storeProdData,
  storeSelectedDiamondData,
  storeSelectedDiamondPrice,
  storeSpecData,
} from "@/Redux/action";
// import * as bootstrap from "bootstrap";
import LearnMore from "../modals/LearnMore";
import Embossing from "../modals/Embossing";

export default function Cart() {
  const {
    cartProducts,
    setCartProducts,
    totalPrice,
    setTotalPrice,
    getCountData,
  } = useContextElement();
  const isCallRef = useRef(false);
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const reduxLoginData = useSelector((state) => state.loginData);

  const loginDatas =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("loginData")) || reduxLoginData
      : reduxLoginData;

  const reduxStoreCurrency = useSelector((state) => state.storeCurrency);
  const storeCurrencys =
    typeof window !== "undefined"
      ? sessionStorage.getItem("storeCurrency") || reduxStoreCurrency
      : reduxStoreCurrency;
  const displayPricesTotals = useSelector((state) => state.displayPricesTotal);
  const donationDataListss = useSelector((state) => state.donationDataLists);
  const couponCodeApplieds = useSelector((state) => state.couponCodeApplied);
  const discountedPrices = useSelector((state) => state.discountedPrice);

  const router = useRouter();
  const dispatch = useDispatch();
  const isLogin = Object.keys(loginDatas).length > 0;
  const [loading, setLoading] = useState(false);
  // skeleton Array
  const [skeleton, setSkeleton] = useState(false);
  const [skeletonArr, setSkeletonArr] = useState([]);
  const [openEngravingModal, setOpenEngravingModal] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [engravingText, setEngravingText] = useState("");
  const [engIndex, setEngIndex] = useState("");

  const [isItalicFont, setIsItalicFont] = useState(false);
  const [itemData, setItemData] = useState("");
  const [itemAllData, setItemAllData] = useState("");
  const [currency, setCurrency] = useState(storeCurrencys);
  const [couponCode, setCouponCode] = useState("");
  const [storeCouponCode, setStoreCouponCode] = useState("");
  const [discountData, setDiscountData] = useState(false);

  //shipping days
  const [shippingDayData, setShippingDayData] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [shippingTax, setShippingTax] = useState(0);

  //prices
  const [couponPrice, setCouponPrice] = useState("");
  const [storeNetPrice, setStoreNetPrice] = useState(0);
  const [storeOrgnPrice, setStoreOrgnlPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState("");
  const [displayPrice, setDisplayPrice] = useState(displayPricesTotals ?? 0);

  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("");
  const [onetimeclick, setOneTimeClick] = useState(false);

  //payment
  const [paymentDataList, setPaymentDataList] = useState([]);
  const [storePaymentData, setStorePaymentData] = useState("");
  const [cartDataList, setCartDataList] = useState(cartProducts ?? []);
  const [allCartDataList, setAllCartdataList] = useState(cartProducts ?? []);

  //csr
  const [donationDataList, setDonationDataList] = useState(
    donationDataListss ?? []
  );
  const [CSRDisabled, setCSRDisabled] = useState(false);
  const [donationAmountArray, setDonationAmountArray] = useState([]);
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);

  //Embossing
  const [embossingModelViewJson, setEmbossingModelViewJson] = useState(false)
  const [selectIndexes, setSelectIndexes] = useState(0)
  const [embossingModelView, setEmbossingModelView] = useState(false)
  const [getEmbossingData, setGetEmbossingData] = useState({})
  const [itemsId, setItemsId] = useState("")
  const [cartId, setCartId] = useState("")
  const [embJson, setEmbJson] = useState("")

  //Modal
  const [billingAddressData, setbillingAddressData] = useState({});
  const [billingUniqeID, setBillingUniqeID] = useState("");
  const [selectedBillingAddress, selectBillingAddress] = useState([]);

  useEffect(() => {
    let bootstrap;
    (async () => {
      if (typeof window !== "undefined") {
        bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");

        const modalElement = document.getElementById("learnGuide");
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement, { keyboard: false });
          showLearnMoreModal ? modal.show() : modal.hide();
        }
      }
    })();
  }, [showLearnMoreModal]);

  useEffect(() => {
    let bootstrap;
    (async () => {
      if (typeof window !== "undefined") {
        bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");

        const modalElement = document.getElementById("addEmbossing");
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement, { keyboard: false });
          embossingModelView ? modal.show() : modal.hide();
        }
      }
    })();
  }, [embossingModelView]);

  useEffect(() => {
    let bootstrap;
    (async () => {
      if (typeof window !== "undefined") {
        bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");

        const modalElement = document.getElementById("addEmbossing");
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement, { keyboard: false });
          embossingModelViewJson ? modal.show() : modal.hide();
        }
      }
    })();
  }, [embossingModelViewJson]);

  // useEffect(() => {
  //   const modalElement = typeof document !== "undefined" && document.getElementById("learnGuide");
  //   if (modalElement) {
  //     const modal = new bootstrap.Modal(modalElement, {
  //       keyboard: false
  //     });
  //     showLearnMoreModal ? modal.show() : modal.hide();
  //   }
  // }, [showLearnMoreModal]);

  // useEffect(() => {
  //   const modalElement = typeof document !== "undefined" && document.getElementById("addEmbossing");
  //   if (modalElement) {
  //     const modal = new bootstrap.Modal(modalElement, {
  //       keyboard: false
  //     });
  //     embossingModelView ? modal.show() : modal.hide();
  //   }
  // }, [embossingModelView]);
  // useEffect(() => {
  //   const modalElement = typeof document !== "undefined" && document.getElementById("addEmbossing");
  //   if (modalElement) {
  //     const modal = new bootstrap.Modal(modalElement, {
  //       keyboard: false
  //     });
  //     embossingModelViewJson ? modal.show() : modal.hide();
  //   }
  // }, [embossingModelViewJson]);

  useEffect(() => {
    if (currency !== storeCurrencys) {
      setCurrency(storeCurrencys);
      getCartItems();
    }
  }, [storeCurrencys]);

  const handleChangeText = (e) => {
    setEngravingText(e.target.value);
  };

  const handleUpdateEngravingData = (elm, item, index) => {
    if (
      engravingText?.length < item?.min_character &&
      engravingText?.length > 0
    ) {
      toast.warning(
        `Please enter atleast ${item?.min_character} character`
      );
      return;
    }

    setLoading(true);
    let services = safeParse(elm.service_json)
    const updatedService = [...services];

    updatedService[index].text = engravingText;
    updatedService[index].type = isItalicFont ? "italic" : "bold";
    updatedService[index].is_selected = engravingText !== "" ? "1" : "0";
    const JEWEL = [{
      service_json: updatedService
    }]
    var json_data = {
      JEWEL: JEWEL
    };
    const obj = {
      a: "saveCart",
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      currency: storeCurrencys,
      current_user: isLogin ? loginDatas.member_id : RandomId,
      store_id: storeEntityIds.mini_program_id,
      json_data: JSON.stringify(json_data),
      user_id: isLogin ? loginDatas.member_id : RandomId,
      unique_id: elm?.cart_id,
    };
    commanService
      .postLaravelApi("/CartMaster", obj)
      .then((res) => {
        if (res.data.success === 1) {
          closeEngraving();
          toast.success(res.data.message);
          setItemData("");
          setItemAllData("")
          setEngIndex("");
          getCartItems();
        } else {
          toast.error(res.data.message);
          setTimeout(() => {
            setLoading(false);
          }, 3000);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleSetStateChangeModal = (value) => {
    setItemsId("");
    setEmbJson("");
    setEmbossingModelView(value);
    setEmbossingModelViewJson(value);
  }

  const handleUpdateEmbossing = (elm, obj, index) => {
    if (JSON.stringify(obj) === JSON.stringify(embJson)) {
      return
    }
    setLoading(true)
    let services = safeParse(elm.service_json)
    const updatedService = [...services];
    updatedService[index].image = obj;
    updatedService[index].is_selected = obj.some((img) => img?.embImage !== "") == true ? "1" : "0";
    const JEWEL = [{
      service_json: updatedService
    }]
    var json_data = {
      JEWEL: JEWEL
    };
    const objPayload = {
      a: "saveCart",
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      currency: storeCurrencys,
      current_user: isLogin ? loginDatas.member_id : RandomId,
      store_id: storeEntityIds.mini_program_id,
      json_data: JSON.stringify(json_data),
      unique_id: cartId,
      user_id: isLogin ? loginDatas.member_id : RandomId,
    }
    commanService.postLaravelApi("/CartMaster", objPayload).then((res) => {
      if (res.data.success === 1) {
        toast.success(res.data.message);
        setItemAllData("")
        setEngIndex("");
        getCartItems();
      } else {
        setLoading(false)
        toast.error(res.data.message);
      }
    });
  }


  const getCartItems = useCallback(() => {
    setSkeleton(true);
    let arr1 = [];
    for (let i = 0; i < Number(3); i++) {
      arr1.push(i);
    }
    setSkeletonArr(arr1);
    const obj = {
      a: "getCart",
      origin: storeEntityIds.cmp_origin,
      store_id: storeEntityIds.mini_program_id,
      user_id: isLogin ? loginDatas.member_id : RandomId,
      customer_name: isLogin ? loginDatas.first_name : "guest",
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      per_page: "0",
      secret_key: storeEntityIds.secret_key,
      number: "0",
      store_type: "B2C",
      currency: storeCurrencys,
      // SITDeveloper: "1",
    };
    setLoading(true);
    commanService
      .postLaravelApi("/CartMaster", obj)
      .then((res) => {
        if (res.data.success === 1) {
          // setCartProducts(res?.data?.data);
          dispatch(couponCodeApplied(false));
          dispatch(discountCouponData({}));
          const data1 = [...res.data.data];
          let sum = 0;
          let arr1 = [];
          data1.map((value) => {
            let newArr1 = [];
            let newArr2 = [];
            if (value.data.length >= 2) {
              value.data.map((e1) => {
                if (
                  e1.vertical_code !== "DIAMO" &&
                  e1.vertical_code !== "LGDIA"
                ) {
                  newArr1.push(e1.stone_position);
                  var data = {
                    product_name: e1.product_name,
                    currency: storeCurrencys,
                    type: e1.stone_position,
                    product_sku: e1.product_sku,
                    product_variant: e1.product_variant,
                    price: 0,
                    count: 0,
                    product_detail: e1.product_detail,
                    vertical_code: e1.vertical_code,
                    short_summary: e1.short_summary,
                    metal_type: e1.metal_type,
                    // item_price: e1.item_price_display,
                    item_image: e1.item_image,
                    jewellery_type: e1.jewellery_type,
                    pv_unique_id: e1.pv_unique_id,
                    eng_currency: e1.eng_currency,
                    eng_font: e1.eng_font,
                    eng_font_size: e1.eng_font_size,
                    eng_max_character: e1.eng_max_character,
                    eng_min_character: e1.eng_min_character,
                    eng_price: e1.eng_price,
                    eng_text: e1.eng_text,
                    engraving_currency: e1.engraving_currency,
                    is_engraving: e1.is_engraving,
                    is_embossing: e1.is_embossing,
                    embossing_json: e1.embossing_json,
                    offer_code: e1.offer_code,
                    service_json: e1.service_json,
                    cart_id: e1.cart_id,
                    item_id: e1.item_id,
                    store_tax_included_in_price: e1.store_tax_included_in_price,
                    item_price: e1.item_price,
                    origional_tax_price: e1.origional_tax_price,
                    item_qty: e1.item_qty,
                    cert_lab: e1.cert_lab
                  };
                  newArr2.push(data);
                } else {
                  var data = {
                    product_name: e1.product_name,
                    currency: storeCurrencys,
                    type: e1.stone_position,
                    product_sku: e1.product_sku,
                    product_variant: e1.product_variant,
                    price: 0,
                    count: 0,
                    product_detail: e1.product_detail,
                    vertical_code: e1.vertical_code,
                    short_summary: e1.short_summary,
                    metal_type: e1.metal_type,
                    // item_price: e1.item_price_display,
                    item_image: e1.item_image,
                    pv_unique_id: e1.pv_unique_id,
                    is_available: e1.is_available,
                    st_shape: e1.st_shape,
                    st_color: e1.st_color,
                    st_status_name: e1.st_status_name,
                    st_size: e1.st_size,
                    st_color_type: e1.st_color_type,
                    eng_currency: e1.eng_currency,
                    eng_font: e1.eng_font,
                    eng_font_size: e1.eng_font_size,
                    eng_max_character: e1.eng_max_character,
                    eng_min_character: e1.eng_min_character,
                    eng_price: e1.eng_price,
                    eng_text: e1.eng_text,
                    engraving_currency: e1.engraving_currency,
                    is_engraving: e1.is_engraving,
                    is_embossing: e1.is_embossing,
                    embossing_json: e1.embossing_json,
                    offer_code: e1.offer_code,
                    service_json: e1.service_json,
                    cart_id: e1.cart_id,
                    store_tax_included_in_price: e1.store_tax_included_in_price,
                    item_price: e1.item_price,
                    item_id: e1.item_id,
                    origional_tax_price: e1.origional_tax_price,
                    item_qty: e1.item_qty,
                    cert_lab: e1.cert_lab
                  };

                  newArr2.push(data);
                }
                return e1;
              });
              value.types = newArr2;
            }
            if (Number(value?.data[0]?.store_tax_included_in_price) === 1) {
              sum += (Number(value?.item_price) + Number(value?.total_tax_amt));
            } else {
              sum += (Number(value?.item_price));
            }
            // sum += Number(
            //   value?.item_price
            // +
            // Number(
            //   value.data[0].eng_text !== ""
            //     ?
            //     // value.data[0].eng_price *
            //     value?.data?.[0]?.item_qty
            //     : 0
            // )
            // );
            let objValues = {
              [value.data[0].cart_id]: value.data[0].item_qty,
            };
            arr1.push(objValues);
            return value;
          });
          data1.map((value) => {
            if (value.data.length >= 2) {
              value.types.map((tp, i) => {
                if (tp.type == "CENTER") {
                  var b = value.types[1];
                  value.types[1] = tp;
                  value.types[i] = b;
                }
                return tp;
              });
            }
            return value;
          });
          setCartProducts(data1);
          setTotalPrice(sum);
          if (cartProducts.length === 0) {
            dispatch(displayPricesTotal(0));
          }
          getCountData();
          setLoading(false);
          setSkeleton(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        setSkeleton(false);
        toast.error(error.message);
      });
  }, [currency]);

  const setQuantity = (data, quantity, cartId) => {
    if (quantity >= 1) {
      const item = cartProducts.filter(
        (elm) => elm.data?.[0]?.cart_id == data.data[0]?.cart_id
      )[0];
      const items = [...cartProducts];
      const itemIndex = items.indexOf(item);
      item.quantity = Number(quantity);
      items[itemIndex] = item;
      const obj = {
        a: "updateCart",
        store_id: storeEntityIds.mini_program_id,
        unique_id: cartId ?? data.data?.[0]?.cart_id,
        qty: item.quantity,
        member_id: isLogin ? loginDatas.member_id : RandomId,
      };
      commanService
        .postLaravelApi("/CartMaster", obj)
        .then((res) => {
          if (res.data.success === 1) {
            setCartProducts(items);
            getCartItems();
            dispatch(stepperCompletedPage(1));
            toast.success(res.data.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.message);
        });
    }
  };

  const setQuantityDIY = (elm, quantity) => {
    if (quantity >= 1) {
      const diyItemIds = elm.data.map((elm) => elm?.item_id)
        .filter((itemId) => itemId !== undefined);

      const filteredCartProducts = cartProducts.filter((cartItem) =>
        diyItemIds.every((itemId) =>
          cartItem?.data?.some((dataItem) => dataItem?.item_id === itemId)
        )
      );

      const cartId = filteredCartProducts[0]?.data
        ?.map((elm) => elm?.cart_id)
        .filter((itemId) => itemId !== undefined);

      const obj = {
        a: "updateCart",
        store_id: storeEntityIds.mini_program_id,
        unique_id: cartId.toString(),
        qty: quantity,
        member_id: isLogin ? loginDatas.member_id : RandomId,
      };
      commanService
        .postLaravelApi("/CartMaster", obj)
        .then((res) => {
          if (res.data.success === 1) {
            getCartItems();
            dispatch(stepperCompletedPage(1));
            toast.success(res.data.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.message);
        });
    }
  };

  const removeItem = (data) => {
    const removeCart = {
      a: "removeCart",
      member_id: isLogin ? loginDatas.member_id : RandomId,
      store_id: storeEntityIds.mini_program_id,
      unique_id: data?.unique_id,
    };
    setLoading(true);
    commanService
      .postLaravelApi("/CartMaster", removeCart)
      .then((res) => {
        if (res.data.success === 1) {
          // setCartProducts((pre) => [...pre.filter((elm) => elm.data?.[0].item_id != data.item_id)]);
          getCartItems();
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  };

  const onChangeService = (cartItem, item, index) => {
    setLoading(true)
    let services = safeParse(cartItem.service_json)
    const updatedService = [...services];
    updatedService[index].is_selected = item.is_selected === '1' ? '0' : '1';
    const JEWEL = [{
      service_json: updatedService
    }]
    var json_data = {
      JEWEL: JEWEL
    };
    const obj = {
      a: "saveCart",
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      currency: storeCurrencys,
      current_user: isLogin ? loginDatas.member_id : RandomId,
      user_id:
        Object.keys(loginDatas).length > 0
          ? loginDatas.member_id
          : RandomId,
      store_id: storeEntityIds.mini_program_id,
      json_data: JSON.stringify(json_data),
      unique_id: cartItem?.cart_id,
    };

    if (isLogin) {
      commanService
        .postLaravelApi("/CartMaster", obj)
        .then((res) => {
          if (res.data.success === 1) {
            getCartItems();
            dispatch(stepperCompletedPage(1));
            toast.success(res.data.message);
            setItemAllData("")
            setEngIndex("");
          }
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.message);
        });
    }
  }
  // const [checkboxes, setCheckboxes] = useState({
  //   free_shipping: false,
  //   flat_rate: false,
  //   local_pickup: false,
  // });

  // // Step 2: Create a handler function
  // const handleCheckboxChange = (event) => {
  //   const { id, checked } = event.target;
  //   setCheckboxes((prevCheckboxes) => ({
  //     ...prevCheckboxes,
  //     [id]: checked,
  //   }));
  // };

  //Navigate url
  const navigateURL = (item, value) => {
    if (
      item?.data?.[0]?.product_diy === "DIY" &&
      value?.vertical_code == "JEWEL"
    ) {
      dispatch(storeItemObject({}));
      dispatch(storeFilteredDiamondObj({}));
      dispatch(diamondPageChnages(false));
      dispatch(diamondNumber(""));
      dispatch(storeSelectedDiamondPrice(""));
      dispatch(diamondDIYimage(""));
      dispatch(finalCanBeSetData([]));
      dispatch(storeSpecData({}));
      dispatch(storeProdData({}));
      dispatch(storeSelectedDiamondData([]));
      dispatch(jeweleryDIYName(""));
      dispatch(storeSpecData({}));
      dispatch(storeProdData({}));
      dispatch(storeSelectedDiamondData([]));
      dispatch(jeweleryDIYimage(""));
      dispatch(activeDIYtabs("Jewellery"));
      dispatch(storeEmbossingData([]));
      dispatch(saveEmbossings(false));
      dispatch(previewImageDatas([]));
      dispatch(activeImageData([]));
      dispatch(DiySteperData([]));
      dispatch(ActiveStepsDiy(0));
      dispatch(engravingObj({}))
      router.push(
        `/make-your-customization/start-with-a-setting/${changeUrl(
          value.product_name + "-" + value.pv_unique_id
        )}`
      );
    } else if (
      item?.data?.[0]?.product_diy === "DIY" &&
      value.vertical_code !== "JEWEL"
    ) {
      dispatch(diamondPageChnages(true));
      dispatch(diamondNumber(value?.product_sku));
      dispatch(dimaondColorType(value?.st_color_type));
      if (value.vertical_code == "DIAMO") {
        router.push("/certificate-diamond/shape/cart");
      } else if (value.vertical_code == "LGDIA") {
        router.push("/lab-grown-certified-diamond/shape/cart");
      } else if (value.vertical_code == "GEDIA") {
        router.push("/lab-grown-gemstone/shape/cart");
      } else {
        dispatch(storeItemObject({}));
        dispatch(storeFilteredDiamondObj({}));
        dispatch(diamondPageChnages(false));
        dispatch(diamondNumber(""));
        dispatch(storeSelectedDiamondPrice(""));
        dispatch(diamondDIYimage(""));
        dispatch(finalCanBeSetData([]));
        dispatch(storeSpecData({}));
        dispatch(storeProdData({}));
        dispatch(storeSelectedDiamondData([]));
        dispatch(jeweleryDIYName(""));
        dispatch(storeSpecData({}));
        dispatch(storeProdData({}));
        dispatch(storeSelectedDiamondData([]));
        dispatch(jeweleryDIYimage(""));
        dispatch(activeDIYtabs("Jewellery"));
        dispatch(storeEmbossingData([]));
        dispatch(saveEmbossings(false));
        dispatch(previewImageDatas([]));
        dispatch(activeImageData([]));
        dispatch(DiySteperData([]));
        dispatch(ActiveStepsDiy(0));
        dispatch(engravingObj({}))
        const verticalCode = value?.vertical_code;
        const title = changeUrl(
          value?.product_name + "-" + value.pv_unique_id
        );

        var megaMenu = JSON.parse(sessionStorage.getItem("megaMenus")).navigation_data?.filter((elm) => elm.product_vertical_name === verticalCode)[0]

        router.push(`/products/${changeUrl(megaMenu?.menu_name)}/${title}`);
      }
    } else {
      if (
        item?.data?.[0]?.vertical_code !== "DIAMO" &&
        item?.data?.[0]?.vertical_code !== "LGDIA" &&
        item?.data?.[0]?.vertical_code !== "GEDIA"
      ) {
        const verticalCode = item?.data?.[0]?.vertical_code;
        const title = changeUrl(
          item?.product_name + "-" + item.data[0].pv_unique_id
        );
        var megaMenu = JSON.parse(sessionStorage.getItem("megaMenus")).navigation_data?.filter((elm) => elm.product_vertical_name === verticalCode)[0]

        router.push(`/products/${changeUrl(megaMenu?.menu_name)}/${title}`);
      } else {
        dispatch(diamondPageChnages(true));
        dispatch(diamondNumber(item?.data?.[0]?.cert_no));
        dispatch(dimaondColorType(item?.data?.[0]?.st_color_type));
        if (item?.data?.[0]?.vertical_code == "DIAMO") {
          router.push("/certificate-diamond/shape/cart");
        }
        if (item?.data?.[0]?.vertical_code == "LGDIA") {
          router.push("/lab-grown-certified-diamond/shape/cart");
        }
        if (item?.data?.[0]?.vertical_code == "GEDIA") {
          router.push("/lab-grown-gemstone/shape/cart");
        }
      }
    }
  };

  //address
  const addressData = () => {
    const Address = {
      a: "GetBilling",
      user_id: isLogin ? loginDatas.member_id : RandomId,
      store_id: storeEntityIds.mini_program_id,
      status: "1",
      per_page: "0",
      number: "0",
    };
    commanService
      .postLaravelApi("/BillingDetails", Address)
      .then((res) => {
        if (res.data.success === 1) {
          var billingData = res.data.data;
          if (billingData.length > 0) {
            var addrerss = [];
            dispatch(DefaultBillingAddress([]));
            for (let c = 0; c < billingData.length; c++) {
              if (billingData[c].status === 1) {
                dispatch(DefaultBillingAddress(billingData[c]));
              } else {
                addrerss.push(billingData[c]);
              }
            }
            selectBillingAddress([...addrerss]);
            setBillingUniqeID(billingData[0].unique_id);
            setbillingAddressData(billingData[0]);
          } else {
            dispatch(DefaultBillingAddress([]));
          }
        }
      })
      .catch(() => { });
  };

  // //shipping and billing tax and day
  // const shippingDay = (unique_id, type) => {
  //   setShippingTax(0);
  //   setShippingDayData("");
  //   const obj = {
  //     a: "get_shipping_days",
  //     billing_id: unique_id,
  //     billing_type: type,
  //     consumer_id: loginDatas.member_id,
  //     tenant_id: storeEntityIds.tenant_id,
  //     entity_id: storeEntityIds.entity_id,
  //     store_id: storeEntityIds.mini_program_id,
  //   };
  //   commanService.postLaravelApi("/CartMaster", obj).then((res) => {
  //     if (res.data.success === 1) {
  //       if (isEmpty(res.data.data) != "") {
  //         setShippingDayData(res.data.data);
  //         let dates = new Date(res.data.data);
  //         let newDate = new Date(dates).toLocaleDateString("en-GB", {
  //           day: "numeric",
  //           month: "long",
  //         });
  //         setExpectedDate(newDate);
  //       }
  //     }
  //   });
  //   obj.a = "get_tax";
  //   obj.currency = storeCurrencys;
  //   commanService.postLaravelApi("/CartMaster", obj).then((res) => {
  //     var total = storeOrgnPrice;
  //     setDiscountData(false);
  //     setCouponCode("");
  //     setOneTimeClick(false);
  //     setShippingTax(0);
  //     if (res.data.success === 1) {
  //       if (isEmpty(res.data.data) != "" && res.data.data != 0) {
  //         setShippingTax(res.data.data);
  //         total = Number(total) + Number(res.data.data);
  //         setDisplayPrice(total);
  //       }
  //     }
  //     var foundationArray = [];
  //     var donationData = donationDataList;
  //     for (let c = 0; c < donationData.length; c++) {
  //       if (donationData[c].checked == true) {
  //         total = Number(total) + Number(donationData[c].donation_value);
  //         var datas = {
  //           foundation_project_id: donationData[c].project_id,
  //           foundation_amount: donationData[c].donation_value,
  //         };
  //         foundationArray.push(datas);
  //       }
  //     }
  //     setDisplayPrice(Number(total).toFixed(2));
  //     setStoreNetPrice(Number(total).toFixed(2));
  //     setDonationAmountArray(foundationArray);
  //     setDonationDataList([...donationData]);
  //     dispatch(donationDataLists([...donationData]));
  //   });
  // };

  //CSR Donation
  const getDataDonation = (total) => {
    const obj = {
      a: "GetDonationDetails",
      store_id: storeEntityIds.mini_program_id,
    };
    commanService.postLaravelApi("/DonationDetail", obj).then((res) => {
      if (res.data.success === 1) {
        var data = res.data.data;
        var foundationArray = [];
        for (let c = 0; c < data.length; c++) {
          if (data[c].orderwise_donation_setup != "Flat") {
            data[c].donation_value = (
              (Number(data[c].donation_value) * total) /
              100
            ).toFixed(2);
          }
          data[c].checked = false;
          if (data[c].donation_value_order_price == "Yes") {
            setCSRDisabled(true);
            data[c].checked = true;
            total = total + Number(data[c].donation_value);
            var datas = {
              foundation_project_id: data[c].csr_id,
              foundation_amount: data[c].donation_value,
            };
            foundationArray.push(datas);
          }
        }
        setDisplayPrice(Number(total).toFixed(2));
        dispatch(displayPricesTotal(Number(total).toFixed(2)));
        setStoreNetPrice(Number(total).toFixed(2));
        setDonationAmountArray(foundationArray);
        setDonationDataList(data);
        dispatch(donationDataLists(data));
      }
    });
  };

  const onProjectChange = (d, index) => {
    // setDiscountData(false);
    // setCouponCode('');
    // setDiscountPrice(0);
    // setOneTimeClick(false);
    var foundationArray = [];
    var donationData = donationDataList;
    var total = Number(storeOrgnPrice);
    if (discountData == true) {
      total = Number(total) - Number(discount);
    }
    for (let c = 0; c < donationData.length; c++) {
      if (index == c) {
        if (donationData[c].checked != true) {
          donationData[c].checked = true;
          total = total + Number(donationData[c].donation_value);
          var datas = {
            foundation_project_id: donationData[c].csr_id,
            foundation_amount: donationData[c].donation_value,
          };
          foundationArray.push(datas);
          dispatch(foundationArrayData(foundationArray));
        } else {
          donationData[c].checked = false;
          foundationArray.push([]);
        }
        if (isEmpty(shippingTax) != "") {
          total = Number(total) + Number(shippingTax);
        }
      } else {
        donationData[c].checked = false;
      }
    }
    setDisplayPrice(Number(total).toFixed(2));
    dispatch(displayPricesTotal(Number(total).toFixed(2)));
    setStoreNetPrice(Number(total).toFixed(2));
    setDonationAmountArray(foundationArray);
    setDonationDataList([...donationData]);
  };

  const changeCouponCode = (e) => {
    // if (e.target.value === "") {
    setOneTimeClick(false);
    // }
    setDiscountData(false);
    setCouponCode(e.target.value);

    // var foundationArray = [];
    // var donationData = donationDataList;
    // var total = Number(totalPrice);
    // if (donationData.length != 0) {
    //   for (let c = 0; c < donationData.length; c++) {
    //     if (donationData[c]?.checked == true) {
    //       total = total + Number(donationData[c].donation_value);
    //       if (isEmpty(shippingTax) != "") {
    //         total = Number(total) + Number(shippingTax);
    //       }
    //       var datas = {
    //         foundation_project_id: donationData[c].csr_id,
    //         foundation_amount: donationData[c].donation_value,
    //       };
    //       foundationArray.push(datas);
    //     }
    //   }
    //   setDisplayPrice(Number(total).toFixed(2));
    //   dispatch(displayPricesTotal(Number(total).toFixed(2)));
    //   setStoreNetPrice(Number(total).toFixed(2));
    //   setDonationAmountArray(foundationArray);
    //   setDonationDataList(donationData);
    // } else {
    //   setDisplayPrice(totalPrice);
    //   dispatch(displayPricesTotal(totalPrice));
    //   if (isEmpty(shippingTax) != "") {
    //     setDisplayPrice(Number(total) + Number(shippingTax));
    //     dispatch(displayPricesTotal(Number(total) + Number(shippingTax)));
    //   }
    // }
  };

  const applyCouponCode = (code) => {
    if (code != "") {
      setLoading(true);
      const obj = {
        a: "GetCodeCoupon",
        status: "1",
        store_id: storeEntityIds.mini_program_id,
        code: code !== "" ? code.toUpperCase() : "",
        counsumer_id: isLogin ? loginDatas.member_id : RandomId,
        amount: Number(totalPrice).toFixed(2).toString(),
        type: "B2C",
      };
      commanService
        .postLaravelApi("/CouponController", obj)
        .then((res) => {
          if (res.data.success === 1) {
            dispatch(discountCouponData({}));
            toast.success(res.data.message);
            setDiscountData(true);
            dispatch(couponCodeApplied(true));
            setStoreCouponCode(code)
            dispatch(appliedCoupon(code));
            let dis_amount = 0;
            let dis_total = 0;
            if (code !== "") {
              dispatch(discountCouponData(res.data.data));
              let discount_type = res.data.data.discount_type;
              let discount = res.data.data.discount;

              if (discount_type === 'PERCENTAGE') {
                dis_amount = (Number(storeOrgnPrice) * Number(discount) / 100).toFixed(2);
              } else {
                dis_amount = Number(discount);
              }
              dis_total = Number(storeOrgnPrice) - Number(dis_amount);

              setCouponPrice(Number(dis_total).toFixed(2));
              setDiscount(Number(dis_amount).toFixed(2));
              setDiscountType(discount_type);
              setDiscountPrice(Number(storeOrgnPrice) - Number(dis_total));
              dispatch(discountedPrice(Number(storeOrgnPrice) - Number(dis_total)));

              if (isEmpty(shippingTax) != '' && shippingTax != 0) {
                setDisplayPrice(Number(dis_total) + (Number(cartProducts?.[0]?.data[0]?.store_tax_included_in_price) !== 1 ? Number(shippingTax) : 0));
              } else {
                setDisplayPrice(Number(dis_total).toFixed(2));
              }
              // dispatch(discountCouponData(res.data.data));
              // setCouponPrice(Number(res.data.data.total).toFixed(2));
              // setDiscount(Number(res.data.data.discount).toFixed(2));
              // setDiscountType(res.data.data.discount_type);
              // setDiscountPrice(
              //   Number(storeOrgnPrice) - Number(res.data.data.total)
              // );
              // dispatch(
              //   discountedPrice(
              //     Number(storeOrgnPrice) - Number(res.data.data.total)
              //   )
              // );
              // if (isEmpty(shippingTax) != "" && shippingTax != 0) {
              //   setDisplayPrice(
              //     Number(res.data.data.total) + Number(shippingTax)
              //   );
              // } else {
              //   setDisplayPrice(Number(res.data.data.total).toFixed(2));
              // }
            } else {
              setDiscount(0);
              setDiscountPrice("");
              setDisplayPrice(Number(storeOrgnPrice).toFixed(2))
            }
            var foundationArray = [];
            var donationData = donationDataList;
            var total = dis_total > 0 ? Number(dis_total) : Number(storeOrgnPrice);
            if (donationData.length != 0) {
              for (let c = 0; c < donationData.length; c++) {
                if (donationData[c].checked == true) {
                  total = total + Number(donationData[c].donation_value);
                  if (isEmpty(shippingTax) != "" && shippingTax != 0) {
                    total = Number(total) + Number(shippingTax);
                  } else {
                    total = Number(total).toFixed(2);
                  }
                  var datas = {
                    foundation_project_id: donationData[c].csr_id,
                    foundation_amount: donationData[c].donation_value,
                  };
                  foundationArray.push(datas);
                }
              }
              setDisplayPrice(Number(total).toFixed(2));
              setStoreNetPrice(Number(total).toFixed(2));
            }
            setLoading(false);
          } else if (res.data.success === 2) {
            setDiscountData(false);
            setLoading(false);
            toast.error(res.data.message);
          } else {
            setLoading(false);
            toast.error(res.data.message);
          }
        })
        .catch(() => { });
    } else {

      toast.error("Please Enter Valid Promo Code.");

    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setCartDataList(cartProducts);
    addressData();
    // var totalPrices = [];
    // if (cartProducts !== "") {
    //   for (let c = 0; c < cartProducts?.length; c++) {
    //     totalPrices?.push(Number(cartProducts?.[c]?.item_price)?.toFixed(2));
    //   }
    // }
    // var total = totalPrices?.reduce(function (a, b) {
    //   return +a + +b;
    // });
    // console.log(total, "total");

    setStoreNetPrice(Number(totalPrice).toFixed(2));
    setStoreOrgnlPrice(Number(totalPrice).toFixed(2));
    // if (
    //   donationDataListss?.[0]?.checked === false ||
    //   donationDataListss.length === 0
    // ) {
    getDataDonation(Number(totalPrice));
    // } else {
    setDisplayPrice(Number(totalPrice).toFixed(2));
    dispatch(displayPricesTotal(Number(totalPrice).toFixed(2)));
    // }
    dispatch(foundationArrayData([]));
    dispatch(displayPricesTotal(0));
    dispatch(donationDataLists([]));
    dispatch(couponCodeApplied(false));
    dispatch(discountCouponData({}));
    dispatch(appliedCoupon(""));
    dispatch(discountedPrice(""));
    setAllCartdataList(cartProducts);
  }, [totalPrice]);

  useEffect(() => {
    if (donationDataListss?.[0]?.checked === true) {
      setDisplayPrice(displayPricesTotals);
    }
  }, []);
  const checkOut = () => {
    if (isLogin) {
      dispatch(displayPricesTotal(displayPrice));
      dispatch(donationDataLists(donationDataList));
      router.push("/shop_checkout");
      dispatch(stepperCompletedPage(2));
    } else {
      openModalUserlogin();
    }
  };

  return (
    <div className="shopping-cart" style={{ minHeight: "calc(100vh - 300px)" }}>
      <div className="cart-table__wrapper">
        {loading && <Loader />}
        {!loading ? (
          cartProducts.length ? (
            <>
              <div className="cart-table">
                {cartProducts.map((elm, i) => {
                  if (elm.data.length === 1) {
                    // let embossingJson = elm?.data?.[0]?.embossing_json !== '' ? safeParse(elm?.data?.[0]?.embossing_json) : [];
                    // // embossingJson = embossingJson !== "" && embossingJson?.filter((item) => item?.embImage !== '')
                    // const isembossing = elm?.data?.[0]?.is_embossing
                    return (
                      <div className="shopping-cart-row" key={i}>
                        <div className="shopping-cart-img">
                          <img
                            loading="lazy"
                            src={elm?.data?.[0]?.image}
                            width="120"
                            height="120"
                            alt={elm.product_name}
                          />
                        </div>
                        <div className="shopping-cart-col">
                          <div className="shopping-cart-detail">
                            <div
                              className="shopping-title cursor-pointer"
                              onClick={() => navigateURL(elm)}
                            >
                              {elm.product_name}
                            </div>
                            <div className="shopping-sky">
                              {jewelVertical(elm.data[0].vertical_code) ===
                                true
                                ? `SKU: ${elm?.data?.[0]?.product_sku}`
                                : `Certificate No.: ${isEmpty(elm?.data?.[0]?.cert_lab)} ${elm?.data?.[0]?.cert_no}`}
                            </div>
                            <ul className="shopping-cart__product-item__options">

                              {/* <li>
                                  RATE: {storeCurrencys}{" "}
                                  {elm?.data?.[0]?.item_price_display}
                                  </li> */}
                              <li className="d-flex flex-wrap gap-3 ">
                                {isEmpty(elm?.data?.[0]?.metal_type) != "" ? (
                                  <div className="">
                                    <h4>Metal Type</h4>{" "}
                                    <span className="text-muted">
                                      {elm?.data?.[0]?.metal_type}
                                    </span>{" "}
                                  </div>
                                ) : (
                                  ""
                                )}
                                {isEmpty(
                                  elm?.data?.[0]?.short_summary.gold_wt
                                ) != "" &&
                                  elm?.data?.[0]?.short_summary.gold_wt > 0 ? (
                                  <div className="">
                                    <h4 className="">Gold Wt.</h4>{" "}
                                    <span className="text-muted">
                                      {elm?.data?.[0]?.short_summary.gold_wt}{" "}
                                      {
                                        elm?.data?.[0]?.short_summary
                                          .gold_wt_unit
                                      }
                                    </span>{" "}
                                  </div>
                                ) : (
                                  ""
                                )}
                                {isEmpty(
                                  elm?.data?.[0]?.short_summary.dia_wt
                                ) != "" &&
                                  elm?.data?.[0]?.short_summary.dia_wt > 0 ? (
                                  <div className="">
                                    <h4 className="">Dia. Wt.</h4>{" "}
                                    <span className="text-muted">
                                      {elm?.data?.[0]?.short_summary.dia_wt}{" "}
                                      {
                                        elm?.data?.[0]?.short_summary
                                          .dia_first_unit
                                      }
                                    </span>{" "}
                                  </div>
                                ) : (
                                  ""
                                )}

                                {isEmpty(
                                  elm?.data?.[0]?.short_summary.col_wt
                                ) != "" &&
                                  elm?.data?.[0]?.short_summary.col_wt > 0 ? (
                                  <div className="">
                                    <h4 className="">Gemstone Wt.</h4>{" "}
                                    <span className="text-muted">
                                      {elm?.data?.[0]?.short_summary.col_wt}{" "}
                                      {
                                        elm?.data?.[0]?.short_summary
                                          .col_first_unit
                                      }
                                    </span>{" "}
                                  </div>
                                ) : (
                                  ""
                                )}
                                {isEmpty(elm?.data?.[0]?.offer_code) !=
                                  "" && (
                                    <div className="">
                                      <h4 className="">Offer</h4>{" "}
                                      <span className="text-muted">
                                        {elm?.data?.[0]?.offer_code}
                                      </span>{" "}
                                    </div>
                                  )}
                              </li>
                            </ul>
                            <div className="shopping-cart-engraving">
                              {/* <div className="shopping-cart-price">
                                {storeCurrencys}{" "}

                                {
                                  // elm?.data?.[0]?.eng_text !== ""
                                  // ? numberWithCommas(
                                  //   (
                                  //     // Number(elm?.data?.[0]?.eng_price) +
                                  //     Number(elm?.data?.[0]?.item_price)
                                  //   ).toFixed(2)
                                  // )
                                  // :
                                  // elm?.data?.[0]?.item_price_display

                                  Number(elm?.data?.[0]?.store_tax_included_in_price) === 1 ?
                                    numberWithCommas((Number(elm?.total_tax_amt) + Number(elm?.data?.[0]?.item_price)).toFixed(2))
                                    : (elm?.data?.[0]?.item_price_display)
                                }

                              </div> */}
                              <div className="cart-engraving-row gap-2">
                                {
                                  elm.data[0].service_json && safeParse(elm.data[0]?.service_json)?.length > 0 ? safeParse(elm.data[0]?.service_json)?.map((item, l) => {
                                    return (
                                      <div key={l}>
                                        {item && item.service_code === 'ENGRAVING' && item.service_type === "Special" ? (
                                          isEmpty(item.text) === "" ? (
                                            <a
                                              className="engraving-link"
                                              onClick={() => {
                                                setEngravingText(
                                                  item.text
                                                );
                                                setItemAllData(elm.data[0])
                                                setEngIndex(l);
                                                setItemData(item, l);
                                                openEngraving();
                                              }}
                                            >
                                              <svg width="15" height="15" aria-hidden="true" className="icon">
                                                <use xlinkHref="#icon_plus" />
                                              </svg>
                                              <span className="text-decoration-underline ps-2">Add Engraving</span>
                                            </a>
                                          ) : (
                                            <div className="off_engraving">
                                              <div className="is_Engraving">
                                                <a
                                                  className="engraving cursor-pointe"
                                                  onClick={() => {
                                                    openEngraving();
                                                  }}
                                                >
                                                  Engraving Text :{" "}
                                                  <span className="text-decoration-underline"
                                                    style={
                                                      item.type ===
                                                        "italic"
                                                        ? {
                                                          fontStyle: "italic",
                                                        }
                                                        : {
                                                          fontStyle: "normal",
                                                        }
                                                    }
                                                    onClick={() => {
                                                      setIsItalicFont(
                                                        item.type ===
                                                          "italic"
                                                          ? true
                                                          : false
                                                      );
                                                      setEngIndex(l);
                                                      setItemAllData(elm.data[0])
                                                      setEngravingText(
                                                        item.text
                                                      );
                                                      setItemData(item, l);
                                                    }}
                                                  >
                                                    {item.text}
                                                  </span>
                                                </a>
                                              </div>
                                            </div>
                                          )
                                        ) : null}
                                        {item.service_code === 'EMBOSSING' && item.service_type === "Special" && item.image.some((img, h) => img.embImage !== "") ?
                                          <div className="ml-3 image_preview engraving">
                                            <span className="fs-14px fw-400 ">
                                              Embossing
                                            </span>
                                            {item.image !== "" && item.image?.map((el, k) => {
                                              if (k > 0) {
                                                return
                                              }
                                              return (
                                                <span className="ms-1 cursor-pointer text-underline" key={k}
                                                  data-toggle="modal"
                                                  data-target="#addEmbossing"
                                                  role="button"
                                                  onClick={() => { setItemAllData(elm.data[0]); setEngIndex(l); setEmbJson(item.image); setCartId(elm?.data?.[0]?.cart_id); setItemsId(elm?.data?.[0]?.item_id); setEmbossingModelViewJson(true) }}>
                                                  <img className="cursor-pointer" style={{ width: "25px", height: "25px" }} src={el?.embImage} />
                                                </span>
                                              )
                                            })}
                                          </div> :
                                          item.image?.length > 0 ?
                                            <a className="cursor-pointer engraving-link"
                                              data-toggle="modal"
                                              data-target="#addEmbossing"
                                              role="button"
                                              onClick={() => { setItemAllData(elm.data[0]); setEngIndex(l); setEmbJson(item.image); setCartId(elm?.data?.[0]?.cart_id); setItemsId(elm?.data?.[0]?.item_id); setEmbossingModelView(true) }}>

                                              <svg width="15" height="15" aria-hidden="true" className="icon">
                                                <use xlinkHref="#icon_plus" />
                                              </svg>
                                              <span className="text-decoration-underline ps-2">Add Embossing</span>
                                            </a>

                                            : null}
                                        {item.service_type === "Normal" && (
                                          <div className="form-check mb-0" key={item.service_code}>
                                            <input
                                              className="form-check-input form-check-input_fill"
                                              type="checkbox"
                                              checked={item.is_selected === '1'}
                                              onChange={() => onChangeService(elm.data[0], item, l)}
                                              aria-label="service"
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor={`service_${item.service_code}`}
                                            >
                                              {item.service_name}
                                            </label>
                                            {item.new_price ? (
                                              <span className="fw-semibold">
                                                {"(" +
                                                  extractNumber(item.new_price).toFixed(2) +
                                                  " " +
                                                  item.new_currency +
                                                  ")"}
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })
                                    : ""}

                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="shopping-cart-right">
                          <div className="shopping-cart-qty">
                            {jewelVertical(elm.data[0].vertical_code) ===
                              true ? (
                              <div className="qty-control position-relative">
                                <input
                                  type="number"
                                  name="quantity"
                                  onChange={(e) =>
                                    setQuantity(elm, Number(e.target.value) / 1)
                                  }
                                  value={elm.data?.[0]?.item_qty}
                                  min={1}
                                  className="qty-control__number text-center"
                                />
                                <div
                                  onClick={() =>
                                    setQuantity(
                                      elm,
                                      Number(elm.data?.[0]?.item_qty) - 1
                                    )
                                  }
                                  className="qty-control__reduce"
                                >
                                  -
                                </div>
                                <div
                                  onClick={() =>
                                    setQuantity(
                                      elm,
                                      Number(elm.data?.[0]?.item_qty) + 1
                                    )
                                  }
                                  className="qty-control__increase"
                                >
                                  +
                                </div>
                              </div>
                            ) : (
                              <div className="qty">Qty : 1</div>
                            )}
                          </div>
                          <div className="priceTd">
                            {
                              Number(elm?.data?.[0]?.store_tax_included_in_price) === 1 ?
                                <>
                                  <span className="inclusive">(Inclusive of all taxes)</span>
                                </> : ""
                            }
                            <span className="shopping-cart__subtotal">
                              {storeCurrencys}{" "}
                              {
                                // isEmpty(elm?.data?.[0]?.eng_text) !== ""
                                // ? numberWithCommas(
                                //   (
                                //     Number(
                                //       // elm?.data?.[0]?.eng_price *
                                //       elm?.data?.[0]?.item_qty
                                //     ) + Number(elm?.item_price)
                                //   ).toFixed(2)
                                // )
                                //   :
                                // elm?.item_price_display
                                Number(elm?.data?.[0]?.store_tax_included_in_price) === 1 ?
                                  numberWithCommas((Number(elm?.total_tax_amt) + Number(elm?.item_price)).toFixed(2))
                                  : (elm?.item_price_display)
                              }
                              {isEmpty(elm.data[0]?.offer_code) !== "" ? (
                                <>
                                  {/* <br/> */}
                                  <span className="offer-price">
                                    {storeCurrencys}{" "}
                                    {numberWithCommas((Number(elm?.data?.[0]?.origional_tax_price) * elm?.data?.[0]?.item_qty).toFixed(2))}
                                    {/* {isEmpty(elm?.data?.[0]?.eng_text) !== ""
                                        ? numberWithCommas(
                                          (
                                            // Number(elm?.data?.[0]?.eng_price) *
                                            Number(elm?.data?.[0]?.item_qty) +
                                            Number(
                                              elm?.data?.[0]?.origional_price
                                            ) *
                                            Number(elm?.data?.[0]?.item_qty)
                                          ).toFixed(2)
                                        )
                                        : numberWithCommas(Number(elm?.data?.[0]?.item_qty) *
                                          Number(elm?.data?.[0]?.origional_price))} */}
                                    {/* {numberWithCommas(
                                        (
                                          Number(
                                            elm?.data?.[0]?.origional_price
                                              .toString()
                                              ?.includes(",")
                                              ? elm?.data?.[0]?.origional_price.replace(
                                                /,/g,
                                                ""
                                              )
                                              : elm?.data?.[0]?.origional_price
                                          ) * elm?.data?.[0]?.item_qty
                                        ).toFixed(2)
                                      )} */}
                                  </span>
                                </>
                              ) : (
                                ""
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="shopping-cart-remove">
                          <a onClick={() => removeItem(elm)} className="remove-cart">
                            <svg width="14" height="14" aria-hidden="true">
                              <use xlinkHref="#icon_close" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    );
                  } else {
                    let jewelImage = "";
                    let Diamond = "";
                    let name = "";
                    elm.data.map((e1) => {
                      if (jewelVertical(e1.vertical_code) === true) {
                        if (e1.item_image === "") {
                          jewelImage = e1.image;
                        } else {
                          jewelImage = e1.item_image;
                        }
                        name = e1.product_name;
                      } else if (
                        e1.vertical_code === "DIAMO" ||
                        e1.vertical_code === "LGDIA" ||
                        e1.vertical_code === "GEDIA"
                      ) {
                        if (e1.stone_position === "CENTER") {
                          Diamond = e1.item_image;
                        } else {
                          Diamond = e1.item_image;
                        }
                      }
                      return e1;
                    });
                    if (jewelImage === "") {
                      jewelImage = "https://via.placeholder.com/500X500";
                    }
                    if (Diamond === "") {
                      Diamond = "https://via.placeholder.com/500X500";
                    }
                    return (
                      <div className="shopping-diy-row" key={i}>
                        <div className="diy-product" >
                          {
                            elm.types?.length > 0 &&
                            elm.types?.map((sub, j) => {
                              return jewelVertical(sub.vertical_code) === true ? (
                                <div className="shopping-diy-prodect" key={j}>
                                  <div className="shopping-cart-img">
                                    <img
                                      loading="lazy"
                                      src={sub.item_image}
                                      width="120"
                                      height="120"
                                      alt={sub.product_name}
                                    />
                                  </div>

                                  <div className="shopping-cart-col">
                                    <div className="shopping-cart-detail">
                                      <div
                                        className="shopping-title cursor-pointer"
                                        onClick={() => navigateURL(elm, sub)}
                                      >
                                        {sub.product_name}
                                      </div>
                                      <div className="shopping-sky">SKU: {sub.product_sku}</div>
                                      <ul className="shopping-cart__product-item__options">

                                        {/* <li>
                                        RATE: {storeCurrencys}{" "}
                                        {elm?.data?.[0]?.item_price_display}
                                      </li> */}
                                        <li className="d-flex flex-wrap gap-3">
                                          {isEmpty(sub.metal_type) != "" ? (
                                            <div className="d-flex flex-column">
                                              <h4>Metal Type</h4>{" "}
                                              <span className="text-muted">
                                                {sub?.metal_type}
                                              </span>{" "}
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                          {isEmpty(sub?.short_summary.gold_wt) !=
                                            "" &&
                                            sub?.short_summary.gold_wt > 0 ? (
                                            <div className="d-flex flex-column ">
                                              <h4 className="">Gold Wt.</h4>{" "}
                                              <span className="text-muted">
                                                {sub?.short_summary.gold_wt}{" "}
                                                {sub?.short_summary.gold_wt_unit}
                                              </span>{" "}
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                          {isEmpty(sub?.short_summary.dia_wt) !=
                                            "" &&
                                            sub?.short_summary.dia_wt > 0 ? (
                                            <div className="d-flex flex-column ">
                                              <h4 className="">Dia. Wt.</h4>{" "}
                                              <span className="text-muted">
                                                {sub?.short_summary.dia_wt}{" "}
                                                {sub?.short_summary.dia_first_unit}
                                              </span>{" "}
                                            </div>
                                          ) : (
                                            ""
                                          )}

                                          {isEmpty(sub?.short_summary.col_wt) !=
                                            "" &&
                                            sub?.short_summary.col_wt > 0 ? (
                                            <div className="d-flex flex-column ">
                                              <h4 className="">Gemstone Wt.</h4>{" "}
                                              <span className="text-muted">
                                                {sub?.short_summary.col_wt}{" "}
                                                {sub?.short_summary.col_first_unit}
                                              </span>{" "}
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                          {isEmpty(sub?.offer_code) !=
                                            "" && (
                                              <div className="">
                                                <h4 className="">Offer</h4>{" "}
                                                <span className="text-muted">
                                                  {sub?.offer_code}
                                                </span>{" "}
                                              </div>
                                            )}
                                          <div className="d-flex flex-column ">
                                            <h4 className="">Rate</h4>{" "}
                                            <span className="text-muted">
                                              {/* {numberWithCommas(
                                                elm?.data?.[0]?.origional_price
                                              )} */}

                                              {storeCurrencys}{" "}
                                              {
                                                Number(sub?.store_tax_included_in_price) === 1 ?
                                                  numberWithCommas((Number(elm?.total_tax_amt) + Number(sub?.item_price)).toFixed(2))
                                                  : numberWithCommas(sub?.item_price)
                                              }
                                            </span>{" "}
                                          </div>
                                        </li>

                                        <li className="shopping-cart-engraving">
                                          <div className="cart-engraving-row gap-2">
                                            {
                                              sub.service_json && safeParse(sub?.service_json)?.length > 0 ? safeParse(sub?.service_json)?.map((service, l) => {
                                                return (
                                                  <div>
                                                    {service && service.service_code === 'ENGRAVING' && service.service_type === "Special" ? (
                                                      isEmpty(service.text) === "" ? (
                                                        <a
                                                          className="engraving-link"
                                                          onClick={() => {
                                                            setEngravingText(
                                                              service.text
                                                            );
                                                            setEngIndex(l);
                                                            setItemAllData(sub)
                                                            setItemData(service, i);
                                                            openEngraving();
                                                          }}
                                                        >
                                                          <svg width="15" height="15" aria-hidden="true" className="icon">
                                                            <use xlinkHref="#icon_plus" />
                                                          </svg>
                                                          <span className="text-decoration-underline ps-2">Add Engraving</span>
                                                        </a>
                                                      ) : (
                                                        <div className="off_engraving">
                                                          <div className="is_Engraving">
                                                            <a
                                                              className="engraving cursor-pointe"
                                                              onClick={() => {
                                                                openEngraving();
                                                              }}
                                                            >
                                                              Engraving Text :{" "}
                                                              <span className="text-decoration-underline"
                                                                style={
                                                                  service.type ===
                                                                    "italic"
                                                                    ? {
                                                                      fontStyle: "italic",
                                                                    }
                                                                    : {
                                                                      fontStyle: "normal",
                                                                    }
                                                                }
                                                                onClick={() => {
                                                                  setIsItalicFont(
                                                                    service.type ===
                                                                      "italic"
                                                                      ? true
                                                                      : false
                                                                  );
                                                                  setEngravingText(
                                                                    service.text
                                                                  );
                                                                  setEngIndex(l);
                                                                  setItemAllData(sub)
                                                                  setItemData(service, i);
                                                                }}
                                                              >
                                                                {service.text}
                                                              </span>
                                                            </a>
                                                          </div>
                                                        </div>
                                                      )
                                                    ) : null}
                                                    {service.service_code === 'EMBOSSING' && service.service_type === "Special" && service.image.some((img, h) => img.embImage !== "") ?
                                                      <div className="image_preview engraving">
                                                        <span className="fs-14px fw-400">
                                                          Embossing
                                                        </span>
                                                        {service.image !== "" && service.image?.map((el, k) => {
                                                          if (k > 0) {
                                                            return
                                                          }
                                                          return (
                                                            <span className="ms-1 cursor-pointer text-underline" key={k}
                                                              data-toggle="modal"
                                                              data-target="#addEmbossing"
                                                              role="button"
                                                              onClick={() => { setItemAllData(sub); setEngIndex(l); setEmbJson(service.image); setCartId(sub?.cart_id); setItemsId(sub?.item_id); setEmbossingModelViewJson(true) }}>
                                                              <img className="cursor-pointer" style={{ width: "25px", height: "25px" }} src={el?.embImage} />
                                                            </span>
                                                          )
                                                        })}
                                                      </div> :
                                                      service.image?.length > 0 ?
                                                        <div className="p-0 fs-14px">
                                                          <a className="cursor-pointer engraving-link"
                                                            data-toggle="modal"
                                                            data-target="#addEmbossing"
                                                            role="button"
                                                            onClick={() => { setItemAllData(sub); setEngIndex(l); setEmbJson(service.image); setCartId(sub?.cart_id); setItemsId(sub?.item_id); setEmbossingModelView(true) }}>

                                                            <svg width="15" height="15" aria-hidden="true" className="icon">
                                                              <use xlinkHref="#icon_plus" />
                                                            </svg>
                                                            <span className="text-decoration-underline px-2">Add Embossing</span>
                                                          </a>
                                                        </div>
                                                        : null}
                                                    {service.service_type === "Normal" && (
                                                      <div className="form-check mb-0" key={service.service_code}>
                                                        <input
                                                          className="form-check-input form-check-input_fill"
                                                          type="checkbox"
                                                          checked={service.is_selected === '1'}
                                                          onChange={() => onChangeService(sub, service, l)}
                                                          aria-label="service"
                                                        />
                                                        <label
                                                          className="form-check-label"
                                                          htmlFor={`service_${service.service_code}`}
                                                        >
                                                          {service.service_name}
                                                        </label>
                                                        {service.new_price ? (
                                                          <span className="fw-semibold">
                                                            {"(" +
                                                              extractNumber(service.new_price).toFixed(2) +
                                                              " " +
                                                              service.new_currency +
                                                              ")"}
                                                          </span>
                                                        ) : (
                                                          ""
                                                        )}
                                                      </div>
                                                    )}
                                                  </div>
                                                )
                                              })
                                                : ""}
                                          </div>
                                        </li>
                                      </ul>
                                      <div className="d-flex flex-wrap gap-3">
                                        <div className="shopping-cart-price">
                                          {storeCurrencys}{" "}
                                          {
                                            Number(sub?.store_tax_included_in_price) === 1 ?
                                              numberWithCommas((Number(elm?.total_tax_amt) + (Number(sub?.item_price) * Number(elm?.data?.[0]?.item_qty))).toFixed(2))
                                              : numberWithCommas((Number(sub?.item_price) * Number(elm?.data?.[0]?.item_qty)).toFixed(2))
                                          }
                                          {isEmpty(sub?.offer_code) !== "" ? (
                                            <>
                                              <span className="offer-price">
                                                {storeCurrencys}{" "}
                                                {
                                                  numberWithCommas(Number(sub?.origional_tax_price * sub?.item_qty).toFixed(2))
                                                }
                                              </span>
                                            </>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="shopping-diy-diamond" key={j}>
                                  <div className="shopping-cart-img">
                                    <img
                                      loading="lazy"
                                      src={sub.item_image}
                                      width="120"
                                      height="120"
                                      alt={sub.product_name}
                                    />
                                  </div>
                                  <div className="shopping-cart-col">
                                    <div className="shopping-cart-detail">
                                      <div
                                        className="shopping-title cursor-pointer"
                                        onClick={() => navigateURL(elm, sub)}
                                      >
                                        {sub.product_name}
                                      </div>
                                      <div className="shopping-sky">Certificate: {sub.cert_lab} {sub.product_sku}</div>
                                      <ul className="shopping-cart__product-item__options">
                                        <li>
                                          {sub.is_available != 0 ? (
                                            <div className="d-flex gap-3">
                                              {sub.type !== "" && (
                                                <div className="d-flex flex-column ">
                                                  <h4 className="">
                                                    Setting Position
                                                  </h4>{" "}
                                                  <span className="text-muted">
                                                    {sub.type !== ""
                                                      ? sub.type
                                                      : ""}
                                                  </span>{" "}
                                                </div>
                                              )}
                                              <div className="d-flex flex-column ">
                                                <h4 className="">Rate</h4>{" "}
                                                <span className="text-muted">
                                                  {sub.item_price}
                                                </span>{" "}
                                              </div>
                                            </div>
                                          ) : (
                                            <></>
                                          )}
                                        </li>
                                      </ul>
                                      {/* <div className="shopping-cart-price">
                                        {storeCurrencys} {sub.item_price}
                                      </div> */}
                                    </div>
                                  </div>

                                </div>
                              );
                            })}
                        </div>
                        <div className="shopping-cart-right">
                          <div className="shopping-cart-qty">
                            {isEmpty(elm.data[0].diy_type) && isEmpty(elm.data[0].diy_type) !== '' ? (
                              <div className="qty-control position-relative">
                                <input
                                  type="number"
                                  name="quantity"
                                  onChange={(e) =>
                                    setQuantityDIY(elm, Number(e.target.value) / 1)
                                  }
                                  value={elm.data?.[0]?.item_qty}
                                  min={1}
                                  className="qty-control__number text-center"
                                />
                                <div
                                  onClick={() =>
                                    setQuantityDIY(
                                      elm,
                                      Number(elm.data?.[0]?.item_qty) - 1
                                    )
                                  }
                                  className="qty-control__reduce"
                                >
                                  -
                                </div>
                                <div
                                  onClick={() =>
                                    setQuantityDIY(
                                      elm,
                                      Number(elm.data?.[0]?.item_qty) + 1
                                    )
                                  }
                                  className="qty-control__increase"
                                >
                                  +
                                </div>
                              </div>
                            ) : (
                              <div className="qty">Qty : 1</div>
                            )}
                          </div>
                          <div className="priceTd">
                            <span className="shopping-cart__subtotal">
                              {storeCurrencys}{" "}
                              {
                                // elm?.data?.[0]?.eng_text !== ""
                                // ? numberWithCommas(
                                //   (
                                //     Number(
                                //       // elm?.data?.[0]?.eng_price *
                                //       elm?.data?.[0]?.item_qty
                                //     ) + Number(elm?.item_price)
                                //   ).toFixed(2)
                                // )
                                // :
                                // elm?.item_price_display
                                Number(elm?.data?.[0]?.store_tax_included_in_price) === 1 ?
                                  numberWithCommas((Number(elm?.total_tax_amt) + Number(elm?.item_price)).toFixed(2))
                                  : (elm?.item_price_display)
                              }
                            </span>
                          </div>
                        </div>
                        <div className="shopping-cart-remove">
                          <a
                            onClick={() => removeItem(elm)}
                            className="remove-cart">
                            <svg width="14" height="14" aria-hidden="true">
                              <use xlinkHref="#icon_close" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
              {/* <div className="cart-table-footer">
                
                 <button
                  className="btn btn-light"
                  onClick={() => window.scroll(0, 0)}
                >
                  UPDATE CART
                </button> 
              </div> */}
            </>
          ) : (
            <>
              <div className="fs-20">Shop cart is empty</div>

              <Link
                href={"/"}
                onClick={() => {
                  dispatch(donationDataLists([]));
                  dispatch(displayPricesTotal(0));
                  dispatch(discountCouponData({}));
                  dispatch(couponCodeApplied(false));
                }}
              >
                <button className="btn mt-3 btn-light">Explore Products</button>
              </Link>
            </>
          )
        ) : (
          <SkeletonModal storeSkeletonArr={skeletonArr} page={"cart"} />
        )}
      </div>
      {cartProducts.length ? (
        <div className="shopping-cart__totals-wrapper">
          <div className="sticky-content">
            <div className="shopping-cart__totals">
              <h3>Cart Totals</h3>
              <table className="cart-totals">
                <tbody>
                  <tr>
                    <th>Subtotal</th>
                    <td>
                      {storeCurrencys}{" "}
                      {numberWithCommas(extractNumber(totalPrice.toString()).toFixed(2))}
                    </td>
                  </tr>
                  {isEmpty(discountedPrices) !== '' ? (
                    <tr>
                      <th>Discount <span>(Coupon Code: {storeCouponCode.toUpperCase()})</span></th>
                      <td>
                        <span className="text-dark fw-700">
                          {storeCurrencys}{" "}
                          -{numberWithCommas(discountedPrices?.toFixed(2))}
                        </span>
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}
                  {donationDataList.map((d, i) => (
                    <tr key={i}>
                      <th>
                        {d.project_name}
                        <br></br>
                        <p
                          className="sizeguide-link cursor-pointer"
                          data-toggle="modal"
                          data-target="#learnGuide"
                        >
                          Learn More{" "}
                          <svg onClick={() => setShowLearnMoreModal(true)} width="18" height="18" aria-hidden="true">
                            <use xlinkHref="#icon_exclamation" />
                          </svg>
                        </p>
                      </th>
                      <td>
                        <div className="form-check">
                          <input
                            className="form-check-input form-check-input_fill"
                            type="checkbox"
                            disabled={
                              d.donation_value_order_price == "Yes" ||
                              CSRDisabled == true
                            }
                            aria-label="service"
                            checked={d?.checked}
                            onChange={(e) => onProjectChange(d, i)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="free_shipping"
                          >
                            {storeCurrencys} {numberWithCommas(extractNumber(d.donation_value).toFixed(2))}
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={2} className="cart-my-table">
                      <form
                        onSubmit={(e) => e.preventDefault()}
                        className="position-relative bg-body"
                      >
                        <input
                          className="form-control"
                          type="text"
                          name="coupon_code"
                          placeholder="Coupon Code"
                          value={couponCode}
                          onChange={(e) => changeCouponCode(e)}
                        />
                        <input
                          className="btn-link fw-medium position-absolute top-0 end-0 h-100 px-3"
                          type="submit"
                          defaultValue="APPLY COUPON"
                          onClick={() => applyCouponCode(couponCode)}
                        />
                      </form>
                    </td>
                  </tr>
                  {Math.abs(displayPrice - Math.round(displayPrice)) >= 0.01 && (
                    <tr>
                      <th>Rounded Off</th>
                      <td>
                        {storeCurrencys}{" "}
                        {(Math.round(displayPrice) - displayPrice > 0 ? "+" : "-")}
                        {Math.abs(Math.round(displayPrice) - displayPrice).toFixed(2)}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <th>Final Total</th>
                    <td>
                      {storeCurrencys}{" "}
                      {numberWithCommas((Math.round(extractNumber(displayPrice))).toFixed(2))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mobile_fixed-btn_wrapper">
              <div className="button-wrapper container">
                <button
                  className="btn btn-primary btn-checkout"
                  onClick={checkOut}
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <>
        <AddEngraving
          setIsItalicFont={setIsItalicFont}
          handleChangeText={handleChangeText}
          handleUpdateEngravingData={handleUpdateEngravingData}
          itemData={itemData}
          isItalicFont={isItalicFont}
          engravingText={engravingText}
          engIndex={engIndex}
          itemAllData={itemAllData}
        />
        {
          showLearnMoreModal && <LearnMore setShowLearnMoreModal={setShowLearnMoreModal} showLearnMoreModal={showLearnMoreModal} />
        }
        <Embossing
          embossingModelViewJson={embossingModelViewJson}
          embossingModelView={embossingModelView}
          modalView={embossingModelViewJson || embossingModelView}
          handleSetStateChangeModal={handleSetStateChangeModal}
          itemIds={itemsId}
          datas={embJson}
          setEmbJson={setEmbJson}
          setItemsId={setItemsId}
          setLoading={setLoading}
          setGetEmbossingData={setGetEmbossingData}
          handleUpdateEmbossing={handleUpdateEmbossing}
          selectIndexes={selectIndexes}
          setEmbossingModelView={setEmbossingModelView}
          setEmbossingModelViewJson={setEmbossingModelViewJson}
          engIndex={engIndex}
          itemAllData={itemAllData}
        />
      </>
    </div>
  );
}
