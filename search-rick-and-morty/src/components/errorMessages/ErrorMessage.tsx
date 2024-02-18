import React from 'react';
import './ErrorMessage.css'; // Stil dosyasının yolu

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="error-message">
      {message}
    </div>
  );
};

export default ErrorMessage;
