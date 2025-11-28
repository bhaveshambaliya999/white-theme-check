import commanService from "@/CommanService/commanService";
import Loader from "@/CommanUIComp/Loader/Loader";
import { isLoginModal, isRegisterModal } from "@/Redux/action";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";

export default function ResetPassword() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const storeEntityIds = useSelector((state) => state.storeEntityId);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //Show Password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const ResetPasswordURL = pathname.includes("reset-password/");
  var KEY = pathname;
  var number = KEY.replace(/[^0-9]/g, "");
  let reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const mail_key = number;

  const forgetPassword = (e) => {
    e.preventDefault();
    const obj = {
      a: "ForgetPassword",
      store_id: storeEntityIds.mini_program_id,
      email: email,
      mail_url: window.location.origin,
      store_type: "B2C",
    };
    if (email !== "" && reg.test(email) !== false) {
      setLoading(true);
      commanService.postLaravelApi("/AuthController", obj).then((res) => {
        if (res.data.success === 1) {
          toast.success(res?.data?.message);
          setLoading(false);
          setEmail("");
        } else {
          toast.error(res?.data?.message);
          setLoading(false);
          setEmail("");
        }
      });
    }else{
      toast.error("Please enter your correct email!");
      setLoading(false);
    }
  };

  const resetPassword = (e) => {
    e.preventDefault();
    setLoading(true);
    if (newPassword === confirmPassword) {
      const obj = {
        a: "resetPassword",
        new_password: newPassword,
        confirm_password: confirmPassword,
        mail_key: mail_key,
      };

      commanService.postLaravelApi("/AuthController", obj).then((res) => {
        if (res.data.success === 1) {
          router.push("/");
          setLoading(false);
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
          setLoading(false);
        }
      });
    } else {
      toast.error("confirm password are wrong.");
      setLoading(false);
    }
  };

  return (
    <main className="page-wrapper">
      <div className="mb-4 pb-4"></div>
      <section className="login-register container">
        {loading && <Loader />}
        <h2 className="section-title text-center fs-3 mb-xl-5">
          Set a New Password
        </h2>
        <p>We will send you an email to reset your password</p>
        {ResetPasswordURL ? (
          <>
            <form className="needs-validation row">
              <div className="col-12 position-relative">
                <div className="mb-3">
                  <label
                    htmlFor="customerNameRegisterInput"
                    className="form-label"
                  >
                    New Password <span className="asteriskDot">*</span>
                  </label>
                  <div className="position-relative">
                    <input
                      name="register_lastname"
                      type={`${showPassword !== false ? "text" : "password"}`}
                      className="form-control form-control_gray"
                      id="customerNameRegisterInput"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <div className="position-absolute top-50 end-0 translate-middle-y pe-3">
                      {newPassword !== "" ? (
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
              </div>
              <div className="col-12">
                <div className="mb-3">
                  <label
                    htmlFor="customerNameRegisterInput"
                    className="form-label"
                  >
                    Confirm Password <span className="asteriskDot">*</span>
                  </label>
                  <div className="position-relative">
                    <input
                      name="register_lastname"
                      type={`${
                        showConfirmPassword !== false ? "text" : "password"
                      }`}
                      className="form-control form-control_gray"
                      id="customerNameRegisterInput"
                      placeholder="Confirm Password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <div className="position-absolute top-50 end-0 translate-middle-y pe-3">
                      {confirmPassword !== "" ? (
                        showConfirmPassword === false ? (
                          <i
                            className="ic_eye_close"
                            onClick={() => setShowConfirmPassword(true)}
                          ></i>
                        ) : (
                          <i
                            className="ic_eye_open"
                            onClick={() => setShowConfirmPassword(false)}
                          ></i>
                        )
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="pb-3"></div>

              <button
                className="btn btn-primary text-uppercase"
                type="submit"
                onClick={(e) => resetPassword(e)}
              >
                SUBMIT
              </button>
            </form>
          </>
        ) : (
          <div className="reset-form">
            <form className="needs-validation">
              <div className="mb-3">
                <label className="form-label">
                  Email address <span className="asteriskDot">*</span>
                </label>
                <input
                  name="login_email"
                  type="email"
                  className="form-control form-control_gray"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  // autoComplete="username"
                />
              </div>

              <button
                className="btn btn-primary w-100 text-uppercase"
                type="submit"
                onClick={(e) => forgetPassword(e)}
              >
                Submit
              </button>

              <div className="customer-option mt-4 text-center">
                <span className="text-secondary">Back to&nbsp;</span>
                <Link
                  href="/login_register"
                  className="btn-text js-show-register"
                  onClick={() => {
                    dispatch(isLoginModal(true));
                    dispatch(isRegisterModal(false));
                  }}
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
        )}
      </section>
      <div className="section-gap"></div>
    </main>
  );
}
