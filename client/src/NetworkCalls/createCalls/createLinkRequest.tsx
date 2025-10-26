import { Logger, LogLevel } from '../../Logger/Logger';
import { apiClient } from '../../utils/apiClient';
import { CreateLinkRequestData, LinkRequestResponse } from '../../models/LinkRequest';

export const createLinkRequest = async (linkRequestData: CreateLinkRequestData): Promise<LinkRequestResponse> => {
    try {
        const response = await apiClient.post('/link-requests', linkRequestData);
        
        if (response.success) {
            Logger("Successfully created link request for game: " + linkRequestData.game_name, LogLevel.Info);
            return {
                success: true,
                data: response.data
            };
        } else {
            Logger(`Failed to create link request: ${response.error}`, LogLevel.Error);
            return {
                success: false,
                error: response.error || 'Failed to create link request'
            };
        }
    } catch (error) {
        Logger("Failed to create link request: " + error, LogLevel.Error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error'
        };
    }
};
