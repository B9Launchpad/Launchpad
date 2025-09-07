
export default function validateUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9]{8,20}$/;
    if(usernameRegex.test(username.toLowerCase())) return true;
    return false;
}
