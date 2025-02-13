import UserModel from "../model/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { validationResult } from "express-validator";
import UnitModel from "../model/Unit.js";
import mongoose from "mongoose";
// import ProgramHeadModel from "../model/ProgramHead.js";
// import UnitHeadModel from "../model/UnitHead.js";
import ProgramModel from "../model/Program.js";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from 'url';
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config()

export const login = async (req, res)  => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(422).json({errors: errors.array()})
        
        const user  = await UserModel.findOne({ email: req.body.email});

        if(!user)
            return res.status(404).json({
                error: "Not Found",
                msg: "User Not found on the database"
            })

        if(!user.isActive)
            return res.status(401).json({
                error: "Unauthorized",
                msg: "User account is not active. Please contact your administrator to reactivate your account."
            })

        if(!await validatePassword(req.body.password, user.passwordHash))
            return res.status(401).json({error: "Unauthorized"});

        const accessToken = await generateJWTToken(user._id)
        user.refreshToken = await generateJWTRefreshToken(user._id)
        await user.save();

        return res.status(200).json({
            accessToken: accessToken,
            refreshToken: user.refreshToken
        });
    } catch (error) {
        return res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        );
    }
}

export const signup = async (req, res)  => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(422).json({errors: errors.array()})

        const { email, password, role, name } = req.body;
        
        const user = new UserModel({
            email,
            passwordHash : await bcrypt.hash(password, 10),
            name,
            isActive: false,
            role
        });
        await user.save({session});

        await sendVerificationEmail(user);

        await session.commitTransaction();

        return res.json(user);

    } catch (error) {
        await session.abortTransaction();
        return res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        );
    } finally {
        session.endSession();
    }
}

export const refreshToken = async (req, res)  => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json({errors: errors.array()})

        const refreshToken = req.body.refreshToken;

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) return res.status(403).json(res.status(500).json({
                error: "Action Forbidden",
                msg: "The user session has already expired."
            }));

            // Generate new access token
            const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
            return res.json({
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        });
    } catch (error) {
        return res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        );
    }
}

export const all = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const name = req.query.name; 

        const skip = (page - 1) * limit;

        const total = await UserModel.countDocuments();

        const q = name ? { name : { $regex : name, $options: "i" }, deletedAt : null } : {deletedAt  : null};

        const users = await UserModel.find(q)
                            .sort({ createdAt: -1 })
                            .skip(skip)
                            .limit(limit);

        return res.json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            users,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        ); 
    }
}

export const searchByName = async (req, res) => {
    try {
        const name = req.params.name; 

        const users = await UserModel.find({ name : { $regex : name, $options: "i" }});

        return res.json(users)
    } catch (error) {
        console.log(error)
        return res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        ); 
    }
}

// export const searchByNameAndRole = async (req, res) => {
//     try {
//         const { name, role } = req.query;
        
//         const users = 
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json(
//             { 
//                 error: 'Server error.',
//                 details : error
//             }   
//         ); 
//     }
// }

export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;

        if(!id){
            return res.status(500).json({
                error: "Invalid Parameter",
                msg: "Invalid request. Id is required"
            })
        }

        const user = await UserModel.findOne({_id:id});

        if(!user){
            return res.status(404).send({
                error: "User not found"
            })
        }

        return res.json(user);

    } catch (error) {
        console.log(error)
        return res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        );
    }
}

export const activate = async (req, res)  => {
    try {
        const id = req.params.id;
        if(!id){
            return res.status(400).json({
                error: "Invalid Parameters",
                msg: "Invalid request. Id is required."
            })
        }

        const user = await UserModel.findById(id);
        if(!user) {
            return res.status(404).json({
                error: "Not found",
                msg: "User not found in the database."
            })
        }
        user.isActive = true;
        await user.save()

        return res.status(200).json();
        
    } catch (error) {
        return res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        );
    }
}

