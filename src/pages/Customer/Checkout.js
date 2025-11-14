import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail,
  Building,
  Wallet,
  Smartphone,
  Lock,
  CheckCircle,
  Truck,
  Check,
  Edit2,
  ChevronRight,
  Shield
} from 'lucide-react';
import { ROUTES } from '../../constants';
import { formatCurrency } from '../../utils';
import toast from 'react-hot-toast';
import userOrdersService from '../../services/userOrdersService';
import { useAuth } from '../../context/AuthContext';
import CustomerLayout from '../../components/Customer/CustomerLayout';
import { motion, AnimatePresence } from 'framer-motion';

const getUserId = (user) => {
  if (user?.id) return user.id;
  if (user?.user_id) return user.user_id;
  
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

function CustomerCheckout() {
  const { user } = useAuth();
  const userId = useMemo(() => getUserId(user), [user]);
  const navigate = useNavigate();

  const colors = {
    red: '#E63946',
    cream: '#F1FAEE',
    lightBlue: '#A8DADC',
    mediumBlue: '#457B9D',
    darkNavy: '#1D3557'
  };

  const [cart, setCart] = useState({ items: [], subtotal: 0, tax: 0, total: 0, item_count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [activeStep, setActiveStep] = useState(1);

  const [formData, setFormData] = useState({
    orderType: 'delivery',
    paymentMethod: '',
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      landmark: ''
    },
    contactPhone: user?.phone || '',
    contactEmail: user?.email || '',
    specialInstructions: ''
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: ''
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const result = await userOrdersService.getCart(userId);
        if (result.success && result.data) {
          setCart(result.data);
          if (result.data.item_count === 0) {
            toast.error('Your cart is empty');
            setTimeout(() => {
              navigate(ROUTES.CUSTOMER_CART);
            }, 1000);
          }
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to load cart');
      }
    };

    if (userId) {
      fetchCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        contactPhone: user.phone || prev.contactPhone,
        contactEmail: user.email || prev.contactEmail
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('deliveryAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        deliveryAddress: {
          ...prev.deliveryAddress,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateForm = () => {
    if (!formData.paymentMethod) {
      toast.error('Please select a payment method');
      return false;
    }

    if (formData.orderType === 'delivery') {
      if (!formData.deliveryAddress.street || !formData.deliveryAddress.city || !formData.deliveryAddress.zipCode) {
        toast.error('Please fill in all required address fields');
        return false;
      }
    }

    if (!formData.contactPhone) {
      toast.error('Please enter your contact phone number');
      return false;
    }

    if (formData.paymentMethod === 'card') {
      if (!paymentDetails.cardNumber || !paymentDetails.cardName || !paymentDetails.expiryDate || !paymentDetails.cvv) {
        toast.error('Please fill in all card details');
        return false;
      }
      if (paymentDetails.cardNumber.replace(/\s/g, '').length < 16) {
        toast.error('Please enter a valid card number');
        return false;
      }
    }

    if (formData.paymentMethod === 'upi') {
      if (!paymentDetails.upiId || !paymentDetails.upiId.includes('@')) {
        toast.error('Please enter a valid UPI ID');
        return false;
      }
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    try {
      let deliveryAddressString = null;
      if (formData.orderType === 'delivery') {
        const addr = formData.deliveryAddress;
        deliveryAddressString = `${addr.street}, ${addr.city}, ${addr.state || ''} ${addr.zipCode || ''}${addr.landmark ? ` (Near ${addr.landmark})` : ''}`.trim();
      }

      const checkoutData = {
        order_type: formData.orderType,
        payment_method: formData.paymentMethod,
        delivery_address: deliveryAddressString,
        special_instructions: formData.specialInstructions || null
      };

      const result = await userOrdersService.checkout(userId, checkoutData);
      
      if (result.success) {
        setOrderId(result.data.order_id || `ORD-${Date.now()}`);
        setOrderPlaced(true);
        toast.success('Order placed successfully!');
        
        setTimeout(() => {
          navigate(ROUTES.CUSTOMER_ORDERS);
        }, 3000);
      } else {
        toast.error(result.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: colors.cream }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto p-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto mb-6 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl"
              style={{ backgroundColor: '#22c55e' }}
            >
              <CheckCircle className="h-12 w-12 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.darkNavy }}>
              Order Placed Successfully!
            </h2>
            <p className="text-lg mb-2" style={{ color: colors.mediumBlue }}>
              Order ID: <span className="font-bold">{orderId}</span>
            </p>
            <p className="mb-6" style={{ color: colors.mediumBlue }}>
              You will be redirected to your orders page shortly...
            </p>
            <Link
              to={ROUTES.CUSTOMER_ORDERS}
              className="inline-block px-6 py-3 rounded-full font-semibold text-white transition-all shadow-lg hover:shadow-xl"
              style={{ backgroundColor: colors.red }}
            >
              View My Orders
            </Link>
          </motion.div>
        </div>
      </CustomerLayout>
    );
  }

  const cartItems = cart.items || [];
  const deliveryCharge = formData.orderType === 'delivery' ? 50 : 0;
  const finalTotal = cart.total + deliveryCharge;

  return (
    <CustomerLayout>
      <div style={{ backgroundColor: colors.cream, minHeight: '100vh', padding: '2rem 1.5rem' }}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              to={ROUTES.CUSTOMER_CART}
              className="inline-flex items-center gap-2 mb-4 text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: colors.mediumBlue }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </Link>
            <div>
              <h1 
                className="text-3xl font-bold mb-2" 
                style={{ 
                  fontFamily: "'BBH Sans Bartle', sans-serif", 
                  letterSpacing: '0.05em',
                  color: colors.darkNavy,
                  fontFeatureSettings: '"liga" off',
                  fontVariantLigatures: 'none',
                  textRendering: 'geometricPrecision',
                  fontKerning: 'none'
                }}
              >
                Checkout
              </h1>
              <div style={{ height: '4px', background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.mediumBlue} 100%)`, borderRadius: '2px', width: '150px' }}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Type */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl shadow-sm border p-6"
                style={{ borderColor: colors.lightBlue, backgroundColor: colors.darkNavy }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: colors.red + '15' }}>
                    <Truck className="w-5 h-5" style={{ color: colors.red }} />
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: 'white', fontWeight: '700' }}>Delivery Option</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'delivery', label: 'Home Delivery', icon: <Truck className="w-5 h-5" />, desc: 'Delivered to your door' },
                    { value: 'takeaway', label: 'Takeaway', icon: <Building className="w-5 h-5" />, desc: 'Pick up from restaurant' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setFormData(prev => ({ ...prev, orderType: type.value }))}
                      className={`relative p-5 rounded-xl border-2 transition-all text-left ${
                        formData.orderType === type.value 
                          ? 'border-red-500 shadow-md' 
                          : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
                      }`}
                      style={{
                        backgroundColor: formData.orderType === type.value ? '#FFE5E5' : '#2D3748'
                      }}
                    >
                      {formData.orderType === type.value && (
                        <div className="absolute top-3 right-3">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.red }}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ 
                            backgroundColor: formData.orderType === type.value ? colors.red : colors.lightBlue,
                            color: 'white'
                          }}
                        >
                          {type.icon}
                        </div>
                        <span className="font-bold" style={{ color: formData.orderType === type.value ? '#000000' : 'white', fontWeight: '700' }}>
                          {type.label}
                        </span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: formData.orderType === type.value ? '#666666' : 'rgba(255, 255, 255, 0.8)' }}>{type.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Delivery Address */}
              {formData.orderType === 'delivery' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-sm border p-6"
                  style={{ borderColor: colors.lightBlue }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: colors.red + '15' }}>
                        <MapPin className="w-5 h-5" style={{ color: colors.red }} />
                      </div>
                      <h2 className="text-xl font-bold" style={{ color: 'white', fontWeight: '700' }}>Delivery Address</h2>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'white', fontWeight: '600' }}>
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="deliveryAddress.street"
                        value={formData.deliveryAddress.street}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-red-200"
                        style={{ 
                          borderColor: colors.lightBlue,
                          backgroundColor: '#FAFAFA'
                        }}
                        placeholder="House/Flat No., Building Name"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: 'white', fontWeight: '600' }}>
                          City *
                        </label>
                        <input
                          type="text"
                          name="deliveryAddress.city"
                          value={formData.deliveryAddress.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-red-200"
                          style={{ 
                            borderColor: colors.lightBlue,
                            backgroundColor: '#FAFAFA'
                          }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: 'white', fontWeight: '600' }}>
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="deliveryAddress.zipCode"
                          value={formData.deliveryAddress.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-red-200"
                          style={{ 
                            borderColor: colors.lightBlue,
                            backgroundColor: '#FAFAFA'
                          }}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: 'white', fontWeight: '600' }}>
                          State
                        </label>
                        <input
                          type="text"
                          name="deliveryAddress.state"
                          value={formData.deliveryAddress.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-red-200"
                          style={{ 
                            borderColor: colors.lightBlue,
                            backgroundColor: '#FAFAFA'
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: 'white', fontWeight: '600' }}>
                          Landmark
                        </label>
                        <input
                          type="text"
                          name="deliveryAddress.landmark"
                          value={formData.deliveryAddress.landmark}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-red-200"
                          style={{ 
                            borderColor: colors.lightBlue,
                            backgroundColor: '#FAFAFA'
                          }}
                          placeholder="Near..."
                        />
            </div>
          </div>
        </div>
                </motion.div>
              )}

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl shadow-sm border p-6"
                style={{ borderColor: colors.lightBlue, backgroundColor: colors.darkNavy }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: colors.red + '15' }}>
                    <Phone className="w-5 h-5" style={{ color: colors.red }} />
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: 'white', fontWeight: '700' }}>Contact Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'white', fontWeight: '600' }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-red-200"
                      style={{ 
                        borderColor: colors.lightBlue,
                        backgroundColor: '#FAFAFA'
                      }}
                      placeholder="+91 1234567890"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'white', fontWeight: '600' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-red-200"
                      style={{ 
                        borderColor: colors.lightBlue,
                        backgroundColor: '#FAFAFA'
                      }}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl shadow-sm border p-6"
                style={{ borderColor: colors.lightBlue, backgroundColor: colors.darkNavy }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: colors.red + '15' }}>
                    <CreditCard className="w-5 h-5" style={{ color: colors.red }} />
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: 'white', fontWeight: '700' }}>Payment Method</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'cash', label: 'Cash', icon: <Wallet className="w-5 h-5" />, color: '#22c55e' },
                    { value: 'upi', label: 'UPI', icon: <Smartphone className="w-5 h-5" />, color: '#3b82f6' },
                    { value: 'card', label: 'Card', icon: <CreditCard className="w-5 h-5" />, color: '#8b5cf6' },
                    { value: 'wallet', label: 'Wallet', icon: <Wallet className="w-5 h-5" />, color: '#f59e0b' }
                  ].map((method) => (
                    <button
                      key={method.value}
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.value }))}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        formData.paymentMethod === method.value 
                          ? 'border-red-500 shadow-md' 
                          : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
                      }`}
                      style={{
                        backgroundColor: formData.paymentMethod === method.value ? '#FFE5E5' : '#2D3748'
                      }}
                    >
                      {formData.paymentMethod === method.value && (
                        <div className="absolute top-2 right-2">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.red }}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col items-center gap-2">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ 
                            backgroundColor: formData.paymentMethod === method.value ? colors.red : method.color + '20',
                            color: formData.paymentMethod === method.value ? 'white' : method.color
                          }}
                        >
                          {method.icon}
                        </div>
                        <span className="font-semibold text-xs" style={{ color: formData.paymentMethod === method.value ? '#000000' : 'white', fontWeight: '600' }}>
                          {method.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Card Details */}
                {formData.paymentMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 pt-6 border-t-2 space-y-4"
                    style={{ borderColor: colors.lightBlue }}
                  >
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'white', fontWeight: '600' }}>
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentDetails.cardNumber}
                        onChange={(e) => {
                          e.target.value = formatCardNumber(e.target.value);
                          handlePaymentInputChange(e);
                        }}
                        maxLength={19}
                        className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-red-200"
                        style={{ 
                          borderColor: colors.lightBlue,
                          backgroundColor: '#FAFAFA'
                        }}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: 'white', fontWeight: '600' }}>
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentDetails.cardName}
                        onChange={handlePaymentInputChange}
                        className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-red-200"
                        style={{ 
                          borderColor: colors.lightBlue,
                          backgroundColor: '#FAFAFA'
                        }}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: 'white', fontWeight: '600' }}>
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={paymentDetails.expiryDate}
                          onChange={(e) => {
                            e.target.value = formatExpiryDate(e.target.value);
                            handlePaymentInputChange(e);
                          }}
                          maxLength={5}
                          className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-red-200"
                          style={{ 
                            borderColor: colors.lightBlue,
                            backgroundColor: '#FAFAFA'
                          }}
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: 'white', fontWeight: '600' }}>
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={paymentDetails.cvv}
                          onChange={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
                            handlePaymentInputChange(e);
                          }}
                          maxLength={3}
                          className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-red-200"
                          style={{ 
                            borderColor: colors.lightBlue,
                            backgroundColor: '#FAFAFA'
                          }}
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* UPI Details */}
                {formData.paymentMethod === 'upi' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 pt-6 border-t-2"
                    style={{ borderColor: colors.lightBlue }}
                  >
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'white', fontWeight: '600' }}>
                      UPI ID *
                    </label>
                    <input
                      type="text"
                      name="upiId"
                      value={paymentDetails.upiId}
                      onChange={handlePaymentInputChange}
                      className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-red-200"
                      style={{ 
                        borderColor: colors.lightBlue,
                        backgroundColor: '#FAFAFA'
                      }}
                      placeholder="yourname@upi"
                      required
                    />
                  </motion.div>
                )}
              </motion.div>

              {/* Special Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl shadow-sm border p-6"
                style={{ borderColor: colors.lightBlue, backgroundColor: colors.darkNavy }}
              >
                <h2 className="text-xl font-bold mb-4" style={{ color: 'white', fontWeight: '700' }}>
                  Special Instructions
                </h2>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border-2 transition-all resize-none focus:outline-none focus:ring-2 focus:ring-red-200"
                  style={{ 
                    borderColor: colors.lightBlue,
                    backgroundColor: '#FAFAFA'
                  }}
                  placeholder="Any special requests or instructions for your order..."
                ></textarea>
              </motion.div>
      </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div 
                className="bg-white rounded-2xl shadow-sm border p-6 sticky top-6"
                style={{ borderColor: colors.lightBlue }}
              >
                <h3 className="text-xl font-bold mb-6" style={{ color: 'white', fontWeight: '700' }}>
                  Order Summary
                </h3>

                {/* Cart Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item.item_id} className="flex items-start justify-between gap-3 pb-3 border-b" style={{ borderColor: colors.lightBlue }}>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm" style={{ color: 'white', fontWeight: '600' }}>
                          {item.name}
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="font-bold text-sm whitespace-nowrap" style={{ color: colors.red }}>
                        {formatCurrency(item.item_total)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b-2" style={{ borderColor: colors.lightBlue }}>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Subtotal</span>
                    <span className="font-semibold" style={{ color: 'white', fontWeight: '600' }}>
                      {formatCurrency(cart.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Tax (18%)</span>
                    <span className="font-semibold" style={{ color: 'white', fontWeight: '600' }}>
                      {formatCurrency(cart.tax)}
                    </span>
                  </div>
                  {formData.orderType === 'delivery' && (
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Delivery</span>
                      <span className="font-semibold" style={{ color: 'white', fontWeight: '600' }}>
                        {formatCurrency(deliveryCharge)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg" style={{ color: 'white', fontWeight: '700' }}>Total</span>
                    <span className="font-bold text-2xl" style={{ color: colors.red }}>
                      {formatCurrency(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <motion.button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || cart.item_count === 0}
                  whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                  whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                  className="w-full px-6 py-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                  style={{ backgroundColor: colors.red }}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Place Order
                    </>
                  )}
                </motion.button>

                <div className="flex items-center justify-center gap-2 text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  <Shield className="w-4 h-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                  <span>Secure & Encrypted</span>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
    </CustomerLayout>
  );
}

export default CustomerCheckout;
