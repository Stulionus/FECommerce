## Getting Started

### 1. Start the Server

1. Navigate to the backend directory:

   cd fecommerce/backend

2. Install dependencies and start the server:

   npm install
   npm start

### 2. Start the Client

1. Navigate to the client directory:

   cd fecommerce/frontend/fecommerce

2. Install dependencies and start the client:

   npm install
   npm run dev

## Areas for Improvement

### 1. File Structure

When creating the project I did not think ahead and did not consider the file structure of the project,
 resulting in a disorganized project layout. I tired to restructure the folders, these changes resulted in various errors and complications.

### 2. Code Reuse

I curently have some functions that are being reused (copy pasted) in multiplle pages
I understand that it is bad anti-pattern. I tried to export these funtion to more easily use across multiple pages
but ran into some errors that i did not have time to fix

### 3. Cart Count Update

In the current implementation, the cart count only updates upon page reload. 
tried to change it but could not find the apropriate solution,
ChatGPT's suggestion were too complicated and did not work, I think the problem lies in my pags structure design
