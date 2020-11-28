# Apt Appointment App

### Overview
The Apt Appointment App is a web-app designed to facilitate the planning of appointments with
large groups of friends. 

In the modern world, people are getting busier, and organisation of outings during your valuable 
personal time gets tougher as a result. The Apt Appt App is designed to solve this problem by 
cutting down the amount of time needed to co-ordinate the jam-packed schedules of all your peers!


### The problem

We can't control the problem of every single people having varied hectic schedules, but we are able
to control the management of the flow of information between groups. Therefore we consider ourselves 
successful if we can drastically cut down the time taken to communicate core information within the 
group. Mainly the range of dates the organiser wishes to meet, and the individual busy dates of the 
participants.



### Design / UX

As app's purpose is to save precious time, we have designed it to be fuss free and minimal. Organising
an event can be done in a single page. From setting the event date range to having live chat with the 
participants. Every single command made by users are live, and participants see real time results.
Organising an appoint would only take a few minutes.


![Alt text](readme-images/aaa-dashboard.png?raw=true "Dashboard")
AAA - User's Dashboard

![Alt text](readme-images/aaa-event-page.png?raw=true "Eventpage")
AAA - Event Page


### Technology

How the team achieved live updates is through [Pusher.](http://www.google.com)

![Alt text](readme-images/hero_howitworks.png?raw=true "Eventpage")

Pusher allows our frontend client to subscribe to specific channels, and listen for any changes made by
other users. This allows for an interactive experience between users real-time, which means speed.


Others:

- React
- Nodejs
- Express
- MongoDB
- Mongoose