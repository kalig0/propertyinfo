# Daniel Yu eGain Take Home

## Environment Variables
setup environment variables in egain-takehome-backend.env
for rentcastapi go to https://www.app.rentcast.io/app -> sign up -> click api dashboard on the top -> create API key
for nearbyschoolsapi go to https://www.solutions.greatschools.org/k12-data-solutions/nearbyschools-api -> click choose school quality -> fill in the form for the 14 day free trial (website can be any website e.g. www.google.com) -> your api key will be sent to your email

## Run 
cd egain-takehome-frontend
npm i
npm start

In a seperate terminal:
cd egain-takehome-backend
npm i
node server.js

In the form enter a street address, city, and choose a state. As an example you can use 3015 Fleetwood Dr, San Bruno, CA.
One thing to note for the property information api is that not all addresses are in it's database. I recommend searching for houses as most apartments are not included in the database.