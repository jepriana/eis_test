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
    DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>"
    DATABASE_URL        = "postgresql://neondb_owner:1oLpQPhKjWF4@ep-flat-water-a1nx8ifj.ap-southeast-1.aws.neon.tech/puri_bunda?sslmode=require"
    ACCESS_TOKEN_KEY    = "<YOUR ACCESS TOKEN KEY>
    REFRESH_TOKEN_KEY   = "<YOUR REFRESH TOKEN KEY>
    ACCESS_TOKEN_AGE    = 8400
    REFRESH_TOKEN_AGE   = 2592000
    PORT                = 3001
    SECRET_CODE         = R4h4514
    ```

    - Database URL for Testing: postgresql://neondb_owner:1oLpQPhKjWF4@ep-flat-water-a1nx8ifj.ap-southeast-1.aws.neon.tech/puri_bunda?sslmode=require
    - Access Token for Testing: 1S2K3YRChcxkRTvT3DFyWu6UpSThQVOFaQN9VhfWurSvcuyJlPte1rEFmVNA8OJY3QJ0_OcgRAWvEhTncCln_w
    - Refresh Token for Testing: 1S2K3YRChcxkRTvT3DFyWu6UpSThQVOFaQN9VhfWurSvcuyJlPte1rEFmVNA8OJY3QJ0_OcgRAWvEhTncCln_w
    Notes: Secret code is a code that can be used for admin employee creation.

4. **Run database migrations:**
    ```sh
    npx prisma migrate dev
    ```

5. **Generate prisma client code:**
    ```sh
    npx prisma generate
    ```

6. **Create dummy data:**
    ```sh
    npm run seed
    ```

7. **Start the backend server:**
    ```sh
    npm run dev
    ```

## Frontend

The frontend is developed using:
- TypeScript
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
5. **Login with initial admin user:**
    ```sh
    username: admin
    password: Rahasia@123
    ```
## Running the Project

1. Start the backend server.
2. Start the frontend server.
3. Open your browser and navigate to `http://localhost:<frontend-port>` to see the application in action.

Feel free to contribute to this project by submitting issues or pull requests.

Happy coding!