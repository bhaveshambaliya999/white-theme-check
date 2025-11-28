"use client";
import { isEmpty } from "@/CommanFunctions/commanFunctions";
import commanService from "@/CommanService/commanService";
import Loader from "@/CommanUIComp/Loader/Loader";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { toast } from "react-toastify";
import Image from "next/image";
// import * as bootstrap from "bootstrap";

const AccountJourney = () => {
  const isCallRef = useRef(false);
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const loginDatas = typeof window !== "undefined" && JSON.parse(sessionStorage.getItem("loginData")) || useSelector((state) => state.loginData);

  const [loading, setLoading] = useState("");

  const [catalogDataList, setCatalogDataList] = useState([]);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [description, setDescription] = useState("");
  const [imgFile, setImgFile] = useState([]);
  const [imgPreview, setImgPreview] = useState([]);
  const [orderElement, setOrderElement] = useState("");
  const [Status, setStatus] = useState("");
  const [certificateId, setCertificateId] = useState("");
  const [jrnyUniqueId, setJrnyUniqueId] = useState("");
  const [update, setUpdate] = useState(false);
  const [uploadPhoto, setUploadPhoto] = useState(false);
  const [showJourneyModal, setShowJourneyModal] = useState(false);

  useEffect(() => {
      let bootstrap;
      (async () => {
        if (typeof window !== "undefined") {
          bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");
  
          const modalElement = document.getElementById("journeyModal");
          if (modalElement) {
            const modal = new bootstrap.Modal(modalElement, { keyboard: false });
            showJourneyModal ? modal.show() : modal.hide();
          }
        }
      })();
    }, [showJourneyModal]);

  const catalogData = () => {
    const catalog = {
      a: "GetJourneyCatalog",
      store_type: "B2C",
      counsumer_id: isEmpty(loginDatas.member_id),
      store_id: isEmpty(storeEntityIds.mini_program_id),
    };
    setLoading(true);
    commanService
      .postLaravelApi("/WarrantyCard", catalog)
      .then((res) => {
        if (res.data.success == 1) {
          let data = res.data.data;
          setCatalogDataList(data);
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
  };

  const addCatalog = (data) => {
    setUploadPhoto(false);
    setUpdate(false);
    setOrderElement(data);
    setCertificateId(data.certificate_id);
    setJrnyUniqueId(data.unique_id);
    setShowJourneyModal(true);
    setStatus(data.status);
    setReview("");
    setTitle("");
    setDescription("");
    setImgFile([]);
    setImgPreview([]);
  };

  const editCatalog = (data) => {
    setTitle("");
    setReview("");
    setDescription("");
    setImgFile([]);
    setImgPreview([]);
    setStatus("");
    setUploadPhoto(false);
    setShowJourneyModal(true);
    setUpdate(true);
    setOrderElement(data);
    setStatus(data.status);
    setCertificateId(data.certificate_id);
    setJrnyUniqueId(data.unique_id);
    catalogReviewData(data);
  };

  useEffect(() => {
    if (!isCallRef.current) {
      catalogData();
      isCallRef.current = true;
    }
  }, []);

  const uploadMultipleImage = (e) => {
    setUploadPhoto(true);
    const imges = [...imgFile];
    const preview = [...imgPreview];
    const files = e.target.files;

    const filesObj = [...files];

    filesObj.map((file) => {
      const ext = file.name.split(".").pop().toLowerCase();
      if (ext == "jpeg" || ext == "jpg" || ext == "png" || ext == "webp") {
        imges.push(file);
        preview.push(URL.createObjectURL(file));
        setImgFile(imges);
        setImgPreview(preview);
      } else {
        toast.error("Only png,webp,jpg and jpeg files are allowed.");
      }
      return file;
    });
    e.target.value = "";
  };

  const removeImage = (index) => {
    if (update == false || isEmpty(index.unique_id) == "") {
      const img = imgFile.filter((item, i) => i !== index);
      setImgFile(img);
      const imgPre = imgPreview.filter((item, i) => i !== index);
      setImgPreview(imgPre);
    } else {
      const obj = {
        a: "CatalogImageDelete",
        unique_id: isEmpty(index.unique_id),
      };
      setLoading(true);
      commanService
        .postLaravelApi("/WarrantyCard", obj)
        .then((res) => {
          if (res.data.success == 1) {
            const filter = imgFile.filter(
              (item, i) => index.unique_id !== item.unique_id
            );
            const arr = [];
            for (let c = 0; c < filter.length; c++) {
              if (isEmpty(filter[c].unique_id) == "") {
                arr.push(URL.createObjectURL(filter[c]));
              } else {
                arr.push(filter[c]);
              }
            }
            setImgFile(filter);
            setImgPreview(arr);
            toast.error(res.data.message);
            setLoading(false);
          } else {
            setLoading(false);
          }
        })
        .catch((error) => {
          toast.error(error.message);
          setLoading(false);
        });
    }
  };

  const addUpdateCatalog = (value) => {
    const obj = new FormData();
    obj.set("title", isEmpty(title));
    obj.set("review", isEmpty(review));
    obj.set("description", isEmpty(description));
    obj.set("store_id", isEmpty(storeEntityIds.mini_program_id));
    obj.set("counsumer_id", loginDatas.member_id);
    obj.set(
      "unique_id",
      value == "update" && imgFile.length > 0 ? imgFile[0].unique_id : ""
    );
    obj.set("so_order_id", isEmpty(orderElement.so_order_id));
    obj.set("jc_unique_id", isEmpty(jrnyUniqueId));
    obj.set("certificate_id", certificateId);
    obj.set("status", "0");

    const obj2 = new FormData();
    if (imgFile.length == 0) {
      obj2.set("image[]", "");
    } else {
      if (uploadPhoto) {
        for (let i = 0; i < imgFile.length; i++) {
          if (isEmpty(imgFile[i].unique_id) == "") {
            obj2.append("image[]", imgFile[i]);
          }
        }
      } else {
        obj2.append("image[]", "");
      }
    }
    obj2.set("json", commanService.obj_json(obj, "AddUpdateReview"));
    if (isEmpty(title) == "") {
      toast.error("Title Required");
    } else if (isEmpty(review) == "") {
      toast.error("How We Meet Required");
    } else if (isEmpty(description) == "") {
      toast.error("The Proposal Required");
    } else if (imgFile.length == 0) {
      toast.error("Image Required");
    } else {
      setLoading(true);
      commanService.postLaravelApi("/WarrantyCard", obj2).then((res) => {
        if (res.data.success == 1) {
          toast.success(res.data.message);
          setShowJourneyModal(false);
          catalogData();
        } else {
          toast.error(res.data.message);
        }
        setLoading(false);
      });
    }
  };

  const catalogReviewData = (data) => {
    const obj = {
      a: "GetCatalogReview",
      store_type: "B2C",
      certificate_id: isEmpty(data.certificate_id),
      so_order_id: isEmpty(data.so_order_id),
      counsumer_id: isEmpty(loginDatas.member_id),
      store_id: isEmpty(storeEntityIds.mini_program_id),
    };
    setLoading(true);
    commanService
      .postLaravelApi("/WarrantyCard", obj)
      .then((res) => {
        if (res.data.success == 1) {
          let data = res.data.data;
          setReview(data[0].review);
          setTitle(data[0].title);
          setDescription(data[0].description);
          setImgFile(data[0].image);
          setImgPreview(data[0].image);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  return (
    <div className="col-lg-9 size-guide__detail">
      {loading && <Loader />}
      <div className="page-content my-account__orders-list">
        <div className="title-content">
          <i className="ic_journey_catalogue fs-3 pe-3"></i>
          <h3 className="fw-bold mb-0">Journey Catalogue</h3>
        </div>
        <table className="certificat-table">
          <thead className="position-sticky">
            <tr>
              <th>Create Date</th>
              <th>Order No</th>
              <th>Warranty Card No</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {catalogDataList.length > 0 ? (
              catalogDataList.map((item, i) => {
                const formattedDate = new Date(
                  item.create_at
                ).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                });
                return (
                  <tr key={i}>
                    <td>{formattedDate}</td>
                    <td>{item.order_id}</td>
                    <td>{item.certificate_id}</td>
                    <td>{item.status}</td>
                    {item.id == 0 ? (
                      <td
                        className=""
                        data-toggle="modal"
                        data-target="#journeyModal"
                      >
                        <span
                          className="btn btn-primary"
                          onClick={() => {
                            addCatalog(item);
                            setShowJourneyModal(true);
                          }}
                        >
                          Add
                        </span>
                      </td>
                    ) : (
                      <td>
                        <span
                          className="btn btn-primary"
                          onClick={() => editCatalog(item)}
                        >
                          {" "}
                          Edit{" "}
                        </span>{" "}
                        {isEmpty(item.publish_url) !== "" ? (
                          <span className="cursor-pointer">
                            |{" "}
                            <Link
                              href={`/account_dashboard/viewjourney?unique_id=${item.unique_id}`}
                            >
                              View Catalogue
                            </Link>
                          </span>
                        ) : (
                          ""
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-5">
                  <p className="text-center fs-16">No Recored Found</p>
                  <p className="fs-16">
                    {" "}
                    GO TO {">>"} Warranty Card and Create Your Own Catalogue
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showJourneyModal === true && (
        <div
          className="modal fade"
          id="journeyModal"
          tabIndex="-1"
          aria-hidden="true"
          data-bs-backdrop="static"
        >
          <div className="modal-dialog size-guide JourneyCatalogueModal">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{orderElement.so_order_id}</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setShowJourneyModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="col-12">
                  <label className="fw-400 medium-small-title d-block">
                    Title
                  </label>
                  <input
                    autoComplete="off"
                    className="input-texts"
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="row mx-0">
                        <div className="col-12 ps-0 pe-lg-3 pe-md-2 pe-0">
                          <label className="fw-400 medium-small-title d-block mb-0 mt-3">
                            Upload a photo (Multiple Image)
                          </label>
                          <div className="file-upload">
                            <div className="d-flex align-items-center justify-content-center">
                              Click to image upload
                              <i className="ic_upload medium-title ms-1"></i>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="w-100"
                              onChange={(e) => uploadMultipleImage(e)}
                            />
                          </div>
                          <div className="row mx-0 align-items-center">
                            {imgPreview.length > 0 &&
                              imgPreview.map((url, i) => {
                                return (
                                  <div
                                    className={`col-3 position-relative pt-2 ps-0 pe-1`}
                                    key={i}
                                  >
                                    <div className="images-upload border">
                                      <Image
                                        src={
                                          update && isEmpty(url.image) !== ""
                                            ? url.image
                                            : url
                                        }
                                        width={100}
                                        height={100}
                                        alt="Journey Image"
                                        className="h-100 w-100"
                                        // quality={100}
                                      />
                                      <div
                                        className="close-icon cursor-pointer"
                                        onClick={() => {
                                          (update &&
                                            isEmpty(url.image) == "") ||
                                          !update
                                            ? removeImage(i)
                                            : removeImage(url);
                                        }}
                                      >
                                       <svg width="14" height="14" aria-hidden="true">
                                          <use xlinkHref="#icon_close" />
                                      </svg>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex flex-wrap">
                        <div className="col-12">
                          <label className="fw-400 medium-small-title d-block mb-0 mt-3">
                            How We Meet
                          </label>
                          <textarea
                            autoComplete="off"
                            className="input-texts how_we_meet_input"
                            type="text"
                            value={review}
                            placeholder="How We Meet"
                            onChange={(e) => setReview(e.target.value)}
                          ></textarea>
                        </div>
                        <div className="col-12">
                          <label className="fw-400 medium-small-title d-block mb-0 mt-3">
                            The Proposal
                          </label>
                          <textarea
                            autoComplete="off"
                            className="input-texts proposal_input"
                            type="text"
                            value={description}
                            placeholder="The Proposal"
                            onChange={(e) => setDescription(e.target.value)}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {!update ? (
                  <button
                    variant="primary"
                    className="btn btn-primary"
                    onClick={() => {
                      addUpdateCatalog("add");
                      if (
                        ((title && review && description) !== "" ||
                          undefined) &&
                        imgFile.length !== 0
                      ) {
                        setShowJourneyModal(false);
                      }
                    }}
                    data-bs-dismiss={
                      ((title && review && description) !== "" || undefined) &&
                      imgFile.length !== 0
                        ? "modal"
                        : ""
                    }
                    aria-label="Close"
                  >
                    Submit
                  </button>
                ) : (
                  <>
                    {isEmpty(Status) != "PUBLISH" ? (
                      <button
                        variant="primary"
                        className="btn btn-primary"
                        onClick={() => {
                          addUpdateCatalog("update");
                          if (
                            ((title && review && description) !== "" ||
                              undefined) &&
                            imgFile.length !== 0
                          ) {
                            setShowJourneyModal(false);
                          }
                        }}
                        data-bs-dismiss={
                          ((title && review && description) !== "" ||
                            undefined) &&
                          imgFile.length !== 0
                            ? "modal"
                            : ""
                        }
                        aria-label="Close"
                      >
                        Update
                      </button>
                    ) : (
                      ""
                    )}
                  </>
                )}
                <button
                  variant="secondary"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setShowJourneyModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          {/* <!-- /.modal-dialog --> */}
        </div>
      )}
    </div>
  );
};

export default AccountJourney;
