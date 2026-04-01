// import { useEffect, useState } from 'react';
// import { api } from '../api/api';
// import { ClipboardList, Save } from 'lucide-react';

// const ESTADOS = ['Presente', 'Tardanza', 'Ausente', 'Retiro antes'];

// const COLORES = {
//     'Presente': 'bg-green-100 text-green-700 border-green-300',
//     'Tardanza': 'bg-yellow-100 text-yellow-700 border-yellow-300',
//     'Ausente': 'bg-red-100 text-red-700 border-red-300',
//     'Retiro antes': 'bg-orange-100 text-orange-700 border-orange-300',
// };

// export default function Asistencia() {
//     const [cursos, setCursos] = useState([]);
//     const [filtro, setFiltro] = useState({ curso: '', division: '' });
//     const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
//     const [alumnos, setAlumnos] = useState([]);
//     const [asistencia, setAsistencia] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [guardando, setGuardando] = useState(false);
//     const [msg, setMsg] = useState('');

//     useEffect(() => {
//         api.getCursos().then(r => setCursos(r.data || []));
//     }, []);

//     const cargarAlumnos = async () => {
//         if (!filtro.curso || !filtro.division) return;
//         setLoading(true);
//         setMsg('');
//         const [a, as] = await Promise.all([
//             api.getAlumnos(filtro.curso, filtro.division),
//             api.getAsistencia(filtro.curso, filtro.division, fecha),
//         ]);
//         const alumnosData = a.data || [];
//         const asistenciaData = as.data || [];

//         // Mapear asistencia existente
//         const mapa = {};
//         asistenciaData.forEach(r => {
//             mapa[r.dni] = { estado: r.estado, horaRetiro: r.horaRetiro || '' };
//         });

//         // Completar con "Presente" por defecto si no hay registro
//         alumnosData.forEach(al => {
//             if (!mapa[al.dni]) mapa[al.dni] = { estado: 'Presente', horaRetiro: '' };
//         });

//         setAlumnos(alumnosData);
//         setAsistencia(mapa);
//         setLoading(false);
//     };

//     useEffect(() => { cargarAlumnos(); }, [filtro, fecha]);

//     const setEstado = (dni, estado) => {
//         setAsistencia(prev => ({
//             ...prev,
//             [dni]: { ...prev[dni], estado, horaRetiro: estado !== 'Retiro antes' ? '' : prev[dni]?.horaRetiro }
//         }));
//     };

//     const setHora = (dni, hora) => {
//         setAsistencia(prev => ({ ...prev, [dni]: { ...prev[dni], horaRetiro: hora } }));
//     };

//     const guardar = async () => {
//         if (!filtro.curso || !filtro.division) return;
//         setGuardando(true);
//         const registros = alumnos.map(a => ({
//             dni: a.dni,
//             apellido: a.apellido,
//             nombre: a.nombre,
//             curso: a.curso,
//             division: a.division,
//             fecha,
//             estado: asistencia[a.dni]?.estado || 'Presente',
//             horaRetiro: asistencia[a.dni]?.horaRetiro || '',
//         }));
//         const res = await api.saveAsistencia(registros);
//         setGuardando(false);
//         setMsg(res.ok ? '✅ Asistencia guardada correctamente' : '❌ Error al guardar');
//         setTimeout(() => setMsg(''), 4000);
//     };

//     const divisiones = [...new Set(cursos.filter(c => c.curso == filtro.curso).map(c => c.division))];

//     const resumen = alumnos.reduce((acc, a) => {
//         const estado = asistencia[a.dni]?.estado || 'Presente';
//         acc[estado] = (acc[estado] || 0) + 1;
//         return acc;
//     }, {});

//     return (
//         <div>
//             <div className="flex justify-between items-center mb-6">
//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-800">Tomar Asistencia</h1>
//                     <p className="text-gray-500 text-sm">Seleccioná curso, división y fecha</p>
//                 </div>
//             </div>

