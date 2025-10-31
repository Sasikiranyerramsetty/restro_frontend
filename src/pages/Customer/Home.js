import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChefHat, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Menu as MenuIcon,
  X,
  Send,
  Truck,
  Calendar,
  Utensils
} from 'lucide-react';
import { ROUTES } from '../../constants';
import toast from 'react-hot-toast';

const CustomerHome = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Smooth scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  // Menu data
  const menuItems = [
    {
      id: 1,
      name: "Hyderabadi Biryani",
      description: "Aromatic basmati rice layered with tender chicken, cooked in authentic Hyderabadi style",
      price: "₹299",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=400&fit=crop"
    },
    {
      id: 2,
      name: "Mutton Biryani",
      description: "Succulent mutton pieces with fragrant spices and premium basmati rice",
      price: "₹399",
      image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&h=400&fit=crop"
    },
    {
      id: 3,
      name: "Paneer Tikka",
      description: "Marinated cottage cheese grilled to perfection with Indian spices",
      price: "₹249",
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=400&fit=crop"
    },
    {
      id: 4,
      name: "Chicken 65",
      description: "Crispy fried chicken tossed in special South Indian spices",
      price: "₹279",
      image: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=500&h=400&fit=crop"
    },
    {
      id: 5,
      name: "Appetizer Platter",
      description: "Assorted starters: paneer tikka, chicken 65, veg pakora with chutneys",
      price: "₹329",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=400&fit=crop"
    },
    {
      id: 6,
      name: "Tandoori Chicken",
      description: "Chicken marinated in yogurt and spices, roasted in tandoor",
      price: "₹349",
      image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&h=400&fit=crop"
    }
  ];

  // Gallery images
  const galleryImages = [
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1562059390-a761a084768e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream font-body">
      {/* Sticky Navigation Bar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-brand-navy/95 backdrop-blur-md shadow-lg py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to={ROUTES.CUSTOMER_HOME} className="flex items-center space-x-3 absolute left-4 top-3">
              <img 
                src={require('../../assets/images/restrologo.png')} 
                alt="Restro Logo" 
                className={`object-contain transition-all duration-300 ${
                  isScrolled ? 'w-16 h-16' : 'w-24 h-24'
                }`}
                style={{ transform: 'rotate(-30deg)' }}
              />
              <span className="text-2xl font-bold text-white transition-all duration-300" style={{ fontFamily: 'Rockybilly, sans-serif', transform: 'rotate(0deg)' }}>
                Restro
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('home')}
                className="font-medium text-white transition-colors duration-300 hover:text-brand-teal"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('menu')}
                className="font-medium text-white transition-colors duration-300 hover:text-brand-teal"
              >
                Menu
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="font-medium text-white transition-colors duration-300 hover:text-brand-teal"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('gallery')}
                className="font-medium text-white transition-colors duration-300 hover:text-brand-teal"
              >
                Gallery
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="font-medium text-white transition-colors duration-300 hover:text-brand-teal"
              >
                Contact
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4 ml-auto">
              <Link
                to={ROUTES.LOGIN}
                className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-brand-navy transition-all duration-300 transform hover:scale-105"
              >
                Login
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="bg-brand-red text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-brand-red transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Signup
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white transition-colors duration-300 hover:text-brand-teal"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4"
            >
              <button 
                onClick={() => scrollToSection('home')}
                className="block w-full text-left py-2 px-4 text-brand-navy hover:bg-brand-teal rounded-lg transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('menu')}
                className="block w-full text-left py-2 px-4 text-brand-navy hover:bg-brand-teal rounded-lg transition-colors"
              >
                Menu
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="block w-full text-left py-2 px-4 text-brand-navy hover:bg-brand-teal rounded-lg transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('gallery')}
                className="block w-full text-left py-2 px-4 text-brand-navy hover:bg-brand-teal rounded-lg transition-colors"
              >
                Gallery
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left py-2 px-4 text-brand-navy hover:bg-brand-teal rounded-lg transition-colors"
              >
                Contact
              </button>
              <div className="mt-3 space-y-2">
                <Link
                  to={ROUTES.LOGIN}
                  className="block w-full text-center bg-transparent border-2 border-brand-navy text-brand-navy py-2 px-4 rounded-full font-semibold hover:bg-brand-navy hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="block w-full text-center bg-brand-red text-white py-2 px-4 rounded-full font-semibold hover:bg-brand-navy transition-colors"
                >
                  Signup
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1920&h=1080&fit=crop"
            alt="Biryani"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/70 to-brand-navy/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Large Restro Title Overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="absolute top-0 left-0 z-0"
              style={{ willChange: 'transform, opacity' }}
            >
              <h2 
                className="text-8xl md:text-9xl lg:text-[12rem] font-bold text-white opacity-40"
                style={{ 
                  fontFamily: 'Rockybilly, sans-serif', 
                  textShadow: '0 0 80px rgba(255,255,255,0.5)',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              >
                Restro
              </h2>
            </motion.div>

            {/* Main Hero Text */}
            <div className="relative z-10">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 leading-tight">
                Freshly Cooked.<br />
                <span className="text-brand-teal">Authentically Indian.</span>
              </h1>
              <p className="text-xl md:text-2xl text-brand-cream mb-8 max-w-2xl mx-auto">
                Experience the rich flavors of traditional Indian cuisine, prepared with love and authentic spices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection('menu')}
                  className="bg-brand-red text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-opacity-90 transition-all shadow-xl"
                >
                  Explore Menu
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection('contact')}
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-xl"
                >
                  Reserve Table
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        
      </section>

      {/* Services Section */}
      <section className="py-20 bg-brand-red text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Our Services
            </h2>
            <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">
              Experience convenience and quality with our comprehensive range of services
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { 
                icon: <Truck className="w-12 h-12" />, 
                title: "Food Delivery", 
                description: "Fast and reliable delivery right to your doorstep. Fresh, hot meals delivered with care.",
                link: ROUTES.CUSTOMER_MENU
              },
              { 
                icon: <Calendar className="w-12 h-12" />, 
                title: "Event Booking", 
                description: "Make your events memorable with our expert catering and event management services.",
                link: ROUTES.CUSTOMER_EVENTS
              },
              { 
                icon: <Utensils className="w-12 h-12" />, 
                title: "Table Booking", 
                description: "Reserve your table in advance and enjoy a seamless dining experience at our restaurant.",
                link: ROUTES.CUSTOMER_RESERVATIONS
              },
              { 
                icon: <ChefHat className="w-12 h-12" />, 
                title: "Catering", 
                description: "Professional catering services for all occasions. From intimate gatherings to grand celebrations.",
                link: ROUTES.CUSTOMER_EVENTS
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -15, scale: 1.05 }}
                className="group relative bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-lg rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-white/30 hover:border-brand-teal/50 overflow-hidden"
              >
                {/* Decorative gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/10 via-transparent to-brand-red/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                
                {/* Content wrapper */}
                <div className="relative z-10">
                  {/* Icon with gradient background */}
                  <div className="relative mx-auto mb-6 w-24 h-24">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-red to-brand-red/80 rounded-2xl transform rotate-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg"></div>
                    <div className="relative bg-gradient-to-br from-brand-red to-brand-red/90 rounded-2xl w-full h-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
                      {service.icon}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-display font-bold text-brand-navy mb-4 group-hover:text-brand-red transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-brand-blue/90 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-brand-teal/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-brand-red/20 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Menu Section */}
      <section id="menu" className="py-20 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-navy mb-4">
              Our Delicious Menu
            </h2>
            <p className="text-xl text-brand-blue max-w-2xl mx-auto">
              Explore our carefully crafted selection of authentic Indian dishes
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {menuItems.map((item) => (
              <motion.div
                key={item.id}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-brand-red text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                    {item.price}
          </div>
                </div>
                <div className="h-[100%] p-6 bg-brand-navy">
                  <h3 className="text-2xl font-display font-bold text-white mb-3">
                    {item.name}
                </h3>
                  <p className="text-white opacity-80 mb-4">
                    {item.description}
                  </p>
                  <Link
                    to={ROUTES.LOGIN}
                    className="inline-block bg-brand-red text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-brand-navy transition-colors"
                  >
                    Order Now
                  </Link>
              </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link
              to={ROUTES.CUSTOMER_MENU}
              className="inline-block bg-brand-blue text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-brand-navy transition-all transform hover:scale-105 shadow-lg"
            >
              View Full Menu
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-brand-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop"
                  alt="Restaurant Interior"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-brand-red text-white p-8 rounded-2xl shadow-2xl hidden md:block">
                <div className="text-4xl font-display font-bold text-white">25+</div>
                <div className="text-white opacity-90">Years of Excellence</div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                About RESTRO
              </h2>
              <p className="text-lg text-white opacity-90 mb-6 leading-relaxed">
                For over 25 years, RESTRO has been serving authentic Indian cuisine with passion and dedication. 
                Our journey began with a simple vision: to bring the traditional flavors of India to food lovers everywhere.
              </p>
              <p className="text-lg text-white opacity-90 mb-6 leading-relaxed">
                Every dish is prepared using time-honored recipes, premium ingredients, and aromatic spices sourced 
                directly from India. Our expert chefs bring years of experience to craft each meal with love and care.
              </p>
              <p className="text-lg text-white opacity-90 mb-8 leading-relaxed">
                From our signature biryanis to our mouthwatering appetizers, every bite tells a story of tradition, 
                quality, and authenticity. We're not just serving food; we're creating memorable experiences.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('menu')}
                className="bg-brand-red text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-brand-navy transition-all shadow-lg"
              >
                Discover Our Story
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-navy mb-4">
              Food Gallery
            </h2>
            <p className="text-xl text-brand-blue max-w-2xl mx-auto">
              A visual feast of our delicious creations
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="relative aspect-square rounded-xl overflow-hidden shadow-lg cursor-pointer"
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Get In Touch
            </h2>
            <p className="text-xl max-w-2xl mx-auto">
              Have questions? We'd love to hear from you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-brand-navy font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-brand-teal focus:border-brand-blue focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-brand-navy font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-brand-teal focus:border-brand-blue focus:outline-none transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-brand-navy font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-brand-teal focus:border-brand-blue focus:outline-none transition-colors"
                    placeholder="+91 1234567890"
                  />
                </div>
                <div>
                  <label className="block text-brand-navy font-semibold mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg border-2 border-brand-teal focus:border-brand-blue focus:outline-none transition-colors resize-none"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-brand-red text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-navy transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  Send Message
                  <Send className="w-5 h-5" />
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Info & Map */}
            <motion.div
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-brand-cream rounded-2xl p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-red p-3 rounded-full flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-brand-navy text-xl mb-2">Address</h3>
                    <p className="text-brand-blue">123 Main Street, City Center<br />Mumbai, Maharashtra 400001</p>
                  </div>
          </div>

                <div className="flex items-start gap-4">
                  <div className="bg-brand-red p-3 rounded-full flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-brand-navy text-xl mb-2">Phone</h3>
                    <p className="text-brand-blue">+91 (555) 123-4567<br />+91 (555) 123-4568</p>
                  </div>
            </div>

                <div className="flex items-start gap-4">
                  <div className="bg-brand-red p-3 rounded-full flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-brand-navy text-xl mb-2">Email</h3>
                    <p className="text-brand-blue">info@restro.com<br />support@restro.com</p>
                      </div>
                    </div>

                <div className="flex items-start gap-4">
                  <div className="bg-brand-red p-3 rounded-full flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-brand-navy text-xl mb-2">Hours</h3>
                    <p className="text-brand-blue">Mon - Sun: 11:00 AM - 11:00 PM<br />Kitchen closes at 10:30 PM</p>
                  </div>
                </div>
            </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden shadow-lg h-64">
                <iframe
                  title="Restaurant Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.898890!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzMzLjYiTiA3MsKwNTInMzkuNyJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={require('../../assets/images/restrologo.png')} 
                  alt="Restro Logo" 
                  className="w-16 h-16 object-contain"
                />
                <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Rockybilly, sans-serif' }}>Restro</span>
              </div>
              <p className="text-white opacity-80">
                Serving authentic Indian cuisine with passion and dedication for over 25 years.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-display font-bold text-xl mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection('menu')} className="text-white opacity-80 hover:opacity-100 transition-opacity">
                    Menu
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('about')} className="text-white opacity-80 hover:opacity-100 transition-opacity">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('gallery')} className="text-white opacity-80 hover:opacity-100 transition-opacity">
                    Gallery
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('contact')} className="text-white opacity-80 hover:opacity-100 transition-opacity">
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-display font-bold text-xl mb-4 text-white">Follow Us</h3>
              <div className="flex gap-4">
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-blue p-3 rounded-full hover:bg-brand-red transition-colors"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-blue p-3 rounded-full hover:bg-brand-red transition-colors"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-blue p-3 rounded-full hover:bg-brand-red transition-colors"
                >
                  <Twitter className="w-5 h-5 text-white" />
                </motion.a>
              </div>
            </div>
          </div>

          <div className="border-t border-brand-blue pt-8 text-center">
            <p className="text-white opacity-80">
              © 2024 RESTRO. All rights reserved. | Made with <span className="text-brand-red">❤</span> for food lovers
            </p>
            <p className="text-white opacity-70 mt-2 text-sm">
              Developed by Gollapudi_Gangsters
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerHome;
