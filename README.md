## Neighborhood Map Project

This is Saket's Neighborhood Project for FEND Project 5.

It's been based on his favourite locations in Dubai, United Arab Emirates

### Getting started
App can be downloaded from my GitHub here: https://github.com/saketsoni/
Open the index.html to view the application.
Application is desktop and mobile friendly
On Mobile format, click on the hamburger menu to open the list. Clicking on the location or the 'close' link will close the menu
Open /js/app.js to see the ViewModel

### v0.1
####Functionality covered against rubric

1. App has a Search Bar, List View, and Map
1. The Search bar allows to filter the locations. List View and Map shows the filtered locations as per the query on the Search Bar
1. Clicking on the List View, or the Marker on the map centers the map to this location, animates the marker, and pops open the info window.
1. Code has been separated based on MVVM best practises and avoiding updating the DOM manually. Code uses obervables instead.
1. In my model I've hard coded 6 locations
1. Application utilizes Google's Map API in a synchronous manner
1. Code is ready for personal review and is neatly formatted with comments where appropriate

### v0.2
#### Updates following feedback
1. Fixed issue with Instagram API. Sandbox mode only allows API to show images that I've taken myself. I added new images on Instagram and added locations in order to show for this project
1. Added Viewport meta tag to make the app mobile responsive
1. Changed map area height to 100vh
1. Map is loaded asynchronously. Callback function added, changes made to app.js to support this.
1. Added 'use strict'; on app.js however this caused app to fail so I've removed this
1. Reduced 5 hard coded locations because I was running out of images on Instagram!
1. Changed to use setVisible method to display and hide markers
1. Changed Ajax error logging to console.log to alert instead
1. Map initialized outside of ViewModel
1. Fixed issues in style.css
1. Scripts moved to bottom of HTML for Page Speed Optimization
1. Ajax error handling fixed. Use .done and .fail.
1. Check code using JShint
1. Check app still loads without any errors

### v0.3
#### Updates following feedback
1. Changed Ajax error handling. New boolean has been added to Marker class which is toggled depending on Ajax success. InfoWindow content reflects this.
1. on Marker class, added var self = this
1. Fixed W3C Validation errors
1. close infowindow when filtering to avoid inconsistent results
1. Removed bootstrap and changed pattern to use off-canvas with hamburger menu icon for mobile devices. Use KnockoutJS to open and close menu
1. On mobile format added close link on the menu
1. On mobile format, if use clicks from the list the menu automatically closes
1. Update colors to 3-digit HEX codes
1. Check code on jshint.com and W3C Validator


####References:
* https://discussions.udacity.com/t/google-maps-marker-is-not-a-function-error/32315
* https://github.com/udacity/fend-office-hours/tree/master/Javascript%20Design%20Patterns/P5%20Project%20Overview
* https://developers.google.com/maps/
* http://knockoutjs.com/documentation/
* http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
* https://www.instagram.com/developer/endpoints/locations/
* http://jshint.com/
* http://api.jquery.com/
* https://www.udacity.com/course/viewer#!/c-ud893-nd/l-3561069759/m-3530719305