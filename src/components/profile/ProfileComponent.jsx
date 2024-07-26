import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import iconProfile from './profileIcon.png';

export const Profile = () => {
    const navigate = useNavigate();

    const handleUpdateProfile = () => {
        navigate('/updateProfile');
    };
    const handleManageAddresses = () => {
        navigate('/user/manageAddresses');
    };
    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="image-wrapper">
                        <img src={iconProfile} alt="Perfil" className="profile-image" />
                    </div>
                    <div className="profile-details">
                        <h1>Nombre de Usuario</h1>
                        <p><strong>Correo:</strong> usuario@ejemplo.com</p>
                        <p><strong>Fecha de Nacimiento:</strong> 01/01/1990</p>
                        <p><strong>Género:</strong> Masculino</p>
                        <p><strong>Tipo de Usuario:</strong> Administrador</p>
                        <p><strong>Nombre Completo:</strong> Juan Pérez</p>
                    </div>
                </div>
                <div className="button-container">
                    <button className="profile-button">Actualizar información personal</button>
                    <button className="profile-button">Cambiar contraseña</button>
                    <button className="profile-button" onClick={handleManageAddresses}>Administrar direcciones de entrega</button>
                    <button className="profile-button">Administrar tarjetas de pago</button>
                </div>
            </div>


            <style>
                {`
          .profile-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
            box-sizing: border-box;
            padding: 10px;
          }

          .profile-card {
            background-color: #ffffff;
            border-radius: 15px;
            box-shadow: 0 1px 16px rgba(0, 0, 0, 0.2);
            padding: 20px;
            width: 100%;
            max-width: 800px;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            overflow-y: auto;
          }

          .profile-header {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            margin-bottom: 20px;
          }

          .image-wrapper {
            width: 150px;
            height: 150px;
            padding: 10px;
            border-radius: 50%;
            border: 6px solid #ECA4AF;
            margin-right: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .profile-image {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }

          .profile-details {
            flex: 1;
          }

          .profile-details h1 {
            margin: 0;
            color: #ECA4AF;
            font-size: 24px;
          }

          .profile-details p {
            margin: 10px 0;
            color: #333;
            line-height: 1.5;
          }

          .profile-details p strong {
            color: #ECA4AF;
          }

          .button-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 20px;
          }

          .profile-button {
            padding: 15px;
            font-size: 16px;
            background-color: #ECA4AF;
            color: #ffffff;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            width: 100%;
            max-width: 600px;
            align-self: center;
            transition: background-color 0.3s, transform 0.3s;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .profile-button:hover {
            background-color: #ECA4AF;
            transform: scale(1.05);
          }

        
          @media (max-width: 600px) {
            .profile-header {
              flex-direction: column;
              align-items: center;
              text-align: center;
            }

            .image-wrapper {
              margin-right: 0;
              margin-bottom: 20px;
            }

            .profile-details h1 {
              font-size: 20px;
            }

            .profile-button {
              font-size: 12px;
            }


        `}
            </style>
        </div>
    );
};

export default Profile;
