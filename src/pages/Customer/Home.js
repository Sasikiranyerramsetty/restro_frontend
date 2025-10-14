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
  Gift
} from 'lucide-react';
import { ROUTES } from '../../constants';
import menuService from '../../services/menuService';
import { formatCurrency } from '../../utils';
import CustomerLayout from '../../components/Customer/CustomerLayout';

const CustomerHome = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

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
                className="btn-primary bg-white text-primary-600 hover:bg-gray-100 inline-flex items-center justify-center hover:scale-105 transition-transform duration-300"
              >
                View Menu
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to={ROUTES.CUSTOMER_RESERVATIONS}
                className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 inline-flex items-center justify-center hover:scale-105 transition-transform duration-300"
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
              className="btn-primary inline-flex items-center"
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
