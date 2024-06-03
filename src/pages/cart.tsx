import { useEffect, useState } from 'react';
import { VscError } from 'react-icons/vsc';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CartItemCard from '../components/cart-item';
import { addToCart, calculatePrice, discountApplied, removeCartItem } from '../redux/reducer/cartReducer';
import { CartReducerInitialState } from '../types/reducer-types';
import { CartItem } from '../types/types';
import axios from 'axios';
import { server } from '../redux/store';

const Cart = () => { 
  const {cartItems,subtotal,tax,total,shippingCharges,discount} = useSelector(
    (state:{cartReducer:CartReducerInitialState})=>state.cartReducer)


  const [couponCode, setCouponCode] = useState<string>('');
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  const dispatch = useDispatch()

  const incrementHandler=(cartItem:CartItem)=>{

    if(cartItem.quantity >=cartItem.stock) return;
    dispatch(addToCart({...cartItem,quantity:cartItem.quantity + 1}));
  };

  const decrementHandler=(cartItem:CartItem)=>{
    if(cartItem.quantity <= 1) return;
    dispatch(addToCart({...cartItem,quantity:cartItem.quantity - 1}));
  };

  const removeHandler=(productId:string)=>{
    dispatch(removeCartItem(productId));
  };

  useEffect(() => {

    const {token:cancelToken,cancel}=axios.CancelToken.source()
    const timeoutID = setTimeout(() => {

      axios.get(`${server}/api/v1/payment/discount?coupon=${couponCode}`,{cancelToken})
      .then((res)=>{
        dispatch(discountApplied(res.data.discount));
        setIsValidCouponCode(true);
        dispatch(calculatePrice());
      })
     
      .catch(()=>{   
        dispatch(discountApplied(0));
        setIsValidCouponCode(false);
        setIsValidCouponCode(false);
        
      });


      setIsValidCouponCode(Math.random() > 0.5);
    }, 1000);

    return () => {
      clearTimeout(timeoutID);
      cancel();
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  useEffect(()=>{
    dispatch(calculatePrice())
  },[cartItems])

 

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((item, idx) => <CartItemCard
           incrementHandler={incrementHandler} 
           decrementHandler={decrementHandler}
           removeHandler={removeHandler}
           key={idx} cartItem={item} />)
        ) : (
          <h1>No items added</h1>
        )}
      </main>
      <aside>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>Tax: ₹{tax}</p>
        <p>
          Discount: <em className="red"> - ₹{discount} </em>
        </p>
        <p>
          <b>Total: ₹{total}</b>
        </p>
        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {couponCode && (
          isValidCouponCode ? (
            <span className="green">
              ₹{discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          )
        )}

        {cartItems.length > 0 && (
        <Link to="/shipping">
       <button style={{ 
    backgroundColor: 'white', // Vivid red-orange color
    color: 'green', // Text color to white
    fontSize: '20px', // Font size to 20px
    borderRadius: '10px', // Border radius to 10px
    padding: '12px 24px', // Add padding for better appearance
    border: 'none', // Remove default button border
    cursor: 'pointer', // Change cursor to pointer on hover
    transition: 'background-color 0.3s, transform 0.3s', // Smooth transitions
    outline: 'none', // Remove outline on focus
    textDecoration: 'none', // Remove underline on link
    fontFamily: 'Arial, sans-serif', // Specify font family
    fontWeight: 'bold', // Make text bold
    letterSpacing: '5px', // Add letter spacing
    textTransform: 'uppercase' // Convert text to uppercase
}}>
          CheckOut
        </button>
      </Link>
        )}
      </aside>
    </div>
  );
};

export default Cart;
