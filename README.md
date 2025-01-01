# News Aggregator

## Overview
![WhatsApp Image 2025-01-01 at 10 04 17_4261dff6](https://github.com/user-attachments/assets/7e1eeca3-e640-4cc2-b24c-b5377d6c64c1)

The News Aggregator is a web application designed to fetch and display news articles from trusted sources. This application was developed for a hackathon and aims to provide users with the latest news from reputable outlets such as Indian Express, Economic Times, BBC Tamil, and several others.

To enhance performance, the application caches the fetched news articles on the server for a duration of 5 minutes. This reduces redundant API calls and improves the response time for users.

---

## Features

### Trusted Sources
Aggregates news from well-known publications to ensure accuracy and reliability.

### Caching Mechanism
- News articles are stored in the server cache for 5 minutes.
- Reduces load on the external APIs and speeds up the user experience.

### User-Friendly Interface
- A clean and intuitive design that allows users to easily navigate through news categories.
- Responsive layout for optimal viewing on different devices.

### Real-Time Updates
- Fetches the latest news articles dynamically.
- Updates the news feed every 5 minutes, displaying the most recent articles.

### Category Filters
- Filter news articles by categories such as Politics, Business, Technology, and more.

---
![WhatsApp Image 2025-01-01 at 10 04 17_1e863b7e](https://github.com/user-attachments/assets/0c4a6ba9-5203-4e17-aa88-29cfaaa80ba0)

## Installation

To run this project locally, follow these steps:

### Prerequisites

Make sure you have the following installed on your machine:
- *Node.js* (v14 or higher)
- *npm* (comes with Node.js)

### Steps to Install

#### 1. Clone the Repository
Open your terminal and run:
bash
git clone https://github.com/yourusername/news-aggregator.git


Navigate into the project directory:
bash
cd news-aggregator


#### 2. Install Dependencies
Run the following command to install the required packages:
bash
npm install


#### 3. Set Up Environment Variables (if required)
If your application requires any API keys or environment variables, create a .env file in the root directory and add them as follows:
plaintext
API_KEY=your_api_key_here


#### 4. Start the Application
Run the following command to start the application:
bash
npm start


#### 5. Access the Application
Open your web browser and go to [http://localhost:3000](http://localhost:3000) to view the application.

---

## Troubleshooting

If you encounter issues during installation:

- *Node.js and npm Compatibility*: Ensure that you are using a compatible version of Node.js and npm. Run node -v and npm -v to check the installed versions.

- *Error Messages*: Check the console for any error messages. For example:
  - MODULE_NOT_FOUND: Indicates missing dependencies. Try running npm install again.
  - PORT IN USE: Ensure no other application is using port 3000. You can specify a different port in the .env file (e.g., PORT=4000).

- *Dependency Issues*: If specific dependencies are causing issues, delete the node_modules folder and package-lock.json file, then reinstall dependencies:
  bash
  rm -rf node_modules package-lock.json
  npm install
  

- *API Key Issues*: Double-check your .env file to ensure API keys are correctly configured. Ensure the file is saved and restart the application after making changes.

- *Network Issues*: Verify your internet connection and ensure the news sources' APIs are accessible.

For additional assistance, refer to the documentation of any specific dependencies or configurations.

---
![WhatsApp Image 2025-01-01 at 10 04 17_cc44b099](https://github.com/user-attachments/assets/671e4e37-9286-41a5-8a9f-bbceeb38cfe4)

![WhatsApp Image 2025-01-01 at 10 04 18_6abd36b4](https://github.com/user-attachments/assets/5a1e9d86-240a-4e19-a5bd-aa7e77477096)



