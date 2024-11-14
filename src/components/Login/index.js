import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';


const Login = ({ setToken, setUser }) => {
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('login', { email, password });
      if(response.data.status.code == 400) {
        console.log('Error al iniciar sesión', response.data);
        localStorage.removeItem('token'); // Limpiar el token en caso de error
        localStorage.removeItem('userAuth'); // Limpiar el usuario autenticado en caso de error
        setErrorMessage('Error al iniciar sesión. Verifique sus credenciales.');
        return;
      }
      const token = response.data.status.token;
      const userAuth = response.data.status.user;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userAuth', JSON.stringify(userAuth));

      setToken(token);
      setUser(userAuth);
      setErrorMessage(''); // Limpiar el mensaje de error en caso de éxito
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      localStorage.removeItem('token'); // Limpiar el token en caso de error
      localStorage.removeItem('userAuth'); // Limpiar el usuario autenticado en caso de error
  
      if (error.response && error.response.data && error.response.data.message) {
          setErrorMessage(error.response.data.message);
      } else {
          setErrorMessage('Error al iniciar sesión. Verifique sus credenciales.');
      }
    }
  };

	return (
		<div className="container mt-5">
		<div className="row justify-content-center">
			<div className="col-md-6">
			<div className="card">
				<div className="card-body">
				<h3 className="card-title text-center mb-4">Iniciar Sesión</h3>
				{errorMessage && (
					<div className="alert alert-danger" role="alert">
					{errorMessage}
					</div>
				)}
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
					<label htmlFor="email" className="form-label">Email:</label>
					<input
						type="email"
						id="email"
						className="form-control"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					</div>
					<div className="mb-3">
					<label htmlFor="password" className="form-label">Password:</label>
					<input
						type="password"
						id="password"
						className="form-control"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					</div>
					<button type="submit" className="btn btn-primary w-100">Login</button>
				</form>
				</div>
			</div>
			</div>
		</div>
		</div>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  inputGroup: {
    marginBottom: '15px',
    width: '100%',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Login;