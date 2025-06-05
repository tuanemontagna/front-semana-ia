'use client'
import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, Search, Star, Zap, Shield, Truck, Heart, Share2, ArrowLeft, User, Plus, Minus, Check, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '../../../utils/axios';

export default function ProductDetailPage({ params }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('natural');
  const [selectedStorage, setSelectedStorage] = useState('256gb');
  const [activeTab, setActiveTab] = useState('description');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/produtos/${params?.id || 1}`);
        const item = response.data;
        const mappedProduct = {
          id: item.id_produto,
          name: item.nome,
          brand: item.marca || (item.categoria?.nome || ''),
          price: Number(item.preco_unitario),
          originalPrice: Number(item.preco_unitario),
          discount: item.discount || 0,
          rating: item.rating || 4.5,
          reviews: item.reviews || 0,
          inStock: item.estoque > 0,
          stockQuantity: item.estoque,
          sku: item.sku || '',
          images: item.imagens && item.imagens.length > 0 ? item.imagens.map(img => img.url) : [],
          colors: item.cores || [{ id: 'default', name: 'Padrão', hex: '#CCCCCC' }],
          storage: item.storage || [{ id: 'default', name: 'Único', price: Number(item.preco_unitario) }],
          description: item.descricao || '',
          specifications: item.specifications || {},
          features: item.features || []
        };
        setProduct(mappedProduct);
        // Corrigir selectedColor e selectedStorage para o primeiro valor disponível
        setSelectedColor((mappedProduct.colors && mappedProduct.colors[0]?.id) || 'default');
        setSelectedStorage((mappedProduct.storage && mappedProduct.storage[0]?.id) || 'default');
        setReviews(item.reviewsList || []);
        setRelatedProducts(item.related || []);
      } catch (err) {
        setError('Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleNavigation = (route) => {
    router.push(route);
  };

  const addToCart = () => {
    // Implementar lógica de adicionar ao carrinho
    alert(`${quantity}x ${product.name} adicionado ao carrinho!`);
    handleNavigation('/carrinho');
  };

  // Ajustar o uso de product para garantir que não é null antes de acessar propriedades
  const selectedStoragePrice = product && product.storage.find(s => s.id === selectedStorage)?.price || product?.price || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Carregando produto...</h3>
        </div>
      </div>
    );
  }
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{error || 'Produto não encontrado'}</h3>
        </div>
      </div>
    );
  }

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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-6">
                <button onClick={() => handleNavigation('/')} className="text-gray-700 hover:text-blue-600 transition-colors">Início</button>
                <button onClick={() => handleNavigation('/produtos')} className="text-gray-700 hover:text-blue-600 transition-colors">Produtos</button>
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
            <button onClick={() => handleNavigation('/')} className="text-blue-600 hover:text-blue-800">Início</button>
            <span className="text-gray-400">/</span>
            <button onClick={() => handleNavigation('/produtos')} className="text-blue-600 hover:text-blue-800">Produtos</button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
              <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                {product.images[selectedImage] && product.images[selectedImage].startsWith('http') ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="max-h-80 max-w-full object-contain group-hover:scale-110 transition-transform"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300?text=Sem+Imagem'; }}
                  />
                ) : (
                  <div className="text-9xl">{product.images[selectedImage] || '🖼️'}</div>
                )}
                
                {/* Navigation Arrows */}
                <button
                  onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setSelectedImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{product.discount}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 bg-white rounded-lg border-2 flex items-center justify-center transition-all ${
                    selectedImage === index ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {image && image.startsWith('http') ? (
                    <img
                      src={image}
                      alt={product.name}
                      className="max-h-16 max-w-full object-contain"
                      onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/80?text=Sem+Imagem'; }}
                    />
                  ) : (
                    <span className="text-2xl">{image || '🖼️'}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-600 font-medium">{product.brand}</span>
                  <div className="flex space-x-2">
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Heart className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Share2 className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">({product.reviews} avaliações)</span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold text-gray-900">
                      R$ {selectedStoragePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    {product.originalPrice > selectedStoragePrice && (
                      <span className="text-xl text-gray-500 line-through">
                        R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                  <p className="text-green-600 font-medium">Em 12x de R$ {(selectedStoragePrice / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</p>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-6 mb-8">
                {/* Storage */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Armazenamento</h3>
                  <div className="flex space-x-2">
                    {product.storage.map(storage => (
                      <button
                        key={storage.id}
                        onClick={() => setSelectedStorage(storage.id)}
                        className={`px-4 py-2 border rounded-lg transition-all ${
                          selectedStorage === storage.id
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {storage.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Cor</h3>
                  <div className="flex space-x-2">
                    {product.colors.map(color => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.id)}
                        className={`p-3 border-2 rounded-lg transition-all ${
                          selectedColor === color.id
                            ? 'border-blue-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-6 h-6 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.hex }}
                          ></div>
                          <span className="text-sm">{color.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Quantidade</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.stockQuantity} disponíveis
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <button
                  onClick={addToCart}
                  className="w-full bg-gradient-to-r from-blue-600 to-orange-500 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-orange-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Adicionar ao Carrinho</span>
                </button>

                <button 
                  onClick={() => handleNavigation('/checkout')}
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-all"
                >
                  Comprar Agora
                </button>
              </div>

              {/* Benefits */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Truck className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">Frete grátis para todo o Brasil</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-gray-700">Garantia de 1 ano</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">Produto original e lacrado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <div className="flex space-x-8 px-8">
                {[
                  { id: 'description', label: 'Descrição' },
                  { id: 'specifications', label: 'Especificações' },
                  { id: 'reviews', label: 'Avaliações' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'description' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Descrição do Produto</h3>
                  <p className="text-gray-700 mb-6">{product.description}</p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Principais Recursos</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Especificações Técnicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="border border-gray-200 rounded-lg p-4">
                        <dt className="font-semibold text-gray-900">{key}</dt>
                        <dd className="text-gray-700 mt-1">{value}</dd>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Avaliações dos Clientes</h3>
                  <div className="space-y-6">
                    {reviews.map(review => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold text-gray-900">{review.user}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <button className="hover:text-blue-600">Útil ({review.helpful})</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Produtos Relacionados</h3>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProducts.map(relatedProduct => (
                  <div
                    key={relatedProduct.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleNavigation(`/produto/${relatedProduct.id}`)}
                  >
                    <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-3">
                      <span className="text-4xl">{relatedProduct.image}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{relatedProduct.name}</h4>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(relatedProduct.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900">
                        R$ {relatedProduct.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      {relatedProduct.originalPrice > relatedProduct.price && (
                        <span className="text-sm text-gray-500 line-through">
                          R$ {relatedProduct.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Bar */}
      <section className="bg-gray-800 text-white py-4 mt-12">
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

      {/* Troque o nome deste arquivo de page.js para [id].js para que o Next.js trate /produto-individual/[id] como rota dinâmica.
      Depois disso, o componente receberá { params: { id: '1' } } automaticamente. */}
    </div>
  );
}