"use client";
import { useRouter } from "next/router";
import commanService from "@/CommanService/commanService";
import Loader from "@/CommanUIComp/Loader/Loader";
import { loginData } from "@/Redux/action";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const AccountChangePassword = () => {
  const reduxLoginData = useSelector((state) => state.loginData);

const loginDatas =
  typeof window !== "undefined"
    ? JSON.parse(sessionStorage.getItem("loginData")) || reduxLoginData
    : reduxLoginData;

  
  const dispatch = useDispatch();
  const router = useRouter();
  //change password
  const [loading, setLoading] = useState(false);
  const [oldpasswd, setOldpasswd] = useState("");
  const [newpasswd, setNewpasswd] = useState("");
  const [reEnterpasswd, setReEnterpasswd] = useState("");
  const [hideShowCurntPasswd, setHideShowCurntPasswd] = useState(false);
  const [hideShowNewPasswd, setHideShowNewPasswd] = useState(false);
  const [hideShowReEntpasswd, setHideShowReEntpasswd] = useState(false);

  //Change PassWord
  const changePassWord = (e, value) => {
    e.preventDefault();
    if (value == "old") {
      setOldpasswd(e.target.value);
    } else if (value == "new") {
      setNewpasswd(e.target.value);
    } else if (value == "re-enter") {
      setReEnterpasswd(e.target.value);
    }
  };

  const updatePasswd = (e, unique_id) => {
    e.preventDefault();
    const passwd_update = {
      a: "changePassword",
      unique_id: unique_id,
      old_password: oldpasswd,
      new_password: newpasswd,
    };
    setLoading(true);
    if (
      ((oldpasswd && newpasswd && reEnterpasswd) !== "" || undefined) &&
      (oldpasswd?.length && newpasswd?.length && reEnterpasswd?.length) >= 8 &&
      (reEnterpasswd === newpasswd) == true
    ) {
      commanService
        .postLaravelApi("/AuthController", passwd_update)
        .then((res) => {
          if (res.data.success == 1) {
            toast.success(res.data.message);
            dispatch(loginData({}));
            sessionStorage.removeItem("loginData")
            router.push("/");
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
      if (!oldpasswd) {
        toast.error("Enter Your Current Password");
      } else if (oldpasswd.length < 8) {
        toast.error("Manimum 8 Letters In Current PassWord");
      } else if (!newpasswd) {
        toast.error("Enter Your New Password");
      } else if (newpasswd.length < 8) {
        toast.error("Manimum 8 Letters In New PassWord");
      } else if (!reEnterpasswd) {
        toast.error("Confirm Password Required");
      } else if ((reEnterpasswd === newpasswd) == false) {
        toast.error("Confirm Password is Wrong");
      } else if (reEnterpasswd.length < 8) {
        toast.error("Manimum 8 Letters In Confirm PassWord");
      }
      setLoading(false);
    }
  };

  return (
    <div className="col-lg-9">
      {loading && <Loader />}
      <div className="page-content">
        <div className="title-content">
          <i className="ic_password fs-3 pe-3"></i>
          <h3 className="fw-bold mb-0">Change Password</h3>
        </div>
        <div className="register-form">
          <form className="needs-validation row">
            <div className="col-12 col-sm-10 col-lg-6 position-relative">
              <div className="mb-3">
                <label htmlFor="customerNameRegisterInput1" className="form-label">Current Password <span className="asteriskDot">*</span></label>
                <input
                  name="register_firstname"
                  type={`${
                    hideShowCurntPasswd !== false ? "text" : "password"
                  }`}
                  className="form-control form-control_gray"
                  id="customerNameRegisterInput1"
                  placeholder="Current Password*"
                  value={oldpasswd}
                  onChange={(e) => changePassWord(e, "old")}
                  required
                />
                {/* <label htmlFor="customerNameRegisterInput1">
                  Current Password *
                </label> */}

                <div className="position-absolute top-50 end-0 translate-middle-y pe-3">
                  {oldpasswd !== "" ? (
                    hideShowCurntPasswd === false ? (
                      <i
                        className="ic_eye_close"
                        onClick={() => setHideShowCurntPasswd(true)}
                      ></i>
                    ) : (
                      <i
                        className="ic_eye_open"
                        onClick={() => setHideShowCurntPasswd(false)}
                      ></i>
                    )
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-10 col-lg-6 position-relative">
              <div className="mb-3">
                <label htmlFor="customerNameRegisterInput2" className="form-label">New Password <span className="asteriskDot">*</span></label>
                <input
                  name="register_lastname"
                  type={`${hideShowNewPasswd !== false ? "text" : "password"}`}
                  className="form-control form-control_gray"
                  id="customerNameRegisterInput2"
                  placeholder="New Password*"
                  value={newpasswd}
                  onChange={(e) => changePassWord(e, "new")}
                  required
                  autocomplete="new-password"
                />
                {/* <label htmlFor="customerNameRegisterInput2">
                  New Password *
                </label> */}
                <div className="position-absolute top-50 end-0 translate-middle-y pe-3">
                  {newpasswd !== "" ? (
                    hideShowNewPasswd === false ? (
                      <i
                        className="ic_eye_close"
                        onClick={() => setHideShowNewPasswd(true)}
                      ></i>
                    ) : (
                      <i
                        className="ic_eye_open"
                        onClick={() => setHideShowNewPasswd(false)}
                      ></i>
                    )
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-10 col-lg-6">
              <div className="mb-3">
                <label htmlFor="customerNameRegisterInput3" className="form-label">Confirm Password <span className="asteriskDot">*</span></label>
                <input
                  name="register_lastname"
                  type={`${
                    hideShowReEntpasswd !== false ? "text" : "password"
                  }`}
                  className="form-control form-control_gray"
                  id="customerNameRegisterInput3"
                  placeholder="Confirm Password*"
                  value={reEnterpasswd}
                  onChange={(e) => changePassWord(e, "re-enter")}
                  required
                  autocomplete="current-password"
                />
                {/* <label htmlFor="customerNameRegisterInput3">
                  Confirm Password *
                </label> */}
                <div className="position-absolute top-50 end-0 translate-middle-y pe-3">
                  {reEnterpasswd !== "" ? (
                    hideShowReEntpasswd === false ? (
                      <i
                        className="ic_eye_close"
                        onClick={() => setHideShowReEntpasswd(true)}
                      ></i>
                    ) : (
                      <i
                        className="ic_eye_open"
                        onClick={() => setHideShowReEntpasswd(false)}
                      ></i>
                    )
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="pb-3"></div>
            <div className="form-floating mb-3">
              <button
                className="btn btn-primary text-uppercase"
                type="submit"
                onClick={(e) => updatePasswd(e, loginDatas.unique_id)}
              >
                UPDATE
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountChangePassword;
