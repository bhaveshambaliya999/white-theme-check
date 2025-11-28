import commanService from "@/CommanService/commanService";
import Loader from "@/CommanUIComp/Loader/Loader";
import {
  cartCount,
  DefaultBillingAddress,
  favCount,
  isLoginModal,
  isRegisterModal,
  isVerifyModal,
  loginData,
  verificationStatusAction,
  verifyMemberId,
} from "@/Redux/action";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const VerifyCode = (props) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  // const { memberIds, authenticatorNames } = location.state || {};
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const reduxLoginData = useSelector((state) => state.loginData);

const loginDatas =
  typeof window !== "undefined"
    ? JSON.parse(sessionStorage.getItem("loginData")) || reduxLoginData
    : reduxLoginData;

  const verifyMemberIds = useSelector((state) => state.verifyMemberId);
  const DefaultBillingAddresss = useSelector((state) => state.DefaultBillingAddress);
  
  const isLogin = Object.keys(loginDatas).length > 0;

  const [loading, setLoading] = useState(false);

  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");

  const handleChange = (event) => {
    if (/^\d*$/.test(event.target.value) && event.target.value.length <= 6) {
      setCode(event.target.value);
      setCodeError("");
    }
  };

  const guestToFavoriteMember = (logindata) => {
    const fav = {
      a: "GuestToFavoriteMember",
      store_id: storeEntityIds.mini_program_id,
      guest_id: "",
      member_id: logindata.member_id,
    };
    commanService
      .postLaravelApi("/FavouriteController", fav)
      .then((res) => {
        guestToMember(logindata);
      })
      .catch(() => {});
  };

  const guestToMember = (logindata) => {
    const guest = {
      a: "GuestToMember",
      store_id: storeEntityIds.mini_program_id,
      guest_id: "",
      member_id: logindata.member_id,
      customer_name: "guest",
    };

    commanService
      .postLaravelApi("/CartMaster", guest)
      .then((res) => {
        if (res.data.success === 1) {
          favouriteCartCount(logindata);
        //   sessionStorage.setItem("storeUrl", window.location.pathname);
         router.push("/");
        } else {
          favouriteCartCount(logindata);
        //   sessionStorage.setItem("storeUrl", window.location.pathname);
          router.push("/");
        }
      })
      .catch(() => {});
  };

  const favouriteCartCount = (logindata) => {
    const obj = {
      a: "get_count",
      store_id: storeEntityIds.mini_program_id,
      user_id: logindata.member_id,
    };
    commanService
      .postLaravelApi("/CartMaster", obj)
      .then((res) => {
        if (res.data.success === 1) {
          if (Object.keys(res.data.data).length > 0) {
            dispatch(favCount(res.data.data?.favourite_count));
            dispatch(cartCount(res.data.data?.cart_count));
          }
        } else {
          dispatch(favCount(0));
          dispatch(cartCount(0));
          toast.error(res.data.message);
        }
      })
      .catch(() => {
        dispatch(favCount(0));
        dispatch(cartCount(0));
      });
  };

  const addressData = (user) => {
    const Address = {
      a: "GetBilling",
      user_id: user,
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
            for (let c = 0; c < billingData.length; c++) {
              if (billingData[c].status === 1) {
                dispatch(DefaultBillingAddress(billingData[c]));
              }
            }
          }
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleVerifyCode = () => {
    setLoading(true);
    const codeVerify = {
      SITDeveloper: "1",
      a: "loginCodewiseAuthntication",
      entity_id: storeEntityIds.entity_id,
      tenant_id: storeEntityIds.tenant_id,
      member_id:
        verifyMemberIds !== ""
          ? verifyMemberIds
          : props.memberId
          ? props.memberId
          : "",
      code: code,
    };
    commanService
      .postApi("/TwoFactorAuthntication", codeVerify)
      .then((response) => {
        if (response.data.success === 1) {
          const logindata = response.data.data;
          dispatch(loginData(logindata));
          sessionStorage.setItem("loginData",JSON.stringify(logindata))
          router.push("/");
          toast.success(response.data.message);
          guestToFavoriteMember(logindata);
          if (DefaultBillingAddresss.length === 0) {
            addressData(logindata.member_id);
          }
          if (response.data.data.two_step_verification === "1") {
            dispatch(verificationStatusAction(1));
          }
          setLoading(false);
          dispatch(isVerifyModal(false));
        } else {
          toast.error(response.data.message);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  };

  return (
    <div>
      {loading && <Loader />}
      <div className="bg-white">
        <label className="mb-2 fw-semi-bold fs-2 d-flex justify-content-center">
          2-Step Verification
        </label>
        <main className="py-3 fs-6">
          <p>
            Please enter the 6 digit verification code your mobile application{" "}
            <b>{props.authenticatorName ? props.authenticatorName : " "}</b>{" "}
            generated
          </p>
          <div className="py-1">
            <label htmlFor="code" className="fs-5 fw-bold">
              6-digit code
            </label>
            <div>
              <input
                type="text"
                className="form-control w-100 py-2 px-1"
                value={code}
                onChange={handleChange}
              />
            </div>
            {codeError && (
              <p className="text-red my-0">
                <small>{codeError}</small>
              </p>
            )}
          </div>
        </main>
        <footer>
          <button
            type="button"
            className="btn btn-primary w-100"
            onClick={handleVerifyCode}
          >
            Verify Code
          </button>
          <div className="customer-option mt-4 text-center">
            <span className="text-secondary">No account yet?</span>{" "}
            <a
              href="#register-tab"
              className="btn-text js-show-register"
              onClick={() => {
                props.setTabActive({
                  ...props.tabActive,
                  login: false,
                  register: true,
                });
                dispatch(isLoginModal(false));
                dispatch(isRegisterModal(true));
                dispatch(isVerifyModal(false));
                dispatch(verifyMemberId(""));
                props.countryDrp();
              }}
            >
              Create Account
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default VerifyCode;
