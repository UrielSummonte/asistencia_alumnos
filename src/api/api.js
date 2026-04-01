import { API_URL } from '../config';

// async function call(params) {
//     const url = new URL(API_URL);
//     Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
//     const res = await fetch(url.toString());
//     return res.json();
// }

async function call(params) {
    const url = new URL(API_URL);
    Object.entries(params).forEach(([k, v]) => {
        // Solo agregamos si el valor existe y no es el texto "undefined"
        if (v !== undefined && v !== null && v !== '') {
            url.searchParams.append(k, v);
        }
    });
    const res = await fetch(url.toString());
    return res.json();
}

async function post(action, body) {
    const url = new URL(API_URL);
    url.searchParams.append('action', action);
    const res = await fetch(url.toString(), {
        method: 'POST',
        body: JSON.stringify(body),
    });
    return res.json();
}

export const api = {
    getCursos: () => call({ action: 'getCursos' }),
    addCurso: (curso, division) => call({ action: 'addCurso', curso, division }),
    deleteCurso: (curso, division) => call({ action: 'deleteCurso', curso, division }),

    getAlumnos: (curso, division) => call({ action: 'getAlumnos', curso, division }),
    addAlumno: (dni, apellido, nombre, curso, division) =>
        call({ action: 'addAlumno', dni, apellido, nombre, curso, division }),
    deleteAlumno: (dni) => call({ action: 'deleteAlumno', dni }),

    getAsistencia: (curso, division, fecha) =>
        call({ action: 'getAsistencia', curso, division, fecha }),
    saveAsistencia: (registros) => post('saveAsistencia', { registros }),
    getResumenAlumno: (dni) => call({ action: 'getResumenAlumno', dni }),
};