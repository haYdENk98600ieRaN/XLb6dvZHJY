// 代码生成时间: 2025-10-11 02:35:22
// Import necessary Meteor packages and methods
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { HTTP } from 'meteor/http';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// Define a collection to store news articles
const NewsCollection = new Mongo.Collection('newsCollection');

// News API endpoint
const NEWS_API_ENDPOINT = 'https://newsapi.org/v2/top-headlines?';
const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with actual API key

// Function to fetch news data from the API
function fetchNews(country) {
    try {
        const url = `${NEWS_API_ENDPOINT}country=${country}&apiKey=${API_KEY}`;
        const response = HTTP.get(url);
        if (response.statusCode === 200) {
            const newsData = response.data.articles;
            NewsCollection.remove({}); // Clear existing news data
            newsData.forEach((article) => {
                NewsCollection.insert({
                    title: article.title,
                    url: article.url,
                    description: article.description,
                    source: article.source.name,
                    author: article.author,
                    publishedAt: article.publishedAt
                });
            });
        } else {
            throw new Error('Failed to fetch news data');
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
}

// Helper function to get news data from the collection
Template.news.helpers({
    news() {
        return NewsCollection.find();
    }
});

// Event handler to fetch news when the template is rendered
Template.news.onCreated(function() {
    this.autorun(() => {
        const country = this.data.country;
        if (country) {
            fetchNews(country);
        }
    });
});

// Handlebars template for displaying news articles
Template.news.events({
    // Add event handlers for user interactions
    'click .fetch-button': function(event, template) {
        const country = template.$('[name=country]').val();
        fetchNews(country);
    }
});

// Meteor method to update news data
Meteor.methods({
    updateNews(country) {
        // Check if the user is logged in
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized', 'You must be logged in to update news.');
        }
        fetchNews(country);
    }
});

// Start the Meteor app
Meteor.startup(() => {
    // Code to run on server startup
});