//             {/* Filtros */}
//             <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-wrap gap-3 border border-gray-100">
//                 <select
//                     value={filtro.curso}
//                     onChange={e => setFiltro({ curso: e.target.value, division: '' })}
//                     className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                 >
//                     <option value="">Seleccioná curso</option>
//                     {[...new Set(cursos.map(c => c.curso))].map(c => (
//                         <option key={c} value={c}>{c}°</option>
//                     ))}
//                 </select>
//                 <select
//                     value={filtro.division}
//                     onChange={e => setFiltro({ ...filtro, division: e.target.value })}
//                     className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                     disabled={!filtro.curso}
//                 >
//                     <option value="">Seleccioná división</option>
//                     {divisiones.map(d => <option key={d} value={d}>{d}</option>)}
//                 </select>
//                 <input
//                     type="date"
//                     value={fecha}
//                     onChange={e => setFecha(e.target.value)}
//                     className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                 />
//             </div>

//             {/* Resumen */}
//             {alumnos.length > 0 && (
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
//                     {ESTADOS.map(e => (
//                         <div key={e} className={`rounded-2xl border px-4 py-3 text-center ${COLORES[e]}`}>
//                             <p className="text-2xl font-bold">{resumen[e] || 0}</p>
//                             <p className="text-xs font-medium">{e}</p>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Lista */}
//             {loading ? (
//                 <div className="text-center py-20 text-gray-400">Cargando alumnos...</div>
//             ) : !filtro.curso || !filtro.division ? (
//                 <div className="text-center py-20 text-gray-400">
//                     <ClipboardList size={48} className="mx-auto mb-3 opacity-30" />
//                     <p>Seleccioná un curso y división para comenzar</p>
//                 </div>
//             ) : alumnos.length === 0 ? (
//                 <div className="text-center py-20 text-gray-400">No hay alumnos en este curso</div>
//             ) : (
//                 <>
//                     <div className="flex flex-col gap-3 mb-6">
//                         {alumnos.map((a, i) => (
//                             <div key={i} className="bg-white rounded-2xl shadow border border-gray-100 px-4 py-3 flex flex-wrap items-center gap-3">
//                                 <div className="flex-1 min-w-[150px]">
//                                     <p className="font-semibold text-gray-800">{a.apellido}, {a.nombre}</p>
//                                     <p className="text-xs text-gray-400">DNI: {a.dni}</p>
//                                 </div>
//                                 <div className="flex flex-wrap gap-2">
//                                     {ESTADOS.map(estado => (
//                                         <button
//                                             key={estado}
//                                             onClick={() => setEstado(a.dni, estado)}
//                                             className={`px-3 py-1 rounded-lg border text-xs font-medium transition-all
//                         ${asistencia[a.dni]?.estado === estado
//                                                     ? COLORES[estado] + ' shadow-sm scale-105'
//                                                     : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'}`}
//                                         >
//                                             {estado}
//                                         </button>
//                                     ))}
//                                 </div>
//                                 {asistencia[a.dni]?.estado === 'Retiro antes' && (
//                                     <input
//                                         type="time"
//                                         value={asistencia[a.dni]?.horaRetiro || ''}
//                                         onChange={e => setHora(a.dni, e.target.value)}
//                                         className="border border-orange-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
//                                     />
//                                 )}
//                             </div>
//                         ))}
//                     </div>

//                     <div className="flex items-center justify-between">
//                         {msg && <p className="text-sm font-medium">{msg}</p>}
//                         <button
//                             onClick={guardar}
//                             disabled={guardando}
//                             className="ml-auto flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-all"
//                         >
//                             <Save size={18} />
//                             {guardando ? 'Guardando...' : 'Guardar Asistencia'}
//                         </button>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// }



import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { ClipboardList, Save, LogOut } from 'lucide-react';

const ESTADOS = ['Presente', 'Tardanza', 'Ausente'];

