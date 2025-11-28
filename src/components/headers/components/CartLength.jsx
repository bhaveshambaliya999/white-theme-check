import { useSelector } from "react-redux";

export default function CartLength() {
  const cartCounts = useSelector((state) => state.cartCount);
  return <>{cartCounts ?? 0}</>;
}
