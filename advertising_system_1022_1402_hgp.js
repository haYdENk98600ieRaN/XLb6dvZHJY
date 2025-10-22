// 代码生成时间: 2025-10-22 14:02:22
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

// Collection to store advertisements
export const Advertisements = new Mongo.Collection('advertisements');

// Schema for advertisement data validation
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
export const AdvertisementSchema = new SimpleSchema({
  title: {
    type: String,
    label: 'Title'
  },
  description: {
    type: String,
    label: 'Description'
  },
  link: {
    type: String,
    label: 'Link',
    regEx: SimpleSchema.RegEx.Url
  },
  startTime: {
    type: Date,
    label: 'Start Time',
    optional: true
  },
  endTime: {
    type: Date,
    label: 'End Time',
    optional: true
  },
  status: {
    type: String,
    allowedValues: ['active', 'inactive', 'archived'],
    label: 'Status',
    optional: true
  }
});

// Attach the schema to the collection
Advertisements.attachSchema(AdvertisementSchema);

// Method to insert a new advertisement
Meteor.methods({
  'advertise.insert': function (advertiseData) {
    try {
      // Check if the user is logged in
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized', 'You must be logged in to create an advertisement.');
      }
      // Check if the data is valid
      AdvertisementSchema.validate(advertiseData);
      // Insert the advertisement into the database
      Advertisements.insert(advertiseData);
    } catch (error) {
      // Handle errors
      throw new Meteor.Error('advertise.insert.error', error.reason);
    }
  }
});

// Publication to publish all advertisements
Meteor.publish('allAdvertisements', function () {
  return Advertisements.find({});
});

// Example client-side code to call the method
// Assuming this is part of a larger client file, e.g., client.js
Meteor.call('advertise.insert', {
  title: 'New Ad',
  description: 'This is a new advertisement.',
  link: 'https://example.com',
  startTime: new Date(),
  endTime: new Date(new Date().getTime() + 3600000), // 1 hour from now
  status: 'active'
}, function (error, result) {
  if (error) {
    // Handle error
    console.error('Error inserting advertisement:', error);
  } else {
    // Handle success
    console.log('Advertisement inserted:', result);
  }
});