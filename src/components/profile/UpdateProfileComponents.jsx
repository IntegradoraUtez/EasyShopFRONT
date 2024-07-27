import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const UpdateProfileComponents = () => {
  const [username, setUsername] = useState('Nombre de Usuario');
  const [email, setEmail] = useState('usuario@ejemplo.com');
  const [birthdate, setBirthdate] = useState('1990-01-01');
  const [gender, setGender] = useState('Masculino');
  const [userType, setUserType] = useState('Administrador');
  const [fullName, setFullName] = useState('Juan Pérez');
  const navigate = useNavigate();

  const handleUpdate = (event) => {
    event.preventDefault();
    // Aquí puedes manejar la lógica de actualización
    console.log({
      username,
      email,
      birthdate,
      gender,
      userType,
      fullName
    });
  };

  const handleBack = () => {
    navigate('/profile'); 
  };

  return (
    <div className="update-profile-container">
      <div className="update-profile-card">
        <h2>Actualizar Perfil</h2>
        <form onSubmit={handleUpdate}>
          <div className="row form-group">
            <div className="col-12 col-md-6">
              <label htmlFor="username">Nombre de Usuario</label>
              <input 
                type="text" 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="email">Correo</label>
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>
          <div className="row form-group">
            <div className="col-12 col-md-6">
              <label htmlFor="birthdate">Fecha de Nacimiento</label>
              <input 
                type="date" 
                id="birthdate" 
                value={birthdate} 
                onChange={(e) => setBirthdate(e.target.value)} 
                required 
              />
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="gender">Género</label>
              <select 
                id="gender" 
                value={gender} 
                onChange={(e) => setGender(e.target.value)} 
                required
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-12">
              <label htmlFor="fullName">Nombre Completo</label>
              <input 
                type="text" 
                id="fullName" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required 
              />
            </div>
          </div>
          <div className="form-group button-group">
            <button type="submit" className="update-button">Actualizar</button>
            <button type="button" className="back-button" onClick={handleBack}>Volver</button>
          </div>
        </form>
      </div>

      <style>
        {`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          .update-profile-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
          }

          .update-profile-card {
            background-color: #ffffff;
            border-radius: 15px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            padding: 30px;
            width: 100%;
            max-width: 800px;
            box-sizing: border-box;
          }

          .update-profile-card h2 {
            margin-bottom: 20px;
            color: #ECA4AF;
            text-align: center;
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-group label {
            display: block;
            margin-bottom: 5px;
            color: #333;
          }

          .form-group input, .form-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          .button-group {
            display: flex;
            justify-content: space-between;
          }

          .update-button, .back-button {
            width: 48%;
            padding: 15px;
            font-size: 16px;
            background-color: #ECA4AF;
            color: #ffffff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .update-button:hover, .back-button:hover {
            background-color: #d68b8b;
          }

          @media (max-width: 768px) {
            .form-group {
              margin-bottom: 15px;
            }

            .button-group {
              flex-direction: column;
              gap: 10px;
            }

            .update-button, .back-button {
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default UpdateProfileComponents;
