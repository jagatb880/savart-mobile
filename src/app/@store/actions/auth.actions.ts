export class Login {
  static readonly type = "[Auth] Login";
  constructor(public payload: { username: string; password: string }) {}
}

export class Logout {
  static readonly type = "[Auth] Logout";
}

export class AuthToken {
  static readonly type = "[Auth] AuthToken";
  constructor(public token: string) {}
}
