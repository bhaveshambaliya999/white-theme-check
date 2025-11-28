import {
  isEmpty,
  onlyNumbers,
  validateWithOnlyLetters,
} from "@/CommanFunctions/commanFunctions";
import commanService from "@/CommanService/commanService";
import Loader from "@/CommanUIComp/Loader/Loader";
import { loginData } from "@/Redux/action";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { toast } from "react-toastify";

export default function EditAccount() {
  const isCallRef = useRef(false)
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const reduxLoginData = useSelector((state) => state.loginData);

const loginDatas =
  typeof window !== "undefined"
    ? JSON.parse(sessionStorage.getItem("loginData")) || reduxLoginData
    : reduxLoginData;

  const isLogin = Object.keys(loginDatas).length > 0;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  //Profile
  const [pFname, setPFname] = useState(loginDatas.first_name);
  const [pLname, setPLname] = useState(loginDatas.last_name);
  const [pEmail, setPEmail] = useState(loginDatas.email);
  const [pPhone, setPPhone] = useState(loginDatas.mobile_no);
  const [pGender, setPGender] = useState(loginDatas.gender);
  const [pPhonecode, setPPhonecode] = useState(loginDatas.country_code);
  const [pCountry, setPCountry] = useState(loginDatas.country);
  const [pCountryShortcode, setPCountryShortCode] = useState();
  const [pCountryId, setPCountryId] = useState();
  const [pState, setPState] = useState(loginDatas.state);
  const [pCity, setPCity] = useState(loginDatas.city);

  const [countryDataDrp, setGetCountryDataDrp] = useState([]);
  const [phoneCodeDataDrp, setPhoneCodeDataDrp] = useState([]);

  const countrySetDrp = () => {
    var data = JSON.parse(sessionStorage.getItem("country_data"));
    for (let c = 0; c < data?.length; c++) {
      data[c].value = data[c].name;
      data[c].label = data[c].name;
    }
    data.splice(0, 0, { value: "", label: "Select Your Country" });
    setGetCountryDataDrp(data);
    const datas = data.filter((item) => item.value === pCountry);
    setPCountry(datas[0]);
    setTimeout(() => {
      phoneCodeSetDrp();
    });
  };

  const phoneCodeSetDrp = () => {
    var pdata = JSON.parse(sessionStorage.getItem("country_data"));
    for (let c = 0; c < pdata.length; c++) {
      pdata[c].value = pdata[c].phonecode;
      pdata[c].label = pdata[c].phonecode + " - " + pdata[c].name;
    }
    pdata.splice(0, 0, { value: "", label: "Phone Code" });
    setPhoneCodeDataDrp(pdata);
    var data = pdata.filter((item) => item.value === pPhonecode);
    setPPhonecode(data[0]);
    profileData();
  };

  const countryDrp = () => {
    const countryDataDrp = {
      a: "getCountry",
      SITDeveloper: "1",
    };
    setLoading(true);
    commanService
      .postApi("/TechnicalManagement", countryDataDrp)
      .then((res) => {
        if (res.data.success == 1) {
          sessionStorage.setItem("country_data", JSON.stringify(res.data.data));
          countrySetDrp();
          setLoading(false);
        } else {
          toast.error(res.data.message);
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // Profile Section
  const profileData = useCallback(() => {
    for (let c = 0; c < countryDataDrp?.length; c++) {
      if (countryDataDrp[c].name === loginDatas.country) {
        setPCountry(countryDataDrp[c]);
        setPCountryShortCode(countryDataDrp[c].sortname);
        setPCountryId(countryDataDrp[c].id);
      }
    }

    for (let c = 0; c < phoneCodeDataDrp?.length; c++) {
      if (phoneCodeDataDrp[c].phonecode === loginDatas.country_code) {
        setPPhonecode(phoneCodeDataDrp[c]);
      }
    }
  }, [countryDataDrp, phoneCodeDataDrp]);

  const changeProfileData = (e, value) => {
    // setUpdate(true);
    if (value == "fname") {
      setPFname(e.target.value);
    } else if (value == "lname") {
      setPLname(e.target.value);
    } else if (value == "email") {
      setPEmail(e.target.value);
    } else if (value == "phone_number") {
      setPPhone(e.target.value);
    } else if (value == "country") {
      setPCountry(e);
      if (e.value != "" && e.value != "Select Your Country") {
        for (let c = 0; c < countryDataDrp.length; c++) {
          if (countryDataDrp[c].name === e.value) {
            setPCountryShortCode(countryDataDrp[c].sortname);
            setPCountryId(countryDataDrp[c].id);
          }
        }
      } else {
        setPCountryShortCode("");
        setPCountry("");
        setPCountryId("");
      }
    } else if (value == "phoneCode") {
      if (e.value != "" && e.value != "Phone Code") {
        setPPhonecode(e);
      } else {
        setPPhonecode("");
      }
    } else if (value == "state") {
      setPState(e.target.value);
    } else if (value == "city") {
      setPCity(e.target.value);
    } else if (value == "gender") {
      if (e.target.value !== "" && e.target.value !== "Select Gender") {
        setPGender(e.target.value);
      } else {
        setPGender("");
      }
    }
  };


  const consumerData = (unique_id) => {
    const consumerData = {
      a: "getDataConsumer",
      unique_id: unique_id,
      store_id: storeEntityIds.mini_program_id,
      per_page: "0",
      number: "0"
    }
    setLoading(true)
    commanService.postLaravelApi("/AuthController", consumerData).then((res) => {
      if (res.data.success == 1) {
        let data = res.data.data
        for (let c = 0; c < data.length; c++) {
          if (loginDatas.member_id === data[c].member_id) {
            dispatch(loginData(data[c]))
            sessionStorage.setItem("loginData",JSON.stringify(data[c]))
            window.scroll(0, 0)
          }
        }
        setLoading(false)
      } else {
        toast.error(res.data.message)
        setLoading(false)
      }
    }).catch((error) => {
      setLoading(false)
    })
  };

  const UpdateProfile = (e, unique_id) => {
    e.preventDefault();
    const Profile_update = {
      a: "AddUpdateConsumer",
      unique_id: unique_id,
      store_id: storeEntityIds.mini_program_id,
      email: pEmail,
      first_name: pFname,
      last_name: pLname,
      mobile_no: pPhone,
      country: pCountry.value,
      country_short_code: pCountryShortcode,
      country_id: pCountryId,
      country_code: pPhonecode.value,
      state: pState,
      city: pCity,
      gender: pGender,
    };
    setLoading(true);
    if (
      ((pFname && pLname && pPhone) !== "" || undefined) &&
      pPhone.length >= 8 &&
      pPhone.length <= 15 &&
      pCountryShortcode !== "" &&
      isEmpty(pPhonecode.value) != "" &&
      pPhonecode.value != "Phone Code"
    ) {
      commanService
        .postLaravelApi("/AuthController", Profile_update)
        .then((res) => {
          if (res.data.success == 1) {
            toast.success(res.data.message);
            consumerData(unique_id);
            // setLoading(false);
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
      setLoading(false);
      if (!pFname) {
        toast.error("First Name Is Required");
      } else if (!pLname) {
        toast.error("Last Name Is Required");
      } else if (isEmpty(pPhonecode.value) == "") {
        toast.error("Phone Code Is Required");
      } else if (!pPhone) {
        toast.error("Phone Number Is Required");
      } else if (!pCountryShortcode) {
        toast.error("Country Is Required");
      } else if (pPhone.length < 8) {
        toast.error("Minimum 8 digit is Required in Phone Number");
      } else if (pPhone.length > 15) {
        toast.error("Maximum 15 digit is Required in Phone Number");
      } else if (!pCountryShortcode) {
        toast.error("Country Is Required");
      }
    }
  };

  useEffect(() => {
    if(!isCallRef.current){
      countryDrp();
      isCallRef.current = true;
    }
  }, []);

  return (
    <>
      {loading && <Loader />}
      <div className="my-account__edit">
        <div className="register-form">
          <form className="needs-validation">
            <div className="row">
              <div className="col-md-6">
                <div className="my-2">
                  <label htmlFor="customerNameRegisterInput1" className="form-label">First Name <span className="asteriskDot">*</span></label>
                  <input
                    name="register_firstname"
                    type="text"
                    className="form-control form-control_gray"
                    id="customerNameRegisterInput1"
                    placeholder="First Name *"
                    defaultValue={pFname}
                    onChange={(e) => {
                      if (validateWithOnlyLetters(e.target.value)) {
                        changeProfileData(e, "fname");
                      }
                    }}
                    required
                  />
                  {/* <label htmlFor="customerNameRegisterInput1">First Name *</label> */}
                </div>
              </div>

              <div className="col-md-6">
                <div className="my-2">
                  <label htmlFor="customerNameRegisterInput2" className="form-label">Last Name <span className="asteriskDot">*</span></label>
                  <input
                    name="register_lastname"
                    type="text"
                    className="form-control form-control_gray"
                    id="customerNameRegisterInput2"
                    placeholder="Last Name *"
                    defaultValue={pLname}
                    onChange={(e) => {
                      if (validateWithOnlyLetters(e.target.value)) {
                        changeProfileData(e, "lname");
                      }
                    }}
                    required
                  />
                  {/* <label htmlFor="customerNameRegisterInput2">Last Name *</label> */}
                </div>
              </div>

              <div className="col-md-6">
                <div className="my-2">
                  <label htmlFor="customerEmailRegisterInput3" className="form-label">Email address <span className="asteriskDot">*</span></label>
                  <input
                    name="register_email"
                    type="email"
                    className="form-control form-control_gray"
                    id="customerEmailRegisterInput3"
                    placeholder="Email address"
                    defaultValue={pEmail}
                    required
                    autoComplete="username"  
                  />
                  {/* <label htmlFor="customerEmailRegisterInput3">
                    Email address *
                  </label> */}
                </div>
              </div>

              <div className="col-md-6 my-2">
                <label htmlFor="customerPasswodRegisterInput" className="form-label">Mobile Number <span className="asteriskDot">*</span></label>
                <div className="d-flex">
                  <div className="me-2" style={{ width: "30%" }}>
                    <Select
                      options={phoneCodeDataDrp}
                      placeholder="Phone Code"
                      value={pPhonecode}
                      onChange={(e) => {
                        changeProfileData(e, "phoneCode");
                      }}
                      isSearchable={true}
                      isMulti={false}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
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
                      value={pPhone}
                      onChange={(e) => {
                        if (onlyNumbers(e.target.value)) {
                          changeProfileData(e, "phone_number");
                        }
                      }}
                    />
                    {/* <label htmlFor="customerPasswodRegisterInput">
                      Mobile Number *
                    </label> */}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="my-2">
                  <label htmlFor="customerPasswodRegisterInput" className="form-label">Country <span className="asteriskDot">*</span></label>
                  <Select
                    options={countryDataDrp}
                    placeholder="Select Your Country*"
                    value={pCountry}
                    onChange={(e) => changeProfileData(e, "country")}
                    isSearchable={true}
                    isMulti={false}
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                    className="custom-react-select-container w-100"
                    classNamePrefix="custom-react-select"
                  />
                  {/* <label htmlFor="customerPasswodRegisterInput">Country *</label> */}
                </div>
              </div>

              <div className="col-md-6">
                <div className="my-2">
                  <label htmlFor="customerStateRegisterInput" className="form-label">State <span className="asteriskDot">*</span></label>
                  <input
                    name="register_state"
                    type="text"
                    className="form-control form-control_gray"
                    id="customerStateRegisterInput"
                    placeholder="State *"
                    defaultValue={pState}
                    onChange={(e) => {
                      if (validateWithOnlyLetters(e.target.value)) {
                        changeProfileData(e, "state");
                      }
                    }}
                    required
                  />
                  {/* <label htmlFor="customerStateRegisterInput">State *</label> */}
                </div>
              </div>

              <div className="col-md-6">
                <div className="my-2">
                  <label htmlFor="customerCityRegisterInput" className="form-label">City <span className="asteriskDot">*</span></label>
                  <input
                    type="text"
                    placeholder="City"
                    className="form-control form-control_gray"
                    defaultValue={pCity}
                    onChange={(e) => {
                      if (validateWithOnlyLetters(e.target.value)) {
                        changeProfileData(e, "city");
                      }
                    }}
                    required
                  />
                  {/* <label htmlFor="customerCityRegisterInput">City *</label> */}
                </div>
              </div>

              <div className="col-md-6">
                <div className="my-2">
                  <label htmlFor="customerGenderRegisterInput" className="form-label">Gender <span className="asteriskDot">*</span></label>
                  <select
                    aria-label="Default select example"
                    placeholder="Gender"
                    className="form-control form-control_gray"
                    defaultValue={pGender}
                    onChange={(e) => changeProfileData(e, "gender")}
                  >
                    <option defaultValue="">Select Gender</option>
                    <option defaultValue="Male">Male</option>
                    <option defaultValue="Female">Female</option>
                  </select>
                  {/* <label htmlFor="customerGenderRegisterInput">Gender *</label> */}
                </div>
              </div>

              <div className="col-md-6">
                <button
                  className="btn btn-primary text-uppercase my-3"
                  type="submit"
                  onClick={(e) => UpdateProfile(e, loginDatas.unique_id)}
                >
                  UPDATE
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
