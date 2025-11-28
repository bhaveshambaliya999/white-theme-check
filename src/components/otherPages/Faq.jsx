import { firstWordCapital, isEmpty } from "@/CommanFunctions/commanFunctions";
import commanService from "@/CommanService/commanService";
import Loader from "@/CommanUIComp/Loader/Loader";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Accordion from 'react-bootstrap/Accordion';

export default function Faq() {
  const isCallRef = useRef(false)
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const [loader, setLoader] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  const [savedFaqDataList, setSavedFaqDataList] = useState([]);
  const [selectedFaqData, setSelectedFaqData] = useState([]);
  const [category, setCategory] = useState("");
  const megamenu = JSON.parse(sessionStorage.getItem("megaMenus"));
  var contactData = isEmpty(
    isEmpty(megamenu) == "" ? [] : megamenu["contact_data"]
  );
 
  useEffect(() => {
    if (Object.keys(storeEntityIds).length > 0 && !isCallRef.current) {
      setLoader(true);
      faqData();
      isCallRef.current = true
      window.scrollTo(0, 0);
    }
  }, [storeEntityIds]);

  const faqData = () => {
    const obj = {
      a: "GetFaq",
      unique_id: "",
      per_page: "0",
      number: "0",
      status: "1",
      sorting_column: "",
      sorting_order: "",
      store_id: storeEntityIds.mini_program_id,
      group_by: "true",
      faq_category: "",
    };
    setLoader(true);
    commanService
      .postLaravelApi("/Faq", obj)
      .then((res) => {
        if (res.data.success === 1) {
          if (res.data.data.length > 0) {
            setSavedFaqDataList(res.data.data);
            for (let c = 0; c < res.data.data.length; c++) {
              setCategory(res.data.data[0].faq_category.replace(/\s/g, ""));
            }
            var data = [];
            data.push(res.data.data.map((item) => item.category_id));
            selectFaqData(data[0]);
          } else {
            setLoader(false);
          }
        } else {
          toast.error(res.data.message);
          setLoader(false);
        }
      })
      .catch(() => {
        setLoader(false);
      });
  };

  const selectFaqData = (categories) => {
    const allFaqs = [];
    const fetchPromises = categories.map((category) => {
      const obj = {
        a: "GetFaq",
        unique_id: "",
        per_page: "0",
        number: "0",
        status: "1",
        sorting_column: "",
        sorting_order: "",
        store_id: storeEntityIds.mini_program_id,
        group_by: "",
        faq_category: category,
      };
      return commanService
        .postLaravelApi("/Faq", obj)
        .then((res) => {
          if (res.data.success === 1) {
            if (res.data.data.length > 0) {
              res.data.data.forEach((faq) => {
                allFaqs.push({ ...faq, category: category });
              });
            }
          } else {
            toast.error(res.data.message);
          }
        })
        .catch(() => {
          toast.error("Error fetching FAQ data.");
        });
    });

    Promise.all(fetchPromises).then(() => {
      setSelectedFaqData(allFaqs);
      setLoader(false);
    });
  };

  return (
    <main className="page-wrapper">
      <div className="mb-4 pb-4"></div>
      <section className="container lh-30">
        {loader && <Loader />}
        <h2 className="page-title">
          FREQUENTLY ASKED QUESTIONS
        </h2>
        <div className="row justify-content-center">
          <div className="col-12 col-sm-6 col-md-4 col-lg-6 col-xl-4 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title d-flex justify-content-center align-items-center">
                  <svg width="16" height="16">
                    <use xlinkHref="#icon_user" />
                  </svg> <span className="ps-2">Chat Now</span>
                </h5>
                <p className="card-text">
                  Get instant answers to your questions.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-6 col-xl-4 mb-3">
            {contactData?.length &&
              contactData?.map((item, i) => (
                isEmpty(item.email) !== '' &&
                <div className="card" key={i}>
                  <div className="card-body text-center">
                    <a href={`mailto:${isEmpty(item.email)}`}>
                      <h5 className="card-title d-flex justify-content-center align-items-center">
                        <svg width="16" height="16">
                          <use xlinkHref="#icon_envelope" />
                        </svg> 
                        <span className="ps-2">Email Us</span>
                      </h5>
                      <p className="card-text">{item.email}</p>
                    </a>
                  </div>
                </div>
              ))}
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-6 col-xl-4 mb-3">
            {contactData?.length &&
              contactData?.map((item, i) => (
                isEmpty(item.mobile) !== '' && <div className="card" key={i}>
                  <div className="card-body text-center">
                    <a href={`tel:${isEmpty(item.mobile)}`}>
                      <h5 className="card-title d-flex justify-content-center align-items-center">
                         <svg width="16" height="16">
                          <use xlinkHref="#icon_telephone" />
                        </svg> 
                        <span className="ps-2">Call Us</span>
                      </h5>
                      <p className="card-text">
                        {item.country_code} {item.mobile}
                      </p>
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="mt-5">
          {savedFaqDataList?.length > 0 && selectedFaqData?.length > 0 && (
            <div id="faq_accordion">
              {savedFaqDataList?.map((a, i) => (
                <div key={i}>
                  <h3 className="mb-4">{firstWordCapital(a.faq_category)}</h3>
                  {selectedFaqData?.length > 0
                    ? selectedFaqData?.map((f, index) => {
                      var getLinkId = f.description.replace(
                        "https://youtu.be/",
                        ""
                      );
                      if (a.category_id === f.category_id) {
                        return (
                          <Accordion alwaysOpen={false} defaultActiveKey="0" className="faq-accordion accordion"
                            key={index}
                          >
                            <Accordion.Item eventKey={String(index)} className="accordion-item">
                              <Accordion.Header
                                className="accordion-header"
                              >
                                {f.question}
                                <svg
                                  className="accordion-button__icon"
                                  viewBox="0 0 14 14"
                                >
                                  <g
                                    aria-hidden="true"
                                    stroke="none"
                                    fillRule="evenodd"
                                  >
                                    <path
                                      className="svg-path-vertical"
                                      d="M14,6 L14,8 L0,8 L0,6 L14,6"
                                    ></path>
                                    <path
                                      className="svg-path-horizontal"
                                      d="M14,6 L14,8 L0,8 L0,6 L14,6"
                                    ></path>
                                  </g>
                                </svg>
                              </Accordion.Header>
                              <Accordion.Body
                                id={`faq-accordion-collapse-${f.unique_id}`}
                                className="accordion-body"
                              >
                                <div >
                                  {f.answer_type === "video" ? (
                                    <iframe
                                      title="myFrame"
                                      allowFullScreen={true}
                                      className="w-100"
                                      height="345"
                                      src={
                                        f.description.includes(
                                          "https://youtu.be/"
                                        )
                                          ? `https://www.youtube.com/embed/${getLinkId.trim()}`
                                          : f.description
                                      }
                                    ></iframe>
                                  ) : f.answer_type === "image" ? (
                                    <div className="imagesfaq">
                                      <img
                                        alt=""
                                        className="img-fluid"
                                        src={f.answer_description}
                                      />
                                    </div>
                                  ) : f.answer_type === "link" ? (
                                    <a
                                      href={f.description}
                                      rel="noopener noreferrer"
                                      target="_blank"
                                      className="small-title fw-400 text-decoration-underline bodycontent-text-color"
                                    >
                                      {f.description}
                                    </a>
                                  ) : (
                                    <p
                                      dangerouslySetInnerHTML={{
                                        __html: f.description,
                                      }}
                                    ></p>
                                  )}
                                </div>
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                        );
                      }
                    })
                    : ""}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
       <div className="section-gap"></div>
    </main>
  );
}
