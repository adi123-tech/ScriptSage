import React from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';

class Password_Validations extends React.Component {
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
        NotificationManager.error('check password', 'Validate me!', 5000, () => {
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

export default Password_Validations;
