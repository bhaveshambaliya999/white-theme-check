import Loader from "@/CommanUIComp/Loader/Loader";
import { useRouter, useSearchParams } from "next/navigation";
import commanService from "@/CommanService/commanService";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Form, FormSelect } from "react-bootstrap";
import Select from "react-select";
import {
  extractNumber,
  isEmpty,
  jewelVertical,
  numberWithCommas,
  RandomId,
  safeParse,
} from "@/CommanFunctions/commanFunctions";
import NotFoundImg from "@/assets/images/RecordNotfound.png";
import Image from "next/image";

export default function AccountSalesReturn() {
  const isCallRef = useRef(false);
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const reduxLoginData = useSelector((state) => state.loginData);

  const loginDatas =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("loginData")) || reduxLoginData
      : reduxLoginData;
  const isLogin = Object.keys(loginDatas).length > 0;
  const reduxStoreCurrency = useSelector((state) => state.storeCurrency);
  const storeCurrencys =
    typeof window !== "undefined"
      ? sessionStorage.getItem("storeCurrency") || reduxStoreCurrency
      : reduxStoreCurrency;
  const [loader, setLoader] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderIds = searchParams.get("orderId");
  const invoiceId = searchParams.get("invoice_id");
  const invoiceUniqueId = searchParams.get("invoice_unique_id");
  const invoiceSecurityId = searchParams.get("invoice_security_id");

  const [salesReturnHeaderData, setSalesReturnHeaderData] = useState([]);
  const [salesReturnData, setSalesReturnData] = useState([]);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [commentDetail, setCommentDetail] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  console.log(selectedFiles);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [returnQty, setReturnQty] = useState(0);

  useEffect(() => {
    if (isCallRef.current) return;
    if (!invoiceId || !invoiceUniqueId || !invoiceSecurityId) return;

    isCallRef.current = true;

    const orderLocate = {
      a: "InvoiceDataReturnWithSaleOrderReturn3rdParty",
      invoice_id: invoiceId,
      invoice_unique_id: invoiceUniqueId,
      invoice_security_id: invoiceSecurityId,
      store_id: storeEntityIds?.mini_program_id,
      tenant_id: storeEntityIds?.tenant_id,
      secret_key: storeEntityIds?.secret_key,
      entity_id: storeEntityIds?.entity_id,
      SITDeveloper: "1",
    };

    setLoader(true);
    commanService
      .postApi("/SalesOrderSecond", orderLocate)
      .then((res) => {
        if (res.data.success === 1) {
          setSalesReturnHeaderData(res.data.data.headerData);
          const jewelData = res.data.data.resData?.JEWEL || [];
          const diamondData = res.data.data.resData?.DIAMOND || [];

          const combined = [...jewelData, ...diamondData];

          const mergedData = Object.values(
            combined.reduce((acc, item) => {
              const id = item.unique_id;

              if (!acc[id]) {
                acc[id] = { ...item };
              } else {
                acc[id] = {
                  ...acc[id],
                  ...Object.fromEntries(
                    Object.entries(item).filter(
                      ([key, val]) =>
                        val !== "" && val !== null && val !== undefined
                    )
                  ),
                };
              }

              return acc;
            }, {})
          );

          console.log("Final merged result:", mergedData);

          setSalesReturnData(mergedData);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        console.error("API error:", error);
      })
      .finally(() => {
        setLoader(false);
      });
  }, [invoiceId, invoiceUniqueId, invoiceSecurityId, storeEntityIds]);

  const handleBack = () => {
    console.log(orderIds);
    router.push(`/account_orders/${orderIds}`);
  };

  const changeReason = (value) => {
    setReason(value);
    if (value !== "7") setComment("");
  };

  const changeFile = (e) => {
    const files = Array.from(e.target.files || []);
    console.log(files);
    if (files.length === 0) return;

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      toast.error("Only image files are allowed!");
      return;
    }

    const existingSignatures = new Set(
      selectedFiles.map((f) => `${f.name}_${f.size}_${f.type}`)
    );
    console.log(imageFiles, "imageFiles");
    const uniqueNewFiles = imageFiles.filter(
      (file) =>
        !existingSignatures.has(`${file.name}_${file.size}_${file.type}`)
    );

    if (uniqueNewFiles.length === 0) {
      toast.warning("These files are already added!");
      return;
    }

    const availableSlots = 10 - selectedFiles.length;
    if (availableSlots <= 0) {
      toast.error("You can upload a maximum of 10 images.");
      return;
    }

    const validFiles = uniqueNewFiles.slice(0, availableSlots);

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviews]);

    e.target.value = "";
  };

  const removePhoto = (index) => {
    const updatedFiles = [...selectedFiles];
    const updatedPreviews = [...previewUrls];

    if (!updatedFiles[index].type.includes("pdf")) {
      URL.revokeObjectURL(updatedPreviews[index]);
    }

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setSelectedFiles(updatedFiles);
    setPreviewUrls(updatedPreviews);
  };

  console.log(salesReturnData, "5555555555");

  const saveSalesReturnData = async () => {
    if (!salesReturnData?.length) {
      toast.error("No items found for return.");
      return;
    }

    const jsonData = salesReturnData.map((item) => {
      const totalQty = Number(item.quantity || 0);
      const lastReminderQty =
        totalQty - Number(item.quantity_receive || totalQty);
      const newReturnQty = returnQty;

      const newReminderQty = Math.max(lastReminderQty - newReturnQty, 0);

      return {
        invoice_id: item.invoice_id,
        invoice_unique_id: invoiceUniqueId,
        invoice_security_id: invoiceSecurityId,
        invoice_quantity_receive: totalQty,
        reminder_qty: newReminderQty,
        return_quantity_receive: newReturnQty,
        unique_id: item.unique_id,
        lastReminderQty: lastReminderQty,
      };
    });
    const overReturn = jsonData.filter(
      (d) => d.return_quantity_receive > d.lastReminderQty
    );
    const zeroReturn = jsonData.filter((d) => d.return_quantity_receive <= 0);

    if (overReturn.length > 0) {
      toast.error("Return Quantity Is More Than Remainder.");
      return;
    } else if (zeroReturn.length > 0) {
      toast.error("Enter Valid Return Quantity.");
      return;
    } else if (isEmpty(reason) == "") {
      toast.error("Select Reason");
      return;
    } else if (isEmpty(comment) == "" && reason == "7") {
      toast.error("Enter Other Reason");
      return;
    } else {
      const imageFormData = new FormData();
      if (selectedFiles?.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
          imageFormData.append("images[]", selectedFiles[i]);
        }
      }
      const orderLocate = {
        a: "checkoutSalesReturnOrder3rdParty",
        order_type: "DIR",
        store_id: storeEntityIds?.mini_program_id,
        store_type: "B2C",
        consumer_id: loginDatas?.member_id,
        json_data: JSON.stringify(jsonData),
        currency: storeCurrencys,
        invoice_id: invoiceId,
        invoice_unique_id: invoiceUniqueId,
        invoice_security_id: invoiceSecurityId,
        create_by: isLogin ? loginDatas?.member_id : RandomId,
        tenant_id: storeEntityIds?.tenant_id,
        secret_key: storeEntityIds?.secret_key,
        entity_id: storeEntityIds?.entity_id,
        reason: reason.toString(),
        reason_comment: comment,
        comment: commentDetail,
        SITDeveloper: "1",
      };
      imageFormData.append("json", JSON.stringify(orderLocate));
      try {
        setLoader(true);
        const res = await commanService.postApi(
          "/SalesOrderSecond",
          imageFormData
        );

        if (res?.data?.success === 1) {
          toast.success("Sales return processed successfully!");

          const updatedData = salesReturnData.map((item, i) => ({
            ...item,
            reminder_qty: jsonData[i].reminder_qty,
            return_qty: 0,
          }));
          setSalesReturnData(updatedData);
          setSalesReturnHeaderData([]);
          setReason("");
          setComment("");
          setCommentDetail("");
          setSelectedFiles([]);
          setPreviewUrls([]);
          setReturnQty(0);
          router.push(`/account_orders/${orderIds}`);
        } else {
          toast.error(res?.data?.message);
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoader(false);
      }
    }
  };

  return (
    <>
      <div className="col-lg-9">
        {loader && <Loader />}
        <div className="page-content my-account__orders-list">
          <div className="title-content">
            <i className="ic_sales_return fs-3 pe-3"></i>
            <h3 className="fw-bold mb-0">Sales Return</h3>
          </div>
          {salesReturnData?.length > 0 ? (
            <div className="order-complete">
              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-primary text-capitalize"
                  onClick={saveSalesReturnData}
                >
                  Save
                </button>
                <button
                  className="btn btn-primary text-capitalize"
                  onClick={handleBack}
                >
                  Back
                </button>
              </div>

              <div className="order-info">
                <div className="order-info__item">
                  <label>Invoice ID</label>
                  <span>{salesReturnHeaderData.invoice_id}</span>
                </div>
                <div className="order-info__item">
                  <label>Customer Name</label>
                  <span>{salesReturnHeaderData.customer_name}</span>
                </div>
                <div className="order-info__item">
                  <label>Customer ID</label>
                  <span>{salesReturnHeaderData.customer_id}</span>
                </div>
              </div>
              <div className="checkout__totals-wrapper">
                <div className="checkout__totals mb-0">
                  <div className="d-flex flex-column flex-wrap gap-2">
                    {salesReturnData?.length > 0 &&
                      salesReturnData.map((elm, i) => {
                        // const isDiy = salesReturnHeaderData?.vertical_code === "DIY";
                        const isDiy = jewelVertical(elm?.vertical_code);
                        return (
                          <div
                            key={i}
                            className={`order-details-row gap-2 py-2 ${
                              salesReturnData?.length - 1 !== i
                                ? "border-bottom"
                                : ""
                            }`}
                          >
                            <div className="order-details-img">
                              <img
                                loading="lazy"
                                src={elm?.image_url}
                                width="120"
                                alt={elm.product_name}
                              />
                            </div>

                            <div className="order-details-info">
                              <div className="shopping-cart__product-item__detail">
                                <h4 className="shopping-title cursor-pointer">
                                  {elm.product_name}
                                </h4>
                                <div className="shopping-sky">
                                  {jewelVertical(elm?.vertical_code)
                                    ? `SKU: ${elm?.product_sku}`
                                    : `Certificate No.: ${elm?.cert_lab} ${elm?.cert_no}`}
                                </div>

                                <ul className="shopping-cart__product-item__options">
                                  <li className="d-flex flex-wrap gap-2">
                                    {elm?.metal_type && (
                                      <div className="d-flex flex-column">
                                        <h4>Metal Type</h4>
                                        <span className="text-muted">
                                          {elm.metal_type}
                                        </span>
                                      </div>
                                    )}

                                    {extractNumber(elm?.gold_weight) > 0 && (
                                      <div className="d-flex flex-column">
                                        <h4>Gold Weight</h4>
                                        <span className="text-muted">
                                          {elm.gold_weight} {elm.gold_wt_unit}
                                        </span>
                                      </div>
                                    )}

                                    {extractNumber(elm?.diamond_weight) > 0 && (
                                      <div className="d-flex flex-column">
                                        <h4>Diamond Weight</h4>
                                        <span className="text-muted">
                                          {elm.diamond_weight}{" "}
                                          {elm.dia_first_unit}
                                        </span>
                                      </div>
                                    )}

                                    {extractNumber(elm?.col_wt) > 0 && (
                                      <div className="d-flex flex-column">
                                        <h4>Gemstone Weight</h4>
                                        <span className="text-muted">
                                          {elm.col_wt} {elm.col_first_unit}
                                        </span>
                                      </div>
                                    )}

                                    <div className="d-flex flex-column">
                                      <h4>Rate</h4>
                                      <span className="text-muted">
                                        {numberWithCommas(elm?.line_price)}
                                      </span>
                                    </div>

                                    {elm?.custom_amt > 0 && (
                                      <div className="d-flex flex-column">
                                        <h4>Custom Charge</h4>
                                        <span className="text-muted">
                                          {elm.custom_amt} ({elm.custom_per}%)
                                        </span>
                                      </div>
                                    )}

                                    {extractNumber(elm?.tax1_amt) > 0 && (
                                      <div className="d-flex flex-column">
                                        <h4>Tax Value</h4>
                                        <span className="text-muted">
                                          {elm.tax1_amt}
                                        </span>
                                      </div>
                                    )}

                                    {elm?.quantity > 0 && (
                                      <div className="d-flex flex-column">
                                        <h4>Quantity</h4>
                                        <span className="text-muted">
                                          {parseInt(elm.quantity, 10)}
                                        </span>
                                      </div>
                                    )}
                                    {elm?.quantity_receive > 0 && (
                                      <div className="d-flex flex-column">
                                        <h4>Receive Quantity</h4>
                                        <span className="text-muted">
                                          {parseInt(elm.quantity_receive, 10)}
                                        </span>
                                      </div>
                                    )}
                                    {extractNumber(elm?.net_amount) > 0 && (
                                      <div className="d-flex flex-column">
                                        <h4>Net Amount</h4>
                                        <span className="text-muted">
                                          {numberWithCommas(
                                            extractNumber(
                                              elm?.net_amount
                                            ).toFixed(2)
                                          )}
                                        </span>
                                      </div>
                                    )}
                                  </li>
                                </ul>
                              </div>
                            </div>

                            {isDiy ? (
                              <div className="order-details-right">
                                <div className="text-end">
                                  <label className="me-1">
                                    Request Return Qty:
                                  </label>
                                  <div className="qty-control d-flex align-items-center justify-content-end gap-1">
                                    <input
                                      type="number"
                                      min="0"
                                      max={
                                        parseInt(elm.quantity, 10) -
                                        parseInt(elm.quantity_receive, 10)
                                      }
                                      value={returnQty}
                                      className="form-control qty-control__number text-end"
                                      onChange={(e) => {
                                        const newValue = Math.max(
                                          0,
                                          Number(e.target.value) || 0
                                        );
                                        setReturnQty(newValue);
                                        setSalesReturnData((prev) =>
                                          prev.map((item, index) =>
                                            index === i
                                              ? {
                                                  ...item,
                                                  return_qty: newValue,
                                                }
                                              : item
                                          )
                                        );
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="text-nowrap">
                                  <span className="shopping-cart__subtotal">
                                    {elm.currency_code}{" "}
                                    {numberWithCommas(
                                      extractNumber(elm?.net_amount).toFixed(2)
                                    )}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
              <div className="checkout__totals-wrapper">
                <div className="checkout__totals">
                  <div className="checkout__totals p-0 mb-0 border-0">
                    <h3 className="text-capitalize">Reason*</h3>
                    <div className="d-flex flex-column flex-md-row align-items-start gap-3 w-100">
                      <div className="d-flex align-items-center gap-3">
                        <FormSelect
                          id="returnReason"
                          className="custom-react-select-container"
                          aria-label="Select Return Reason"
                          name="return-reason"
                          value={reason}
                          onChange={(e) => changeReason(e.target.value)}
                        >
                          <option value="">Select Reason</option>
                          <option value="1">Defective / Damaged Item</option>
                          <option value="2">Wrong Item Received</option>
                          <option value="3">Item Not As Described</option>
                          <option value="4">Ordered by Mistake</option>
                          <option value="5">Better Price Available</option>
                          <option value="6">Changed My Mind</option>
                          <option value="7">Other</option>
                        </FormSelect>
                      </div>
                    </div>
                    {reason === "7" && (
                      <div className="w-100 mt-2">
                        <label className="title mb-2">
                          Please specify your reason *
                        </label>
                        <textarea
                          className="form-control"
                          placeholder="Leave a comment here"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                      </div>
                    )}
                  </div>
                  <div className="checkout__totals mb-0 ps-0 border-0">
                    <h3 className="text-capitalize">Upload Document</h3>
                    <div className="review-section">
                      <div className="FileUpload_min">
                        <div className="review-img position-relative d-flex gap-4 flex-wrap">
                          <div className="dragarea text-center border border-light rounded p-3 mb-0 flex-shrink-0">
                            <label
                              htmlFor="uploadFile"
                              className="text-primary fw-semibold cursor-pointer d-block"
                              style={{ cursor: "pointer" }}
                            >
                              Click To Browse
                              <small className="text-muted d-block mt-1">
                                (Multiple Images)
                              </small>
                            </label>
                            <input
                              id="uploadFile"
                              type="file"
                              multiple
                              style={{ display: "none" }}
                              onChange={changeFile}
                              accept=".png,.jpg,.jpeg,.webp,.PNG,.JPG,.JPEG,.WEBP"
                            />
                          </div>

                          {previewUrls.length > 0 && (
                            <div className="flex-grow-1">
                              <label className="d-block mb-2 text-light1 fw-semibold">
                                Proof of Documents
                              </label>

                              <div className="FileUpload_conn-inner d-flex flex-wrap gap-2">
                                {previewUrls.map((preview, i) => (
                                  <div
                                    key={i}
                                    className="Upload_images position-relative"
                                  >
                                    <img
                                      src={preview}
                                      className="img-fluid"
                                      width={100}
                                      height={100}
                                      alt="Preview"
                                    />

                                    <button
                                      type="button"
                                      className="position-absolute top-0 end-0 btn btn-sm p-0 m-1 bg-white rounded-circle shadow-sm"
                                      onClick={() => removePhoto(i)}
                                      aria-label="Remove file"
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
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="checkout__totals mb-0 ps-0 border-0">
                    <h3 className="text-capitalize">Comment</h3>
                    <textarea
                      className="form-control"
                      placeholder="Leave a comment here"
                      style={{ height: "145px" }}
                      value={commentDetail}
                      onChange={(e) => setCommentDetail(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            !loader &&
            salesReturnData?.length === 0 && (
              <div className="d-flex justify-content-center w-100 not-found">
                <Image
                  src={NotFoundImg}
                  loading="lazy"
                  width={500}
                  height={500}
                  alt="Record Not found"
                />
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}
