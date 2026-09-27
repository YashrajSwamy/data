# ER Diagram – Set-wise Preparation

## Set 1 – Library Management System

### Entities

1. **Book** — `ISBN, Title`
2. **Member** — `MemberID, Name`
3. **Author** — `AuthorID, AuthorName`
4. **Publisher** — `PublisherID, PublisherName`
5. **Borrow** — `BorrowID, BorrowDate, ReturnDate`

### Relationships

| Relationship                   | Cardinality |
| ------------------------------ | ----------- |
| Author — writes — Book         | 1 : N       |
| Publisher — publishes — Book   | 1 : N       |
| Member — makes — Borrow        | 1 : N       |
| Book — is borrowed in — Borrow | 1 : N       |

> One member can borrow many books, but each borrow record belongs to one member.

---

## Set 2 – Employee & Department

### Entities

1. **Department** — `DeptID, DeptName`
2. **Employee** — `EmpID, EmpName, Salary`
3. **Project** — `ProjectID, ProjectName`
4. **Manager** — `ManagerID, ManagerName`
5. **Location** — `LocationID, LocationName`

### Relationships

| Relationship                       | Cardinality |
| ---------------------------------- | ----------- |
| Department — has — Employee        | 1 : N       |
| Employee — works on — Project      | M : N       |
| Manager — manages — Employee       | 1 : N       |
| Department — located at — Location | N : 1       |

> One employee can work on many projects, and one project can have many employees.

---

## Set 3 – Student & Course Enrollment

### Entities

1. **Student** — `StudentID, SName`
2. **Course** — `CourseID, CName`
3. **Faculty** — `FacultyID, FName`
4. **Department** — `DeptID, DeptName`
5. **Enrollment** — `EnrollmentID, EnrollDate, Grade`

### Relationships

| Relationship                  | Cardinality |
| ----------------------------- | ----------- |
| Student — enrolls in — Course | M : N       |
| Faculty — teaches — Course    | 1 : N       |
| Department — offers — Course  | 1 : N       |
| Student — has — Enrollment    | 1 : N       |
| Course — has — Enrollment     | 1 : N       |

> One student can enroll in many courses, and one course can have many students.

---

## Set 4 – Doctor & Patient

### Entities

1. **Doctor** — `DocID, DocName`
2. **Patient** — `PatID, PatName, Disease`
3. **Appointment** — `AppointmentID, Date, Time`
4. **Nurse** — `NurseID, NurseName`
5. **Department** — `DeptID, DeptName`

### Relationships

| Relationship                   | Cardinality |
| ------------------------------ | ----------- |
| Doctor — examines — Patient    | 1 : N       |
| Patient — has — Appointment    | 1 : N       |
| Doctor — attends — Appointment | 1 : N       |
| Nurse — assists — Doctor       | N : 1       |
| Department — has — Doctor      | 1 : N       |

> One doctor can examine many patients, but each patient has one primary doctor.

---

## Set 5 – Online Store

### Entities

1. **Customer** — `CustID, CName`
2. **Order** — `OrderID, OrderDate`
3. **Product** — `ProductID, PName, Price`
4. **Payment** — `PaymentID, Amount, PaymentDate`
5. **OrderItem** — `ItemID, Quantity`

### Relationships

| Relationship                     | Cardinality |
| -------------------------------- | ----------- |
| Customer — places — Order        | 1 : N       |
| Order — contains — Product       | M : N       |
| Order — has — Payment            | 1 : 1       |
| Order — contains — OrderItem     | 1 : N       |
| Product — appears in — OrderItem | 1 : N       |

> One order can contain many products, and one product can appear in many orders.

---

## Set 6 – Movie Management

### Entities

1. **Director** — `DirID, DirName`
2. **Movie** — `MovieID, Title`
3. **Actor** — `ActorID, ActorName`
4. **Producer** — `ProducerID, ProducerName`
5. **Genre** — `GenreID, GenreName`

### Relationships

| Relationship                | Cardinality |
| --------------------------- | ----------- |
| Director — directs — Movie  | 1 : N       |
| Actor — acts in — Movie     | M : N       |
| Producer — produces — Movie | 1 : N       |
| Genre — has — Movie         | 1 : N       |

> One movie has a single director according to the given scenario, while a director can direct many movies.

---

## Set 7 – Bank Model

### Entities

1. **Customer** — `CustID, Name`
2. **Account** — `AccNo, Type`
3. **Branch** — `BranchID, BranchName`
4. **Transaction** — `TransactionID, Date, Amount`
5. **Loan** — `LoanID, Amount, Type`

### Relationships

| Relationship                 | Cardinality |
| ---------------------------- | ----------- |
| Customer — holds — Account   | M : N       |
| Account — has — Transaction  | 1 : N       |
| Branch — maintains — Account | 1 : N       |
| Customer — takes — Loan      | 1 : N       |
| Branch — provides — Loan     | 1 : N       |

> One customer can hold multiple accounts, and an account can have multiple joint customers.

---

## Set 8 – Project Management

### Entities

1. **Employee** — `EmpID, Name`
2. **Project** — `ProjID, PName`
3. **Department** — `DeptID, DeptName`
4. **Task** — `TaskID, TaskName, Deadline`
5. **Client** — `ClientID, ClientName`

### Relationships

| Relationship                  | Cardinality |
| ----------------------------- | ----------- |
| Employee — works on — Project | M : N       |
| Project — has — Task          | 1 : N       |
| Department — has — Employee   | 1 : N       |
| Client — owns — Project       | 1 : N       |

> One employee can work on many projects, and one project can have many employees.

---

## Set 9 – Airline Management

### Entities

1. **Pilot** — `PilotID, PName`
2. **Flight** — `FlightID, Destination`
3. **Aircraft** — `AircraftID, Model`
4. **Airport** — `AirportID, AirportName`
5. **Passenger** — `PassengerID, PassengerName`

### Relationships

| Relationship                 | Cardinality |
| ---------------------------- | ----------- |
| Pilot — flies — Flight       | 1 : N       |
| Aircraft — used for — Flight | 1 : N       |
| Airport — handles — Flight   | 1 : N       |
| Passenger — books — Flight   | M : N       |

> One pilot can fly multiple flights, while each flight is flown by one pilot according to the given scenario.

---

# Quick Cardinality Revision

| Cardinality | Meaning      |
| ----------- | ------------ |
| **1 : 1**   | One-to-One   |
| **1 : N**   | One-to-Many  |
| **N : 1**   | Many-to-One  |
| **M : N**   | Many-to-Many |

## Important M : N Relationships

* **Set 2:** Employee ↔ Project
* **Set 3:** Student ↔ Course
* **Set 5:** Order ↔ Product
* **Set 6:** Actor ↔ Movie
* **Set 7:** Customer ↔ Account
* **Set 8:** Employee ↔ Project
* **Set 9:** Passenger ↔ Flight

### Exam Tip

For an **M : N relationship**, you can introduce an **associative/relationship entity** when required:

* Student ↔ Course → **Enrollment**
* Order ↔ Product → **OrderItem**
* Member ↔ Book → **Borrow**

Refine your ER diagram notes

* Convert M:N relationships
* Add primary and foreign keys
