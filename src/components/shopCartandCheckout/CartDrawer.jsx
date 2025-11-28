import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  extractNumber,
  isEmpty,
  jewelVertical,
  numberWithCommas,
  RandomId,
} from "../../CommanFunctions/commanFunctions";
import { toast } from "react-toastify";
import commanService from "../../CommanService/commanService";
import Loader from "../../CommanUIComp/Loader/Loader";
import { ActiveStepsDiy, dimaondColorType, DiySteperData } from "../../Redux/action";
import { useContextElement } from "../../context/Context";
import { useRouter } from "next/router";

export default function CartDrawer() {
  const router = useRouter();
  const reduxLoginData = useSelector((state) => state.loginData);

const loginDatas =
  typeof window !== "undefined"
    ? JSON.parse(sessionStorage.getItem("loginData")) || reduxLoginData
    : reduxLoginData;

  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const reduxStoreCurrency = useSelector((state) => state.storeCurrency);
  const storeCurrencys =
    typeof window !== "undefined"
      ? sessionStorage.getItem("storeCurrency") || reduxStoreCurrency
      : reduxStoreCurrency;
  const cartCounts = useSelector((state) => state.cartCount);
  const isLogin = loginDatas && Object.keys(loginDatas).length > 0;
  const [currency, setCurrency] = useState(storeCurrencys);
  const dispatch = useDispatch();

  const { cartProducts, setCartProducts, totalPrice, getCartItems, loading, setLoading } = useContextElement();
   const pathname = usePathname();

  useEffect(() => {
    if (currency !== storeCurrencys) {
      setCurrency(storeCurrencys);
      window.scrollTo(0, 0);
    }
  }, [storeCurrencys]);

  const closeCart = () => {
    typeof document !== "undefined" && document
      .getElementById("cartDrawerOverlay")
      .classList.remove("page-overlay_visible");
    typeof document !== "undefined" && document.getElementById("cartDrawer").classList.remove("aside_visible");
  };

  const setQuantity = (data, quantity) => {
    if (quantity >= 1) {
      const item = cartProducts.filter(
        (elm) => elm.data?.[0]?.cart_id == data.data[0]?.cart_id
      )[0];
      const items = [...cartProducts];
      const itemIndex = items.indexOf(item);
      item.quantity = quantity;
      items[itemIndex] = item;
      const obj = {
        a: "updateCart",
        store_id: storeEntityIds.mini_program_id,
        unique_id: data.data?.[0]?.cart_id,
        qty: item.quantity,
        member_id: isLogin ? loginDatas.member_id : RandomId,
      };
      setLoading(true);
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
      setLoading(true);
      commanService
        .postLaravelApi("/CartMaster", obj)
        .then((res) => {
          if (res.data.success === 1) {
            toast.success(res.data.message);
            getCartItems();
          }
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.message);
        });
    }
  };

  // const getCartItems = () => {
  //   const obj = {
  //     a: "getCart",
  //     origin: storeEntityIds.cmp_origin,
  //     store_id: storeEntityIds.mini_program_id,
  //     user_id: isLogin ? loginDatas.member_id : RandomId,
  //     customer_name: isLogin ? loginDatas.first_name : "guest",
  //     tenant_id: storeEntityIds.tenant_id,
  //     entity_id: storeEntityIds.entity_id,
  //     per_page: "0",
  //     secret_key: storeEntityIds.secret_key,
  //     number: "0",
  //     store_type: "B2C",
  //     currency: storeCurrencys
  //   };
  //   setLoading(true);
  //   commanService
  //     .postLaravelApi("/CartMaster", obj)
  //     .then((res) => {
  //       if (res.data.success === 1) {
  //         setCartProducts(res?.data?.data);
  //         getCountData();
  //         setLoading(false);
  //       } else {
  //         // toast.error(res?.data?.message);
  //         setLoading(false);
  //       }
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       // toast.error(error.message);
  //     });
  // };
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
  };

  useEffect(() => {
    closeCart();
  }, [pathname, currency]);

  useEffect(() => {
    if(isLogin){
      getCartItems();
    }
  }, [isLogin, currency]);
  return (
    <>
      <div
        className="aside aside_right overflow-hidden cart-drawer cart_drawer1"
        id="cartDrawer"
      >
        <div className="aside-header d-flex align-items-center">
          <h3 className="text-uppercase fs-6 mb-0">
            SHOPPING BAG (
            <span className="cart-amount js-cart-items-count">
              {cartCounts}
            </span>
            )
          </h3>
          <button
            onClick={closeCart}
            className="btn-close-lg js-close-aside btn-close-aside ms-auto"
            aria-label={"Close Cart"}
          ></button>
        </div>
        {loading && <Loader />}
        {cartProducts?.length > 0 ? (
          <div className="aside-content cart-drawer-items-list items-list cart_drawer ">
            {cartProducts.map((elm, l) => {
              const productKey = elm.data?.[0]?.product_sku || elm.product_name || l;

              if (elm.data.length === 1) {
                return (
                  <React.Fragment key={productKey}>
                    <div className="cart-drawer-item d-flex position-relative">
                      <div className="position-relative">
                        <img
                          loading="lazy"
                          className="cart-drawer-item__img img"
                          height={400}
                          src={elm.data?.[0].image}
                          alt={elm.product_name}
                        />
                      </div>
                      <div className="cart-drawer-item__info flex-grow-1">
                        <div className="cart-drawer-item__title fw-normal pe-3">
                          {elm.product_name}
                        </div>
                        <p className="cart-drawer-item__option text-secondary">
                          {jewelVertical(elm.data[0].vertical_code) === true
                            ? `SKU: ${elm?.data?.[0]?.product_sku}`
                            : `Certificate No.: ${isEmpty(elm?.data?.[0]?.cert_lab)} ${elm?.data?.[0]?.cert_no}`}
                        </p>
                        {/* <p className="cart-drawer-item__option text-secondary">
                            RATE: {storeCurrencys}{" "}
                            {elm?.data?.[0]?.origional_price}
                          </p> */}
                        <div className="d-flex align-items-center justify-content-between mt-1">
                          {jewelVertical(elm.data[0].vertical_code) === true ? (
                            <div className="qty-control position-relative">
                              <input
                                type="number"
                                name="quantity"
                                onChange={(e) =>
                                  setQuantity(elm, e.target.value / 1)
                                }
                                value={elm.data?.[0]?.item_qty}
                                min="1"
                                className="qty-control__number border-0 text-center"
                                aria-label="quantity" 
                              />
                              <div
                                onClick={() => {
                                  setQuantity(elm, elm.data?.[0]?.item_qty - 1);
                                }}
                                className="qty-control__reduce text-start"
                              >
                                -
                              </div>
                              <div
                                onClick={() =>
                                  setQuantity(elm, Number(elm.data?.[0]?.item_qty) + 1)
                                }
                                className="qty-control__increase text-end"
                              >
                                +
                              </div>
                            </div>
                          ) : (
                            "Qty : 1"
                          )}

                          <span className="cart-drawer-item__price money price">
                            {storeCurrencys}{" "}
                            {
                              Number(elm?.data?.[0]?.store_tax_included_in_price) === 1 ?
                                numberWithCommas((Number(elm?.total_tax_amt) + Number(elm?.item_price)).toFixed(2))
                                : (elm?.item_price_display)
                            }
                          </span>
                        </div>
                      </div>

                      <button onClick={() => removeItem(elm.data[0])} className="btn-close-xs position-absolute top-0 end-0 js-cart-item-remove" aria-label="Remove item from cart"
                      ></button>
                    </div>
                    <hr className="cart-drawer-divider" />
                  </React.Fragment>
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
                  <React.Fragment key={productKey}>
                    <div className="position-relative">
                      {elm?.types?.length > 0 &&
                        elm.types.map((sub, i) => {
                          const subKey = sub.product_sku || `sub-${i}`
                          return (
                            <React.Fragment key={subKey}>
                              {jewelVertical(sub.vertical_code) === true && (
                                <div className="cart-drawer-item d-flex position-relative">
                                  <div className="position-relative">
                                    <img
                                      loading="lazy"
                                      className="cart-drawer-item__img img"
                                      width={330}
                                      height={400}
                                      src={sub.item_image}
                                      alt={sub.product_name}
                                    />
                                  </div>
                                  <div className="cart-drawer-item__info flex-grow-1">
                                    <div className="cart-drawer-item__title fw-normal pe-3">
                                      {sub.product_name}
                                    </div>
                                    <p className="cart-drawer-item__option text-secondary">
                                      SKU: {sub?.product_sku}
                                    </p>
                                    <p className="cart-drawer-item__option text-secondary">
                                      RATE: {storeCurrencys} {" "}
                                      {
                                        Number(elm?.data?.[0]?.store_tax_included_in_price) === 1 ?
                                          numberWithCommas((Number(elm?.total_tax_amt) + Number(sub?.item_price)).toFixed(2))
                                          : (sub?.item_price)
                                      }
                                      {/* {sub?.item_price} */}
                                    </p>
                                  </div>
                                </div>
                              )}
                              {jewelVertical(sub?.vertical_code) !== true && (
                                <div className="cart-drawer-item d-flex position-relative">
                                  <div className="position-relative">
                                    <img
                                      loading="lazy"
                                      className="cart-drawer-item__img img"
                                      width={330}
                                      height={400}
                                      src={sub.item_image}
                                      alt={sub.product_name}
                                    />
                                  </div>
                                  <div className="cart-drawer-item__info flex-grow-1">
                                    <div className="cart-drawer-item__title fw-normal pe-3">
                                      {sub.product_name}
                                    </div>
                                    <p className="cart-drawer-item__option text-secondary">
                                      Certificate No.: {sub?.cert_lab} {sub?.product_sku}
                                    </p>
                                    <div className="d-flex align-items-center justify-content-between">
                                      {sub?.is_available !== 0 &&
                                        sub.type !== "" && (
                                          <p className="cart-drawer-item__option text-secondary">
                                            Setting Position: {sub?.type}
                                          </p>
                                        )}
                                    </div>
                                    <p className="cart-drawer-item__option text-secondary">
                                      RATE: {storeCurrencys}{" "}
                                      {
                                        Number(elm?.data?.[0]?.store_tax_included_in_price) === 1 ?
                                          numberWithCommas((Number(elm?.total_tax_amt) + Number(sub?.item_price)).toFixed(2))
                                          : (sub?.item_price)
                                      }
                                    </p>
                                  </div>
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}

                      <div className="d-flex align-items-center justify-content-between mt-1">
                        <div className="qty-control position-relative">
                          {isEmpty(elm.data[0].diy_type) && isEmpty(elm.data[0].diy_type) !== '' ? (
                            <div className="qty-control position-relative">
                              <input
                                type="number"
                                name="quantity"
                                onChange={(e) =>
                                  setQuantityDIY(elm, e.target.value / 1)
                                }
                                value={elm.data?.[0]?.item_qty}
                                min="1"
                                className="qty-control__number border-0 text-center"
                              />
                              <div
                                onClick={() =>
                                  setQuantityDIY(
                                    elm,
                                    elm.data?.[0]?.item_qty - 1
                                  )
                                }
                                className="qty-control__reduce text-start"
                              >
                                -
                              </div>
                              <div
                                onClick={() =>
                                  setQuantityDIY(
                                    elm,
                                    elm.data?.[0]?.item_qty + 1
                                  )
                                }
                                className="qty-control__increase text-end"
                              >
                                +
                              </div>
                            </div>
                          ) : (
                            "Qty : 1"
                          )}
                        </div>
                        <span className="cart-drawer-item__price money price">
                          {storeCurrencys}{" "}
                          {
                            Number(elm?.data?.[0]?.store_tax_included_in_price) === 1 ?
                              numberWithCommas((Number(elm?.total_tax_amt) + Number(elm?.item_price)).toFixed(2))
                              : (elm?.item_price_display)
                          }
                        </span>
                        <button
                          onClick={() => removeItem(elm)}
                          className="btn-close-xs position-absolute top-0 end-0 js-cart-item-remove" aria-label="Remove item from cart"
                        ></button>
                      </div>
                    </div>
                    <hr className="cart-drawer-divider" />
                  </React.Fragment>
                );
              }
            })}
          </div>
        ) : (
          <div className="fs-18 mt-5 px-3">
            Your cart is empty. Start shopping!
          </div>
        )}

        {/* <!-- /.aside-content --> */}

        <div className="cart-drawer-actions position-absolute start-0 bottom-0 w-100">
          <hr className="cart-drawer-divider" />
          <div className="d-flex justify-content-between">
            <p className="fs-base fw-medium h6">SUBTOTAL:</p>
            <span className="cart-subtotal fw-medium">
              {storeCurrencys}{" "}
              {numberWithCommas(extractNumber(totalPrice.toFixed(2)))}
            </span>
          </div>
          {/* <!-- /.d-flex justify-content-between --> */}
          {cartProducts?.length ? (
            <>
              <Link href="/shop_cart" className="btn btn-light mt-3 d-block" onClick={() => {
                dispatch(DiySteperData([]));
                dispatch(ActiveStepsDiy(1));
                dispatch(dimaondColorType("White"));
                closeCart();
              }}>
                View Cart
              </Link>
              {/* <Link
                to="/shop_checkout"
                className="btn btn-primary mt-3 d-block"
              >
                Checkout
              </Link> */}
            </>
          ) : (
            <Link href={"/"} className="btn btn-light mt-3 d-block" onClick={()=>closeCart()}>
              Explore shop
            </Link>
          )}
        </div>
        {/* <!-- /.aside-content --> */}
      </div>
      <div
        id="cartDrawerOverlay"
        onClick={closeCart}
        className="page-overlay"
      ></div>
    </>
  );
}
