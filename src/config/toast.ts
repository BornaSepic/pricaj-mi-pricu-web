import type { ToasterProps } from 'react-hot-toast'

export const toastConfig: ToasterProps = {
    position: "top-center",
    gutter: 8,
    toastOptions: {
        duration: 4000,
        style: {
            background: 'white',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            fontSize: '14px',
            fontWeight: '500',
        },
        success: {
            style: {
                background: 'white',
                color: '#059669',
                border: '1px solid #10b981',
            },
            iconTheme: {
                primary: '#10b981',
                secondary: 'white',
            },
        },
        error: {
            style: {
                background: 'white',
                color: 'var(--primary-color, #D3302F)',
                border: '1px solid var(--primary-color, #D3302F)',
            },
            iconTheme: {
                primary: 'var(--primary-color, #D3302F)',
                secondary: 'white',
            },
        },
        loading: {
            style: {
                background: 'white',
                color: '#6b7280',
                border: '1px solid #d1d5db',
            },
        },
    }
}
