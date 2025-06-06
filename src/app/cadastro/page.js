'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, User, Mail, Phone, Calendar, Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../../utils/axios'; // Adicionada importação da instância do Axios

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Step 1 - Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    
    // Step 2 - Account
    password: '',
    confirmPassword: '',
    
    // Step 3 - Address
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    
    // Terms
    acceptTerms: false,
    acceptNewsletter: false
  });

  const [errors, setErrors] = useState({});

  const formatPhone = (value) => {
    return value
      .replace(/\D/g, '') // Remove caracteres não numéricos
      .replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') // Formata como (XX) XXXXX-XXXX
      .slice(0, 15); // Limita o tamanho máximo
  };

  const formatZipCode = (value) => {
    return value
      .replace(/\D/g, '') // Remove caracteres não numéricos
      .replace(/(\d{5})(\d{3})/, '$1-$2') // Formata como XXXXX-XXX
      .slice(0, 9); // Limita o tamanho máximo
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const formattedValue = name === 'phone' ? formatPhone(value) : name === 'zipCode' ? formatZipCode(value) : value; // Aplica máscara ao telefone e CEP

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : formattedValue,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Nome é obrigatório';
      if (!formData.lastName.trim()) newErrors.lastName = 'Sobrenome é obrigatório';
      if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
      if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
      if (!formData.birthDate) newErrors.birthDate = 'Data de nascimento é obrigatória';
    }
    
    if (step === 2) {
      if (!formData.password) newErrors.password = 'Senha é obrigatória';
      else if (formData.password.length < 6) newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Senhas não coincidem';
    }
    
    if (step === 3) {
      if (!formData.zipCode.trim()) newErrors.zipCode = 'CEP é obrigatório';
      if (!formData.street.trim()) newErrors.street = 'Endereço é obrigatório';
      if (!formData.number.trim()) newErrors.number = 'Número é obrigatório';
      if (!formData.neighborhood.trim()) newErrors.neighborhood = 'Bairro é obrigatório';
      if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
      if (!formData.state) newErrors.state = 'Estado é obrigatório';
      if (!formData.acceptTerms) newErrors.acceptTerms = 'Você deve aceitar os termos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validação final antes de submeter, caso queira garantir que todos os passos foram validados
    // if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
    //   alert("Por favor, preencha todos os campos obrigatórios corretamente.");
    //   return;
    // }

    setIsLoading(true);
    setError(''); // Limpa erros anteriores

    const payload = {
      nome: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      email: formData.email.trim(),
      senha: formData.password, // O backend fará o hash
      telefone: formData.phone.trim(),
      data_nascimento: formData.birthDate.trim(),
      genero: formData.gender.trim(),
      cidade: formData.city.trim(),
      estado: formData.state.trim(),
    };
    console.log("Payload enviado:", payload);

    if (!formData.acceptTerms) {
      alert("Você deve aceitar os termos de uso para continuar.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/clientes', payload);
      
      if (response.status === 201 || response.status === 200) { // 200 pode ser usado por alguns backends também
        alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
        router.push('/'); // Idealmente para a página de login, se for diferente da home
      } else {
        // Tratar outros status de sucesso que não sejam 201, se houver
        console.warn("Resposta inesperada do servidor:", response);
        alert(response.data?.message || "Cadastro concluído, mas com uma resposta inesperada.");
        router.push('/');
      }
    } catch (err) {
      console.error("Erro no cadastro:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || "Falha ao realizar o cadastro. Verifique os dados ou tente novamente.";
      alert(errorMessage);
      // Se quiser exibir o erro na página:
      // setErrors(prev => ({ ...prev, form: errorMessage })); 
      // Ou um estado de erro geral: setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Dados Pessoais', icon: User },
    { id: 2, title: 'Conta', icon: Shield },
    { id: 3, title: 'Endereço', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Logo/Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <ArrowLeft className="h-5 w-5 text-blue-400" />
            <span className="text-blue-400 hover:text-blue-300">Voltar ao início</span>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">
            Criar Conta na <span className="bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">TechWay</span>
          </h1>
          <p className="text-slate-300 text-sm">
            Junte-se à melhor loja de tecnologia do Brasil
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id
                  ? 'bg-gradient-to-r from-blue-600 to-orange-500 border-blue-600 text-white'
                  : 'border-slate-600 text-slate-400'
              }`}>
                <step.icon className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className={`text-xs ${
                  currentStep >= step.id ? 'text-blue-400' : 'text-slate-500'
                }`}>
                  Etapa {step.id}
                </p>
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-white' : 'text-slate-400'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-6 ${
                  currentStep > step.id ? 'bg-gradient-to-r from-blue-600 to-orange-500' : 'bg-slate-600'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Registration Form */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Dados Pessoais</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                      Nome *
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.firstName ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="Seu nome"
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                      Sobrenome *
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.lastName ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="Seu sobrenome"
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.email ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="seu@email.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.phone ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="(00) 00000-0000"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-slate-700 mb-2">
                      Data de Nascimento *
                    </label>
                    <input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      required
                      value={formData.birthDate}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.birthDate ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-2">
                    Gênero
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Selecione</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                    <option value="nao-informar">Prefiro não informar</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Account */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Dados da Conta</h3>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Senha *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pr-12 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.password ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  <p className="mt-1 text-xs text-slate-500">Mínimo de 6 caracteres</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                    Confirmar Senha *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pr-12 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">Segurança da Conta</h4>
                      <p className="text-xs text-blue-800">
                        Sua senha será criptografada e mantida segura. Recomendamos usar uma combinação de letras, números e símbolos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Address */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Endereço de Entrega</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-slate-700 mb-2">
                      CEP *
                    </label>
                    <input
                      id="zipCode"
                      name="zipCode"
                      type="text"
                      required
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.zipCode ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="00000-000"
                      maxLength={9}
                    />
                    {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
                  </div>
                  <div className="md:col-span-2"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <label htmlFor="street" className="block text-sm font-medium text-slate-700 mb-2">
                      Endereço *
                    </label>
                    <input
                      id="street"
                      name="street"
                      type="text"
                      required
                      value={formData.street}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.street ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="Rua, avenida..."
                    />
                    {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street}</p>}
                  </div>

                  <div>
                    <label htmlFor="number" className="block text-sm font-medium text-slate-700 mb-2">
                      Número *
                    </label>
                    <input
                      id="number"
                      name="number"
                      type="text"
                      required
                      value={formData.number}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.number ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="123"
                    />
                    {errors.number && <p className="mt-1 text-sm text-red-600">{errors.number}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="complement" className="block text-sm font-medium text-slate-700 mb-2">
                    Complemento
                  </label>
                  <input
                    id="complement"
                    name="complement"
                    type="text"
                    value={formData.complement}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Apto, casa, bloco..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="neighborhood" className="block text-sm font-medium text-slate-700 mb-2">
                      Bairro *
                    </label>
                    <input
                      id="neighborhood"
                      name="neighborhood"
                      type="text"
                      required
                      value={formData.neighborhood}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.neighborhood ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="Seu bairro"
                    />
                    {errors.neighborhood && <p className="mt-1 text-sm text-red-600">{errors.neighborhood}</p>}
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-2">
                      Cidade *
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.city ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="Sua cidade"
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-2">
                    Estado *
                  </label>
                  <select
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.state ? 'border-red-500' : 'border-slate-300'
                    }`}
                  >
                    <option value="">Selecione seu estado</option>
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SE">Sergipe</option>
                    <option value="SP">São Paulo</option>
                    <option value="TO">Tocantins</option>
                  </select>
                  {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                </div>

                {/* Terms and Conditions */}
                <div>
                  <div className="flex items-center mb-4">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      required
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="acceptTerms" className="ml-3 text-sm text-slate-700">
                      Eu li e aceito os <Link href="/termos" className="text-blue-500 hover:underline">termos de uso</Link>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="acceptNewsletter"
                      name="acceptNewsletter"
                      type="checkbox"
                      checked={formData.acceptNewsletter}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="acceptNewsletter" className="ml-3 text-sm text-slate-700">
                      Quero receber novidades e ofertas por email
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col md:flex-row items-center justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="w-full md:w-auto bg-white text-blue-600 border border-blue-600 rounded-lg py-3 px-6 mb-4 md:mb-0 shadow-sm hover:bg-blue-50 transition-all"
                >
                  Voltar
                </button>
              )}

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg py-3 px-6 shadow-md hover:from-blue-700 hover:to-orange-600 transition-all flex items-center justify-center space-x-2"
                >
                  Avançar
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg py-3 px-6 shadow-md hover:from-blue-700 hover:to-orange-600 transition-all flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4zm16 0a8 8 0 01-8 8v-8h8z"></path>
                    </svg>
                  ) : (
                    <span>Criar Conta</span>
                  )}
                </button>
              )}
            </div>

            {/* Botão de cancelar */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => router.push('/home')}
                className="w-full md:w-auto bg-red-600 text-white rounded-lg py-3 px-6 shadow-md hover:bg-red-700 transition-all flex items-center justify-center space-x-2"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}