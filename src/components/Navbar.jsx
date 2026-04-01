import { NavLink } from 'react-router-dom';
import { BookOpen, Users, ClipboardList, BarChart2 } from 'lucide-react';

const links = [
    { to: '/', label: 'Cursos', icon: BookOpen },
    { to: '/alumnos', label: 'Alumnos', icon: Users },
    { to: '/asistencia', label: 'Asistencia', icon: ClipboardList },
    { to: '/reportes', label: 'Reportes', icon: BarChart2 },
];

export default function Navbar() {
    return (
        <nav className="bg-indigo-700 text-white shadow-lg">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
                <span className="font-bold text-lg tracking-wide">📋 AsistenciaApp</span>
                <div className="flex gap-1 flex-wrap">
                    {links.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end
                            className={({ isActive }) =>
                                `flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${isActive ? 'bg-white text-indigo-700' : 'hover:bg-indigo-600'}`
                            }
                        >
                            <Icon size={16} />
                            {label}
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
}