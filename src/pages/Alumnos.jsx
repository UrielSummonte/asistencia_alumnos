import { useEffect, useState } from 'react';
import { api } from '../api/api';
import Modal from '../components/Modal';
import { PlusCircle, Trash2, Users, Search } from 'lucide-react';

export default function Alumnos() {
    const [alumnos, setAlumnos] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [filtro, setFiltro] = useState({ curso: '', division: '', busqueda: '' });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ dni: '', apellido: '', nombre: '', curso: '', division: '' });
    const [msg, setMsg] = useState('');

    // const cargar = async () => {
    //     setLoading(true);
    //     const [a, c] = await Promise.all([api.getAlumnos(), api.getCursos()]);
    //     console.log(a);
    //     setAlumnos(a.data || []);
    //     setCursos(c.data || []);
    //     setLoading(false);
    // };

    const cargar = async () => {
        setLoading(true);
        const [resA, resC] = await Promise.all([api.getAlumnos(), api.getCursos()]);

        // Ahora que confirmamos que GAS devuelve un objeto con .data:
        setAlumnos(resA.data || []);
        setCursos(resC.data || []);
        setLoading(false);
    };

    useEffect(() => { cargar(); }, []);

    const guardar = async () => {
        const { dni, apellido, nombre, curso, division } = form;
        if (!dni || !apellido || !nombre || !curso || !division)
            return setMsg('Completá todos los campos');
        const res = await api.addAlumno(dni, apellido, nombre, curso, division);
        if (res.ok) { setShowModal(false); setForm({ dni: '', apellido: '', nombre: '', curso: '', division: '' }); cargar(); }
        else setMsg(res.msg);
    };

    const eliminar = async (dni, nombre) => {
        if (!confirm(`¿Eliminar a ${nombre}?`)) return;
        await api.deleteAlumno(dni);
        cargar();
    };

    const alumnosFiltrados = alumnos.filter(a => {
        const b = filtro.busqueda.toLowerCase();
        const matchBusqueda = !b || a.dni.toString().includes(b) ||
            a.apellido.toLowerCase().includes(b) || a.nombre.toLowerCase().includes(b);
        const matchCurso = !filtro.curso || a.curso == filtro.curso;
        const matchDiv = !filtro.division || a.division == filtro.division;
        return matchBusqueda && matchCurso && matchDiv;
    });

    const divisionesDelCurso = [...new Set(cursos.filter(c => c.curso == filtro.curso).map(c => c.division))];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Alumnos</h1>
                    <p className="text-gray-500 text-sm">{alumnos.length} alumnos registrados</p>
                </div>
                <button
                    onClick={() => { setShowModal(true); setMsg(''); }}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-all"
                >
                    <PlusCircle size={18} /> Nuevo Alumno
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-wrap gap-3 border border-gray-100">
                <div className="flex items-center gap-2 flex-1 min-w-[180px] border border-gray-200 rounded-xl px-3 py-2">
                    <Search size={16} className="text-gray-400" />
                    <input
                        placeholder="Buscar por nombre o DNI..."
                        value={filtro.busqueda}
                        onChange={e => setFiltro({ ...filtro, busqueda: e.target.value })}
                        className="flex-1 focus:outline-none text-sm"
                    />
                </div>
                <select
                    value={filtro.curso}
                    onChange={e => setFiltro({ ...filtro, curso: e.target.value, division: '' })}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                    <option value="">Todos los cursos</option>
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
                    <option value="">Todas las divisiones</option>
                    {divisionesDelCurso.map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-400">Cargando...</div>
            ) : alumnosFiltrados.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <Users size={48} className="mx-auto mb-3 opacity-30" />
                    <p>No se encontraron alumnos</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-indigo-50 text-indigo-700 font-semibold">
                            <tr>
                                <th className="px-4 py-3 text-left">DNI</th>
                                <th className="px-4 py-3 text-left">Apellido</th>
                                <th className="px-4 py-3 text-left">Nombre</th>
                                <th className="px-4 py-3 text-center">Curso</th>
                                <th className="px-4 py-3 text-center">División</th>
                                <th className="px-4 py-3 text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alumnosFiltrados.map((a, i) => (
                                <tr key={i} className={`border-t border-gray-100 hover:bg-gray-50 transition-all ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                                    <td className="px-4 py-3 text-gray-500">{a.dni}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{a.apellido}</td>
                                    <td className="px-4 py-3 text-gray-700">{a.nombre}</td>
                                    <td className="px-4 py-3 text-center">{a.curso}°</td>
                                    <td className="px-4 py-3 text-center">{a.division}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => eliminar(a.dni, `${a.apellido} ${a.nombre}`)} className="text-red-400 hover:text-red-600 transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <Modal title="Nuevo Alumno" onClose={() => setShowModal(false)}>
                    <div className="flex flex-col gap-3">
                        {[
                            { label: 'DNI', key: 'dni', type: 'number', placeholder: '12345678' },
                            { label: 'Apellido', key: 'apellido', type: 'text', placeholder: 'García' },
                            { label: 'Nombre', key: 'nombre', type: 'text', placeholder: 'Juan' },
                        ].map(({ label, key, type, placeholder }) => (
                            <div key={key}>
                                <label className="text-sm font-medium text-gray-600">{label}</label>
                                <input
                                    type={type}
                                    placeholder={placeholder}
                                    value={form[key]}
                                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                                    className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>
                        ))}
                        <div>
                            <label className="text-sm font-medium text-gray-600">Curso</label>
                            <select
                                value={form.curso}
                                onChange={e => setForm({ ...form, curso: e.target.value, division: '' })}
                                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                <option value="">Seleccioná un curso</option>
                                {[...new Set(cursos.map(c => c.curso))].map(c => (
                                    <option key={c} value={c}>{c}°</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">División</label>
                            <select
                                value={form.division}
                                onChange={e => setForm({ ...form, division: e.target.value })}
                                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                disabled={!form.curso}
                            >
                                <option value="">Seleccioná una división</option>
                                {cursos.filter(c => c.curso == form.curso).map((c, i) => (
                                    <option key={i} value={c.division}>{c.division}</option>
                                ))}
                            </select>
                        </div>
                        {msg && <p className="text-red-500 text-sm">{msg}</p>}
                        <button
                            onClick={guardar}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-medium transition-all mt-1"
                        >
                            Guardar
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}