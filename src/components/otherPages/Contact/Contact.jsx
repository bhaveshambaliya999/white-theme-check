import { isEmpty, onlyNumbers } from "@/CommanFunctions/commanFunctions";
import commanService from "@/CommanService/commanService";
import Loader from "@/CommanUIComp/Loader/Loader";
import { storesLocations } from "@/data/storeLocations";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { toast } from "react-toastify";

export default function Contact(props) {
  const isCallRef = useRef(false)
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const [countryDataDrp, setCountryDataDrp] = useState([]);
  const [getCountryDataDrp, setGetCountryDataDrp] = useState([]);
  const [phoneCodeDataDrp, setPhoneCodeDataDrp] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [country, setCountry] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [phoneCode, setPhoneCode] = useState("");

  const validateDigit = (e) => {
    var key = e.key;
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
      e.preventDefault();
    }
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

  const handleChangeContactUs = (e, value) => {
    if (value == "fname") {
      setFname(e.target.value);
    } else if (value == "lname") {
      setLname(e.target.value);
    } else if (value == "email") {
      setEmail(e.target.value);
    } else if (value == "topic") {
      setTopic(e.target.value);
    } else if (value == "country") {
      setCountry(e);
    } else if (value == "phoneCode") {
      setPhoneCode(e);
    } else if (value == "phone") {
      setMobileNo(e.target.value);
    } else if (value == "message") {
      setMessage(e.target.value);
    }
  };

  const countrySetDrp = () => {
    var data = JSON.parse(sessionStorage.getItem("country_data"));
    for (let c = 0; c < data?.length; c++) {
      data[c].value = data[c].name;
      data[c].label = data[c].name;
    }
    data?.splice(0, 0, { value: "", label: "Select Your Country*" });
    setGetCountryDataDrp(data);
    const datas = data?.filter((item) => item.value === country);
    setCountry(datas?.[0]);
    setTimeout(() => {
      phoneCodeSetDrp();
    });
  };

  const phoneCodeSetDrp = () => {
    var pdata = JSON.parse(sessionStorage.getItem("country_data"));
    for (let c = 0; c < pdata?.length; c++) {
      pdata[c].value = pdata[c].phonecode;
      pdata[c].label = pdata[c].phonecode + " - " + pdata[c].name;
    }
    pdata?.splice(0, 0, { value: "", label: "Phone Code*" });
    setPhoneCodeDataDrp(pdata);
    var data = pdata?.filter((item) => item.value === phoneCode);
    setPhoneCode(data?.[0]);
  };

  const handleSubmitContactUs = (e) => {
    e.preventDefault();
    const Contact_data_post = {
      a: "AddUpdateInquiry",
      unique_id: "",
      store_id: storeEntityIds.mini_program_id,
      first_name: fname,
      last_name: lname,
      email: email,
      mobile_no: phoneCode?.value + mobileNo,
      subject: topic,
      message: message,
      country: country?.value,
      status: 1,
      type: "B2C",
    };
    setLoading(true);
    let reg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let numberreg = /^\+?[1-9][0-9]{7,14}$/;
    if (
      ((fname &&
        lname &&
        email &&
        mobileNo &&
        phoneCode?.value &&
        topic &&
        country?.value &&
        message) !== "" ||
        undefined) &&
      country?.value !== "Select Your Country" &&
      phoneCode?.value !== "Phone Code" &&
      reg.test(email) !== false &&
      numberreg.test(mobileNo) !== false &&
      mobileNo.length >= 8
    ) {
      setLoading(true);
      commanService
        .postLaravelApi("/Subscribers", Contact_data_post)
        .then((res) => {
          if (res.data.success == 1) {
            setFname("");
            setLname("");
            setTopic("");
            setEmail("");
            setCountry("");
            setMobileNo("");
            setMessage("");
            setPhoneCode("");
            toast.success(res.data.message);
            setLoading(false);
            window.scroll(0, 0)
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
      } else if (!topic) {
        toast.error("Enter Your Topic");
      } else if (!email) {
        toast.error("Enter Your Email");
      } else if (!country?.value || country?.value == "Select Your Country") {
        toast.error("Select Your Country");
      } else if (!phoneCode?.value || phoneCode?.value == "Phone Code") {
        toast.error("Phone Code Required");
      } else if (!mobileNo) {
        toast.error("Mobile Number Required");
      } else if (mobileNo?.length < 8) {
        toast.error("Minimum 8 digit is Required in Phone Number");
      } else if (mobileNo?.length > 15) {
        toast.error("Maximum 15 digit is Required in Phone Number");
      } else if (!message) {
        toast.error("Enter Your Message");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    var data = JSON.parse(sessionStorage.getItem("country_data"));
    if(!isCallRef.current){
      if (data?.length > 0) {
        countrySetDrp();
      } else {
        countryDrp();
      }
      isCallRef.current = true
    }
  }, []);

  return (
    <main className="page-wrapper">
      <div className="mb-4 pb-4"></div>
      <section className="contact-us container">
        {loading && <Loader />}
        <div className="mw-1000">
          <div className="row">
            {props.contactDatas?.map((elm, i) => (
              <div key={i} className="col-lg-6 mb-5">
                <h3 className="mb-4">Store in {elm.city}</h3>
                <p className="mb-4">
                  {elm.address}
                  <br />
                  {elm.country}
                </p>
                <p className="mb-0">
                  {isEmpty(elm?.email) && <a href={`mailto:${elm.email}`}>{elm.email}</a>}
                  {isEmpty(elm?.mobile) && (
                    <>
                      <br />
                      <a href={`tel:${elm.mobile}`}>
                        {elm.phone_code} {elm.mobile}
                      </a>
                    </>)}
                </p>
              </div>
            ))}
          </div>
          <div className="contact-us__form">
            <form
              className="needs-validation"
              onSubmit={(e) => e.preventDefault()}
            >
              <h3 className="mb-5">Get In Touch</h3>
              <div className="my-4">
                <label htmlFor="contact_us_name1" className="form-label">First Name <span className="asteriskDot">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  id="contact_us_name1"
                  placeholder="First Name"
                  value={fname}
                  onChange={(e) => handleChangeContactUs(e, "fname")}
                  required
                />
              </div>
              <div className="my-4">
                <label htmlFor="contact_us_name2" className="form-label">Last Name <span className="asteriskDot">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  id="contact_us_name2"
                  placeholder="Last Name"
                  value={lname}
                  onChange={(e) => handleChangeContactUs(e, "lname")}
                  required
                />
              </div>
              <div className="my-4">
                <label htmlFor="contact_us_name3" className="form-label">Topic <span className="asteriskDot">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  id="contact_us_name3"
                  placeholder="Topic"
                  value={topic}
                  onChange={(e) => handleChangeContactUs(e, "topic")}
                  required
                />
              </div>
              <div className="my-4">
                <label htmlFor="contact_us_email" className="form-label">Email address <span className="asteriskDot">*</span></label>
                <input
                  type="email"
                  className="form-control"
                  id="contact_us_email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => handleChangeContactUs(e, "email")}
                  required
                  autoComplete="username"  
                />
              </div>
              <div className="my-4">
                <label className="form-label">Country <span className="asteriskDot">*</span></label>
                <Select
                  options={getCountryDataDrp}
                  placeholder="Select Your Country"
                  value={country}
                  onChange={(e) => handleChangeContactUs(e, "country")}
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
                  required={true}
                />
                {/* <label htmlFor="customerPasswodRegisterInput">Country *</label> */}
              </div>
              <div className="my-4">
                <div className="mb-3">
                  <label htmlFor="customerPasswodRegisterInput" className="form-label">Phone Number <span className="asteriskDot">*</span></label>
                  <div className="d-flex justify-content-start">
                    <div className="me-2" style={{ width: "30%" }}>
                      <Select
                        options={phoneCodeDataDrp}
                        placeholder="Phone Code"
                        value={phoneCode}
                        onChange={(e) => handleChangeContactUs(e, "phoneCode")}
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
                        required={true}
                      />
                    </div>
                    {/* <div className="pb-3"></div> */}

                    <div className="" style={{ width: "70%" }}>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        className="form-control form-control_gray"
                        minLength="8"
                        maxLength="15"
                        value={mobileNo}
                        onKeyPress={(e) => validateDigit(e)}
                        onChange={(e) => handleChangeContactUs(e, "phone")}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="my-4">
                <label className="form-label">Your Message <span className="asteriskDot">*</span></label>
                <textarea
                  className="form-control form-control_gray"
                  placeholder="Your Message"
                  cols="30"
                  rows="8"
                  value={message}
                  onChange={(e) => handleChangeContactUs(e, "message")}
                  required
                ></textarea>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={(e) => handleSubmitContactUs(e)}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <div className="section-gap"></div>
    </main>
  );
}
