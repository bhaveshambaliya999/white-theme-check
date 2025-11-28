import Link from "next/link";
import Image from "next/image";

export default function Instagram({ useJourneyList }) {
  const [journeyList] = useJourneyList([]);

  if (!journeyList?.length) return null;

  return (
    <section className="container instagram px-1 position-relative full-width_padding-20">
      <h2 className="section-title text-uppercase fs-36 text-center mb-3 pb-2 pb-xl-3">
        Pics or It Didn&apos;t <span className="fw-semi-bold">Happen!</span>
      </h2>
      <div className="row row-cols-2 row-cols-md-4 row-cols-xl-4 mx-0">
        {journeyList.map((elm, i) => (
          <Link
            key={i}
            href={`/account_dashboard/viewjourney?unique_id=${
              elm.unique_id
            }&type=${elm.type ?? "S"}`}
            className="instagram__title"
            aria-label="View journey"
          >
            <div className="position-relative overflow-hidden d-block effect overlay-plus w-100 h-100">
              <picture>
                <Image
                  loading="lazy"
                  className="instagram__img"
                  src={elm.image || "/assets/images/placeholder.png"} // fallback image
                  width={232}
                  height={232}
                  alt={elm.altText || `Instagram post ${i + 1}`} // fallback alt text
                  quality={80}
                />
              </picture>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
