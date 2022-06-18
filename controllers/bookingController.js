const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) get the current booked tour

  const tour = await Tour.findById(req.params.tourId);

  // 2) create checkout session
  const session = await stripe.checkout.session.create({
    // information about the session itself
    payment_method_types: ['card'],
    // this url will get called as soon as a credit card has been successfully charged
    // so as soon the as the purchase is successfull the user will be redirected to this url
    success_url: `${req.protocol}://${req.get('host')}/ `,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug} `,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,

    // product information user about to puchase
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [
          `https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=930&q=80`,
        ],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });
  // 3) Create sesssion as response

  res.status(200).json({
    status: 'success',
    session,
  });
});
