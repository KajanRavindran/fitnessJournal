# Fitness Journal Web App

Created By: Kajan Ravindran (100608620)
Course Code: SOFE 4360: Cloud Computing (Winter 2021)
Instructor: Dr. Q. Mahmoud

### Application Description
A simple application to demonstrate the ability to use cloud technologies to deploy web applications.

With everyone being stuck at home, and working out becoming more of a challenge, I decided to make a simple workout journal web application. As there were no additional marks given for user authentication and that was ommited in my implimentation. 

The application uses:
* MongoDB = Database
* Express.js = Back-end web framework
* Node = Back-end platform / web framework
* HTML/CSS = Front-end

The 3 client side services included in the application are:
1. Querying from the MongoDB database to retrieve all journal enteries when on the home page.
2. When selecting the **compose** page, user is able to add a title, and include formatted text (achieved using the TinyMCE API). When publish is clicked, post is saved to the database and user is taken back to the home page where the new post is displayed along with all past enteries.
3. When the **read entry** button is selected, user is taken to the full post the published earlier. Here they have the option to delete if they so choose to.

### Cloud Host
The live version of the application is running on a AWS ec2 instance at the address http://ec2-18-219-63-207.us-east-2.compute.amazonaws.com:3000/
