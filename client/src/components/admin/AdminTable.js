import React from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash } from 'react-icons/fa';

const TableContainer = styled.div`
  width: 100%;
  background: rgba(16, 16, 22, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.04);
  color: #8e8e93;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  white-space: nowrap;

  &:first-child {
    padding-left: 24px;
  }
  &:last-child {
    padding-right: 24px;
    text-align: right;
  }
`;

const Td = styled.td`
  padding: 14px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  color: #e1e1e6;
  font-size: 13.5px;
  font-weight: 500;
  vertical-align: middle;

  &:first-child {
    padding-left: 24px;
    font-weight: 600;
    color: #ffffff;
  }
  &:last-child {
    padding-right: 24px;
    text-align: right;
  }
`;

const Tr = styled.tr`
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.035);
  }

  &:last-child ${Td} {
    border-bottom: none;
  }
`;

const ActionButtons = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #a0a0a0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &.edit:hover {
    background: rgba(79, 172, 254, 0.18);
    color: #4facfe;
    border-color: rgba(79, 172, 254, 0.4);
    box-shadow: 0 4px 12px rgba(79, 172, 254, 0.25);
  }

  &.delete:hover {
    background: rgba(252, 60, 68, 0.18);
    color: #fc3c44;
    border-color: rgba(252, 60, 68, 0.4);
    box-shadow: 0 4px 12px rgba(252, 60, 68, 0.25);
  }
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
`;

const AdminTable = ({ columns, data, onEdit, onDelete }) => {
  if (!data || data.length === 0) {
    return (
      <TableContainer>
        <EmptyState>No records found.</EmptyState>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <Th key={index}>{column.header}</Th>
            ))}
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIdx) => (
            <Tr key={item._id || rowIdx}>
              {columns.map((column, colIdx) => (
                <Td key={colIdx}>
                  {column.render ? column.render(item) : (item[column.key] ?? '—')}
                </Td>
              ))}
              <Td>
                <ActionButtons>
                  {onEdit && (
                    <ActionButton 
                      className="edit" 
                      onClick={() => onEdit(item)}
                      title="Edit item"
                    >
                      <FaEdit />
                    </ActionButton>
                  )}
                  {onDelete && (
                    <ActionButton 
                      className="delete" 
                      onClick={() => onDelete(item)}
                      title="Delete item"
                    >
                      <FaTrash />
                    </ActionButton>
                  )}
                </ActionButtons>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default AdminTable;