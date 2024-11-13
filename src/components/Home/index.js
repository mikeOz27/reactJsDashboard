import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import '../../App.css';

const Home = ({ token, onLogout, userAuth }) => {
    console.log('userAuth', userAuth);
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users/get_users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.data.status == 'No se encontro ningun token.'){
                    console.log('No se encontro ningun token.')
                }
                // Filtra la lista de usuarios para excluir al usuario autenticado
                const fetchedUsers = response.data.status.data
                                    .filter(user => user.id !== userAuth.id) // Excluir al usuario autenticado
                                    .map(user => ({
                                        ...user,
                                        status: true // Inicializar como activos
                                    }));
                setUsers(fetchedUsers);
            } catch (error) {
                console.error('Error al obtener los usuarios', error);
            }
        };
        fetchUsers();
    }, [token]);

    // Calcular los usuarios a mostrar
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const toggleUserActivation = async (userId, isActive) => {
        try {
            if (isActive) {
                // Llama a desactivar el usuario
                await api.get(`users/desactivate_user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                // Llama a activar el usuario
                await api.get(`users/activate_user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            setUsers(users.map(user => 
                user.id === userId ? { ...user, status: !isActive } : user
            ));
        } catch (error) {
            console.error('Error al cambiar el estado del usuario', error);
        }
    };

    const [selectedUser, setSelectedUser] = useState(null); // Estado para el usuario seleccionado
    const [isModalOpen, setIsModalOpen] = useState(false);  // Estado para controlar si el modal está abierto

    // Función para cerrar el modal
    const closeModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };

    // Función para abrir el modal y establecer el usuario seleccionado
    const toggleUserView = (userId) => {
        const user = users.find(user => user.id === userId);
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    return (
        <div>
            <h1>Bienvenido {userAuth.name}</h1>
            <button onClick={onLogout} style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Cerrar sesión
            </button>
            <h3>Lista de Usuarios</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>ID</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Name</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Email</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map(user => (
                        <tr key={user.id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.id}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.name}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.email}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <button 
                                    onClick={() => toggleUserActivation(user.id, user.status)}
                                    style={{
                                        padding: '5px 10px',
                                        backgroundColor: user.status ? '#dc3545' : '#28a745',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {user.status ? '🔓' : '🔒'}
                                </button>
                                <button
                                    onClick={() => toggleUserView(user.id)}
                                    style={{
                                        padding: '5px 10px',
                                        backgroundColor: '#007bff',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        marginLeft: '5px'
                                    }}
                                >
                                    👁️‍🗨️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Modal */}
            {isModalOpen && selectedUser && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Detalles del Usuario</h2>
                        <p><strong>ID:</strong> {selectedUser.id}</p>
                        <p><strong>Name:</strong> {selectedUser.name}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        {/* Otros detalles del usuario */}
                        <button onClick={closeModal}>Cerrar</button>
                    </div>
                </div>
            )}
            {/* Paginado */}
            <div>
                {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, index) => (
                    <button key={index + 1} onClick={() => paginate(index + 1)} style={{ padding: '10px 15px', margin: '0 5px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
        
    );
};

export default Home;
