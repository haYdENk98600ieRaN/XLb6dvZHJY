// 代码生成时间: 2025-10-19 05:31:58
#!/usr/bin/env node

// agriculture_iot_meteor.js

// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Mongo } from 'meteor/mongo';

// Define a MongoDB collection for storing sensor data
export const SensorData = new Mongo.Collection('sensorData');

// Define a schema for sensor data
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
export const SensorDataSchema = new SimpleSchema({
  temperature: {
    type: Number,
    label: 'Temperature',
    optional: true,
  },
  humidity: {
    type: Number,
    label: 'Humidity',
    optional: true,
  },
  timestamp: {
    type: Date,
    label: 'Timestamp',
    autoValue: () => {
      return new Date();
    },
  },
  location: {
    type: String,
    label: 'Location',
    optional: true,
  },
  // Add other sensor data fields as needed
});

// Attach schema to sensor data collection
SensorData.attachSchema(SensorDataSchema);

// Method to insert sensor data into the database
Meteor.methods({
  'insertSensorData': function(sensorData) {
    // Simple schema validation
    SensorDataSchema.validate(sensorData);
    // Check if the user is logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'User must be logged in');
    }
    // Insert the sensor data into the database
    return SensorData.insert(sensorData);
  },
});

// Example of how to fetch data from a sensor API (placeholder)
Meteor.startup(() => {
  // This is a placeholder function to simulate fetching data from a sensor
  // In a real-world scenario, you would replace this with actual API calls
  const fetchSensorData = () => {
    // Simulated sensor data
    const sensorData = {
      temperature: 22,
      humidity: 60,
      location: 'Greenhouse 1',
    };
    // Insert the sensor data into the database
    Meteor.call('insertSensorData', sensorData, (error, result) => {
      if (error) {
        console.error('Error inserting sensor data:', error);
      } else {
        console.log('Sensor data inserted:', result);
      }
    });
  };

  // Schedule the function to run at regular intervals (e.g., every 10 minutes)
  Meteor.setInterval(fetchSensorData, 600000);
});

// Define a publication for accessing sensor data
Meteor.publish('sensorData', function() {
  // Return the cursor to the client
  return SensorData.find();
});

// Define a publication for accessing sensor data for a specific location
Meteor.publish('sensorDataByLocation', function(location) {
  // Check if location is provided
  if (!location) {
    throw new Meteor.Error('invalid-location', 'Location must be provided');
  }
  // Return the cursor for the specified location
  return SensorData.find({ location: location });
});

// Define a publication for accessing recent sensor data
Meteor.publish('recentSensorData', function(limit) {
  // Check if limit is provided and is a number
  if (!limit || isNaN(limit)) {
    throw new Meteor.Error('invalid-limit', 'Limit must be a number');
  }
  // Return the most recent sensor data
  return SensorData.find({}, { sort: { timestamp: -1 }, limit: limit });
});