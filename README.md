# Whisky Database
**IMPORTANT**: This project is currently in development and not yet ready for use.

This is a fun "long weekend" project where I wanted to show my partner how I can transform his excel "database" easily in an application. 
As he wanted to use the app on iOS, Android and desktop I decided to give react another try. I haven't touched it since 2019, and then I only did a nanodegree. The other option would've been Kotlin Multiplatform but it would've taken me more time to set it up and get it right.
The base structure of the project was pretty much created by ChatGPT-4o. Only after a while I decided to implement changes on my own when I was fed up by the slow generation speed of answers. I then only used it for some detailed questions and for transforming the existing data into a format that I can use to feed into Firebase.

## Features
- Whisky overview that shows all whiskies or those found that match a given filter
- Add new whiskies
- Edit existing whiskies
- German UI

**Outlook:**
- The app should get a nicer design
- Maybe some fancy AI stuff with image recognition?

## Techstack
**React** in the frontend as it seemed easy enough to use as a noob and especially easy to host.  
**Firebase** as my cloud service as it offers what I needed for free and I already used it in some native projects. (I make use of Firestore, Storage and Authentication)

## Setup
1. Ensure you have Node.js and npm installed. You can download them from nodejs.org.
2. You need a Firebase instance for your project and set up the following services:
- Firestore
- Storage
- Authentication

Create an `.env` file with the following values (coming from your firebase config)
```
REACT_APP_FIREBASE_API_KEY="[API_KEY]"
REACT_APP_FIREBASE_AUTH_DOMAIN="[AUTH_DOMAIN]"
REACT_APP_FIREBASE_PROJECT_ID="[PROJECT_ID]"
REACT_APP_FIREBASE_STORAGE_BUCKET="[STORAGE_BUCKET]"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="[MESSAGING_SENDER_ID]"
REACT_APP_FIREBASE_APP_ID="[APP_ID]"
```
3. Run `npm start` in your project folder

## Licence
This project is licensed under the terms of the MIT license.
