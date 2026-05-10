import React from 'react';
import styles from './input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  onActionClick?: () => void;
  actionLabel?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, onActionClick, actionLabel = '+', icon, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.inputContainer}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <input
            id={inputId}
            ref={ref}
            className={`${styles.input} ${error ? styles.error : ''} ${onActionClick ? styles.hasAction : ''} ${icon ? styles.hasIcon : ''} ${className || ''}`}
            aria-invalid={!!error}
            {...props}
          />
          {onActionClick && (
            <button 
              type="button" 
              className={styles.actionButton} 
              onClick={onActionClick}
              title="Add New"
            >
              {actionLabel}
            </button>
          )}
        </div>
        {(error || helperText) && (
          <span className={`${styles.helperText} ${error ? styles.errorText : ''}`}>
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

