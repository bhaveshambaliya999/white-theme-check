import dynamic from "next/dynamic";
import createPersistedState from "use-persisted-state";
import { useEffect, useState } from "react";

// Dynamic imports
const Hero = dynamic(() => import("./Hero"));
const Products1 = dynamic(() => import("../home-1/Products1"));
const Products2 = dynamic(() => import("../home-1/Products2"));
const Products4 = dynamic(() => import("../home-1/Products4"));
const Blogs = dynamic(() => import("./Blogs"));
const Instagram = dynamic(() => import("./Instagram"));
const Lookbook = dynamic(() => import("./Lookbook"));
const OfferSection = dynamic(() => import("./OfferSection"));

export default function HomePageDefault(props) {
  const useSliderState = createPersistedState("sliderData");
  const useSectionDataList = createPersistedState("sectionDataLists");
  const useJourneyList = createPersistedState("journeyList");

  const [step, setStep] = useState(0);

  // Sequential reveal effect
  useEffect(() => {
    if (step < 7) {
      const timer = setTimeout(() => setStep((s) => s + 1), 500); 
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <>
      {step >= 0 && (
        <Hero
          storeData={props.entityData}
          useSliderState={useSliderState}
          useJourneyList={useJourneyList}
        />
      )}

      {step >= 1 && (
        <>
          <div className="section-gap-20"></div>
          <Products1 storeData={props.entityData} useSliderState={useSliderState} />
        </>
      )}

      {step >= 2 && (
        <>
          <Products2
            storeData={props.entityData}
            useSliderState={useSliderState}
            useSectionDataList={useSectionDataList}
          />
          <div className="section-gap"></div>
        </>
      )}

      {step >= 3 && <Lookbook storeData={props.entityData} useSliderState={useSliderState} />}

      {step >= 4 && (
        <>
          <Products4 storeData={props.entityData} useSliderState={useSliderState} />
          <div className="section-gap"></div>
          <OfferSection storeData={props.entityData} useSliderState={useSliderState} />
          
        </>
      )}

      {step >= 5 && (
        <>
          <Blogs storeData={props.entityData} useSliderState={useSliderState} />
          <div className="section-gap"></div>
        </>
      )}

      {step >= 6 && (
        <>
          <Instagram
            storeData={props.entityData}
            useSliderState={useSliderState}
            useJourneyList={useJourneyList}
          />
          <div className="section-gap"></div>
        </>
      )}
    </>
  );
}
