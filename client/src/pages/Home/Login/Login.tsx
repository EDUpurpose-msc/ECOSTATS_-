import { useState } from "react";
import 'boxicons/css/boxicons.min.css';
import { Link, Button, Paper, TextField, Typography, Alert } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { login, loginV2 } from "../../../services/api/userApi";
import AuthToken from "../../../types/AuthToken";
import Cookies from "js-cookie";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import GuestGuard from "../../../components/Guards/GuestGuard";
import { message } from "antd";
import { parseResError } from "../../../services/errorHandler";


const Login = () => {
    // styles
    const containerStyle : React.CSSProperties = {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundSize: "cover",
        backgroundPosition: "center",
    };
    
    const paperStyle : React.CSSProperties = {
        padding: "2rem",
        borderRadius: "15px",
        backdropFilter: "blur(10px)",  
        backgroundColor: "rgba(255, 255, 255, 0.1)", 
        boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        width: "100%",
        maxWidth: "600px",
    };
    
    const heading : React.CSSProperties = {
        fontSize: "2rem",
        fontWeight: "600",
        color: "#fff",
        marginBottom: "1.5rem",
        fontFamily: '"Poppins", sans-serif',
    };
    
    const row : React.CSSProperties = {
        display: "flex",
        marginTop: "1rem",
        marginBottom: "1rem",
        alignItems: "center",
        color: "#fff",
    };
    
    const textFieldStyle  = {
        '& .MuiInputBase-root': {
            color: "#fff",
        },
        '& .MuiInputLabel-root': {
            color: "rgba(255, 255, 255, 0.7)",
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&:hover fieldset': {
                borderColor: '#fff',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#fff',
            },
        },
    };
    
    const btnStyle : React.CSSProperties = {
        marginTop: "1.5rem",
        padding: "0.7rem",
        fontSize: "1rem",
        fontWeight: "700",
        borderRadius: "30px",
        backgroundColor: "#fff",
        color: "#333",
        width: "100%",
        textTransform: "none",
    };
    
    const linkStyle : React.CSSProperties = {
        color: "#fff",
        fontWeight: "600",
        textDecoration: "none",
        marginTop: "1rem",
    };

    // state
    const navigate = useNavigate();
    const { setTokens } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginFailStatus, setLoginFailStatus] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await loginV2({email:email, password:password});
            const tokens : AuthToken|null = {
                accessToken : res.data.accessToken,
                refreshToken : res.data.refreshToken
            };
            if(!tokens){
                setLoginFailStatus(true);
                return;
            }
            setLoginFailStatus(false);
            Cookies.set("accessToken", tokens.accessToken, {expires: 7});
            Cookies.set("refreshToken", tokens.refreshToken, {expires: 7});
            setTokens(tokens);
            location.href = "/";

        } catch (error) {
            console.log(error)
            messageApi.error(parseResError(error).msg)
        }
        
    }

    return (
        <GuestGuard redirectTo="/">
            {contextHolder}
            <div style={containerStyle}>
                <Grid >
                    <Paper 
                    style={paperStyle} 
                    sx={{ width: { xs: '80vw', sm: '50vw', md: '40vw', lg: '35vw', xl: '20vw' },  }}
                    >
                        <Typography component="h1" variant="h5" style={heading}>Login</Typography>
                        <form onSubmit={handleLogin}>
                            <span style={row}>
                                <TextField sx={textFieldStyle} label="Email" fullWidth variant="outlined" type="email" placeholder="Enter Email" name="email" onChange={(e) => setEmail(e.target.value)}  />
                            </span>
                            <span style={row}>
                                <TextField sx={textFieldStyle} label="Password" fullWidth variant="outlined" type="password" placeholder="Enter Password" name="password" onChange={(e) => setPassword(e.target.value)}  />
                            </span>
                            {
                                loginFailStatus ? (<Alert severity="error">Invalid email and password</Alert>) : ''
                            }
                            <Button style={btnStyle} variant="contained" type="submit">Login</Button>
                        </form>
                        <p style={linkStyle}>Don't have an account? <Link href="/signup" style={{ color: "#fff", textDecoration: "underline" }}>SignUp</Link></p>
                        <p style={linkStyle}>Forgot Password? <Link href="/forgot-password" style={{ color: "#fff", textDecoration: "underline" }}>Reset Password</Link></p>
                    </Paper>
                </Grid>
            </div>
        </GuestGuard>
    );
}

export default Login;