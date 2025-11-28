import commanService from "@/CommanService/commanService";
import Loader from "@/CommanUIComp/Loader/Loader";
import { isLoginModal, isRegisterModal } from "@/Redux/action";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "react-toastify";

export default function UnSubscribePage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const storeEntityIds = useSelector((state) => state.storeEntityId);

    const [email, setEmail] = useState("");
    const [campaignId, setCampaignId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);

    const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Parse URL query params safely and set state
    useEffect(() => {
        if (!router.asPath) return;

        const queryString = router.asPath.split("?")[1] || "";
        const fixedQueryString = queryString.replace(/;/g, "&");

        const params = new URLSearchParams(fixedQueryString);

        const emailParam = params.get("mail") || "";
        const campaignParam = params.get("campaign_id") || null;

        setEmail(emailParam);
        setCampaignId(campaignParam);
    }, [router.asPath]);

    // Handle unsubscribe
    const handleUnsubscribe = async (e) => {
        e.preventDefault();

        if (!email || !emailRegex.test(email)) {
            toast.error("Please enter a valid email!");
            return;
        }

        if (!campaignId) {
            toast.error("Invalid or missing campaign identifier.");
            return;
        }

        const obj = {
            a: "UnsubscriberEmail",
            SITDeveloper: "1",
            email: email,
            campaign_id: campaignId,
            tenant_id: storeEntityIds?.tenant_id,
            store_type: "B2C",
        };

        setLoading(true);

        try {
            const res = await commanService.postApi("/CampaignDetails", obj);

            setLoading(false);
            if (res.data.success === 1) {
                toast.success(res.data.message);
                setEmail("");
                setShow(true);
            } else {
                toast.error(res.data.message);
                setShow(false)
            }
        } catch (error) {
            setLoading(false);
            setShow(false)
            toast.error("An error occurred. Please try again later.");
            console.error(error);
        }
    };

    return (
        <main className="page-wrapper">
            <div className="mb-4 pb-4"></div>
            <section className="login-register container">
                {loading && <Loader />}
                {show ? <h2 className="section-title text-center fs-3 mb-xl-5">You've been unsubscribed</h2>
                    : (
                        <><h2 className="section-title text-center fs-3 mb-xl-5">Unsubscribe</h2>

                            <div className="reset-form">
                                <form className="needs-validation">
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Email address <span className="asteriskDot">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control form-control_gray"
                                            placeholder="Email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button
                                        className="btn btn-primary w-100 text-uppercase"
                                        type="submit"
                                        onClick={handleUnsubscribe}
                                    >
                                        Submit
                                    </button>

                                    <div className="customer-option mt-4 text-center">
                                        <span className="text-secondary">Back to&nbsp;</span>
                                        <Link
                                            href="/login_register"
                                            className="btn-text js-show-register"
                                            onClick={() => {
                                                dispatch(isLoginModal(true));
                                                dispatch(isRegisterModal(false));
                                            }}
                                        >
                                            Login
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </>)}
            </section>
            <div className="section-gap"></div>
        </main>
    );
}
