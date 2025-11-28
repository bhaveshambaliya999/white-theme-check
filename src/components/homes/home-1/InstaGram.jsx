import commanService from "@/CommanService/commanService";
import { getAllJourneyData } from "@/Redux/action";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function InstaGram() {
  const dispatch = useDispatch()
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const [journeyList, setJourneyList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (Object.keys(storeEntityIds).length > 0) {
      getJourneyDetails();
    } else {
      setLoader(false);
    }
  }, [storeEntityIds]);

  const getJourneyDetails = useCallback(() => {
    if (Object.keys(storeEntityIds).length > 0) {
      setLoader(true);
      const obj = {
        a: "GetJourney",
        store_id: storeEntityIds.mini_program_id,
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        store_type: "B2C",
        unique_id: "",
      };
      commanService.postLaravelApi("/WarrantyCard", obj).then((res) => {
        setJourneyList(res.data.data);
        // dispatch(getAllJourneyData(res.data.data))
        setLoader(false);
      });
    }
  }, [storeEntityIds]);
  return (
    <section className="instagram container">
      {journeyList && journeyList.length > 0 ? (
        <>
          <div
            className="text-center mb-4 pb-xl-2 mb-xl-4"
            data-aos="fade-up"
            data-aos-duration="600"
          >
            <h2 className="section-title text-capitalize text-center">
              Pics or It Didn’t <span className="fw-semi-bold">Happen!</span>
            </h2>
            <h5 className="text-secondary">
              View our customers’ engagement moments from around the world
            </h5>
          </div>
          <div className="row row-cols-3 row-cols-md-4 mb-4 pb-4 pb-xl-5 mb-xl-5">
            {journeyList
              ? journeyList.map((elm, i) => (
                
                <Link href={`/account_dashboard/viewjourney?unique_id=${elm.unique_id}&type=${elm.type ?? 'S'}`} key={i} className="instagram__title">
                  {/* {console.log(elm)} */}
                  <div
                    // href="https://instagram.com"
                    // target="_blank"
                    className="position-relative overflow-hidden d-block effect overlay-plus w-100 h-100"
                    >
                    <img
                      loading="lazy"
                      className="instagram__img"
                      src={elm.image}
                      width="230"
                      height="230"
                      alt="Insta image 1"
                    />
                  </div>
                </Link>
              ))
              : ""}
          </div>
        </>
      ) : (
        ""
      )}
    </section>
  );
}