const COLORES = {
    'Presente': 'bg-green-100 text-green-700 border-green-300',
    'Tardanza': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'Ausente': 'bg-red-100 text-red-700 border-red-300',
};

export default function Asistencia() {
    const [cursos, setCursos] = useState([]);
    const [filtro, setFiltro] = useState({ curso: '', division: '' });
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [alumnos, setAlumnos] = useState([]);
    const [asistencia, setAsistencia] = useState({});
    const [loading, setLoading] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        api.getCursos().then(r => setCursos(r.data || []));
    }, []);

    const cargarAlumnos = async () => {
        if (!filtro.curso || !filtro.division) return;
        setLoading(true);
        setMsg('');
        const [a, as] = await Promise.all([
            api.getAlumnos(filtro.curso, filtro.division),
            api.getAsistencia(filtro.curso, filtro.division, fecha),
        ]);
        const alumnosData = a.data || [];
        const asistenciaData = as.data || [];

        const mapa = {};
        asistenciaData.forEach(r => {
            mapa[r.dni] = {
                estado: r.estado,
                retiro: !!r.horaRetiro,
                horaRetiro: r.horaRetiro || '',
            };
        });

        alumnosData.forEach(al => {
            if (!mapa[al.dni]) mapa[al.dni] = { estado: 'Presente', retiro: false, horaRetiro: '' };
        });

        setAlumnos(alumnosData);
        setAsistencia(mapa);
        setLoading(false);
    };

    useEffect(() => { cargarAlumnos(); }, [filtro, fecha]);

    const setEstado = (dni, estado) => {
        setAsistencia(prev => ({
            ...prev,
            [dni]: {
                ...prev[dni],
                estado,
                // Si pasa a Ausente, limpiamos el retiro
                retiro: estado === 'Ausente' ? false : prev[dni]?.retiro,
                horaRetiro: estado === 'Ausente' ? '' : prev[dni]?.horaRetiro,
            }
        }));
    };

    const toggleRetiro = (dni) => {
        setAsistencia(prev => ({
            ...prev,
            [dni]: {
                ...prev[dni],
                retiro: !prev[dni]?.retiro,
                horaRetiro: !prev[dni]?.retiro ? '' : '',
            }
        }));
    };

    const setHora = (dni, hora) => {
        setAsistencia(prev => ({ ...prev, [dni]: { ...prev[dni], horaRetiro: hora } }));
    };

    const guardar = async () => {
        if (!filtro.curso || !filtro.division) return;
        setGuardando(true);
        const registros = alumnos.map(a => ({
            dni: a.dni,
            apellido: a.apellido,
            nombre: a.nombre,
            curso: a.curso,
            division: a.division,
            fecha,
            estado: asistencia[a.dni]?.estado || 'Presente',
            horaRetiro: asistencia[a.dni]?.retiro ? asistencia[a.dni]?.horaRetiro : '',
        }));
        const res = await api.saveAsistencia(registros);
        setGuardando(false);
        setMsg(res.ok ? '✅ Asistencia guardada correctamente' : '❌ Error al guardar');
        setTimeout(() => setMsg(''), 4000);
    };

    const divisiones = [...new Set(cursos.filter(c => c.curso == filtro.curso).map(c => c.division))];

    const resumen = alumnos.reduce((acc, a) => {
        const estado = asistencia[a.dni]?.estado || 'Presente';
        acc[estado] = (acc[estado] || 0) + 1;
        return acc;
    }, {});

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Tomar Asistencia</h1>
                    <p className="text-gray-500 text-sm">Seleccioná curso, división y fecha</p>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-wrap gap-3 border border-gray-100">
                <select
                    value={filtro.curso}
                    onChange={e => setFiltro({ curso: e.target.value, division: '' })}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                    <option value="">Seleccioná curso</option>
                    {[...new Set(cursos.map(c => c.curso))].map(c => (
                        <option key={c} value={c}>{c}°</option>
                    ))}
                </select>
                <select
                    value={filtro.division}
                    onChange={e => setFiltro({ ...filtro, division: e.target.value })}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    disabled={!filtro.curso}
                >
                    <option value="">Seleccioná división</option>
                    {divisiones.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <input
                    type="date"
                    value={fecha}
                    onChange={e => setFecha(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
            </div>

            {/* Resumen */}
            {alumnos.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {ESTADOS.map(e => (
                        <div key={e} className={`rounded-2xl border px-4 py-3 text-center ${COLORES[e]}`}>
                            <p className="text-2xl font-bold">{resumen[e] || 0}</p>
                            <p className="text-xs font-medium">{e}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Lista */}
            {loading ? (
                <div className="text-center py-20 text-gray-400">Cargando alumnos...</div>
            ) : !filtro.curso || !filtro.division ? (
                <div className="text-center py-20 text-gray-400">
                    <ClipboardList size={48} className="mx-auto mb-3 opacity-30" />
                    <p>Seleccioná un curso y división para comenzar</p>
                </div>
            ) : alumnos.length === 0 ? (
                <div className="text-center py-20 text-gray-400">No hay alumnos en este curso</div>
            ) : (
                <>
                    <div className="flex flex-col gap-3 mb-6">
                        {alumnos.map((a, i) => {
                            const reg = asistencia[a.dni] || { estado: 'Presente', retiro: false, horaRetiro: '' };
                            const puedeRetirar = reg.estado !== 'Ausente';

                            return (
                                <div key={i} className="bg-white rounded-2xl shadow border border-gray-100 px-4 py-3">

                                    {/* Fila principal */}
                                    <div className="flex flex-wrap items-center gap-3">

                                        {/* Nombre */}
                                        <div className="flex-1 min-w-[150px]">
                                            <p className="font-semibold text-gray-800">{a.apellido}, {a.nombre}</p>
                                            <p className="text-xs text-gray-400">DNI: {a.dni}</p>
                                        </div>

                                        {/* Botones de estado */}
                                        <div className="flex gap-2">
                                            {ESTADOS.map(estado => (
                                                <button
                                                    key={estado}
                                                    onClick={() => setEstado(a.dni, estado)}
                                                    className={`px-3 py-1 rounded-lg border text-xs font-medium transition-all
                            ${reg.estado === estado
                                                            ? COLORES[estado] + ' shadow-sm scale-105'
                                                            : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'}`}
                                                >
                                                    {estado}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Botón retiro */}
                                        <button
                                            onClick={() => puedeRetirar && toggleRetiro(a.dni)}
                                            disabled={!puedeRetirar}
                                            title={!puedeRetirar ? 'No disponible para alumnos ausentes' : 'Registrar retiro anticipado'}
                                            className={`flex items-center gap-1 px-3 py-1 rounded-lg border text-xs font-medium transition-all
                        ${!puedeRetirar
                                                    ? 'opacity-30 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-200'
                                                    : reg.retiro
                                                        ? 'bg-orange-100 text-orange-700 border-orange-300 shadow-sm scale-105'
                                                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'}`}
                                        >
                                            <LogOut size={13} />
                                            Retiro
                                        </button>
                                    </div>

                                    {/* Campo hora retiro */}
                                    {reg.retiro && puedeRetirar && (
                                        <div className="mt-3 flex items-center gap-3 pl-1">
                                            <span className="text-xs text-orange-600 font-medium">🕐 Hora de retiro:</span>
                                            <input
                                                type="time"
                                                value={reg.horaRetiro}
                                                onChange={e => setHora(a.dni, e.target.value)}
                                                className="border border-orange-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                                            />
                                        </div>
                                    )}

                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-between">
                        {msg && <p className="text-sm font-medium">{msg}</p>}
                        <button
                            onClick={guardar}
                            disabled={guardando}
                            className="ml-auto flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-all"
                        >
                            <Save size={18} />
                            {guardando ? 'Guardando...' : 'Guardar Asistencia'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}