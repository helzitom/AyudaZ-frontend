export const ROLES = {
    VOLUNTARIO: 'voluntario',
    AYUDADO: 'ayudado',
    ADMIN: 'admin',
};

export const ESTADO_SOLICITUD = {
    ACTIVA: 'activa',
    EN_PROCESO: 'en_proceso',
    CERRADA: 'cerrada',
    CANCELADA: 'cancelada',
};

export const API_ENDPOINTS = {
    VERIFY: '/auth/verify',
    REGISTRO_VOLUNTARIO: '/auth/registro/voluntario',
    REGISTRO_AYUDADO: '/auth/registro/ayudado',
    SOLICITUDES_ACTIVAS: '/solicitudes/activas',
    CREAR_SOLICITUD: '/solicitudes',
    OFRECER_AYUDA: (id) => `/solicitudes/${id}/ofrecer`,
    RANKING: '/ranking/mensual',
    ADMIN_PENDIENTES: '/admin/pendientes',
    ADMIN_APROBAR: (id) => `/admin/aprobar/${id}`,
    ADMIN_ELIMINAR: (id) => `/admin/eliminar/${id}`,
};