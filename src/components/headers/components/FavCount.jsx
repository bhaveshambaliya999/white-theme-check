import { useContextElement } from "../../../context/Context";
import { useSelector } from "react-redux";

export default function FavCount() {
  const favCounts = useSelector((state) => state.favCount);
  return <>{favCounts ?? 0}</>;
}
