import React, { useEffect, CSSProperties } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Store';
import { MainFiltersEnum } from '../ENUMS';
import { loadUsers } from '../FetchCalls/loadUsers';
import './searchResultsStyles.css';

export type SearchResultsItemType = {
  id: number;
  name: string;
};

interface UserData {
  id: number;
  name: string;
  email: string;
}

interface SearchResultsProps {
  buttonClicked: boolean;
}

export default function SearchResults({ buttonClicked }: SearchResultsProps) {
  const mainFilter = useSelector((state: RootState) => state.mainfilter.value);

  const [peoplesList, setPeoplesList] = React.useState<UserData[]>([]);
  const [successFullyLoadedUsers, setSuccessFullyLoadedUsers] = React.useState(false);

  const categoriesList: SearchResultsItemType[] = [
    { id: 1, name: 'OverWatch' },
    { id: 2, name: 'Fornite' },
    { id: 3, name: 'Modern Warfare 2' },
    { id: 4, name: 'Avatar' }
  ];

  const filterValue = buttonClicked ? 'brightness(50%)' : 'brightness(100%)';

  useEffect(() => {
    if (mainFilter === MainFiltersEnum.People) {
      const fetchUsers = async () => {
        try {
          const usersData = await loadUsers();
          if (usersData.users.length > 0) {
            const formattedUsers = usersData.users.map((user: UserData) => ({
              id: user.id,
              email: user.email,
              name: user.name
            }));
            setPeoplesList(formattedUsers);
            setSuccessFullyLoadedUsers(true);
          }
        } catch (err) {
          console.log('Failed to load users:', err);
        }
      };

      fetchUsers();
    } else {
      setSuccessFullyLoadedUsers(false);
    }
  }, [mainFilter]);

  const style: CSSProperties = { filter: filterValue };
  const cardStyle: CSSProperties = { minHeight: '350px', display: 'flex', flexDirection: 'column' };
  const cardContentStyle: CSSProperties = { flex: '1' };

  return (
    <div className="container" style={style}>
      <div className="columns is-multiline">
        {successFullyLoadedUsers
          ? peoplesList.map((item: UserData) => (
              <div className="column is-one-quarter" key={item.id}>
                <div className="card" style={cardStyle}>
                  <header className="card-header">
                    <p className="card-header-title">{item.name}</p>
                  </header>
                  <div className="card-content" style={cardContentStyle}>
                    <div className="content">
                      <p>Email: {item.email}</p>
                    </div>
                  </div>
                  <footer className="card-footer">
                    <button className="button card-footer-item">Send Link Request</button>
                    <button className="button card-footer-item">Profile</button>
                  </footer>
                </div>
              </div>
            ))
          : categoriesList.map((item: SearchResultsItemType) => (
              <div className="column is-one-quarter" key={item.id}>
                <div className="card" style={cardStyle}>
                  <header className="card-header">
                    <p className="card-header-title">{item.name}</p>
                  </header>
                  <div className="card-content" style={cardContentStyle}>
                    <div className="content">
                      <p>Game: {item.name}</p>
                    </div>
                  </div>
                  <footer className="card-footer">
                    <button className="button card-footer-item">Send Link Request</button>
                    <button className="button card-footer-item">Profile</button>
                  </footer>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
