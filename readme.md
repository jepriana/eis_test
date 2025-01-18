# Puri Bunda Test Project

This project consists of two main parts: the backend and the frontend.

## Backend

The backend is developed using:
- TypeScript
- Express
- PostgreSQL
- Prisma (as ORM)

### Setup Instructions

1. **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd <repository-directory>/backend
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the `backend` directory with the following content:
    ```env
    DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
    ```

4. **Run database migrations:**
    ```sh
    npx prisma migrate dev
    ```

5. **Start the backend server:**
    ```sh
    npm run dev
    ```

## Frontend

The frontend is developed using:
- React
- Material Design

### Setup Instructions

1. **Navigate to the frontend directory:**
    ```sh
    cd <repository-directory>/frontend
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the `frontend` directory with the following content:
    ```env
    REACT_APP_API_URL=http://localhost:<backend-port>
    ```

4. **Start the frontend server:**
    ```sh
    npm start
    ```

## Running the Project

1. Start the backend server.
2. Start the frontend server.
3. Open your browser and navigate to `http://localhost:<frontend-port>` to see the application in action.

Feel free to contribute to this project by submitting issues or pull requests.

Happy coding!