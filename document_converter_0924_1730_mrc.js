// 代码生成时间: 2025-09-24 17:30:51
// Meteor core packages
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// External libraries
import Papa from 'papaparse'; // For parsing CSV files
import xlsx from 'xlsx'; // For handling Excel files

// Define the DocumentConverter class
class DocumentConverter {
  // Constructor for the DocumentConverter class
  constructor() {
    this.sourceFile = null;
    this.targetFormat = null;
    this.result = new ReactiveVar(null);
  }

  // Method to set the source file
  setSourceFile(file) {
    this.sourceFile = file;
  }

  // Method to set the target format
  setTargetFormat(format) {
    this.targetFormat = format;
  }

  // Method to convert the document
  convertDocument() {
    if (!this.sourceFile || !this.targetFormat) {
      throw new Error('Source file and target format are required.');
    }

    // Handle different file types and conversion logic
    switch (this.sourceFile.type) {
      case 'text/csv':
        return this.convertCSV();
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return this.convertExcel();
      default:
        throw new Error('Unsupported file type.');
    }
  }

  // Convert CSV to another format (example: JSON)
  convertCSV() {
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target.result;
      const parsedData = Papa.parse(csvData, { header: true });
      this.result.set(parsedData.data);
    };
    reader.readAsText(this.sourceFile);
  }

  // Convert Excel to another format (example: JSON)
  convertExcel() {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = xlsx.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);
      this.result.set(jsonData);
    };
    reader.readAsBinaryString(this.sourceFile);
  }
}

// Meteor methods
Meteor.methods({
  'documentConverter.convert': function (file, targetFormat) {
    const converter = new DocumentConverter();
    converter.setSourceFile(file);
    converter.setTargetFormat(targetFormat);
    try {
      const result = converter.convertDocument();
      return {
        success: true,
        data: converter.result.get()
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
});

// Client-side template
Template.documentConverter.helpers({
  result() {
    return Template.instance().data.result.get();
  }
});

// Client-side template events
Template.documentConverter.events({
  'submit #convertForm': function (event, templateInstance) {
    event.preventDefault();
    const fileInput = event.target.file.files[0];
    const targetFormat = event.target.format.value;
    Meteor.call('documentConverter.convert', fileInput, targetFormat, (error, result) => {
      if (error) {
        console.error('Conversion error:', error);
      } else if (result.success) {
        templateInstance.data.result.set(result.data);
      } else {
        console.error('Conversion error:', result.message);
      }
    });
  }
});