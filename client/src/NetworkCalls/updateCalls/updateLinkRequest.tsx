import { Logger, LogLevel } from '../../Logger/Logger';
import { apiClient } from '../../utils/apiClient';
import { CreateLinkRequestData, LinkRequestResponse } from '../../models/LinkRequest';

export const updateLinkRequest = async (linkRequestId: number, linkRequestData: CreateLinkRequestData): Promise<LinkRequestResponse> => {
    try {
        const response = await apiClient.put(`/link-requests/${linkRequestId}`, linkRequestData);
        
        if (response.success) {
            Logger(`Successfully updated link request ${linkRequestId} for game: ${linkRequestData.game_name}`, LogLevel.Info);
            return {
                success: true,
                data: response.data
            };
        } else {
            Logger(`Failed to update link request: ${response.error}`, LogLevel.Error);
            return {
                success: false,
                error: response.error || 'Failed to update link request'
            };
        }
    } catch (error) {
        Logger("Failed to update link request: " + error, LogLevel.Error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error'
        };
    }
};

