# HealthGuard AI — Complete student prototype

Spring Boot backend + browser dashboard + patient CRUD + H2 file database + sample data.

## Run (Windows PowerShell)
1. Extract this ZIP.
2. Open the **HealthGuardAI_Complete** folder in VS Code (the folder containing `pom.xml`).
3. Terminal → New Terminal, run `dir` and confirm `pom.xml` is listed.
4. Run `mvn spring-boot:run` and wait for `Started HealthGuardApplication`.
5. Open **http://localhost:8080**.

## APIs
- `GET /api/health`
- `GET /api/patients` and `GET /api/patients/{id}`
- `POST /api/patients` to add; `PUT /api/patients/{id}` to update; `DELETE /api/patients/{id}` to delete.

Example POST JSON: `{"name":"Neha Sharma","age":29,"heartRate":76,"bloodPressure":"118/78","oxygenLevel":98.0,"monitoringStatus":"NORMAL"}`

H2 data is stored under `./data`. H2 console: `http://localhost:8080/h2-console`, JDBC URL `jdbc:h2:file:./data/healthguarddb`, username `sa`, blank password.

The demo status rule flags oxygen below 95 or heart rate below 50/above 100 as `REVIEW_REQUIRED`. This is an illustrative programming rule only, not medical advice. This project is not a validated medical device and must not be used to diagnose, monitor real patients, or make treatment decisions. Use sample data only.
