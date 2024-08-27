import React from 'react';
import PersonIcon from '@mui/icons-material/Person';

interface BadgeProps {
  count: number;
}

const Badge: React.FC<BadgeProps> = ({ count }) => {
  return (
    <div style={{ position: 'relative' }}>
      <PersonIcon fontSize="large"/>
      {count > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            backgroundColor: 'red',
            color: 'white',
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
          }}
        >
          {count}
        </div>
      )}
    </div>
  );
};

export default Badge;
