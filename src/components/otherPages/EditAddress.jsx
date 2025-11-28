import commanService from "@/CommanService/commanService";
import { DefaultBillingAddress } from "@/Redux/action";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Select from "react-select";
import { isEmpty, RandomId } from "@/CommanFunctions/commanFunctions";

export default function EditAddress() {
  const isCallRef = useRef(false);
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const reduxLoginData = useSelector((state) => state.loginData);

const loginDatas =
  typeof window !== "undefined"
    ? JSON.parse(sessionStorage.getItem("loginData")) || reduxLoginData
    : reduxLoginData;

  const dispatch = useDispatch();
  const isLogin = Object.keys(loginDatas).length > 0;

  const validateDigit = (e) => {
    var key = e.key;
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
      e.preventDefault();
    }
  };

  const textOnly = (e) => {
    var key = e.key;
    var regex = /^[A-Za-z\s]+$/;
    if (!regex.test(key)) {
      e.preventDefault();
    }
  };

  const [loading, setLoading] = useState(false);
  const [Addressbilling, setAdressBilling] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [update, setUpdate] = useState(false);

  //address billing
  const [countryDataDrp, setGetCountryDataDrp] = useState([]);
  const [phoneCodeDataDrp, setPhoneCodeDataDrp] = useState([]);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phone, setPhone] = useState("");
  const [building, setBuilding] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [description, setDescription] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("");
  const [countryId, setCountryId] = useState("");
  const [countryShortCode, setCountryShortCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [uniqueId, setUniqueId] = useState("");

  // useEffect(() => {
  //   const modalElement = typeof document !== "undefined" && document.getElementById("setShowAddressModal");
  //   if (modalElement) {
  //     const modal = new bootstrap.Modal(modalElement,{
  //       keyboard:false
  //     });
  //     showAddressModal ? modal.show() : modal.hide();
  //   }
  // }, [showAddressModal]);

  useEffect(() => {
    let bootstrap;
    (async () => {
      if (typeof window !== "undefined") {
        bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");

        const modalElement = document.getElementById("setShowAddressModal");
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement, { keyboard: false });
          showAddressModal ? modal.show() : modal.hide();
        }
      }
    })();
  }, [showAddressModal]);

  const addressData = (Member_id) => {
    const Address = {
      a: "GetBilling",
      user_id: !Member_id ? loginDatas.member_id : Member_id,
      store_id: storeEntityIds.mini_program_id,
      status: "1",
      per_page: "0",
      number: "0",
    };
    setLoading(true);
    commanService
      .postLaravelApi("/BillingDetails", Address)
      .then((res) => {
        if (res.data.success == 1) {
          setUpdate(false);
          var billingData = res.data.data;
          setAdressBilling(billingData);
          if (billingData.length > 0) {
            for (let c = 0; c < billingData.length; c++) {
              if (billingData[c].status === 1) {
                dispatch(DefaultBillingAddress(billingData[c]));
              }
            }
          }
          countrySetDrp();
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

  useEffect(() => {
    if (!isCallRef.current) {
      addressData(isLogin ? loginDatas.member_id : RandomId);
      isCallRef.current = true;
    }
  }, []);

  const deleteAddresses = (id) => {
    const DeteteIt = {
      a: "deleteBilling",
      unique_id: id,
    };
    setLoading(true);
    commanService
      .postLaravelApi("/BillingDetails", DeteteIt)
      .then((res) => {
        if (res.data.success == 1) {
          toast.success(res.data.message);
          addressData();
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

  const defaultAdress = (unique_id) => {
    const Default_Address = {
      a: "DefaultBilling",
      store_id: storeEntityIds.mini_program_id,
      unique_id: unique_id,
      user_id: isLogin ? loginDatas.member_id : RandomId,
    };
    setLoading(true);
    commanService
      .postLaravelApi("/BillingDetails", Default_Address)
      .then((res) => {
        if (res.data.success == 1) {
          toast.success(res.data.message);
          addressData(isLogin ? loginDatas.member_id : RandomId);
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

  const showAddress = (e) => {
    e.preventDefault();
    setUpdate(false);
    setShowAddressModal(true);
    setCountryShortCode("");
    setCountryId("");
    setCountry("");
    setPincode("");
    setState("");
    setFname("");
    setLname("");
    setCity("");
    setStreet("");
    setBuilding("");
    setBuildingName("");
    setDescription("");
    setPhoneCode("");
    setPhone("");
  };

  const changeAddressBilling = (e, value) => {
    if (value == "fname") {
      setFname(e.target.value);
    } else if (value == "lname") {
      setLname(e.target.value);
    } else if (value == "Country") {
      setCountry(e);
      for (let c = 0; c < countryDataDrp.length; c++) {
        if (e.value != "Select Your Country") {
          if (countryDataDrp[c].name === e.value) {
            setCountryShortCode(countryDataDrp[c].sortname);
            setCountryId(countryDataDrp[c].id);
          }
        } else {
          setCountryShortCode("");
          setCountryId("");
        }
      }
    } else if (value == "phoneCode") {
      if (e.value != "Phone Code") {
        setPhoneCode(e);
      } else {
        setPhoneCode("");
      }
    } else if (value == "phone") {
      setPhone(e.target.value);
    } else if (value == "building") {
      setBuilding(e.target.value);
    } else if (value == "buildingName") {
      setBuildingName(e.target.value);
    } else if (value == "description") {
      setDescription(e.target.value);
    } else if (value == "street") {
      setStreet(e.target.value);
    } else if (value == "city") {
      setCity(e.target.value);
    } else if (value == "state") {
      setState(e.target.value);
    } else if (value == "Pincode") {
      setPincode(e.target.value);
    }
  };

  const countrySetDrp = () => {
    var data = JSON.parse(sessionStorage.getItem("country_data"));
    for (let c = 0; c < data?.length; c++) {
      data[c].value = data[c].name;
      data[c].label = data[c].name;
    }
    data.splice(0, 0, { value: "", label: "Select Your Country" });
    setGetCountryDataDrp(data);
    const datas = data.filter((item) => item.value === country);
    setCountry(datas[0]);
    setTimeout(() => {
      phoneCodeSetDrp();
    });
  };

  const profileData = useCallback(() => {
    for (let c = 0; c < countryDataDrp?.length; c++) {
      if (countryDataDrp[c].name === loginDatas.country) {
        setCountry(countryDataDrp[c]);
        setCountryShortCode(countryDataDrp[c].sortname);
        setCountryId(countryDataDrp[c].id);
      }
    }

    for (let c = 0; c < phoneCodeDataDrp?.length; c++) {
      if (phoneCodeDataDrp[c].phonecode === loginDatas.country_code) {
        setPhoneCode(phoneCodeDataDrp[c]);
      }
    }
  }, [countryDataDrp, phoneCodeDataDrp]);

  const phoneCodeSetDrp = () => {
    var pdata = JSON.parse(sessionStorage.getItem("country_data"));
    for (let c = 0; c < pdata.length; c++) {
      pdata[c].value = pdata[c].phonecode;
      pdata[c].label = pdata[c].phonecode + " - " + pdata[c].name;
    }
    pdata.splice(0, 0, { value: "", label: "Phone Code" });
    setPhoneCodeDataDrp(pdata);
    var data = pdata.filter((item) => item.value === phoneCode);
    setPhoneCode(data[0]);
    profileData();
  };

  const editAddress = (e, data) => {
    e.preventDefault();
    setUpdate(true);
    setShowAddressModal(true);
    setUniqueId(data.unique_id);
    setCountryId(data.country_id);
    setCountryShortCode(data.country_short_code);
    setPincode(data.pincode);
    setState(data.state);
    setFname(data.first_name);
    setLname(data.last_name);
    setCity(data.city);
    setStreet(data.street);
    setBuilding(data.building);
    setBuildingName(data.address);
    setDescription(data.description);
    setPhone(data.mobile_no);
    for (let c = 0; c < countryDataDrp.length; c++) {
      if (countryDataDrp[c].name === data.country) {
        setCountry(countryDataDrp[c]);
      }
    }

    for (let c = 0; c < phoneCodeDataDrp.length; c++) {
      if (phoneCodeDataDrp[c].phonecode === data.country_code) {
        setPhoneCode(phoneCodeDataDrp[c]);
      }
    }
  };

  const addUpdateAddress = (e, Member_id, uniqueId) => {
    e.preventDefault();
    const update_address = {
      a: "AddUpdateBilling",
      store_id: storeEntityIds.mini_program_id,
      unique_id: update ? uniqueId : "",
      company_name: "",
      building: building,
      street: street,
      address: isEmpty(buildingName),
      description: isEmpty(description),
      country: country.value,
      country_id: countryId,
      country_code: phoneCode.value,
      country_short_code: countryShortCode,
      state: state,
      city: city,
      pincode_no: pincode,
      mobile_no: phone,
      user_id: Member_id,
      first_name: fname,
      last_name: lname,
    };
    setLoading(true);
    if (
      ((fname &&
        lname &&
        city &&
        phone &&
        pincode &&
        street &&
        building &&
        country.value &&
        phoneCode.value) !== "" ||
        undefined) &&
      country.value !== "Select Your Country" &&
      phoneCode.value !== "Phone Code" &&
      phone.length >= 8 &&
      phone.length <= 15 &&
      pincode.length >= 5 &&
      pincode.length <= 6
    ) {
      commanService
        .postLaravelApi("/BillingDetails", update_address)
        .then((res) => {
          if (res.data.success) {
            toast.success(res.data.message);
            addressData(Member_id);
            setUpdate(false);
            setShowAddressModal(false);
            setLoading(false);
          } else {
            toast.error(res.data.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
        });
    } else {
      if (!fname) {
        toast.error("Enter Your First Name");
      } else if (!lname) {
        toast.error("Enter Your Last Name");
      } else if (!building) {
        toast.error("Enter Your Building");
      } else if (!street) {
        toast.error("Enter Your Street");
      } else if (!city) {
        toast.error("Enter Your City");
      } else if (!country.value || country.value == "Select Your Country") {
        toast.error("Select Your Country");
      } else if (!phoneCode.value || phoneCode.value == "Phone Code") {
        toast.error("Phone Code Required");
      } else if (!phone) {
        toast.error("Mobile Number Required");
      } else if (phone.length < 8) {
        toast.error("Minimum 8 digit is Required in Phone Number");
      } else if (phone.length > 15) {
        toast.error("Maximum 15 digit is Required in Phone Number");
      } else if (!pincode) {
        toast.error("Enter Your Pincode");
      } else if (pincode.length < 5) {
        toast.error("Minimum 5 digit is Required in Pincode");
      } else if (pincode.length > 6) {
        toast.error("Maximum 6 digit is Required in Pincode");
      }
      setLoading(false);
    }
  };

  return (
    <div className="col-lg-9 section-address-billing">
      <div className="page-content my-account__address">
        <div className="title-content">
          <i className="ic_address fs-3 pe-3"></i>
          <h3 className="fw-bold mb-0">Address & Billing Details</h3>
        </div>
        <p className="notice">
          The following addresses will be used on the checkout page by default.
        </p>
        <div className="row">
          {/* my-account__address-list */}
          {Addressbilling.length > 0 &&
            Addressbilling.map((address, i) => {
              return (
                <div className="col-md-6 mb-30px" key={i}>
                  <div
                    className={`${
                      address.status == "0" ? "" : "bg-light-address"
                    } my-account__address-item`}
                  >
                    <div className="my-account__address-item__title">
                      <h5>
                        {address.first_name} {address.last_name}
                      </h5>
                      {address.status == "0" ? (
                        <div className="d-flex gap-2">
                          <a
                            className="address-icon"
                            onClick={(e) => editAddress(e, address)}
                            data-toggle="modal"
                            data-target="#setShowAddressModal"
                          >
                            <svg width="16" height="16" aria-hidden="true">
                                <use xlinkHref="#icon_edit" />
                            </svg>
                          </a>
                          <a
                            className="address-icon"
                            onClick={() => deleteAddresses(address.unique_id)}
                          >
                            <svg width="16" height="16" aria-hidden="true">
                                <use xlinkHref="#icon_trash" />
                            </svg>
                          </a>
                        </div>
                      ) : (
                        <div className="d-flex gap-2">
                          <a
                            className="address-icon"
                            onClick={(e) => editAddress(e, address)}
                            data-toggle="modal"
                            data-target="#setShowAddressModal"
                            role="button"
                          >
                            <svg width="16" height="16" aria-hidden="true">
                                <use xlinkHref="#icon_edit" />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="my-account__address-item__detail">
                      <p>{address.address}</p>
                      <p>
                        {address.building},
                        {address.address ? <>{address.address},</> : ""}{" "}
                        {address.street},
                        {address.description ? <>{address.description},</> : ""}{" "}
                        {address.city} {"-"}
                        {address.pincode},{address.state}
                      </p>
                      <p>{address.country}</p>
                      <br />
                      <p>{address.description}</p>
                      <div className="d-flex justify-content-between">
                        <div>
                          <p>
                            {address.country_code} {address.mobile_no}
                          </p>
                        </div>
                        <div>
                          {address.status == "0" ? (
                            <div className="my-account__address-item__title">
                              <a
                                onClick={() => defaultAdress(address.unique_id)}
                              >
                                Set Default
                              </a>
                            </div>
                          ) : (
                            <div className="select_default">Default</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          <div>
            <button
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#setShowAddressModal"
              onClick={(e) => {
                showAddress(e);
                setShowAddressModal(true);
              }}
            >
              ADD NEW ADDRESS
            </button>
          </div>
        </div>
      </div>
      {showAddressModal && (
        <div
          className="modal fade"
          id="setShowAddressModal"
          tabIndex="-1"
          aria-hidden="true"
          data-bs-backdrop="static"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Address & Billing Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setShowAddressModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="register-form">
                  <form className="row needs-validation">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label htmlFor="customerNameRegisterInput" className="form-label">First Name <span className="asteriskDot">*</span></label>
                        <input
                          name="register_firstname"
                          type="text"
                          className="form-control form-control_gray"
                          id="customerNameRegisterInput"
                          placeholder="First Name"
                          defaultValue={fname || ""}
                          onKeyPress={(e) => {
                            textOnly(e);
                          }}
                          onChange={(e) => changeAddressBilling(e, "fname")}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label htmlFor="customerNameRegisterInput2" className="form-label">Last Name <span className="asteriskDot">*</span></label>
                        <input
                          name="register_lastname"
                          type="text"
                          className="form-control form-control_gray"
                          id="customerNameRegisterInput2"
                          placeholder="Last Name"
                          defaultValue={lname || ""}
                          onKeyPress={(e) => {
                            textOnly(e);
                          }}
                          onChange={(e) => changeAddressBilling(e, "lname")}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label htmlFor="customerEmailRegisterInput3" className="form-label">Enter Building <span className="asteriskDot">*</span></label>
                        <input
                          name="register_email"
                          type="text"
                          className="form-control form-control_gray"
                          id="customerEmailRegisterInput3"
                          placeholder="Enter Building"
                          defaultValue={building || ""}
                          onChange={(e) => changeAddressBilling(e, "building")}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label htmlFor="customerEmailRegisterInput4" className="form-label">Enter Building Name</label>
                        <input
                          name="register_email"
                          type="text"
                          className="form-control form-control_gray"
                          id="customerEmailRegisterInput4"
                          placeholder="Enter Building Name"
                          defaultValue={buildingName || ""}
                          onChange={(e) =>
                            changeAddressBilling(e, "buildingName")
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label htmlFor="customerEmailRegisterInput5" className="form-label">Enter Street <span className="asteriskDot">*</span></label>
                        <input
                          name="register_email"
                          type="text"
                          className="form-control form-control_gray"
                          id="customerEmailRegisterInput5"
                          placeholder="Enter Street"
                          defaultValue={street || ""}
                          onChange={(e) => changeAddressBilling(e, "street")}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label htmlFor="customerEmailRegisterInput6" className="form-label">Enter Landmark</label>
                        <input
                          name="register_email"
                          type="text"
                          className="form-control form-control_gray"
                          id="customerEmailRegisterInput6"
                          placeholder="Enter Landmark"
                          defaultValue={description || ""}
                          onChange={(e) =>
                            changeAddressBilling(e, "description")
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label htmlFor="customerPasswodRegisterInput7" className="form-label">City <span className="asteriskDot">*</span></label>
                        <input
                          type="text"
                          placeholder="City"
                          className="form-control form-control_gray"
                          defaultValue={city || ""}
                          onKeyPress={(e) => {
                            textOnly(e);
                          }}
                          onChange={(e) => changeAddressBilling(e, "city")}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label htmlFor="customerStateRegisterInput" className="form-label">State</label>
                        <input
                          name="register_state"
                          type="text"
                          className="form-control form-control_gray"
                          id="customerStateRegisterInput"
                          placeholder="State"
                          defaultValue={state || ""}
                          onKeyPress={(e) => {
                            textOnly(e);
                          }}
                          onChange={(e) => changeAddressBilling(e, "state")}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Country <span className="asteriskDot">*</span></label>
                        <Select
                          options={countryDataDrp}
                          placeholder="Select Your Country"
                          value={country}
                          onChange={(e) => changeAddressBilling(e, "Country")}
                          isSearchable={true}
                          isMulti={false}
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
                        {/* <label htmlFor="customerPasswodRegisterInput">Country *</label> */}
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label htmlFor="customerPincodeRegisterInput" className="form-label">Pincode <span className="asteriskDot">*</span></label>
                        <input
                          type="text"
                          placeholder="Pincode"
                          className="form-control form-control_gray"
                          minLength="5"
                          maxLength="6"
                          defaultValue={pincode || ""}
                          onKeyPress={(e) => validateDigit(e)}
                          onChange={(e) => changeAddressBilling(e, "Pincode")}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="mb-3">
                        <label htmlFor="customerMobileRegisterInput" className="form-label">Mobile Number <span className="asteriskDot">*</span></label>
                        <div className="d-flex justfy-content-start">
                          <div
                            className="me-2"
                            style={{ width: "30%" }}
                          >
                            <Select
                              options={phoneCodeDataDrp}
                              placeholder="Phone Code"
                              value={phoneCode}
                              onChange={(e) => {
                                changeAddressBilling(e, "phoneCode");
                              }}
                              isSearchable={true}
                              isMulti={false}
                              menuPortalTarget={document.body}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                              className="custom-react-select-container phoneCode w-100"
                              classNamePrefix="custom-react-select"
                            />
                          </div>
                          {/* <div className="pb-3"></div> */}

                          <div className="" style={{ width: "70%" }}>
                            <input
                              type="text"
                              placeholder="Mobile Number"
                              className="form-control form-control_gray"
                              minLength="8"
                              maxLength="15"
                              defaultValue={phone || ""}
                              onKeyPress={(e) => validateDigit(e)}
                              onChange={(e) => changeAddressBilling(e, "phone")}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary text-uppercase"
                  type="submit"
                  onClick={(e) => {
                    addUpdateAddress(
                      e,
                      isLogin ? loginDatas.member_id : RandomId,
                      uniqueId
                    );
                    const isFormValid =
                      fname &&
                      lname &&
                      city &&
                      phone &&
                      pincode &&
                      street &&
                      building &&
                      country?.value &&
                      phoneCode?.value &&
                      country.value !== "Select Your Country" &&
                      phoneCode.value !== "Phone Code" &&
                      phone.length >= 8 &&
                      phone.length <= 15 &&
                      pincode.length >= 5 &&
                      pincode.length <= 6;

                    if (isFormValid) {
                      setShowAddressModal(false);
                    }
                  }}
                  data-bs-dismiss={
                    ((fname &&
                      lname &&
                      city &&
                      phone &&
                      pincode &&
                      street &&
                      building &&
                      country?.value &&
                      phoneCode?.value) !== "" ||
                      undefined) &&
                    country?.value !== "Select Your Country" &&
                    phoneCode?.value !== "Phone Code" &&
                    phone?.length >= 8 &&
                    phone?.length <= 15 &&
                    pincode?.length >= 5 &&
                    pincode?.length <= 6
                      ? "modal"
                      : ""
                  }
                  aria-label="Close"
                >
                  {update ? "Update Billing Details" : "Add Billing Details"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
