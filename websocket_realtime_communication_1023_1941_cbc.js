// 代码生成时间: 2025-10-23 19:41:12
import { Meteor } from 'meteor/meteor';
import { WebSocketServer } from 'meteor/sockjs';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Define a collection to store messages
const Messages = new Mongo.Collection('messages');

// Define WebSocket server
const webSocketServer = new WebSocketServer({
  noServer: true,
  path: '/websocket',
  heartBeatInterval: Meteor.settings.public.heartBeatInterval || 10000,
  heartbeatTimeout: Meteor.settings.public.heartbeatTimeout || 15000
});

// Connect to WebSocket server
Meteor.connect = webSocketServer.on('connection', socket => {
  // Handle new message event
  socket.on('message', (message) => {
    try {
      // Validate message format
      check(message, String);

      // Insert message into the collection
      Messages.insert({ message: message, createdAt: new Date() });

      // Broadcast message to all connected clients
      webSocketServer.broadcast(message);
    } catch (error) {
      console.error('Invalid message format:', error.message);
      // Send error message back to the client
      socket.write('Invalid message format');
    }
  });

  // Handle disconnect event
  socket.on('close', () => {
    console.log('Client disconnected');
  });

  // Handle error event
  socket.on('error', (error) => {
    console.error('WebSocket error:', error.message);
  });
});

// Publish messages collection to the client
Meteor.publish('messages', function () {
  return Messages.find({});
});

// Create a method to send a message
Meteor.methods({
  'send': function (message) {
    check(message, String);
    // Insert message into the collection
    Messages.insert({ message: message, createdAt: new Date() });
    // Broadcast message to all connected clients
    webSocketServer.broadcast(message);
  }
});

// Client-side code to connect to WebSocket server and send messages
Meteor.startup(() => {
  // Connect to WebSocket server
  const socket = new WebSocket('ws://localhost:3000/websocket');

  socket.onopen = () => {
    console.log('Connected to WebSocket server');
  };

  socket.onmessage = (event) => {
    // Handle received message
    console.log('Received message:', event.data);
  };

  socket.onclose = () => {
    console.log('Disconnected from WebSocket server');
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error.message);
  };

  // Send message on click event
  document.getElementById('send').addEventListener('click', () => {
    const message = document.getElementById('message').value;
    if (message.trim()) {
      socket.send(message);
      // Call Meteor method to send message
      Meteor.call('send', message, (error) => {
        if (error) {
          console.error('Error sending message:', error.message);
        }
      });
    }
  });
});