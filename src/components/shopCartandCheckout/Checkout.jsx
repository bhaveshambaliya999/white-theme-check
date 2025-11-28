"use client";

const countries = [
  "Australia",
  "Canada",
  "United Kingdom",
  "United States",
  "Turkey",
];
import {
  extractNumber,
  isEmpty,
  jewelVertical,
  numberWithCommas,
  RandomId,
  safeParse,
} from "@/CommanFunctions/commanFunctions";
import commanService from "@/CommanService/commanService";
import Loader from "@/CommanUIComp/Loader/Loader";
import { useContextElement } from "@/context/Context";
import {
  appliedCoupon,
  couponCodeApplied,
  DefaultBillingAddress,
  discountCouponData,
  discountedPrice,
  displayPricesTotal,
  donationDataLists,
  stepperCompletedPage,
} from "@/Redux/action";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useRouter } from "next/router";
import Link from "next/link";
import Select from "react-select";
import { toast } from "react-toastify";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

export default function Checkout() {
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const reduxLoginData = useSelector((state) => state.loginData);

  const loginDatas =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("loginData")) || reduxLoginData
      : reduxLoginData;

  const discountedPrices = useSelector((state) => state.discountedPrice);
  const discountCouponDatas = useSelector((state) => state.discountCouponData);
  const reduxStoreCurrency = useSelector((state) => state.storeCurrency);
  const storeCurrencys =
    typeof window !== "undefined"
      ? sessionStorage.getItem("storeCurrency") || reduxStoreCurrency
      : reduxStoreCurrency;
  const couponCodeApplieds = useSelector((state) => state.couponCodeApplied);
  const donationDataListss = useSelector((state) => state.donationDataLists);
  const DefaultBillingAddresss = useSelector(
    (state) => state.DefaultBillingAddress
  );
  const appliedCoupons = useSelector((state) => state.appliedCoupon);

  const isLogin = Object.keys(loginDatas).length > 0;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { cartProducts, totalPrice } = useContextElement();
  const [selectedRegion, setSelectedRegion] = useState("");
  const [idDDActive, setIdDDActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab1, setActiveTab1] = useState(false);
  const [activeTab2, setActiveTab2] = useState(false);

  //address data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("");
  const [countryId, setCountryId] = useState("");
  const [countryShortCode, setCountryShortCode] = useState("");
  const [street, setStreet] = useState("");
  const [street2, setStreet2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [countryDataDrp, setCountryDataDrp] = useState([]);
  const [countryList, setCountryList] = useState([]);

  //Modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  // const [countryDataDrp, setCountryDataDrp] = useState([]);
  const [phoneCodeDataDrp, setPhoneCodeDataDrp] = useState([]);
  const [billingAddressData, setbillingAddressData] = useState({});

  const [storeAddressData, setStoreAddressData] = useState({});
  const [updateAddress, setUpdateAddress] = useState(false);
  const [billingUniqeID, setBillingUniqeID] = useState("");
  const [shipStoreId, setShipStoreId] = useState("");
  const [selectAddress, setselectAddress] = useState("");
  const [selectedBillingAddress, selectBillingAddress] = useState([]);
  const [shipToStoreAddressDataList, setShipToStoreAddressDataList] = useState(
    []
  );
  const [showBillingAddress, setShowBillingAddress] = useState(false);
  const [addressType, setAddressType] = useState(true);

  //payment
  const [paymentDataList, setPaymentDataList] = useState([]);
  const [storePaymentData, setStorePaymentData] = useState("");
  const [cartDataList, setCartDataList] = useState([]);
  const [allCartDataList, setAllCartdataList] = useState([]);

  //billing address
  const [billingChecked, setBillingChecked] = useState(false);
  const [billFirstName, setBillFirstName] = useState("");
  const [billLastName, setBillLastName] = useState("");
  const [billBuilding, setBillBuilding] = useState("");
  const [billStreet, setBillStreet] = useState("");
  const [billDescription, setBillDescription] = useState("");
  const [billBuildingName, setBillBuildingName] = useState("");
  const [billCountry, setBillCountry] = useState("");
  const [selectBillCountry, setSelectBillCountry] = useState("");
  const [billPhoneCode, setBillPhoneCode] = useState("");
  const [selectBillPhoneCode, setSelectBillPhoneCode] = useState("");
  const [billCity, setBillCity] = useState("");
  const [billState, setBillState] = useState("");
  const [billMobileNumber, setBillMobileNumber] = useState("");
  const [billZipCode, setBillZipCode] = useState("");

  //shipiping Data
  const [building, setBuilding] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [description, setDescription] = useState("");
  const [phoneCode, setPhoneCode] = useState("");

  const [accordionTabs, setAccordionTabs] = useState([]);
  const [orderPlaceButton, setOrderPlaceButton] = useState(false);

  //prices
  const [couponPrice, setCouponPrice] = useState("");
  const [storeNetPrice, setStoreNetPrice] = useState(0);
  const [storeOrgnPrice, setStoreOrgnlPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(
    discountCouponDatas.discount
  );
  const [displayPrice, setDisplayPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("");
  const [onetimeclick, setOneTimeClick] = useState(false);

  //csr
  const [donationDataList, setDonationDataList] = useState([]);

  const [CSRDisabled, setCSRDisabled] = useState(false);
  const [donationAmountArray, setDonationAmountArray] = useState([]);
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);

  //apply Coupon Code
  const [couponCode, setCouponCode] = useState("");
  const [discountData, setDiscountData] = useState(false);

  //shipping days
  const [shippingDayData, setShippingDayData] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [shippingTax, setShippingTax] = useState(0);

  const [taxIncludedInPrice, setTaxIncludedInPrice] = useState([0]);

  // useEffect(() => {
  //   const isReloading = localStorage.getItem("isReloading");

  //   // If we are coming from a hard reload, navigate to the desired route
  //   if (isReloading) {
  //     dispatch(stepperCompletedPage(1));
  //     dispatch(couponCodeApplied(false));
  //     navigate("/shop_cart");
  //     localStorage.removeItem("isReloading"); // Clear the flag
  //   }

  //   // Set the flag before the page unloads
  //   const handleBeforeUnload = () => {
  //     localStorage.setItem("isReloading", "true");
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [navigate]);

  useEffect(() => {
    let bootstrap;
    (async () => {
      if (typeof window !== "undefined") {
        bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");

        const modalElement = document.getElementById("exampleModal");
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement, { keyboard: false });
          showAddressModal ? modal.show() : modal.hide();
        }
      }
    })();
  }, [showAddressModal]);

  //shipping and billing tax and day
  const shippingDay = (unique_id, type) => {
    setShippingTax(0);
    setShippingDayData("");
    const obj = {
      a: "get_shipping_days",
      billing_id: unique_id,
      billing_type: type,
      consumer_id: loginDatas.member_id,
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      store_id: storeEntityIds.mini_program_id,
    };
    commanService.postLaravelApi("/CartMaster", obj).then((res) => {
      if (res.data.success === 1) {
        if (isEmpty(res.data.data) != "") {
          setShippingDayData(res.data.data);
          let dates = new Date(res.data.data);
          let newDate = new Date(dates).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
          });
          setExpectedDate(newDate);
        }
      }
    });
    cartData(unique_id, type);
    // obj.a = "get_tax1";
    // obj.currency = storeCurrencys;
    // commanService.postLaravelApi("/CartMaster", obj).then((res) => {
    //   var total = storeOrgnPrice;
    //   setDiscountData(false);
    //   setCouponCode("");
    //   setOneTimeClick(false);
    //   setShippingTax(0);
    //   if (res.data.success === 1) {
    //     if (isEmpty(res.data.data) != "" && res.data.data != 0) {
    //       setShippingTax(res.data.data);
    //       total = Number(total) + Number(res.data.data);
    //       setDisplayPrice(total);
    //     }
    //   }
    //   var foundationArray = [];
    //   var donationData = donationDataList;
    //   for (let c = 0; c < donationData.length; c++) {
    //     if (donationData[c]["checked"] == true) {
    //       total = Number(total) + Number(donationData[c]["donation_value"]);
    //       var datas = {
    //         foundation_project_id: donationData[c]["csr_id"],
    //         foundation_amount: donationData[c]["donation_value"],
    //       };
    //       foundationArray.push(datas);
    //     }
    //   }
    //   if (discountedPrices !== 0) {
    //     total = Number(total - discountedPrices);
    //   }
    //   setDisplayPrice(Number(total).toFixed(2));
    //   setStoreNetPrice(Number(total).toFixed(2));
    //   setDonationAmountArray(foundationArray);
    //   setDonationDataList([...donationData]);
    // });
  };

  const cartData = (unique_id, type) => {
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
      currency: storeCurrencys,
    };
    if (unique_id && type) {
      obj["billing_id"] = unique_id;
      obj["billing_type"] = type;
    }
    commanService.postLaravelApi("/CartMaster", obj).then((res) => {
      var total = storeOrgnPrice;
      setDiscountData(false);
      setCouponCode("");
      setOneTimeClick(false);
      setShippingTax(0);
      if (res.data.success === 1) {
        const data1 = [...res.data.data];
        let tax_total = 0;
        data1.forEach((element) => {
          tax_total += extractNumber(element.total_tax_amt);
        });

        if (isEmpty(tax_total) != "" && tax_total != 0) {
          setShippingTax(tax_total);
          if (data1.some((item) =>
            item?.data?.some(
              (elm) => Number(elm?.store_tax_included_in_price) !== 1
            )
          )) {
            total = Number(total) + Number(tax_total);
            setDisplayPrice(total);
          }
        }

        var foundationArray = [];
        var donationData = donationDataList;
        for (let c = 0; c < donationData.length; c++) {
          if (donationData[c]["checked"] == true) {
            // total = Number(total) + Number(donationData[c]["donation_value"]);
            var datas = {
              foundation_project_id: donationData[c]["csr_id"],
              foundation_amount: donationData[c]["donation_value"],
            };
            foundationArray.push(datas);
          }
        }
        // if (discountedPrices !== 0) {
        //   total = Number(total - discountedPrices);
        // }
        setDisplayPrice(Number(total).toFixed(2));
        // setStoreNetPrice(Number(total).toFixed(2));
        setDonationAmountArray(foundationArray);
        setDonationDataList([...donationData]);
      }
    });
  };

  const billingAddress = (key, value) => {
    if (key === "0") {
      setAddressType(true);
      if (billingChecked == true) {
        setShipStoreId("");
        setBillFirstName(value.first_name);
        setBillLastName(value.last_name);
        setBillBuilding(value.building);
        setBillBuildingName(value.address);
        setBillDescription(value.description);
        setBillStreet(value.street);
        setBillCity(value.city);
        setBillState(value.state);
        setBillCountry(value.country);
        setBillPhoneCode(value.country_code);
        setBillMobileNumber(value.mobile_no);
        setBillZipCode(value.pincode);
      }
      setShowBillingAddress(true);
      setbillingAddressData(value);
      setStoreAddressData({});
      setOrderPlaceButton(true);
    } else {
      setAddressType(false);
      if (billingChecked == true) {
        setBillFirstName("");
        setBillLastName("");
        setShipStoreId(value.store_id);
        setBillBuilding(value.building);
        setBillBuildingName(value.building_name);
        setBillDescription(value.description);
        setBillStreet(value.street);
        setBillCity(value.city_name);
        setBillState(value.state_name);
        setBillCountry(value.country_name);
        setBillPhoneCode(value.country_code);
        setBillMobileNumber(value.mobile);
        setBillZipCode(value.pincode);
      }
      setbillingAddressData({});
      setStoreAddressData(value);
      setOrderPlaceButton(true);
      setShowBillingAddress(true);
    }
  };

  const editAddress = (c) => {
    setFirstName(c.first_name);
    setLastName(c.last_name);
    setBuilding(c.building);
    setStreet(c.street);
    setCity(c.city);
    setState(c.state);
    setZipCode(c.pincode);
    // setCountry(c.country);
    // setPhoneCode(c.country_code);
    setCountryId(c.country_id);
    setCountryShortCode(c.country_short_code);
    setMobileNumber(c.mobile_no);
    for (let d = 0; d < countryDataDrp.length; d++) {
      if (countryDataDrp[d].name === c.country) {
        setCountry(countryDataDrp[d]);
      }
    }

    for (let d = 0; d < phoneCodeDataDrp.length; d++) {
      if (phoneCodeDataDrp[d].phonecode === c.country_code) {
        setPhoneCode(phoneCodeDataDrp[d]);
      }
    }
  };

  const onBillingAddressCheck = (e) => {
    if (showBillingAddress === false) {
      toast.error("Add Your Shipping Address");
    } else {
      setBillingChecked(e.target.checked);
      if (e.target.checked == false) {
        setBillFirstName("");
        setBillLastName("");
        setBillBuilding("");
        setBillBuildingName("");
        setBillDescription("");
        setBillStreet("");
        setBillCity("");
        setBillState("");
        setBillCountry("");
        setBillPhoneCode("");
        setBillMobileNumber("");
        setBillZipCode("");
        setSelectBillCountry("");
        setSelectBillPhoneCode("");
      } else {
        if (Object.keys(storeAddressData).length > 0) {
          setBillFirstName("");
          setBillLastName("");
          setBillBuilding(storeAddressData.building);
          setBillBuildingName(billingAddressData.building_name);
          setBillDescription(billingAddressData.description);
          setBillStreet(storeAddressData.street);
          setBillCity(storeAddressData.city_name);
          setBillState(storeAddressData.state_name);
          setBillCountry(storeAddressData.country_name);
          setBillPhoneCode(storeAddressData.country_code);
          setBillMobileNumber(storeAddressData.mobile);
          setBillZipCode(storeAddressData.pincode);
        } else if (Object.keys(billingAddressData).length > 0) {
          setBillFirstName(billingAddressData.first_name);
          setBillLastName(billingAddressData.last_name);
          setBillBuilding(billingAddressData.building);
          setBillBuildingName(billingAddressData.address);
          setBillDescription(billingAddressData.description);
          setBillStreet(billingAddressData.street);
          setBillCity(billingAddressData.city);
          setBillState(billingAddressData.state);
          setBillCountry(billingAddressData.country);
          setBillPhoneCode(billingAddressData.country_code);
          setBillMobileNumber(billingAddressData.mobile_no);
          setBillZipCode(billingAddressData.pincode);
        }
      }
      setStorePaymentData("");
    }
  };

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
            data[c]["checked"] = true;
            total = total + Number(data[c].donation_value);
            var datas = {
              foundation_project_id: data[c].csr_id,
              foundation_amount: data[c].donation_value,
            };
            foundationArray.push(datas);
          }
        }
        setDisplayPrice(Number(total).toFixed(2));
        setStoreNetPrice(Number(total).toFixed(2));
        setDonationAmountArray(foundationArray);
        setDonationDataList(data);
      }
    });
  };

  const addUpdateAddress = (key) => {
    const update_address = {
      a: "AddUpdateBilling",
      store_id: storeEntityIds.mini_program_id,
      unique_id: key === "0" ? billingUniqeID : "",
      company_name: "UPQOR",
      building: building,
      street: street,
      address: isEmpty(buildingName),
      description: isEmpty(description),
      country: isEmpty(country.value),
      country_id: countryId,
      country_code: isEmpty(phoneCode.value),
      country_short_code: countryShortCode,
      state: state,
      city: city,
      pincode_no: zipCode,
      mobile_no: mobileNumber,
      user_id: loginDatas.member_id,
      first_name: firstName,
      last_name: lastName,
    };
    if (
      ((firstName &&
        lastName &&
        city &&
        mobileNumber &&
        zipCode &&
        street &&
        building &&
        state &&
        country.value) !== "" ||
        undefined) &&
      mobileNumber.length >= 8 &&
      mobileNumber.length <= 15 &&
      zipCode.length >= 5 &&
      zipCode.length <= 6 &&
      isEmpty(phoneCode.value) != "" &&
      phoneCode.value != "Phone Code"
    ) {
      commanService
        .postLaravelApi("/BillingDetails", update_address)
        .then((res) => {
          if (res.data.success === 1) {
            setShowBillingAddress(true);
            addressData();
            setAccordionTabs(["0"]);
            setOrderPlaceButton(true);
            if (key === "0") {
              setUpdateAddress(false);
            } else {
              setUpdateAddress(true);
            }
            if (billingChecked == true) {
              setBillFirstName(firstName);
              setBillLastName(lastName);
              setBillBuilding(building);
              setBillStreet(street);
              setBillBuildingName(buildingName);
              setBillDescription(description);
              setBillCity(city);
              setBillState(state);
              setBillCountry(country.value);
              setBillPhoneCode(phoneCode.value);
              setBillMobileNumber(mobileNumber);
              setBillZipCode(zipCode);
            }

            toast.success(res.data.message);
          } else {
            toast.error(res.data.message);
          }
        })
        .catch(() => { });
    } else {
      if (!firstName) {
        toast.error("Enter Your First Name");
      } else if (!lastName) {
        toast.error("Enter Your Last Name");
      } else if (!building) {
        toast.error("Enter Your Building");
      } else if (!street) {
        toast.error("Enter Your Street");
      } else if (!city) {
        toast.error("Enter Your City");
      } else if (!state) {
        toast.error("Enter Your State");
      } else if (!country.value) {
        toast.error("Select Your Country");
      } else if (!phoneCode.value || phoneCode.value == "Phone Code") {
        toast.error("Phone Code Required");
      } else if (!mobileNumber) {
        toast.error("Mobile Number Required");
      } else if (mobileNumber.length < 8) {
        toast.error("Minimum 8 digit is Required in Phone Number");
      } else if (mobileNumber.length > 15) {
        toast.error("Maximum 15 digit is Required in Phone Number");
      } else if (!zipCode) {
        toast.error("Enter Your Pincode");
      } else if (zipCode.length < 5) {
        toast.error("Minimum 5 digit is Required in Pincode");
      } else if (zipCode.length > 6) {
        toast.error("Maximum 6 digit is Required in Pincode");
      }
    }
  };

  const clickAddressModal = (value) => {
    setShowAddressModal(value);
  };

  const shipToStoreAddress = () => {
    const obj = {
      a: "GetShipToStoreAddress",
      store_id: storeEntityIds.mini_program_id,
    };
    commanService.postLaravelApi("/BillingDetails", obj).then((res) => {
      if (res.data.success === 1) {
        var storeAddressData = res?.data?.data;
        if (storeAddressData?.length > 0) {
          setShipToStoreAddressDataList(storeAddressData);
        }
      }
    });
  };

  const phoneCodeSetDrp = () => {
    var pdata = JSON.parse(sessionStorage.getItem("country_data"));
    for (let c = 0; c < pdata.length; c++) {
      pdata[c]["value"] = pdata[c]["phonecode"];
      pdata[c]["label"] = pdata[c]["phonecode"] + " - " + pdata[c]["name"];
    }
    pdata.splice(0, 0, { value: "", label: "Phone Code" });
    var data = pdata.filter((item) => item.value === billPhoneCode);
    // if(billingChecked === true){
    setSelectBillPhoneCode(data[0]);
    // }
    setPhoneCodeDataDrp(pdata);
  };

  const addAddress = () => {
    setFirstName("");
    setLastName("");
    setBuilding("");
    setStreet("");
    setCity("");
    setState("");
    setZipCode("");
    setCountry("");
    setCountryId("");
    setPhoneCode("");
    setCountryShortCode("");
    setMobileNumber("");
  };

  const countryDrp = () => {
    const GetCountry = {
      a: "getCountry",
      SITDeveloper: "1",
    };
    commanService
      .postApi("/TechnicalManagement", GetCountry)
      .then((res) => {
        if (res.data.success == 1) {
          sessionStorage.setItem("country_data", JSON.stringify(res.data.data));
          countrySetDrp();
        }
      })
      .catch(() => { });
  };

  // const countrySetDrp = () => {
  //   var data = JSON.parse(sessionStorage.getItem("country_data"));
  //   for (let c = 0; c < data.length; c++) {
  //     data[c].value = data[c].name;
  //     data[c].label = data[c].name;
  //   }
  //   data.splice(0, 0, { value: "", label: "Select Your Country" });
  //   setCountryDataDrp(data);
  // };

  const countrySetDrp = () => {
    var data = JSON.parse(sessionStorage.getItem("country_data"));
    for (let c = 0; c < data.length; c++) {
      data[c].value = data[c].name;
      data[c].label = data[c].name;
    }
    data.splice(0, 0, { value: "", label: "Select Your Country" });
    setCountryDataDrp(data);
    const datas = data.filter((item) => item.value === billCountry);
    setSelectBillCountry(datas[0]);
    setTimeout(() => {
      phoneCodeSetDrp();
    });
  };

  const paymentData = () => {
    const paymentObj = {
      a: "getPaymentMethod",
      store_id: storeEntityIds.mini_program_id,
      type: loginDatas.user_type,
    };

    commanService
      .postLaravelApi("/PaymentProvider", paymentObj)
      .then((resp) => {
        if (resp.data.success === 1) {
          setPaymentDataList(resp.data.data);
        }
      });
  };

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

  const paymentMethodSelect = (code) => {
    if (showBillingAddress === false) {
      toast.error("Add Your Address");
    } else {
      if (billingChecked === false) {
        if (!billFirstName) {
          toast.error("Enter Your First Name");
        } else if (!billLastName) {
          toast.error("Enter Your Last Name");
        } else if (!billBuilding) {
          toast.error("Enter Your Building");
        } else if (!billStreet) {
          toast.error("Enter Your Street");
        } else if (!billCity) {
          toast.error("Enter Your City");
        } else if (!billState) {
          toast.error("Enter Your State");
        } else if (!billCountry) {
          toast.error("Select Your Country");
        } else if (!billPhoneCode) {
          toast.error("Phone Code Required");
        } else if (!billMobileNumber) {
          toast.error("Mobile Number Required");
        } else if (billMobileNumber.length < 8) {
          toast.error("Minimum 8 digit is Required in Phone Number");
        } else if (billMobileNumber.length > 15) {
          toast.error("Maximum 15 digit is Required in Phone Number");
        } else if (!billZipCode) {
          toast.error("Enter Your Pincode");
        } else if (billZipCode.length < 5) {
          toast.error("Minimum 5 digit is Required in Pincode");
        } else if (billZipCode.length > 6) {
          toast.error("Maximum 6 digit is Required in Pincode");
        } else {
          setStorePaymentData(code);
        }
      } else {
        if (!selectBillCountry) {
          toast.error("Select Your Country");
        } else if (!billPhoneCode) {
          toast.error("Phone Code Required");
        } else if (showBillingAddress === false) {
          toast.error("Add Your Address");
        } else {
          setStorePaymentData(code);
        }
      }
    }
  };

  useEffect(() => {
    if (billingChecked === true) {
      countryDrp();
    } else {
      setBillFirstName("");
      setBillLastName("");
      setBillBuilding("");
      setBillBuildingName("");
      setBillDescription("");
      setBillStreet("");
      setBillCity("");
      setBillState("");
      setBillCountry("");
      setBillPhoneCode("");
      setBillMobileNumber("");
      setBillZipCode("");
      setSelectBillCountry("");
      setSelectBillPhoneCode("");
    }
  }, [billingChecked]);

  useEffect(() => {
    window.scrollTo(0, 0);
    paymentData();
    let taxTotal = 0;
    cartProducts.forEach((element) => {
      taxTotal += Number(element?.total_tax_amt);
    });
    var total_price = 0;
    if (
      Number(cartProducts?.[0]?.data?.[0]?.store_tax_included_in_price) !== 1
    ) {
      total_price = Number(Number(totalPrice) + Number(taxTotal)).toFixed(2);
    } else {
      total_price = totalPrice;
    }
    setShippingTax(taxTotal);
    setCartDataList(cartProducts);
    countryDrp();
    addressData();
    getDataDonation(Number(totalPrice));
    // setStoreNetPrice(Number(total_price).toFixed(2));
    setStoreOrgnlPrice(Number(totalPrice).toFixed(2));
    setDisplayPrice(Number(total_price).toFixed(2));
    setAllCartdataList(cartProducts);
    setActiveTab1(true);
    setTaxIncludedInPrice(
      cartProducts?.[0]?.data?.[0]?.store_tax_included_in_price
    );
  }, [totalPrice]);

  const checkDiamondAvailability = (final_item_data, json_data) => {
    const checkoutObj = {
      a: "CustomerWiseAvailableDiamond",
      json_data: JSON.stringify(json_data),
      store_type: "B2C",
      store_id: storeEntityIds.mini_program_id,
      secret_key: storeEntityIds.secret_key,
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      business_unit_id: storeEntityIds.business_unit_id,
      customer_id: storeEntityIds.customer_id,
      SITDeveloper: 1,
      origin: storeEntityIds.cmp_origin,
    };
    commanService.postApi("/SalesOrder", checkoutObj).then((res) => {
      if (res.data.success === 1) {
        processTransactionApi(final_item_data, json_data);
      } else {
        toast.error(res.data.message);
        setLoading(false);
      }
    });
  };

  const LoadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async (option, opt2) => {

    const res = await LoadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    window.open(option, '_self');
  };

  const processTransactionApi = (final_item_data, json_data) => {
    var foundation_project_id = "";
    var foundation_amount = "";
    if (donationDataListss?.[0]?.checked === true) {
      foundation_project_id = donationDataListss[0].csr_id;
      foundation_amount = donationDataListss[0].donation_value;
    }
    const data = {
      a: "ProcessTransaction",
      store_id: storeEntityIds.mini_program_id,
      member_id: isLogin ? loginDatas.member_id : RandomId,
      origin: storeEntityIds.cmp_origin,
      product_details: JSON.stringify(final_item_data),
      coupen_code:
        couponCodeApplieds === true ? appliedCoupons.toUpperCase() : "",
      billing_id: selectAddress,
      discount_amount: discountedPrices,
      currency: storeCurrencys,
      net_amount: (
        Math.round(
          Number(displayPrice) +
          (donationDataListss?.[0]?.checked === true
            ? Number(
              donationDataListss?.[0]?.donation_value_order_price !== "Yes"
                ? donationDataListss?.[0]?.donation_value
                : 0
            )
            : 0) -
          Number(discountedPrices ?? 0)
        )
      ).toFixed(2),
      foundation_project_id: isEmpty(foundation_project_id),
      foundation_amount: isEmpty(foundation_amount),
      json_data: JSON.stringify(json_data),
      store_type: "B2C",
      order_type: "DIR",
      first_name:
        Object.keys(billingAddressData).length > 0
          ? `${billingAddressData.first_name}`
          : loginDatas.first_name,
      surname:
        Object.keys(billingAddressData).length > 0
          ? `${billingAddressData.last_name}`
          : loginDatas.last_name,
      email: loginDatas.email,
      contact: loginDatas.mobile_no,
      tax_amount: Number(shippingTax).toFixed(2),
      delivery_date: shippingDayData,
      address_type: Object.keys(billingAddressData).length > 0 ? "0" : "2",
      shipping_fname:
        Object.keys(billingAddressData).length > 0
          ? billingAddressData.first_name
          : storeAddressData.name,
      shipping_lname:
        Object.keys(billingAddressData).length > 0
          ? billingAddressData.last_name
          : "",
      shipping_appartment:
        Object.keys(billingAddressData).length > 0
          ? billingAddressData.building
          : storeAddressData.building,
      shipping_street:
        Object.keys(billingAddressData).length > 0
          ? billingAddressData.street
          : storeAddressData.street,
      shipping_building_name:
        Object.keys(billingAddressData).length > 0
          ? billingAddressData.address
          : storeAddressData.building_name,
      shipping_description:
        Object.keys(billingAddressData).length > 0
          ? billingAddressData.description
          : storeAddressData.description,
      shipping_city:
        Object.keys(billingAddressData).length > 0
          ? billingAddressData.city
          : storeAddressData.city_name,
      shipping_state:
        Object.keys(billingAddressData).length > 0
          ? billingAddressData.state
          : storeAddressData.state_name,
      shipping_country:
        Object.keys(billingAddressData).length > 0
          ? billingAddressData.country
          : storeAddressData.country_name,
      shipping_country_code:
        Object.keys(billingAddressData).length > 0
          ? billingAddressData.country_code
          : storeAddressData.country_code,
      shipping_phone:
        Object.keys(billingAddressData).length > 0
          ? billingAddressData.mobile_no
          : storeAddressData.mobile,
      shipping_zipcode:
        Object.keys(billingAddressData).length > 0
          ? billingAddressData.pincode
          : storeAddressData.pincode,
      ship_to_store_id:
        Object.keys(billingAddressData).length > 0 ? "" : storeAddressData && storeAddressData.store_id ? isEmpty(storeAddressData.store_id) : isEmpty(shipStoreId),
      billing_fname: isEmpty(billFirstName),
      billing_lname: isEmpty(billLastName),
      billing_appartment: isEmpty(billBuilding),
      billing_street: isEmpty(billStreet),
      billing_building_name: isEmpty(billBuildingName),
      billing_description: isEmpty(billDescription),
      billing_city: isEmpty(billCity),
      billing_state: isEmpty(billState),
      billing_country: isEmpty(billCountry),
      billing_country_code: isEmpty(billPhoneCode),
      billing_zipcode: isEmpty(billZipCode),
      billing_phone: isEmpty(billMobileNumber),
      secret_key: isEmpty(storeEntityIds.secret_key),
    };

    if (couponCode !== "") {
      data.discount_amount = isEmpty(discountPrice.toFixed(2)).toLocaleString();
    }
    if (isEmpty(storePaymentData) !== "") {
      setLoading(true);
      commanService.postLaravelApi("/PaymentResponse", data).then((res) => {
        if (res.data.success === 1) {
          // dispatch(displayPricesTotal(0));
          // dispatch(donationDataLists([]));
          // dispatch(couponCodeApplied(false));
          // dispatch(discountCouponData({}));
          // dispatch(appliedCoupon(""));
          // dispatch(discountedPrice(""));
          dispatch(stepperCompletedPage(3));

          if (res.data.data.code === "PAYPAL") {
            window.open(res.data.data.result.payment_link, "_self");
            // setLoading(false);
          } else if (res.data.data.code === "RAZOR") {
            // setLoading(false);
            displayRazorpay(res.data.data.result, res.data.data.order_id);
          } else if (res.data.data.code === "STRIPE") {
            setLoading(false);
            // stripePayment(res.data.data.result, res.data.data.order_id);
          } else {
            toast.success("You have Selected Card Type.");
          }
        } else {
          setLoading(false);
          toast.error(res.data.message);
        }
      });
    } else {
      toast.error("Please Select Payment Method.");
      setLoading(false);
    }
  };

  const orderPlace = () => {
    var final_item_data = [];
    var cart_unique_id = [];
    var diamo_data = [];
    var ldiam_data = [];
    var dataMap = {}; // Use dataMap for dynamic categorization

    // Iterate over the cart data
    for (let c = 0; c < allCartDataList.length; c++) {
      cart_unique_id.push(allCartDataList[c].unique_id);
      var data1 = {
        id: allCartDataList[c].unique_id,
        name: allCartDataList[c].product_name,
        image: allCartDataList[c].data[0].image,
        quantity: allCartDataList[c].data[0].item_qty,
        amount: allCartDataList[c].item_price,
        currency: storeCurrencys,
      };
      var subdata = allCartDataList[c].data;
      var type = "SINGLE";
      var ref_id = "";

      if (subdata?.length > 1) {
        type = "DIY";
        ref_id = allCartDataList[c].unique_id;
      }

      // Loop through each item in the subdata
      for (let e = 0; e < subdata.length; e++) {
        // If it's a DIAMO-related item
        if (
          subdata[e].vertical_code === "DIAMO" ||
          subdata[e].vertical_code === "LGDIA" ||
          subdata[e].vertical_code === "GEDIA"
        ) {
          var diamo = {
            id: subdata[e].cert_no,
            ref_id: ref_id,
            type: type,
            vertical_code: subdata[e].vertical_code,
            price: subdata[e].item_price,
            item_group: subdata[e].item_group_code,
            stone_position: subdata[e].stone_position,
            stone_sequence: subdata[e].stone_sequence,
            product_sku: subdata[e].product_sku,
            product_variant: subdata[e].cert_no,
            product_detail: subdata[e].product_detail,
            so_is_diy: subdata[e].product_diy === "DIY" ? "1" : "0",
            c_custom_duty_charge: subdata[e]?.c_custom_duty_charge,
            c_shipping_handling: subdata[e]?.c_shipping_handling,
            c_tax1: subdata[e]?.c_tax1,
            c_tax2: subdata[e]?.c_tax2,
            c_tax_refund: subdata[e]?.c_tax_refund,
          };
          diamo_data.push(diamo);
        }

        // For all other jewel-related items (not DIAMO)
        if (
          subdata[e].vertical_code !== "DIAMO" &&
          subdata[e].vertical_code !== "LGDIA" &&
          subdata[e].vertical_code !== "LDIAM" &&
          subdata[e].vertical_code !== "GEMST" &&
          subdata[e].vertical_code !== "GEDIA"
        ) {
          var jewel = {
            campaign_id: isEmpty(subdata[e].campaign_id),
            item_id: subdata[e].item_id,
            product_variant: subdata[e].pv_unique_id,
            quantity: subdata[e].item_qty,
            vertical_code: subdata[e].vertical_code,
            ref_id: ref_id,
            type: type,
            price: subdata[e].item_price,
            item_group: subdata[e].item_group_code,
            stone_position: subdata[e].stone_position,
            stone_sequence: subdata[e].stone_sequence,
            product_sku: subdata[e].product_sku,
            product_detail: subdata[e].product_detail,
            product_variant_data: subdata[e].product_variant,
            short_summary: JSON.stringify(subdata[e].short_summary),
            so_is_diy: subdata[e].product_diy === "DIY" ? "1" : "0",
            // engraving_type: subdata[e].eng_font ? subdata[e].eng_font : "",
            // engraving_text: subdata[e].eng_text ? subdata[e].eng_text : "",
            // engraving_price: subdata[e].eng_text ? (subdata[e].eng_price ? subdata[e].eng_price : "") : 0,
            // engraving_currency: subdata[e].eng_currency ? subdata[e].eng_currency : "",
            // engraving_font_size: subdata[e].eng_font_size ? subdata[e].eng_font_size : "",
            // engraving_min_character: subdata[e].eng_min_character ? subdata[e].eng_min_character : "",
            // engraving_max_character: subdata[e].eng_max_character ? subdata[e].eng_max_character : "",
            // engraving_unique_id: subdata[e]?.eng_text ? subdata[e]?.engraving_unique_id : "",
            // embossing_unique_id: subdata[e].embossing_unique_id,
            // embossing_json: subdata[e].embossing_json,
            // is_embossing: subdata[e].embossing_json !== "" ? safeParse(subdata[e].embossing_json)?.some((item) => item.embImage !== "") ? "1" : "0" : "0",
            // embossing_image: safeParse(subdata[e].embossing_json)?.some((item) => item.embImage !== "") === true ? subdata[e].embossing_json : "",
            // embossing_price: safeParse(subdata[e].embossing_json)?.filter((item) => item.embImage !== "")[0]?.price ?? "",
            // embossing_currency: safeParse(subdata[e].embossing_json)?.filter((item) => item.embImage !== "")[0]?.currency ?? "",
            c_custom_duty_charge: subdata[e]?.c_custom_duty_charge,
            c_shipping_handling: subdata[e]?.c_shipping_handling,
            c_tax1: subdata[e]?.c_tax1,
            c_tax2: subdata[e]?.c_tax2,
            c_tax_refund: subdata[e]?.c_tax_refund,
          };

          const serviceData = [];
          if (safeParse(subdata[e].service_json)?.length) {
            safeParse(subdata[e].service_json).forEach((element) => {
              const obj = {
                currency: element?.currency,
                font_size: element?.font_size,
                image:
                  element.service_code === "EMBOSSING" ? element.image : "",
                is_selected: element?.is_selected,
                max_character: element?.max_character,
                min_character: element?.min_character,
                price: element?.price,
                service_code: element?.service_code,
                service_name: element?.service_name,
                text: element?.text,
                type: element?.type,
                unique_id: element?.unique_id,
                service_type: element?.service_type,
              };
              if (
                element.service_code === "ENGRAVING" &&
                isEmpty(element.text) !== ""
              ) {
                serviceData.push(obj);
              } else if (
                element.service_code === "EMBOSSING" &&
                element.image.length > 0 &&
                element.image.some((img, h) => img.embImage !== "") === true
              ) {
                serviceData.push(obj);
              } else if (
                element.service_code !== "ENGRAVING" &&
                element.service_code !== "EMBOSSING" &&
                element.is_selected == "1"
              ) {
                serviceData.push(obj);
              }
            });
            jewel.service_data = serviceData.length > 0 ? serviceData : "";
          }

          if (isEmpty(subdata[e].offer_code) !== "") {
            jewel.offer_code = subdata[e]?.offer_code;
            jewel.offer_discount_price = subdata[e]?.discount_price;
            jewel.offer_type = subdata[e]?.offer_type;
            jewel.offer_discount = subdata[e]?.offer_discount;
          }

          // Dynamically add to the corresponding vertical_code category in dataMap
          if (!dataMap[subdata[e].vertical_code]) {
            dataMap[subdata[e].vertical_code] = [];
          }
          dataMap[subdata[e].vertical_code].push(jewel);
        }

        // For LDIAM and GEMST (using the same logic as DIAMO)
        if (
          subdata[e].vertical_code === "LDIAM" ||
          subdata[e].vertical_code === "GEMST"
        ) {
          var ldiam = {
            item_id: subdata[e].item_id,
            product_variant: subdata[e].pv_unique_id,
            quantity: subdata[e].item_qty,
            ref_id: ref_id,
            vertical_code: subdata[e].vertical_code,
            type: type,
            price: subdata[e].item_price,
            item_group: subdata[e].item_group_code,
            stone_position: subdata[e].stone_position,
            stone_sequence: subdata[e].stone_sequence,
            product_sku: subdata[e].product_sku,
            product_detail: subdata[e].product_detail,
            product_variant_data: subdata[e].product_variant,
            so_is_diy: subdata[e].product_diy === "DIY" ? "1" : "0",
            c_custom_duty_charge: subdata[e]?.c_custom_duty_charge,
            c_shipping_handling: subdata[e]?.c_shipping_handling,
            c_tax1: subdata[e]?.c_tax1,
            c_tax2: subdata[e]?.c_tax2,
            c_tax_refund: subdata[e]?.c_tax_refund,
          };
          ldiam_data.push(ldiam);
        }
      }

      final_item_data.push(data1);
    }

    // Now create json_data dynamically from dataMap
    var json_data = { ...dataMap, DIAMO: diamo_data, LDIAM: ldiam_data };

    // Check if DIAMO data exists and process accordingly
    if (diamo_data?.length > 0) {
      setLoading(true);
      checkDiamondAvailability(final_item_data, json_data);
    } else {
      setLoading(true);
      processTransactionApi(final_item_data, json_data);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="checkout-form">
          <div className="billing-info__wrapper">
            <div className="accordion" id="accordionExample">
              <div className="accordion-item">
                <div className="billing-address-box">
                  <div className="shipping_billing">
                    <div className="accordion-header">
                      <h4 className="profile-title mb-0">Shipping Address</h4>
                    </div>
                  </div>

                  {showBillingAddress && (
                    <div className="shipping_billing_add">
                      {Object.keys(storeAddressData).length > 0 ? (
                        <React.Fragment>
                          <h4 className="add-title fs-16px mb-5px">
                            {storeAddressData.name}
                          </h4>
                          <p className="fs-13px fw-normal mb-5px">
                            {storeAddressData.building},
                            {isEmpty(storeAddressData.address) != "" ? (
                              <>{storeAddressData.address},</>
                            ) : (
                              ""
                            )}{" "}
                            {storeAddressData.street},
                            {isEmpty(storeAddressData.description) != "" ? (
                              <>{storeAddressData.description},</>
                            ) : (
                              ""
                            )}
                            {storeAddressData.city_name} -{" "}
                            {storeAddressData.pincode},
                            {storeAddressData.state_name},
                            {storeAddressData.country_name}.
                          </p>
                          <h6 className="fs-13px">
                            Mobile :{" "}
                            <span className="fw-normal">
                              {storeAddressData.country_code}{" "}
                              {storeAddressData.mobile}
                            </span>
                          </h6>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          {Object.keys(billingAddressData).length > 0 && (
                            <React.Fragment>
                              <h4 className="mb-2 fs-18">
                                {billingAddressData.first_name}{" "}
                                {billingAddressData.last_name}
                              </h4>
                              <p className="mb-2">
                                {billingAddressData.building},
                                {isEmpty(billingAddressData.address) != "" ? (
                                  <>{billingAddressData.address},</>
                                ) : (
                                  ""
                                )}
                                {billingAddressData.street},
                                {isEmpty(billingAddressData.description) !=
                                  "" ? (
                                  <>{billingAddressData.description},</>
                                ) : (
                                  ""
                                )}
                                {billingAddressData.city} -{" "}
                                {billingAddressData.pincode},
                                {billingAddressData.state},
                                {billingAddressData.country}.
                              </p>
                              <h6 className="mb-2 fs-15">
                                Mobile :{" "}
                                <span className="fw-normal">
                                  {billingAddressData.country_code}{" "}
                                  {billingAddressData.mobile_no}
                                </span>
                              </h6>
                            </React.Fragment>
                          )}
                        </React.Fragment>
                      )}
                    </div>
                  )}

                  <div className="shipping_billing_btn">
                    <div
                      data-toggle="modal"
                      data-target="#exampleModal"
                      className="btn btn-primary"
                      onClick={() => {
                        addAddress();
                        shipToStoreAddress();
                        setAccordionTabs([0]);
                        clickAddressModal(true);
                        setActiveTab1(true);
                        setActiveTab2(false);
                      }}
                    >
                      Add Address
                    </div>
                  </div>
                </div>

                <div
                  id="collapseOne"
                  className={`accordion-collapse collapse ${showBillingAddress === false ||
                    Object.keys(storeAddressData).length === 0
                    ? "show"
                    : ""
                    } border-0 p-0`}
                  data-bs-parent="#accordionExample"
                >
                  {Object.keys(billingAddressData).length === 0 &&
                    Object.keys(storeAddressData).length === 0 ? (
                    <>
                      <div className="accordion-body p-0">
                        <div className="mt-2">
                          <div className="row">
                            <div className="col-12">
                              <div className="d-flex align-items-center justify-content-between">
                                <h4 className="fs-18px fw-500 mb-3 profile-title">
                                  Add Shipping Address
                                </h4>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="row">
                                <div className="col-12 col-lg-6 mb-3">
                                  <div className="mb-20px">
                                    <label className="fs-16px fw-500 profile-sub-heading">
                                      First Name <span className="asteriskDot">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={firstName}
                                      placeholder="Enter Your First Name"
                                      className="form-control"
                                      onChange={(e) =>
                                        setFirstName(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-12 col-lg-6 mb-3">
                                  <div className="mb-20px">
                                    <label className="fs-16px fw-500 profile-sub-heading">
                                      Last Name <span className="asteriskDot">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={lastName}
                                      placeholder="Enter Your Last Name"
                                      className="form-control"
                                      onChange={(e) =>
                                        setLastName(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-12 col-lg-6 mb-3">
                                  <div className="mb-20px">
                                    <label className="fs-16px fw-500 profile-sub-heading">
                                      Enter Building <span className="asteriskDot">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={building}
                                      placeholder="Enter Building"
                                      className="form-control"
                                      onChange={(e) =>
                                        setBuilding(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-12 col-lg-6 mb-3">
                                  <div className="mb-20px">
                                    <label className="fs-16px fw-500 profile-sub-heading">
                                      Enter Building Name
                                    </label>
                                    <input
                                      type="text"
                                      value={buildingName}
                                      placeholder="Enter Building Name"
                                      className="form-control"
                                      onChange={(e) =>
                                        setBuildingName(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-12 col-lg-6 mb-3">
                                  <div className="mb-20px">
                                    <label className="fs-16px fw-500 profile-sub-heading">
                                      Street <span className="asteriskDot">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={street}
                                      placeholder="Enter Street"
                                      className="form-control"
                                      onChange={(e) =>
                                        setStreet(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-12 col-lg-6 mb-3">
                                  <div className="mb-20px">
                                    <label className="fs-16px fw-500 profile-sub-heading">
                                      Enter Landmark
                                    </label>
                                    <input
                                      type="text"
                                      value={description}
                                      placeholder="Enter Landmark"
                                      className="form-control"
                                      onChange={(e) =>
                                        setDescription(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-12 col-lg-6 mb-3">
                                  <div className="mb-20px">
                                    <label className="fs-16px fw-500 profile-sub-heading">
                                      City <span className="asteriskDot">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={city}
                                      placeholder="Enter City"
                                      className="form-control"
                                      onChange={(e) => setCity(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div className="col-12 col-lg-6 mb-3">
                                  <div className="mb-20px">
                                    <label className="fs-16px fw-500 profile-sub-heading">
                                      State <span className="asteriskDot">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={state}
                                      placeholder="Enter State"
                                      className="form-control"
                                      onChange={(e) => setState(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div className="col-12 col-lg-6 mb-3 custome-select custome-select-bg">
                                  <div className="mb-20px">
                                    <div>
                                      <label className="fs-16px fw-500 profile-sub-heading">
                                        Country <span className="asteriskDot">*</span>
                                      </label>
                                      <Select
                                        options={countryDataDrp}
                                        placeholder="Select Your Country"
                                        value={country}
                                        onChange={(e) => {
                                          setCountry(e);
                                          setCountryShortCode(e.sortname);
                                          setCountryId(e.id);
                                        }}
                                        isSearchable={true}
                                        isMulti={false}
                                        menuPortalTarget={document.body}
                                        className="custom-react-select-container"
                                        styles={{
                                          menuPortal: (base) => ({
                                            ...base,
                                            zIndex: 9999,
                                            // height: 35,
                                            // maxHeight: 35,
                                          }),
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 col-lg-6 mb-3 custome-select custome-select-bg">
                                  <div className="mb-20px">
                                    <label className="fs-16px fw-500 profile-sub-heading">
                                      Phone Code/Mobile Number <span className="asteriskDot">*</span>
                                    </label>
                                    <div className="input-group">
                                      <span
                                        className="me-2"
                                        style={{ width: "150px" }}
                                      >
                                        <Select
                                          options={phoneCodeDataDrp}
                                          placeholder="Phone Code"
                                          value={phoneCode}
                                          onChange={(e) => {
                                            setPhoneCode(e);
                                          }}
                                          isSearchable={true}
                                          isMulti={false}
                                          menuPortalTarget={document.body}
                                          className="custom-react-select-container phoneCode address"
                                          styles={{
                                            menuPortal: (base) => ({
                                              ...base,
                                              zIndex: 9999,
                                            }),
                                          }}
                                        />
                                      </span>
                                      <input
                                        type="number"
                                        placeholder="Enter Phone Number"
                                        value={mobileNumber}
                                        className="form-control rounded-0"
                                        onChange={(e) => {
                                          setMobileNumber(e.target.value);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 col-lg-6 mb-3">
                                  <div className="mb-20px">
                                    <label className="fs-16px fw-500 profile-sub-heading">
                                      Pincode <span className="asteriskDot">*</span>
                                    </label>
                                    <input
                                      type="number"
                                      value={zipCode}
                                      placeholder="Enter Pincode"
                                      className="form-control"
                                      onChange={(e) =>
                                        setZipCode(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-end">
                        {!updateAddress ? (
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => addUpdateAddress("1")}
                          >
                            Submit
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => addUpdateAddress("0")}
                          >
                            Update
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div className="row">
                  <div className="col-12">
                    {((showBillingAddress === true ||
                      Object.keys(storeAddressData).length > 0) && addressType) ? (
                      <div className="d-flex mb-2">
                        <input
                          type="checkbox"
                          checked={billingChecked}
                          onChange={(e) => {
                            onBillingAddressCheck(e);

                            // setSelectBillCountry("");
                            // setSelectBillPhoneCode("");
                          }}
                          className="me-2"
                        />{" "}
                        Billing address same as shipping address.
                      </div>
                    ) : (
                      ""
                    )}
                    {billingChecked == false ||
                      Object.keys(billingAddressData).length > 0 ? (
                      <div className="d-flex align-items-center justify-content-between my-3">
                        <h4 className="fs-18px fw-400 my-2 profile-title">
                          Billing Address
                        </h4>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  {billingChecked == false ||
                    Object.keys(billingAddressData).length > 0 ? (
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 col-lg-6 mb-3">
                          <div className="mb-20px">
                            <label className="fs-16px fw-500 profile-sub-heading">
                              First Name <span className="asteriskDot">*</span>
                            </label>
                            <input
                              type="text"
                              value={billFirstName}
                              placeholder="Enter Your First Name"
                              className="form-control"
                              onChange={(e) => {
                                setBillFirstName(e.target.value);
                                setStorePaymentData("");
                                // setBillingChecked(false);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-lg-6 mb-3">
                          <div className="mb-20px">
                            <label className="fs-16px fw-500 profile-sub-heading">
                              Last Name <span className="asteriskDot">*</span>
                            </label>
                            <input
                              type="text"
                              value={billLastName}
                              placeholder="Enter Your Last Name"
                              className="form-control"
                              onChange={(e) => {
                                setBillLastName(e.target.value);
                                setStorePaymentData("");
                                // setBillingChecked(false);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-lg-6 mb-3">
                          <div className="mb-20px">
                            <label className="fs-16px fw-500 profile-sub-heading">
                              Enter Building <span className="asteriskDot">*</span>
                            </label>
                            <input
                              type="text"
                              value={billBuilding}
                              placeholder="Enter Building"
                              className="form-control"
                              onChange={(e) => {
                                setBillBuilding(e.target.value);
                                setStorePaymentData("");
                                // setBillingChecked(false);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-lg-6 mb-3">
                          <div className="mb-20px">
                            <label className="fs-16px fw-500 profile-sub-heading">
                              Enter Building Name
                            </label>
                            <input
                              type="text"
                              value={billBuildingName}
                              placeholder="Enter Building Name"
                              className="form-control"
                              onChange={(e) => {
                                setBillBuildingName(e.target.value);
                                setStorePaymentData("");
                                // setBillingChecked(false);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-lg-6 mb-3">
                          <div className="mb-20px">
                            <label className="fs-16px fw-500 profile-sub-heading">
                              Street <span className="asteriskDot">*</span>
                            </label>
                            <input
                              type="text"
                              value={billStreet}
                              placeholder="Enter Street"
                              className="form-control"
                              onChange={(e) => {
                                setBillStreet(e.target.value);
                                setStorePaymentData("");
                                // setBillingChecked(false);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-lg-6 mb-3">
                          <div className="mb-20px">
                            <label className="fs-16px fw-500 profile-sub-heading">
                              Enter Landmark
                            </label>
                            <input
                              type="text"
                              value={billDescription}
                              placeholder="Enter Landmark"
                              className="form-control"
                              onChange={(e) => {
                                setBillDescription(e.target.value);
                                setStorePaymentData("");
                                // setBillingChecked(false);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-lg-6 mb-3">
                          <div className="mb-20px">
                            <label className="fs-16px fw-500 profile-sub-heading">
                              City <span className="asteriskDot">*</span>
                            </label>
                            <input
                              type="text"
                              value={billCity}
                              placeholder="Enter City"
                              className="form-control"
                              onChange={(e) => {
                                setBillCity(e.target.value);
                                setStorePaymentData("");
                                // setBillingChecked(false);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-lg-6 mb-3">
                          <div className="mb-20px">
                            <label className="fs-16px fw-500 profile-sub-heading">
                              State <span className="asteriskDot">*</span>
                            </label>
                            <input
                              type="text"
                              value={billState}
                              placeholder="Enter State"
                              className="form-control"
                              onChange={(e) => {
                                setBillState(e.target.value);
                                setStorePaymentData("");
                                // setBillingChecked(false);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-lg-6 mb-3">
                          <div className="mb-20px">
                            <div>
                              <label className="fs-16px fw-500 profile-sub-heading">
                                Country <span className="asteriskDot">*</span>
                              </label>
                              <Select
                                options={countryDataDrp}
                                placeholder="Select Your Country"
                                value={selectBillCountry}
                                onChange={(e) => {
                                  setBillCountry(isEmpty(e.value));
                                  setSelectBillCountry(e);
                                  setStorePaymentData("");
                                  // setBillingChecked(false);
                                }}
                                isSearchable={true}
                                isMulti={false}
                                menuPortalTarget={document.body}
                                className="custom-react-select-container"
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                    // height: 35,
                                    // maxHeight: 35,
                                  }),
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-6 mb-3 custome-select custome-select-bg">
                          <div className="mb-20px">
                            <label className="fs-16px fw-500 profile-sub-heading">
                              Phone Code/Mobile Number <span className="asteriskDot">*</span>
                            </label>
                            <div className="input-group">
                              <span className="me-2" style={{ width: "150px" }}>
                                <Select
                                  options={phoneCodeDataDrp}
                                  placeholder="Phone Code"
                                  value={selectBillPhoneCode}
                                  onChange={(e) => {
                                    setBillPhoneCode(isEmpty(e.value));
                                    setSelectBillPhoneCode(e);
                                    setStorePaymentData("");
                                  }}
                                  isSearchable={true}
                                  isMulti={false}
                                  menuPortalTarget={document.body}
                                  className="custom-react-select-container phoneCode address"
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                />
                              </span>
                              <input
                                type="number"
                                placeholder="Enter Phone Number"
                                value={billMobileNumber}
                                className="form-control"
                                onChange={(e) => {
                                  setBillMobileNumber(e.target.value);
                                  setStorePaymentData("");
                                  // setBillingChecked(false);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-6 mb-3">
                          <div className="mb-20px">
                            <label className="fs-16px fw-500 profile-sub-heading">
                              Pincode <span className="asteriskDot">*</span>
                            </label>
                            <input
                              type="number"
                              value={billZipCode}
                              placeholder="Enter Pincode"
                              className="form-control"
                              onChange={(e) => {
                                setBillZipCode(e.target.value);
                                setStorePaymentData("");
                                // setBillingChecked(false);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="checkout__totals-wrapper">
            <div className="sticky-content">
              <div className="checkout__totals">
                <h3>Your Order</h3>
                <table className="checkout-cart-items">
                  <thead>
                    <tr>
                      <th>PRODUCT</th>
                      <th className="text-end">SUBTOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartProducts.map((elm, i) => {
                      if (elm.data.length === 1) {
                        return (
                          <tr key={i} className="border-bottom">
                            <td>
                              {elm.product_name} x {elm.data?.[0]?.item_qty}
                            </td>
                            <td className="text-end">
                              {storeCurrencys}{" "}
                              {/* {isEmpty(elm?.data?.[0]?.eng_text) !== ""
                                ? numberWithCommas(
                                  (
                                    Number(elm?.data?.[0]?.eng_price) *
                                    Number(elm?.data?.[0]?.item_qty) +
                                    Number(elm?.data?.[0]?.item_price) *
                                    Number(elm?.data?.[0]?.item_qty)
                                  ).toFixed(2)
                                )
                                : numberWithCommas(Number(elm?.data?.[0]?.item_qty) *
                                  Number(elm?.data?.[0]?.item_price))} */}
                              {Number(
                                elm?.data?.[0]?.store_tax_included_in_price
                              ) === 1
                                ? numberWithCommas(
                                  (
                                    Number(elm?.total_tax_amt) +
                                    Number(elm?.item_price)
                                  ).toFixed(2)
                                )
                                : elm?.item_price_display}
                            </td>
                          </tr>
                        );
                      } else {
                        return (
                          <tr className="border-bottom" key={i}>
                            <td>
                              {elm.types?.length > 0 &&
                                elm.types?.map((sub, j) => {
                                  return jewelVertical(sub.vertical_code) ===
                                    true ? (
                                    <div key={j}>
                                      {sub.product_name} x {sub.item_qty ?? 1}
                                    </div>
                                  ) : (
                                    <div key={j}>
                                      {sub.product_name} x 1 - {sub.product_sku}
                                    </div>
                                  );
                                })}
                            </td>
                            <td className="text-end">
                              {storeCurrencys}{" "}
                              {/* {numberWithCommas(
                                (
                                  (Number(elm?.item_price) +
                                    Number(
                                      elm?.data?.[0]?.eng_text !== ""
                                        ? elm?.data?.[0]?.eng_price
                                        : 0
                                    )) *
                                  elm.data?.[0]?.item_qty
                                ).toFixed(2)
                              )} */}
                              {Number(
                                elm?.data?.[0]?.store_tax_included_in_price
                              ) === 1
                                ? numberWithCommas(
                                  (
                                    Number(elm?.total_tax_amt) +
                                    Number(elm?.item_price)
                                  ).toFixed(2)
                                )
                                : elm?.item_price_display}
                            </td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>

                <table className="checkout-totals text-uppercase">
                  <tbody>
                    <tr>
                      <th>
                        SUBTOTAL{" "}
                        {shippingTax > 0 && <span>(Includes Tax)</span>}
                      </th>
                      <td className="text-end">
                        {storeCurrencys}{" "}
                        {numberWithCommas(
                          (extractNumber(totalPrice.toString())).toFixed(2)
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>
                        {" "}
                        {`Tax amount `}
                        {shippingTax > 0 && <span>(Included in Subtotal)</span>}
                      </th>
                      <td className="text-end">
                        {storeCurrencys}{" "}
                        {numberWithCommas(
                          extractNumber(shippingTax.toString()).toFixed(2)
                        )}
                      </td>
                    </tr>
                    {couponCodeApplieds === true &&
                      Object.keys(discountCouponDatas).length > 0 ? (
                      <tr className="w-100">
                        <th>
                          Discount{" "}
                          <span>
                            (Coupon Code: {appliedCoupons.toUpperCase()}
                          </span>
                          )
                        </th>
                        <td className="text-end">
                          <span className="text-dark fw-700">
                            {storeCurrencys} -
                            {numberWithCommas(discountedPrices.toFixed(2))}
                          </span>
                        </td>
                      </tr>
                    ) : (
                      ""
                    )}
                    {donationDataListss?.map((d, i) => {
                      if (d.checked === true) {
                        return (
                          <tr key={i}>
                            <th>{d?.project_name}</th>
                            <td className="text-end">
                              <label
                                className="form-check-label"
                                htmlFor="free_shipping"
                              >
                                {storeCurrencys}{" "}
                                {numberWithCommas(
                                  extractNumber(d?.donation_value).toFixed(2)
                                )}
                              </label>
                            </td>
                          </tr>
                        );
                      }
                    })}
                    {isEmpty(shippingDayData) != "" ? (
                      <tr>
                        <th>Delivery Information</th>
                        <td className="text-end">
                          Expected Delivery by <b>{expectedDate}</b>
                        </td>
                      </tr>
                    ) : (
                      ""
                    )}
                    {(() => {
                      const donation =
                        donationDataListss?.[0]?.checked === true &&
                          donationDataListss?.[0]?.donation_value_order_price !== "Yes"
                          ? Number(donationDataListss?.[0]?.donation_value || 0)
                          : 0;

                      const totalValue = Number(displayPrice) + donation;
                      const roundedValue = Math.round(totalValue);
                      const diff = roundedValue - totalValue;

                      return Math.abs(diff) >= 0.01 ? (
                        <tr>
                          <th>Rounded Off</th>
                          <td className="text-end">
                            {storeCurrencys} {diff > 0 ? "+" : "-"}
                            {Math.abs(diff).toFixed(2)}
                          </td>
                        </tr>
                      ) : '';
                    })()}
                    <tr>
                      <th>FINAL TOTAL</th>
                      <td className="text-end">
                        {storeCurrencys}{" "}
                        {numberWithCommas(
                          (
                            Math.round(
                              Number(displayPrice) +
                              (donationDataListss?.[0]?.checked === true
                                ? Number(
                                  donationDataListss?.[0]?.donation_value_order_price !== "Yes"
                                    ? donationDataListss?.[0]?.donation_value
                                    : 0
                                )
                                : 0) -
                              Number(discountedPrices ?? 0)
                            )
                          ).toFixed(2)
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="checkout__payment-methods">
                {paymentDataList.length > 0 &&
                  paymentDataList.map((item, i) => {
                    return (
                      <div className="form-check" key={i}>
                        <input
                          className="form-check-input form-check-input_fill"
                          type="radio"
                          name="checkout_payment_method"
                          id="checkout_payment_method_1"
                          checked={
                            orderPlaceButton === true &&
                              storePaymentData === item.code
                              ? true
                              : false
                          }
                          // defaultChecked={
                          //   storePaymentData === item.code ? true : false
                          // }
                          onChange={() => paymentMethodSelect(item.code)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="checkout_payment_method_1"
                        >
                          {item.name}
                          <span className="option-detail d-block">
                            Make your payment directly into our bank account.
                            Please use your Order ID as the payment
                            reference.Your order will not be shipped until the
                            funds have cleared in our account.
                          </span>
                        </label>
                      </div>
                    );
                  })}
                {/* <div className="form-check">
                <input
                  className="form-check-input form-check-input_fill"
                  type="radio"
                  name="checkout_payment_method"
                  id="checkout_payment_method_2"
                />
                <label
                  className="form-check-label"
                  htmlFor="checkout_payment_method_2"
                >
                  Check payments
                  <span className="option-detail d-block">
                    Phasellus sed volutpat orci. Fusce eget lore mauris vehicula
                    elementum gravida nec dui. Aenean aliquam varius ipsum, non
                    ultricies tellus sodales eu. Donec dignissim viverra nunc,
                    ut aliquet magna posuere eget.
                  </span>
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input form-check-input_fill"
                  type="radio"
                  name="checkout_payment_method"
                  id="checkout_payment_method_3"
                />
                <label
                  className="form-check-label"
                  htmlFor="checkout_payment_method_3"
                >
                  Cash on delivery
                  <span className="option-detail d-block">
                    Phasellus sed volutpat orci. Fusce eget lore mauris vehicula
                    elementum gravida nec dui. Aenean aliquam varius ipsum, non
                    ultricies tellus sodales eu. Donec dignissim viverra nunc,
                    ut aliquet magna posuere eget.
                  </span>
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input form-check-input_fill"
                  type="radio"
                  name="checkout_payment_method"
                  id="checkout_payment_method_4"
                />
                <label
                  className="form-check-label"
                  htmlFor="checkout_payment_method_4"
                >
                  Paypal
                  <span className="option-detail d-block">
                    Phasellus sed volutpat orci. Fusce eget lore mauris vehicula
                    elementum gravida nec dui. Aenean aliquam varius ipsum, non
                    ultricies tellus sodales eu. Donec dignissim viverra nunc,
                    ut aliquet magna posuere eget.
                  </span>
                </label>
              </div> */}
                <div className="policy-text">
                  Your personal data will be used to process your order, support
                  your experience throughout this website, and for other
                  purposes described in our
                  <Link href="/privacy" target="_blank" className="ps-1">
                    Privacy Policy
                  </Link>
                  .
                </div>
              </div>
              {orderPlaceButton && storePaymentData !== "" ? (
                <button
                  className="btn btn-primary btn-checkout"
                  onClick={() => {
                    orderPlace();
                  }}
                >
                  PLACE ORDER
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </form>
      {showAddressModal && (
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-hidden="true"
          data-bs-backdrop="static"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delivery Address</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    if (showBillingAddress == true) {
                      setAccordionTabs(["0"]);
                    }
                    setShowAddressModal(false);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="">
                  <ul
                    className="nav nav-tabs justify-content-between mb-3"
                    id="myTab"
                    role="tablist"
                  >
                    <li
                      className="nav-item nav-item w-50 text-center"
                      role="presentation"
                    >
                      <a
                        className={`${activeTab1
                          ? "nav-link nav-link_underscore active"
                          : "nav-link nav-link_underscore"
                          }`}
                        id="home-tab"
                        data-bs-toggle="tab"
                        href="#home"
                        role="tab"
                        aria-controls="home"
                        aria-selected="true"
                        onClick={() => {
                          setActiveTab1(true);
                          setActiveTab2(false);
                        }}
                      >
                        Ship To Me
                      </a>
                    </li>
                    <li
                      className="nav-item w-50 text-center"
                      role="presentation"
                    >
                      <a
                        className={`${activeTab2
                          ? "nav-link nav-link_underscore active"
                          : "nav-link nav-link_underscore"
                          }`}
                        id="profile-tab"
                        data-bs-toggle="tab"
                        href="#profile"
                        role="tab"
                        aria-controls="profile"
                        aria-selected="false"
                        onClick={() => {
                          setActiveTab2(true);
                          setActiveTab1(false);
                        }}
                      >
                        Ship To Store
                      </a>
                    </li>
                  </ul>
                  <div className="tab-content" id="myTabContent">
                    <div
                      className="tab-pane fade show active"
                      id="home"
                      role="tabpanel"
                      aria-labelledby="home-tab"
                    >
                      <div className="address-wrap row">
                        <div
                          className="col-12 col-md-6 mb-3"
                          onClick={() => {
                            addAddress();
                            setShowAddressModal(false);
                            setbillingAddressData({});
                            setStoreAddressData({});
                            clickAddressModal(false);
                            shipToStoreAddress();
                            setAccordionTabs([0]);
                          }}
                          data-bs-dismiss="modal"
                          data-mdb-dismiss="modal"
                          aria-label="Close"
                        >
                          <div className="card h-100 w-100 border rounded-0 sec-bg-color cursor-pointer">
                            <div className="card-body cursor-pointer">
                              <div className="d-flex justify-content-around flex-column text-center h-100 w-100">
                                <h4 className="add-title mb-0">
                                  <svg
                                    width="30"
                                    height="30"
                                    aria-hidden="true"
                                  >
                                    <use xlinkHref="#icon_plus" />
                                  </svg>
                                </h4>
                                <h5 className="fs-20px">Add New Address</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                        {DefaultBillingAddresss.length !== 0 && (
                          <div
                            className="col-12 col-md-6 mb-3"
                            onClick={() => {
                              billingAddress("0", DefaultBillingAddresss);
                              setAccordionTabs(["0"]);
                              clickAddressModal(false);
                              shippingDay(
                                DefaultBillingAddresss.unique_id,
                                "CONSUMER"
                              );
                              setselectAddress(
                                DefaultBillingAddresss.unique_id
                              );
                              setShowBillingAddress(true);
                              setBillingChecked(false);
                            }}
                            data-bs-dismiss="modal"
                            data-mdb-dismiss="modal"
                            aria-label="Close"
                          >
                            <div
                              className={`card h-100 rounded-0 sec-bg-color cursor-pointer ${selectAddress ===
                                DefaultBillingAddresss.unique_id
                                ? "border-active"
                                : ""
                                }`}
                            >
                              <div className="card-body cursor-pointer">
                                <div className="d-flex justify-content-around align-items-start flex-column h-100 w-100">
                                  <div className="d-flex justify-content-between w-100">
                                    <h4 className="add-title fs-20px mb-5px">
                                      {DefaultBillingAddresss.first_name}{" "}
                                      {DefaultBillingAddresss.last_name}
                                    </h4>
                                    <div className="text-end">
                                      <p>Default</p>
                                    </div>
                                  </div>
                                  <p className="fs-15px mb-5px">
                                    {DefaultBillingAddresss.building},
                                    {isEmpty(DefaultBillingAddresss.address) !=
                                      "" ? (
                                      <>{DefaultBillingAddresss.address},</>
                                    ) : (
                                      ""
                                    )}{" "}
                                    {DefaultBillingAddresss.street},
                                    {isEmpty(
                                      DefaultBillingAddresss.description
                                    ) != "" ? (
                                      <>{DefaultBillingAddresss.description},</>
                                    ) : (
                                      ""
                                    )}
                                    {DefaultBillingAddresss.city} -{" "}
                                    {DefaultBillingAddresss.pincode},
                                    {DefaultBillingAddresss.state},
                                    {DefaultBillingAddresss.country}.
                                  </p>
                                  <h6 className="fs-15px">
                                    Mobile :{" "}
                                    <span className="fw-normal">
                                      {DefaultBillingAddresss.country_code}{" "}
                                      {DefaultBillingAddresss.mobile_no}
                                    </span>
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {selectedBillingAddress.length > 0 &&
                          selectedBillingAddress.map((c, index) => (
                            <div className="col-12 col-md-6 mb-3" key={index}>
                              <div
                                className={`card h-100 rounded-0 ${selectAddress === c.unique_id
                                  ? "border-active"
                                  : ""
                                  }`}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  className="icon_edit"
                                  aria-hidden="true"
                                  onClick={() => {
                                    setUpdateAddress(true);
                                    editAddress(c);
                                    setAccordionTabs(["0"]);
                                    clickAddressModal(false);
                                    setbillingAddressData({});
                                    setStoreAddressData({});
                                    setBillingChecked(false);
                                  }}
                                  data-bs-dismiss="modal"
                                  data-mdb-dismiss="modal"
                                  aria-label="Close"
                                >
                                  <use xlinkHref="#icon_edit" />
                                </svg>

                                <div
                                  className="card-body cursor-pointer"
                                  onClick={() => {
                                    billingAddress("0", c);
                                    setAccordionTabs(["0"]);
                                    clickAddressModal(false);
                                    shippingDay(c.unique_id, "CONSUMER");
                                    setselectAddress(c.unique_id);
                                    setBillingChecked(false);
                                  }}
                                  data-bs-dismiss="modal"
                                  data-mdb-dismiss="modal"
                                  aria-label="Close"
                                >
                                  <div className="d-flex flex-column justify-content-between h-100">
                                    <h4 className="add-title fs-20px mb-5px">
                                      {c.first_name} {c.last_name}
                                    </h4>
                                    <p className="fs-15px">
                                      {c.building},
                                      {isEmpty(c.address) != "" ? (
                                        <>{c.address}, </>
                                      ) : (
                                        ""
                                      )}
                                      {c.street},{" "}
                                      {isEmpty(c.description) != "" ? (
                                        <>{c.description}, </>
                                      ) : (
                                        ""
                                      )}{" "}
                                      {c.city} - {c.pincode},{c.state},
                                      {c.country}.
                                    </p>
                                    <h6 className="fs-15px">
                                      Mobile :{" "}
                                      <span className="fw-normal">
                                        {" "}
                                        {c.country_code} {c.mobile_no}
                                      </span>
                                    </h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="profile"
                      role="tabpanel"
                      aria-labelledby="profile-tab"
                    >
                      <div className="address-wrap row">
                        {shipToStoreAddressDataList.length > 0 &&
                          shipToStoreAddressDataList.map((s, i) => (
                            <div
                              className="col-12 col-md-6 mb-3"
                              key={i}
                              onClick={() => {
                                billingAddress("1", s);
                                setAccordionTabs(["0"]);
                                clickAddressModal(false);
                                shippingDay(s.unique_id, "STORE");
                                setselectAddress(s.unique_id);
                                setBillingChecked(false);
                              }}
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            >
                              <div
                                className={`card h-100 rounded-0 sec-bg-color cursor-pointer ${selectAddress === s.unique_id
                                  ? "border-active"
                                  : ""
                                  }`}
                              >
                                <div className="card-body cursor-pointer">
                                  <div className="d-flex justify-content-around align-items-start flex-column h-100 w-100">
                                    <h6 className="add-title ShipToStore-detail mb-5px">
                                      {s.name}
                                    </h6>
                                    <p className="fs-15px mb-5px">
                                      {s.building},{" "}
                                      {isEmpty(s.building_name) != "" ? (
                                        <>{s.building_name}, </>
                                      ) : (
                                        ""
                                      )}
                                      {s.street},{" "}
                                      {isEmpty(s.description) != "" ? (
                                        <>{s.description}, </>
                                      ) : (
                                        ""
                                      )}{" "}
                                      {s.city_name} - {s.pincode},{s.state_name}
                                      ,{s.country_name}.
                                    </p>
                                    <h6 className="fs-15px">
                                      Mobile :{" "}
                                      <span className="fw-normal">
                                        {s.country_code} {s.mobile}
                                      </span>
                                    </h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
