export default class NotificationUtil {
    static show(message: string) {
      // Check if the browser supports notifications
      if (!("Notification" in window)) {
        console.log("This browser does not support desktop notifications");
        return;
      }
  
      // Check if permission has been granted
      if (Notification.permission === "granted") {
        this.createNotification(message);
      } else if (Notification.permission !== "denied") {
        // Otherwise, request permission from the user
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            this.createNotification(message);
          }
        });
      }
    }
  
    static createNotification(message: string) {
      // Create a new notification
      new Notification("New Message", {
        body: message,
      });
    }
  }
