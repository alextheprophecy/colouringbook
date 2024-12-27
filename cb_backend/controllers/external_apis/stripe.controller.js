const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../../models/user.model');

// Credit amounts for each package
const CREDIT_PACKAGES = {
    'prod_RTMtbqAVxjzUcX': 200,      // Basic package
    'prod_RTMvkAr8HqOm1C': 550,      // Standard package (500 + 50 bonus)
    'prod_RTMwpkB6T2Ispf': 1650      // Pro package (1500 + 150 bonus)
};

const StripeController = {
    createCheckoutSession: async (req, res) => {
        try {
            const { productId } = req.body;
            const userId = req.user.id;  // From auth middleware

            // Validate productId
            if (!CREDIT_PACKAGES[productId]) {
                return res.status(400).json({ error: 'Invalid product ID' });
            }

            // Get the price ID for this product
            const prices = await stripe.prices.list({
                product: productId,
                active: true,
                limit: 1
            });

            if (!prices.data.length) {
                return res.status(400).json({ error: 'No active price found for this product' });
            }

            const priceId = prices.data[0].id;

            const session = await stripe.checkout.sessions.create({
                mode: 'payment',
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                metadata: {
                    userId: userId,
                    creditAmount: CREDIT_PACKAGES[productId]
                },
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
            console.error('Webhook signature verification failed:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        try {
            switch (event.type) {
                case 'checkout.session.completed':
                    const session = event.data.object;
                    
                    // Add credits to user account
                    const userId = session.metadata.userId;
                    const creditAmount = parseInt(session.metadata.creditAmount);
                    
                    if (!userId || !creditAmount) {
                        console.error('Invalid metadata in session:', { userId, creditAmount, sessionId: session.id });
                        throw new Error('Missing user ID or credit amount in session metadata');
                    }

                    const user = await User.findById(userId);
                    if (!user) {
                        console.error('User not found in webhook:', userId);
                        throw new Error(`User not found: ${userId}`);
                    }

                    // Log the transaction
                    console.log(`Processing credit purchase - SessionID: ${session.id}, UserID: ${userId}, Amount: ${creditAmount}`);

                    // Add credits to user's account
                    user.credits = (user.credits || 0) + creditAmount;
                    await user.save();

                    console.log(`Successfully added ${creditAmount} credits to user ${userId} - New Balance: ${user.credits}`);
                    break;

                case 'checkout.session.async_payment_failed':
                    const failedSession = event.data.object;
                    console.error(`Payment failed for session ${failedSession.id}`, {
                        customerId: failedSession.customer,
                        paymentIntent: failedSession.payment_intent
                    });
                    break;

                case 'payment_intent.payment_failed':
                    const paymentIntent = event.data.object;
                    console.error('Payment failed:', {
                        intentId: paymentIntent.id,
                        error: paymentIntent.last_payment_error,
                        customerId: paymentIntent.customer
                    });
                    break;

                default:
                    console.log(`Unhandled event type ${event.type}`);
            }

            res.json({ received: true });
        } catch (error) {
            console.error('Error processing webhook:', {
                error: error.message,
                eventType: event.type,
                eventId: event.id
            });
            // Still return 200 to Stripe but log the error
            res.json({ received: true, error: error.message });
        }
    }
};

module.exports = { StripeController };
