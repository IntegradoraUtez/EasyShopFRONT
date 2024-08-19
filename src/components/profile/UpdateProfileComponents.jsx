import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

export const UpdateProfileComponents = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const loadUserFromLocalStorage = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setId(parsedUser.user.id || '');
        setName(parsedUser.user.name || '');
        setLastname(parsedUser.user.lastname || '');
        setBirthdate(parsedUser.user.birthdate || '');
        setGender(parsedUser.user.gender || '');
      }
    };

    loadUserFromLocalStorage();
  }, []);

  const validate = () => {
    const errors = {};

    if (!name.trim() || name.length > 30) {
      errors.name = 'El nombre es requerido y no puede exceder los 30 caracteres';
    }

    if (!lastname.trim() || lastname.length > 30) {
      errors.lastname = 'El apellido es requerido y no puede exceder los 30 caracteres';
    }

    if (new Date(birthdate) > new Date()) {
      errors.birthdate = 'La fecha de nacimiento no puede ser en el futuro';
    }

    if (!['Masculino', 'Femenino', 'Otro'].includes(gender)) {
      errors.gender = 'El género es requerido';
    }

    return errors;
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      try {
        const response = await axios.patch(
          'https://ewjkx0lte6.execute-api.us-east-1.amazonaws.com/Prod/update_user_data_patch',
          {
            id,
            name,
            lastname,
            birthdate,
            gender,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );


        const updatedUser = {
          ...JSON.parse(localStorage.getItem('user')).user,
          name,
          lastname,
          birthdate,
          gender,
        };
        localStorage.setItem('user', JSON.stringify({ user: updatedUser }));

        // Mostrar SweetAlert de confirmación para cerrar sesión
        Swal.fire({
          title: 'Confirmación',
          text: 'Se cerrara la sesión después de actualizar su perfil!!!!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar',
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await logout();
              localStorage.clear();
              Swal.fire({
                title: 'Éxito!',
                text: 'Perfil actualizado y sesión cerrada correctamente.',
                icon: 'success',
                confirmButtonText: 'OK',
              }).then(() => {
                navigate('/');
              });
            } catch (error) {
              Swal.fire({
                title: 'Error!',
                text: 'Hubo un problema al cerrar sesión.',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            }
          } else {
            Swal.fire({
              title: 'Éxito!',
              text: 'Perfil actualizado correctamente.',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then(() => {
              navigate('/profile');
            });
          }
        });
      } catch (error) {
        console.error('Error actualizando el perfil:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Hubo un problema al actualizar el perfil.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
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
            <div className="col-12">
              <label htmlFor="name">Nombre</label>
              <input 
                type="text" 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                maxLength="30"
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
          </div>
          <div className="row form-group">
            <div className="col-12">
              <label htmlFor="lastname">Apellido</label>
              <input 
                type="text" 
                id="lastname" 
                value={lastname} 
                onChange={(e) => setLastname(e.target.value)} 
                required 
                maxLength="30"
              />
              {errors.lastname && <span className="error">{errors.lastname}</span>}
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
              {errors.birthdate && <span className="error">{errors.birthdate}</span>}
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="gender">Género</label>
              <select 
                id="gender" 
                value={gender} 
                onChange={(e) => setGender(e.target.value)} 
                required
              >
                <option value="">Seleccionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.gender && <span className="error">{errors.gender}</span>}
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

          .form-group .error {
            color: red;
            font-size: 12px;
            margin-top: 5px;
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
