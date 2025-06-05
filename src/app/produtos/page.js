'use client'
import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, Search, Star, Zap, Shield, Truck, Filter, Grid, List, ChevronDown, ArrowLeft, User, Heart, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '../../utils/axios';

export default function ProductsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Busca produtos e categorias em paralelo
        const [prodRes, catRes] = await Promise.all([
          api.get('/produtos'),
          api.get('/categorias')
        ]);
        // Mapeia produtos
        const mappedProducts = prodRes.data.map((item) => ({
          id: item.id_produto,
          name: item.nome,
          price: Number(item.preco_unitario),
          originalPrice: Number(item.preco_unitario),
          image: item.imagens && item.imagens.length > 0 ? item.imagens[0].url : '🖼️',
          rating: item.rating || 4.5,
          reviews: item.reviews || 0,
          brand: item.marca || '',
          categoryId: item.id_categoria,
          inStock: item.estoque > 0,
          isNew: false,
          discount: 0
        }));
        setProducts(mappedProducts);
        // Calcula contagem de produtos por categoria
        const counts = mappedProducts.reduce((acc, prod) => {
          acc[prod.categoryId] = (acc[prod.categoryId] || 0) + 1;
          return acc;
        }, {});
        // Mapeia categorias com contagem
        const mappedCategories = [
          { id: 'all', name: 'Todos os Produtos', count: mappedProducts.length },
          ...catRes.data.map(cat => ({
            id: cat.id_categoria,
            name: cat.nome,
            count: counts[cat.id_categoria] || 0
          }))
        ];
        setCategories(mappedCategories);
      } catch (err) {
        setError('Erro ao carregar produtos ou categorias');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleNavigation = (route) => {
    router.push(route);
  };

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && product.categoryId !== selectedCategory) return false;
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'newest': return b.isNew - a.isNew;
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNavigation('/')}>
                <Zap className="h-8 w-8 text-blue-600 mr-2" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  TechWay
                </span>
              </div>
            </div>

            <div className="hidden md:block flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-6">
                <button onClick={() => handleNavigation('/')} className="text-gray-700 hover:text-blue-600 transition-colors">Início</button>
                <button onClick={() => handleNavigation('/produtos')} className="text-blue-600 font-medium">Produtos</button>
                <button onClick={() => handleNavigation('/ofertas')} className="text-gray-700 hover:text-blue-600 transition-colors">Ofertas</button>
                <button onClick={() => handleNavigation('/contato')} className="text-gray-700 hover:text-blue-600 transition-colors">Contato</button>
              </nav>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleNavigation('/carrinho')} 
                  className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                </button>
                
                <button 
                  onClick={() => handleNavigation('/perfil')} 
                  className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="md:hidden">
              <Menu className="h-6 w-6 text-gray-700" />
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <button onClick={() => handleNavigation('/')} className="text-blue-600 hover:text-blue-800 flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Início
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 font-medium">Produtos</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
          {/* Filters Sidebar */}
          <aside className="sticky top-24 self-start">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ minWidth: 320 }}>
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-blue-600" />
                  Filtros
                </h3>
              </div>

              <div className="p-6 space-y-6">
                {/* Categories */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Categorias</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{category.name}</span>
                          <span className="text-xs opacity-75">({category.count})</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Faixa de Preço</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 50000])}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="w-full">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-lg mb-6 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">
                    {sortedProducts.length} produtos encontrados
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="relevance">Mais Relevantes</option>
                    <option value="price-low">Menor Preço</option>
                    <option value="price-high">Maior Preço</option>
                    <option value="rating">Melhor Avaliados</option>
                    <option value="newest">Mais Novos</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">⏳</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Carregando produtos...</h3>
              </div>
            ) : error ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{error}</h3>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {sortedProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden group"
                    onClick={() => handleNavigation(`/produto-individual/${product.id}`)}
                  >
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        {product.image && product.image.startsWith('http') ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="max-h-40 max-w-full object-contain group-hover:scale-110 transition-transform"
                            onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150?text=Sem+Imagem'; }}
                          />
                        ) : (
                          <span className="text-6xl group-hover:scale-110 transition-transform">🖼️</span>
                        )}
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col space-y-1">
                        {product.isNew && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Novo
                          </span>
                        )}
                        {product.discount > 0 && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            -{product.discount}%
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
                          <Heart className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
                          <Eye className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                      
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">({product.reviews})</span>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          )}
                        </div>
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigation('/carrinho');
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-orange-500 text-white py-2 rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all transform hover:scale-105"
                      >
                        Adicionar ao Carrinho
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Products */}
            {sortedProducts.length === 0 && !loading && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h3>
                <p className="text-gray-500 mb-6">Tente ajustar os filtros ou busque por outros termos.</p>
                <button 
                  onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange([0, 50000]);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Benefits Bar */}
      <section className="bg-gray-800 text-white py-4 fixed bottom-0 left-0 w-full z-50">
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
    </div>
  );
}