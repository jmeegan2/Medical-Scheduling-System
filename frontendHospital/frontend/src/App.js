import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

function App() {
  return (
    <div className="App">

      <Login />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

// client/src/App.js (or client/src/Login.js if it's a separate file)

// Make sure you import React and useState at the top of your file
// If this is in App.js, you might have other imports like './App.css', logo from './logo.svg';

function Login(){
  // 1. Define state variables to hold input values and messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // To display success or error messages to the user

  // 2. Define the function to handle form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the browser's default form submission (which causes a page reload)

    setMessage('Logging in...'); // Provide immediate feedback while waiting for API response

    try {
      // 3. Make the API call to your backend
      // IMPORTANT: Double-check that your backend is running on http://localhost:5000
      // If it's on a different port, change this URL.
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST', // This is a POST request
        headers: {
          'Content-Type': 'application/json', // We are sending JSON data
        },
        // Send the username and password from your state as a JSON string
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json(); // Parse the JSON response from the backend

      // 4. Handle the API response based on success or failure
      if (response.ok) { // Check if the response status is 2xx (e.g., 200 OK)
        setMessage('Login successful!');
        console.log('Login successful:', data); // Log the full response to the console
        // Store the JWT (JSON Web Token) in localStorage for future authenticated requests
        localStorage.setItem('token', data.token);

        // --- IMPORTANT NEXT STEPS AFTER SUCCESSFUL LOGIN ---
        // You would typically redirect the user to a dashboard,
        // or update the UI to show they are logged in.
        // For now, it will just show a success message and log the token.
        // ----------------------------------------------------

      } else {
        // Login failed (e.g., 401 Unauthorized, 400 Bad Request from your backend)
        setMessage(data.msg || 'Login failed. Please check your credentials.'); // Display backend's error message
        console.error('Login failed:', data);
      }
    } catch (error) {
      // Handle network errors (e.g., backend server not running, no internet connection)
      console.error('Network error during login:', error);
      setMessage('Network error. Please ensure the backend server is running and accessible.');
    }
  };

  return(
    <div className="main">
        <h1>GeeksforGeeks</h1>
        <h3>Enter your login credentials</h3>

        {/* 5. Attach the onSubmit handler to the form */}
        <form onSubmit={handleLogin}>
            <label htmlFor="username"> {/* Using "username" for consistency */}
                Username:
            </label>
            <input
                type="text"
                id="username" // Match the htmlFor
                name="username" // Match the state variable name
                placeholder="Enter your Username"
                required
                value={username} // 6. Bind input value to state
                onChange={(e) => setUsername(e.target.value)} // 7. Update state on change
            />

            <br/> <br/>

            <label htmlFor="password">
                Password:
            </label>
            <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your Password"
                required
                value={password} // 6. Bind input value to state
                onChange={(e) => setPassword(e.target.value)} // 7. Update state on change
            />

            <div className="wrap">
                <button type="submit">
                    Submit
                </button>
            </div>
        </form>

        <p>Not registered?
            <a href="#" style={{ textDecoration: "none" }}>
                Create an account
            </a>
        </p>

        {/* 8. Display success or error messages to the user */}
        {message && <p>{message}</p>}
    </div>
  );
}

// If Login is in its own file (e.g., client/src/components/Login.js), remember to export it:
// export default Login;

// If Login is defined within App.js, then only App needs to be exported default:
// export default App;


export default App;
