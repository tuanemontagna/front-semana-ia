'use client'
import { useState } from 'react';
import { ShoppingCart, Menu, Search, Zap, Shield, Truck, ArrowLeft, User, CreditCard, MapPin, Gift, CheckCircle, Lock, Calendar, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [useNewAddress, setUseNewAddress] = useState(false);

  const [checkoutData, setCheckoutData] = useState({
    // Address
    address: {
      name: 'João Silva',
      street: 'Rua das Flores, 123',
      neighborhood: 'Centro',
      city: 'Chapecó',
      state: 'SC',
      zipCode: '89801-000',
      phone: '(49) 99999-9999'
    },
    // Payment
    payment: {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      installments: '1'
    },
    // New Address
    newAddress: {
      name: '',
      street: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      phone: ''
    }
  });

  const cartItems = [
    {
      id: 1,
      name: "iPhone 15 Pro Max 256GB",
      price: 8999.00,
      originalPrice: 9999.00,
      image: "📱",
      quantity: 1,
      color: "Titânio Natural"
    },
    {
      id: 2,
      name: "AirPods Pro 2ª Geração",
      price: 1899.00,
      originalPrice: 2199.00,
      image: "🎧",
      quantity: 2,
      color: "Branco"
    }
  ];

  const addresses = [
    {
      id: 1,
      name: 'Casa',
      street: 'Rua das Flores, 123',
      neighborhood: 'Centro',
      city: 'Chapecó',
      state: 'SC',
      zipCode: '89801-000',
      isDefault: true
    },
    {
      id: 2,
      name: 'Trabalho',
      street: 'Av. Brasil, 456',
      neighborhood: 'Centro',
      city: 'Chapecó',
      state: 'SC',
      zipCode: '89802-000',
      isDefault: false
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 29.90;
  const total = subtotal + shipping;

  const handleNavigation = (route) => {
    router.push(route);
  };

  const handleInputChange = (section, field, value) => {
    setCheckoutData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinishOrder = () => {
    // Implementar lógica de finalização do pedido
    alert('Pedido realizado com sucesso!');
    handleNavigation('/pedidos');
  };

  const steps = [
    { id: 1, title: 'Endereço de Entrega', icon: MapPin },
    { id: 2, title: 'Forma de Pagamento', icon: CreditCard },
    { id: 3, title: 'Confirmação', icon: CheckCircle }
  ];

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

            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-700">Compra Segura</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <button onClick={() => handleNavigation('/carrinho')} className="text-blue-600 hover:text-blue-800 flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar ao Carrinho
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 font-medium">Finalizar Compra</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-gradient-to-r from-blue-600 to-orange-500 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    Etapa {step.id}
                  </p>
                  <p className={`text-xs ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-24 h-1 mx-8 ${
                    currentStep > step.id ? 'bg-gradient-to-r from-blue-600 to-orange-500' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Step 1: Address */}
              {currentStep === 1 && (
                <div>
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <MapPin className="h-6 w-6 mr-2 text-blue-600" />
                      Endereço de Entrega
                    </h2>
                  </div>

                  <div className="p-6">
                    {/* Existing Addresses */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Escolha um endereço</h3>
                      <div className="space-y-3">
                        {addresses.map(address => (
                          <label key={address.id} className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="address"
                              value={address.id}
                              checked={selectedAddress === address.id && !useNewAddress}
                              onChange={() => {
                                setSelectedAddress(address.id);
                                setUseNewAddress(false);
                              }}
                              className="mt-1 text-blue-600"
                            />
                            <div className="ml-3 flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">{address.name}</span>
                                {address.isDefault && (
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Principal</span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mt-1">
                                {address.street}<br />
                                {address.neighborhood}, {address.city} - {address.state}<br />
                                CEP: {address.zipCode}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* New Address Option */}
                    <div className="border-t border-gray-200 pt-6">
                      <label className="flex items-center mb-4 cursor-pointer">
                        <input
                          type="radio"
                          name="address"
                          checked={useNewAddress}
                          onChange={() => setUseNewAddress(true)}
                          className="text-blue-600"
                        />
                        <span className="ml-2 font-medium text-gray-900">Usar novo endereço</span>
                      </label>

                      {useNewAddress && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Destinatário</label>
                            <input
                              type="text"
                              value={checkoutData.newAddress.name}
                              onChange={(e) => handleInputChange('newAddress', 'name', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Nome completo"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                            <input
                              type="text"
                              value={checkoutData.newAddress.street}
                              onChange={(e) => handleInputChange('newAddress', 'street', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Rua, número, complemento"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                            <input
                              type="text"
                              value={checkoutData.newAddress.neighborhood}
                              onChange={(e) => handleInputChange('newAddress', 'neighborhood', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Bairro"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                            <input
                              type="text"
                              value={checkoutData.newAddress.city}
                              onChange={(e) => handleInputChange('newAddress', 'city', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Cidade"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                            <select
                              value={checkoutData.newAddress.state}
                              onChange={(e) => handleInputChange('newAddress', 'state', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Selecione</option>
                              <option value="SC">Santa Catarina</option>
                              <option value="RS">Rio Grande do Sul</option>
                              <option value="PR">Paraná</option>
                              <option value="SP">São Paulo</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                            <input
                              type="text"
                              value={checkoutData.newAddress.zipCode}
                              onChange={(e) => handleInputChange('newAddress', 'zipCode', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="00000-000"
                              maxLength={9}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <div>
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <CreditCard className="h-6 w-6 mr-2 text-blue-600" />
                      Forma de Pagamento
                    </h2>
                  </div>

                  <div className="p-6">
                    {/* Payment Methods */}
                    <div className="space-y-4 mb-6">
                      <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="credit"
                          checked={paymentMethod === 'credit'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-blue-600"
                        />
                        <CreditCard className="h-5 w-5 ml-3 mr-2 text-gray-600" />
                        <span className="font-medium text-gray-900">Cartão de Crédito</span>
                      </label>

                      <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="debit"
                          checked={paymentMethod === 'debit'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-blue-600"
                        />
                        <CreditCard className="h-5 w-5 ml-3 mr-2 text-gray-600" />
                        <span className="font-medium text-gray-900">Cartão de Débito</span>
                      </label>

                      <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="pix"
                          checked={paymentMethod === 'pix'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-blue-600"
                        />
                        <div className="h-5 w-5 ml-3 mr-2 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">P</div>
                        <span className="font-medium text-gray-900">PIX</span>
                        <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">5% desconto</span>
                      </label>
                    </div>

                    {/* Card Form */}
                    {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Número do Cartão</label>
                          <input
                            type="text"
                            value={checkoutData.payment.cardNumber}
                            onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nome no Cartão</label>
                          <input
                            type="text"
                            value={checkoutData.payment.cardName}
                            onChange={(e) => handleInputChange('payment', 'cardName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nome como está no cartão"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Validade</label>
                            <input
                              type="text"
                              value={checkoutData.payment.expiryDate}
                              onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="MM/AA"
                              maxLength={5}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                            <input
                              type="text"
                              value={checkoutData.payment.cvv}
                              onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="000"
                              maxLength={4}
                            />
                          </div>
                        </div>

                        {paymentMethod === 'credit' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Parcelamento</label>
                            <select
                              value={checkoutData.payment.installments}
                              onChange={(e) => handleInputChange('payment', 'installments', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="1">1x de R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</option>
                              <option value="2">2x de R$ {(total / 2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</option>
                              <option value="3">3x de R$ {(total / 3).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</option>
                              <option value="6">6x de R$ {(total / 6).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</option>
                              <option value="12">12x de R$ {(total / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</option>
                            </select>
                          </div>
                        )}
                      </div>
                    )}

                    {/* PIX Info */}
                    {paymentMethod === 'pix' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <div className="h-6 w-6 bg-blue-600 rounded text-white text-sm flex items-center justify-center font-bold mr-2">P</div>
                          <span className="font-semibold text-blue-900">Pagamento via PIX</span>
                        </div>
                        <p className="text-blue-800 text-sm">
                          Após confirmar o pedido, você receberá o código PIX para pagamento. 
                          O pagamento deve ser realizado em até 30 minutos.
                        </p>
                        <div className="mt-2 flex items-center text-green-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">5% de desconto aplicado</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <div>
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <CheckCircle className="h-6 w-6 mr-2 text-blue-600" />
                      Confirmação do Pedido
                    </h2>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Address Summary */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Endereço de Entrega</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="font-medium text-gray-900">{checkoutData.address.name}</p>
                        <p className="text-gray-600">
                          {checkoutData.address.street}<br />
                          {checkoutData.address.neighborhood}, {checkoutData.address.city} - {checkoutData.address.state}<br />
                          CEP: {checkoutData.address.zipCode}
                        </p>
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Forma de Pagamento</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {paymentMethod === 'credit' && (
                          <div>
                            <p className="font-medium text-gray-900">Cartão de Crédito</p>
                            <p className="text-gray-600">**** **** **** {checkoutData.payment.cardNumber.slice(-4)}</p>
                            <p className="text-gray-600">{checkoutData.payment.installments}x de R$ {(total / parseInt(checkoutData.payment.installments)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                          </div>
                        )}
                        {paymentMethod === 'debit' && (
                          <div>
                            <p className="font-medium text-gray-900">Cartão de Débito</p>
                            <p className="text-gray-600">**** **** **** {checkoutData.payment.cardNumber.slice(-4)}</p>
                          </div>
                        )}
                        {paymentMethod === 'pix' && (
                          <div>
                            <p className="font-medium text-gray-900">PIX</p>
                            <p className="text-gray-600">Pagamento à vista com 5% de desconto</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Items Summary */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Itens do Pedido</h3>
                      <div className="space-y-3">
                        {cartItems.map(item => (
                          <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-xl">{item.image}</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-600">Cor: {item.color} • Qtd: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-yellow-800">
                            Ao finalizar a compra, você concorda com nossos{' '}
                            <button className="font-medium underline hover:no-underline">Termos de Uso</button>{' '}
                            e{' '}
                            <button className="font-medium underline hover:no-underline">Política de Privacidade</button>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between">
                  <button
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Voltar
                  </button>
                  
                  {currentStep < 3 ? (
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all"
                    >
                      Continuar
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishOrder}
                      className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold"
                    >
                      Finalizar Pedido
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-24">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Resumo do Pedido</h3>
              </div>

              <div className="p-6">
                {/* Items */}
                <div className="space-y-3 mb-6">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">{item.image}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Frete</span>
                    <span>R$ {shipping.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>

                  {paymentMethod === 'pix' && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto PIX (5%)</span>
                      <span>-R$ {(subtotal * 0.05).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>
                        R$ {(paymentMethod === 'pix' ? (total - subtotal * 0.05) : total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
                    <Shield className="h-5 w-5" />
                    <span className="text-sm font-medium">Compra Protegida</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Seus dados estão seguros com criptografia SSL
                  </p>
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