import { onlyNumbers } from "@/CommanFunctions/commanFunctions";
import commanService from "@/CommanService/commanService";
import { isLoginModal, isRegisterModal, isVerifyModal, loginData } from "@/Redux/action";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import Link from "next/link";
import Select from "react-select";
import { toast } from "react-toastify";
import VerifyCode from "./VerifyCode";
import Loader from "@/CommanUIComp/Loader/Loader";

export default function LoginRegister() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  // From Value
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [country, setCountry] = useState("");
  const [countryShortCode, setCountryShortcode] = useState("");
  const [countryId, setCountryId] = useState("");
  const [countryDataDrp, setCountryDataDrp] = useState([]);
  const [phoneCode, setPhonecode] = useState("");
  const [phoneCodeDataDrp, setPhoneCodeDataDrp] = useState([]);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const isLoginModals = useSelector((state) => state.isLoginModal);
  const isRegisterModals = useSelector((state) => state.isRegisterModal);
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const isVerifyModals = useSelector((state) => state.isVerifyModal);

  const [loading, setLoading] = useState(false);
  const [tabActive, setTabActive] = useState({
    login: isLoginModals === true ? true : false,
    register: isRegisterModals === true ? true : false,
  });

  // Verification
  const [isVerifyCodeModal, setIsVerifyCodeModal] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [authenticatorName, setAuthenticatorName] = useState("");

  let reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const login = (e) => {
    e.preventDefault();
    var obj = {
      a: "login",
      email: email,
      password: password,
      store_id: storeEntityIds.mini_program_id,
    };
    setLoading(true)
    if (
      email !== "" &&
      password !== "" &&
      reg.test(email) !== false &&
      password.length >= 8
    ) {
      commanService
        .postLaravelApi("/AuthController", obj)
        .then((res) => {
          if (res.data.success === 1) {
            if (res.data.data.two_step_verification === 1) {
              setIsVerifyCodeModal(true);
              setLoading(false);
              dispatch(isVerifyModal(true))
              setMemberId(res.data.data.member_id);
              setAuthenticatorName(res.data.data.authnticator_name);
            } else {
              const logindata = res.data.data;
              dispatch(loginData(logindata));
              sessionStorage.setItem("loginData",JSON.stringify(logindata))
              setIsVerifyCodeModal(false);
              dispatch(isVerifyModal(false))
              // if (DefaultBillingAddresss.length === 0) {
              //   // addressData(logindata.member_id);
              // }
              if (pathname.includes("/login")) {
                router.push("/");
              } else {
                router.push(pathname);
              }
            }
            setEmail("");
            setPassword("");
            toast.success(res.data.message)
            setLoading(false)
          } else {
            setLoading(false);
            toast.error(res.data.message)
          }
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      if (email === "") {
        toast.error("The Email field is required.");
      } else if (reg.test(email) === false) {
        toast.error("Please enter valid Email");
      } else if (password === "") {
        toast.error("The Password field is required.");
      } else if (password.length < 8) {
        toast.error("The Password must be at least 8 characters.");
      }
      setLoading(false)
    }
  };

  const changeCountry = (value) => {
    if (value !== "Select Your Country" && value !== "") {
      for (let c = 0; c < countryDataDrp.length; c++) {
        if (countryDataDrp[c].name === value) {
          setCountryShortcode(countryDataDrp[c].sortname);
          setCountryId(countryDataDrp[c].id);
          setCountry(countryDataDrp[c]);
        }
      }
    } else {
      setCountryShortcode("");
      setCountryId("");
      setCountry("");
    }
  };

  const countrySetDrp = () => {
    var data = JSON.parse(sessionStorage.getItem("country_data"));
    for (let c = 0; c < data.length; c++) {
      data[c]["value"] = data[c]["name"];
      data[c]["label"] = data[c]["name"];
    }
    data.splice(0, 0, { value: "", label: "Select Your Country" });
    setCountryDataDrp(data);
    setTimeout(() => {
      phoneCodeSetDrp();
    });
  };

  const countryDrp = useCallback(() => {
    const GetCountry = {
      a: "getCountry",
      SITDeveloper: "1",
    };
    commanService.postApi("/TechnicalManagement", GetCountry).then((res) => {
      if (res.data.success == 1) {
        sessionStorage.setItem("country_data", JSON.stringify(res.data.data));
        countrySetDrp();
      }
    });
  }, []);

  const phoneCodeSetDrp = () => {
    var pdata = JSON.parse(sessionStorage.getItem("country_data"));
    for (let c = 0; c < pdata.length; c++) {
      pdata[c]["value"] = pdata[c]["phonecode"];
      pdata[c]["label"] = pdata[c]["phonecode"] + " - " + pdata[c]["name"];
    }
    pdata.splice(0, 0, { value: "", label: "Phone Code" });
    setPhoneCodeDataDrp(pdata);
  };

  const changeGender = (value) => {
    if (value != "Select Gender") {
      setGender(value);
    } else {
      setGender("");
    }
  };

  const register = (e) => {
    e.preventDefault();

    var obj = {
      a: "signup",
      email: email,
      password: password,
      first_name: fname,
      last_name: lname,
      mobile_no: mobile,
      store_id: storeEntityIds.mini_program_id,
      country: country.value,
      country_id: countryId,
      country_code: phoneCode.value,
      country_short_code: countryShortCode,
      state: state,
      city: city,
      gender: gender,
    };
    setLoading(true);
    if (
      email !== "" &&
      password !== "" &&
      fname !== "" &&
      countryShortCode !== "" &&
      lname !== "" &&
      reg.test(email) !== false &&
      password.length >= 8 &&
      phoneCode?.value !== "" &&
      mobile.length >= 8 &&
      mobile.length <= 15 && city !== "" && gender !== ""
    ) {
      commanService
        .postLaravelApi("/AuthController", obj)
        .then((res) => {
          if (res.data.success === 1) {
            const Registerdata = res.data.data;
            dispatch(loginData(Registerdata));
            sessionStorage.setItem("loginData",JSON.stringify(Registerdata))

            router.push("/");
            setLoading(false);
            toast.success(res.data.message)
          } else {
            toast.error(res.data.message)
            setLoading(false);
          }
          setEmail("");
          setPassword("");
          setFname("");
          setLname("");
          setCountry("");
          setCountryShortcode("");
          setCountryId("");
          setCountryDataDrp([]);
          setPhonecode("");
          setPhoneCodeDataDrp([]);
          setState("");
          setCity("");
          setMobile("");
          setGender("");
        })
        .catch(() => { setLoading(false); });
    } else {
      if (fname === "") {
        toast.error("The First Name field is required.");
      } else if (lname === "") {
        toast.error("The Last Name field is required.");
      } else if (email === "") {
        toast.error("The Email field is required.");
      } else if (reg.test(email) === false) {
        toast.error("Please Enter valid Email.");
      } else if (password === "") {
        toast.error("The Password field is required.");
      } else if (password.length < 8) {
        toast.error("The Password must be at least 8 characters.");
      } else if (countryShortCode === "") {
        toast.error("The Country field is required.");
      } else if (phoneCode.value === "") {
        toast.error("The Phone Code field is required.");
      } else if (mobile.length < 8) {
        toast.error("Minimum 8 digit is required in Mobile Number.");
      } else if (mobile.length > 15) {
        toast.error("Maximum 15 digit is required in Mobile Number.");
      } else if (city === "") {
        toast.error("City field is required.");
      } else if (gender === "") {
        toast.error("Gender field is required.");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    setTabActive({
      ...tabActive,
      login: true,
      register: false,
    });
    dispatch(isLoginModal(true));
    dispatch(isRegisterModal(false));
    // dispatch(loginData({}));
    // if (isRegisterModals === true) {
    countryDrp();
    // }
  }, []);
  return (
    <main className="page-wrapper">
      <div className="mb-4 pb-4"></div>
      <section className="login-register container">
        {loading && <Loader />}
        <h2 className="d-none">Login & Register</h2>
        <ul className="nav nav-tabs mb-5" id="login_register" role="tablist">
          <li className="nav-item" role="presentation">
            <Link
              className={`${tabActive.login === true
                  ? "nav-link nav-link_underscore active"
                  : "nav-link nav-link_underscore"
                }`}
              id="login-tab"
              data-bs-toggle="tab"
              href="#tab-item-login"
              role="tab"
              aria-controls="tab-item-login"
              aria-selected="true"
              onClick={() => {
                setTabActive({
                  ...tabActive,
                  login: true,
                  register: false,
                });
                dispatch(isLoginModal(true));
                dispatch(isRegisterModal(false));
                dispatch(isVerifyModal(false))
              }}
            >
              Login
            </Link>
          </li>
          <li className="nav-item" role="presentation">
            <Link
              className={`${tabActive.register === true
                  ? "nav-link nav-link_underscore active"
                  : "nav-link nav-link_underscore"
                }`}
              id="register-tab"
              data-bs-toggle="tab"
              href="#tab-item-register"
              role="tab"
              aria-controls="tab-item-register"
              aria-selected="false"
              onClick={() => {
                setTabActive({
                  ...tabActive,
                  login: false,
                  register: true,
                });
                dispatch(isLoginModal(false));
                dispatch(isRegisterModal(true));
                dispatch(isVerifyModal(false))
              }}
            >
              Register
            </Link>
          </li>
        </ul>
        <div className="tab-content pt-2" id="login_register_tab_content">
          <div
            className={`${tabActive.login === true
                ? "tab-pane fade show active"
                : "tab-pane fade"
              }`}
            id="tab-item-login"
            role="tabpanel"
            aria-labelledby="login-tab"
          >
            {isVerifyCodeModal || isVerifyModals === true ? (
              <VerifyCode
                memberId={memberId}
                authenticatorName={authenticatorName}
                countryDrp={countryDrp}
                setTabActive={setTabActive}
                tabActive={tabActive}
              />
            ) : (
              <div className="login-form">
                <form className="needs-validation">
                  <div className="mb-3">
                    <label className="form-label">Email address <span className="asteriskDot">*</span></label>
                    <input
                      name="login_email"
                      type="email"
                      className="form-control form-control_gray"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="username"  
                    />
                  </div>

                  {/* <div className="pb-3"></div> */}

                  <div className="mb-3">
                    <label htmlFor="customerPasswodInput" className="form-label">Password <span className="asteriskDot">*</span></label>
                    <input
                      name="login_password"
                      type="password"
                      className="form-control form-control_gray"
                      id="customerPasswodInput"
                      placeholder="Password *"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      aria-label="password"
                    />
                  </div>

                  <div className="d-flex align-items-center mb-3 pb-2">
                    <div className="form-check mb-0">
                      <input
                        name="remember"
                        className="form-check-input form-check-input_fill"
                        type="checkbox"
                        defaultValue=""
                        aria-label="remember" 
                      />
                      <label htmlFor="RememberMe" className="form-check-label text-secondary">
                        Remember me
                      </label>
                    </div>
                    <Link href="/reset_password" className="btn-text ms-auto">
                      Lost password?
                    </Link>
                  </div>

                  <button
                    className="btn btn-primary w-100 text-uppercase"
                    type="submit"
                    onClick={(e) => login(e)}
                  >
                    Log In
                  </button>

                  <div className="customer-option mt-4 text-center">
                    <span className="text-secondary">No account yet?</span>{" "}
                    <Link
                      href="#register-tab"
                      className="btn-text js-show-register"
                      onClick={() => {
                        setTabActive({
                          ...tabActive,
                          login: false,
                          register: true,
                        });
                        dispatch(isLoginModal(false));
                        dispatch(isRegisterModal(true));
                        countryDrp();
                      }}
                    >
                      Create Account
                    </Link>
                  </div>
                </form>
              </div>
            )}
          </div>
          <div
            className={`${tabActive.register === true
                ? "tab-pane fade show active"
                : "tab-pane fade"
              }`}
            id="tab-item-register"
            role="tabpanel"
            aria-labelledby="register-tab"
          >
            <div className="register-form">
              <form className="needs-validation">
                <div className="mb-3">
                  <label htmlFor="customerNameRegisterInput" className="form-label">First Name <span className="asteriskDot">*</span></label>
                  <input
                    name="register_firstname"
                    type="text"
                    className="form-control form-control_gray"
                    id="customerNameRegisterInput"
                    placeholder="First Name"
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                    required
                  />
                </div>

                {/* <div className="pb-3"></div> */}

                <div className="mb-3">
                  <label htmlFor="customerNameRegisterInput2" className="form-label">Last Name <span className="asteriskDot">*</span></label>
                  <input
                    name="register_lastname"
                    type="text"
                    className="form-control form-control_gray"
                    id="customerNameRegisterInput2"
                    placeholder="Last Name"
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                    required
                  />
                </div>

                {/* <div className="pb-3"></div> */}

                <div className="mb-3">
                  <label htmlFor="customerEmailRegisterInput" className="form-label">Email address <span className="asteriskDot">*</span></label>
                  <input
                    name="register_email"
                    type="email"
                    className="form-control form-control_gray"
                    id="customerEmailRegisterInput"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"  
                  />
                </div>

                {/* <div className="pb-3"></div> */}

                <div className="mb-3">
                  <label htmlFor="customerPasswodRegisterInput" className="form-label">Password <span className="asteriskDot">*</span></label>
                  <div className="position-relative">
                    <input
                      name="register_password"
                      type={`${showPassword !== false ? "text" : "password"}`}
                      className="form-control form-control_gray"
                      id="customerPasswodRegisterInput"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <div className="position-absolute top-50 end-0 translate-middle-y pe-3">
                      {password !== "" ? (
                        showPassword === false ? (
                          <i
                            className="ic_eye_close"
                            onClick={() => setShowPassword(true)}
                          ></i>
                        ) : (
                          <i
                            className="ic_eye_open"
                            onClick={() => setShowPassword(false)}
                          ></i>
                        )
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>

                {/* <div className="pb-3"></div> */}

                <div className="mb-3">
                  <label className="form-label">Country <span className="asteriskDot">*</span></label>
                  <Select
                    options={countryDataDrp}
                    placeholder="Select Your Country"
                    value={country}
                    onChange={(e) => {
                      changeCountry(e.value);
                    }}
                    isSearchable={true}
                    isMulti={false}
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                    className="custom-react-select-container"
                    classNamePrefix="custom-react-select"
                  />
                  {/* <label htmlFor="customerPasswodRegisterInput">Country *</label> */}
                </div>

                {/* <div className="pb-3"></div> */}

                <div className="mb-3">
                  <label htmlFor="customerPasswodRegisterInput" className="form-label">State <span className="asteriskDot">*</span></label>
                  <input
                    name="register_state"
                    type="text"
                    className="form-control form-control_gray"
                    id="customerStateRegisterInput"
                    placeholder="State"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                    }}
                    required
                  />
                </div>

                {/* <div className="pb-3"></div> */}

                <div className="mb-3">
                  <label htmlFor="customerPasswodRegisterInput" className="form-label">Mobile Number <span className="asteriskDot">*</span></label>
                  <div className="d-flex justify-content-start">
                    <div className="form-floating me-2" style={{ width: "30%" }}>
                      <Select
                        options={phoneCodeDataDrp}
                        placeholder="Phone Code"
                        value={phoneCode}
                        onChange={(e) => {
                          setPhonecode(e);
                        }}
                        isSearchable={true}
                        isMulti={false}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        className="custom-react-select-container phoneCode"
                        classNamePrefix="custom-react-select"
                      />
                    </div>
                    {/* <div className="pb-3"></div> */}

                    <div className="" style={{ width: "70%" }}>
                      <input
                        type="text"
                        placeholder="Mobile Number"
                        className="form-control form-control_gray"
                        value={mobile}
                        onChange={(e) => {
                          if (onlyNumbers(e.target.value)) {
                            setMobile(e.target.value);
                          }
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* <div className="pb-3"></div> */}
                <div className="mb-3">
                  <label htmlFor="customerPasswodRegisterInput" className="form-label">City <span className="asteriskDot">*</span></label>
                  <input
                    type="text"
                    placeholder="City"
                    className="form-control form-control_gray"
                    value={city}
                    onChange={(e) => {
                      if (e.target.value) {
                        setCity(e.target.value);
                      }
                    }}
                    required
                  />
                </div>

                {/* <div className="pb-3"></div> */}

                <div className="mb-3">
                  <label htmlFor="customerPasswodRegisterInput" className="form-label">Gender <span className="asteriskDot">*</span></label>
                  <select
                    aria-label="Default select example"
                    placeholder="Gender"
                    className="form-control form-control_gray"
                    value={gender}
                    onChange={(e) => changeGender(e.target.value)}
                  >
                    <option defaultValue="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* <div className="pb-3"></div> */}

                <div className="d-flex align-items-center mb-3 pb-2">
                  <p className="m-0">
                    Your personal data will be used to support your experience
                    throughout this website, to manage access to your account, and
                    for other purposes described in our privacy policy.
                  </p>
                </div>

                <button
                  className="btn btn-primary w-100 text-uppercase"
                  type="submit"
                  onClick={(e) => register(e)}
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <div className="section-gap"></div>
    </main>
  );
}
