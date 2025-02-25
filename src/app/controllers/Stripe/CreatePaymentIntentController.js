import Stripe from "stripe";
import * as Yup from "yup";
const stripe = require('stripe')(
    'sk_test_51Qs1lD2V9cArXNRkkdVdMJPxvkhf3z6tGun37Opkhc70lkE7obqDUK5yfCq9aU4U7VShCkI2VP4GBfked0kkZE5F00AdCKZNvY'
);

const calculateOrderAmount = (items) => {
    const total = items.reduce((acc, current) => {
        return current.price * current.quantity + acc;
    }, 0);
    return total;
}


class CreatePaymentIntentController  {
    async store(request, response) {
     const schema = Yup.object({
           products: Yup.array()
             .required()
             .of(
               Yup.object({
                 id: Yup.number().required(),
                 quantity: Yup.number().required(),
                 price: Yup.number().required(),
               })
             ),
         });

         try {
            schema.validateSync(request.body, { abortEarly: false });
          } catch (err) {
            return response.status(400).json({ error: err.errors });
          }

          const { products } = request.body;

          const amount = calculateOrderAmount(products)

          const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'eur',
            automatic_payment_methods: {
              enabled: true,
            },
          });
      
          response.json({
            clientSecret: paymentIntent.client_secret,
            dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
          });
    }
  }
  
  export default new CreatePaymentIntentController();
  