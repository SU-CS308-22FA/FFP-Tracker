import React from "react";
import emailjs from "emailjs-com";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
//import form from "react-bootstrap/Form";

export default function ContactUs() {

    function sendEmail(e) {
        e.preventDefault();

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



    // return(
    //     <div>
    //         <div className="container">
    //         <form onSubmit={sendEmail}>
    //                 <div className="row pt-5 mx-auto">
    //                     <div className="col-8 form-group pt-2 mx-auto">
    //                         <input type="text" className="form-control" placeholder="To Email Adress" name="to_email"/>
    //                     </div>  
    //                     <div className="col-8 form-group pt-2 mx-auto">
    //                         <input type="text" className="form-control" placeholder="To" name="to_name"/>
    //                     </div>
    //                     <div className="col-8 form-group pt-2 mx-auto">
    //                         <input type="text" className="form-control" placeholder="From" name="from_name"/>
    //                     </div>
    //                     <div className="col-8 form-group pt-2 mx-auto">
    //                         <input type="text" className="form-control" placeholder="Subject" name="subject"/>
    //                     </div>
    //                     <div className="col-8 form-group pt-2 mx-auto">
    //                         <textarea className="form-control" id="" cols="30" rows="8" placeholder="Your message" name="message"></textarea>
    //                     </div>
    //                     <div className="col-8 pt-3 mx-auto">
    //                         <input type="submit" className="btn btn-info" value="Send Notification"></input>
    //                     </div>
    //                 </div>
    //             </form>
    //         </div>
    //     </div>
    // )
}