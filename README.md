# GradeSync

This project is a grading system application built with a Django backend and a React/Tailwind CSS frontend (via Vite). Follow the instructions below to set up the project, migrate the database, and run the servers on your local machine for testing.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
* **Python** (v3.8 or higher)
* **Node.js** (v14 or higher) and **npm**

---

## 1. Backend Setup (Django)

The backend handles the API and database operations. Open a terminal and follow these steps:

1.  **Navigate to the backend directory:**
    ```bash
    cd gradesync_backend
    ```

2.  **Create a virtual environment:**
    This keeps the project dependencies isolated.
    ```bash
    python -m venv venv
    ```

3.  **Activate the virtual environment:**
    * **Windows:**
        ```bash
        venv\Scripts\activate
        ```
    * **macOS/Linux:**
        ```bash
        source venv/bin/activate
        ```

4.  **Install backend dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Migrate the database models:**
    This step creates the necessary database tables for the app to function.
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

6.  **Run the Django development server:**
    ```bash
    python manage.py runserver
    ```
    *The backend should now be running at `http://localhost:8000/`.*

---

## 2. Frontend Setup (React & Tailwind)

Leave the backend server running in its terminal. Open a **new terminal window** to set up the frontend UI.

1.  **Navigate to the frontend directory:**
    ```bash
    cd gradesync_frontend
    ```

2.  **Install frontend dependencies:**
    This will install React, Tailwind CSS, and any other required packages.
    ```bash
    npm install
    ```

3.  **Run the React development server:**
    ```bash
    npm run dev
    ```
    *The frontend should now open automatically in your browser, typically at `http://localhost:5173/`.*

---

## Testing the App

Once both servers are running:
1. Ensure your Django terminal shows no errors.
2. Interact with the React interface in your browser.
3. If you need to access the Django admin panel, navigate to `http://localhost:8000/admin` (you may need to create a superuser first using `python manage.py createsuperuser`).