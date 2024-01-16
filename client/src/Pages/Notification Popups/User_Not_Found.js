import React from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';

class User_Not_Found extends React.Component {
  componentDidMount() {
    // Call the createNotification method with the desired type
    this.createNotification('error');
  }

  createNotification(type) {
    switch (type) {
      case 'info':
        NotificationManager.info('Info message');
        break;
      case 'success':
        NotificationManager.success('Success message', 'Title here');
        break;
      case 'warning':
        NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
        break;
      case 'error':
        NotificationManager.error('User Not Found', 'Check Email!', 5000, () => {
          alert('callback');
        });
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div>
        <NotificationContainer />
      </div>
    );
  }
}

export default User_Not_Found;
