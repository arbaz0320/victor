const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
 const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: 'usd',
      automatic_payment_methods: {enabled: true},
    });

  return paymentIntent;
}