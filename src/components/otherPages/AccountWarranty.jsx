"use client";
import { isEmpty } from "@/CommanFunctions/commanFunctions";
import commanService from "@/CommanService/commanService";
import Loader from "@/CommanUIComp/Loader/Loader";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "react-toastify";
import WarrantyCardModal from "../modals/WarrantyCardModal";
// import * as bootstrap from "bootstrap";

const AccountWarranty = () => {
    const router = useRouter();
    const storeEntityIds = useSelector((state) => state.storeEntityId);
    const reduxLoginData = useSelector((state) => state.loginData);

    const loginDatas =
    typeof window !== "undefined"
        ? JSON.parse(sessionStorage.getItem("loginData")) || reduxLoginData
        : reduxLoginData;


    const [loading, setLoading] = useState(false);

    const [userMessage, setUserMessage] = useState("");
    const [serialNumber, setSerialNumber] = useState("");

    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [orderData, setOrderData] = useState([]);
    const [selectedElement, setSelectedElement] = useState("");

    // useEffect(() => {
    //     const modalElement = typeof document !== "undefined" && document.getElementById("warrantyCard");
    //     if (modalElement) {
    //         const modal = new bootstrap.Modal(modalElement,{
    //             keyboard:false
    //           });
    //         showVerifyModal ? modal.show() : modal.hide();
    //     }
    // }, [showVerifyModal]);

    useEffect(() => {
        let bootstrap;
        (async () => {
          if (typeof window !== "undefined") {
            bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");
    
            const modalElement = document.getElementById("warrantyCard");
            if (modalElement) {
              const modal = new bootstrap.Modal(modalElement, { keyboard: false });
              showVerifyModal ? modal.show() : modal.hide();
            }
          }
        })();
      }, [showVerifyModal]);

    const verifyCard = (serialNum) => {
        const obj = {
            a: "OrderWiseSKU",
            store_type: "B2C",
            consumer_id: isEmpty(loginDatas.member_id),
            certificate_id: serialNum,
            store_id: storeEntityIds.mini_program_id,
        };
        if (isEmpty(serialNum) !== "") {
            setLoading(true);
            commanService
                .postLaravelApi("/WarrantyCard", obj)
                .then((res) => {
                    if (res.data.success == 1) {
                        setOrderData(res.data.data);
                        setShowVerifyModal(true);
                        setLoading(false);
                    } else {
                        toast.error(res.data.message);
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                    setLoading(false);
                });
        } else {
            toast.error("Enter Warranty Card Number");
            setLoading(false);
        }
    };

    const verifySKUs = (element) => {
        setShowVerifyModal(false);
        const obj = {
            a: "warrantycard",
            store_type: "B2C",
            certificate_id: element.product_sku,
            status: "0",
            b2c_order_id: element.so_b2c_order_id,
            order_id: element.order_id,
            store_id: storeEntityIds.mini_program_id,
        };
        if (isEmpty(element) !== "") {
            setLoading(true);
            commanService
                .postLaravelApi("/WarrantyCard", obj)
                .then((res) => {
                    if (res.data.success == 1) {
                        setSelectedElement(element);
                        setUserMessage(res.data.message);
                        setLoading(false);
                    } else {
                        toast.error(res.data.message);
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                    setLoading(false);
                });
        } else {
            toast.error("Please Select Order Lines");
            setLoading(false);
        }
    };

    const createJourney = () => {
        viewCatalogApi(selectedElement);
        setSerialNumber("");
    };

    const viewCatalogApi = (element) => {
        const catalog = {
            a: "JourneyCatalog",
            store_type: "B2C",
            certificate_id: element.product_sku,
            b2c_order_id: element.so_b2c_order_id,
            order_id: element.order_id,
            counsumer_id: isEmpty(loginDatas.member_id),
            store_id: storeEntityIds.mini_program_id,
        };

        if (isEmpty(element) !== "") {
            setLoading(true);
            commanService
                .postLaravelApi("/WarrantyCard", catalog)
                .then((res) => {
                    if (res.data.success == 1) {
                        setUserMessage(res.data.message);
                        // if (props.setSelectedTab) {
                        //     props.setSelectedTab('JourneyCatalogue');
                        router.push(`/account_journey`);
                        // }
                        setLoading(false);
                    } else {
                        toast.error(res.data.message);
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                    setLoading(false);
                });
        } else {
            toast.error("Enter Warranty Card Number");
            setLoading(false);
        }
    };

    const handlePassFunction = (value) => {
        verifySKUs(value);
    };
    const handlePassState = (value) => {
        setShowVerifyModal(value);
    };
    return (
        <div className="col-lg-9">
            <div className="page-content">
                <div className="title-content">
                    <i className="ic_warranty_card fs-3 pe-3"></i>
                    <h3 className="fw-bold mb-0">Warranty Card</h3>
                </div>
                {loading && <Loader />}
                <div className="text-secondary">
                    <p>
                        This is to certify that this device is covered under warranty.
                        please check the seller invoice copy for the validity of warranty.
                    </p>
                </div>

                <div className="mt-2">
                    <div className="fs-6">
                        <label className="mb-2 fw-semi-bold">
                            Enter Warranty Card Number
                        </label>
                        <div className="d-flex flex-wrap">
                            <div className="d-flex align-items-center col-md-9">
                                <input
                                    type="text"
                                    className="input-texts fw-400"
                                    placeholder="Enter Warranty Card Number"
                                    value={serialNumber}
                                    onChange={(e) => {
                                        setSerialNumber(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="col-md-3">
                                <button
                                    type="button"
                                    className="btn btn-primary verify-btn"
                                    data-toggle="modal"
                                    data-target="#warrantyCard"
                                    onClick={() => verifyCard(serialNumber)}
                                >
                                    Verify
                                </button>
                            </div>
                        </div>
                        <div className="mt-2">
                            <span className="fw-semi-bold">Terms and Condition :</span>
                            <div className="text-secondary">
                                <ul className="list-unstyled">
                                    <li>1.One year warranty effects from the purchase date.</li>
                                    <li>
                                        2.Warranty covers any manufacturing technical defect
                                        excluding breakage.
                                    </li>
                                    <li>
                                        3.Warranty is void if repairing without our conset or
                                        warranty seal is broken.
                                    </li>
                                    <li>
                                        4.The warranty does not cover faults resulting from
                                        operation careless handling or not following instruction.
                                        Also to electric shock cases.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {isEmpty(userMessage) !== "" ? (
                        <>
                            <div className="col-12 my-4">
                                <p
                                    className="text-center text_success"
                                    dangerouslySetInnerHTML={{ __html: userMessage }}
                                ></p>
                            </div>
                            <div className="col-12">
                                <div className="text-center mt-2">
                                    <button
                                        type="button"
                                        id="journeyBtn"
                                        className="btn btn-primary"
                                        onClick={() => createJourney()}
                                    >
                                        Create Your Free Journey Catalogue
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        ""
                    )}
                </div>
                {showVerifyModal === true && (
                    <div
                        className="modal fade"
                        id="warrantyCard"
                        tabIndex="-1"
                        aria-hidden="true"
                        data-bs-backdrop="static"
                    >
                        <div className="modal-dialog size-guide">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{serialNumber}</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() => handlePassState(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="size-guide__detail">
                                        <div className="overflow-auto">
                                            <table className="certificat-table">
                                                <thead>
                                                    <tr>
                                                        <th>Order ID</th>
                                                        <th>Create Date</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orderData?.length > 0 ? (
                                                        orderData.map((item, i) => {
                                                            const formattedDate =
                                                                new Date(item.create_at).toLocaleDateString(
                                                                    "en-GB",
                                                                    {
                                                                        day: "numeric",
                                                                        month: "numeric",
                                                                        year: "numeric",
                                                                    }
                                                                ) +
                                                                " " +
                                                                new Date(item.create_at).toLocaleTimeString(
                                                                    "en-GB",
                                                                    {
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                        second: "2-digit",
                                                                    }
                                                                );

                                                            return (
                                                                <tr key={i}>
                                                                    <td>{item.order_id}</td>
                                                                    <td>{formattedDate}</td>
                                                                    <td
                                                                        className="cursor-pointer edit_btn"
                                                                        data-bs-dismiss="modal"
                                                                        aria-label="Close"
                                                                        onClick={() => {
                                                                            handlePassFunction(item);
                                                                            handlePassState(false);
                                                                        }}
                                                                    >
                                                                        <Link href="#" className="btn btn-primary">Add</Link>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={5} className="text-center py-5">
                                                                <p className="text-center">No Recored Found</p>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <!-- /.modal-dialog --> */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountWarranty;
