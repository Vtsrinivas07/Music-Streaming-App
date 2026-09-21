import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
`;

const HomeLink = styled(Link)`
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 1rem;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <Title>404</Title>
      <Message>Oops! The page you're looking for doesn't exist.</Message>
      <HomeLink to="/">Go Back Home</HomeLink>
    </NotFoundContainer>
  );
};

export default NotFound; 