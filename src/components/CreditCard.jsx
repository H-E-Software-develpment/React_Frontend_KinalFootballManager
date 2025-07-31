import { useState } from 'react';
import './CreditCard.css';

const CreditCard = ({ 
  formData, 
  onInputChange, 
  onFlip, 
  isFlipped = false,
  errors = {} 
}) => {
  const [focusedField, setFocusedField] = useState('');

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = cleaned.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return '';
    }
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      if (formattedValue.length > 19) return; // 16 digits + 3 spaces
    } else if (name === 'dueDate') {
      formattedValue = formatExpiry(value);
      if (formattedValue.length > 5) return; // MM/YY
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) return; // Max 4 digits
    } else if (name === 'holder') {
      formattedValue = value.replace(/[0-9]/g, ''); // No numbers in name
    }

    onInputChange({
      target: {
        name,
        value: formattedValue
      }
    });
  };

  const getCardType = () => {
    const number = formData.cardNumber?.replace(/\s/g, '') || '';
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'mastercard';
    return 'unknown';
  };

  const getBankColor = () => {
    const bankColors = {
      'GYT CONTINENTAL': 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
      'BANCO INDUSTRIAL': 'linear-gradient(135deg, #7c2d12, #ea580c)',
      'BANRURAL': 'linear-gradient(135deg, #166534, #22c55e)',
      'BAC': 'linear-gradient(135deg, #dc2626, #f87171)',
      'BANCO PROMERICA': 'linear-gradient(135deg, #7c3aed, #a855f7)',
      'BAM': 'linear-gradient(135deg, #0891b2, #06b6d4)',
      'FICOHSA': 'linear-gradient(135deg, #b91c1c, #ef4444)'
    };
    return bankColors[formData.bank] || 'linear-gradient(135deg, #374151, #6b7280)';
  };

  return (
    <div className="credit-card-wrapper">
      <div className={`credit-card ${isFlipped ? 'flipped' : ''}`}>
        
        {/* Front of the card */}
        <div className="card-face card-front" style={{ background: getBankColor() }}>
          <div className="card-header">
            <div className="card-type-logo">
              {getCardType() === 'visa' && (
                <div className="visa-logo">
                  <span>VISA</span>
                </div>
              )}
              {getCardType() === 'mastercard' && (
                <div className="mastercard-logo">
                  <div className="circle red"></div>
                  <div className="circle yellow"></div>
                </div>
              )}
            </div>
            <div 
              className="flip-icon"
              onClick={onFlip}
              title="Voltear para CVV"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div className="card-chip">
            <div className="chip"></div>
          </div>

          <div className="card-number">
            <input
              type="text"
              name="cardNumber"
              placeholder="•••• •••• •••• ••••"
              value={formData.cardNumber || ''}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('cardNumber')}
              onBlur={() => setFocusedField('')}
              className={`card-input number-input ${focusedField === 'cardNumber' ? 'focused' : ''} ${errors.cardNumber ? 'error' : ''}`}
              maxLength="19"
            />
          </div>

          <div className="card-info">
            <div className="card-holder">
              <label className="card-label">TITULAR DE LA TARJETA</label>
              <input
                type="text"
                name="holder"
                placeholder="NOMBRE COMPLETO"
                value={formData.holder || ''}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('holder')}
                onBlur={() => setFocusedField('')}
                className={`card-input holder-input ${focusedField === 'holder' ? 'focused' : ''} ${errors.holder ? 'error' : ''}`}
                style={{ textTransform: 'uppercase' }}
              />
            </div>

            <div className="card-expiry">
              <label className="card-label">VÁLIDO HASTA</label>
              <input
                type="text"
                name="dueDate"
                placeholder="MM/AA"
                value={formData.dueDate || ''}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('dueDate')}
                onBlur={() => setFocusedField('')}
                className={`card-input expiry-input ${focusedField === 'dueDate' ? 'focused' : ''} ${errors.dueDate ? 'error' : ''}`}
                maxLength="5"
              />
            </div>
          </div>

          <div className="card-bank">
            {formData.bank || 'SELECCIONA BANCO'}
          </div>
        </div>

        {/* Back of the card */}
        <div className="card-face card-back" style={{ background: getBankColor() }}>
          <div className="magnetic-stripe"></div>
          
          <div className="signature-panel">
            <div className="signature-label">Firma del titular</div>
            <div className="signature-area"></div>
          </div>

          <div className="cvv-section">
            <div className="cvv-label">CVV</div>
            <div className="cvv-input-wrapper">
              <input
                type="text"
                name="cvv"
                placeholder="•••"
                value={formData.cvv || ''}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('cvv')}
                onBlur={() => setFocusedField('')}
                className={`card-input cvv-input ${focusedField === 'cvv' ? 'focused' : ''} ${errors.cvv ? 'error' : ''}`}
                maxLength="4"
              />
            </div>
          </div>

          <div 
            className="flip-icon back-flip"
            onClick={onFlip}
            title="Volver al frente"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="security-features">
            <span>Esta tarjeta incorpora elementos de seguridad</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
