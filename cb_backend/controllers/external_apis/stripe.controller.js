const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const StripeController = {
    createCheckoutSession: async (req, res) => {
        try {
            const { priceId } = req.body;

            const session = await stripe.checkout.sessions.create({
                mode: 'payment',
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
            });

            res.json({ url: session.url });
        } catch (error) {
            console.error('Stripe session creation error:', error);
            res.status(500).json({ error: 'Failed to create checkout session' });
        }
    },

    // Webhook handler for stripe events
    handleWebhook: async (req, res) => {
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error('Webhook Error:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.async_payment_failed':
              const checkoutSessionAsyncPaymentFailed = event.data.object;
              // Then define and call a function to handle the event checkout.session.async_payment_failed
              break;
            case 'checkout.session.async_payment_succeeded':
              const checkoutSessionAsyncPaymentSucceeded = event.data.object;
              // Then define and call a function to handle the event checkout.session.async_payment_succeeded
              break;
            case 'checkout.session.completed':
              const checkoutSessionCompleted = event.data.object;
              // Then define and call a function to handle the event checkout.session.completed
              break;
            // ... handle other event types
            default:
              console.log(`Unhandled event type ${event.type}`);
          }
        

        res.json({ received: true });
    }
};

module.exports = { StripeController };
