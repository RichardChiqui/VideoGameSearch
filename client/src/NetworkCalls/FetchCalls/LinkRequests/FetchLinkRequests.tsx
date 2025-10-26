import {Logger, LogLevel} from '../../../Logger/Logger'
import { apiClient } from '../../../utils/apiClient';

export const loadLinkRequests = async () => {
    try {
        // Use the authenticated API client
        const response = await apiClient.get('/link-requests');
        
        if (response.success) {
            Logger("Successfully loaded all link requests", LogLevel.Info);
            return response.data;
        } else {
            Logger(`Failed to load all link requests: ${response.error}`, LogLevel.Error);
            throw new Error(response.error || 'Failed to load link requests');
        }
    } catch (error) {
        Logger("Failed to load all link requests: " + error, LogLevel.Error);
        throw error;
    }
};
