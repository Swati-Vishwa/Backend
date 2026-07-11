import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express()
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

// Parse incoming JSON payloads, capped at 10kb to prevent large payload attacks
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }))
app.use(express.static("public"))// Expose server-stored images, PDFs, and other static files to the client
app.use(cookieParser()) //to securely perform CRUD operations on cookies
export default app
