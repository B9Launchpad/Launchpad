import validateEmail from "../validateEmail"

const maskEmail = (email: string) => {
    if(!validateEmail(email)) return;

    // TO DO: Maybe fix this? Works a bit awkwardly.

    return email.replace(/(?<=^.)[^@]+(?=.@)|(?<=@.)[^.]+(?=..?\.)|(?<=\.)[^.]+(?=..?\.)/g, match => '*'.repeat(match.length));
}

export default maskEmail;