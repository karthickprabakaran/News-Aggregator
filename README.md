# News Aggregator

## Overview

The News Aggregator is a web application designed to fetch and display news articles from trusted sources. This application was developed for a hackathon and aims to provide users with the latest news from reputable outlets such as Indian Express, Economic Times, BBC Tamil, and several others. 

To enhance performance, the application caches the fetched news articles on the server for a duration of 5 minutes. This reduces redundant API calls and improves the response time for users.

## Features

- **Trusted Sources**: Aggregates news from well-known publications to ensure accuracy and reliability.
- **Caching Mechanism**: 
  - News articles are stored in the server cache for 5 minutes.
  - Reduces load on the external APIs and speeds up the user experience.
- **User-Friendly Interface**: 
  - A clean and intuitive design that allows users to easily navigate through news categories.
  - Responsive layout for optimal viewing on different devices.
- **Real-Time Updates**: 
  - Fetches the latest news articles dynamically.
  - Updates the news feed every 5 minutes, displaying the most recent articles.
- **Category Filters**: 
  - Filter news articles by categories such as Politics, Business, Technology, and more.

## Installation

To run this project locally, follow these steps:

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)

### Steps to Install

1. **Clone the repository**:
   Open your terminal and run:
   ```bash
   git clone https://github.com/yourusername/news-aggregator.git
   ```

Navigate into the project directory:
Change into the project folder:
bash


cd news-aggregator
Install dependencies:
Run the following command to install the required packages:
bash


npm install
Set up environment variables (if required):
If your application requires any API keys or environment variables, create a .env file in the root directory and add them as follows:
plaintext


npm start
Access the application:
Open your web browser and go to http://localhost:3000 to view the application.
Troubleshooting
If you encounter issues during installation, ensure that you are using a compatible version of Node.js and npm.
Check the console for any error messages and resolve them accordingly.
If you have any specific dependencies or configurations, please refer to their respective documentation.
