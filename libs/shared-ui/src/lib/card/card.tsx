import React from 'react';
import styles from './card.module.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}

export function Card({ className, title, subtitle, headerAction, children, ...props }: CardProps) {
  return (
    <div className={`${styles.card} ${className || ''}`} {...props}>
      {(title || subtitle || headerAction) && (
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {subtitle && <p className={styles.description}>{subtitle}</p>}
          </div>
          {headerAction && <div className={styles.actions}>{headerAction}</div>}
        </div>
      )}
      <div className={styles.body}>
        {children}
      </div>
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${styles.header} ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`${styles.title} ${className || ''}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`${styles.description} ${className || ''}`} {...props}>
      {children}
    </p>
  );
}

export function CardBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${styles.body} ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${styles.footer} ${className || ''}`} {...props}>
      {children}
    </div>
  );
}
