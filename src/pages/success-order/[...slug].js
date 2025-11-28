// pages/index.js
import { Auth } from "@/components/authentication/auth";
import OrderCompleted from "@/components/shopCartandCheckout/OrderCompleted";

export async function getServerSideProps(context) {
    const { params, req } = context;
    const orderId = params.slug[0]
    return {
        props: {
            orderId
        },
    };
}

function OrderetailPage({ orderId }) {
    return (
        <>
            <main className="page-wrapper">
                <div className="mb-4 pb-0 pb-md-4"></div>
                <section className="shop-checkout container">
                    <h2 className="page-title">
                        {orderId === "CancelTransaction" ||
                            orderId === "CancelOrder"
                            ? "ORDER FAILED"
                            : "ORDER RECEIVED"}
                    </h2>
                    <OrderCompleted orderId={orderId} />
                </section>
            </main>
            <div className="section-gap"></div>
        </>
    );
}
export default Auth(OrderetailPage)