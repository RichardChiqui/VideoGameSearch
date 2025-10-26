import {Logger, LogLevel} from '../../../Logger/Logger'
import { publicApiClient } from '../../../utils/apiClient';

export const loadLinkRequests = async () => {
    try {
        // Use the public API client for unauthenticated access
        const response = await publicApiClient.get('/link-requests');
        
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

export const loadLinkRequestsByGame = async (gameName: string) => {
    try {
        // Use the public API client for unauthenticated access
        const response = await publicApiClient.get(`/link-requests/game/${encodeURIComponent(gameName)}`);
        
        if (response.success) {
            Logger(`Successfully loaded link requests for game: ${gameName}`, LogLevel.Info);
            return response.data;
        } else {
            Logger(`Failed to load link requests for game ${gameName}: ${response.error}`, LogLevel.Error);
            throw new Error(response.error || 'Failed to load link requests by game');
        }
    } catch (error) {
        Logger(`Failed to load link requests for game ${gameName}: ` + error, LogLevel.Error);
        throw error;
    }
};