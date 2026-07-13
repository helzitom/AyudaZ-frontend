import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const TodosUsuarios = () => {

    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editandoId, setEditandoId] = useState(null);
    const [editForm, setEditForm] = useState({});

    const [modalImagen, setModalImagen] = useState(false);
    const [verificacionActual, setVerificacionActual] = useState(null);


    useEffect(() => {
        cargarUsuarios();
    }, []);


    const cargarUsuarios = async () => {
        try {

            const res = await api.get('/admin/usuarios');

            setUsuarios(
                res.data.content
                    ? res.data.content
                    : res.data
            );

        } catch (error) {

            console.error(
                "Error al cargar usuarios:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    const suspender = async (id) => {

        if (!window.confirm("Supender este usuario?"))
            return;


        try {

            await api.post(`/admin/suspender/${id}`);

            cargarUsuarios();

        } catch (error) {

            alert(
                error.response?.data ||
                "Error al suspender usuario"
            );

        }

    };


    const activar = async (id) => {

        if (!window.confirm("¿Activar nuevamente este usuario?"))
            return;


        try {

            await api.post(`/admin/activar/${id}`);

            cargarUsuarios();


        } catch (error) {

            alert(
                error.response?.data ||
                "Error al activar usuario"
            );

        }

    };



    const iniciarEdicion = (usuario) => {

        setEditandoId(usuario.id);

        setEditForm({

            nombre: usuario.nombre || '',
            email: usuario.email || '',
            tipoUsuario: usuario.tipoUsuario || '',
            estado: usuario.estado || ''

        });

    };



    const cancelarEdicion = () => {

        setEditandoId(null);
        setEditForm({});

    };



    const guardarEdicion = async (id) => {

        try {

            await api.put(
                `/admin/usuarios/${id}`,
                editForm
            );


            cancelarEdicion();

            cargarUsuarios();


        } catch (error) {

            alert(
                error.response?.data ||
                "Error al guardar cambios"
            );

        }

    };



    const verEvidencia = async (usuario) => {

        try {

            const res = await api.get(
                `/admin/verificacion-pobreza/usuario/${usuario.id}`
            );


            setVerificacionActual({

                usuario,
                ...res.data

            });


            setModalImagen(true);



        } catch (error) {

            alert(
                error.response?.data ||
                "No existe verificación SISFOH"
            );

        }

    };



    if (loading) {

        return (

            <div
                style={{
                    textAlign: "center",
                    padding: 40
                }}
            >
                Cargando usuarios...
            </div>

        );

    }



    return (

        <div>


            <div
                style={{
                    overflowX: "auto"
                }}
            >


                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: 14
                    }}
                >


                    <thead
                        style={{
                            background: "#f9fafb",
                            borderBottom: "1px solid #e5e7eb"
                        }}
                    >

                        <tr>

                            <th style={{ padding: 12 }}>
                                ID
                            </th>

                            <th style={{ padding: 12 }}>
                                Nombre
                            </th>

                            <th style={{ padding: 12 }}>
                                Email
                            </th>

                            <th style={{ padding: 12 }}>
                                Rol
                            </th>

                            <th style={{ padding: 12 }}>
                                Estado
                            </th>

                            <th style={{ padding: 12 }}>
                                Verificación
                            </th>

                            <th style={{ padding: 12 }}>
                                Acciones
                            </th>

                        </tr>

                    </thead>



                    <tbody>


                        {
                            usuarios.map(usuario => (


                                <tr
                                    key={usuario.id}
                                    style={{
                                        borderBottom: "1px solid #e5e7eb"
                                    }}
                                >



                                    <td style={{ padding: 14 }}>
                                        #{usuario.id}
                                    </td>



                                    <td style={{ padding: 14 }}>


                                        {
                                            editandoId === usuario.id ?

                                                <input
                                                    value={editForm.nombre}
                                                    onChange={
                                                        e =>
                                                            setEditForm({
                                                                ...editForm,
                                                                nombre: e.target.value
                                                            })
                                                    }
                                                />

                                                :

                                                usuario.nombre || "—"

                                        }


                                    </td>




                                    <td style={{ padding: 14 }}>


                                        {
                                            editandoId === usuario.id ?

                                                <input
                                                    value={editForm.email}
                                                    disabled
                                                    onChange={
                                                        e =>
                                                            setEditForm({
                                                                ...editForm,
                                                                email: e.target.value
                                                            })
                                                    }
                                                />

                                                :

                                                usuario.email

                                        }


                                    </td>




                                    <td style={{ padding: 14 }}>

                                        <span
                                            style={{
                                                padding: "6px 12px",
                                                borderRadius: 999,
                                                background:
                                                    usuario.tipoUsuario === "admin"
                                                        ?
                                                        "#ede9fe"
                                                        :
                                                        usuario.tipoUsuario === "ayudado"
                                                            ?
                                                            "#dbeafe"
                                                            :
                                                            "#dcfce7"
                                            }}
                                        >

                                            {usuario.tipoUsuario}

                                        </span>


                                    </td>

                                    <td style={{ padding: 14 }}>


                                        <span
                                            style={{
                                                padding: "6px 12px",
                                                borderRadius: 999,

                                                background:
                                                    usuario.estado === "activo"
                                                        ?
                                                        "#dcfce7"
                                                        :
                                                        usuario.estado === "pendiente"
                                                            ?
                                                            "#fef3c7"
                                                            :
                                                            "#fee2e2"
                                            }}
                                        >

                                            {usuario.estado}

                                        </span>


                                    </td>





                                    <td style={{ padding: 14 }}>


                                        {
                                            usuario.tipoUsuario === "ayudado"

                                                ?

                                                <button
                                                    onClick={() => verEvidencia(usuario)}
                                                    style={{
                                                        background: "#8b5cf6",
                                                        color: "#fff",
                                                        border: "none",
                                                        padding: "8px 14px",
                                                        borderRadius: 8,
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Ver SISFOH
                                                </button>
                                                :
                                                "—"
                                        }
                                    </td>
                                    <td style={{ padding: 14 }}>
                                        {
                                            editandoId === usuario.id
                                                ?
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            guardarEdicion(usuario.id)
                                                        }
                                                        style={{
                                                            background: "#10b981",
                                                            color: "#fff",
                                                            border: "none",
                                                            padding: "8px",
                                                            marginRight: 5,
                                                            borderRadius: 8
                                                        }}
                                                    >
                                                        Guardar
                                                    </button>


                                                    <button
                                                        onClick={cancelarEdicion}
                                                        style={{
                                                            background: "#6b7280",
                                                            color: "#fff",
                                                            border: "none",
                                                            padding: "8px",
                                                            borderRadius: 8
                                                        }}
                                                    >
                                                        Cancelar
                                                    </button>


                                                </>


                                                :

                                                <>


                                                    <button
                                                        onClick={() =>
                                                            iniciarEdicion(usuario)
                                                        }
                                                        style={{
                                                            background: "#2563eb",
                                                            color: "#fff",
                                                            border: "none",
                                                            padding: "8px",
                                                            marginRight: 5,
                                                            borderRadius: 8
                                                        }}
                                                    >
                                                        Editar
                                                    </button>



                                                    {
                                                        usuario.estado === "rechazado"

                                                            ?

                                                            <button
                                                                onClick={() =>
                                                                    activar(usuario.id)
                                                                }
                                                            >
                                                                Activar
                                                            </button>


                                                            :

                                                            <button
                                                                onClick={() =>
                                                                    suspender(usuario.id)
                                                                }
                                                            >
                                                                Suspender
                                                            </button>
                                                    }
                                                </>
                                        }
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            {
                modalImagen &&
                verificacionActual &&
                <div
                    onClick={() => {
                        setModalImagen(false);
                        setVerificacionActual(null);
                    }}

                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,.75)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999
                    }}
                >



                    <div
    onClick={e => e.stopPropagation()}

    style={{
        background: "#fff",
        width: "90%",
        maxWidth: 1000,
        padding: 25,
        borderRadius: 20,
        position: "relative"
    }}
>

    <button
        onClick={() => {
            setModalImagen(false);
            setVerificacionActual(null);
        }}

        style={{
            position: "absolute",
            top: 15,
            right: 15,
            background: "#ef4444",
            color: "#fff",
            border: "none",
            width: 35,
            height: 35,
            borderRadius: "50%",
            fontSize: 20,
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}
    >
        ×
    </button>


    <h2>
        Constancia SISFOH
    </h2>



                        <h2>
                            Constancia SISFOH
                        </h2>


                        <p>
                            {
                                verificacionActual.usuario.nombre
                            }
                        </p>



                        <p>
                            <b>Nivel:</b>
                            {
                                verificacionActual.nivel
                            }
                        </p>



                        <p>
                            <b>Fecha:</b>
                            {
                                new Date(
                                    verificacionActual.fechaVerificacion
                                ).toLocaleString()
                            }
                        </p>




                        <p>
                            <b>Observaciones:</b>
                            <br />

                            {
                                verificacionActual.observaciones ||
                                "Sin observaciones"
                            }

                        </p>

                        <img
                            src={
                                `${(import.meta.env.VITE_API_URL || "http://localhost:8080/api").replace(/\/$/, '')}/admin/verificacion-pobreza/imagen/${verificacionActual.usuario.id}`
                            }

                            alt="SISFOH"

                            style={{
                                width: "100%",
                                maxHeight: "70vh",
                                objectFit: "contain"
                            }}
                        />
                    </div>
                </div>
            }

        </div>

    );

};


export default TodosUsuarios;