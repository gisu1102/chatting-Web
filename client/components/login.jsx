import React, { useState } from 'react';
import { login } from '../api.js';
import '../styles/login.css';
import  '../styles/authBorder.css'
import logo from '/public/images/computer.png'; // 이미지 파일 경로
const Login = ({ onLogin, onRegisterClick }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(username, password);
        if (result.error) {
            setError(result.error);
        } else {
            setError('');
            alert('로그인 성공!');
            onLogin(username);
        }
    };

    return (
        <div className='auth-container'>
            <div className='auth-form border-box'>
                <img src={logo} alt='logo' className='login-form-logo' />
                <h3>로그인</h3>
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
                    <button type='submit'>로그인</button>
                </form>
                {error && <p>{error}</p>}
                <button onClick={onRegisterClick}>회원가입</button>
            </div>
        </div>
    );
};

export default Login;