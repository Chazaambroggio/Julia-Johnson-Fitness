
// const isProduction = process.env.NODE_ENV === 'production';
// const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000';

// export const fetchToken = async() => {
//     try {
//         const response = await fetch(`${serverUrl}/api/auth/token`);
//         return response.json();
//     } catch (error) {
//         throw(error)
//     }
// }


export function capitalizeFirstLetters(username : string) {
    return username.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function getCapitalizedFirstName(username: string) {
    const capitalizedUsername = username.split(' ').map(
        word => word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(' ')
    
    const capitalizedFirstName = capitalizedUsername.split(' ')[0];
    return capitalizedFirstName
}   