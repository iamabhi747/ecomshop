import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useQuery } from 'urql';
import { useCheckout } from '@components/common/context/checkout';
import { Field } from '@components/common/form/Field';
import useRazorpay from "react-razorpay";
import { _ } from '@evershop/evershop/src/lib/locale/translate';
import './CheckoutForm.scss';

const cartQuery = `
  query Query($cartId: String) {
    cart(id: $cartId) {
      billingAddress {
        cartAddressId
        fullName
        postcode
        telephone
        country {
          name
          code
        }
        province {
          name
          code
        }
        city
        address1
        address2
      }
      shippingAddress {
        cartAddressId
        fullName
        postcode
        telephone
        country {
          name
          code
        }
        province {
          name
          code
        }
        city
        address1
        address2
      }
      customerEmail
    }
  }
`;

export default function CheckoutForm({ razorpayKeyId }) {
  // const [, setSucceeded] = useState(false);
  const [cardComleted, setCardCompleted] = useState(false);
  const [error, setError] = useState(null);
  // const [, setDisabled] = useState(true);
  const [razorpayOrder, setRazorpayOrder] = useState({});
  const [Razorpay] = useRazorpay();
  const { cartId, orderId, orderPlaced, paymentMethods /* checkoutSuccessUrl */ } = useCheckout();

  const [result] = useQuery({
    query: cartQuery,
    variables: {
      cartId
    },
    pause: orderPlaced === true
  });

  useEffect(() => {
    // Create PaymentIntent as soon as the order is placed
    if (orderId) {
      window
        .fetch('/api/razorpay/paymentIntent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ order_id: orderId })
        })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(_('Some error occurred. Please try again later.'));
          } else {
            setRazorpayOrder(data.data);
          }
        });
    }
  }, [orderId]);


  useEffect(() => {
    const pay = async () => {
      const billingAddress = result.data.cart.billingAddress || result.data.cart.shippingAddress;

      const options = {
        key: razorpayKeyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Evershop',
        description: 'Payment for order',
        order_id: razorpayOrder.id,
        // eslint-disable-next-line no-unused-vars
        handler: (response) => {
          // console.log(response);
          // TODO: Handle the response
        },
        prefill: {
          name: billingAddress.fullName,
          email: result.data.cart.customerEmail
        },
        theme: {
          color: '#F37254'
        },
        modal: {
          escape: false,
          ondismiss () {
            // console.log('dismissed');
            // TODO: Handle the dismiss event
          }
        }
      };

      const rzp = new Razorpay(options);

      // rzp.on('payment.failed', (response) => {
      //   console.log('payment.failed', response);
      // });

      rzp.open();

    };

    if (orderPlaced === true && razorpayOrder?.id) {
      pay();
    }
  }, [orderPlaced, razorpayOrder, result]);


  const setTrue = () => {
    if (cardComleted) {
      return;
    }
    setCardCompleted(true);
  };

  useEffect(() => {
    setTrue();
  }, []);

  if (result.error) {
    return (
      <div className="flex p-8 justify-center items-center text-critical">
        {error.message}
      </div>
    );
  }

  // Check if the selected payment method is Razorpay
  const razorpayPaymentMethod = paymentMethods.find(
    (method) => method.code === 'Razorpay' && method.selected === true
  );
  if (!razorpayPaymentMethod) return null;

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div>
      {/* Show any error that happens when processing the payment */}
      {error && (
        <div className="card-error text-critical mb-8" role="alert">
          {error}
        </div>
      )}
      <Field
        type="hidden"
        name="razorpayCartComplete"
        value={cardComleted ? 1 : ''}
        validationRules={[
          {
            rule: 'notEmpty',
            message: 'Please complete the card information'
          }
        ]}
      />
    </div>
  );
};

CheckoutForm.propTypes = {
  razorpayKeyId: PropTypes.string.isRequired
};