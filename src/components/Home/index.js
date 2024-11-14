import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import '../../App.css';
import 'bootstrap';
import Modal from 'react-modal';


const RegisterUserModal = ({ isOpen, onRequestClose, onRegister }) => {
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleRegisterUser = async (e) => {
        e.preventDefault();
        await onRegister(newUser);
        setNewUser({ name: '', email: '', password: '' });
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Registrar Usuario</h5>
                            <button type="button" className="close" onClick={onRequestClose} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleRegisterUser}>
                                    <div className="form-group">
                                        <label htmlFor="name">Nombre</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="name" 
                                            value={newUser.name} 
                                            name='name'
                                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} 
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input 
                                            type="email" 
                                            className="form-control" 
                                            id="email" 
                                            value={newUser.email} 
                                            name='email'
                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} 
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Contraseña</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            id="password" 
                                            value={newUser.password} 
                                            name='password'
                                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} 
                                            required 
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Registrar
                                    </button>
                                </form>
                            </div>
                            <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onRequestClose}>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const ViewUserModal = ({ isOpen, onRequestClose, user }) => (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
        <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Detalles del Usuario</h5>
                        <button type="button" className="close" onClick={onRequestClose} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p><strong>ID:</strong> {user?.id}</p>
                        <p><strong>Nombre:</strong> {user?.name}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                        {/* Otros detalles del usuario */}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={onRequestClose}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
);

const EditUserModal = ({ isOpen, onRequestClose, user, onUpdate }) => {
    const [updatedUser, setUpdatedUser] = useState(user);

    useEffect(() => {
        setUpdatedUser(user);
    }, [user]);

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        await onUpdate(updatedUser);
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <div className="modal show d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Editar Usuario</h5>
                        <button type="button" className="close" onClick={onRequestClose} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleUpdateUser}>
                                <div className="form-group">
                                    <input type="hidden" value={updatedUser?.id || ''} name='id' />
                                    <label htmlFor="name">Nombre</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="name" 
                                    value={updatedUser?.name || ''} 
                                        name='name'
                                    onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="email" 
                                    value={updatedUser?.email || ''} 
                                        name='email'
                                    onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Contraseña</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        id="password" 
                                    value={updatedUser?.password || ''} 
                                        name='password'
                                    onChange={(e) => setUpdatedUser({ ...updatedUser, password: e.target.value })} 
                                        required 
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Actualizar
                                </button>
                            </form>
                        </div>
                        <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onRequestClose}>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const Home = ({ token, onLogout, userAuth }) => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users/get_users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.data.status === 'No se encontro ningun token.'){
                    console.log('No se encontro ningun token.');
                }
                const fetchedUsers = response.data.status.data
                                    .filter(user => user.id !== userAuth.id)
                                    .map(user => ({
                                        ...user,
                                        status: true
                                    }));
                setUsers(fetchedUsers);
            } catch (error) {
                console.error('Error al obtener los usuarios', error);
            }
        };
        fetchUsers();
    }, [token, userAuth.id]);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const toggleUserActivation = async (userId, isActive) => {
        try {
            if (isActive) {
                await api.get(`users/desactivate_user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
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

    const handleRegisterUser = async (newUser) => {
        try {
            const response = await api.post('/users/register_user', newUser);
            console.log('Usuario registrado', response.data);
            setUsers([...users, newUser]);
            setRegisterModalOpen(false);
        } catch (error) {
            console.error('Error al registrar el usuario', error);
        }
    };

    const handleUpdateUser = async (updatedUser) => {
        try {
            await api.put(`/users/update_user/${updatedUser.id}`, updatedUser, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(users.map(user =>
                user.id === updatedUser.id ? updatedUser : user
            ));
            setEditModalOpen(false);
        } catch (error) {
            console.error('Error al actualizar el usuario', error);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await api.delete(`/users/delete_user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Error al eliminar el usuario', error);
        }
    };

    const openViewModal = (user) => {
        setSelectedUser(user);
        setViewModalOpen(true);
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setEditModalOpen(true);
    };

    return (
        <div className="container mt-4">
            <h1>Bienvenido, {userAuth.name}</h1>
            <button onClick={onLogout} className="btn btn-primary mb-3">
                Cerrar sesión 🗝️
            </button>
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <a className="nav-link active" href="#">Registrar usuario</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Messages</a>
                </li>
            </ul>
            <button 
                onClick={() => setRegisterModalOpen(true)} 
                className="btn btn-success mb-3"
            >
                Registrar Usuario
            </button>

            <RegisterUserModal 
                isOpen={isRegisterModalOpen} 
                onRequestClose={() => setRegisterModalOpen(false)} 
                onRegister={handleRegisterUser} 
            />

            <ViewUserModal 
                isOpen={isViewModalOpen} 
                onRequestClose={() => setViewModalOpen(false)} 
                user={selectedUser} 
            />

            <EditUserModal 
                isOpen={isEditModalOpen} 
                onRequestClose={() => setEditModalOpen(false)} 
                user={selectedUser} 
                onUpdate={handleUpdateUser} 
            />

            <h3>Lista de Usuarios</h3>
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="thead-light">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button 
                                        onClick={() => toggleUserActivation(user.id, user.status)}
                                        className={`btn ${user.status ? 'btn-success' : 'btn-success'} btn-sm`}
                                    >
                                        {user.status ? '🔓' : '🔒'}
                                    </button>
                                    <button
                                        onClick={() => openViewModal(user)}
                                        className="btn btn-info btn-sm ml-2"
                                    >
                                        👁️‍🗨️
                                    </button>
                                    <button
                                        onClick={() => deleteUser(user.id)}
                                        className="btn btn-danger btn-sm ml-2"
                                    >
                                        🗑
                                    </button>
                                    <button
                                        onClick={() => openEditModal(user)}
                                        className="btn btn-primary btn-sm ml-2"
                                    >
                                        🔄
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <nav>
                <ul className="pagination">
                    {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, index) => (
                        <li key={index + 1} className="page-item">
                            <button 
                                onClick={() => paginate(index + 1)} 
                                className="page-link"
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Home;
