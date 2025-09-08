Project Overview
This Listings Project allows users to browse, create, update, and delete property listings. It supports rich search by category, location, and other filters, displays detailed information about listings, and integrates user reviews. Locations are geocoded using MapTiler, and images are uploaded and stored with cloud storage. The project uses authentication to protect listing management features. Also authorize the user.

Features
->User authentication (login/signup) with Passport.js
->Create, read, update, delete (CRUD) operations for listings
->Search and filter listings by category, location, and keywords
->Geolocation integration for mapped coordinates using MapTiler API
->Image upload support using Multer and cloud storage
->User reviews system with ratings and comments
->Responsive UI with EJS templates and Bootstrap
->Flash messages for success/error notifications
->Secure sessions and cookie management
->Custom error handling including 404 pages.

Usage
->Navigate to /listings to browse all available listings.
->Use the search bar or category filters to find specific properties.
->Register or log in to create new listings, add reviews, or edit existing listings that you own.
->Listing creation supports address geocoding and image uploads.
->View detailed listing pages with images, location on map, and user reviews.

Tech Stack
->Node.js & Express.js for backend.
->MongoDB with Mongoose ORM
->EJS templating engine with ejs-mate for layouts.
->Passport.js for authentication.
->Multer for image upload handling.
->MapTiler API for geocoding and maps.
->Bootstrap for responsive UI.
->Connect-mongo for session store.
->Express-session and connect-flash for session and flash message handling.

License
->This project is licensed under the MIT License.

Contributing
->Contributions are welcome! To contribute:
->Fork the repo
->Create a feature branch
->Make your changes and commit them with clear messages
->Submit a Pull Request describing your changes
->Please ensure code quality and test any changes before contributing.

