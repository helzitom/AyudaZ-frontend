import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegHeart, FaGoogle, FaFacebook, FaUserPlus } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

const useWindowSize = () => {
    const [size, setSize] = useState({ width: window.innerWidth });
    useEffect(() => {
        const handleResize = () => setSize({ width: window.innerWidth });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return size;
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginWithEmail, loginWithGoogle, loginWithFacebook } = useAuth();
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const isMobile = width < 640;
    const cardPadding = isMobile ? "34px 22px" : "42px 40px";
    const titleFontSize = isMobile ? 34 : 40;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await loginWithEmail(email, password);
            navigate('/dashboard');
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setLoading(true);
        try {
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (error) {
            alert('Error con Google: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFacebook = async () => {
        setLoading(true);
        try {
            await loginWithFacebook();
            navigate('/dashboard');
        } catch (error) {
            alert('Error con Facebook: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>
                {`
                    body, #root {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: linear-gradient(145deg, #f5f7fc 0%, #eef2f6 100%) !important;
                        min-height: 100vh;
                        width: 100%;
                        overflow-x: hidden;
                        box-sizing: border-box;
                    }
                    input:focus, button:focus, textarea:focus, select:focus, a:focus {
                        outline: none !important;
                        box-shadow: none !important;
                    }
                    * {
                        -webkit-tap-highlight-color: transparent;
                    }
                `}
            </style>

            <div
                style={{
                    width: "100%",
                    maxWidth: "100%",
                    margin: "0 auto",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "24px 16px",
                    boxSizing: "border-box",
                    fontFamily: "Inter, system-ui, sans-serif",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: 480,
                        background: "#ffffff",
                        borderRadius: 32,
                        padding: cardPadding,
                        boxShadow: "0 20px 35px -12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)",
                        boxSizing: "border-box",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            marginBottom: 34,
                        }}
                    >
                        <div
                            style={{
                                width: 72,
                                height: 72,
                                background: "linear-gradient(135deg, #1e1e2a 0%, #121217 100%)",
                                borderRadius: 24,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 15px 25px -8px rgba(0,0,0,0.2)",
                                marginBottom: 20,
                            }}
                        >
                            <FaRegHeart style={{ color: "white", fontSize: 34 }} />
                        </div>
                        <h1
                            style={{
                                fontSize: titleFontSize,
                                fontWeight: 800,
                                color: "#18181b",
                                margin: 0,
                                letterSpacing: "-0.03em",
                                textAlign: "center",
                            }}
                        >
                            Ayuda Z
                        </h1>
                        <p
                            style={{
                                marginTop: 10,
                                fontSize: 15,
                                color: "#5b5b6e",
                                textAlign: "center",
                                lineHeight: 1.5,
                            }}
                        >
                            Red de apoyo comunitario y solidaridad
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            style={{
                                width: "100%",
                                height: 56,
                                padding: "0 18px",
                                borderRadius: 20,
                                border: "1.5px solid #e2e4e9",
                                outline: "none",
                                fontSize: 15,
                                background: "#fff",
                                color: "#1a1a1a",
                                boxSizing: "border-box",
                                transition: "border 0.2s",
                            }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "#18181b")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e4e9")}
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            style={{
                                width: "100%",
                                height: 56,
                                padding: "0 18px",
                                borderRadius: 20,
                                border: "1.5px solid #e2e4e9",
                                outline: "none",
                                fontSize: 15,
                                background: "#fff",
                                color: "#1a1a1a",
                                boxSizing: "border-box",
                                transition: "border 0.2s",
                            }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "#18181b")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e4e9")}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                height: 56,
                                border: "none",
                                borderRadius: 20,
                                background: loading ? "#a0a0a8" : "#18181b",
                                color: "white",
                                fontSize: 15,
                                fontWeight: 600,
                                cursor: loading ? "not-allowed" : "pointer",
                                transition: "all 0.2s",
                            }}
                        >
                            {loading ? "Cargando..." : "Iniciar sesión"}
                        </button>
                    </form>

                    <button
                        onClick={handleGoogle}
                        disabled={loading}
                        style={{
                            width: "100%",
                            height: 56,
                            borderRadius: 20,
                            border: "1.5px solid #e2e4e9",
                            background: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 12,
                            fontSize: 15,
                            fontWeight: 500,
                            color: "#202124",
                            cursor: loading ? "not-allowed" : "pointer",
                            transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#f8f9fa")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                    >
                        <FaGoogle style={{ color: "#ea4335", fontSize: 18 }} />
                        Continuar con Google
                    </button>

                    <button
                        onClick={handleFacebook}
                        disabled={loading}
                        style={{
                            width: "100%",
                            height: 56,
                            borderRadius: 20,
                            border: "none",
                            background: loading ? "#86a9e0" : "#1877f2",
                            marginTop: 14,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 12,
                            fontSize: 15,
                            fontWeight: 600,
                            color: "white",
                            cursor: loading ? "not-allowed" : "pointer",
                            transition: "background 0.2s",
                            boxShadow: "0 6px 14px rgba(24,119,242,0.25)",
                        }}
                        onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#166fe0")}
                        onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "#1877f2")}
                    >
                        <FaFacebook style={{ fontSize: 18 }} />
                        Continuar con Facebook
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "30px 0" }}>
                        <div style={{ flex: 1, height: 1, background: "#e9ecef" }} />
                        <span style={{ fontSize: 14, color: "#7c7c8a" }}>o</span>
                        <div style={{ flex: 1, height: 1, background: "#e9ecef" }} />
                    </div>

                    <div
                        style={{
                            marginTop: 28,
                            paddingTop: 22,
                            borderTop: "1px solid #efefef",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <button
                            onClick={() => navigate('/register')}
                            disabled={loading}
                            style={{
                                border: "none",
                                background: "transparent",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                color: "#6c6c7e",
                                fontSize: 14,
                                fontWeight: 500,
                                cursor: loading ? "not-allowed" : "pointer",
                                transition: "color 0.2s",
                            }}
                            onMouseEnter={(e) => !loading && (e.currentTarget.style.color = "#18181b")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#6c6c7e")}
                        >
                            <FaUserPlus />
                            Crear cuenta
                        </button>
                    </div>
                </div>

                <p
                    style={{
                        marginTop: 32,
                        fontSize: 12.5,
                        color: "#6c6c7e",
                        textAlign: "center",
                        lineHeight: 1.5,
                    }}
                >
                    Al continuar, aceptas nuestros términos de servicio y política de privacidad
                </p>
            </div>
        </>
    );
};

export default Login;