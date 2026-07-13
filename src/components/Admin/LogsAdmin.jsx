import React, { useEffect, useState } from "react";
import api from "../../services/api";

const LogsAdmin = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const cargarLogs = async () => {
            try {
                const res = await api.get("/admin/logs");
                console.log("Respuesta:", res.data);
                setLogs(res.data);
            } catch (err) {
                console.error("Error cargando logs:", err);
            }
        };

        cargarLogs();
    }, []);

    return (
        <div>
            <h3>Logs de actividad</h3>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "20px",
                }}
            >
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Administrador</th>
                        <th>Acción</th>
                        <th>Detalles</th>
                        <th>Fecha</th>
                    </tr>
                </thead>

                <tbody>
                    {logs.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>
                                No hay logs registrados
                            </td>
                        </tr>
                    ) : (
                        logs.map((log) => (
                            <tr key={log.id}>
                                <td>{log.id}</td>
                                <td>{log.admin?.nombre ?? "Sin nombre"}</td>
                                <td>{log.accion}</td>
                                <td>{log.detalles}</td>
                                <td>{new Date(log.fecha).toLocaleString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LogsAdmin;