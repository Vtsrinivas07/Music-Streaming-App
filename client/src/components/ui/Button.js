import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ButtonBase = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 50px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  outline: none;
  
  &:focus {
    box-shadow: 0 0 0 2px rgba(255, 75, 75, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Size variants */
  &.small {
    padding: 8px 16px;
    font-size: 14px;
  }

  &.medium {
    padding: 10px 20px;
    font-size: 16px;
  }

  &.large {
    padding: 12px 24px;
    font-size: 18px;
  }

  /* Style variants */
  &.primary {
    background-color: var(--primary-color);
    color: white;

    &:hover:not(:disabled) {
      background-color: var(--primary-dark);
    }
  }

  &.secondary {
    background-color: transparent;
    color: white;
    border: 1px solid white;

    &:hover:not(:disabled) {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  &.text {
    background-color: transparent;
    color: white;
    padding: 8px;
    border-radius: 4px;

    &:hover:not(:disabled) {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  /* Icon only */
  &.icon-only {
    padding: 8px;
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }
`;

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  className,
  ...props
}) => {
  return (
    <ButtonBase
      className={`${variant} ${size} ${icon && !children ? 'icon-only' : ''} ${className || ''}`}
      {...props}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </ButtonBase>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'text']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
};

export default Button; 