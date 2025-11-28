// import { closeModalUserlogin } from "@/utlis/aside";
import { usePathname, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "bootstrap";
import {
  isLoginModal,
  isRegisterModal,
  isVerifyModal,
  loginData,
  verifyMemberId,
} from "@/Redux/action";
import commanService from "@/CommanService/commanService";
import { toast } from "react-toastify";
import Loader from "@/CommanUIComp/Loader/Loader";
import { useRouter } from "next/router";


export default function CustomerLogin() {
  const dispatch = useDispatch();
  const router = useRouter(); 
  const pathname = usePathname(); 
  const params = useParams(); 
  const searchParams = useSearchParams();
  // From Value
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [uname, setUname] = useState("");
  const storeEntityIds = useSelector((state) => state.storeEntityId);

  const [loading, setLoading] = useState(false);

  // Verification
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
    if (
      email !== "" &&
      password !== "" &&
      reg.test(email) !== false &&
      password.length >= 8
    ) {
      setLoading(true);
      commanService
        .postLaravelApi("/AuthController", obj)
        .then((res) => {
          if (res.data.success === 1) {
            if (res.data.data.two_step_verification === 1) {
              setMemberId(res.data.data.member_id);
              setAuthenticatorName(res.data.data.authnticator_name);
              dispatch(verifyMemberId(res.data.data.member_id));
              dispatch(isVerifyModal(true));
              setLoading(false);
              router.push("/login_register");
            } else {
              const logindata = res.data.data;
              dispatch(loginData(logindata));
              sessionStorage.setItem("loginData",JSON.stringify(logindata))
              dispatch(isVerifyModal(false));
              setLoading(false);
              if (pathname.includes("/login") || pathname.includes("/reset")) {
                router.push("/");
              } else {
                router.push(pathname);
              }
            }
            setLoading(false);
            setEmail("");
            setPassword("");
            closeModalUserlogin?.();
          } else {
            toast.error(res.data.message);
            setLoading(false);
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
      setLoading(false);
    }
  };

  // const register = (e) => {
  //   e.preventDefault();
  //   var obj = {
  //     a: "signup",
  //     email: email,
  //     password: password,
  //     first_name: uname,
  //     store_id: storeEntityIds.mini_program_id,
  //   };
  //   if (
  //     email !== "" &&
  //     password !== "" &&
  //     uname !== "" &&
  //     reg.test(email) !== false &&
  //     password.length >= 8
  //   ) {
  //     setLoading(true);
  //     commanService
  //       .postLaravelApi("/AuthController", obj)
  //       .then((res) => {
  //         if (res.data.success === 1) {
  //           const Registerdata = res.data.data;
  //           dispatch(loginData(Registerdata));
  //           setLoading(false);
  //         } else {
  //           toast.error(res.data.message);
  //           setLoading(false);
  //         }
  //         setEmail("");
  //         setPassword("");
  //         setUname("");
  //       })
  //       .catch(() => {});
  //   } else {
  //     if (isEmpty(uname) === "") {
  //       toast.error("The First Name field is required.");
  //     } else if (isEmpty(email) === "") {
  //       toast.error("The Email field is required.");
  //     } else if (reg.test(email) === false) {
  //       toast.error("Please Enter valid Email.");
  //     } else if (isEmpty(password) === "") {
  //       toast.error("The Password field is required.");
  //     } else if (password.length < 8) {
  //       toast.error("The Password must be at least 8 characters.");
  //     }
  //     setLoading(false);
  //   }
  // };

  const closeModalUserlogin = () => {
    const pageOverlay = document.getElementById("pageOverlay");
    const shopFilter = document.getElementById("userAside");
    pageOverlay.classList.remove("page-overlay_visible");
    shopFilter.classList.remove("aside_visible");
    setEmail("");
    setPassword("");
  };

  useEffect(() => {
  const pageOverlay = document.getElementById("pageOverlay");

  if (!pageOverlay) return; // prevent error

  pageOverlay.addEventListener("click", closeModalUserlogin);

  return () => {
    pageOverlay.removeEventListener("click", closeModalUserlogin);
  };
}, []);

  return (
    <div
      id="userAside"
      className="aside aside_right overflow-hidden customer-forms "
    >
      {loading && <Loader />}
      <div className="customer-forms__wrapper d-flex position-relative">
        <div className="customer__login">
          <div className="aside-header d-flex align-items-center">
            <h3 className="text-uppercase fs-6 mb-0">Login</h3>
            <button
              onClick={() => closeModalUserlogin()}
              className="btn-close-lg js-close-aside ms-auto"
              aria-label={"Close User login"}
            />
          </div>
          <form className="aside-content">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Username or email address <span className="asteriskDot">*</span></label>
              <input
                name="email"
                id="email"
                type="email"
                className="form-control form-control_gray"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email Address" 
                autoComplete="username"  
              />
            </div>
            {/* <div className="pb-3" /> */}
            <div className="mb-3">{/* form-label-fixed */}
              <label htmlFor="password" className="form-label">Password <span className="asteriskDot">*</span></label>
              <div className="position-relative">
                <input
                  id="password"
                  name="password"
                  className="form-control form-control_gray"
                  type={`${showPassword !== false ? "text" : "password"}`}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-label="password" 
                  autoComplete="current-password"  
                />
                <div className="position-absolute top-50 end-0 translate-middle-y pe-3">
                  {password !== "" ? (
                    showPassword === false ? (
                      <i
                        className="ic_eye_close" aria-hidden="true"
                        onClick={() => setShowPassword(true)}
                      ></i>
                    ) : (
                      <i
                        className="ic_eye_open" aria-hidden="true"
                        onClick={() => setShowPassword(false)}
                      ></i>
                    )
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center mb-3 pb-2">
              <div className="form-check mb-0">
                <input
                  name="remember"
                  className="form-check-input form-check-input_fill"
                  type="checkbox"
                  defaultValue
                  id="RememberMe"
                  aria-label="Remember Me" 
                />
                <label htmlFor="RememberMe" className="form-check-label text-secondary">
                  Remember me
                </label>
              </div>
              <Link
                href="/reset_password"
                aria-label="Lost password" 
                className="btn-text ms-auto"
                onClick={() => {
                  dispatch(isLoginModal(true));
                  dispatch(isRegisterModal(false));
                  dispatch(isVerifyModal(false));
                  closeModalUserlogin();
                }}
              >
                Lost password?
              </Link>
            </div>
            <button
              className="btn btn-primary w-100 text-uppercase"
              onClick={(e) => login(e)} aria-label="Log In" 
            >
              Log In
            </button>
            <div className="customer-option mt-4 text-center">
              <span className="text-secondary">No account yet?</span>{" "}
              <Link
                href="/login_register"
                aria-label="Create Account" 
                className="btn-text js-show-register"
                onClick={() => {
                  dispatch(isRegisterModal(true));
                  dispatch(isLoginModal(false));
                  dispatch(isVerifyModal(false));
                  closeModalUserlogin();
                }}
              >
                Create Account
              </Link>
            </div>
          </form>
        </div>
        {/* <div className="customer__register">
          <div className="aside-header d-flex align-items-center">
            <h3 className="text-uppercase fs-6 mb-0">Create an account</h3>
            <button className="btn-close-lg js-close-aside btn-close-aside ms-auto" />
          </div>
          <form className="aside-content">
            <div className="form-floating mb-4">
              <input
                name="username"
                type="text"
                className="form-control form-control_gray"
                placeholder="Username"
                value={uname}
                onChange={(e) => setUname(e.target.value)}
              />
              <label>Username</label>
            </div>
            <div className="pb-1" />
            <div className="form-floating mb-4">
              <input
                name="email"
                type="email"
                className="form-control form-control_gray"
                placeholder="user@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email address *</label>
            </div>
            <div className="pb-1" />
            <div className="form-label-fixed mb-4">
              <label className="form-label">Password *</label>
              <input
                name="password"
                className="form-control form-control_gray"
                type="password"
                placeholder="*******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className="text-secondary mb-4">
              Your personal data will be used to support your experience
              throughout this website, to manage access to your account, and for
              other purposes described in our privacy policy.
            </p>
            <button
              className="btn btn-primary w-100 text-uppercase"
              type="submit"
              onClick={(e) => register(e)}
            >
              Register
            </button>
            <div className="customer-option mt-4 text-center">
              <span className="text-secondary">Already have account?</span>
              <a href="#" className="btn-text js-show-login">
                Login
              </a>
            </div>
          </form>
        </div> */}
      </div>
    </div>
  );
}
