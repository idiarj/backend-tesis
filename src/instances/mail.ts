import { Mailer } from "../mail/Mailer.js";
import { mail_config } from "../configs/config.js";


export const mail = new Mailer({
    user: `idiar16@gmail.com`,
    pass: mail_config.APPLICATION_PASSWORD_GMAIL
}, true)