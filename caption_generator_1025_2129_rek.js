// 代码生成时间: 2025-10-25 21:29:01
// Import Meteor and necessary libraries
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// Create a new Meteor method to generate captions
Meteor.methods({
  'generateCaption': function(text) {
    // Check if the user is logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to generate captions.');
    }
    
    // Implement your logic to generate caption based on text
    // This is a placeholder logic - replace it with your real logic
    let caption = `Caption for your text: ${text}`;
    return caption;
  }
});

// Create a template for the caption generator form
Template.captionGenerator.onCreated(function() {
  // Initialize a reactive variable to store the caption
  this.caption = new ReactiveVar('');
});

Template.captionGenerator.helpers({
  'caption': function() {
    // Return the current caption
    return Template.instance().caption.get();
  }
});

Template.captionGenerator.events({
  'submit form': function(event, instance) {
    // Prevent default form submit behavior
    event.preventDefault();
    
    // Get the text from the input field
    const text = event.target.text.value.trim();
    
    // Check if text is not empty
    if (text) {
      // Call the Meteor method to generate the caption
      Meteor.call('generateCaption', text, function(error, result) {
        // Handle errors
        if (error) {
          console.error('Error generating caption:', error);
        } else {
          // Update the caption reactive variable
          instance.caption.set(result);
        }
      });
    } else {
      // Show an error message if text is empty
      console.error('Please enter some text to generate a caption.');
    }
  }
});

// Create a template for displaying the generated caption
Template.displayCaption.helpers({
  'displayCaption': function() {
    // Return the caption from the parent template
    return Template.parentData(1).caption;
  }
});