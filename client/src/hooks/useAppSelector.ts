// hooks/useAppSelector.ts
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../Store';

export const useAppSelectors = () => {
  const mainFilter = useSelector((state: RootState) => state.mainfilter.value);
  const numofNotifications = useSelector((state: RootState) => state.notifications.value);
  const userLoggedIn = useSelector((state: RootState) => state.user.isAuthenticated);
  const dispatch = useDispatch();

  return {
    mainFilter,
    numofNotifications,
    userLoggedIn,
    dispatch
  };
};