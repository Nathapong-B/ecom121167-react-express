const { stripe } = require("../config/config");

exports.stripePayment = async (amount) => {
    // Create a PaymentIntent with the order amount and currency
    return await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "thb",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
            enabled: true,
        },
    });
};

// ร้องขอข้อมูลการชำระเงิน
exports.stripeRetrieve = async (paymentId) => {
    return await stripe.paymentIntents.retrieve(
        paymentId, { expand: ['latest_charge'] },
    );
};