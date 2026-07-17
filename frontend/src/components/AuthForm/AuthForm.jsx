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
            <section className="auth-intro">
                <p className="auth-eyebrow">Supply Chain Operations</p>

                <h1>Risk & Vendor Performance Tracker</h1>

                <p className="auth-description">
                    Track purchase orders, identify supply chain risks, manage
                    corrective actions, and review vendor performance in one place.
                </p>

                <ul className="auth-features">
                    <li>Monitor late deliveries and quantity shortages</li>
                    <li>Track corrective actions and issue status</li>
                    <li>Create data-driven vendor scorecards</li>
                </ul>
            </section>

            <section className="auth-card">
                <form className="auth-form" onSubmit={handleSubmit}>
                    <p className="auth-form-label">
                        {mode === "login" ? "Welcome back" : "Create your account"}
                    </p>

                    <h2>{mode === "login" ? "Login" : "Register"}</h2>

                    {mode === "register" && (
                        <>
                            <label htmlFor="authName">Name</label>
                            <input
                                id="authName"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                autoComplete="name"
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
                        autoComplete="email"
                        required
                    />

                    <label htmlFor="authPassword">Password</label>
                    <input
                        id="authPassword"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete={
                            mode === "login" ? "current-password" : "new-password"
                        }
                        minLength="6"
                        required
                    />

                    {errorMessage && (
                        <p className="auth-error" role="alert">
                            {errorMessage}
                        </p>
                    )}

                    <button className="auth-submit-button" type="submit">
                        {mode === "login" ? "Login" : "Register"}
                    </button>

                    <button
                        className="auth-toggle-button"
                        type="button"
                        onClick={toggleMode}
                    >
                        {mode === "login"
                            ? "Create an account"
                            : "Already have an account? Login"}
                    </button>
                </form>
            </section>
        </main>
    );
}

AuthForm.propTypes = {
    onLogin: PropTypes.func.isRequired,
    onRegister: PropTypes.func.isRequired,
};

export default AuthForm;