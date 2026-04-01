// import { useEffect, useState } from 'react';
// import { api } from '../api/api';
// import { BarChart2, Download, Search } from 'lucide-react';
// import * as XLSX from 'xlsx';

// export default function Reportes() {
//     const [cursos, setCursos] = useState([]);
//     const [alumnos, setAlumnos] = useState([]);
//     const [asistencia, setAsistencia] = useState([]);
//     const [filtro, setFiltro] = useState({ curso: '', division: '', busqueda: '' });
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         api.getCursos().then(r => setCursos(r.data || []));
//     }, []);

//     const cargar = async () => {
//         setLoading(true);
//         const [a, as] = await Promise.all([
//             api.getAlumnos(filtro.curso || undefined, filtro.division || undefined),
//             api.getAsistencia(filtro.curso || undefined, filtro.division || undefined),
//         ]);
//         setAlumnos(a.data || []);
//         setAsistencia(as.data || []);
//         setLoading(false);
//     };

//     useEffect(() => { cargar(); }, [filtro.curso, filtro.division]);

//     const calcularResumen = (dni) => {
//         const registros = asistencia.filter(r => r.dni == dni);
//         return {
//             presente: registros.filter(r => r.estado === 'Presente').length,
//             tardanza: registros.filter(r => r.estado === 'Tardanza').length,
//             ausente: registros.filter(r => r.estado === 'Ausente').length,
//             retiro: registros.filter(r => r.estado === 'Retiro antes').length,
//             total: registros.length,
//         };
//     };

//     const alumnosFiltrados = alumnos.filter(a => {
//         const b = filtro.busqueda.toLowerCase();
//         return !b || a.apellido.toLowerCase().includes(b) ||
//             a.nombre.toLowerCase().includes(b) || a.dni.toString().includes(b);
//     });

//     const exportarAlumnos = () => {
//         const data = alumnosFiltrados.map(a => {
//             const r = calcularResumen(a.dni);
//             return {
//                 DNI: a.dni,
//                 Apellido: a.apellido,
//                 Nombre: a.nombre,
//                 Curso: a.curso,
//                 Division: a.division,
//                 Presentes: r.presente,
//                 Tardanzas: r.tardanza,
//                 Ausentes: r.ausente,
//                 'Retiro antes': r.retiro,
//                 'Total clases': r.total,
//             };
//         });
//         const ws = XLSX.utils.json_to_sheet(data);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'Alumnos');
//         XLSX.writeFile(wb, `reporte_alumnos_${new Date().toISOString().split('T')[0]}.xlsx`);
//     };

//     const exportarAsistencia = () => {
//         const data = asistencia.map(r => ({
//             DNI: r.dni,
//             Apellido: r.apellido,
//             Nombre: r.nombre,
//             Curso: r.curso,
//             Division: r.division,
//             Fecha: r.fecha,
//             Estado: r.estado,
//             'Hora Retiro': r.horaRetiro || '',
//         }));
//         const ws = XLSX.utils.json_to_sheet(data);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'Asistencia');
//         XLSX.writeFile(wb, `reporte_asistencia_${new Date().toISOString().split('T')[0]}.xlsx`);
//     };

//     const divisiones = [...new Set(cursos.filter(c => c.curso == filtro.curso).map(c => c.division))];

//     return (
//         <div>
//             <div className="flex justify-between items-center mb-6">
//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-800">Reportes</h1>
//                     <p className="text-gray-500 text-sm">Consultá y exportá la información</p>
//                 </div>
//                 <div className="flex gap-2 flex-wrap">
//                     <button
//                         onClick={exportarAlumnos}
//                         className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
//                     >
//                         <Download size={16} /> Alumnos Excel
//                     </button>
//                     <button
//                         onClick={exportarAsistencia}
//                         className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
//                     >
//                         <Download size={16} /> Asistencia Excel
//                     </button>
//                 </div>
//             </div>

//             {/* Filtros */}
//             <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-wrap gap-3 border border-gray-100">
//                 <div className="flex items-center gap-2 flex-1 min-w-[180px] border border-gray-200 rounded-xl px-3 py-2">
//                     <Search size={16} className="text-gray-400" />
//                     <input
//                         placeholder="Buscar alumno..."
//                         value={filtro.busqueda}
//                         onChange={e => setFiltro({ ...filtro, busqueda: e.target.value })}
//                         className="flex-1 focus:outline-none text-sm"
//                     />
//                 </div>
//                 <select
//                     value={filtro.curso}
//                     onChange={e => setFiltro({ ...filtro, curso: e.target.value, division: '' })}
//                     className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                 >
//                     <option value="">Todos los cursos</option>
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
//                     <option value="">Todas las divisiones</option>
//                     {divisiones.map(d => <option key={d} value={d}>{d}</option>)}
//                 </select>
//             </div>

