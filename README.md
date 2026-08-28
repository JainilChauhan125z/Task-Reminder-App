# TaskFlow

> A full-stack task management and productivity web application built with React and Firebase.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Application Structure](#application-structure)
- [Getting Started](#getting-started)
- [Screenshots](#screenshots)
- [Project Highlights](#project-highlights)
- [Future Improvements](#future-improvements)

## Overview

TaskFlow solves the problem of scattered productivity by bringing daily task management, long-term calendar scheduling, priority tracking, and habit-forming analytics into a single cohesive, highly responsive interface. By leveraging Firebase for real-time data persistence and authentication, users can seamlessly manage their goals from any device without losing their active streaks or upcoming schedules.

## Features

- **User Authentication**: Secure sign-up and login via Firebase Authentication.
- **Advanced Task CRUD**: Create, read, update, and delete tasks seamlessly.
- **Task Scheduling & Calendar**: Calendar-based view to plan tasks across specific dates.
- **Subtasks (Checklists)**: Break larger goals down into actionable sub-items, featuring bidirectional parent-subtask completion sync.
- **Priorities & Categories**: Organize tasks using predefined categories (Study, Work, Personal) and set priority levels (Low, Medium, High).
- **Important Tasks**: Star tasks to elevate them to a dedicated Focus list.
- **Daily Progress & Habit Streaks**: A dynamic dashboard calculating real-time daily progress percentages and tracking consecutive active days.
- **Smart Dashboard & Overdue Handling**: Automatically surfaces overdue items and prioritizes upcoming tasks needing immediate attention.
- **Reminders**: Integrated background polling loop that issues notifications for time-sensitive tasks.
- **Responsive UI**: A polished, custom-built CSS architecture that elegantly adapts across desktop, tablet, and mobile breakpoints without relying on heavy UI frameworks.

## Tech Stack

- **Frontend**: React, JavaScript (ES6+), Vanilla CSS
- **Build Tooling**: Vite
- **Backend & Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Icons**: Lucide React

## Application Structure

The core application resides entirely within the `client` directory.

```text
client/
  src/
    components/          # Reusable UI components (Dashboard, Calendar, Modals, TaskList, etc.)
    firebase/
      firebase.js        # Firebase initialization and SDK exports
    App.jsx              # Main application router and global state controller
    App.css              # Global styling, themes, and responsive design systems
    index.css            # Base browser resets and typography
```

## Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Install dependencies
```bash
cd client
npm install
```

### 3. Firebase Configuration
Because TaskFlow relies on Firebase for authentication and database management, you must provide your own Firebase configuration. 

Open `client/src/firebase/firebase.js` and securely replace the existing `firebaseConfig` object with your own Firebase project's credentials. *Do not commit your real credentials to public source control.*

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```
*(Ensure Firestore and Authentication (Email/Password) are enabled in your Firebase console).*

### 4. Start the development server
```bash
npm run dev
```
The application will launch typically at `http://localhost:5173`.

## Production Build

TaskFlow uses Vite for lightning-fast production bundling. The project has been successfully optimized and built during development. To generate the production assets:

```bash
npm run build
```
This will output the highly optimized static assets into the `client/dist/` directory.

## Screenshots

<!-- Add screenshots here before final publication -->

## Project Highlights

- **Robust State Management**: Effectively utilizes React's `useMemo`, `useState`, and `useEffect` to derive complex dashboard statistics (streaks, completion percentages) locally without unnecessarily taxing the database.
- **Responsive CSS Architecture**: Demonstrates strong proficiency in native CSS Grid and Flexbox, creating a UI that gracefully degrades and stacks on smaller devices (down to 320px) while maintaining a premium look.
- **Intelligent Data Sync**: The Firestore integration handles complex queries efficiently, filtering by user ID and applying logic for overdue and important task aggregations.

## Future Improvements

- Implement user-customizable categories and colored tags.
- Add drag-and-drop reordering for tasks within the daily view.
- Integrate push notifications for mobile devices via Firebase Cloud Messaging.

## Author
Jainil Chauhan
