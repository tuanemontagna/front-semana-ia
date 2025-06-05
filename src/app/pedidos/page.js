'use client'
import { useState } from 'react';
import { ShoppingCart, Menu, Search, Star, Zap, Shield, Truck, Package, Clock, CheckCircle, XCircle, RotateCcw, Eye, Download, Filter, Calendar, User, Phone, MapPin, CreditCard, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrdersHistoryPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const router = useRouter();

  const orderStatuses = {
    pending: { label: 'Processando', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    shipped: { label: 'Enviado', color: 'bg-purple-100 text-purple-800', icon: Truck },
    delivered: { label: 'Entregue', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: XCircle },
    returned: { label: 'Devolvido', color: 'bg-gray-100 text-gray-800', icon: RotateCcw }
  };
  
  const orders = [
    {
      id: 'PED-2024-001',
      date: '2024-05-28',
      status: 'delivered',
      total: 23797.00,
      items: [
        { name: 'iPhone 15 Pro Max 256GB', price: 8999.00, quantity: 1, image: '📱' },
        { name: 'MacBook Pro M3 14"', price: 12999.00, quantity: 1, image: '💻' },
        { name: 'AirPods Pro 2ª Geração', price: 1899.00, quantity: 1, image: '🎧' }
      ],
      shipping: {
        method: 'Entrega Express',
        address: 'Rua das Flores, 123 - Centro, Chapecó - SC',
        trackingCode: 'BR123456789SC'
      },
      payment: {
        method: 'Cartão de Crédito',
        card: '**** **** **** 1234'
      }
    },
    {
      id: 'PED-2024-002',
      date: '2024-05-25',
      status: 'shipped',
      total: 3599.00,
      items: [
        { name: 'Samsung Galaxy Watch 6', price: 1799.00, quantity: 1, image: '⌚' },
        { name: 'Carregador Wireless Samsung', price: 299.00, quantity: 2, image: '🔌' },
        { name: 'Película Galaxy Watch', price: 49.00, quantity: 1, image: '🛡️' }
      ],
      shipping: {
        method: 'Entrega Padrão',
        address: 'Rua das Flores, 123 - Centro, Chapecó - SC',
        trackingCode: 'BR987654321SC'
      },
      payment: {
        method: 'PIX',
        card: null
      }
    },
    {
      id: 'PED-2024-003',
      date: '2024-05-20',
      status: 'confirmed',
      total: 5499.00,
      items: [
        { name: 'Sony WH-1000XM5', price: 2199.00, quantity: 1, image: '🎧' },
        { name: 'iPad Air M2', price: 3299.00, quantity: 1, image: '📱' }
      ],
      shipping: {
        method: 'Entrega Premium',
        address: 'Rua das Flores, 123 - Centro, Chapecó - SC',
        trackingCode: 'BR456789123SC'
      },
      payment: {
        method: 'Cartão de Débito',
        card: '**** **** **** 5678'
      }
    },
    {
      id: 'PED-2024-004',
      date: '2024-05-15',
      status: 'cancelled',
      total: 1299.00,
      items: [
        { name: 'Mi Band 8', price: 299.00, quantity: 1, image: '⌚' },
        { name: 'Carregador Xiaomi 67W', price: 199.00, quantity: 1, image: '🔌' },
        { name: 'Cabo USB-C Premium', price: 89.00, quantity: 3, image: '🔌' }
      ],
      shipping: {
        method: 'Entrega Padrão',
        address: 'Rua das Flores, 123 - Centro, Chapecó - SC',
        trackingCode: null
      },
      payment: {
        method: 'Boleto',
        card: null
      }
    },
    {
      id: 'PED-2024-005',
      date: '2024-05-10',
      status: 'returned',
      total: 899.00,
      items: [
        { name: 'JBL Flip 6', price: 899.00, quantity: 1, image: '🔊' }
      ],
      shipping: {
        method: 'Entrega Express',
        address: 'Rua das Flores, 123 - Centro, Chapecó - SC',
        trackingCode: 'BR789123456SC'
      },
      payment: {
        method: 'Cartão de Crédito',
        card: '**** **** **** 9012'
      }
    }
  ];

  const filterOptions = [
    { id: 'all', label: 'Todos os Pedidos', count: orders.length },
    { id: 'delivered', label: 'Entregues', count: orders.filter(o => o.status === 'delivered').length },
    { id: 'shipped', label: 'Enviados', count: orders.filter(o => o.status === 'shipped').length },
    { id: 'confirmed', label: 'Confirmados', count: orders.filter(o => o.status === 'confirmed').length },
    { id: 'cancelled', label: 'Cancelados', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  const filteredOrders = selectedFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedFilter);

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
                <button onClick={() => handleNavigation('/pedidos')} className="text-blue-600 font-medium">Meus Pedidos</button>
                <button onClick={() => handleNavigation('/contato')} className="text-gray-700 hover:text-blue-600 transition-colors">Contato</button>
              </nav>
              
              <div className="flex items-center space-x-4">
                {/* Shopping Cart */}
                <button 
                  onClick={() => handleNavigation('/carrinho')} 
                  className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
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
            <button onClick={() => handleNavigation('/')} className="text-blue-600 hover:text-blue-800 flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar ao Início
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 font-medium">Meus Pedidos</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Package className="h-8 w-8 mr-3 text-blue-600" />
            Meus Pedidos
          </h1>
          <p className="text-gray-600">Acompanhe o status de todos os seus pedidos</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="h-5 w-5 mr-2 text-blue-600" />
              Filtrar Pedidos
            </h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-3">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedFilter(option.id)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    selectedFilter === option.id
                      ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white border-transparent'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600 hover:text-blue-600'
                  }`}
                >
                  {option.label} ({option.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const StatusIcon = orderStatuses[order.status].icon;
            return (
              <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Pedido #{order.id}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${orderStatuses[order.status].color}`}>
                          <StatusIcon className="h-4 w-4 mr-1" />
                          {orderStatuses[order.status].label}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(order.date)}
                        </span>
                        <span>•</span>
                        <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                        <span>•</span>
                        <span className="text-lg font-bold text-gray-900">
                          R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => openOrderDetails(order)}
                      className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Ver Detalhes</span>
                    </button>
                  </div>

                  {/* Order Items Preview */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center space-x-4 overflow-x-auto">
                      {order.items.slice(0, 4).map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 min-w-0 flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-xl">{item.image}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate max-w-32">{item.name}</p>
                            <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="text-sm text-gray-500 flex-shrink-0">
                          +{order.items.length - 4} mais
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      {order.shipping.trackingCode && (
                        <>
                          <Truck className="h-4 w-4" />
                          <span>Código: {order.shipping.trackingCode}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {order.status === 'shipped' && (
                        <button 
                          onClick={() => handleNavigation(`/rastreamento/${order.shipping.trackingCode}`)}
                          className="text-purple-600 hover:text-purple-800 text-sm flex items-center space-x-1"
                        >
                          <Truck className="h-4 w-4" />
                          <span>Rastrear</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-500 mb-6">Não há pedidos com o filtro selecionado.</p>
            <button 
              onClick={() => handleNavigation('/produtos')}
              className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all"
            >
              Fazer uma Compra
            </button>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Detalhes do Pedido #{selectedOrder.id}</h2>
                <button
                  onClick={closeOrderDetails}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Status */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Status do Pedido</h3>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full ${orderStatuses[selectedOrder.status].color}`}>
                      {React.createElement(orderStatuses[selectedOrder.status].icon, { className: "h-5 w-5 mr-2" })}
                      {orderStatuses[selectedOrder.status].label}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Informações de Entrega</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start space-x-2">
                        <Truck className="h-4 w-4 text-gray-500 mt-0.5" />
                        <span>{selectedOrder.shipping.method}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <span>{selectedOrder.shipping.address}</span>
                      </div>
                      {selectedOrder.shipping.trackingCode && (
                        <div className="flex items-start space-x-2">
                          <Package className="h-4 w-4 text-gray-500 mt-0.5" />
                          <span>Código de rastreamento: {selectedOrder.shipping.trackingCode}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Forma de Pagamento</h3>
                    <div className="flex items-center space-x-2 text-sm">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <span>{selectedOrder.payment.method}</span>
                      {selectedOrder.payment.card && (
                        <span className="text-gray-500">- {selectedOrder.payment.card}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Itens do Pedido</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-xl">{item.image}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total do Pedido</span>
                      <span>R$ {selectedOrder.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
                {selectedOrder.status === 'delivered' && (
                  <button 
                    onClick={() => handleNavigation(`/avaliacoes/${selectedOrder.id}`)}
                    className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all flex items-center space-x-2"
                  >
                    <Star className="h-4 w-4" />
                    <span>Avaliar Produtos</span>
                  </button>
                )}
                {selectedOrder.status === 'shipped' && (
                  <button 
                    onClick={() => handleNavigation(`/rastreamento/${selectedOrder.shipping.trackingCode}`)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center space-x-2"
                  >
                    <Truck className="h-4 w-4" />
                    <span>Rastrear Pedido</span>
                  </button>
                )}
                {selectedOrder.status === 'confirmed' && (
                  <button 
                    onClick={() => handleNavigation(`/cancelar-pedido/${selectedOrder.id}`)}
                    className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-2 rounded-lg hover:from-red-700 hover:to-red-600 transition-all flex items-center space-x-2"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Cancelar Pedido</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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