import commanService from "@/CommanService/commanService";
import Loader from "@/CommanUIComp/Loader/Loader";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";

export default function About() {
  const [loading, setLoading] = useState(false);
  const storeEntityIds = useSelector((state) => state.storeEntityId);

  const [aboutDataList, setAboutDataList] = useState([]);

  useEffect(() => {
    if(Object.keys(storeEntityIds).length > 0){
      window.scrollTo(0, 0);
      aboutData();
    }
  }, [storeEntityIds]);

  // Get About Data
  const aboutData = () => {
    const Get_about_data = {
      a: "GetDataAboutUs",
      status: "1",
      per_page: "0",
      number: "0",
      store_id: storeEntityIds.mini_program_id,
      type: "B2C",
    };
    setLoading(true);
    commanService
      .postLaravelApi("/AboutUs", Get_about_data)
      .then((res) => {
        if (res.data.success == 1) {
          if (res.data.data.length > 0) {
            setAboutDataList(res.data.data);
            setLoading(false);
          } else {
            setLoading(false);
          }
        }
      })
      .catch(() => {
        setLoading(true);
      });
  };

  return (
    <main className="page-wrapper">
      <div className="mb-4 pb-4"></div>
      <section className="about-us container">
        {loading && <Loader />}
        <div className="mw-930">
          <h2 className="page-title">About Us</h2>
        </div>
        <div className="about-us__content">

          <div className="">
            {aboutDataList.map((aboutItem, i) => {
              return aboutItem.alignment == "Left" ? (
                <div className="col-12 section_margin" key={aboutItem.position}>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <div className="mb-3 mb-lg-0">
                        <Image
                          src={aboutItem.image}
                          className="img-fluid w-100 h-500px"
                          alt="image"
                          width={690}
                          height={500}
                          // quality={100}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-lg-6 d-flex align-items-center">
                      <div className="d-flex flex-column justify-content-center aboutus-desc">
                        <h2 className="fs-24px mb-20px">{aboutItem.title}</h2>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: aboutItem.description,
                          }}
                        ></p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="col-12 section_margin" key={aboutItem.position}>
                  <div className="row">
                    <div className="col-12 col-lg-6 d-flex align-items-center order-2 order-lg-1">
                      <div className="d-flex flex-column align-items-lg-end justify-content-center aboutus-desc">
                        <h2 className="fs-24px mb-20px">{aboutItem.title}</h2>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: aboutItem.description,
                          }}
                        ></p>
                      </div>
                    </div>
                    <div className="col-12 col-lg-6 order-1 order-lg-2 ">
                      <div className="mb-3 mb-lg-0">
                        <Image
                          src={aboutItem.image}
                          className="img-fluid w-100 h-500px"
                          alt="image"
                          width={690}
                          height={500}
                          // quality={100}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
