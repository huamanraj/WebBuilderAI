# WebBuilder AI

## Project Overview
WebBuilder AI is an AI-powered website generator that creates complete websites based on natural language prompts. It features real-time code editing, a live preview, user authentication, website management, and shareable links.

## Key Features
- User registration and authentication with JWT
- AI-based HTML, CSS, and JavaScript code generation using Perplexity API
- Real-time preview and code editing via Monaco Editor
- Website management: create, update, delete, and share websites
- Usage limits and detailed tracking

## Technology Stack

### Frontend
- React.js (with Vite)
- React Router, TailwindCSS, Framer Motion
- Axios and React Toastify
- React Monaco Editor

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JSON Web Tokens (JWT) and Bcrypt.js
- Express Validator, CORS, and Morgan

## Project Structure
- **/client**: Contains the frontend React application  
- **/server**: Contains the backend Node.js application and API routes  
- **.env**: Environment variables for configuration  

For more details, please refer to the documentation in `doc.txt`.
