import Skeleton from "react-loading-skeleton";

const SkeletonModal = (props) => {
  return (
    <>
      {props.page !== "cart" &&
        props.storeSkeletonArr.map((_, i) => (
          <div key={i} className="product-card-wrapper">
            <div className="product-card mb-3 mb-md-4">
              <div className="pc__img-wrapper Skeleton">
                <Skeleton />
              </div>
              <div className="pc__info position-relative">
                <p className="pc__category">
                  <Skeleton />
                </p>
                <h2 className="pc__title mb-1">
                  <Skeleton />
                </h2>
                <div className="product-card__price d-flex">
                  <span className="money price">
                    <Skeleton />
                  </span>
                </div>
                <button
                  className={`pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist`}
                  title="Add To Wishlist" aria-label="Add To Wishlist"
                >
                  <Skeleton />
                </button>
              </div>
            </div>
          </div>
        ))}
      {props.page === "cart" &&
        props.storeSkeletonArr.map((_, i) => (
          <div className="mb-3 p-3" key={i}>
            <div className="">
              <div className="row">
                <div className="col-12 col-sm-3 col-md-2 mb-3">
                  <div className="position-relative h-100">
                    <Skeleton height={"100%"} />
                  </div>
                </div>
                <div className="col-12 col-sm-9 col-md-10">
                  <div className="h-100">
                    <div className="d-flex h-100">
                      <div className="h-100 w-100">
                        <p className="mb-2 w-100">
                          <Skeleton height={"100%"} />
                        </p>
                        <div className="d-flex">
                          <p className="mb-2 w-100">
                            <Skeleton height={"100%"} />
                          </p>
                        </div>
                        <div className="d-flex justify-content-between">
                          <p className="mb-2 w-100">
                            <Skeleton height={"100%"} />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};
export default SkeletonModal;
