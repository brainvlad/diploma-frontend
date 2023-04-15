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
    }
}
