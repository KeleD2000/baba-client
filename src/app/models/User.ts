export interface User{
    current_user: {
        uid: number,
        roles: [],
        name: string 
    },
    csrf_token: string,
    logout_token: string

}