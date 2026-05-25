# Security Specification

## Data Invariants
1. Users can only read and write their own profile document (`/users/{userId}`).
2. A user profile cannot be created by someone else (`request.auth.uid == userId`).
3. Mandatory fields for a user profile include `email` and `createdAt`.

## Dirty Dozen Payloads
1. { "email": "attacker@evil.com", "displayName": "Attacker" } (Missing createdAt)
2. { "email": "attacker@evil.com", "createdAt": "2026-05-21T12:00:00Z", "ghostField": "bad" } (Ghost Field)
3. { "email": 123, "createdAt": "2026-05-21T12:00:00Z" } (Invalid email type)
4. { "email": "user@valid.com", "createdAt": "invalid-date" } (Invalid createdAt format)
5. { "email": "user@valid.com", "createdAt": "2026-05-21T12:00:00Z", "admin": true } (Privilege Escalation attempt)
...

## Test Runner
(A separate `firestore.rules.test.ts` file will be created to verify these.)
