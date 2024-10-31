import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from '../redux/websiteSlice';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const getIcon = (type) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'error':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    default:
      return <Info className="w-5 h-5 text-blue-500" />;
  }
};

const getBackgroundColor = (type) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200';
    case 'error':
      return 'bg-red-50 border-red-200';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200';
    default:
      return 'bg-blue-50 border-blue-200';
  }
};

const Popup = () => {
  const dispatch = useDispatch();
  const { notifications, isPopupVisible } = useSelector((state) => state.website);

  useEffect(() => {
    notifications.forEach(notification => {
      const timer = setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, notification.duration);

      return () => clearTimeout(timer);
    });
  }, [notifications, dispatch]);

  if (!isPopupVisible) return null;

  return (
    <div className="fixed top-2 right-2 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getBackgroundColor(notification.type)} 
            border rounded-lg shadow-lg 
            transform transition-all duration-500 ease-in-out
            max-w-sm w-full p-4
            flex items-start gap-3`}
        >
          {getIcon(notification.type)}
          <div className="flex-1">
            <p className="text-sm text-gray-800">{notification.message}</p>
          </div>
          <button
            onClick={() => dispatch(removeNotification(notification.id))}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Popup;

