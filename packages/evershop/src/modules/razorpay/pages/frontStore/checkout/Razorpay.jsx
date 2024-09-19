import PropTypes from 'prop-types';
import React from 'react';
import { useCheckout } from '@components/common/context/checkout';
import RazorpayLogo from '@components/frontStore/razorpay/RazorpayLogo';
import CheckoutForm from '@components/frontStore/razorpay/checkout/CheckoutForm';

function RazorpayApp({ razorpayKeyId }) {
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div className="App">
      <CheckoutForm razorpayKeyId={razorpayKeyId} />
    </div>
  );
}

RazorpayApp.propTypes = {
  razorpayKeyId: PropTypes.string.isRequired
};

export default function razorpayMethod({ setting }) {
  const checkout = useCheckout();
  const { paymentMethods, setPaymentMethods } = checkout;
  // Get the selected payment method
  const selectedPaymentMethod = paymentMethods
    ? paymentMethods.find((paymentMethod) => paymentMethod.selected)
    : undefined;

  return (
    <div>
      <div className="flex justify-start items-center gap-4">
        {(!selectedPaymentMethod ||
          selectedPaymentMethod.code !== 'Razorpay') && (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPaymentMethods((previous) =>
                previous.map((paymentMethod) => {
                  if (paymentMethod.code === 'Razorpay') {
                    return {
                      ...paymentMethod,
                      selected: true
                    };
                  } else {
                    return {
                      ...paymentMethod,
                      selected: false
                    };
                  }
                })
              );
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-circle"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
          </a>
        )}
        {selectedPaymentMethod && selectedPaymentMethod.code === 'Razorpay' && (
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2c6ecb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-check-circle"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        )}
        <div>
          <RazorpayLogo width={100} />
        </div>
      </div>
      <div>
        {selectedPaymentMethod && selectedPaymentMethod.code === 'Razorpay' && (
          <div>
            <RazorpayApp razorpayKeyId={setting.razorpayKeyId} />
          </div>
        )}
      </div>
    </div>
  );
}

razorpayMethod.propTypes = {
  setting: PropTypes.shape({
    razorpayKeyId: PropTypes.string.isRequired
  }).isRequired
};

export const layout = {
  areaId: 'checkoutPaymentMethodRazorpay',
  sortOrder: 10
};

export const query = `
  query Query {
    setting {
      razorpayDislayName
      razorpayKeyId
    }
  }
`;
