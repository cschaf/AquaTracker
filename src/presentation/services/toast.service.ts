import toast from 'react-hot-toast';

const toastOptions = {
  style: {
    padding: '16px',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  success: {
    style: {
      background: 'var(--color-bg-primary)',
      color: 'var(--color-text-primary)',
    },
    iconTheme: {
      primary: 'var(--color-success)',
      secondary: 'var(--color-text-on-primary)',
    },
  },
  error: {
    style: {
      background: 'var(--color-warning)',
      color: 'var(--color-text-on-primary)',
    },
    iconTheme: {
      primary: 'var(--color-text-on-primary)',
      secondary: 'var(--color-warning)',
    },
  },
};

export const showSuccess = (message: string) => {
  toast.success(message, toastOptions.success);
};

export const showError = (message: string) => {
  toast.error(message, toastOptions.error);
};

export const showWarning = (message: string) => {
  toast(message, {
    icon: '⚠️',
    style: {
      ...toastOptions.style,
      background: 'var(--color-bg-secondary)',
      color: 'var(--color-text-primary)',
    },
  });
};

export const showInfo = (message: string) => {
  toast(message, {
    icon: 'ℹ️',
    style: {
      ...toastOptions.style,
      background: 'var(--color-bg-secondary)',
      color: 'var(--color-text-primary)',
    },
  });
};
