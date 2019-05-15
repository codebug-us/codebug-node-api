# Codebug Backend API

### Why we set this up

Many APIs that you'll want to use will require you to have various API keys that you'll use to interact with their API. These keys should be kept secret since if someone gets ahold of your API keys, they can submit requests on your behalf, potentially costing you $$. We've developed a backend application that you can deploy all on your own so that you can route your API requests through this backend and this backend will give you a safe place to store all of your API Keys. 


### How it works

- You submit an API request to the Codebug Backend API containing all the data associated with the actual API request you'd like to send (url, method, headers, data, etc). 
- Our backend then takes your request and plugs in all the environment variables that you've designated need to be added in.
- Our backend then sends that request to the 3rd party API. 
- The 3rd party API responds to our backend application.  
- Our backend application passes the response back to you. 


### Sample Code 

- You can find sample code for interacting with our API [here](https://github.com/codebug-us/codebug-api-example).


### How to use this locally (AKA just on your computer)

- Clone this repository
- You should already have Node installed. If not, you'll need to install Node. You can test this by going to the terminal and typing `node --version`. If you get back a version number, then you're good. If not, install Node for your particular OS. 
- `cd` into this repository once you've cloned it down locally, and run `npm install`. 
- If that worked, you should see a new folder appear in this repository called `node_modules`. This is where the libraries we've added to our application store their code. 
- Now you'll need to add a `.env` file (notice the dot before the filename) to the root of this repo. This `.env` file will be the file we will hold all our API Keys in. Notice that we have included the `.env` file in our `.gitignore` file so that you do not push up all of your API Keys to Github. You can create this file from the terminal by `cd` into this repository and running `touch .env`. 
- Now you'll need to add your API Keys to this file following the format below: 
```
CODEBUG_CORS_ORIGINS='null;codebug-api-test.surge.sh'
CODEBUG_AIRTABLE_API_KEY=ThisIsMyAirtableAPIKey
CODEBUG_UNSPLASH_CLIENT_SECRET_KEY=ThisIsMyUnsplashSecretKey
CODEBUG_UNSPLASH_CLIENT_VERSION=12.0.2
```
**NOTE YOU NEED TO PREFACE ALL OF YOUR API KEYS WITH `CODEBUG_` (capitalization matters). OUR SYSTEM WILL NOT PICK UP ON API KEYS THAT DO NOT HAVE THE CODEBUG_ PREFIX**

- `CODEBUG_CORS_ORIGINS` is a REQUIRED environment variable that allows you to specify which websites are allowed to send requests to your backend. This is how we prevent someone else from sending an API request to your backend and collecting all of your API Keys. If you are developing locally (just on your computer), you should add `CODEBUG_CORS_ORIGINS='null'` to your `.env` file. This will allow you to send requests from your JavaScript files on your computer. We'll remove `null` from our `CODEBUG_CORS_ORIGINS` once we deploy to Heroku. 

- Run `nodemon server.js` to start your local Node server. As you are building your websites on your computer, you can use a "local server" to handle your API requests. Your server should start on `http://localhost:3000`. When you run the `nodemon server.js` command, it should tell you the URL for your local server: `Express server listening on port 3000 in development mode`. 

- Now, in your local JavaScript code, you'll want to submit your requests to `http://localhost:3000/post` or `http://localhost:3000/env` while developing locally. 


### How to deploy (with Heroku)

Heroku is a hosting service we'll be using to put our backend API on the internet so it is accessible for our websites that we've deployed (as you can't send an API request to http://localhost:3000 from your app that you've deployed). Heroku is free to use, though your app will go to sleep if it doesn't get a request for awhile. While sleeping, if your app receives a request, it'll take about 30 seconds for your app to wake up and start responding. If you pay ~$7/mo you can keep your app awake all the time. Your call. 
- If you don't have a Heroku account already, you'll need to create one [here](https://www.heroku.com/). 
- Once you're logged into Heroku, you'll need to create a new app, so click "New" in the top right corner, and then "Create New App".
- The name you choose for your app in this step will be your url, so if you choose `cb-test-app` as the name, your backend application will be at the URL: `cb-test-app.herokuapp.com`. 
- Click on the "Settings" tab and copy the `Heroku Git URL` to your clipboard. 
- Open Terminal, and make sure you have `cd`'d into this repo.
- Run `git remote add heroku https://git.heroku.com/test-api-app-test.git` from the terminal. This will give you the ability to push your code to Heroku in a very similar way to how you push your code to Github. 
- Now we need to push our code to Heroku, so run `git push heroku master`. It will likely make you login to your Heroku account through the terminal. 
- If everything worked well you should see a line (about 5 lines up from the bottom) that says `remote: https://test-api-app-test.herokuapp.com/ deployed to Heroku` with your URL. 
- Cool! Everything is deployed! 
- Now, remember how we added our `.env` file to our `.gitignore` file so that we wouldn't push our API Keys when we pushed to Github, well they won't be pushed to Heroku either. You'll need to go to your app on Heroku, click the "Settings" tab, click "Reveal Config Vars", and set them all individually in here. No equals sign is necessary, so in the left-most text area on Heroku, you'll add `CODEBUG_CORS_ORIGINS` as the key and on the right side you'll add something like `test-api.surge.sh` (which will actually be the URL where your frontend app is deployed).
- Add every environment variable to Heroku. 


### Last Step!

- Now that we've deployed, there's only 1 more step that needs to happen, and that is we need to make sure our frontend app (that we've deployed to the internet) is sending requests to our backend app (which is deployed on Heroku now). So in your frontend app, change the URLs from `http://localhost:3000` to the URL for your backend app. My test URL is: `https://test-api-app-test.herokuapp.com/`. If you scroll down below where you set the environment variables, you'll see a link to the URL. 



