import React, { useState, useEffect } from 'react';
import api from '../../api/axios';


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
      console.log('Inicio de sesión exitoso', userAuth);
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
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
      </div>
      <button type="submit" style={styles.button}>Login</button>
      {errorMessage && (
            <div style={{ color: 'red', marginTop: '10px' }}>
                {errorMessage}
            </div>
        )}
    </form>
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