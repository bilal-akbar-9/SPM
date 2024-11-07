# Pharmacy Management and Integration Service

## Product Scope Description
The Pharmacy Management and Integration Service module is a microservice designed to manage pharmacy related operations and integrate seamlessly with other modules of the healthcare system. The module will encompass the following key functionalities:

1. **Medication Inventory Management**
2. **Prescription Processing**
3. **Billing and Insurance Integration**
4. **Reporting and Analytics**
5. **User Interfaces**
6. **Integration with other Healthcare project microservices**

## Product User Acceptance Criteria
1. The system must correctly track and manage medication inventory in real-time, including stock levels and expiration dates.
2. Prescription processing must be error-free, and support a complete fulfillment workflow.
3. Billing and insurance integration must be accurate, support various payment methods, and seamlessly integrate with the main healthcare platform billing system.
4. Reporting and analytics features must provide actionable insights for pharmacy management and support regulatory compliance.
5. User interfaces must be intuitive, easy to use and responsive.
6. Integration with other healthcare microservices must be seamless, secure, and maintain data integrity.

## Project Deliverables
1. Fully functional Pharmacy Management and Integration Service microservice
2. User manual and system documentation
3. Integration APIs and documentation for other healthcare microservices

## Project Boundaries
* The project will focus solely on pharmacy-related functionalities and their integration with other healthcare modules. And will only provide necessary data to other services.
* The microservice will not handle non-pharmacy related healthcare operations.
* The project does not include physical infrastructure setup for pharmacies.

## Constraints
* The project must be completed within the specified timeframe (Sep 20 - Dec 1, 2024).
* Development must be done within the context of an academic course project without a monetary budget.
* The system must comply with relevant healthcare regulations.

## Assumptions
* All team members will be available throughout the project duration.
* The medicine prescription is received in electronic format.
* Necessary development tools and environments will be provided by the academic institution.
* Other healthcare microservices, including the patient profile management service, will have compatible integration points for our module.

## Technologies Used
- Frontend: React
- Backend: Node.js

## Getting Started / Installation
1. Clone the repository: `git clone https://github.com/your-username/pharmacy-management-service.git`
2. Getting into respective directories: `cd backend` and `cd frontend`
3. Install dependencies in both the directoreis: `npm install`
4. Set the environment variables:
   - Frontend: Create `.env` file and add:
     VITE_API_URL=http://localhost:3000
   - Backend: Create `.env` file and add:
        PORT=3000
        MONGODB_STRING=mongodb://127.0.0.1:27017/s13-Pharamcy-DB
        FRONTEND_URL=http://localhost:5173
5. Start the backend server: `node server.js`
6. Start the frontend server: `npm run dev`
7. Open the application in your browser at `http://localhost:5174`