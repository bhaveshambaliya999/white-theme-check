import { useState } from "react";
import Loader from "../../../CommanUIComp/Loader/Loader";
import Image from "next/image";

export default function Features({ footerService }) {
  const [loader, setLoader] = useState(false);
  const isLoading = footerService?.length > 0 ? false : true;
  return isLoading ? (
    <Loader />
  ) : (
    <section className="service-promotion horizontal pb-0">
      <div className="row justify-content-center">
        {footerService && footerService?.map((elm, i) => (
          <div
            key={i}
            className={`col-md-${footerService?.length === 4 ? 3 : 4} mb-md-5 mb-4 d-flex align-items-center justify-content-md-center gap-3`}
          >
            <div className="service-promotion__icon">
              <Image
                src={elm?.image}
                className="img-fluid w-100 h-100"
                alt="image"
                width={52}
                height={52}
              />
            </div>
            <div className="service-promotion__content-wrap">
              <h3 className="service-promotion__title h6 text-uppercase mb-1">
                {elm.title}
              </h3>
              <p
                className="service-promotion__content text-light1 mb-0"
                dangerouslySetInnerHTML={{ __html: elm.description }}
              ></p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
