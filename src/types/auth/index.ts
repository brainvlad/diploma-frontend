// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Request {
  export interface Login {
    email: string;
    password: string;
  }

  export interface Register {
    firstName: string;
    middleName: string;
    lastName?: string;
    password: string;
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
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