//             {loading ? (
//                 <div className="text-center py-20 text-gray-400">Cargando...</div>
//             ) : alumnosFiltrados.length === 0 ? (
//                 <div className="text-center py-20 text-gray-400">
//                     <BarChart2 size={48} className="mx-auto mb-3 opacity-30" />
//                     <p>No hay datos para mostrar</p>
//                 </div>
//             ) : (
//                 <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-x-auto">
//                     <table className="w-full text-sm">
//                         <thead className="bg-indigo-50 text-indigo-700 font-semibold">
//                             <tr>
//                                 <th className="px-4 py-3 text-left">Alumno</th>
//                                 <th className="px-4 py-3 text-center">Curso</th>
//                                 <th className="px-4 py-3 text-center text-green-600">Presentes</th>
//                                 <th className="px-4 py-3 text-center text-yellow-600">Tardanzas</th>
//                                 <th className="px-4 py-3 text-center text-red-600">Ausentes</th>
//                                 <th className="px-4 py-3 text-center text-orange-600">Retiros</th>
//                                 <th className="px-4 py-3 text-center">Total</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {alumnosFiltrados.map((a, i) => {
//                                 const r = calcularResumen(a.dni);
//                                 return (
//                                     <tr key={i} className={`border-t border-gray-100 hover:bg-gray-50 transition-all ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
//                                         <td className="px-4 py-3">
//                                             <p className="font-medium text-gray-800">{a.apellido}, {a.nombre}</p>
//                                             <p className="text-xs text-gray-400">DNI: {a.dni}</p>
//                                         </td>
//                                         <td className="px-4 py-3 text-center">{a.curso}° {a.division}</td>
//                                         <td className="px-4 py-3 text-center font-semibold text-green-600">{r.presente}</td>
//                                         <td className="px-4 py-3 text-center font-semibold text-yellow-600">{r.tardanza}</td>
//                                         <td className="px-4 py-3 text-center font-semibold text-red-600">{r.ausente}</td>
//                                         <td className="px-4 py-3 text-center font-semibold text-orange-600">{r.retiro}</td>
//                                         <td className="px-4 py-3 text-center text-gray-500">{r.total}</td>
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// }





import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { Download, Search, Users, Calendar, BarChart2 } from 'lucide-react';
import * as XLSX from 'xlsx';

const TABS = [
    { id: 'alumnos', label: 'Listado de Alumnos', icon: Users },
    { id: 'fecha', label: 'Asistencia por Fecha', icon: Calendar },
    { id: 'mensual', label: 'Asistencia Mensual', icon: BarChart2 },
];

