import { useState } from "react";
import PropTypes from "prop-types";
import "./AuthForm.css";

function AuthForm({ onLogin, onRegister }) {
    const [mode, setMode] = useState("login");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setErrorMessage("");

        try {
            if (mode === "register") {
                await onRegister(formData);
            } else {
                await onLogin({
                    email: formData.email,
                    password: formData.password,
                });
            }

            setFormData({
                name: "",
                email: "",
                password: "",
            });
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    function toggleMode() {
        setMode((previousMode) =>
            previousMode === "login" ? "register" : "login",
        );

        setErrorMessage("");
    }

    return (
        <main className="auth-page">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Supply Chain Risk & Vendor Performance Tracker</h1>
                <h2>{mode === "login" ? "Login" : "Register"}</h2>

                {mode === "register" && (
                    <>
                        <label htmlFor="authName">Name</label>
                        <input
                            id="authName"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </>
                )}

                <label htmlFor="authEmail">Email</label>
                <input
                    id="authEmail"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="authPassword">Password</label>
                <input
                    id="authPassword"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength="6"
                    required
                />

                {errorMessage && (
                    <p className="auth-error" role="alert">
                        {errorMessage}
                    </p>
                )}

                <button type="submit">
                    {mode === "login" ? "Login" : "Register"}
                </button>

                <button type="button" onClick={toggleMode}>
                    {mode === "login"
                        ? "Create an account"
                        : "Already have an account"}
                </button>
            </form>
        </main>
    );
}

AuthForm.propTypes = {
    onLogin: PropTypes.func.isRequired,
    onRegister: PropTypes.func.isRequired,
};

export default AuthForm;