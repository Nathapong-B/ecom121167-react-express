import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCartStore } from "../../ecomStore/useCartStore";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../../ecomStore/authStore";

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const token = useAuthStore(s => s.token);
    const { actionConfirmPayment } = useCartStore(useShallow(s => ({ actionConfirmPayment: s.actionConfirmPayment })));
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const nav = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const resultPayment = await stripe.confirmPayment({
            elements,
            //   confirmParams: {
            // Make sure to change this to your payment completion page
            // return_url: "http://localhost:3000/complete",
            // },
            redirect: "if_required" // เพิ่มบรรทัดนี้เพื่อไม่ให้ redirect
        });

        if (resultPayment.error) {
            // console.log('error : ',resultPayment);
            setMessage(resultPayment.error.message);
            toast.error(resultPayment.error.message);
        } else if (resultPayment.paymentIntent.status === 'succeeded') {
            // ส่งสถานะสำเร็จไปเซิร์ฟเวอร์ confirm-payment
            const res = await actionConfirmPayment(resultPayment, token);

            nav('/payment-complete'); // redirect to complete page
        } else {
            // console.log('Require Action : ', resultPayment);
            toast.error(resultPayment.paymentIntent.status.toUpperCase());
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "accordion"
    };

    return (
        <div>
            <form id="payment-form" onSubmit={handleSubmit} className="form bg-white/70">

                <PaymentElement id="payment-element" options={paymentElementOptions} />
                <button disabled={isLoading || !stripe || !elements} id="submit" className="w-full bo-btn-add bg-sky-500 py-2 btn-disabled">
                    <span id="button-text">
                        {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
                    </span>
                </button>
                {/* Show any error or success messages */}
                {message && <div id="payment-message" className="text-red-500">{message}</div>}

            </form>
        </div>
    )
};