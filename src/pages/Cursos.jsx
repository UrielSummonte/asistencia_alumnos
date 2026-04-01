import { useEffect, useState } from 'react';
import { api } from '../api/api';
import Modal from '../components/Modal';
import { PlusCircle, Trash2, BookOpen } from 'lucide-react';

export default function Cursos() {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ curso: '', division: '' });
    const [msg, setMsg] = useState('');

    const cargar = async () => {
        setLoading(true);
        const res = await api.getCursos();
        setCursos(res.data || []);
        setLoading(false);
    };

    useEffect(() => { cargar(); }, []);

    const guardar = async () => {
        if (!form.curso || !form.division) return setMsg('Completá todos los campos');
        const res = await api.addCurso(form.curso, form.division);
        if (res.ok) { setShowModal(false); setForm({ curso: '', division: '' }); cargar(); }
        else setMsg(res.msg);
    };

    const eliminar = async (curso, division) => {
        if (!confirm(`¿Eliminar ${curso}° "${division}"?`)) return;
        await api.deleteCurso(curso, division);
        cargar();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Cursos y Divisiones</h1>
                    <p className="text-gray-500 text-sm">Gestioná los cursos disponibles</p>
                </div>
                <button
                    onClick={() => { setShowModal(true); setMsg(''); }}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-all"
                >
                    <PlusCircle size={18} /> Nuevo Curso
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-400">Cargando...</div>
            ) : cursos.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
                    <p>No hay cursos cargados aún</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {cursos.map((c, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow p-5 flex flex-col items-center gap-3 border border-gray-100 hover:shadow-md transition-all">
                            <div className="bg-indigo-100 text-indigo-700 rounded-full w-14 h-14 flex items-center justify-center text-xl font-bold">
                                {c.curso}°{c.division}
                            </div>
                            <p className="font-semibold text-gray-700">{c.curso}° División {c.division}</p>
                            <button
                                onClick={() => eliminar(c.curso, c.division)}
                                className="text-red-400 hover:text-red-600 transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <Modal title="Nuevo Curso" onClose={() => setShowModal(false)}>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Curso (número)</label>
                            <input
                                type="number"
                                placeholder="Ej: 1"
                                value={form.curso}
                                onChange={e => setForm({ ...form, curso: e.target.value })}
                                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">División (letra)</label>
                            <input
                                type="text"
                                placeholder="Ej: A"
                                value={form.division}
                                onChange={e => setForm({ ...form, division: e.target.value.toUpperCase() })}
                                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                        {msg && <p className="text-red-500 text-sm">{msg}</p>}
                        <button
                            onClick={guardar}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-medium transition-all"
                        >
                            Guardar
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}