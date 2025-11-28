import { useContextElement } from "@/context/Context";
import {
  allFilteredData,
  cartCount,
  couponCodeApplied,
  DefaultBillingAddress,
  diamondNumber,
  diamondPageChnages,
  discountCouponData,
  displayPricesTotal,
  donationDataLists,
  favCount,
  filterData,
  filteredData,
  foundationArrayData,
  isFilter,
  isLoginModal,
  isRegisterModal,
  isVerifyModal,
  loginData,
  mostSearchProductData,
  storeActiveFilteredData,
  storeFilteredData,
  storeFilteredDiamondObj,
  storeItemObject,
  verifyMemberId,
} from "@/Redux/action";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import EditAccount from "./EditAccount";

export default function Dashboard() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const reduxLoginData = useSelector((state) => state.loginData);

const loginDatas =
  typeof window !== "undefined"
    ? JSON.parse(sessionStorage.getItem("loginData")) || reduxLoginData
    : reduxLoginData;

  const { setCartProducts, setWishlistProducts } = useContextElement();


  // Logout
  const LogOut = () => {
    setTimeout(() => {
      dispatch(loginData({}));
      dispatch(DefaultBillingAddress([]));
      dispatch(allFilteredData([]));
      dispatch(displayPricesTotal(0));
      dispatch(donationDataLists([]));
      dispatch(filteredData([]));
      dispatch(foundationArrayData([]));
      dispatch(isFilter(false));
      dispatch(isLoginModal(false));
      dispatch(isRegisterModal(false));
      dispatch(filterData([]));
      dispatch(mostSearchProductData([]));
      dispatch(cartCount(0));
      dispatch(favCount(0));
      dispatch(couponCodeApplied(false));
      dispatch(discountCouponData({}));
      setCartProducts([]);
      setWishlistProducts([]);
      dispatch(storeItemObject({}));
      dispatch(storeFilteredDiamondObj({}));
      dispatch(storeActiveFilteredData({}));
      dispatch(storeFilteredData({}));
      dispatch(diamondPageChnages(false));
      dispatch(diamondNumber(""));
      dispatch(isVerifyModal(false))
      dispatch(verifyMemberId(""))
      // window.location.reload();
      router.push("/");
    }, 300);
    return dispatch(loginData({}));
  };

  return (
    <div className="col-lg-9">
      <div className="page-content my-account__dashboard">
        <div className="title-content">
          <i className="ic_user fs-3 pe-3"></i>
          <h3 className="fw-bold mb-0">Profile</h3>
        </div>
        <p>
          Hello <strong>{loginDatas.first_name}</strong> (not{" "}
          <strong>{loginDatas.first_name}?</strong>
          {/* <Link to="/" onClick={() => LogOut()}> */}
          Log out
          {/* </Link> */}
          )
        </p>
        <p>
          From your account dashboard you can view your&nbsp;
          <Link className="unerline-link" href="/account_orders">
            recent orders
          </Link>
          , manage your&nbsp;
          <Link className="unerline-link" href="/account_edit_address">
            shipping and billing addresses
          </Link>
          , and&nbsp;
          <Link className="unerline-link" href="/account_changePassword">
            edit your password and account details.
          </Link>
        </p>
        <EditAccount />
      </div>
    </div>
  );
}
