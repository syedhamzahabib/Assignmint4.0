// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');

admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

// Helper function to send FCM notification
async function sendNotification(userId, title, body, data = {}) {
  try {
    // Get user's FCM token
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return;
    
    const userData = userDoc.data();
    if (!userData.fcmToken) return;
    
    const message = {
      token: userData.fcmToken,
      notification: {
        title,
        body,
      },
      data: {
        ...data,
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
    };
    
    await messaging.send(message);
    console.log('Notification sent to user:', userId);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

// Trigger when a new task is created
exports.onTaskCreated = functions.firestore
  .document('tasks/{taskId}')
  .onCreate(async (snap, context) => {
    const task = snap.data();
    const taskId = context.params.taskId;
    
    console.log('New task created:', taskId);
    
    // Send notification to all users (in a real app, you'd filter by preferences)
    try {
      await sendNotification(
        'all', // This would be a special user ID for broadcast
        'New Task Available!',
        `A new ${task.subject} task has been posted: ${task.title}`,
        {
          taskId,
          type: 'newTask',
          subject: task.subject,
        }
      );
    } catch (error) {
      console.error('Error sending task notification:', error);
    }
  });

// Trigger when a task is accepted
exports.onTaskAccepted = functions.firestore
  .document('tasks/{taskId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const taskId = context.params.taskId;
    
    // Check if task was just accepted
    if (before.status === 'open' && after.status === 'in_progress' && after.completedBy) {
      console.log('Task accepted:', taskId);
      
      try {
        // Send notification to task creator
        await sendNotification(
          after.createdBy,
          'Task Accepted!',
          `${after.completedByName} has accepted your task: ${after.title}`,
          {
            taskId,
            type: 'taskAccepted',
            completedBy: after.completedBy,
          }
        );
        
        // Create notification document
        await db.collection('notifications').add({
          userId: after.createdBy,
          type: 'taskAccepted',
          title: 'Task Accepted!',
          body: `${after.completedByName} has accepted your task: ${after.title}`,
          taskId,
          fromUserId: after.completedBy,
          isRead: false,
          createdAt: FieldValue.serverTimestamp(),
        });
      } catch (error) {
        console.error('Error sending task accepted notification:', error);
      }
    }
  });

// Trigger when a task is completed
exports.onTaskCompleted = functions.firestore
  .document('tasks/{taskId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const taskId = context.params.taskId;
    
    // Check if task was just completed
    if (before.status === 'in_progress' && after.status === 'completed') {
      console.log('Task completed:', taskId);
      
      try {
        // Send notification to task creator
        await sendNotification(
          after.createdBy,
          'Task Completed!',
          `${after.completedByName} has completed your task: ${after.title}`,
          {
            taskId,
            type: 'taskCompleted',
            completedBy: after.completedBy,
          }
        );
        
        // Create notification document
        await db.collection('notifications').add({
          userId: after.createdBy,
          type: 'taskCompleted',
          title: 'Task Completed!',
          body: `${after.completedByName} has completed your task: ${after.title}`,
          taskId,
          fromUserId: after.completedBy,
          isRead: false,
          createdAt: FieldValue.serverTimestamp(),
        });
        
        // Update user statistics
        await db.collection('users').doc(after.completedBy).update({
          tasksCompleted: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp(),
        });
        
        await db.collection('users').doc(after.createdBy).update({
          tasksPosted: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp(),
        });
      } catch (error) {
        console.error('Error sending task completed notification:', error);
      }
    }
  });

// Trigger when a new message is sent
exports.onMessageSent = functions.firestore
  .document('chats/{chatId}/messages/{messageId}')
  .onCreate(async (snap, context) => {
    const message = snap.data();
    const chatId = context.params.chatId;
    const messageId = context.params.messageId;
    
    console.log('New message sent:', messageId);
    
    try {
      // Get chat data
      const chatDoc = await db.collection('chats').doc(chatId).get();
      if (!chatDoc.exists) return;
      
      const chat = chatDoc.data();
      
      // Send notification to other participants
      for (const participantId of chat.participants) {
        if (participantId !== message.senderId) {
          await sendNotification(
            participantId,
            `New message from ${message.senderName}`,
            message.text,
            {
              chatId,
              messageId,
              type: 'messageReceived',
              senderId: message.senderId,
            }
          );
          
          // Create notification document
          await db.collection('notifications').add({
            userId: participantId,
            type: 'messageReceived',
            title: `New message from ${message.senderName}`,
            body: message.text,
            chatId,
            fromUserId: message.senderId,
            isRead: false,
            createdAt: FieldValue.serverTimestamp(),
          });
        }
      }
    } catch (error) {
      console.error('Error sending message notification:', error);
    }
  });

// Trigger when a new notification is created
exports.onNotificationCreated = functions.firestore
  .document('notifications/{notificationId}')
  .onCreate(async (snap, context) => {
    const notification = snap.data();
    const notificationId = context.params.notificationId;
    
    console.log('New notification created:', notificationId);
    
    // The actual FCM sending is handled by the message triggers above
    // This function can be used for additional processing if needed
  });

// HTTP function to send test notifications
exports.sendTestNotification = functions.https.onRequest(async (req, res) => {
  try {
    const { userId, title, body, data } = req.body;
    
    if (!userId || !title || !body) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    await sendNotification(userId, title, body, data);
    
    res.json({ success: true, message: 'Notification sent' });
  } catch (error) {
    console.error('Error in sendTestNotification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// HTTP function to get user statistics
exports.getUserStats = functions.https.onRequest(async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userData = userDoc.data();
    
    // Get additional statistics
    const tasksCreated = await db.collection('tasks')
      .where('createdBy', '==', userId)
      .get();
    
    const tasksCompleted = await db.collection('tasks')
      .where('completedBy', '==', userId)
      .get();
    
    const stats = {
      tasksCreated: tasksCreated.size,
      tasksCompleted: tasksCompleted.size,
      totalEarnings: userData.totalEarnings || 0,
      rating: userData.rating || 0,
      trustScore: userData.trustScore || 0,
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error in getUserStats:', error);
    res.status(500).json({ error: 'Failed to get user statistics' });
  }
});
