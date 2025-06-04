'use client'
import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, Search, Star, Zap, Shield, Truck, Phone, Laptop, Headphones, Camera, Watch, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ElectronicsStoreHomepage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const heroSlides = [
    {
      title: "Smartphones Última Geração",
      subtitle: "Tecnologia que cabe na sua mão",
      discount: "Até 30% OFF",
      image: "📱",
      bg: "from-blue-600 to-orange-500"
    },
    {
      title: "Notebooks Gamer",
      subtitle: "Performance extrema para jogos",
      discount: "12x sem juros",
      image: "💻",
      bg: "from-orange-500 to-blue-600"
    },
    {
      title: "Fones Premium",
      subtitle: "Som de alta qualidade",
      discount: "Frete Grátis",
      image: "🎧",
      bg: "from-blue-500 to-orange-400"
    }
  ];

  const categories = [
    { name: "Smartphones", icon: Phone, count: "150+ produtos", route: "/smartphones" },
    { name: "Notebooks", icon: Laptop, count: "80+ produtos", route: "/notebooks" },
    { name: "Fones de Ouvido", icon: Headphones, count: "200+ produtos", route: "/fones" },
    { name: "Câmeras", icon: Camera, count: "60+ produtos", route: "/cameras" },
    { name: "Smartwatches", icon: Watch, count: "45+ produtos", route: "/smartwatches" }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      price: "R$ 8.999,00",
      originalPrice: "R$ 9.999,00",
      image: "📱",
      rating: 4.9,
      badge: "Mais Vendido",
      route: "/produto/iphone-15-pro-max"
    },
    {
      id: 2,
      name: "MacBook Pro M3",
      price: "R$ 12.999,00",
      originalPrice: "R$ 14.999,00",
      image: "💻",
      rating: 4.8,
      badge: "Lançamento",
      route: "/produto/macbook-pro-m3"
    },
    {
      id: 3,
      name: "AirPods Pro 2",
      price: "R$ 1.899,00",
      originalPrice: "R$ 2.199,00",
      image: "🎧",
      rating: 4.7,
      badge: "Oferta",
      route: "/produto/airpods-pro-2"
    },
    {
      id: 4,
      name: "Sony A7 IV",
      price: "R$ 15.999,00",
      originalPrice: "R$ 17.999,00",
      image: "📷",
      rating: 4.9,
      badge: "Premium",
      route: "/produto/sony-a7-iv"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleCategoryClick = (route) => {
    router.push(route);
  };

  const handleProductClick = (route) => {
    router.push(route);
  };

  const handleNavigation = (route) => {
    router.push(route);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNavigation('/')}>
                <Zap className="h-8 w-8 text-blue-600 mr-2" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  TechWay
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-6">
                <button onClick={() => handleNavigation('/')} className="text-gray-700 hover:text-blue-600 transition-colors">Início</button>
                <button onClick={() => handleNavigation('/produtos')} className="text-gray-700 hover:text-blue-600 transition-colors">Produtos</button>
                <button onClick={() => handleNavigation('/ofertas')} className="text-gray-700 hover:text-blue-600 transition-colors">Ofertas</button>
                <button onClick={() => handleNavigation('/contato')} className="text-gray-700 hover:text-blue-600 transition-colors">Contato</button>
              </nav>
              
              <div className="flex items-center space-x-4">
                {/* Profile Icon */}
                <button 
                  onClick={() => handleNavigation('/perfil')} 
                  className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="h-6 w-6" />
                </button>
                
                {/* Shopping Cart */}
                <button 
                  onClick={() => handleNavigation('/carrinho')} 
                  className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Carousel */}
      <section className="relative h-96 overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className={`h-full bg-gradient-to-r ${slide.bg} flex items-center`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="text-white">
                    <div className="text-sm font-semibold mb-2 text-yellow-300">{slide.discount}</div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h1>
                    <p className="text-xl mb-6 opacity-90">{slide.subtitle}</p>
                    <button 
                      onClick={() => handleNavigation('/ofertas')}
                      className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105"
                    >
                      Ver Ofertas
                    </button>
                  </div>
                  <div className="text-center">
                    <div className="text-9xl animate-pulse">{slide.image}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Truck className="h-5 w-5 text-orange-400" />
              <span className="text-sm">Frete Grátis acima de R$ 199</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-sm">Garantia Estendida</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Zap className="h-5 w-5 text-orange-400" />
              <span className="text-sm">Entrega Expressa</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Nossas Categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(category.route)}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
              >
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-orange-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Produtos em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product.route)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden group"
              >
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-6xl group-hover:scale-110 transition-transform">{product.image}</div>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {product.badge}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigation('/carrinho');
                    }}
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-orange-500 text-white py-2 rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all transform hover:scale-105"
                  >
                    Comprar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Fique por dentro das novidades</h2>
          <p className="text-xl text-blue-100 mb-8">Receba ofertas exclusivas e lançamentos em primeira mão</p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-100 transition-colors">
              Inscrever
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Zap className="h-8 w-8 text-blue-500 mr-2" />
                <span className="text-2xl font-bold">TechWay</span>
              </div>
              <p className="text-gray-400">Sua loja de eletrônicos de confiança com os melhores produtos e preços do mercado.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => handleNavigation('/')} className="hover:text-white transition-colors">Início</button></li>
                <li><button onClick={() => handleNavigation('/produtos')} className="hover:text-white transition-colors">Produtos</button></li>
                <li><button onClick={() => handleNavigation('/ofertas')} className="hover:text-white transition-colors">Ofertas</button></li>
                <li><button onClick={() => handleNavigation('/contato')} className="hover:text-white transition-colors">Contato</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Categorias</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => handleNavigation('/smartphones')} className="hover:text-white transition-colors">Smartphones</button></li>
                <li><button onClick={() => handleNavigation('/notebooks')} className="hover:text-white transition-colors">Notebooks</button></li>
                <li><button onClick={() => handleNavigation('/fones')} className="hover:text-white transition-colors">Fones de Ouvido</button></li>
                <li><button onClick={() => handleNavigation('/cameras')} className="hover:text-white transition-colors">Câmeras</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Atendimento</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📞 (11) 9999-9999</li>
                <li>📧 contato@techway.com</li>
                <li>📍 São Paulo, SP</li>
                <li>🕒 Seg-Sex: 8h às 18h</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TechWay. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}