import React from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';

class Good extends React.Component {
  componentDidMount() {
    // Call the createNotification method with the desired type
    this.createNotification('success');
  }

  createNotification(type) {
    switch (type) {
      case 'info':
        NotificationManager.info('Info message');
        break;
      case 'success':
        NotificationManager.success('Your Inputs are correct', 'Excellent',5000, () => {
            alert('callback');
          });
        break;
      case 'warning':
        NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
        break;
      case 'error':
        NotificationManager.error('check email', 'Validate me!', 5000);
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

export default Good;
