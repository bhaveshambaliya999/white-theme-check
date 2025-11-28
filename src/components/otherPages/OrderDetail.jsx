"use client";

import { usePathname, useParams } from "next/navigation";
import { useRouter } from "next/router";
import {
  changeUrl,
  extractNumber,
  isEmpty,
  jewelVertical,
  numberWithCommas,
  RandomId,
  safeParse,
} from "@/CommanFunctions/commanFunctions";
import commanService, { imageUrl } from "@/CommanService/commanService";
import Loader from "@/CommanUIComp/Loader/Loader";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
// import * as bootstrap from "bootstrap";
import { Rating } from "react-simple-star-rating";
import EmbossingPreview from "../modals/EmbossingPreview";
import Link from "next/link";

export default function OrderDetail({ orderIds }) {
  const isCallRefs = useRef(false);
  // const {
  //   setShowOrderDetail,
  //   orderDetail,
  //   getOrderAllDataList,
  //   searchDetails,
  //   pageNo,
  //   isCallRef
  // } = props;
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const loginDatas =
    JSON.parse(sessionStorage.getItem("loginData")) ||
    useSelector((state) => state.loginData);
  const storeCurrencys =
    (typeof window !== "undefined" &&
      sessionStorage.getItem("storeCurrency")) ||
    useSelector((state) => state.storeCurrency);
  const isLogin = Object.keys(loginDatas).length > 0;

  const [loading, setLoading] = useState(false);
  const [orderDataList, setOrderDataList] = useState([]);
  const [mainSoUniId, setmainSoUniId] = useState([]);
  const [orderDetailsData, setOrderDetailsData] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [billindAddress, setBillingAddress] = useState("");
  const [paymentMethod, setPayment] = useState("");
  const [orderHistoryDataList, setOrderHistoryDataList] = useState([]);
  const [checkInvoice, setCheckInvoice] = useState([]);

  //review
  const [addReview, setAddReview] = useState(false);
  const [imgfile, setImgFile] = useState([]);
  const [imgPreview, setImgPreview] = useState([]);
  const [videoFile, setVideoFile] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [rating, setRating] = useState(0);
  const [headline, setHeadLine] = useState("");
  const [reviewDetail, setReviewDetail] = useState("");
  const [orderId, setOrderID] = useState("");
  const [itemNumber, setItemNumber] = useState("");
  const [variantNumber, setVariantNumber] = useState("");

  //EMbossing
  const [ebossingPreviewModalBaseView, setEmbossingPreviewModalBaseView] =
    useState(false);
  const [activeImg, setActiveImg] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    let bootstrap;
    (async () => {
      if (typeof window !== "undefined") {
        bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");

        const modalElement = document.getElementById("addReviewModal");
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement, { keyboard: false });
          addReview ? modal.show() : modal.hide();
        }
      }
    })();
  }, [addReview]);

  useEffect(() => {
    let bootstrap;
    (async () => {
      if (typeof window !== "undefined") {
        bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");

        const modalElement = document.getElementById("embossingPreview");
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement, { keyboard: false });
          ebossingPreviewModalBaseView ? modal.show() : modal.hide();
        }
      }
    })();
  }, [ebossingPreviewModalBaseView]);

  const handleBack = () => {
    // setShowOrderDetail(false);
    // setLoading(true)
    // isCallRef.current = false;
    // getOrderAllDataList(pageNo, searchDetails);
    router.push("/account_orders");
  };
  useEffect(() => {
    if (orderIds !== undefined && !isCallRefs.current) {
      getOrderDetails(orderIds);
      // orderHistoryData(orderIds);
      getOrderDataList(orderIds);
      isCallRefs.current = true;
    }
  }, []);

  const getOrderDataList = (id) => {
    const getOrderDetail = {
      a: "BTOCDisplaySalesOrder",
      counsumer_id: isLogin ? loginDatas.member_id : RandomId,
      store_id: storeEntityIds.mini_program_id,
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      per_page: "25",
      number: "1",
      document_status: "",
      SITDeveloper: "1",
      main_so_order_id: id,
      consumer_name: "",
      mobile_no: "",
    };
    setLoading(true);
    commanService.postApi("/SalesOrder", getOrderDetail).then((res) => {
      if (res.data.success == 1) {
        setOrderDataList(res.data.data.resData);
        orderHistoryData(id);
        detailShow();
        setLoading(false);
      }
    });
  };

  const detailShow = () => {
    const getInvoiceDetail = {
      a: "GetInvoiceStoreCheck",
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      order_id: orderIds,
      SITDeveloper: "1",
    };
    commanService
      .postApi("/SalesOrderToStore", getInvoiceDetail)
      .then((res) => {
        setCheckInvoice(res?.data?.data);
      });
  };
  const getOrderDetails = (id) => {
    const OrderShipping = {
      SITDeveloper: "1",
      a: "GetOrderidWiseDataDisplay",
      order_id: id,
      per_page: 0,
      number: 0,
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      sorting_column: "",
      sorting_order: "",
      origin: storeEntityIds.cmp_origin,
      type: "portal",
    };
    setLoading(true);
    commanService
      .postApi("/SalesOrder", OrderShipping)
      .then((res) => {
        if (res.data.success == 1) {
          setShippingAddress(res.data.data.shipping_address);
          setBillingAddress(res.data.data.billing_address);
          setPayment(res.data.data.payment_transaction);
          setOrderDetailsData(res.data.data.order_details);
          setLoading(false);
        } else {
          toast.error(res.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const orderHistoryData = (id) => {
    const orderLoacte = {
      a: "GetSalesOrderHistory",
      so_order_id: "",
      unique_id: "",
      order_id: id,
      store_id: storeEntityIds.mini_program_id,
      customer_id: storeEntityIds.customer_id,
      business_unit_id: null,
      counsumer_id: isLogin ? loginDatas.member_id : RandomId,
      reference_order_id: "",
      per_page: 0,
      number: 0,
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      SITDeveloper: "1",
      origin: storeEntityIds.cmp_origin,
    };
    setLoading(true);
    commanService
      .postApi("/SalesOrder", orderLoacte)
      .then((res) => {
        if (res.data.success == 1) {
          const sdata = res.data.data;
          setOrderHistoryDataList(sdata);
          setLoading(false);
        } else {
          toast.error(res.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const printOrderInvoice = () => {
    setLoading(true);
    const getInvoiceDetail = {
      a: "SalesInvoiceOrderCommonViewPDF",
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      security_id: checkInvoice.invo_invoice_security_id,
      unique_id: checkInvoice.invo_unique_id,
      so_unique_id: "",
      SITDeveloper: "1",
    };
    commanService.postApi("/InvoiceMaster", getInvoiceDetail).then((res) => {
      setLoading(false);
      window.open(res?.data?.data?.path, "_blank");
    });
  };

  const printInvoice = (Order_Id) => {
    // window.open(
    //   imageUrl +
    //     "/generateInvoice?store_id=" +
    //     storeEntityIds.mini_program_id +
    //     "&user_id=" +
    //     loginDatas.member_id +
    //     "&order_id=" +
    //     Order_Id +
    //     "&origin=" +
    //     storeEntityIds.cmp_origin,
    //   "_blank"
    // );
    setLoading(true);
    const getInvoiceDetail = {
      a: "SalesOrderCommonViewPDF",
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      so_unique_id: orderDataList[0]["main_so_unique_id"],
      SITDeveloper: "1",
    };
    commanService.postApi("/InvoiceMaster", getInvoiceDetail).then((res) => {
      setLoading(false);
      window.open(res?.data?.data?.path, "_blank");
    });
  };

  const handleSetStateChange = (value) => {
    setEmbossingPreviewModalBaseView(value);
    setSelectedIndex(0);
  };

  const reviewModal = (data, id) => {
    let dataproduct = data;
    setItemNumber(dataproduct.item_number);
    setVariantNumber(dataproduct.variant_number);
    setAddReview(true);
    setOrderID(data.so_order_id);
    setReviewDetail("");
    setImgFile([]);
    setRating(0);
    setHeadLine("");
    setVideoFile("");
    setVideoPreview("");
    setImgPreview([]);
  };

  const uploadVideo = (event) => {
    if (event.target.files[0].size / 1024 / 1024 < 20) {
      setVideoFile(event.target.files[0]);
      setVideoPreview(URL.createObjectURL(event.target.files[0]));
    } else {
      toast.error("File size maximum 20 mb limit.");
    }
  };
  const uploadeMultiplePhoto = (event) => {
    let imgArr = [...imgfile];
    let previewArr = [...imgPreview];
    let file = event.target.files;

    const AllImgfile = [...file];
    if (AllImgfile.length <= 10) {
      AllImgfile.map((ImgFile, i) => {
        let checkExt = ImgFile.name.split(".").pop().toLowerCase();
        let CheckSize = ImgFile.size / 1024 / 1024 < 0.5;
        if (
          checkExt === "jpeg" ||
          checkExt === "jpg" ||
          checkExt === "png" ||
          checkExt === "webp"
        ) {
          if (CheckSize !== false) {
            imgArr.push(ImgFile);
            previewArr.push(URL.createObjectURL(ImgFile));
            setImgFile(imgArr);
            setImgPreview(previewArr);
          } else {
            toast.error("Upload Photo 500kb size are allowed.");
          }
        } else {
          toast.error("Only png,webp,jpg and jpeg files are allowed.");
        }
      });
    } else {
      toast.error("Upload maximum 10 Photos.");
    }
  };
  const removePhoto = (index) => {
    let imgArr = [...imgfile];
    let previewArr = [...imgPreview];

    imgArr = imgArr.filter((_, i) => i !== index);
    previewArr = previewArr.filter((_, i) => i !== index);

    setImgFile(imgArr);
    setImgPreview(previewArr);
  };

  const submitReview = async () => {
    const obj = new FormData();
    obj.append("rating", rating);
    obj.append("headline", headline);
    obj.append("review_details", reviewDetail);
    obj.append("order_id", orderId);
    obj.append("variant_id", variantNumber);
    obj.append("item_id", itemNumber);
    obj.append("store_id", storeEntityIds.mini_program_id);
    obj.append("user_id", isLogin ? loginDatas.member_id : RandomId);
    obj.append("unique_id", "");
    obj.append("type", "B2C");
    obj.append("entity_id", storeEntityIds.entity_id);
    obj.append("tenant_id", storeEntityIds.tenant_id);
    obj.append("SITDeveloper", "1");
    const obj2 = new FormData();
    if (imgfile.length === 0) {
      obj2.append("image[]", "");
    } else {
      for (let index = 0; index < imgfile.length; index++) {
        obj2.append("image[]", imgfile[index]);
      }
    }
    if (videoFile === "") {
      obj2.append("video", "");
    } else {
      obj2.append("video", videoFile);
    }
    obj2.append("json", commanService.obj_json(obj, "AddUpdateReview"));
    if (rating === 0) {
      toast.error("Select Overall rating.");
    } else if (headline === "") {
      toast.error("please Enter Title");
    } else if (reviewDetail === "") {
      toast.error("Please Enter Comment");
    } else if (imgfile.length === 0) {
      toast.error("Upload Minimum One Photo.");
    } else if (imgfile.length > 10) {
      toast.error("Maximum 10 photo upload.");
    } else {
      setLoading(true);
      await commanService
        .postLaravelApi("/ReviewController", obj2)
        .then((res) => {
          if (res.data.success === 1) {
            setLoading(false);
            setAddReview(false);
            toast.success(res.data.message);
          } else {
            setLoading(false);
            setAddReview(false);
            toast.error(res.data.message);
          }
        });
    }
  };

  //Navigate url
  const navigateURL = (item, value) => {
    if (
      item?.vertical_code !== "DIAMO" &&
      item?.vertical_code !== "LGDIA" &&
      item?.vertical_code !== "GEDIA"
    ) {
      const verticalCode = item?.vertical_code;
      const title = changeUrl(item?.product_name + "-" + item.pv_unique_id);
      var megaMenu = JSON.parse(
        sessionStorage.getItem("megaMenus")
      ).navigation_data?.filter(
        (elm) => elm.product_vertical_name === verticalCode
      )[0];
      router.push(`/products/${changeUrl(megaMenu?.menu_name)}/${title}`);
    }
  };

  // original price without offer
  const calculatePrice = (orderDetails) => {
    let storeBasePrice = parseFloat(orderDetails?.line_price) || 0;
    let customDuty = 0;
    let tax = 0;
    let price = 0;
    let totalService =
      isEmpty(orderDetails?.service_json) !== ""
        ? safeParse(orderDetails?.service_json).reduce(
          (accumulator, product) => {
            return (
              accumulator +
              (product.is_selected === "1"
                ? extractNumber(product?.price)
                : 0)
            );
          },
          0
        )
        : 0;

    let customPer = extractNumber(orderDetails?.custom_per) || 0;
    let taxPer = extractNumber(orderDetails?.tax1) || 0;

    customDuty =
      parseFloat(
        (((storeBasePrice + totalService) * customPer) / 100).toFixed(2)
      ) || 0;
    tax =
      parseFloat(
        (((storeBasePrice + totalService + customDuty) * taxPer) / 100).toFixed(
          2
        )
      ) || 0;

    price = storeBasePrice + totalService + customDuty + tax;

    return numberWithCommas(
      (price * extractNumber(orderDetails?.quantity)).toFixed(2)
    );
  };

  const handleOrderSalesReturn = () => {
    const params = new URLSearchParams({
      orderId: orderIds,
      invoice_id: checkInvoice.invo_voucher_no,
      invoice_unique_id: checkInvoice.invo_unique_id,
      invoice_security_id: checkInvoice.invo_invoice_security_id,
    }).toString();
    window.open(`/account_sales_return?${params}`, "_blank");
  };
  return (
    <div className="col-lg-9">
      <div className="page-content my-account__orders-list">
        <div className="pt-0">
          {loading && <Loader />}
          <div className="order-complete d-flex justify-content-end mt-0">
            <div className="d-flex justify-content-end gap-3">
              <button
                className="anchor-btnLink"
                onClick={() => printInvoice(orderIds)}
              >
                <svg width="16" height="16" aria-hidden="true">
                  <use xlinkHref="#icon_performa_invoice" />
                </svg>
                Proforma Invoice
              </button>
              {Object.keys(checkInvoice)?.length > 1 ? (
                <button
                  className="anchor-btnLink"
                  onClick={() => printOrderInvoice()}
                >
                  <svg width="16" height="16" aria-hidden="true">
                    <use xlinkHref="#icon_print_invoice" />
                  </svg>
                  Invoice
                </button>
              ) : (
                ""
              )}
              {isEmpty(checkInvoice?.btn_sales_return) != "0" && <button
                className="anchor-btnLink text-capitalize"
                onClick={handleOrderSalesReturn}
              >
                <svg width="16" height="16" aria-hidden="true">
                  <use xlinkHref="#icon_return_invoice" />
                </svg>
                Return
              </button>}
              <button
                className="anchor-btnLink back text-capitalize"
                onClick={handleBack}
              >
                <i className="ic_long_arrow_left pe-1"></i>
                Back
              </button>
            </div>
          </div>
          <div className="order-complete mt-2">
            <div className="order-info">
              <div className="order-info__item">
                <label>Order Number</label>
                <span>{orderDetailsData.order_id}</span>
              </div>
              {orderDataList?.length > 0 &&
                orderDataList.map((shippi, isp) => {
                  let dates = new Date(
                    shippi?.data?.[0]?.so_sales_date ??
                    shippi?.data?.[0]?.[0]?.so_sales_date
                  );
                  let newDate = new Date(dates).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });
                  return (
                    <div className="order-info__item" key={isp}>
                      <label>Date</label>
                      <span>{newDate}</span>
                    </div>
                  );
                })}
              {/* <div className="order-info__item">
                <label>Date</label>
                <span>
                  {new Date(
                    orderDetail.data?.[0]?.so_sales_date
                  ).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div> */}
              <div className="order-info__item">
                <label>Sub Total</label>

                <span>
                  {orderDetailsData.base_currency}&nbsp;{" "}
                  {numberWithCommas(
                    Number(orderDetailsData.total_net_amount).toFixed(2)
                  )}
                </span>
              </div>
              <div className="order-info__item">
                <label>Payment Method</label>
                <span>{paymentMethod.payment_name}</span>
              </div>
            </div>
            <div className="checkout__totals-wrapper">
              <div className="checkout__totals mb-0">
                <h3>Order Details</h3>

                <div className="d-flex flex-column flex-wrap gap-2">
                  {!orderDataList?.[0]?.data[0]?.length ? (
                    orderDataList?.[0]?.data?.map((elm, i) => {
                      return (
                        <div
                          key={i}
                          className={`order-details-row gap-2 py-2 ${orderDataList[0]?.data.length - 1 !== i
                            ? "border-bottom"
                            : ""
                            }`}
                        >
                          <div className="order-details-img">
                            <img
                              loading="lazy"
                              src={elm?.photo}
                              width="120"
                              alt={elm.product_name}
                            />
                          </div>
                          <div className="order-details-info">
                            <div className="shopping-cart__product-item__detail">
                              <h4
                                className="shopping-title cursor-pointer"
                                onClick={() => navigateURL(elm)}
                              >
                                {elm.product_name}
                              </h4>
                              <div className="shopping-sky">
                                {jewelVertical(elm?.vertical_code) === true
                                  ? `SKU: ${elm?.product_sku}`
                                  : `Certificate No.: ${elm?.cert_lab} ${elm?.cert_no}`}
                              </div>
                              <ul className="shopping-cart__product-item__options">
                                <li className="d-flex flex-wrap gap-2">
                                  {isEmpty(elm?.metal_type) != "" ? (
                                    <div className="d-flex flex-column">
                                      <h4>Metal Type</h4>{" "}
                                      <span className="text-muted">
                                        {elm?.metal_type}
                                      </span>{" "}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {isEmpty(elm?.gold_wt) != "" &&
                                    extractNumber(elm?.gold_wt) > 0 ? (
                                    <div className="d-flex flex-column ">
                                      <h4 className="">Gold Weight</h4>{" "}
                                      <span className="text-muted">
                                        {extractNumber(elm?.gold_wt)} {elm?.gold_wt_unit}
                                      </span>{" "}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {isEmpty(elm?.dia_wt) != "" &&
                                    extractNumber(elm?.dia_wt) > 0 ? (
                                    <div className="d-flex flex-column ">
                                      <h4 className="">Diamond Weight</h4>{" "}
                                      <span className="text-muted">
                                        {extractNumber(elm?.dia_wt)} {elm?.dia_first_unit}
                                      </span>{" "}
                                    </div>
                                  ) : (
                                    ""
                                  )}

                                  {isEmpty(elm?.col_wt) != "" &&
                                    extractNumber(elm?.col_wt) > 0 ? (
                                    <div className="d-flex flex-column ">
                                      <h4 className="">Gemstone Weight</h4>{" "}
                                      <span className="text-muted">
                                        {extractNumber(elm?.col_wt)} {elm?.col_first_unit}
                                      </span>{" "}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  <div className="d-flex flex-column ">
                                    <h4 className="">Rate</h4>{" "}
                                    <span className="text-muted">
                                      {numberWithCommas(elm?.line_price)}
                                    </span>{" "}
                                  </div>
                                  {isEmpty(elm?.offer_code) != "" ? (
                                    <div className="d-flex flex-column ">
                                      <h4 className="">Offer</h4>{" "}
                                      <span className="text-muted">
                                        {elm?.offer_code}
                                      </span>{" "}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {extractNumber(elm?.custom_amt) > 0 ? (
                                    <div className="d-flex flex-column ">
                                      <h4 className="">Custom Charge</h4>{" "}
                                      <span className="text-muted">
                                        {elm?.custom_amt} ({elm?.custom_per} %)
                                      </span>{" "}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {extractNumber(elm?.tax1_amt) > 0 ? (
                                    <div className="d-flex flex-column ">
                                      <h4 className="">Tax Value</h4>{" "}
                                      <span className="text-muted">
                                        {extractNumber(elm?.tax1_amt).toFixed(2)}
                                      </span>{" "}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </li>
                                {safeParse(elm?.service_json) !== null ? (
                                  <li className="orders-engraving">
                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                      {safeParse(elm?.service_json)?.length >
                                        0 &&
                                        safeParse(elm?.service_json)?.map(
                                          (service, i) => {
                                            return (
                                              <React.Fragment key={i}>
                                                {service.service_code ===
                                                  "ENGRAVING" &&
                                                  service.service_type ===
                                                  "Special" &&
                                                  isEmpty(service?.text) !== "" &&
                                                  isEmpty(service?.text) !==
                                                  null ? (
                                                  <div className="off_engraving">
                                                    <div className="is_Engraving">
                                                      <Link
                                                        className="engraving"
                                                        href="#"
                                                      >
                                                        Engraving Text :{" "}
                                                        <span
                                                          style={
                                                            service?.type ===
                                                              "italic"
                                                              ? {
                                                                fontStyle:
                                                                  "italic",
                                                              }
                                                              : {
                                                                fontStyle:
                                                                  "normal",
                                                              }
                                                          }
                                                        >
                                                          {service?.text}
                                                        </span>
                                                      </Link>
                                                    </div>
                                                  </div>
                                                ) : null}
                                                {service.service_code ===
                                                  "EMBOSSING" &&
                                                  service.service_type ===
                                                  "Special" &&
                                                  service.image !== "" ? (
                                                  <div className="off_engraving">
                                                    <div className="is_Engraving">
                                                      <Link
                                                        className="engraving"
                                                        href="#"
                                                      >
                                                        Embossing :{" "}
                                                        {service.image?.map(
                                                          (item, k) => {
                                                            if (k > 0) {
                                                              return;
                                                            }
                                                            return (
                                                              <span
                                                                className="ms-1 text-underline image_previews"
                                                                data-toggle="modal"
                                                                data-target="#embossingPreview"
                                                                role="button"
                                                                key={k}
                                                                onClick={() => {
                                                                  setEmbossingPreviewModalBaseView(
                                                                    true
                                                                  );
                                                                  setActiveImg(
                                                                    service.image.filter(
                                                                      (item) =>
                                                                        item.embImage !==
                                                                        ""
                                                                    )
                                                                  );
                                                                }}
                                                              >
                                                                <img
                                                                  className=""
                                                                  src={
                                                                    item?.embImage
                                                                  }
                                                                />
                                                              </span>
                                                            );
                                                          }
                                                        )}
                                                      </Link>
                                                    </div>
                                                  </div>
                                                ) : (
                                                  ""
                                                )}
                                                {service.service_type ===
                                                  "Normal" &&
                                                  service.is_selected ===
                                                  "1" && (
                                                    <div
                                                      className="form-check mb-0"
                                                      key={service.service_code}
                                                    >
                                                      <input
                                                        className="form-check-input form-check-input_fill"
                                                        type="checkbox"
                                                        checked={
                                                          service.is_selected ===
                                                          "1"
                                                        }
                                                        readOnly
                                                        aria-label="service"
                                                      />

                                                      <label
                                                        className="form-check-label"
                                                        htmlFor={`service_${service.service_code}`}
                                                      >
                                                        {service.service_name}
                                                      </label>
                                                      {service.price ? (
                                                        <span className="fw-semibold">
                                                          {"(" +
                                                            extractNumber(
                                                              service.price
                                                            ).toFixed(2) +
                                                            " " +
                                                            service.currency +
                                                            ")"}
                                                        </span>
                                                      ) : (
                                                        ""
                                                      )}
                                                    </div>
                                                  )}
                                              </React.Fragment>
                                            );
                                          }
                                        )}
                                    </div>
                                  </li>
                                ) : (
                                  ""
                                )}
                              </ul>
                            </div>
                          </div>

                          <div className="order-details-right">
                            {elm?.length == undefined &&
                              elm?.vertical_code !== "LGDIA" &&
                              elm?.vertical_code !== "DIAMO" &&
                              elm?.vertical_code !== "GEMST" &&
                              elm?.vertical_code !== "LDIAM" ? (
                              <React.Fragment key={i}>
                                {Object.keys(elm.review).length > 0 ? (
                                  ""
                                ) : isEmpty(elm.str_document_status) ===
                                  "Completed" ? (
                                  <div className="GiveReview text-end">
                                    <span
                                      className="btn-link default-underline"
                                      onClick={() => reviewModal(elm, 0)}
                                      data-toggle="modal"
                                      data-target="#addReviewModal"
                                    >
                                      Give Review
                                    </span>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </React.Fragment>
                            ) : (
                              ""
                            )}
                            <div className="text-end">
                              <span className="shopping-cart__product-price">
                                Qty: {parseInt(elm?.quantity)}
                              </span>
                            </div>

                            <div className="text-nowrap">
                              <span className="shopping-cart__subtotal">
                                {orderDetailsData.currency}{" "}
                                {numberWithCommas(
                                  extractNumber(
                                    elm?.display_net_amount.toString()
                                  ).toFixed(2)
                                )}
                              </span>
                              {isEmpty(elm?.offer_code) !== "" && (
                                <span className="ms-1 text-muted text-decoration-line-through">
                                  {orderDetailsData.currency}{" "}
                                  {/* {numberWithCommas(
                                    (
                                      (extractNumber(elm?.display_line_price)) *
                                      elm?.quantity
                                    ).toFixed(2)
                                  )} */}
                                  {calculatePrice(elm)}
                                </span>
                              )}
                              {/* {isEmpty(elm?.offer_code) !== "" &&
                          isEmpty(elm?.offer_code) !== null ? (
                            <div className="d-flex justify-content-end">
                              <span className="text_success">
                                You saved {storeCurrencys}{" "}
                                {numberWithCommas(
                                    (
                                      (extractNumber(elm?.offer_discount_price) *
                                      elm?.quantity)
                                    ).toFixed(2)
                                  )}
                              </span>
                            </div>
                          ) : null} */}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className={`order-details-row`}>
                      <div className="order-diy-row order-details-info">
                        {orderDataList[0]?.data?.[0]
                          .sort((a, b) => {
                            if (
                              a?.vertical_code === "JEWEL" &&
                              b?.vertical_code !== "JEWEL"
                            )
                              return -1;
                            if (
                              a?.vertical_code !== "JEWEL" &&
                              b?.vertical_code === "JEWEL"
                            )
                              return 1;
                            return 0;
                          })
                          .map((elm, i) => {
                            return (
                              <div
                                key={i}
                                className={`d-flex gap-2 flex-wrap justify-content-between py-2 ${orderDataList[0]?.data?.[0]?.length - 1 !== i
                                  ? "border-bottom"
                                  : ""
                                  }`}
                              >
                                <div className="order-details-row gap-2">
                                  <div className="order-details-img">
                                    <img
                                      loading="lazy"
                                      src={elm?.photo}
                                      width="120"
                                      alt={elm.product_name}
                                    />
                                  </div>

                                  <div className="order-details-info">
                                    <div className="shopping-cart__product-item__detail">
                                      {isEmpty(elm.stone_position) !== "" ? (
                                        <h4 className="mb-2 shopping-title ">
                                          {elm.stone_position}
                                        </h4>
                                      ) : (
                                        ""
                                      )}
                                      <h4
                                        className="cursor-pointer shopping-title "
                                        onClick={() => navigateURL(elm)}
                                      >
                                        {elm.product_name}
                                      </h4>
                                      {elm?.vertical_code === "LGDIA" ||
                                        elm?.vertical_code === "GEDIA" ||
                                        elm?.vertical_code === "DIAMO" ? (
                                        <ul className="shopping-cart__product-item__options">
                                          <li>
                                            Certificate : {elm?.cert_lab}{" "}
                                            {elm?.cert_no}
                                          </li>
                                          <div className="d-flex flex-column ">
                                            <h4 className="">Rate</h4>{" "}
                                            <span className="text-muted">
                                              {numberWithCommas(
                                                elm?.net_amount
                                              )}
                                            </span>{" "}
                                          </div>
                                        </ul>
                                      ) : (
                                        <ul className="shopping-cart__product-item__options">
                                          <li>SKU: {elm?.product_sku}</li>
                                          <li className="d-flex flex-wrap gap-2">
                                            {isEmpty(elm?.metal_type) !== "" ? (
                                              <div className="d-flex flex-column">
                                                <h4>Metal Type</h4>{" "}
                                                <span className="text-muted">
                                                  {elm?.metal_type}
                                                </span>{" "}
                                              </div>
                                            ) : (
                                              ""
                                            )}
                                            {isEmpty(elm?.gold_wt) !== "" &&
                                              extractNumber(elm?.gold_wt) > 0 ? (
                                              <div className="d-flex flex-column ">
                                                <h4 className="">
                                                  Gold Weight
                                                </h4>{" "}
                                                <span className="text-muted">
                                                  {extractNumber(elm?.gold_wt)}{" "}
                                                  {elm?.gold_wt_unit}
                                                </span>{" "}
                                              </div>
                                            ) : (
                                              ""
                                            )}
                                            {isEmpty(elm?.dia_wt) !== "" &&
                                              extractNumber(elm?.dia_wt) > 0 ? (
                                              <div className="d-flex flex-column ">
                                                <h4 className="">
                                                  Diamond Weight
                                                </h4>{" "}
                                                <span className="text-muted">
                                                  {extractNumber(elm?.dia_wt)}{" "}
                                                  {elm?.dia_first_unit}
                                                </span>{" "}
                                              </div>
                                            ) : (
                                              ""
                                            )}
                                            {isEmpty(elm?.col_wt) !== "" &&
                                              extractNumber(elm?.col_wt) > 0 ? (
                                              <div className="d-flex flex-column ">
                                                <h4 className="">
                                                  Gemstone Weight
                                                </h4>{" "}
                                                <span className="text-muted">
                                                  {extractNumber(elm?.col_wt)}{" "}
                                                  {elm?.col_first_unit}
                                                </span>{" "}
                                              </div>
                                            ) : (
                                              ""
                                            )}
                                            <div className="d-flex flex-column ">
                                              <h4 className="">Rate</h4>{" "}
                                              <span className="text-muted">
                                                {numberWithCommas(
                                                  elm?.net_amount
                                                )}
                                              </span>{" "}
                                            </div>
                                            {isEmpty(elm?.offer_code) != "" ? (
                                              <div className="d-flex flex-column ">
                                                <h4 className="">Offer</h4>{" "}
                                                <span className="text-muted">
                                                  {elm?.offer_code}
                                                </span>{" "}
                                              </div>
                                            ) : (
                                              ""
                                            )}
                                            {elm?.custom_amt > 0 ? (
                                              <div className="d-flex flex-column ">
                                                <h4 className="">
                                                  Custom Charge
                                                </h4>{" "}
                                                <span className="text-muted">
                                                  {elm?.custom_amt} (
                                                  {elm?.custom_per} %)
                                                </span>{" "}
                                              </div>
                                            ) : (
                                              ""
                                            )}
                                            {extractNumber(elm?.tax1_amt) > 0 ? (
                                              <div className="d-flex flex-column ">
                                                <h4 className="">Tax Value</h4>{" "}
                                                <span className="text-muted">
                                                  {extractNumber(elm?.tax1_amt).toFixed(2)}
                                                </span>{" "}
                                              </div>
                                            ) : (
                                              ""
                                            )}
                                          </li>
                                          {safeParse(elm?.service_json) !==
                                            null ? (
                                            <li>
                                              <div className="d-flex flex-wrap gap-2 mt-2">
                                                {safeParse(elm?.service_json)
                                                  ?.length > 0 &&
                                                  safeParse(
                                                    elm?.service_json
                                                  )?.map((service, i) => {
                                                    return (
                                                      <React.Fragment key={i}>
                                                        {service.service_code ===
                                                          "ENGRAVING" &&
                                                          service.service_type ===
                                                          "Special" &&
                                                          isEmpty(
                                                            service?.text
                                                          ) !== "" &&
                                                          isEmpty(
                                                            service?.text
                                                          ) !== null ? (
                                                          <div className="off_engraving">
                                                            <div className="is_Engraving">
                                                              <Link
                                                                className="engraving"
                                                                href="#"
                                                              >
                                                                Engraving Text :{" "}
                                                                <span
                                                                  style={
                                                                    service?.type ===
                                                                      "italic"
                                                                      ? {
                                                                        fontStyle:
                                                                          "italic",
                                                                      }
                                                                      : {
                                                                        fontStyle:
                                                                          "normal",
                                                                      }
                                                                  }
                                                                >
                                                                  {
                                                                    service?.text
                                                                  }
                                                                </span>
                                                              </Link>
                                                            </div>
                                                          </div>
                                                        ) : null}
                                                        {service.service_code ===
                                                          "EMBOSSING" &&
                                                          service.service_type ===
                                                          "Special" &&
                                                          service.image !== "" ? (
                                                          <div className="off_engraving">
                                                            <div className="is_Engraving">
                                                              <Link
                                                                className="engraving"
                                                                href="#"
                                                              >
                                                                Embossing :{" "}
                                                                {service.image?.map(
                                                                  (item, k) => {
                                                                    if (k > 0) {
                                                                      return;
                                                                    }
                                                                    return (
                                                                      <span
                                                                        className="ms-1 text-underline image_previews"
                                                                        data-toggle="modal"
                                                                        data-target="#embossingPreview"
                                                                        role="button"
                                                                        key={k}
                                                                        onClick={() => {
                                                                          setEmbossingPreviewModalBaseView(
                                                                            true
                                                                          );
                                                                          setActiveImg(
                                                                            service.image.filter(
                                                                              (
                                                                                item
                                                                              ) =>
                                                                                item.embImage !==
                                                                                ""
                                                                            )
                                                                          );
                                                                        }}
                                                                      >
                                                                        <img
                                                                          className=""
                                                                          src={
                                                                            item?.embImage
                                                                          }
                                                                        />
                                                                      </span>
                                                                    );
                                                                  }
                                                                )}
                                                              </Link>
                                                            </div>
                                                          </div>
                                                        ) : (
                                                          ""
                                                        )}
                                                        {service.service_type ===
                                                          "Normal" &&
                                                          service.is_selected ===
                                                          "1" && (
                                                            <div
                                                              className="form-check mb-0"
                                                              key={
                                                                service.service_code
                                                              }
                                                            >
                                                              <input
                                                                className="form-check-input form-check-input_fill"
                                                                type="checkbox"
                                                                checked={
                                                                  service.is_selected ===
                                                                  "1"
                                                                }
                                                                readOnly
                                                                aria-label="service"
                                                              />
                                                              <label
                                                                className="form-check-label"
                                                                htmlFor={`service_${service.service_code}`}
                                                              >
                                                                {
                                                                  service.service_name
                                                                }
                                                              </label>
                                                              {service.price ? (
                                                                <span className="fw-semibold">
                                                                  {"(" +
                                                                    extractNumber(
                                                                      service.price
                                                                    ).toFixed(
                                                                      2
                                                                    ) +
                                                                    " " +
                                                                    service.currency +
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
                                            </li>
                                          ) : (
                                            ""
                                          )}
                                        </ul>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex flex-column justify-content-between justify-self-end flex-wrap">
                                  {elm?.length === undefined &&
                                    elm?.vertical_code !== "LGDIA" &&
                                    elm?.vertical_code !== "DIAMO" &&
                                    elm?.vertical_code !== "GEMST" &&
                                    elm?.vertical_code !== "LDIAM" ? (
                                    <React.Fragment key={i}>
                                      {Object.keys(elm.review).length > 0 ? (
                                        ""
                                      ) : isEmpty(elm.str_document_status) ===
                                        "Completed" ? (
                                        <div className="GiveReview text-end">
                                          <span
                                            className="btn-link default-underline"
                                            onClick={() => reviewModal(elm, 0)}
                                            data-toggle="modal"
                                            data-target="#addReviewModal"
                                          >
                                            Give Review
                                          </span>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </React.Fragment>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                      <div className="order-details-right">
                        <div className="text-end">
                          <div className="shopping-cart__product-price">
                            Qty : 1
                          </div>
                        </div>
                        <div className="shopping-cart__subtotal">
                          {orderDetailsData.currency}{" "}
                          {numberWithCommas(
                            extractNumber(orderDetailsData?.net_amount.toString()).toFixed(2)
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="checkout__totals-wrapper">
              <div className="checkout__totals mb-0">
                <h3>Payment & Shipping Infomations</h3>
                <div className="row">
                  <div className="col-12 d-flex flex-column flex-wrap gap-2">
                    <div className="d-flex justify-content-between flex-wrap gap-3">
                      <div className="shipping-information">
                        <h6 className="fs-16px mb-2">Payment Method</h6>
                        {paymentMethod.payment_name !== "" || undefined ? (
                          <span className="">{paymentMethod.payment_name}</span>
                        ) : (
                          <span className="">No Payment Method Found</span>
                        )}
                      </div>
                      <div className="shipping-information">
                        {isEmpty(paymentMethod.payment_transaction_id) !==
                          "" ? (
                          <div>
                            <h6 className="fs-16px mb-2">Transaction ID</h6>{" "}
                            <div className="">
                              &nbsp;{paymentMethod.payment_transaction_id}
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="shipping-information">
                        <h6 className="fs-16px mb-2">Billing Address</h6>
                        {billindAddress.address !== "" || undefined ? (
                          <>
                            <span className="">{billindAddress.name}</span>
                            <br />
                            <span className="">
                              {isEmpty(billindAddress.building) != "" ? (
                                <>{billindAddress.building},</>
                              ) : (
                                ""
                              )}{" "}
                              {isEmpty(billindAddress.building_name) != "" ? (
                                <>{billindAddress.building_name},</>
                              ) : (
                                ""
                              )}
                            </span>
                            <br />
                            <span className="">{billindAddress.street},</span>
                            <br />
                            <span className="">{billindAddress.address}.</span>
                            <br />
                            <span className="">
                              Contact No. {billindAddress.contact}.
                            </span>
                          </>
                        ) : (
                          <span className="">No Address Found</span>
                        )}
                      </div>
                      <div className="shipping-information">
                        <h6 className="fs-16px mb-2">Shipping Address</h6>
                        {shippingAddress.address !== "" || undefined ? (
                          <>
                            <span className="">{shippingAddress.name}</span>
                            <br />
                            <span className="">
                              {isEmpty(shippingAddress.building) != "" ? (
                                <>{shippingAddress.building},</>
                              ) : (
                                ""
                              )}{" "}
                              {isEmpty(shippingAddress.building_name) != "" ? (
                                <>{shippingAddress.building_name},</>
                              ) : (
                                ""
                              )}
                            </span>
                            <br />
                            <span className="">{shippingAddress.street},</span>
                            <br />
                            <span className="">{shippingAddress.address}.</span>
                            <br />
                            <span className="">
                              Contact No. {shippingAddress.contact}.
                            </span>
                            <br />
                          </>
                        ) : (
                          <span className="">No Address Found</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="checkout__totals-wrapper">
              <div className="checkout__totals mb-0">
                <h3>Order Summary</h3>
                <table className="checkout-cart-items">
                  <thead>
                    <tr>
                      <th>PRODUCT</th>
                      <th>SUBTOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!orderDataList?.[0]?.data?.[0]?.length
                      ? orderDataList?.[0]?.data?.length > 0 &&
                      orderDataList?.[0]?.data?.map((o, i) => {
                        return (
                          <tr key={i}>
                            <td>
                              {o?.product_name} x {parseInt(o?.quantity)}
                            </td>
                            <td>
                              {orderDataList[0]?.currency}{" "}
                              {isEmpty(o?.display_net_amount)}
                            </td>
                          </tr>
                        );
                      })
                      : orderDataList?.[0]?.data?.[0]?.length > 0 &&
                      orderDataList?.[0]?.data?.[0]?.map((o, i) => {
                        return (
                          <tr key={i}>
                            <td>
                              {o?.product_name} x {parseInt(o?.quantity)}
                            </td>
                            <td>
                              {orderDataList[0]?.currency}{" "}
                              {isEmpty(o?.display_net_amount)}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                <table className="checkout-totals">
                  <tbody>
                    <tr>
                      <th>SUBTOTAL</th>
                      <td>
                        {orderDetailsData?.base_currency}&nbsp;
                        {numberWithCommas(
                          Number(orderDetailsData?.net_amount).toFixed(2)
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>TAX AMOUNT</th>
                      <td>
                        {orderDetailsData?.base_currency}&nbsp;
                        {numberWithCommas(
                          Number(orderDetailsData.tax_amount).toFixed(2)
                        )}
                      </td>
                    </tr>
                    {
                      orderDetailsData.total_discount > 0 && (
                        <tr>
                          <th>
                            {`DISCOUNT ${isEmpty(orderDetailsData.coupon_code) != ""
                              ? `(Coupon Code: ${orderDetailsData.coupon_code})`
                              : ""
                              }`}
                          </th>
                          <td>
                            {orderDetailsData?.base_currency}&nbsp; -
                            {numberWithCommas(
                              Number(orderDetailsData.total_discount).toFixed(2)
                            )}
                          </td>
                        </tr>
                      )
                    }
                    {orderDetailsData.csr_donation_amount > 0 && (
                      <tr>
                        <th>CHARITY AMOUNT</th>
                        <td>
                          {orderDetailsData?.base_currency}&nbsp;
                          {numberWithCommas(
                            Number(orderDetailsData.csr_donation_amount).toFixed(
                              2
                            )
                          )}
                        </td>
                      </tr>
                    )}
                    {orderDetailsData.Round_off_flag === true && (
                      <tr>
                        <th>ROUNDED OFF</th>
                        <td>
                          {orderDetailsData?.base_currency}&nbsp;
                          {numberWithCommas(
                            Number(orderDetailsData.Round_off).toFixed(
                              2
                            )
                          )}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <th>FINAL TOTAL</th>
                      <td>
                        {orderDetailsData?.base_currency}&nbsp;
                        {numberWithCommas(
                          Number(orderDetailsData.total_net_amount).toFixed(2)
                        )}
                      </td>
                    </tr>
                    {orderDetailsData?.base_currency !==
                      orderDetailsData?.currency ? (
                      <>
                        <tr>
                          <th>EXCHANGE RATE</th>
                          <td>
                            1 {orderDetailsData?.base_currency}&nbsp;=&nbsp;
                            {orderDetailsData?.exchange_rate}{" "}
                            {orderDetailsData?.currency}
                          </td>
                        </tr>
                        <tr>
                          <th>EXCHANGE RATE AMOUNT</th>
                          <td>
                            {orderDetailsData?.currency}&nbsp;
                            {numberWithCommas(
                              Number(orderDetailsData?.convert_amt).toFixed(2)
                            )}
                          </td>
                        </tr>
                      </>
                    ) : (
                      ""
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="checkout__totals-wrapper">
              <div className="checkout__totals mb-0">
                <h3>Order Tracking</h3>
                <div className="order-detail-payment-shipping">
                  <div className="timeline">
                    <ol className="timeline__list">
                      {orderHistoryDataList.length > 0 &&
                        orderHistoryDataList.map((shippi, isp) => {
                          let dates = new Date(shippi.status_date);
                          let newDate = new Date(dates).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          );
                          return (
                            <React.Fragment key={isp}>
                              <li
                                className={`timeline_todo ${isEmpty(shippi.status_date) !== ""
                                  ? "active"
                                  : ""
                                  }`}
                              >
                                <div className="icon_tick">
                                  <svg
                                    width="15"
                                    height="15"
                                    aria-hidden="true"
                                  >
                                    <use xlinkHref="#icon_check"></use>
                                  </svg>
                                </div>
                                <div className="timeline__timestamp">
                                  <div
                                    className="timeline_title"
                                    title={shippi.status_desc}
                                  >
                                    {shippi.status_desc}
                                  </div>
                                  {isEmpty(shippi.status_date) !== "" ? (
                                    <React.Fragment>
                                      <span className="timeline_date">
                                        {newDate}
                                      </span>
                                    </React.Fragment>
                                  ) : (
                                    <span className="timeline_date">
                                      &nbsp;
                                    </span>
                                  )}
                                </div>
                              </li>
                            </React.Fragment>
                          );
                        })}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {addReview && (
            <div
              className="modal fade "
              id="addReviewModal"
              tabIndex="-1"
              aria-hidden="true"
              data-bs-backdrop="static"
            >
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Give Review</h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => {
                        setAddReview(false);
                      }}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="review_popup_body">
                      <div className="review-profile">
                        <div className="profile_name">
                          <div className="profile_img">
                            <i className="ic_my_account"></i>
                          </div>
                          <div className="profile_text">
                            <h4 className="UesrName mb-0">
                              {loginDatas.first_name} &nbsp;
                              {loginDatas.last_name}
                            </h4>
                            <p className="fw-14 mb-0">{loginDatas.email}</p>
                          </div>
                        </div>
                        <div className="d-flex mb-15px">
                          <div className="star-review star-size">
                            <label className="title">
                              Please rate us 1 (bad) to 5 (excellent): *
                            </label>
                            <Rating
                              value={rating}
                              onClick={(e) => setRating(e)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="title">Enter Title *</label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(e) => setHeadLine(e.target.value)}
                          placeholder="Enter Title"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="title">Enter Comment *</label>
                        <textarea
                          className="form-control"
                          placeholder="Leave a comment here"
                          cstyle={{ height: "145px" }}
                          onChange={(e) => setReviewDetail(e.target.value)}
                        ></textarea>
                      </div>
                      <div className="FileUpload_min">
                        <div className="review-img position-relative">
                          <div className="FileUpload_conn">
                            <label className="title">Upload Images *</label>
                            {imgPreview.length === 0 ? (
                              <div className="FileUpload_box">
                                <input
                                  type="file"
                                  id="FileUpload"
                                  className="w-25 h-25 mt-3"
                                  multiple
                                  onChange={(e) => uploadeMultiplePhoto(e)}
                                />
                                <label htmlFor="FileUpload" className="Addfile">
                                  <i className="ic_plus me-2"></i>
                                  <span>Add Images</span>
                                </label>
                              </div>
                            ) : (
                              <div className="FileUpload_conn-inner">
                                {imgPreview.length > 0 &&
                                  imgPreview.map((Imgurl, i) => {
                                    return (
                                      <React.Fragment key={i}>
                                        <div className="Upload_images">
                                          <img
                                            src={Imgurl}
                                            className="img-fluid "
                                            width={100}
                                            height={100}
                                            alt="Image"
                                          />
                                          <button
                                            className=""
                                            type="button"
                                            onClick={() => removePhoto(i)}
                                          >
                                            <svg
                                              width="14"
                                              height="14"
                                              aria-hidden="true"
                                            >
                                              <use xlinkHref="#icon_close" />
                                            </svg>
                                          </button>
                                        </div>
                                      </React.Fragment>
                                    );
                                  })}
                                {imgfile.length < 10 ? (
                                  <div className="Upload_images-box">
                                    <input
                                      type="file"
                                      id="FileUpload"
                                      multiple
                                      onChange={(e) => uploadeMultiplePhoto(e)}
                                    />
                                    <i className="ic_plus"></i>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            )}
                          </div>

                          <div className="VideoUpload_conn">
                            <label className="title">Upload video</label>
                            {videoPreview.length > 0 ? (
                              <div className="playvideo">
                                <button
                                  className=""
                                  type="button"
                                  onClick={() => {
                                    setVideoFile("");
                                    setVideoPreview("");
                                  }}
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    aria-hidden="true"
                                  >
                                    <use xlinkHref="#icon_close" />
                                  </svg>
                                </button>
                                <video controls>
                                  <source src={videoPreview} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            ) : (
                              <div className="VideoUpload_box">
                                <input
                                  type="file"
                                  id="VideoUpload"
                                  accept="video/*"
                                  onChange={(e) => uploadVideo(e, "video")}
                                />
                                <label
                                  htmlFor="VideoUpload"
                                  className="Addfile"
                                >
                                  <i className="ic_plus me-2"></i>
                                  <span>Add Video</span>
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="review-footer">
                    <button
                      type="button"
                      className="btn btn-primary "
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => {
                        setAddReview(false);
                      }}
                    >
                      Not Now
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={async () => {
                        await submitReview();
                      }}
                      data-bs-dismiss={
                        imgfile.length !== 0 &&
                          reviewDetail !== "" &&
                          headline !== "" &&
                          rating !== 0
                          ? "modal"
                          : ""
                      }
                      aria-label="Close"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <EmbossingPreview
            embossingPreviewModalBaseView={ebossingPreviewModalBaseView}
            setEmbossingPreviewModalBaseView={setEmbossingPreviewModalBaseView}
            setSelectedIndex={setSelectedIndex}
            handleSetStateChange={handleSetStateChange}
            selectedIndex={selectedIndex}
            setActiveImg={setActiveImg}
            activeImg={activeImg}
          />
        </div>
      </div>
    </div>
  );
}
