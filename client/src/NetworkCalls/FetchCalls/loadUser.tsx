import {Logger, LogLevel} from '../../Logger/Logger'
import { authService } from '../../services/AuthService';

export const loadUser = async (email: string, password: string) => {
    try {
        const response = await authService.login(email, password);
        return response;
    } catch (error) {
        Logger("Failed to load User:" + email + " error:" + error, LogLevel.Error);
        throw error;
    }
};
