# How to Run

## Backend

Open a terminal and navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
go mod download
```

Make sure MySQL is running and the database configuration is set in `.env`.

Start the backend:

```bash
go run .
```

The backend runs on:

```text
http://localhost:8080
```

---

## Run the Application

1. Start **MySQL**.
2. Start the **Backend**:

```bash
cd backend
go run .
```

3. Open another terminal and start the **Frontend**:

```bash
cd frontend
npm install
npm run dev
```

4. Open:

```text
http://localhost:5173
```
