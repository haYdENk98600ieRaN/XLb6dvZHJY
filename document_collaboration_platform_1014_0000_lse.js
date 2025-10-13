// 代码生成时间: 2025-10-14 00:00:37
// Import necessary Meteor packages
# 增强安全性
import { Meteor, Mongo } from 'meteor/meteor';
import { check } from 'meteor/check';
# 改进用户体验
import { Mongo } from 'meteor/mongo';

// Define a collection to store documents
const Documents = new Mongo.Collection('documents');

// Define a schema for documents
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
const DocumentSchema = new SimpleSchema({
  title: {
    type: String,
    label: 'Title'
  },
  content: {
    type: String,
    label: 'Content'
  },
# 改进用户体验
  createdAt: {
# 改进用户体验
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
# FIXME: 处理边界情况
      } else {
# 增强安全性
        this.unset();
      }
    }
  }
});

// Attach the schema to the collection
Documents.attachSchema(DocumentSchema);

// Publish all documents to the client
Meteor.publish('documents', function() {
  return Documents.find();
});

// Method to insert a new document
Meteor.methods({
  'documents.insert': function(documentData) {
    check(documentData, {
# TODO: 优化性能
      title: String,
      content: String,
    });
    // Make sure the user is logged in before inserting a document
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to create a document');
    }
    // Insert the document into the collection
    return Documents.insert({
# 优化算法效率
      title: documentData.title,
      content: documentData.content,
# 增强安全性
      createdAt: new Date(),
      owner: this.userId,
    });
  },

  // Method to update an existing document
  'documents.update': function(documentId, newDocumentData) {
    check(documentId, String);
    check(newDocumentData, {
      title: String,
      content: String,
    });
    // Make sure the user is logged in and is the owner of the document
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to update a document');
    }
    const document = Documents.findOne(documentId);
    if (document.owner !== this.userId) {
      throw new Meteor.Error('not-authorized', 'User is not authorized to update this document');
    }
    // Update the document in the collection
    return Documents.update(documentId, {
      $set: {
        title: newDocumentData.title,
        content: newDocumentData.content,
      },
    });
  },
});

// Client-side code to handle document creation and update
import './client/main.html';

// Handle the form submission for creating a new document
Template.newDocumentForm.events({
  'submit form': function(event) {
    event.preventDefault();
    // Get the form data
    const title = event.target.title.value;
    const content = event.target.content.value;
# 优化算法效率
    // Call the 'documents.insert' method and display an error if it fails
    Meteor.call('documents.insert', { title, content }, (error, result) => {
      if (error) {
        alert(error.reason);
      } else {
        alert('Document created successfully!');
        // Clear the form
# NOTE: 重要实现细节
        $('form')[0].reset();
      }
    });
# NOTE: 重要实现细节
  },
});

// Handle the form submission for updating an existing document
Template.document.events({
  'submit form': function(event, templateInstance) {
    event.preventDefault();
    // Get the document ID and form data
    const documentId = templateInstance.data._id;
    const title = event.target.title.value;
    const content = event.target.content.value;
# 增强安全性
    // Call the 'documents.update' method and display an error if it fails
    Meteor.call('documents.update', documentId, { title, content }, (error, result) => {
      if (error) {
        alert(error.reason);
      } else {
        alert('Document updated successfully!');
      }
    });
# 添加错误处理
  },
});