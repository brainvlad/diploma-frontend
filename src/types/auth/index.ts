export namespace Request {
    export interface Login {
        email: string;
        password: string;
    }
}

export namespace Response {
    export interface Login {
        access: string;
        refresh: string;
        userId: string;
    }
}

export interface AuthUserInfo {
    id: string;
    firstName: string;
    middleName: string;
    lastName?: string;
    email: string;
    type?: string;
    createdAt: Date;
}
