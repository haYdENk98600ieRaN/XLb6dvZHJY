// 代码生成时间: 2025-10-29 13:13:30
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

// Define the Monte Carlo Simulator class
class MonteCarloSimulator {
  // Constructor
  constructor(numSamples) {
    this.numSamples = numSamples;
    this.insideCircle = 0;  // Number of points inside the circle
  }

  // Method to run the simulation
  runSimulation() {
    for (let i = 0; i < this.numSamples; i++) {
      // Generate random coordinates within the square
      const x = Random.uniform(-1, 1);
      const y = Random.uniform(-1, 1);

      // Check if the point is inside the circle
      if (x * x + y * y <= 1) {
        this.insideCircle++;
      }
    }

    // Calculate the estimate of pi
    const piEstimate = 4 * (this.insideCircle / this.numSamples);
    return piEstimate;
  }
}

// Meteor method to run the simulation
Meteor.methods({
  'runMonteCarloSimulation'(numSamples) {
    check(numSamples, Number);
    if (numSamples <= 0) {
      throw new Meteor.Error('Invalid number of samples');
    }

    const simulator = new MonteCarloSimulator(numSamples);
    const piEstimate = simulator.runSimulation();
    return piEstimate;
  }
});

/*
 * Usage:
 * Meteor.call('runMonteCarloSimulation', 10000)
 * to run the simulation with 10,000 samples
 */