\# Astrygo APIs



This folder contains all backend microservices for the Astrygo platform.



\## Structure



\- `auth-api/` – Authentication and user identity service (JWT, login, register, refresh).

\- `billing-api/` (future) – Payments, invoices, and subscription plans.

\- `hosting-api/` (future) – Website hosting, domains, DNS, and usage metering.



Each service is designed to be:

\- Isolated (owns its own database schema).

\- Deployed independently (Cloud Run).

\- Communicating via HTTP/REST (later: gRPC or message bus).



The first service we implemented is \*\*auth-api\*\*.



