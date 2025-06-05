'use client'
import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, Search, Star, Zap, Shield, Truck, Plus, Minus, Trash2, ArrowLeft, CreditCard, MapPin, Tag, Gift, CheckCircle, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '../../utils/axios';

export default function ShoppingCartPage() {
  const router = useRouter();
  // id_cliente hardcoded para teste; depois substituir pelo contexto de autenticação
  const id_cliente = 1;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState('express');

  const shippingOptions = [
    { id: 'standard', name: 'Entrega Padrão', time: '5-7 dias úteis', price: 0 },
    { id: 'express', name: 'Entrega Expressa', time: '2-3 dias úteis', price: 29.90 },
    { id: 'premium', name: 'Entrega Premium', time: '24 horas', price: 59.90 }
  ];

  // Busca itens do carrinho do backend
  useEffect(() => {
    async function fetchCart() {
      setLoading(true);
      setError(null);
      try {
        // Busca o carrinho do cliente
        const carrinhoRes = await api.get(`/carrinho/${id_cliente}`);
        const id_carrinho = carrinhoRes.data.id_carrinho;
        // Busca os itens do carrinho
        const itensRes = await api.get(`/carrinho/${id_cliente}/itens`);
        // Mapeia os itens para o formato do frontend
        const mapped = await Promise.all(itensRes.data.map(async (item) => {
          // Busca detalhes do produto para exibir nome, imagem, etc.
          const prodRes = await api.get(`/produtos/${item.id_produto}`);
          const produto = prodRes.data;
          return {
            id: item.id_item_carrinho,
            id_produto: item.id_produto,
            name: produto.nome,
            price: Number(item.preco_registrado),
            originalPrice: Number(produto.preco_unitario),
            image: produto.imagens && produto.imagens.length > 0 ? produto.imagens[0].url : '🖼️',
            quantity: item.quantidade,
            color: produto.cor || 'Padrão',
            warranty: '1 ano', // Ajuste se houver campo
            inStock: produto.estoque > 0
          };
        }));
        setCartItems(mapped);
      } catch (err) {
        setError('Erro ao carregar o carrinho');
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, [id_cliente]);

  // Atualiza quantidade de um item no carrinho via API
  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    setLoading(true);
    setError(null);
    try {
      const item = cartItems.find(i => i.id === id);
      await api.put(`/carrinho/${id_cliente}/itens/${item.id_produto}`, { quantidade: newQuantity });
      setCartItems(items => items.map(i => i.id === id ? { ...i, quantity: newQuantity } : i));
    } catch (err) {
      setError('Erro ao atualizar quantidade');
    } finally {
      setLoading(false);
    }
  };

  // Remove item do carrinho via API
  const removeItem = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const item = cartItems.find(i => i.id === id);
      await api.delete(`/carrinho/${id_cliente}/itens/${item.id_produto}`);
      setCartItems(items => items.filter(i => i.id !== id));
    } catch (err) {
      setError('Erro ao remover item');
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'TECH10') {
      setAppliedCoupon({ code: 'TECH10', discount: 0.1, description: '10% de desconto' });
    } else if (couponCode.toUpperCase() === 'PRIMEIRA COMPRA') {
      setAppliedCoupon({ code: 'PRIMEIRA COMPRA', discount: 0.15, description: '15% de desconto na primeira compra' });
    } else {
      alert('Cupom inválido');
    }
    setCouponCode('');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const handleNavigation = (route) => {
    router.push(route);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const couponDiscount = appliedCoupon ? subtotal * appliedCoupon.discount : 0;
  const selectedShippingCost = shippingOptions.find(option => option.id === selectedShipping)?.price || 0;
  const total = subtotal - couponDiscount + selectedShippingCost;

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
                {/* Shopping Cart */}
                <button 
                  onClick={() => handleNavigation('/carrinho')} 
                  className="relative p-2 text-blue-600"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </button>
                
                {/* Profile Icon */}
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
            <button 
              onClick={() => handleNavigation('/')} 
              className="text-blue-600 hover:text-blue-800 flex items-center transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Continuar Comprando
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 font-medium">Carrinho de Compras</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <ShoppingCart className="h-6 w-6 mr-2 text-blue-600" />
                  Seu Carrinho ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} itens)
                </h2>
              </div>
              {loading ? (
                <div className="p-8 text-center text-lg">Carregando...</div>
              ) : error ? (
                <div className="p-8 text-center text-red-600">{error}</div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                            {item.image && item.image.startsWith('http') ? (
                              <img src={item.image} alt={item.name} className="max-h-16 max-w-full object-contain" />
                            ) : (
                              <span className="text-3xl">{item.image}</span>
                            )}
                          </div>
                        </div>
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                            <span>Cor: {item.color}</span>
                            <span>•</span>
                            <span className="flex items-center">
                              <Shield className="h-3 w-3 mr-1" />
                              Garantia: {item.warranty}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-xl font-bold text-gray-900">
                              R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                            {item.originalPrice > item.price && (
                              <span className="text-sm text-gray-500 line-through">
                                R$ {item.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">Quantidade:</span>
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-2 hover:bg-gray-100 transition-colors"
                                  disabled={item.quantity <= 1 || loading}
                                >
                                  <Minus className="h-4 w-4 text-gray-600" />
                                </button>
                                <span className="px-4 py-2 border-x border-gray-300 font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-2 hover:bg-gray-100 transition-colors"
                                  disabled={loading}
                                >
                                  <Plus className="h-4 w-4 text-gray-600" />
                                </button>
                              </div>
                            </div>
                            {/* Remove Button */}
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-800 flex items-center space-x-1 transition-colors"
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="text-sm">Remover</span>
                            </button>
                          </div>
                          {/* Stock Status */}
                          <div className="mt-2 flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-600">Em estoque</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Shipping Options */}
            <div className="bg-white rounded-xl shadow-lg mt-6 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-blue-600" />
                  Opções de Entrega
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {shippingOptions.map((option) => (
                    <label key={option.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={selectedShipping === option.id}
                          onChange={(e) => setSelectedShipping(e.target.value)}
                          className="mr-3 text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{option.name}</div>
                          <div className="text-sm text-gray-500">{option.time}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {option.price === 0 ? 'Grátis' : `R$ ${option.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-24">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Resumo do Pedido</h3>
              </div>

              <div className="p-6 space-y-4">
                {/* Coupon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cupom de Desconto
                  </label>
                  {!appliedCoupon ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Digite seu cupom"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={applyCoupon}
                        className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all"
                      >
                        <Tag className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <Gift className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm text-green-800">{appliedCoupon.description}</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Order Details */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Economia</span>
                      <span>-R$ {savings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto ({appliedCoupon.code})</span>
                      <span>-R$ {couponDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Frete</span>
                    <span>
                      {selectedShippingCost === 0 ? 'Grátis' : `R$ ${selectedShippingCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button 
                  onClick={() => handleNavigation('/checkout')}
                  className="w-full bg-gradient-to-r from-blue-600 to-orange-500 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-orange-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Finalizar Compra</span>
                </button>

                {/* Security Info */}
                <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Compra 100% segura</span>
                  </div>
                  <p>Seus dados estão protegidos com criptografia SSL</p>
                </div>
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
    </div>
  );
}