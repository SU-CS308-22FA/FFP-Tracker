import React from "react";
import emailjs from "emailjs-com";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import FFP_API from "../app/api";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

//import form from "react-bootstrap/Form";

export default function ContactUs() {
    // const[user, setUser] = useState(null);
    // const { id } = useParams();
    // useEffect(() => {
    //     const fetchUser = async () => {
    //         const response = await FFP_API.get(`/users/${id}`);
    //         setUser(response.data);
    //     };
    //     fetchUser();
    // }, [setUser, id]);


    //create a notification from the contact form
    function createNotification(senderid, recieverid, subject, message) {
        const response = FFP_API.post(`/notifications/`, {
            sender: senderid,
            reciever: recieverid,
            subject: subject,
            message: message,
        });
        console.log(response.data);
    }

    //get user id by email
    const getUserIDbyEmail = async (email) => {
        const response = await FFP_API.get(`/users/`);
        console.log(response.data);
        const user = response.data.find(user => user.email === email);
        return user._id;
    }


    function sendEmail(e) {
        e.preventDefault();
        console.log(e.target.message.value);
        console.log(e.target.subject.value);
    emailjs.sendForm('gmail', 'template_46kzdyk', e.target, 'vHB_tCaBZcPIUtpPO')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
        e.target.reset()
    }

    



    return (
        <><Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            onSubmit={sendEmail}
        ></Box>
        <form className="contact-form" onSubmit={sendEmail}>
            <div className= "row pt-5 mx-auto">
                <div className="col-8 form-group mx-auto">
                <TextField
                        required
                        id="outlined-required"
                        label="To Email"
                        defaultValue=""
                        placeholder="To EMail"
                        variant="outlined"
                        name="to_email"
                        
                    />
                </div>
                <div className="col-8 form-group pt-5 mx-auto">
                <TextField
                        required
                        id="outlined-required"
                        label="To Name"
                        defaultValue=""
                        placeholder="To Name"
                        variant="outlined"
                        name="to_name"
                    />
                </div>
                <div className="col-8 form-group pt-5 mx-auto">
                <TextField
                        required
                        id="outlined-required"
                        label="From Email"
                        defaultValue=""
                        placeholder="From EMail"
                        variant="outlined"
                        name="from_email"
                    />
                </div>
                <div className="col-8 form-group pt-5 mx-auto">
                <TextField
                        required
                        id="outlined-required"
                        label="From Name"
                        defaultValue=""
                        placeholder="From Name"
                        variant="outlined"
                        name="from_name"
                    />
                </div><div className="col-8 form-group pt-5 mx-auto">
                <TextField
                        required
                        id="outlined-required"
                        label="Subject"
                        defaultValue=""
                        placeholder="Subject"
                        variant="outlined"
                        name="subject"
                    />
                </div><div className="col-8 form-group pt-5 mx-auto">
                <TextField
                    id="outlined-multiline-static"
                    label="Message"
                    multiline
                    rows={10}
                    defaultValue=""
                    placeholder="Message"
                    variant="outlined"
                    name="message"
                />
                </div>
                <div className="col-8 pt-3 mx-auto">
                    <Button variant="contained" type="submit" value="Send Notification" color="success" >
                        Send
                    </Button>
                </div>
            
            </div>
                
            </form>
        </>
    );

}