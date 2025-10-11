
const maskEmail = (email: string) => {
    // TO DO: Maybe fix this? Works a bit awkwardly.

    return email.replace(/(?<=^.)[^@]+(?=.@)|(?<=@.)[^.]+(?=..?\.)|(?<=\.)[^.]+(?=..?\.)/g, match => '*'.repeat(match.length));
}

export default maskEmail;