export const deactivate = async (req, res)  => {
    try {
        const id = req.params.id;
        const accessToken = req.cookies.accessToken;

        if(!id ){
            return res.status(401).json({
                error: "Invalid Parameter",
                msg: "Invalid Request. The id must be present in the request"
            })
        }
        if(!accessToken ){
            return res.status(401).json({
                error: "Invalid Parameter",
                msg: "Invalid Request. The accessToken must be present in the request"
            })
        }

        const authId = getUserIdFromToken(accessToken)
        if(id == authId){
            return res.status(500).json({
                error: "Action Forbidden",
                msg: "You cannot deactivate your own account"
            })
        }

        const user = await UserModel.findById(id);
        if(!user) {
            return res.status(404).json({
                error: "Not found",
                msg: "User not found in the database."
            })
        }
        user.isActive = false;
        await user.save();

        return res.status(200).json();

    } catch (error) {
        return res.status(500).json(
            { 
                error: 'Server error.',
                details : error,
                msg: "Unexpected Error occured"
            }   
        );
    }
}

export const update = async (req, res)  => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(422).json({errors: errors.array()})
        
        const id = req.params.id;
        const name = req.body.name;
        const email = req.body.email;
        const role = req.body.role;

        const user = await UserModel.findById(id)
        user.email = email;
        user.name = name;
        user.role = role;
        await user.save()

        return res.json(user);
        
    } catch (error) {
        return res.status(500).json(
            { 
                error: 'Server error.',
                details : error,
                msg: "Unexpected Error occured"
            }   
        );
    }
}

export const assignUserToUnitOrProgram = async (req, res)  => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(422).json({errors: errors.array()})

        const userId = req.body.userId;
        const programId = req.body.programId;
        const unitId = req.body.unitId;
   
        if(programId) {
            await ProgramModel.findOneAndUpdate({ _id : programId }, { programHead : userId }).session(session);
        }
   
        if(unitId) {
            await UnitModel.findOneAndUpdate({ _id : unitId }, { unitHead : userId }).session(session);
        }

        await session.commitTransaction()
        return res.status(200).send("Ok")

    } catch (error) {
        
    } finally {
        session.endSession();
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) return res.status(404).send({
            error : "Not Found",
            msg : "User not found."
        });

        // Generate a token with a short expiration time
        const token = await generateJWTToken(user._id);

        // Send the email
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Choose your email provider or use a custom SMTP service
            auth: {
                user: process.env.MAIL_EMAIL,
                pass: process.env.MAIL_PASS, // Use environment variables for production
            },
        });

        // return res.json(transporter)

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        await transporter.sendMail({
            to: email,
            subject: 'Password Reset',
            html: 
            `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
            <style>
                body {
                font-family: Arial, sans-serif;
                color: #333333;
                background-color: #f9f9f9;
                margin: 0;
                padding: 20px;
                }
                .container {
                max-width: 600px;
                margin: auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                }
                .footer {
                font-size: 0.9em;
                color: #666666;
                margin-top: 20px;
                }
            </style>
            </head>
            <body>
            <div class="container">
                <h2>Password Reset Request</h2>
                <p>Hi ${user.name},</p>
                <p>We received a request to reset your password for your account. If you didn’t make this request, please ignore this email.</p>
                <p>To reset your password, click the button below:</p>
                <p>
                <a href="${resetLink}" class="button">Reset Password</a>
                </p>
                <p>This link will expire in 1 hour. After that, you’ll need to submit a new request to reset your password.</p>
                <p>If you have any questions or need further assistance, please feel free to contact our support team.</p>
                <div class="footer">
                <p>Thank you,</p>
                <p>Ecostats Support Team</p>
                </div>
            </div>
            </body>
            </html>
            `,
        });

        return res.send("Password reset link sent to email");
        
    } catch (error) {
        return res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        );
    }
}

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    console.log(password)

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        const user = await UserModel.findById(decoded.id);
        if (!user) return res.status(404).send("User not found");

        // Hash and update the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.passwordHash = hashedPassword;
        await user.save();

        res.send("Password has been reset successfully");
    } catch (error) {
        return res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        );
    }
}

export const resendEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await UserModel.findOne({email : email});
        await sendVerificationEmail(user)
        return res.send("Email sent successfully");
    } catch (error) {
        return res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        );
    }
}

export const verifyAccount = async (req, res) => {
    const { token } = req.params;
    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        await UserModel.findOneAndUpdate({ _id: id }, { verifiedAt: new Date() });
        return res.redirect(`${process.env.FRONTEND_URL}/email-verified`);
    } catch (error) {
        return res.status(500).json({
            error: 'Server error.',
            details: error
        });
    }
}

