import React, { useState } from 'react';

// Authentication Page (Login/Register)
// Authentication Page (Login/Register)
const AuthPage = ({ onLoginSuccess, onGoBack }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); // Only for register
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => { // Made async to handle fetch
        e.preventDefault();
        setMessage(''); // Clear previous messages

        const API_BASE_URL = 'http://localhost:5000/api/auth'; // Backend auth endpoint

        try {
            let response;
            let responseData; // Use a new variable for parsed JSON data

            if (isLoginMode) {
                response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                responseData = await response.json(); // Parse JSON response

                if (response.ok) {
                    setMessage('Login successful!');
                    // Pass the entire user object and token from backend response
                    onLoginSuccess({
                        token: responseData.token,
                        id: responseData.user.id,
                        username: responseData.user.username,
                        email: responseData.user.email,
                        isAdmin: responseData.user.isAdmin
                    });
                } else {
                    setMessage(`Login failed: ${responseData.message || 'Invalid credentials.'}`);
                }
            } else {
                response = await fetch(`${API_BASE_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });
                responseData = await response.json(); // Parse JSON response

                if (response.ok) {
                    setMessage(`Registration successful for ${username}! Please log in.`);
                    setIsLoginMode(true); // Switch to login mode after successful registration
                    setEmail(''); // Clear form fields
                    setPassword('');
                    setUsername('');
                } else {
                    setMessage(`Registration failed: ${responseData.message || 'An error occurred.'}`);
                }
            }
        } catch (error) {
            console.error('Auth API call error:', error);
            setMessage(`Network error: ${error.message}. Please ensure the backend is running.`);
        }
    };

    return (
        <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    {isLoginMode ? 'Login' : 'Register'}
                </h2>
                {message && (
                    <div className={`p-3 mb-4 rounded-md text-center ${message.includes('failed') || message.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLoginMode && (
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                                placeholder="Your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required={!isLoginMode}
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                            placeholder="your@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 transform hover:scale-105"
                    >
                        {isLoginMode ? 'Login' : 'Register'}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button
                            onClick={() => {
                                setIsLoginMode(!isLoginMode);
                                setMessage(''); // Clear messages when switching mode
                                setEmail('');
                                setPassword('');
                                setUsername('');
                            }}
                            className="text-blue-500 hover:text-blue-700 font-semibold focus:outline-none"
                        >
                            {isLoginMode ? 'Register here' : 'Login here'}
                        </button>
                    </p>
                    <button
                        onClick={onGoBack}
                        className="mt-4 text-gray-500 hover:text-gray-700 text-sm focus:outline-none"
                    >
                        &larr; Go back
                    </button>
                </div>
            </div>
        </div>
    );
};
export default AuthPage;
