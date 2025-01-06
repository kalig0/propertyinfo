# Daniel Yu eGain Take Home

## Environment Variables
### Setup environment variables in `egain-takehome-backend.env`

- For **rentcastapi**, go to [Rentcast](https://www.app.rentcast.io/app):
  1. Sign up.
  2. Click **API Dashboard** at the top.
  3. Create an API key.

- For **nearbyschoolsapi**, go to [Nearby Schools API](https://www.solutions.greatschools.org/k12-data-solutions/nearbyschools-api):
  1. Click **Choose School Quality**.
  2. Fill in the form for a 14-day free trial (you can use any website, e.g., `www.google.com`).
  3. Your API key will be sent to your email.

---

## Run

1. Navigate to the frontend directory:
   - cd egain-takehome-frontend
   - npm i
   - npm start

2. In a seperate terminal:
    - cd egain-takehome-backend
    - npm i
    - node server.js

--

## Usage
1. In the form enter:
    - a street address
    - a city
    - choose a state
2. Example input:
    - 3015 Fleetwood Dr, San Bruno, CA

--

## Notes
- For the property information API, not all addresses are included in its database.
- It's recommended to search for houses, as most apartments are not included in the database.