export const registerUser = async (req, res)  => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(422).json({errors: errors.array()})

        const { email, password, password_confirmation, role, name } = req.body;

        if(password !== password_confirmation){
            return res.status(401).json({
                error: "Unauthorized",
                msg: "User account is not active. Please contact your administrator to reactivate your account."
            });
        }
        
        const user = new UserModel({
            email,
            passwordHash : await bcrypt.hash(password, 10),
            name,
            isActive: true,
            role
        });

        await user.save({session});

        await sendRegistrationEmail(user, password);

        await session.commitTransaction();

        return res.json(user);

    } catch (error) {
        await session.abortTransaction();
        return res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        );
    } finally {
        session.endSession();
    }
}

export const isEmailUsed = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await UserModel.findOne({email : email});
        return res.json(user ? true : false);
    } catch (error) {
        return res.status(500).json(
            { 
                error: 'Server error.',
                details : error
            }   
        );
    }
}

// helpers
async function validatePassword(password, passwordHash ){
    return bcrypt.compare(password, passwordHash);
}

async function generateJWTToken(userId){
    return jwt.sign({
            id: userId
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    )
}

async function generateJWTRefreshToken(userId){
    return jwt.sign({
            id: userId
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    )
}

export function getUserIdFromToken(token){
    const decoded = jwt.decode(token)
    return decoded.id;
}

export async function getUserFromToken(token){
    const decoded = jwt.decode(token)
    // decoded.id;
    const user = await UserModel.findById(decoded.id);
    return user
}

async function sendVerificationEmail(user){
    try {
        
        // Generate a token with a short expiration time
        const token = await generateJWTToken(user._id);
    
        // Send the email
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Choose your email provider or use a custom SMTP service
            auth: {
                user: process.env.MAIL_EMAIL,
                pass: process.env.MAIL_PASS, // Use environment variables for production
            },
        });
    
        // return res.json(transporter)
    
        const link = `${process.env.URL}/users/verify-account/${token}`;
        await transporter.sendMail({
            to: user.email,
            // to: user.email,
            subject: 'Account Verification',
            html: 
            `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
            <style>
                body {
                font-family: Arial, sans-serif;
                color: #333333;
                background-color: #f9f9f9;
                margin: 0;
                padding: 20px;
                }
                .container {
                max-width: 600px;
                margin: auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                }
                .footer {
                font-size: 0.9em;
                color: #666666;
                margin-top: 20px;
                }
            </style>
            </head>
            <body>
            <div class="container">
                <h2>Email Verification</h2>
                <p>Hi ${user.name},</p>
                <p>Thank you for signing up to Ecostats. If you didn’t make this registration, please ignore this email.</p>
                <p>To verify your email, click the button below:</p>
                <p>
                <a href="${link}" class="button">Verify</a>
                </p>
                <p>This link will expire in 1 hour. After that, you’ll need to submit a new request to verify your email.</p>
                <p>If you have any questions or need further assistance, please feel free to contact our support team.</p>
                <div class="footer">
                <p>Thank you,</p>
                <p>Ecostats Support Team</p>
                </div>
            </div>
            </body>
            </html>
            `,
        });
    } catch (error) {
        console.log(error)
    }
}

export const test = async (req, res) => {
    try {
        const user = await UserModel.findOne({email : 'admin_ecostats@gudri.com'});
        await sendRegistrationEmail(user);
        // await sendVerificationEmail(user);
        return res.send("done");
    } catch (error) {
        console.log(error)
    }
}
export async function sendRegistrationEmail(user, temporaryPassword) {
    try {
        // Generate a token
        const token = await generateJWTToken(user._id);

        // Create the transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_EMAIL,
                pass: process.env.MAIL_PASS,
            },
        });

        // Read the HTML template
        const templatePath = path.join(__dirname, '../templates', 'UserRegisteredEmail.html');
        const templateSource = fs.readFileSync(templatePath, 'utf-8');

        // Compile the template with Handlebars
        const template = handlebars.compile(templateSource);

        // Replace placeholders with dynamic values
        const htmlContent = template({
            name: user.name,
            link: `${process.env.URL}/users/verify-account/${token}`,
            temporaryPassword: temporaryPassword,
        });

        // Send the email
        await transporter.sendMail({
            // to: "jandusayjoe14@gmail.com",
            to: user.email,
            subject: 'Account Verification',
            html: htmlContent,
        });

    } catch (error) {
        console.error('Error sending email:', error);
    }
}