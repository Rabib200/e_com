export interface ErrorWithResponse {
    response?: {
        status?: number;
        data?: {
            error?: string;
        };
    };
    message?: string;
}
