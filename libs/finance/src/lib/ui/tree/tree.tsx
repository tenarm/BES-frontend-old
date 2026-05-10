import React, { useState } from 'react';
import styles from './tree.module.css';

export interface TreeItemData {
  id: string;
  label: string;
  children?: TreeItemData[];
  [key: string]: any;
}

interface TreeProps {
  items: TreeItemData[];
  renderItem?: (item: TreeItemData) => React.ReactNode;
  onItemClick?: (item: TreeItemData) => void;
  defaultExpanded?: boolean;
}

const TreeItem: React.FC<{
  item: TreeItemData;
  renderItem?: (item: TreeItemData) => React.ReactNode;
  onItemClick?: (item: TreeItemData) => void;
  defaultExpanded?: boolean;
}> = ({ item, renderItem, onItemClick, defaultExpanded }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || false);
  const hasChildren = item.children && item.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleClick = () => {
    if (onItemClick) {
      onItemClick(item);
    } else if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className={styles.treeNode}>
      <div className={styles.treeItem} onClick={handleClick}>
        {hasChildren ? (
          <div 
            className={`${styles.toggleIcon} ${isExpanded ? styles.toggleIconExpanded : ''}`}
            onClick={handleToggle}
          >
            ▶
          </div>
        ) : (
          <div className={styles.toggleIcon} style={{ visibility: 'hidden' }}>▶</div>
        )}
        <div className={styles.content}>
          {renderItem ? renderItem(item) : <span className={styles.label}>{item.label}</span>}
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div className={styles.tree}>
          {item.children?.map((child) => (
            <TreeItem 
              key={child.id} 
              item={child} 
              renderItem={renderItem} 
              onItemClick={onItemClick}
              defaultExpanded={defaultExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Tree: React.FC<TreeProps> = ({ items, renderItem, onItemClick, defaultExpanded }) => {
  return (
    <div className={styles.tree}>
      {items.map((item) => (
        <TreeItem 
          key={item.id} 
          item={item} 
          renderItem={renderItem} 
          onItemClick={onItemClick}
          defaultExpanded={defaultExpanded}
        />
      ))}
    </div>
  );
};
