# 🦷 Lumina Dental Studio - Smart Appointment Assistant

A modern, containerized Web Application that features an interactive AI receptionist designed to book dental appointments naturally through chat. Built using **Next.js**, **Payload CMS (v3)**, **MongoDB**, and the **Groq API** for high-performance LLM tool-calling.

---

## 🚀 Features

1. **AI Receptionist (Groq)**: Uses a custom system prompt and function calling to guide conversations and collect patient details (Name, Phone Number, Selected Service, and Date/Time).
2. **Double-Booking Prevention**: Before scheduling, the AI calls a custom check-availability tool to verify if a slot is already booked within a 30-minute window. If taken, it politely prompts the user to select another time.
3. **Dynamic CMS Integration**: Fetches services directly from the Payload CMS backend. If no services have been created in the CMS yet, the UI displays default fallback services with setup tips.
4. **Live Booking Dashboard**: Features a split-pane layout showing clinic services, a live-updating recent bookings log, and the glassmorphic chat interface.
5. **Docker Orchestrated**: Simple, single-command setup that boots the Next.js frontend, Payload CMS backend, and a local MongoDB instance.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router, Tailwind CSS v4, TypeScript)
- **Backend & CMS**: Payload CMS (v3, Next.js core)
- **Database**: MongoDB
- **AI Integration**: Groq SDK (Llama 3.3 70B Versatile)
- **Infrastructure**: Docker & Docker Compose

---

## 📁 Project Structure

```text
├── backend/            # Payload CMS v3 Backend
│   ├── src/
│   │   ├── collections/# Services & Appointments Schema
│   │   └── payload.config.ts
│   ├── Dockerfile
│   └── .env.example
├── frontend/           # Next.js 15+ Frontend Web App
│   ├── app/
│   │   ├── api/        # Proxy API routes (chat, services, appointments)
│   │   └── page.tsx    # Live booking dashboard
│   ├── components/     # Chat, ChatInput, ChatMessage
│   ├── lib/            # Groq & Payload API clients
│   └── Dockerfile
├── docker-compose.yml  # Orchestrates MongoDB, Backend, and Frontend
└── README.md           # Getting started guide
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- A **Groq API Key** (Get one at [console.groq.com](https://console.groq.com/))

### 2. Configure Environment Variables

Create the respective configuration files in each directory:

#### **Backend (`./backend/.env`)**
Create `./backend/.env` (you can copy `./backend/.env.example` as a template):
```env
PAYLOAD_SECRET=your-super-secret-key-change-me
DATABASE_URI=mongodb://mongodb:27017/appointment-cms
```
*(Note: Inside Docker Compose, the database URI points to the `mongodb` service host).*

#### **Frontend (`./frontend/.env.local`)**
Create `./frontend/.env.local`:
```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
PAYLOAD_API=http://backend:3000/api
```
*(Note: Replace `your_groq_api_key_here` with your actual Groq API key).*

---

## 🐳 Starting the Containers

Run the following command at the root of the project to build and start the entire stack:

```bash
docker-compose up --build
```

This starts three services:
1. **MongoDB** at `localhost:27017`
2. **Payload CMS Backend** at `http://localhost:3000`
3. **Next.js Frontend** at `http://localhost:3001`

---

## 📖 Walkthrough & Testing Guide

Once the containers are running, follow these steps to initialize and test the application:

### Step 1: Create an Admin Account
1. Open your browser and navigate to the CMS Panel: `http://localhost:3000/admin`.
2. Follow the on-screen prompts to create your first admin user.

### Step 2: Add Dental Services
1. Once logged into the admin panel, navigate to the **Services** collection.
2. Click **Create New** to add your clinic services. For example:
   - **Name**: `Teeth Whitening`, **Description**: `Professional laser whitening session`, **Price**: `299`
   - **Name**: `Dental Consultation`, **Description**: `General oral checkup and x-rays`, **Price**: `49`
3. Click **Save** for each service.

### Step 3: Test the AI Receptionist
1. Open the booking website: `http://localhost:3001`.
2. Notice that the services you added in Step 2 display on the left sidebar in real time!
3. Interact with the chat interface. You can type:
   - *"Hello, my name is John Doe and my phone is 555-0199. I want to book a Teeth Whitening appointment tomorrow at 2 PM."*
4. The AI will:
   - Verify the service against the CMS services.
   - Run the `checkAvailability` tool to check for overlaps.
   - Run the `createAppointment` tool to insert the record.
   - Output a success confirmation.
5. The **Recent Bookings List** on the left will refresh instantly and show John Doe's booking!

### Step 4: Test Double-Booking Prevention
1. Type to the chatbot: *"I want to book an appointment for Jane Smith, phone 555-0245 for Teeth Whitening tomorrow at 2:15 PM."*
2. The AI will call `checkAvailability` for tomorrow at 2:15 PM, detect that it overlaps with John Doe's 2:00 PM slot (within the 30-minute duration window), and reply that the slot is taken, asking you to select another time!
