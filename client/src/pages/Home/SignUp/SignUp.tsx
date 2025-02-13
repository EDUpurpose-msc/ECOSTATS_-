import React, { useState } from "react";
import 'boxicons/css/boxicons.min.css';
import { Link, Button, Paper, TextField, Typography, MenuItem, Select, FormControl, InputLabel, Alert, LinearProgress, CircularProgress } from "@mui/material";
import { useRoleStore } from "../../../stores/useRoleStore";
import { signup } from "../../../services/api/userApi";
import { AxiosResponse } from "axios";
import { ValidationError } from "../../../types/ApiValidationError";
import FieldError from "../../../components/FieldError";
import { useNavigate } from "react-router-dom";
import GuestGuard from "../../../components/Guards/GuestGuard";


function SignUp() {

    const containerStyle : React.CSSProperties = {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundSize: "cover",
        backgroundPosition: "center",
    };

    const glassEffectStyle : React.CSSProperties = {
        padding: "2rem",
        borderRadius: "15px",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        width: "90%",
        maxWidth: "400px",
    };

    const headingStyle : React.CSSProperties = {
        fontSize: "2rem",
        fontWeight: "600",
        color: "#fff",
        marginBottom: "1.5rem",
        fontFamily: '"Poppins", sans-serif',
    };

    const textFieldStyle  = {
        marginBottom: "0rem",
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

    const navigate = useNavigate();

    const roles = [
        {
            name : "Planning Officer",
            value : "planning officer"
        },
        {
            name : "Chief",
            value : "chief"
        },
        {
            name : "Focal",
            value : "focal"
        },
    ];

    const [isSaving, setIsSaving] = useState<boolean>(false);

    const [ errors , setErrors ] = useState<ValidationError[]>([])

    const [ signupFormData, setSignupFormData ] = useState({
        name: '',
        email : '',
        password : '',
        passwordConfirmation : '',
        role : ''
    });

    const handleFormControlChange = (e) => {
        const { name, value } = e.target;
        setSignupFormData({ ...signupFormData, [name]: value });
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true)
        setErrors([])
        try {
            const { email, password, name, role } = signupFormData;
            if(signupFormData.password != signupFormData.passwordConfirmation){
                setErrors([{path: "passwordConfirmation", location: "", msg : "Pasword doesnt match.", type: ""}])
                return;
            }
            const res = await signup({ email, password, name, role });
            navigate("/login")
        } catch (error : any) {
            console.log(error)
            if(error.response.status = 422){
                setErrors([...error.response.data.errors])
            }
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <GuestGuard redirectTo="/">
            <div style={containerStyle}>
                <Paper style={glassEffectStyle}>
                    <Typography component="h1" variant="h5" style={headingStyle}>Register</Typography>
                    {/* <Alert severity="error" style={{marginBottom: "1rem", textAlign: "initial"}}></Alert> */}
                    <form onSubmit={handleSignupSubmit}> {/* Updated handler */}
                        <div className="mb-5">
                            <TextField
                                sx={textFieldStyle}
                                label="Name"
                                fullWidth
                                variant="outlined"
                                placeholder="Enter Name"
                                name="name"
                                value={signupFormData.name}
                                onChange={handleFormControlChange}
                            />
                            <FieldError errors={errors} name="name" />
                        </div>

                        <div className="mb-5">
                            <TextField
                                sx={textFieldStyle}
                                label="Email"
                                fullWidth
                                variant="outlined"
                                type="email"
                                placeholder="Enter Email"
                                name="email"
                                value={signupFormData.email}
                                onChange={handleFormControlChange}
                            />
                            <FieldError errors={errors} name="email" />
                        </div>

                        <div className="mb-5">
                            <TextField
                                sx={textFieldStyle}
                                label="Password"
                                fullWidth
                                variant="outlined"
                                type="password"
                                placeholder="Enter Password"
                                name="password"
                                value={signupFormData.password}
                                onChange={handleFormControlChange}
                            />
                            <FieldError errors={errors} name="password" />
                        </div>

                        <div className="mb-5">
                            <TextField
                                sx={textFieldStyle}
                                label="Confirm Password"
                                fullWidth
                                variant="outlined"
                                type="password"
                                placeholder="Confirm Password"
                                name="passwordConfirmation"
                                value={signupFormData.passwordConfirmation}
                                onChange={handleFormControlChange}
                            />
                            <FieldError errors={errors} name="passwordConfirmation" />    
                        </div>
    
                        <div className="mb-5">
                            <FormControl fullWidth sx={{  ...textFieldStyle }}>
                                <InputLabel sx={{ color: "rgba(255, 255, 255, 0.7)" }}>User Role</InputLabel>
                                <Select
                                    label="User Role"
                                    sx={{ color: "#fff" }}
                                    value={signupFormData.role}
                                    name="role"
                                    onChange={handleFormControlChange}
                                >
                                    {
                                        roles.map(role => {
                                            return (<MenuItem value={role.value} key={role.value}>{role.name}</MenuItem>)
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <FieldError errors={errors} name="userRole" />
                        </div>
                        <Button disabled={isSaving} style={btnStyle} variant="contained" type="submit" > 
                            { isSaving && <CircularProgress className="me-2" size={20} /> }
                            Register
                        </Button>
                    </form>
                    <Typography style={linkStyle}>
                        Already have an account? <Link href="/login" style={{ color: "#fff", textDecoration: "underline" }}>Login</Link>
                    </Typography>
                </Paper>
            </div>
        </GuestGuard>
    );
}

export default SignUp;