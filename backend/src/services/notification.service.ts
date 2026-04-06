import EventEmitter from 'events';

class NotificationService extends EventEmitter {
  constructor() {
    super();
    this.setupListeners();
  }

  private setupListeners() {
    this.on('lister.approved', (data: { email: string; name: string }) => {
      // Setup Nodemailer logic here eventually
      console.log(`\n📧 [EMAIL SENT]: To ${data.email}`);
      console.log(`Subject: Application Approved`);
      console.log(`Body: Hello ${data.name}, your lister application has been approved! You can now list properties on Rentlee.\n`);
    });

    this.on('lister.rejected', (data: { email: string; name: string; reason: string }) => {
      console.log(`\n📧 [EMAIL SENT]: To ${data.email}`);
      console.log(`Subject: Application Rejected`);
      console.log(`Body: Hello ${data.name}, unfortunately your lister application was rejected. Reason: ${data.reason}\n`);
    });
  }

  notifyApproval(email: string, name: string) {
    this.emit('lister.approved', { email, name });
  }

  notifyRejection(email: string, name: string, reason: string) {
    this.emit('lister.rejected', { email, name, reason });
  }
}

export default new NotificationService();
