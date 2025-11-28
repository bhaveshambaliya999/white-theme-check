/* eslint-disable react/prop-types */
import {
  extractNumber,
  firstWordCapital,
  isEmpty,
  numberWithCommas,
  RandomId,
} from "@/CommanFunctions/commanFunctions";
import commanService from "@/CommanService/commanService";
import Loader from "@/CommanUIComp/Loader/Loader";
import { cartCount, favCount } from "@/Redux/action";
import React, { useCallback, useEffect, useRef } from "react";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
const dataContext = React.createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useContextElement = () => {
  return useContext(dataContext);
};

export default function Context({ children }) {
  const isCallRef = useRef(false);
  const storeEntityData = useSelector((state) => state.storeEntityId);

  const storeEntityIds =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("storeData")) || storeEntityData
      : storeEntityData;

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

  const isLogin = loginDatas && Object.keys(loginDatas).length > 0;
  const dispatch = useDispatch();
  const [cartProducts, setCartProducts] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [subtotal, setSubtotal] = useState("");

  const getCountData = useCallback(() => {
    if (storeEntityIds && Object.keys(storeEntityIds).length > 0) {
      const obj = {
        a: "get_count",
        store_id: storeEntityIds.mini_program_id,
        // SITDeveloper: "1",
        // origin: storeEntityIds.cmp_origin,
        user_id:
          Object.keys(loginDatas).length > 0 ? loginDatas.member_id : RandomId,
        // user_id: isLogin ? loginDatas.member_id : "",
      };
      commanService
        .postLaravelApi("/CartMaster", obj)
        .then((res) => {
          if (res.data.success === 1) {
            dispatch(favCount(res.data.data.favourite_count));
            dispatch(cartCount(res.data.data.cart_count));
            setLoading(false);
          } else {
            toast.error(res.data.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          // toast.error(error.message);
        });
    }
  }, [wishList, cartProducts, isLogin]);

  useEffect(() => {
    const data1 = [...cartProducts];
    let sum = 0;
    let arr1 = [];
    data1.map((value) => {
      let newArr1 = [];
      let newArr2 = [];
      if (value.data.length >= 2) {
        value.data.map((e1) => {
          if (e1.vertical_code !== "DIAMO" && e1.vertical_code !== "LGDIA") {
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
              //item_price: e1.item_price_display,
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
              store_tax_included_in_price: e1.store_tax_included_in_price,
              item_price: e1.item_price,
              item_id: e1.item_id,
              origional_tax_price: e1.origional_tax_price,
              item_qty: e1.item_qty,
              cert_lab: e1.cert_lab,
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
              //item_price: e1.item_price_display,
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
              cert_lab: e1.cert_lab,
            };

            newArr2.push(data);
          }
          return e1;
        });
        value.types = newArr2;
      }
      // sum += Number(
      //   value?.item_price +
      //     Number(
      //       value.data[0].eng_text !== ""
      //         ? value.data[0].eng_price * value?.data?.[0]?.item_qty
      //         : 0
      //     )
      // );
      if (Number(value?.data[0]?.store_tax_included_in_price) === 1) {
        sum += Number(value?.item_price) + Number(value?.total_tax_amt);
      } else {
        sum += Number(value?.item_price);
      }
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
    // const subtotal = cartProducts.reduce((accumulator, product) => {
    //   return (
    //     accumulator +
    //     product?.data?.[0]?.item_qty *
    //       (Number(product?.data?.[0]?.item_price) + Number(product?.data?.[0]?.eng_text !== '' ? product?.data?.[0]?.eng_price : 0))
    //   );
    // }, 0);
    setTotalPrice(sum);
  }, [cartProducts]);

  const getWishListFavourit = () => {
    setLoading(true);
    const objWishList = {
      a: "GetFavourite",
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
    };
    commanService
      .postLaravelApi("/FavouriteController", objWishList)
      .then((res) => {
        if (res.data.success === 1) {
          setWishlistProducts(res?.data?.data?.result);
          getCountData();
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        // toast.error(error.message);
      });
  };

  const getCartItems = () => {
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
    commanService
      .postLaravelApi("/CartMaster", obj)
      .then((res) => {
        if (res.data.success === 1) {
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
                    //item_price: e1.item_price_display,
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
                    store_tax_included_in_price: e1.store_tax_included_in_price,
                    item_price: e1.item_price,
                    engraving_currency: e1.engraving_currency,
                    is_engraving: e1.is_engraving,
                    is_embossing: e1.is_embossing,
                    embossing_json: e1.embossing_json,
                    offer_code: e1.offer_code,
                    service_json: e1.service_json,
                    cart_id: e1.cart_id,
                    item_id: e1.item_id,
                    origional_tax_price: e1.origional_tax_price,
                    item_qty: e1.item_qty,
                    cert_lab: e1.cert_lab,
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
                    store_tax_included_in_price: e1.store_tax_included_in_price,
                    item_price: e1.item_price,
                    // item_id: e1.item_id,
                    offer_code: e1.offer_code,
                    service_json: e1.service_json,
                    cart_id: e1.cart_id,
                    item_id: e1.item_id,
                    origional_tax_price: e1.origional_tax_price,
                    item_qty: e1.item_qty,
                    cert_lab: e1.cert_lab,
                  };

                  newArr2.push(data);
                }
                return e1;
              });
              value.types = newArr2;
            }
            // sum += Number(
            //   value?.item_price +
            //     Number(
            //       value.data[0].eng_text !== ""
            //         ? value.data[0].eng_price * value?.data?.[0]?.item_qty
            //         : 0
            //     )
            // );
            if (Number(value?.data[0]?.store_tax_included_in_price) === 1) {
              sum += Number(value?.item_price) + Number(value?.total_tax_amt);
            } else {
              sum += Number(value?.item_price);
            }
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
          getCountData();
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        // toast.error(error.message);
      });
  };

  const addProductToCart = (item, key) => {
    if (!cartProducts.some((elm) => elm?.data[0].item_id === item.item_id)) {
      const saveData = {
        JEWEL:
          key !== "diamond"
            ? [
                {
                  campaign_id: "",
                  mi_unique_id: item.unique_id,
                  price_type: item.price_type,
                  item_id: item?.item_id,
                  variant_id: item?.variant_unique_id,
                  vertical_code: item.vertical_code,
                  group_code: item.item_group,
                  qty: 1,
                  product_diy: "PRODUCT",
                  product_title: item?.jewellery_product_type_name,
                  product_name: item?.product_name,
                  variant_sku: item?.product_sku,
                  product_variant: item?.product_variant,
                  product_type: item?.jewellery_product_type,
                  short_summary: item?.short_summary,
                  item_base_price: item.origional_price || item.final_total,
                  currency_base_symbol: item.currency_symbol,
                  metal_type: item?.master_primary_metal_type,
                  service_json: item.service_json ?? [],
                  // eng_font: isItalicFont ? "italic" : "bold",
                  // eng_text: engravingText,
                  // eng_price: item.engraving_price,
                  // eng_currency: item.engraving_currency,
                  // eng_font_size: item.font_size,
                  // eng_max_character: item.max_character,
                  // eng_min_character: item.min_character,
                  offer_code: item?.coupon_code,
                },
              ]
            : [],
        DIAMO:
          key === "diamond"
            ? [
                {
                  id: item.st_cert_no,
                  vertical_code: item.st_short_code,
                  group_code: item.st_item_group,
                  qty: 1,
                  product_title:
                    isEmpty(item.st_shape) !== ""
                      ? firstWordCapital(item.st_shape.split("-").join(" "))
                      : "",
                  product_name: item.product_name,
                  variant_sku: "",
                  product_variant: "",
                  product_type: "",
                  item_base_price: item.net_price,
                  currency_base_symbol: item.currency_code,
                  product_diy: "PRODUCT",
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
        user_id:
          Object.keys(loginDatas).length > 0 ? loginDatas.member_id : RandomId,
        store_id: storeEntityIds.mini_program_id,
        json_data: JSON.stringify(saveData),
        unique_id: "",
      };
      setLoading(true);
      if (isLogin) {
        commanService
          .postLaravelApi("/CartMaster", obj)
          .then((res) => {
            if (res.data.success === 1) {
              toast.success(res.data.message);
              getCartItems();
            } else {
              toast.error(res.data.message);
              setLoading(false);
            }
          })
          .catch((error) => {
            setLoading(false);
            // toast.error(error.message);
          });
        document
          .getElementById("cartDrawerOverlay")
          .classList.add("page-overlay_visible");
        document.getElementById("cartDrawer").classList.add("aside_visible");
      } else {
        toast.error("Please Login first");
        setLoading(false);
      }
    }
  };
  const isAddedToCartProducts = (id) => {
    if (
      cartProducts.filter(
        (elm) =>
          (isEmpty(elm?.data?.[0]?.cert_no) !== ""
            ? elm?.data?.[0]?.cert_no
            : isEmpty(elm?.data?.[0]?.item_id)) == id
      )[0]
    ) {
      return true;
    }
    return false;
  };

  const toggleWishlist = (e, key) => {
    const certNo = e?.st_cert_no;
    const itemId = e?.item_id;

    if (window.location.pathname.includes("/account_wishlist")) {
      const obj = {
        a: "DeleteFavourite",
        reference_id: e.unique_id,
        store_id: storeEntityIds.mini_program_id,
      };

      commanService
        .postLaravelApi("/FavouriteController", obj)
        .then((res) => {
          if (res.data.success === 1) {
            if (wishList?.includes(certNo)) {
              setWishList((pre) => pre.filter((elm) => elm !== certNo));
            } else if (wishList?.includes(itemId)) {
              setWishList((pre) => pre.filter((elm) => elm !== itemId));
            } else {
              setWishList((pre) => [...pre, certNo ?? itemId]);
            }
            toast.success(res.data.message);
            getWishListFavourit();
          } else {
            setWishList((pre) => [...pre, certNo ?? itemId]);
            toast.error(res.data.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          // toast.error(error.message);
        });
    } else {
      const paramsJewel = {
        JEWEL: [
          {
            vertical_code: e.vertical_code,
            group_code: e.item_group,
            qty: 1,
            price_type: e.price_type,
            item_id: itemId,
            variant_id: e.variant_unique_id,
            product_diy: "PRODUCT",
            product_title: e.jewellery_product_type_name,
            product_name: e.product_name,
            mi_unique_id: e.unique_id ?? e.mi_unique_id,
            offer_code: e?.coupon_code,
          },
        ],
      };

      const params = {
        DIAMO: [
          {
            vertical_code: isEmpty(e.st_short_code),
            group_code: isEmpty(e.st_item_group),
            qty: 1,
            price_type: "",
            item_id: isEmpty(e.st_item_id),
            id: isEmpty(certNo),
            product_title: "",
            product_name: isEmpty(e.product_name),
          },
        ],
      };

      const obj = {
        a: "AddDeleteFavourite",
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        currency: storeCurrencys,
        current_user: isLogin ? loginDatas.member_id : RandomId,
        user_id: isLogin ? loginDatas.member_id : RandomId,
        store_id: storeEntityIds.mini_program_id,
        json_data: JSON.stringify(key === "diamond" ? params : paramsJewel),
      };

      if (isLogin) {
        commanService
          .postLaravelApi("/FavouriteController", obj)
          .then((res) => {
            if (res.data.success === 1) {
              if (wishList?.includes(certNo)) {
                setWishList((pre) => pre.filter((elm) => elm !== certNo));
              } else if (wishList?.includes(itemId)) {
                setWishList((pre) => pre.filter((elm) => elm !== itemId));
              } else {
                setWishList((pre) => [...pre, certNo ?? itemId]);
              }
              toast.success(res.data.message);
              getWishListFavourit();
            } else {
              setWishList((pre) => [...pre, certNo ?? itemId]);
              toast.error(res.data.message);
            }
          })
          .catch((error) => {
            setLoading(false);
            // toast.error(error.message);
          });
      } else {
        toast.error("Please Login first");
      }
    }
  };

  // console.log(wishList);

  const isAddedtoWishlist = (id) => {
    if (wishList.includes(id)) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (
      storeEntityIds &&
      Object.keys(storeEntityIds).length > 0 &&
      !isCallRef.current &&
      isLogin
    ) {
      isCallRef.current = true;
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
      commanService
        .postLaravelApi("/CartMaster", obj)
        .then((res) => {
          if (res.data.success === 1) {
            const data1 = [...res?.data?.data];
            let sum = 0;
            let arr1 = [];
            data1?.map((value) => {
              let newArr1 = [];
              let newArr2 = [];
              if (value?.data?.length >= 2) {
                value?.data?.map((e1) => {
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
                      //item_price: e1.item_price_display,
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
                      store_tax_included_in_price:
                        e1.store_tax_included_in_price,
                      item_price: e1.item_price,
                      item_id: e1.item_id,
                      origional_tax_price: e1.origional_tax_price,
                      item_qty: e1.item_qty,
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
                      //item_price: e1.item_price_display,
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
                      store_tax_included_in_price:
                        e1.store_tax_included_in_price,
                      item_price: e1.item_price,
                      item_id: e1.item_id,
                      origional_tax_price: e1.origional_tax_price,
                      item_qty: e1.item_qty,
                    };

                    newArr2.push(data);
                  }
                  return e1;
                });
                value.types = newArr2;
              }
              // sum += Number(
              //   value?.item_price +
              //     Number(
              //       value?.data?.[0]?.eng_text !== ""
              //         ? value?.data?.[0]?.eng_price * value?.data?.[0]?.item_qty
              //         : 0
              //     )
              // );
              if (Number(value?.data[0]?.store_tax_included_in_price) === 1) {
                sum += Number(value?.item_price) + Number(value?.total_tax_amt);
              } else {
                sum += Number(value?.item_price);
              }
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
            getCountData();
          }
        })
        .catch((error) => {
          setLoading(false);
          // toast.error(error.message);
        });
    }
    // const items = JSON.parse(localStorage.getItem("cartList"));
    // if (items?.length) {
    // }
  }, []);

  // useEffect(() => {
  //   localStorage.setItem("cartList", JSON.stringify(cartProducts));
  // }, [cartProducts]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const items = JSON.parse(localStorage.getItem("wishlist"));
    if (items?.length) {
      setWishList(items);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("wishlist", JSON.stringify(wishList));
  }, [wishList]);

  const contextElement = {
    cartProducts,
    setCartProducts,
    totalPrice,
    setTotalPrice,
    addProductToCart,
    isAddedToCartProducts,
    toggleWishlist,
    isAddedtoWishlist,
    wishList,
    getCartItems,
    getCountData,
    getWishListFavourit,
    wishlistProducts,
    setWishlistProducts,
    setLoading,
    loading,
  };
  return (
    <dataContext.Provider value={contextElement}>
      {children}
      {/* {loading && <Loader />} */}
    </dataContext.Provider>
  );
}
