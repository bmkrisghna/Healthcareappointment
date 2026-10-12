# MediQueue — Healthcare Appointment Scheduling Using Queues

A complete, responsive web application for managing healthcare appointments using three custom-implemented data structures: a **linked-list FIFO queue**, a **binary max-heap priority queue**, and a **circular queue** for round-robin doctor slot allocation.

## Features

- **Login** — Admin/Receptionist and Doctor roles with demo accounts
- **Patient Entry Portal** — register patients with name, age, problem type, severity (Routine/Urgent/Emergency/Critical), and preferred time. 500-patient capacity limit with validation.
- **Live Queue Dashboard** — three side-by-side panels showing the FIFO queue, priority queue (emergencies highlighted in red), and doctor slot ring (circular queue visualization). Animated patient cards.
- **Doctor Portal** — shows the doctor's next patient, "Call Next" button (emergencies always first via max-heap), "Mark Completed", and daily workload chart.
- **Slot Allocation** — automatic round-robin assignment via circular queue with a balanced-workload bar chart per doctor.
- **Analytics** — average waiting time, patients served, emergency response time (ms), FIFO vs Priority comparison chart.
- **Simulation** — bulk-load 50–500 random patients and measure timing (target: <1s emergency, <2s allocation).
- **Toast notifications** when patients are called, plus a **chat assistant** for "How long is my wait?".
- **Dark mode** toggle, responsive sidebar navigation, accessible labels and keyboard navigation.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Icons | lucide-react |
| Backend (reference) | Python FastAPI + SQLite-ready |
| Data Structures | Custom TypeScript/Python implementations (no built-in queue libs) |

## Getting Started

### Frontend (runs standalone — all logic in-browser)

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`. All queue logic is implemented in TypeScript and runs client-side. Seed data (3 doctors, 20 patients) loads automatically.

### Backend (optional REST API reference)

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API docs at `http://localhost:8000/docs`.

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin / Receptionist | admin@health.com | demo123 |
| Doctor (Dr. Sarah Chen) | doctor@health.com | demo123 |
| Doctor (Dr. James Patel) | doctor2@health.com | demo123 |
| Doctor (Dr. Maria Gomez) | doctor3@health.com | demo123 |

## REST API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/login` | Authenticate user, return JWT |
| POST | `/patients` | Register a new patient |
| GET | `/queue` | Get FIFO queue state |
| GET | `/priority-queue` | Get priority queue (sorted by severity) |
| POST | `/next` | Call next patient (highest priority first) |
| POST | `/allocate-slot` | Assign patient to next doctor (round-robin) |
| GET | `/doctors` | List doctors and slot status |
| GET | `/analytics` | Performance metrics |
| POST | `/simulate` | Bulk-load patients, return timings |

## Data Structure → Feature Mapping (Viva Notes)

### 1. Linked-List FIFO Queue → Normal Patient Registration

**File:** `src/dataStructures/LinkedListQueue.ts`

A singly linked list with `head` and `tail` pointers. Patients are added at the tail and removed from the head, preserving arrival order (First-In-First-Out).

| Operation | Time Complexity | How |
|-----------|----------------|-----|
| enqueue (add patient) | O(1) | Append to tail pointer |
| dequeue (serve patient) | O(1) | Remove from head pointer |
| peek (view next) | O(1) | Read head node |
| remove (cancel patient) | O(n) | Traverse to find and unlink |
| size | O(1) | Maintained as counter |

**Why linked list?** Dynamic size without pre-allocation, O(1) enqueue and dequeue at both ends.

### 2. Binary Max-Heap Priority Queue → Emergency Triage

**File:** `src/dataStructures/MaxHeap.ts`

An array-based binary heap where each node's priority ≥ its children's. Severity weights: Critical=4, Emergency=3, Urgent=2, Routine=1. The root always holds the highest-priority patient, so emergencies are served first.

| Operation | Time Complexity | How |
|-----------|----------------|-----|
| insert (add to heap) | O(log n) | Sift up to restore heap property |
| extractMax (serve next) | O(log n) | Swap root with last, sift down |
| peekMax (view next) | O(1) | Read root element |
| size | O(1) | Array length |

**Why max-heap?** Guarantees O(log n) insertion and extraction while always serving the most critical patient first — essential for emergency triage.

### 3. Circular Queue (Ring Buffer) → Doctor Slot Allocation

**File:** `src/dataStructures/CircularQueue.ts`

A fixed-size array where `front` and `rear` pointers wrap around using modulo arithmetic (`(index + 1) % capacity`). Doctor IDs cycle through the ring — each allocation dequeues the next doctor, assigns a patient, and re-enqueues the doctor for the next round, ensuring balanced workload.

| Operation | Time Complexity | How |
|-----------|----------------|-----|
| enqueue (add to ring) | O(1) | rear = (rear+1) % capacity |
| dequeue (next doctor) | O(1) | front = (front+1) % capacity |
| peek (current doctor) | O(1) | Read front slot |
| isFull / isEmpty | O(1) | Compare size to capacity |

**Why circular queue?** O(1) round-robin with no shifting. The wrap-around naturally cycles through doctors evenly, preventing any single doctor from being overloaded.

## Folder Structure

```
.
├── src/
│   ├── dataStructures/
│   │   ├── LinkedListQueue.ts    # FIFO linked-list queue
│   │   ├── MaxHeap.ts            # Binary max-heap priority queue
│   │   ├── CircularQueue.ts      # Circular queue (ring buffer)
│   │   └── severity.ts           # Severity → priority mapping + colors
│   ├── data/
│   │   └── seed.ts               # Seed doctors + patient generator
│   ├── store/
│   │   └── StoreContext.tsx       # Central state (queues, auth, actions)
│   ├── components/
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   ├── ToastContainer.tsx     # Notification toasts
│   │   ├── ChatAssistant.tsx      # "How long is my wait?" chat box
│   │   └── Badges.tsx             # Severity + status badges
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── PatientEntryPage.tsx
│   │   ├── QueueDashboardPage.tsx
│   │   ├── DoctorPortalPage.tsx
│   │   ├── SlotAllocationPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   ├── SimulationPage.tsx
│   │   └── DocumentationPage.tsx
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── backend/
│   ├── main.py                   # FastAPI reference implementation
│   └── requirements.txt
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## Seed Data

- **3 Doctors:** Dr. Sarah Chen (General Medicine), Dr. James Patel (Cardiology), Dr. Maria Gomez (Emergency Care) — each with 8 daily slots.
- **20 Sample Patients:** randomized names, ages, problem types, severities, and preferred times. Loaded automatically on app startup.
