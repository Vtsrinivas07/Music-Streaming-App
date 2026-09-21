import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUserPlus, FaUsers } from 'react-icons/fa';
import { getUsers, deleteUser, createUser, updateUser } from '../../services/adminService';
import AdminTable from '../../components/admin/AdminTable';
import UserModal from '../../components/admin/UserModal';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  h1 {
    font-size: 1.85rem;
    font-weight: 800;
    color: #ffffff;
    margin: 0;
    letter-spacing: -0.02em;
  }

  .badge {
    background: rgba(29, 185, 84, 0.15);
    color: var(--primary-color);
    border: 1px solid rgba(29, 185, 84, 0.3);
    font-size: 11px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
  }
`;

const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1db954 0%, #169b45 100%);
  color: #000000;
  font-weight: 700;
  font-size: 13.5px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(29, 185, 84, 0.3);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(29, 185, 84, 0.45);
  }
`;

const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${props => props.$isAdmin ? 'linear-gradient(135deg, #f5af19, #f12711)' : 'linear-gradient(135deg, #4facfe, #00f2fe)'};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 12px;
    flex-shrink: 0;
  }

  .user-name {
    font-weight: 600;
    color: #ffffff;
  }
`;

const RoleBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 6px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  display: inline-block;
  color: ${props => props.$role === 'admin' ? '#ffd700' : 'var(--primary-color)'};
  background: ${props => props.$role === 'admin' ? 'rgba(255, 215, 0, 0.12)' : 'rgba(29, 185, 84, 0.12)'};
  border: 1px solid ${props => props.$role === 'admin' ? 'rgba(255, 215, 0, 0.3)' : 'rgba(29, 185, 84, 0.25)'};
`;

const ErrorMessage = styled.div`
  color: #fc3c44;
  padding: 1rem 1.25rem;
  background: rgba(252, 60, 68, 0.1);
  border: 1px solid rgba(252, 60, 68, 0.25);
  border-radius: 10px;
  font-size: 13.5px;
`;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      try {
        await deleteUser(user._id);
        setUsers(users.filter(u => u._id !== user._id));
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user. Please try again.');
      }
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedUser) {
        const updatedUser = await updateUser(selectedUser._id, formData);
        setUsers(users.map(u => 
          u._id === selectedUser._id ? updatedUser : u
        ));
      } else {
        const newUser = await createUser(formData);
        setUsers([...users, newUser]);
      }
      setModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      throw new Error('Failed to save user. Please try again.');
    }
  };

  const columns = [
    { 
      header: 'Username', 
      key: 'username',
      render: (u) => (
        <UserCell $isAdmin={u.role === 'admin'}>
          <div className="user-avatar">
            {u.username ? u.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="user-name">{u.username}</span>
        </UserCell>
      )
    },
    { 
      header: 'Email', 
      key: 'email',
      render: (u) => <span style={{ color: '#b0b0b8', fontFamily: 'inherit' }}>{u.email}</span>
    },
    { 
      header: 'Role', 
      key: 'role',
      render: (u) => <RoleBadge $role={u.role}>{u.role === 'admin' ? '🛡️ ADMIN' : 'USER'}</RoleBadge>
    },
  ];

  if (loading) {
    return <Container><div style={{ color: 'var(--text-muted)', padding: '2rem' }}>Loading user directory...</div></Container>;
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <FaUsers style={{ color: 'var(--primary-color)', fontSize: '24px' }} />
          <h1>Users</h1>
          <span className="badge">{users.length} Active Accounts</span>
        </TitleWrapper>
        <AddButton onClick={handleCreate}>
          <FaUserPlus /> Add User
        </AddButton>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <AdminTable
        columns={columns}
        data={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {modalOpen && (
        <UserModal
          user={selectedUser}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </Container>
  );
};

export default Users;