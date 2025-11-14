import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft,
  ChefHat,
  CreditCard
} from 'lucide-react';
import { ROUTES } from '../../constants';
import { formatCurrency } from '../../utils';
import toast from 'react-hot-toast';
import userOrdersService from '../../services/userOrdersService';
import { useAuth } from '../../context/AuthContext';
import CustomerLayout from '../../components/Customer/CustomerLayout';

// Helper to get or generate user ID
const getUserId = (user) => {
  if (user?.id) return user.id;
  if (user?.user_id) return user.user_id;
  
  // Generate session ID for guests
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

const CustomerCart = () => {
  const { user } = useAuth();
  const userId = useMemo(() => getUserId(user), [user]);
  
  // Custom color palette (matching admin)
  const colors = {
    red: '#E63946',
    cream: '#F1FAEE',
    lightBlue: '#A8DADC',
    mediumBlue: '#457B9D',
    darkNavy: '#1D3557'
  };
  
  const [cart, setCart] = useState({ items: [], subtotal: 0, tax: 0, total: 0, item_count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const result = await userOrdersService.getCart(userId);
        if (result.success && result.data) {
          setCart(result.data);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, [userId]);

  const updateQuantity = async (item, newQuantity) => {
    if (newQuantity <= 0) {
      await removeItem(item);
      return;
    }

    setIsLoading(true);
    try {
      const result = await userOrdersService.updateQuantity(userId, item.item_id || item.id, newQuantity);
      if (result.success) {
        // Refresh cart
        const cartResult = await userOrdersService.getCart(userId);
        if (cartResult.success) {
          setCart(cartResult.data);
        }
      } else {
        toast.error(result.error || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (item) => {
    setIsLoading(true);
    try {
      const result = await userOrdersService.removeFromCart(userId, item.item_id || item.id);
      if (result.success) {
        toast.success('Item removed from cart');
        // Refresh cart
        const cartResult = await userOrdersService.getCart(userId);
        if (cartResult.success) {
          setCart(cartResult.data);
        }
      } else {
        toast.error(result.error || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (cart.item_count === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsLoading(true);
    try {
      // For now, navigate to checkout page
      // Later, you can implement checkout directly here
      navigate(ROUTES.CUSTOMER_CHECKOUT || ROUTES.CUSTOMER_MENU);
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Failed to proceed to checkout');
    } finally {
      setIsLoading(false);
    }
  };

  const cartItems = cart.items || [];

  if (cartItems.length === 0) {
    return (
      <CustomerLayout>
        <div className="space-y-8 animate-fade-in" style={{ backgroundColor: colors.cream, minHeight: '100vh', padding: '2rem' }}>
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 animate-slide-up">
              <div className="flex items-center space-x-4 mb-4">
                <Link
                  to={ROUTES.CUSTOMER_MENU}
                  className="p-2 rounded-full transition-colors duration-200"
                  style={{ backgroundColor: colors.lightBlue }}
                >
                  <ArrowLeft className="h-6 w-6" style={{ color: colors.darkNavy }} />
                </Link>
                <div>
                  <h1 
                    className="text-3xl font-bold drop-shadow-lg mb-2" 
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
                    Shopping Cart
                  </h1>
                  <div style={{ height: '4px', background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.mediumBlue} 100%)`, borderRadius: '2px', width: '200px' }}></div>
                </div>
              </div>
            </div>

            {/* Empty Cart */}
            <div className="text-center py-16">
              <div 
                className="mx-auto h-24 w-24 rounded-full flex items-center justify-center mb-6 shadow-xl"
                style={{ backgroundColor: colors.lightBlue }}
              >
                <ShoppingCart className="h-12 w-12" style={{ color: colors.mediumBlue }} />
              </div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.darkNavy }}>Your cart is empty</h2>
              <p className="mb-8" style={{ color: colors.mediumBlue }}>
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link
                to={ROUTES.CUSTOMER_MENU}
                className="px-8 py-3 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg flex items-center inline-flex"
                style={{ backgroundColor: colors.red }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f3e'}
                onMouseLeave={(e) => e.target.style.backgroundColor = colors.red}
              >
                <ChefHat className="h-5 w-5 mr-2" />
                Browse Menu
              </Link>
            </div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-8 animate-fade-in" style={{ backgroundColor: colors.cream, minHeight: '100vh', padding: '2rem' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-slide-up">
            <div className="flex items-center space-x-4 mb-4">
              <Link
                to={ROUTES.CUSTOMER_MENU}
                className="p-2 rounded-full transition-colors duration-200"
                style={{ backgroundColor: colors.lightBlue }}
              >
                <ArrowLeft className="h-6 w-6" style={{ color: colors.darkNavy }} />
              </Link>
              <div>
                <h1 
                  className="text-4xl font-bold drop-shadow-lg mb-2" 
                  style={{ 
                    fontFamily: 'Rockybilly, sans-serif', 
                    letterSpacing: '0.05em',
                    color: colors.darkNavy 
                  }}
                >
                  Shopping Cart
                </h1>
                <div style={{ height: '4px', background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.mediumBlue} 100%)`, borderRadius: '2px', width: '200px' }}></div>
                <p className="mt-2" style={{ color: colors.mediumBlue }}>
                  {cart.item_count} {cart.item_count === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div 
                className="rounded-2xl shadow-xl border-2"
                style={{ 
                  background: `linear-gradient(135deg, #FFFFFF 0%, ${colors.cream} 100%)`,
                  borderColor: colors.lightBlue
                }}
              >
                <div className="p-6 border-b-2" style={{ borderColor: colors.lightBlue }}>
                  <h2 className="text-xl font-semibold" style={{ color: colors.darkNavy }}>Cart Items</h2>
                </div>
                
                <div className="divide-y-2" style={{ borderColor: colors.lightBlue }}>
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-center space-x-4">
                        {/* Item Image */}
                        <div 
                          className="h-20 w-20 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: colors.lightBlue }}
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover rounded-lg"
                            />
                          ) : (
                            <ChefHat className="h-8 w-8" style={{ color: colors.mediumBlue }} />
                          )}
                        </div>
                        
                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold" style={{ color: colors.darkNavy }}>
                            {item.name}
                          </h3>
                          <p className="text-sm line-clamp-2" style={{ color: colors.mediumBlue }}>
                            {item.description}
                          </p>
                          <div className="mt-2">
                            <span className="text-lg font-bold" style={{ color: colors.red }}>
                              {formatCurrency(item.price)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item, item.quantity - 1)}
                            className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                            style={{ backgroundColor: colors.red, color: '#FFFFFF' }}
                            disabled={isLoading}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          
                          <span className="text-lg font-medium w-8 text-center" style={{ color: colors.darkNavy }}>
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item, item.quantity + 1)}
                            className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                            style={{ backgroundColor: colors.red, color: '#FFFFFF' }}
                            disabled={isLoading}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* Item Total */}
                        <div className="text-right">
                          <div className="text-lg font-bold" style={{ color: colors.darkNavy }}>
                            {formatCurrency(item.item_total || (item.price * item.quantity))}
                          </div>
                          <button
                            onClick={() => removeItem(item)}
                            className="mt-2 transition-colors duration-200 hover:scale-110"
                            style={{ color: colors.red }}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div 
                className="rounded-2xl shadow-xl border-2 p-6 sticky top-8"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
                  borderColor: colors.mediumBlue
                }}
              >
                <h2 className="text-xl font-semibold mb-6" style={{ color: colors.darkNavy }}>Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span style={{ color: colors.mediumBlue }}>Subtotal</span>
                    <span className="font-medium" style={{ color: colors.darkNavy }}>{formatCurrency(cart.subtotal || 0)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span style={{ color: colors.mediumBlue }}>Tax (18% GST)</span>
                    <span className="font-medium" style={{ color: colors.darkNavy }}>{formatCurrency(cart.tax || 0)}</span>
                  </div>
                  
                  <div className="border-t-2 pt-4" style={{ borderColor: colors.lightBlue }}>
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold" style={{ color: colors.darkNavy }}>Total</span>
                      <span className="text-lg font-bold" style={{ color: colors.red }}>
                        {formatCurrency(cart.total || 0)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={isLoading || cart.item_count === 0}
                  className="w-full mt-6 flex items-center justify-center rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  style={{ 
                    backgroundColor: cart.item_count === 0 ? '#9ca3af' : colors.red,
                    padding: '12px 24px'
                  }}
                  onMouseEnter={(e) => {
                    if (cart.item_count > 0) e.target.style.backgroundColor = '#d32f3e';
                  }}
                  onMouseLeave={(e) => {
                    if (cart.item_count > 0) e.target.style.backgroundColor = colors.red;
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Proceed to Checkout
                    </>
                  )}
                </button>
                
                <Link
                  to={ROUTES.CUSTOMER_MENU}
                  className="w-full mt-3 text-center block px-4 py-2 rounded-xl font-semibold transition-all duration-200"
                  style={{ 
                    backgroundColor: colors.cream,
                    color: colors.darkNavy,
                    border: `2px solid ${colors.lightBlue}`
                  }}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerCart;
