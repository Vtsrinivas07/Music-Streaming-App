import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${props.theme.colors.primary};
          color: white;
          &:hover {
            background: ${props.theme.colors.primaryDark};
          }
        `;
      case 'secondary':
        return `
          background: ${props.theme.colors.secondary};
          color: white;
          &:hover {
            background: ${props.theme.colors.secondaryDark};
          }
        `;
      case 'danger':
        return `
          background: ${props.theme.colors.danger};
          color: white;
          &:hover {
            background: ${props.theme.colors.dangerDark};
          }
        `;
      default:
        return `
          background: ${props.theme.colors.background};
          color: ${props.theme.colors.text};
          border: 1px solid ${props.theme.colors.border};
          &:hover {
            background: ${props.theme.colors.backgroundHover};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Button = ({ children, variant, ...props }) => {
  return (
    <StyledButton variant={variant} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button; 