// 代码生成时间: 2025-10-15 03:22:24
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Blaze } from 'meteor/blaze';

// Define a template for the tree structure
const treeTemplate = new SimpleSchema({
  nodes: {
    type: [Object],
    optional: true,
  },
  'nodes.$': {
    type: Object,
    blackbox: true,
  },
  'nodes.$.id': {
    type: String,
  },
  'nodes.$.children': {
    type: [String],
    optional: true,
  },
});

Template.Tree.onCreated(function() {
  this.nodes = new ReactiveVar([]);
});

Template.Tree.helpers({
  // Helper to iterate over the nodes in the tree
  treeNodes: function() {
    return Template.instance().nodes.get();
  },

  // Helper to check if a node has children
  hasChildren: function() {
    return this.children && this.children.length > 0;
  },
});

Template.Tree.events({
  // Event to handle node expansion
  'click .expand': function(event, templateInstance) {
    event.preventDefault();
    const nodeId = this.id;
    const nodes = templateInstance.nodes.get();
    const index = nodes.findIndex((node) => node.id === nodeId);
    if (index !== -1) {
      nodes[index].expanded = !nodes[index].expanded;
      templateInstance.nodes.set(nodes);
    }
  },
});

Template.Tree.rendered = function() {
  // You can perform actions after the template is rendered, such as fetching data
  // For demonstration purposes, let's simulate fetching tree data
  Meteor.call('getTreeData', (error, result) => {
    if (error) {
      // Handle the error properly
      console.error('Error fetching tree data:', error);
    } else {
      // Set the fetched data as the nodes for the tree
      this.nodes.set(result);
    }
  });
};

// Define a template for an individual tree node
Template.TreeNode.helpers({
  // Helper to determine if the node is expanded
  isExpanded: function() {
    return this.expanded;
  },
});

// Define the function that will be called to fetch tree data
Meteor.methods({
  'getTreeData': function() {
    try {
      // Simulate fetching data from a collection or external API
      // For demonstration purposes, we'll return a static tree structure
      return [
        { id: '1', name: 'Root', expanded: true, children: ['2', '3'] },
        { id: '2', name: 'Branch 1', expanded: false, children: [] },
        { id: '3', name: 'Branch 2', expanded: false, children: ['4'] },
        { id: '4', name: 'Leaf', expanded: false, children: [] },
      ];
    } catch (error) {
      throw new Meteor.Error('error.fetching.tree.data', 'Failed to fetch tree data');
    }
  },
});

// Register the templates
Blaze.render(Template.Tree, document.body);
