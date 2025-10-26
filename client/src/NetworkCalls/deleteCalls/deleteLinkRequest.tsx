import { Logger, LogLevel } from '../../Logger/Logger';
import { apiClient } from '../../utils/apiClient';

export interface DeleteLinkRequestResponse {
    success: boolean;
    error?: string;
}

export const deleteLinkRequest = async (linkRequestId: number): Promise<DeleteLinkRequestResponse> => {
    try {
        Logger(`Deleting link request with ID: ${linkRequestId}`, LogLevel.Debug);
        
        const response = await apiClient.delete(`/link-requests/${linkRequestId}`);
        
        if (response.success) {
            Logger(`Successfully deleted link request with ID: ${linkRequestId}`, LogLevel.Info);
            return {
                success: true
            };
        } else {
            Logger(`Failed to delete link request: ${response.error}`, LogLevel.Error);
            return {
                success: false,
                error: response.error || 'Failed to delete link request'
            };
        }
    } catch (error) {
        Logger(`Error deleting link request: ${error}`, LogLevel.Error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
};
