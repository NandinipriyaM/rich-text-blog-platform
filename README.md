# Blog Editor Platform

A user-friendly blog creation platform built with **React** and **Vite**, featuring a rich text editor, image uploads, category selection, auto-save, live preview, and post management.

---

## Table of Contents

- [Demo](#demo)  
- [Features](#features)  
- [Project Structure](#project-structure)  
- [Setup & Installation](#setup--installation)  
- [Component Overview](#component-overview)  
- [Design Decisions](#design-decisions)  
 

---

## Demo

- Create and format blog posts using bold, italics, headings, and lists.  
- Upload images with a live progress bar.  
- Insert hyperlinks via a modal window.  
- Assign multiple categories/tags per post.  
- Auto-save drafts every 30 seconds.  
- Toggle between **Editor** and **Preview** mode.  
- View all posts with real-time search and category filter.  
- Delete posts when needed.

---

## Features

### Editor Core Functionality

- Rich text editor using **ReactQuill**  
- Toolbar supports:
  - Bold, Italic, Underline  
  - Ordered and unordered lists  
  - Headings (H1, H2, H3)  
  - Hyperlinks via modal  
  - Image uploads  

### Media and Tagging

- Image file uploads with progress bar  
- Multi-select dropdown for categories/tags  
- Categories saved with the post  

### State Persistence and User Feedback

- Auto-saves draft every 30 seconds to `localStorage`  
- Restores draft content and categories on reload  
- Toast notifications for save success or errors  
- Preview mode accurately renders content  

### Post Management

- Separate **All Posts** page  
- Search posts by title or content  
- Filter posts by category  
- Delete posts functionality  

---

## Project Structure

blog-editor-platform/
│
├── node_modules/
├── public/
│ └── index.html
│
├── src/
│ ├── components/ 
│ │ ├── Editor.jsx
│ │ └── Editor.css
│ ├── pages/ 
│ │ └── PostList.jsx
│ ├── App.jsx  
│ └── main.jsx
├── .gitignore
├── package.json
├── package-lock.json
├── editor-icon.png
├── README.md
└── vite.config.js

---

## Setup & Installation

### Prerequisites

- Node.js (v18+ recommended)  
- npm (v9+ recommended)

### Steps

1. Clone the repository:


git clone <your-repo-link>

cd blog-editor-platform

2. Install dependencies:

npm install

3. Start the development server:

npm run dev

4. Open the app in your browser:

http://localhost:5173

## Component Overview
### Editor.jsx

Handles text editing, image uploads, category selection, hyperlink modal, auto-save, and preview mode.

 Uses ReactQuill for rich text editing.

Custom modals for Save Post and Insert Link.

Toast notifications for user feedback.

## PostList.jsx

Displays all saved posts.

Supports real-time search by title or content.

Filters posts by category.

Delete posts with confirmation.

## App.jsx

Header with editor icon 

Navigation links to Editor and All Posts pages

Implements React Router v7 routing.

## Design Decisions

React + Vite chosen for fast, modern development and hot reload.

ReactQuill selected for a full-featured rich text editor.

LocalStorage used for draft persistence (no backend required).

React-Toastify used for non-intrusive notifications.

Custom modals for save and link insertion improve UX over default browser prompts.

Component modularity ensures maintainability and scalability.