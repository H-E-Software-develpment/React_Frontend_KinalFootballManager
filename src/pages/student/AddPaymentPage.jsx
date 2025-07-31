import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../../services/paymentService.js';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';
import CreditCard from '../../components/CreditCard.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import './AddPaymentPage.css';

const AddPaymentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    bank: '',
    type: '',
    holder: '',
    cardNumber: '',
    dueDate: '',
    cvv: ''
  });

  const banks = [
    'GYT CONTINENTAL',
    'BANCO INDUSTRIAL',
    'BANRURAL',
    'BAC',
    'BANCO PROMERICA',
    'BAM',
    'FICOHSA'
  ];

  const cardTypes = [
    { value: 'DEBIT', label: 'Débito' },
    { value: 'CREDIT', label: 'Crédito' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCardFlip = () => {
    setIsCardFlipped(!isCardFlipped);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bank) newErrors.bank = 'Selecciona un banco';
    if (!formData.type) newErrors.type = 'Selecciona el tipo de tarjeta';
    if (!formData.holder.trim()) newErrors.holder = 'Ingresa el nombre del titular';
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Ingresa el número de tarjeta';
    } else {
      const cleanNumber = formData.cardNumber.replace(/\s/g, '');
      if (cleanNumber.length < 16) {
        newErrors.cardNumber = 'El número de tarjeta debe tener 16 dígitos';
      }
    }
    if (!formData.dueDate.trim()) {
      newErrors.dueDate = 'Ingresa la fecha de vencimiento';
    } else {
      const [month, year] = formData.dueDate.split('/');
      if (!month || !year || month < 1 || month > 12) {
        newErrors.dueDate = 'Formato inválido (MM/AA)';
      }
    }
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'Ingresa el CVV';
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'CVV debe tener al menos 3 dígitos';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      // Format the date to ISO format
      const [month, year] = formData.dueDate.split('/');
      const fullYear = `20${year}`;
      const dueDate = new Date(`${fullYear}-${month}-01`);

      // Remove spaces from card number
      const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');

      const paymentData = {
        ...formData,
        cardNumber: cleanCardNumber,
        dueDate: dueDate.toISOString()
      };

      await paymentService.createPayment(paymentData);
      setSuccess('Tarjeta registrada exitosamente');
      
      setTimeout(() => {
        navigate('/payments');
      }, 2000);

    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-payment-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Agregar Método de Pago</h1>
          <p>Registra tu tarjeta de débito o crédito de forma segura</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/payments')}
          className="back-btn"
        >
          ← Regresar
        </Button>
      </div>

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {errors.general && (
        <div className="alert alert-error">
          {errors.general}
        </div>
      )}

      <div className="payment-form-container">
        <div className="card-preview-section">
          <CreditCard
            formData={formData}
            onInputChange={handleInputChange}
            onFlip={handleCardFlip}
            isFlipped={isCardFlipped}
            errors={errors}
          />
          <div className="card-instructions">
            <p>
              <span className="instruction-icon">💡</span>
              Completa los campos directamente en la tarjeta o usa el formulario
            </p>
            <p>
              <span className="instruction-icon">🔄</span>
              Haz clic en la esquina superior derecha para voltear la tarjeta
            </p>
          </div>
        </div>

        <div className="form-section">
          <Card title="Información de la Tarjeta" className="payment-form-card">
            <form onSubmit={handleSubmit} className="payment-form">
              <div className="form-grid">
                <div className="input-group">
                  <label className="input-label">Banco *</label>
                  <select
                    name="bank"
                    value={formData.bank}
                    onChange={handleInputChange}
                    className={`input-field ${errors.bank ? 'input-error' : ''}`}
                  >
                    <option value="">Selecciona tu banco</option>
                    {banks.map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                  {errors.bank && <span className="error-message">{errors.bank}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label">Tipo de Tarjeta *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={`input-field ${errors.type ? 'input-error' : ''}`}
                  >
                    <option value="">Selecciona el tipo</option>
                    {cardTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  {errors.type && <span className="error-message">{errors.type}</span>}
                </div>

                <Input
                  label="Titular de la Tarjeta"
                  type="text"
                  name="holder"
                  value={formData.holder}
                  onChange={handleInputChange}
                  placeholder="Nombre completo como aparece en la tarjeta"
                  error={errors.holder}
                  required
                  className="full-width"
                />

                <Input
                  label="Número de Tarjeta"
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  error={errors.cardNumber}
                  required
                  className="full-width"
                />

                <div className="split-fields">
                  <Input
                    label="Fecha de Vencimiento"
                    type="text"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    placeholder="MM/AA"
                    error={errors.dueDate}
                    required
                  />

                  <div className="cvv-field">
                    <Input
                      label="CVV"
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      error={errors.cvv}
                      required
                    />
                    <div className="cvv-help">
                      <span 
                        className="cvv-help-icon"
                        onClick={() => setIsCardFlipped(true)}
                        title="El CVV está en la parte trasera de tu tarjeta"
                      >
                        ❓
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="submit-btn"
                >
                  {loading ? <LoadingSpinner size="small" /> : 'Registrar Tarjeta'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/payments')}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentPage;
