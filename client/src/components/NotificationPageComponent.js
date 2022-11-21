import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import CircularProgressComponent from "./CircularProgressComponent";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { Alert } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import FFP_API from "../app/api";


const theme = createTheme();

const USER_REGEX = /^[A-z0-9]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,20}$/;

export default function NotificationPageComponent(){
    const [e, setE] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [notification , setNotification] = useState(null);
    const [user, setUser] = useState(null);


    useEffect(() => {
        const fetchNotification = async () => {
            const response = await FFP_API.get(`/notifications`);
            setNotification(response.data);
        };
        const fetchUser = async () => {
            const response = await FFP_API.get(`/users`);
            setUser(response.data);
        };
        fetchUser();
        fetchNotification();
    }, [setNotification, setUser]);


    // find user id from user email
    const findUserByEmail = (email) => {
        //get all users
        const users = user;
        //find user with email
        const user = users.find((user) => user.email === email);
        //return user id
        return user.id;
    };



    // handle send notification
    const handleSendNotification = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
            try {
                const response = await FFP_API.post(`/notifications`, {
                    subject: data.get("subject"),
                    message: data.get("message"),
                    sender: findUserByEmail(data.get("sender_email")),
                    receiver: findUserByEmail(data.get("receiver_email")),
                });
                navigate("/notifications");
            } catch (error) {
                setE(true);
                setErrorMessage(error.response.data.message);
            }
        
    };
    
    // //create a notification
    // const handleCreate = async (e) => {
    //     e.preventDefault();
    //     const response = await FFP_API.post("/notifications", {
    //         sender: e.target.sender.value,
    //         receiver: e.target.receiver.value,
    //         message: e.target.message.value,
    //         subject: e.target.subject.value,
    //     });
    //     console.log(response.data);
    //     setNotification(response.data);
    //     navigate("/notifications");
    // };
      
    //create a from with fields for subject, message, sender, receiver
    const content = (
        <div>
            
        </div>
    );


    return (
        {content}
    );


        


}