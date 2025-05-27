import toast from 'react-hot-toast';

export const useToast = () => {
    const showSuccess = (message: string) => {
        toast.success(message, {
            duration: 4000,
        });
    };

    const showError = (message: string) => {
        toast.error(message, {
            duration: 5000, // Keep errors visible a bit longer
        });
    };

    const showWarning = (message: string) => {
        toast(message, {
            icon: '⚠️',
            duration: 4000,
            style: {
                background: 'white',
                color: '#d97706',
                border: '1px solid #f59e0b',
            },
        });
    };

    const showInfo = (message: string) => {
        toast(message, {
            icon: 'ℹ️',
            duration: 4000,
            style: {
                background: 'white',
                color: '#0369a1',
                border: '1px solid #0ea5e9',
            },
        });
    };

    const showLoading = (message: string) => {
        return toast.loading(message);
    };

    const dismissToast = (toastId: string) => {
        toast.dismiss(toastId);
    };

    const dismissAll = () => {
        toast.dismiss();
    };

    // Promise-based toast for async operations
    const showPromise = <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: any) => string);
        }
    ) => {
        return toast.promise(promise, messages);
    };

    return {
        success: showSuccess,
        error: showError,
        warning: showWarning,
        info: showInfo,
        loading: showLoading,
        promise: showPromise,
        dismiss: dismissToast,
        dismissAll,
    };
};
