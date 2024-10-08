import React, { useState } from 'react';
import { register } from '../api.js';
import '../styles/register.css';
import  '../styles/authBorder.css'
import logo from '/public/images/blacktiger.png'; // 이미지 파일 경로

const Register = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(username, password);
        if (result.error) {
            setError(result.error);
        } else {
            setError('');
            alert('회원가입 성공!');
            onRegister();
        }
    };

    return (
        <div className='auth-container'>
            <div className='auth-form border-box'>
                <img src={logo} alt='logo' className='auth-form-logo' />
                <h3>회원가입</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type='text'
                        placeholder='아이디 입력'
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                    <input
                        type='password'
                        placeholder='비밀번호 입력'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <button type='submit'>회원가입</button>
                </form>
                {error && <p>{error}</p>}
            </div>
        </div>
    );
};

export default Register;
