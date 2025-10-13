/**
 * Error handling utilities for user-friendly error messages
 */

export interface ApiError {
    message: string;
    statusCode?: number;
    detail?: string;
}

/**
 * Extract user-friendly error message from various error types
 */
export function getErrorMessage(error: any): string {
    // Handle axios errors
    if (error.response) {
        const status = error.response.status;
        const detail = error.response.data?.detail;

        // Custom messages for common HTTP status codes
        switch (status) {
            case 400:
                return detail || 'Invalid request. Please check your input and try again.';
            case 401:
                return 'You are not authorized. Please log in and try again.';
            case 403:
                return 'You do not have permission to perform this action.';
            case 404:
                return detail || 'The requested resource was not found.';
            case 408:
                return 'The request took too long. Please try again.';
            case 413:
                return 'The file is too large. Please upload a smaller file.';
            case 415:
                return 'Unsupported file type. Please upload a PDF file.';
            case 429:
                return 'Too many requests. Please wait a moment and try again.';
            case 500:
                return 'Our servers encountered an error. Please try again later.';
            case 502:
            case 503:
            case 504:
                return 'The service is temporarily unavailable. Please try again later.';
            default:
                return detail || `An error occurred (${status}). Please try again.`;
        }
    }

    // Handle network errors
    if (error.request && !error.response) {
        return 'Unable to connect to the server. Please check your internet connection.';
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return 'The request timed out. Please try again.';
    }

    // Handle file-specific errors
    if (error.message?.includes('PDF') || error.message?.includes('pdf')) {
        return 'There was a problem processing the PDF file. Please ensure it is a valid PDF.';
    }

    // Handle generic errors
    if (error.message) {
        return error.message;
    }

    // Fallback
    return 'An unexpected error occurred. Please try again.';
}

/**
 * Get user-friendly error title based on error type
 */
export function getErrorTitle(error: any): string {
    if (error.response) {
        const status = error.response.status;
        
        if (status >= 500) {
            return 'Server Error';
        } else if (status >= 400) {
            return 'Request Error';
        }
    }

    if (error.request && !error.response) {
        return 'Connection Error';
    }

    return 'Error';
}

/**
 * Check if error is network-related
 */
export function isNetworkError(error: any): boolean {
    return error.request && !error.response;
}

/**
 * Check if error is server-related
 */
export function isServerError(error: any): boolean {
    return error.response && error.response.status >= 500;
}

/**
 * Check if error can be retried
 */
export function isRetryableError(error: any): boolean {
    return isNetworkError(error) || isServerError(error) || 
           error.code === 'ECONNABORTED' ||
           (error.response && [408, 429, 502, 503, 504].includes(error.response.status));
}

