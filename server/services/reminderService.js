// ============================================================
// server/services/reminderService.js - Automated Reminder Scheduler
// ============================================================
import schedule from 'node-schedule';
import Reminder from '../models/Reminder.js';
import Notification from '../models/Notification.js';

export const startReminderScheduler = () => {
  console.log('⏰ Reminder service started — checking every minute');

  // Run every minute
  schedule.scheduleJob('* * * * *', async () => {
    try {
      const now = new Date();

      // ✅ Fix 8: Atomic claim — findOneAndUpdate with sent:false → sent:true in a single DB operation.
      // If two server instances run simultaneously, only ONE will get each reminder because MongoDB's
      // atomic update ensures the second instance finds 'sent' already true and skips it.
      let processed = 0;
      let reminder;
      while ((reminder = await Reminder.findOneAndUpdate(
        { reminderTime: { $lte: now }, sent: false },
        { sent: true },
        { new: false } // return the OLD document (before update) to get the original data
      ).populate('user', 'name email').populate('event', 'title date')) !== null) {

        try {
          await Notification.create({
            user: reminder.user._id,
            title: '⏰ Event Reminder',
            message: reminder.message || `Reminder: ${reminder.event?.title || 'Your event'} is coming up!`,
            channel: 'in-app',
            isRead: false,
          });

          processed++;
          console.log(`✅ Reminder sent to ${reminder.user?.name || reminder.user}`);
        } catch (innerError) {
          // If notification creation fails, revert sent flag so it will be retried next minute
          await Reminder.findByIdAndUpdate(reminder._id, { sent: false });
          console.error(`❌ Failed to notify for reminder ${reminder._id}:`, innerError.message);
        }
      }

      if (processed > 0) {
        console.log(`⏰ Processed ${processed} reminder(s)`);
      }

    } catch (error) {
      console.error('❌ Reminder service error:', error.message);
    }
  });
};
