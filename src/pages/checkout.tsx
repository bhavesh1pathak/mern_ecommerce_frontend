import  { FormEvent, useState } from 'react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useNewOrderMutation } from '../redux/api/orderApi';
import { resetCart } from '../redux/reducer/cartReducer';
import { RootState } from '../redux/store';
import { NewOrderRequest } from '../types/api-types';
import { responseToast } from '../utils/features';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CheckOutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state: RootState) => state.userReducer);
    const { shippingInfo, cartItems, subtotal, tax, discount, shippingCharges, total } = useSelector((state: RootState) => state.cartReducer);

    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [newOrder] = useNewOrderMutation();

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        const orderData: NewOrderRequest = {
            shippingInfo,
            orderItems: cartItems,
            subtotal,
            tax,
            shippingCharges,
            discount,
            total,
            user: user?._id!,
        };

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin,
            },
            redirect: "if_required",
        });

        if (error) {
            setIsProcessing(false);
            return toast.error(error.message || "Something went wrong");
        }

        if (paymentIntent && paymentIntent.status === "succeeded") {
            const res = await newOrder(orderData);
            dispatch(resetCart());
            responseToast(res, navigate, "/orders");
        }

        setIsProcessing(false);
    };

    return (
        <div className="checkout-container">
            <form onSubmit={submitHandler} style={{ textAlign: "center" }}>
                <PaymentElement />
                <button
                    type="submit"
                    disabled={isProcessing}
                    style={{
                        backgroundColor: "orange",
                        color: "#ffffff",
                        fontSize: "1.7rem",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginTop: "10px",
                        transition: "background-color 0.3s ease",
                    }}
                >
                    {isProcessing ? "Processing...." : "Pay"}
                </button>
            </form>
        </div>
    );
};

const Checkout = () => {
    const location = useLocation();
    const clientSecret: string | undefined = location.state?.clientSecret;

    if (!clientSecret) return <Navigate to="/shipping" />;

    return (
        <Elements options={{ clientSecret }} stripe={stripePromise}>
            <CheckOutForm />
        </Elements>
    );
};

export default Checkout;
