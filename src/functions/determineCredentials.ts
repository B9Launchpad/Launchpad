import validateEmail from "./validateEmail";
import validateUsername from "./validateUsername";


export default function determineCredentials(input: string): "email" | "username" | false {
    if(validateEmail(input)) return 'email';
    if(validateUsername(input)) return 'username';
    return false;
}