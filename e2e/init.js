// e2e/init.js - Detox initialization for v20+
const { DetoxCircusEnvironment } = require('detox/runners/jest');

class CustomDetoxEnvironment extends DetoxCircusEnvironment {
  constructor(config, context) {
    super(config, context);
    this.initTimeout = 300000;
    this.launchApp = true;
  }

  async setupEnvironment() {
    await super.setupEnvironment();
    // Additional setup if needed
  }

  async teardownEnvironment() {
    await super.teardownEnvironment();
    // Additional cleanup if needed
  }
}

module.exports = CustomDetoxEnvironment;
