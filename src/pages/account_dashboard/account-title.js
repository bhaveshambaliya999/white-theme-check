import { useContextElement } from "@/context/Context";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation"; // ✅ use only from next/navigation
import {
  activeDIYtabs,
  activeImageData,
  ActiveStepsDiy,
  addedDiamondData,
  addedRingData,
  caratVlaues,
  cartCount,
  diamondDIYimage,
  diamondImage,
  diamondNumber,
  diamondPageChnages,
  diamondSelectShape,
  diamondShape,
  dimaondColorType,
  DIYName,
  DiySteperData,
  engravingObj,
  favCount,
  filterData,
  filteredData,
  finalCanBeSetData,
  isFilter,
  isLoginModal,
  isRegisterModal,
  isRingSelected,
  IsSelectedDiamond,
  jeweleryDIYimage,
  jeweleryDIYName,
  loginData,
  previewImageDatas,
  saveEmbossings,
  serviceAllData,
  storeActiveFilteredData,
  storeDiamondArrayImage,
  storeDiamondNumber,
  storeEmbossingData,
  storeFilteredData,
  storeFilteredDiamondObj,
  storeItemObject,
  storeProdData,
  storeSelectedDiamondData,
  storeSelectedDiamondPrice,
  storeSpecData,
} from "@/Redux/action";

export default function AccountTitle() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const reduxLoginData = useSelector((state) => state.loginData);

  const loginDatas =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("loginData")) || reduxLoginData
      : reduxLoginData;
  const { setCartProducts, setWishlistProducts } = useContextElement();

  return (
    <div className="d-flex align-items-start justify-content-between">
      <h2 className="page-title">My Account</h2>
      <button className="sign-out menu-link_us-s" title="Log Out" onClick={async () => {
        await setCartProducts([]);
        await setWishlistProducts([]);
        dispatch(loginData({}));
        dispatch(activeDIYtabs("Jewellery"));
        dispatch(isRegisterModal(false));
        dispatch(filteredData([]));
        dispatch(filterData([]));
        dispatch(isLoginModal(false));
        dispatch(isFilter(false));
        dispatch(storeItemObject({}));
        dispatch(storeFilteredDiamondObj({}));
        dispatch(storeActiveFilteredData({}));
        dispatch(storeFilteredData({}));
        dispatch(diamondPageChnages(false));
        dispatch(diamondNumber(""));
        dispatch(storeSelectedDiamondPrice(""));
        dispatch(jeweleryDIYimage(""));
        dispatch(diamondDIYimage(""));
        dispatch(finalCanBeSetData([]));
        dispatch(caratVlaues([]));
        dispatch(storeSpecData({}));
        dispatch(storeProdData({}));
        dispatch(storeSelectedDiamondData([]));
        dispatch(jeweleryDIYName(""));
        dispatch(storeDiamondNumber(""));
        dispatch(addedRingData({}));
        dispatch(IsSelectedDiamond(false));
        dispatch(isRingSelected(false));
        dispatch(addedDiamondData({}));
        dispatch(storeDiamondArrayImage({}));
        dispatch(diamondImage(""));
        dispatch(diamondShape(""));
        dispatch(diamondSelectShape({}));
        dispatch(storeEmbossingData([]));
        dispatch(saveEmbossings(false));
        dispatch(previewImageDatas([]));
        dispatch(activeImageData([]));
        dispatch(DiySteperData([]));
        dispatch(ActiveStepsDiy(0));
        dispatch(engravingObj({}));
        dispatch(serviceAllData([]));
        sessionStorage.removeItem("DIYVertical");
        sessionStorage.removeItem("itemToItemData");
        dispatch(DIYName(""));
        dispatch(dimaondColorType("White"));
        dispatch(cartCount("0"));
        dispatch(favCount("0"));
        sessionStorage.removeItem("loginData");
        router.replace("/", undefined, { shallow: true });
        // router.reload()
        window.scroll(0, 0);
      }}>
        <i className="ic_logout pe-2"></i>
        Logout
      </button>
    </div>
  );
}
