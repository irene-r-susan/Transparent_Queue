# Transparent Queue

A token-based queue management system for public service offices, modeled on hospital-style queue logic. It gives visitors a clear, real-time view of their wait and gives staff a simple dashboard to manage flow without constant interruptions.

## Overview

Public service offices handle visitors with very different needs — some need a 5-minute approval, others need a long consultation — all through a single confusing line. Transparent Queue replaces that with department-level queues, real-time status tracking, and a fair slot-allocation model so both visitors and staff know exactly what's happening at all times.

## Problem Statement

- Visitors don't know how long they'll wait.
- Visitors don't know if they're in the correct queue.
- Visitors don't know if they should return later.
- Staff are repeatedly interrupted with the same questions, slowing down actual work.

## Features

- Real-time queue status for visitors (no app installation required)
- Department-level queue separation
- Three parallel queue types per department: Emergency, Online Appointment, Walk-in
- Fair, fixed slot allocation per hour across queue types
- Staff dashboard for call-next, walk-in entry, and emergency override
- Wait-time estimates based on actual expected service duration, not flat averages

## System Architecture

Each department (e.g. Passport Desk, Records, Licensing) runs three parallel queues instead of one line:

| Queue Type | Purpose | Priority |
|---|---|---|
| Emergency | Urgent cases that can't wait | Highest — served immediately |
| Online Appointment | Pre-booked visitors with a confirmed time slot | Scheduled order |
| Walk-in | Visitors who arrive without booking | First-come, first-served within reserved capacity |

> Walk-ins are registered by staff, not self-service. A visitor walks up, staff enters their details on the dashboard, and the system generates the token automatically.

## Slot Allocation

To keep things fair between people who plan ahead and people who can't, every hour is split into fixed proportions instead of giving online bookings unlimited slots:

| Queue Type | Share of Hourly Slots |
|---|---|
| Emergency | 1/4 |
| Online Appointment | 2/4 |
| Walk-in | 1/4 |

Example: a department handling 12 visitors/hour reserves 3 emergency slots, 6 appointment slots, and 3 walk-in slots, every hour. If walk-ins exceed their 3 slots, the extra walk-ins spill into the next hour's walk-in quota — never turned away, just queued forward.

**Booking window:** online appointment slots for a given day open the day before (e.g. 6 PM) and are bookable first-come, first-served until that day's online quota is full. Once full, the booking page shows no slots left for that day.

## Visitor Flow

**Online appointment (self-service)**
1. Sign up / Login
2. Register — select department, service type, enter name, age, and reason for visit
3. Pick an available slot (opened the day before, first-come first-served until full)
4. Get a token — token number, doctor/staff name, people ahead, estimated wait
5. Track live status in real time

**Walk-in (staff-assisted)**
1. Visitor arrives at the office
2. Staff opens "Add Walk-in" on the dashboard and enters name, age, reason for visit, and service type
3. System auto-generates the token, sets effective_time to the current moment, and slots it into the walk-in queue
4. Visitor tracks live status on their phone using the token number

## Staff Dashboard

A single screen per department showing:

- Total visitors currently waiting
- "Add Walk-in" form to register walk-in visitors directly
- Next-in-line button (auto-decides which queue to pull from, based on slot priority)
- One-tap Emergency override
- Doctor/staff availability at a glance

## Dispatch Logic

1. Emergency queue is checked first — if someone's waiting there, they're called next regardless of the hour's slot count.
2. Otherwise, the system serves whichever of Online/Walk-in has the earliest "effective time" (appointment time for online, arrival time for walk-in), as long as that queue's hourly quota isn't exhausted.
3. If a queue's quota for the current hour is full, new entries roll into the next hour's quota for that same queue type.

## Service Types: Quick Approval vs Longer Consultation

`queue_type` only decides which bucket a visitor sits in — it doesn't capture how long their visit takes. A second field handles that:

- **service_type** — e.g. "quick approval" or "longer consultation," selected by the visitor when booking, or entered by staff for walk-ins.
- **expected_duration** — minutes derived from service_type (e.g. quick approval ≈ 5 min, longer consultation ≈ 20 min).

This feeds:
- **Realistic wait estimates** — the system sums the actual expected_duration of everyone ahead, instead of using a flat average.
- **Optional express lane** — departments with a high mix of both can dedicate one counter purely to quick approvals.

## Data Model

```
Visitor / Token
├── token_id
├── name, age, reason_for_visit
├── department_id
├── queue_type        (emergency / online / walkin)
├── service_type       (quick approval / longer consultation)
├── expected_duration   (minutes)
├── effective_time
├── status             (waiting / called / in_service / completed / no_show)
└── registered_by      (visitor / staff)

Department
├── department_id, name
├── counters_available
├── avg_service_time
├── slot_split          (default 1:2:1 — emergency:online:walkin)
└── express_lane_enabled (boolean, optional)

Slot (Online)
├── slot_id, department_id, date, time
├── release_at          (when slot opens for booking — day before)
└── status              (available / booked)

Doctor / Staff
├── staff_id, name, department_id
└── availability_status
```

## Tech Stack

| Layer | Suggested Choice |
|---|---|
| Frontend | html,css,javascript |
| Backend | Node.js/Express.js |
| Database | PostgreSQL |
| Real-time updates | WebSockets (Socket.io) |

## Getting Started

```bash
# clone the repo
git clone <repo-url>
cd transparent-queue

# install dependencies
npm install

# run locally
npm run dev
```
