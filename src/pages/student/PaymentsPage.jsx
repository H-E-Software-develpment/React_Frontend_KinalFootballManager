import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../../services/paymentService.js';
import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import './PaymentsPage.css';

const PaymentsPage = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentService.findPayments();
      setPayments(response.payment || []);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayment = async (pid, cardNumber) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la tarjeta terminada en ${cardNumber.slice(-4)}?`)) {
      try {
        setLoading(true);
        await paymentService.deletePayment(pid);
        setSuccess('Método de pago eliminado correctamente');
        await fetchPayments();
      } catch (error) {
        setErrors({ general: error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  const getCardIcon = (cardType) => {
    if (cardType === 'VISA') {
      return (
        <div className="card-brand visa">
          <span>VISA</span>
        </div>
      );
    } else if (cardType === 'MASTERCARD') {
      return (
        <div className="card-brand mastercard">
          <div className="circle red"></div>
          <div className="circle yellow"></div>
        </div>
      );
    }
    return (
      <div className="card-brand unknown">
        <span>💳</span>
      </div>
    );
  };

  const getBankColor = (bank) => {
    const bankColors = {
      'GYT CONTINENTAL': '#1e3a8a',
      'BANCO INDUSTRIAL': '#ea580c',
      'BANRURAL': '#22c55e',
      'BAC': '#dc2626',
      'BANCO PROMERICA': '#7c3aed',
      'BAM': '#0891b2',
      'FICOHSA': '#b91c1c'
    };
    return bankColors[bank] || '#6b7280';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="payments-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Métodos de Pago</h1>
          <p>Gestiona tus tarjetas de débito y crédito</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/add-payment')}
          className="add-payment-btn"
        >
          + Agregar Tarjeta
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

      <div className="payments-content">
        {loading ? (
          <div className="loading-container">
            <LoadingSpinner size="large" />
            <p>Cargando métodos de pago...</p>
          </div>
        ) : (
          <>
            {payments.length === 0 ? (
              <Card className="empty-state">
                <div className="empty-content">
                  <div className="empty-icon">💳</div>
                  <h3>No tienes métodos de pago registrados</h3>
                  <p>Agrega tu primera tarjeta para comenzar a realizar pagos de forma segura.</p>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/add-payment')}
                    className="empty-action-btn"
                  >
                    Agregar Primera Tarjeta
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="payments-grid">
                {payments.map(payment => (
                  <Card key={payment.pid} className="payment-card">
                    <div className="mini-card" style={{ borderColor: getBankColor(payment.bank) }}>
                      <div className="mini-card-header">
                        {getCardIcon(payment.card)}
                        <div className="card-type-badge" style={{ backgroundColor: getBankColor(payment.bank) }}>
                          {payment.type === 'DEBIT' ? 'Débito' : 'Crédito'}
                        </div>
                      </div>
                      
                      <div className="mini-card-number">
                        {payment.cardNumber}
                      </div>
                      
                      <div className="mini-card-info">
                        <div className="card-holder-mini">
                          <span className="card-label-mini">TITULAR</span>
                          <span className="card-value-mini">{payment.holder}</span>
                        </div>
                        <div className="card-expiry-mini">
                          <span className="card-label-mini">VÁLIDO HASTA</span>
                          <span className="card-value-mini">
                            {formatDate(payment.dueDate).replace(' de ', '/').replace(' del ', '/')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mini-card-bank">
                        {payment.bank}
                      </div>
                    </div>

                    <div className="payment-details">
                      <div className="payment-info">
                        <h4>Tarjeta {payment.type === 'DEBIT' ? 'de Débito' : 'de Crédito'}</h4>
                        <p><strong>Banco:</strong> {payment.bank}</p>
                        <p><strong>Tipo de tarjeta:</strong> {payment.card}</p>
                        <p><strong>Registrada:</strong> {new Date(payment.createdAt).toLocaleDateString()}</p>
                      </div>
                      
                      <div className="payment-actions">
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => handleDeletePayment(payment.pid, payment.cardNumber)}
                          disabled={loading}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="security-notice">
        <div className="security-icon">🔒</div>
        <div className="security-text">
          <h4>Seguridad de tus datos</h4>
          <p>Tu información financiera está protegida con encriptación de grado bancario. Los números de tarjeta se almacenan de forma segura y solo se muestran los últimos 4 dígitos.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
