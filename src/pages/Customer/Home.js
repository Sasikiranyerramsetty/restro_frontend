import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChefHat, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  ArrowRight,
  Users,
  Calendar,
  Gift,
  Quote,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ROUTES } from '../../constants';
import menuService from '../../services/menuService';
import { formatCurrency } from '../../utils';
import CustomerLayout from '../../components/Customer/CustomerLayout';

const CustomerHome = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const result = await menuService.getPopularItems(6);
        if (result.success) {
          setFeaturedItems(result.data);
        }
      } catch (error) {
        console.error('Error fetching featured items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Testimonial navigation functions with animations
  const nextTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 50);
    }, 300);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 50);
    }, 300);
  };

  const goToTestimonial = (index) => {
    if (isAnimating || index === currentTestimonial) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentTestimonial(index);
      setTimeout(() => setIsAnimating(false), 50);
    }, 300);
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const features = [
    {
      icon: <ChefHat className="h-8 w-8 text-primary-500" />,
      title: "Authentic Cuisine",
      description: "Experience the rich flavors of traditional recipes passed down through generations."
    },
    {
      icon: <Users className="h-8 w-8 text-primary-500" />,
      title: "Family Friendly",
      description: "Perfect for family gatherings, celebrations, and special occasions."
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary-500" />,
      title: "Event Catering",
      description: "Professional catering services for weddings, corporate events, and parties."
    },
    {
      icon: <Gift className="h-8 w-8 text-primary-500" />,
      title: "Special Offers",
      description: "Enjoy exclusive deals and seasonal promotions throughout the year."
    }
  ];

  const stats = [
    { label: "Happy Customers", value: "10,000+" },
    { label: "Years of Experience", value: "25+" },
    { label: "Menu Items", value: "150+" },
    { label: "Events Catered", value: "500+" }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Food Blogger",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The biryani here is absolutely incredible! The flavors are so authentic and the portion sizes are generous. I've been coming here for years and it never disappoints.",
      date: "2 days ago"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Regular Customer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Best restaurant in the city! The service is outstanding and the food quality is consistently excellent. The family pack biryani is perfect for our weekend dinners.",
      date: "1 week ago"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Event Planner",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "We hired RESTRO for our corporate event and they exceeded all expectations. The catering was flawless and everyone loved the food. Highly recommended!",
      date: "3 days ago"
    },
    {
      id: 4,
      name: "David Kumar",
      role: "Local Business Owner",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The curry selection is amazing! Each dish has its own unique flavor profile. The staff is friendly and the ambiance is perfect for both casual and special occasions.",
      date: "5 days ago"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Food Critic",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "As a food critic, I've tried many restaurants, but RESTRO stands out for its authentic flavors and consistent quality. The ice creams are a perfect ending to any meal.",
      date: "1 week ago"
    }
  ];

  return (
    <CustomerLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/50 to-primary-700/50 animate-pulse-slow"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 restro-brand animate-fade-in animate-float">
              Welcome to RESTRO
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 animate-slide-up animate-delay-200">
              Experience authentic flavors and warm hospitality in the heart of the city
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animate-delay-400">
              <Link
                to={ROUTES.CUSTOMER_MENU}
                className="bg-orange-500 text-white hover:bg-orange-600 inline-flex items-center justify-center px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                View Menu
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to={ROUTES.CUSTOMER_RESERVATIONS}
                className="bg-green-500 text-white hover:bg-green-600 border-2 border-green-500 hover:border-green-600 inline-flex items-center justify-center hover:scale-105 transition-transform duration-300 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl"
              >
                Make Reservation
                <Calendar className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 restro-brand">
              Why Choose RESTRO?
            </h2>
            <p className="text-xl text-gray-600">
              We're committed to providing an exceptional dining experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 restro-brand">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Main Testimonial Card */}
            <div className={`bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden transition-all duration-300 transform ${
              isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
            } hover:scale-105 hover:shadow-2xl`}>
              {/* Quote Icon */}
              <div className="absolute top-6 left-6 text-primary-200">
                <Quote className="h-12 w-12" />
              </div>

              {/* Testimonial Content */}
              <div className="relative z-10">
                {/* Rating Stars */}
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-6 w-6 text-yellow-400 fill-current transition-all duration-300 transform ${
                        isAnimating ? 'scale-75 opacity-50' : 'scale-100 opacity-100'
                      }`}
                      style={{ transitionDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className={`text-lg md:text-xl text-gray-700 text-center mb-8 leading-relaxed transition-all duration-300 transform ${
                  isAnimating ? 'scale-95 opacity-50 translate-y-2' : 'scale-100 opacity-100 translate-y-0'
                }`}>
                  "{testimonials[currentTestimonial].text}"
                </blockquote>

                {/* Customer Info */}
                <div className={`flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 transition-all duration-300 transform ${
                  isAnimating ? 'scale-95 opacity-50 translate-y-2' : 'scale-100 opacity-100 translate-y-0'
                }`}>
                  <div className="flex-shrink-0">
                    <img
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      className={`h-16 w-16 rounded-full object-cover border-4 border-primary-100 transition-all duration-300 transform ${
                        isAnimating ? 'scale-90' : 'scale-100'
                      } hover:scale-110`}
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className={`text-lg font-semibold text-gray-900 transition-all duration-300 transform ${
                      isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
                    }`}>
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className={`text-primary-600 font-medium transition-all duration-300 transform ${
                      isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
                    }`}>
                      {testimonials[currentTestimonial].role}
                    </p>
                    <p className={`text-sm text-gray-500 transition-all duration-300 transform ${
                      isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
                    }`}>
                      {testimonials[currentTestimonial].date}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevTestimonial}
                disabled={isAnimating}
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 text-primary-600 hover:bg-primary-50 ${
                  isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'
                }`}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={nextTestimonial}
                disabled={isAnimating}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 text-primary-600 hover:bg-primary-50 ${
                  isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'
                }`}
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Testimonial Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  disabled={isAnimating}
                  className={`w-3 h-3 rounded-full transition-all duration-300 transform ${
                    index === currentTestimonial
                      ? 'bg-primary-600 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                  } ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Additional Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div key={testimonial.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover mr-4 transition-all duration-300 transform hover:scale-110"
                  />
                  <div>
                    <h5 className="font-semibold text-gray-900">{testimonial.name}</h5>
                    <p className="text-sm text-primary-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-4 w-4 text-yellow-400 fill-current transition-all duration-300 transform hover:scale-125" 
                      style={{ transitionDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  "{testimonial.text.length > 100 
                    ? testimonial.text.substring(0, 100) + '...' 
                    : testimonial.text}"
                </p>
                <p className="text-xs text-gray-500 mt-3">{testimonial.date}</p>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 mb-6">
              Join thousands of satisfied customers who trust RESTRO for their dining experience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={ROUTES.CUSTOMER_RESERVATIONS}
                className="bg-purple-600 hover:bg-purple-700 text-white inline-flex items-center justify-center px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Book a Table
                <Calendar className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
              </Link>
              <Link
                to={ROUTES.CUSTOMER_MENU}
                className="bg-blue-500 text-white hover:bg-blue-600 inline-flex items-center justify-center px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                View Menu
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Items */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Dishes
            </h2>
            <p className="text-xl text-gray-600">
              Discover our most popular and delicious offerings
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ChefHat className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600">
                        {formatCurrency(item.price)}
                      </span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">
                          {item.rating || '4.5'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to={ROUTES.CUSTOMER_MENU}
              className="bg-red-500 hover:bg-red-600 text-white inline-flex items-center px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View Full Menu
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Visit Us Today
            </h2>
            <p className="text-xl text-primary-100">
              We're open 7 days a week for your convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <MapPin className="h-8 w-8 text-primary-200" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p className="text-primary-100">
                123 Main Street<br />
                City, State 12345
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Phone className="h-8 w-8 text-primary-200" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-primary-100">
                (555) 123-4567<br />
                (555) 123-4568
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Clock className="h-8 w-8 text-primary-200" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hours</h3>
              <p className="text-primary-100">
                Mon-Sun: 11:00 AM - 11:00 PM<br />
                Kitchen closes at 10:30 PM
              </p>
            </div>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
};

export default CustomerHome;
