import React from 'react';
import styles from './table.module.css';

interface TableProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Table: React.FC<TableProps> = ({ children, className, style }) => (
  <div className={styles.tableContainer}>
    <table className={`${styles.table} ${className || ''}`} style={style}>{children}</table>
  </div>
);

export const THead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className={styles.thead}>{children}</thead>
);

export const TBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody className={styles.tbody}>{children}</tbody>
);

export const TR: React.FC<{ children: React.ReactNode; onClick?: () => void; className?: string; style?: React.CSSProperties }> = ({ 
  children, 
  onClick, 
  className,
  style
}) => {
  const rowClass = `${styles.tr} ${onClick ? styles.clickable : ''} ${className || ''}`;
  return <tr className={rowClass} onClick={onClick} style={style}>{children}</tr>;
};

export const TH: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <th className={styles.th} style={style}>{children}</th>
);

export const TD: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; colSpan?: number; rowSpan?: number }> = ({ children, style, colSpan, rowSpan }) => (
  <td className={styles.td} style={style} colSpan={colSpan} rowSpan={rowSpan}>{children}</td>
);
