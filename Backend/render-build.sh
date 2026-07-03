#!/bin/bash
# This script installs Chrome on Render for Puppeteer

# Install Chrome
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list
apt-get update && apt-get install -y google-chrome-stable

# Install Node dependencies
npm install

# Install Puppeteer Chrome
npx puppeteer browsers install chrome
