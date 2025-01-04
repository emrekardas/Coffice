import { useEffect } from 'react';
import PropTypes from 'prop-types';

const Alert = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getAlertStyle = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-700';
      default:
        return 'bg-blue-100 border-blue-500 text-blue-700';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded border-l-4 ${getAlertStyle()}`} role="alert">
      <div className="flex items-center">
        <div className="py-1">
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-current opacity-50 hover:opacity-75 focus:outline-none"
        >
          <span className="text-2xl">&times;</span>
        </button>
      </div>
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'info']).isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

export default Alert; 