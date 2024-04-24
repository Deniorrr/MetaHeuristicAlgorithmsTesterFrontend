# MetaHeuristic Algorithms Tester - Frontend

## About

This is a frontend part of a fullstack app that can test multiple metaheuristic algorithms on many fitness functions. The app allows you to upload your custom metaheuristic algorithm and fitness function, by uploading a .dll file
that contains necessary functions and variables accodring to the instruction. Then you can select multiple algorithms and fitness functions, and the backend will run a simulation and send back the result. The result is displayed 
in the app, but can be downloaded as well as a .pdf or .txt file.

## Technologies

The app uses React.js supported by Axios for api requests and Material UI for good look and quick development of the app.

## Running the app

In the project directory `/frontend`, you can install all dependencies:

### `npm i`

and then run the project:

### `npm start`

It runs the app in the development mode.\
Open [http://localhost:3000/MetaHeuristicAlgorithmsTesterFrontend](http://localhost:3000/MetaHeuristicAlgorithmsTesterFrontend) to view it in your browser.

## Setting a custom Api address

To set a custom address for API endpoints go to `/frontend/src/components/apiConfig.js`.
There you can replace the baseURL for your custom address.

## Author

Denis Poczęty