export default function Reportes() {
    const [tab, setTab] = useState('alumnos');
    const [cursos, setCursos] = useState([]);

    // Filtros compartidos
    const [filtroCurso, setFiltroCurso] = useState('');
    const [filtroDiv, setFiltroDiv] = useState('');
    const [busqueda, setBusqueda] = useState('');

    // Tab: fecha
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

    // Tab: mensual
    const [mes, setMes] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

    // Datos
    const [alumnos, setAlumnos] = useState([]);
    const [asistencia, setAsistencia] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.getCursos().then(r => setCursos(r.data || []));
    }, []);

    const cargar = async () => {
        setLoading(true);
        const [a, as] = await Promise.all([
            api.getAlumnos(filtroCurso || undefined, filtroDiv || undefined),
            api.getAsistencia(filtroCurso || undefined, filtroDiv || undefined),
        ]);
        setAlumnos(a.data || []);
        setAsistencia(as.data || []);
        setLoading(false);
    };

    useEffect(() => {
        setFiltroDiv('');
        setBusqueda('');
    }, [filtroCurso]);

    useEffect(() => { cargar(); }, [filtroCurso, filtroDiv]);

    const divisiones = [...new Set(cursos.filter(c => c.curso == filtroCurso).map(c => c.division))];

    const alumnosFiltrados = alumnos.filter(a => {
        const b = busqueda.toLowerCase();
        return !b || a.apellido.toLowerCase().includes(b) ||
            a.nombre.toLowerCase().includes(b) || a.dni.toString().includes(b);
    });

    // ── Asistencia por fecha ──────────────────────────────
    const asistenciaFecha = alumnosFiltrados.map(a => {
        const reg = asistencia.find(r => String(r.dni) === String(a.dni) && r.fecha === fecha);
        return {
            ...a,
            estado: reg?.estado || '—',
            horaRetiro: reg?.horaRetiro || '',
        };
    });

    // ── Asistencia mensual ────────────────────────────────
    const asistenciaMensual = alumnosFiltrados.map(a => {
        const registros = asistencia.filter(r =>
            String(r.dni) === String(a.dni) && r.fecha?.startsWith(mes)
        );
        return {
            ...a,
            presentes: registros.filter(r => r.estado === 'Presente').length,
            tardanzas: registros.filter(r => r.estado === 'Tardanza').length,
            ausentes: registros.filter(r => r.estado === 'Ausente').length,
            retiros: registros.filter(r => r.horaRetiro).length,
            total: registros.length,
        };
    });

    // ── Exportaciones ─────────────────────────────────────
    const exportarAlumnos = () => {
        const data = alumnosFiltrados.map(a => ({
            DNI: a.dni,
            Apellido: a.apellido,
            Nombre: a.nombre,
            Curso: `${a.curso}°`,
            División: a.division,
        }));
        exportXlsx(data, `alumnos_${filtroCurso || 'todos'}${filtroDiv || ''}`);
    };

    const exportarFecha = () => {
        const data = asistenciaFecha.map(a => ({
            DNI: a.dni,
            Apellido: a.apellido,
            Nombre: a.nombre,
            Curso: `${a.curso}°`,
            División: a.division,
            Fecha: fecha,
            Estado: a.estado,
            'Hora Retiro': a.horaRetiro,
        }));
        exportXlsx(data, `asistencia_${fecha}_${filtroCurso || 'todos'}${filtroDiv || ''}`);
    };

    const exportarMensual = () => {
        const data = asistenciaMensual.map(a => ({
            DNI: a.dni,
            Apellido: a.apellido,
            Nombre: a.nombre,
            Curso: `${a.curso}°`,
            División: a.division,
            Mes: mes,
            Presentes: a.presentes,
            Tardanzas: a.tardanzas,
            Ausentes: a.ausentes,
            'Retiros anticipados': a.retiros,
            'Días registrados': a.total,
        }));
        exportXlsx(data, `mensual_${mes}_${filtroCurso || 'todos'}${filtroDiv || ''}`);
    };

    const exportXlsx = (data, nombre) => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
        XLSX.writeFile(wb, `${nombre}.xlsx`);
    };

    const exportarActual = () => {
        if (tab === 'alumnos') exportarAlumnos();
        if (tab === 'fecha') exportarFecha();
        if (tab === 'mensual') exportarMensual();
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Reportes</h1>
                    <p className="text-gray-500 text-sm">Consultá y exportá la información</p>
                </div>
                <button
                    onClick={exportarActual}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
                >
                    <Download size={16} /> Exportar Excel
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {TABS.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setTab(id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border
              ${tab === id
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}
                    >
                        <Icon size={15} /> {label}
                    </button>
                ))}
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-wrap gap-3 border border-gray-100">
                <select
                    value={filtroCurso}
                    onChange={e => setFiltroCurso(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                    <option value="">Todos los cursos</option>
                    {[...new Set(cursos.map(c => c.curso))].map(c => (
                        <option key={c} value={c}>{c}°</option>
                    ))}
                </select>

                <select
                    value={filtroDiv}
                    onChange={e => setFiltroDiv(e.target.value)}
                    disabled={!filtroCurso}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
                >
                    <option value="">Todas las divisiones</option>
                    {divisiones.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                {tab === 'fecha' && (
                    <input
                        type="date"
                        value={fecha}
                        onChange={e => setFecha(e.target.value)}
                        className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                )}

                {tab === 'mensual' && (
                    <input
                        type="month"
                        value={mes}
                        onChange={e => setMes(e.target.value)}
                        className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                )}

                <div className="flex items-center gap-2 flex-1 min-w-[180px] border border-gray-200 rounded-xl px-3 py-2">
                    <Search size={16} className="text-gray-400" />
                    <input
                        placeholder="Buscar alumno..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        className="flex-1 focus:outline-none text-sm"
                    />
                </div>
            </div>

            {/* Contenido */}
            {loading ? (
                <div className="text-center py-20 text-gray-400">Cargando...</div>
            ) : (
                <>
                    {/* TAB: Alumnos */}
                    {tab === 'alumnos' && (
                        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-indigo-50 text-indigo-700 font-semibold">
                                    <tr>
                                        <th className="px-4 py-3 text-left">DNI</th>
                                        <th className="px-4 py-3 text-left">Apellido</th>
                                        <th className="px-4 py-3 text-left">Nombre</th>
                                        <th className="px-4 py-3 text-center">Curso</th>
                                        <th className="px-4 py-3 text-center">División</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alumnosFiltrados.length === 0 ? (
                                        <tr><td colSpan={5} className="text-center py-12 text-gray-400">No hay alumnos</td></tr>
                                    ) : alumnosFiltrados.map((a, i) => (
                                        <tr key={i} className={`border-t border-gray-100 hover:bg-gray-50 ${i % 2 !== 0 ? 'bg-gray-50/50' : ''}`}>
                                            <td className="px-4 py-3 text-gray-500">{a.dni}</td>
                                            <td className="px-4 py-3 font-medium text-gray-800">{a.apellido}</td>
                                            <td className="px-4 py-3 text-gray-700">{a.nombre}</td>
                                            <td className="px-4 py-3 text-center">{a.curso}°</td>
                                            <td className="px-4 py-3 text-center">{a.division}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* TAB: Asistencia por fecha */}
                    {tab === 'fecha' && (
                        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-indigo-50 text-indigo-700 font-semibold">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Alumno</th>
                                        <th className="px-4 py-3 text-center">Curso</th>
                                        <th className="px-4 py-3 text-center">Estado</th>
                                        <th className="px-4 py-3 text-center">Hora Retiro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {asistenciaFecha.length === 0 ? (
                                        <tr><td colSpan={4} className="text-center py-12 text-gray-400">No hay datos</td></tr>
                                    ) : asistenciaFecha.map((a, i) => (
                                        <tr key={i} className={`border-t border-gray-100 hover:bg-gray-50 ${i % 2 !== 0 ? 'bg-gray-50/50' : ''}`}>
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-gray-800">{a.apellido}, {a.nombre}</p>
                                                <p className="text-xs text-gray-400">DNI: {a.dni}</p>
                                            </td>
                                            <td className="px-4 py-3 text-center">{a.curso}° {a.division}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-1 rounded-lg text-xs font-medium
                          ${a.estado === 'Presente' ? 'bg-green-100 text-green-700' :
                                                        a.estado === 'Tardanza' ? 'bg-yellow-100 text-yellow-700' :
                                                            a.estado === 'Ausente' ? 'bg-red-100 text-red-700' :
                                                                'bg-gray-100 text-gray-500'}`}>
                                                    {a.estado}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-500">{a.horaRetiro || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* TAB: Mensual */}
                    {tab === 'mensual' && (
                        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-indigo-50 text-indigo-700 font-semibold">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Alumno</th>
                                        <th className="px-4 py-3 text-center">Curso</th>
                                        <th className="px-4 py-3 text-center text-green-600">Presentes</th>
                                        <th className="px-4 py-3 text-center text-yellow-600">Tardanzas</th>
                                        <th className="px-4 py-3 text-center text-red-600">Ausentes</th>
                                        <th className="px-4 py-3 text-center text-orange-600">Retiros</th>
                                        <th className="px-4 py-3 text-center">Días reg.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {asistenciaMensual.length === 0 ? (
                                        <tr><td colSpan={7} className="text-center py-12 text-gray-400">No hay datos</td></tr>
                                    ) : asistenciaMensual.map((a, i) => (
                                        <tr key={i} className={`border-t border-gray-100 hover:bg-gray-50 ${i % 2 !== 0 ? 'bg-gray-50/50' : ''}`}>
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-gray-800">{a.apellido}, {a.nombre}</p>
                                                <p className="text-xs text-gray-400">DNI: {a.dni}</p>
                                            </td>
                                            <td className="px-4 py-3 text-center">{a.curso}° {a.division}</td>
                                            <td className="px-4 py-3 text-center font-semibold text-green-600">{a.presentes}</td>
                                            <td className="px-4 py-3 text-center font-semibold text-yellow-600">{a.tardanzas}</td>
                                            <td className="px-4 py-3 text-center font-semibold text-red-600">{a.ausentes}</td>
                                            <td className="px-4 py-3 text-center font-semibold text-orange-600">{a.retiros}</td>
                                            <td className="px-4 py-3 text-center text-gray-500">{a.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}