import { useSearchParams } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkoutForm";
import "./stylePayment.css";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_KEY);

export default function Payments() {
    const [searchParams] = useSearchParams();
    const clientSecret = searchParams.get('cs');
    const amount = searchParams.get('amount');

    document.title = 'Payment';

    const appearance = {
        theme: 'stripe',
    };
    // Enable the skeleton loader UI for optimal loading.
    const loader = 'auto';

    return (
        <div className="payment-form">
            <div className="text-2xl font-bold text-center mb-2">PAYMENT</div>
            {/* <div>amount : {amount}</div> */}

            {clientSecret && (
                <Elements options={{ clientSecret, appearance, loader }} stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            )}

        </div>
    )
};