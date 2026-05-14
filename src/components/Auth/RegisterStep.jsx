import React, { useState } from 'react';

const RegisterStep = ({ tipo, onSubmit }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nombre: '',
        nombreConyuge: '',
        fechaNacimientoConyuge: '',
        lugarNacimientoConyuge: '',
        cantidadIntegrantes: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (tipo === 'voluntario') {
        return (
            <form onSubmit={handleSubmit}>
                <input name="nombre" placeholder="Nombre completo" onChange={handleChange} required />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
                <button type="submit">Registrarme como voluntario</button>
            </form>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <input name="nombre" placeholder="Nombre completo" onChange={handleChange} required />
            <input name="nombreConyuge" placeholder="Nombre del cónyuge" onChange={handleChange} required />
            <input name="fechaNacimientoConyuge" type="date" onChange={handleChange} required />
            <input name="lugarNacimientoConyuge" placeholder="Lugar de nacimiento del cónyuge" onChange={handleChange} required />
            <input name="cantidadIntegrantes" type="number" placeholder="Cantidad de integrantes" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
            <button type="submit">Solicitar ayuda</button>
        </form>
    );
};

export default RegisterStep;