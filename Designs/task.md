# Task Description
Create a small web application that displays a graph representing the fermentation process of beer using data fetched from
- https://fermentationdatasample.azurewebsites.net/api/query
- API 'docs': https://fermentationdatasample.azurewebsites.net/api/swagger/ui
> All API requests must include the header X-User with a UUID of your choice. Ensure all requests use the same UUID.

## Add new measurements
It should be possible to add new measurements to the graph.
The user should be able to input the following data:
- time of measurement
- temperature
- density

The new measurement should be sent to the API to be stored and the graph should be updated accordingly.

## Guidelines
- Please use the included app design as an orientation (colors etc.)
- To build the application, please use HTML, CSS, and JavaScript and utilize modern libraries/frameworks (e.g., React, Vue.js, Angular).
- Please focus on UI/UX and ensure the graph is responsive.
- Avoid unnecessary API calls.