import { Link, useLocation, useNavigate } from "react-router-dom";

import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import commanService from "@/CommanService/commanService";
import {
  activeImageData,
  ActiveStepsDiy,
  DiySteperData,
  engravingObj,
  isLoginModal,
  isRegisterModal,
  previewImageDatas,
  saveEmbossings,
  socialUrlData,
  storeCurrency,
  storeEmbossingData,
} from "@/Redux/action";
import Loader from "@/CommanUIComp/Loader/Loader";
import { toast } from "react-toastify";
import { isEmpty, RandomId } from "@/CommanFunctions/commanFunctions";

export default function Footer8() {

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

  const storeCurrencyDatas = useSelector((state) => state.storeCurrencyData);

  const isLogin = Object.keys(loginDatas).length > 0;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [loader, setLoader] = useState(false);

  // Tost Msg
  const [toastShow, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Footer Active
  const [FooterActive, setFooterActive] = useState("");

  // Footer Data
  const [footerLogo, setFooterLogo] = useState([]);
  const [footerContent, setFooterContent] = useState([]);
  const [footerSocialLink, setfooterSocialLink] = useState([]);
  const [footerContact, setFooterContact] = useState([]);

  // Form email
  const [email, setEmail] = useState("");

  const footerData = useCallback(
    (data) => {
      setLoader(true);
      const obj = {
        a: "getHomeFooterDetail",
       store_id: storeEntityIds.mini_program_id,
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        origin: storeEntityIds.cmp_origin,
        user_id:
          Object.keys(loginDatas).length > 0
            ? loginDatas.member_id
            : RandomId,
        type: "B2C",
      };
      commanService
        .postApi("/StoreCart", obj)
        .then((res) => {
          if (res["data"]["success"] === 1) {
            setFooterContent([]);
            const footerData = res["data"]["data"];
            if (Object.keys(footerData).length > 0) {
              const footerLogo = footerData?.logo_data;
              const footerContentData = footerData?.content_data;
              const footerSocialData = footerData?.socialmedia_link;
              const footerContact = footerData?.contact_data;
              if (footerLogo.length > 0) {
                setFooterLogo(footerLogo);
              }

              setFooterContent(footerContentData);
              if (footerSocialData.length > 0) {
                setfooterSocialLink(footerSocialData);
                dispatch(socialUrlData(footerSocialData));
              }
              if (footerContact.length > 0) {
                footerContact[0]["address"] = footerContact[0]["building"];
                if (footerContact[0]["building_name"] != "") {
                  footerContact[0]["address"] =
                    footerContact[0]["address"] +
                    ", " +
                    footerContact[0]["building_name"];
                }
                footerContact[0]["address"] =
                  footerContact[0]["address"] +
                  ", " +
                  footerContact[0]["street"];
                // if (footerContact[0]["description"] != "") {
                //   footerContact[0]["address"] =
                //     footerContact[0]["address"] +
                //     ", " +
                //     footerContact[0]["description"];
                // }
                if (footerContact[0]["city_name"] != "") {
                  footerContact[0]["address"] =
                    footerContact[0]["address"] +
                    ", " +
                    footerContact[0]["city_name"];
                }
                if (footerContact[0]["pincode"] != "") {
                  footerContact[0]["address"] =
                    footerContact[0]["address"] +
                    "-" +
                    footerContact[0]["pincode"];
                }
                footerContact[0]["address"] =
                  footerContact[0]["address"] +
                  ", " +
                  footerContact[0]["state_name"] +
                  ", " +
                  footerContact[0]["country_name"] +
                  ".";
                setFooterContact(footerContact);

              }
            } else {
              let arr = [];
              arr.push(
                { code: "blog", name: "Blog" },
                { code: "about-us", name: "About Us" },
                { code: "contact-us", name: "Contact Us" }
              );
              setFooterContent(arr);
            }
            setLoader(false);
          } else {
            let arr = [];
            arr.push(
              { code: "blog", name: "Blog" },
              { code: "about-us", name: "About Us" },
              { code: "contact-us", name: "Contact Us" }
            );
            setFooterContent(arr);
            setLoader(false);
          }
        })
        .catch(() => {
          let arr = [];
          arr.push(
            { code: "blog", name: "Blog" },
            { code: "about-us", name: "About Us" },
            { code: "contact-us", name: "Contact Us" }
          );
          setFooterContent(arr);
          setLoader(false);
        });
    },
    [loginDatas, dispatch]
  );

  //call of function of footerData
  useEffect(() => {
    const data = storeEntityIds;
    if (Object.keys(data).length > 0) {
      footerData(data);
      setFooterContent([]);
      if (isEmpty(storeEntityIds.store_currency) !== '') {
        dispatch(storeCurrency(storeEntityIds.store_currency));
      } else if (storeCurrencyDatas?.length) {
        dispatch(storeCurrency(storeCurrencyDatas?.[0]?.mp_store_price));
      }
    }
  }, [storeEntityIds, loginDatas, storeCurrencyDatas]);

  const updateCartCurrency = (e) => {
    const obj = {
      a: "updateCartCurrency",
      store_id: storeEntityIds.mini_program_id,
      SITDeveloper: "1",
      origin: storeEntityIds.origin,
      member_id:
        Object.keys(loginDatas).length > 0
          ? loginDatas.member_id
          : RandomId,
      new_currency: e,
    };
    commanService
      .postApi("/StoreCart ", obj)
      .then((res) => {
        if (res.data.success === 1) {
          if (location.pathname.includes("/start-with-a-item")) {
            dispatch(storeEmbossingData([]));
            dispatch(saveEmbossings(false));
            dispatch(previewImageDatas([]));
            dispatch(activeImageData([]));
            dispatch(engravingObj({}))
            dispatch(DiySteperData([]))
            dispatch(ActiveStepsDiy(0))
            navigate("/diy")
          }
        }
      })
      .catch(() => { });
  };

  const changeCurrency = (e) => {
    const data = storeCurrencyDatas.filter(
      (s) => s.mp_store_price === e.target.value
    );

    if (data?.[0]?.mp_b2c_url && data?.[0].is_store !== 1) {
      window.open(data[0]?.mp_b2c_url, "_blank", "");
    } else {
      updateCartCurrency(data?.[0].mp_store_price);
      dispatch(storeCurrency(data?.[0]?.mp_store_price));
      navigate(pathname.includes("_checkout") ? "/shop_cart" : pathname)
      window.scroll(0, 0);
    }
  };

  const subscribeEmail = () => {
    const obj = {
      a: "AddUpdateSubscribers",
      unique_id: "",
      store_id: storeEntityIds.mini_program_id,
      email: email,
    };

    setLoader(true);
    if (email != "") {
      commanService
        .postLaravelApi("/Subscribers", obj)
        .then((res) => {
          if (res.data.success === 1) {
            setEmail("");
            toast.success(res.data.message);
            if (!isLogin) {
              navigate("/login_register");
              dispatch(isRegisterModal(false));
              dispatch(isLoginModal(true));
            }
            setLoader(false);
          } else {
            setLoader(false);
            toast.error(res.data.message);
          }
          window.scroll(0, 0)
          setEmail("");
        })
        .catch(() => { });
    } else {
      setLoader(false);
    }
  };

  const isMenuActive = (menu, item) => {
    return pathname
      .toLowerCase()
      .toString()
      .includes(`/${menu.split(" ").join("-").toLowerCase()}`);
  };

  return (
    <footer id="footer" className="footer footer_type_2 pb-5 pb-sm-0 bordered ">
      <div className="footer-top container">
        <div className="block-newsletter">
          <h3 className="block__title">DON'T MISS THE CHANGE TO GET 40% OFF</h3>
          <p>Get the latest products and news update daily in fastest.</p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="block-newsletter__form"
          >
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="Your email address"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              required
              autoComplete="username"  
            />
            <button className="btn btn-primary fw-medium" type="submit" onClick={() => {
              subscribeEmail();
            }}>
              JOIN
            </button>
          </form>
        </div>
      </div>
      {/* <!-- /.footer-top container --> */}

      <div className="footer-middle container">
        <div className="row row-cols-lg-5 row-cols-2">
          <div className="footer-column footer-store-info col-12 mb-4 mb-lg-0">
            {footerLogo.length > 0 &&
              footerLogo.map((L, i) => {
                return (
                  <React.Fragment key={i}>
                    {L.image !== "" ? (
                      <React.Fragment>
                        {L.logo_type === "FOOTER" && (
                          <div className="logo">
                            <Link to="/">
                              <img
                                src={L.image}
                                alt={L.logo_type}
                                width={113}
                                height={28}
                                className="logo__image d-block"
                              />
                            </Link>
                          </div>)}
                      </React.Fragment>
                    ) : (
                      ""
                    )}
                  </React.Fragment>
                );
              })}
            {/* <!-- /.logo --> */}
            {footerContact.length > 0 &&
              footerContact.map((e, i) => (
                <React.Fragment key={i}>
                  <p className="footer-address">{e.address}</p>

                  <p className="m-0">
                    <strong className="fw-medium"><a href={`mailto:${e?.email}`}>{e.email}</a></strong>
                  </p>
                  <p>
                    <strong className="fw-medium"><a href={`tel:${e?.mobile}`}>{e.mobile}</a></strong>
                  </p>
                </React.Fragment>
              ))}

            <ul className="social-links list-unstyled d-flex flex-wrap mb-0">
              {footerSocialLink.length > 0 &&
                footerSocialLink.map((s, i) => (
                  <li key={i}>
                    <a target={"_blank"}
                      href={s.url} className="footer__social-link d-block">
                      <img
                        src={s.image}
                        alt=""
                        className="img-fluid"
                        style={{ width: "25px" }}
                      ></img>
                    </a>
                  </li>
                ))}
            </ul>
          </div>
          {/* <!-- /.footer-column --> */}

          <div className="footer-column footer-menu mb-4 mb-lg-0">
            {footerContent.length > 0 &&
              (footerContent || []).map((e, i) => {
                if (e.category_name === "Customer Service") {
                  return (
                    <React.Fragment key={i}>
                      <h6 className="sub-menu__title text-uppercase">{e.category_name}</h6>
                      <ul className="sub-menu__list list-unstyled">
                        {(e.data || []).map((d, index) => {
                          return (
                            <li key={index} className="sub-menu__item">
                              <Link
                                to={`/${d?.ecm_code.toLowerCase()}`}
                                className={`${isMenuActive(d?.ecm_code.toLowerCase()) ? "menu-active" : ""} menu-link menu-link_us-s`}
                              >
                                {d?.ecm_name}
                              </Link>
                            </li>
                          );
                        })}

                      </ul>
                    </React.Fragment>);
                }
              })}
          </div>
          {/* <!-- /.footer-column --> */}

          <div className="footer-column footer-menu mb-4 mb-lg-0">
            {footerContent.length > 0 &&
              (footerContent || []).map((e, i) => {
                if (e.category_name === "About Us") {
                  return (
                    <React.Fragment key={i}>
                      <h5 className="sub-menu__title text-uppercase">
                        {e.category_name}
                      </h5>
                      <ul className="sub-menu__list list-unstyled">
                        <li className="sub-menu__item">
                          <Link className={`${pathname.includes("/about-us") ? "menu-active" : ""} menu-link menu-link_us-s`} to={"/about-us"}>
                            About Us
                          </Link>
                        </li>
                        {(e.data || []).map((d, index) => {
                          return (
                            <li key={index} className="sub-menu__item">
                              <Link
                                to={`/${d?.ecm_code.toLowerCase()}`}
                                className={`${isMenuActive(d?.ecm_code.toLowerCase()) ? "menu-active" : ""} menu-link menu-link_us-s`}
                              >
                                {d?.ecm_name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </React.Fragment>
                  );
                }
              })}
          </div>
          {/* <!-- /.footer-column --> */}

          <div className="footer-column footer-menu mb-4 mb-lg-0">
            {footerContent.length > 0 &&
              (footerContent || []).map((e, i) => {
                if (e.category_name === "Why") {
                  return (
                    <React.Fragment key={i}>
                      <h5 className="sub-menu__title text-uppercase">
                        {e.category_name}
                      </h5>
                      <ul className="sub-menu__list list-unstyled">
                        <li className="sub-menu__item">
                          <Link className={`${pathname.includes("/contact") ? "menu-active" : ""} menu-link menu-link_us-s`} to={"/contact-us"}>
                            24/7 Customer Support
                          </Link>
                        </li>
                        {(e.data || []).map((d, index) => {
                          return (
                            <li key={index} className="sub-menu__item">
                              <Link
                                to={`/${d?.ecm_code.toLowerCase()}`}
                                className={`${isMenuActive(d?.ecm_code.toLowerCase()) ? "menu-active" : ""} menu-link menu-link_us-s`}
                              >
                                {d?.ecm_name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </React.Fragment>
                  );
                }
              })}
          </div>
          {/* <!-- /.footer-column --> */}
        </div>
        {/* <!-- /.row-cols-5 --> */}
      </div>
      {/* <!-- /.footer-middle container --> */}

      <div className="footer-bottom">
        <div className="container d-md-flex align-items-center">
          <span className="footer-copyright me-auto">
            Copyright © {new Date().getFullYear()}{" "}
            {storeEntityIds.store_name}
          </span>
          <div className="footer-settings d-md-flex align-items-center">
            {Object.keys(storeEntityIds).length > 0
              ? storeCurrencyDatas.length > 0 && (
                <div className="d-flex align-items-center">
                  <label
                    htmlFor="footerSettingsCurrency"
                    className="ms-md-3 me-2 text-secondary"
                  >
                    Currency
                  </label>
                  <Select
                    id="footerSettingsCurrency"
                    className="form-select form-select-sm bg-transparent border-0"
                    aria-label="Default select example"
                    name="store-language"
                    value={storeCurrencys}
                    onChange={(e) => changeCurrency(e)}
                  >
                    {storeCurrencyDatas &&
                      storeCurrencyDatas.map((e, i) => {
                        return (
                          <option
                            className="footer-select__option"
                            key={i}
                            value={e.mp_store_price}
                          >
                            {e.mp_store_price}
                          </option>
                        );
                      })}
                  </Select>
                </div>
              )
              : ""}
          </div>
          {/* <!-- /.footer-settings --> */}
        </div>
        {/* <!-- /.container d-flex align-items-center --> */}
      </div>
      {/* <!-- /.footer-bottom container --> */}
    </footer>
  );
}
