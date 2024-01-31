export class UserIdentity {
  private readonly _username: string;
  private readonly _email: string;
  private readonly _avatar: string;
  private readonly _name: string;
  private readonly _jwtToken: string;
  private readonly _role: string;
  private readonly _id: string;

  public constructor(
    username: string,
    email: string,
    name: string,
    jwtToken: string,
    id: string
  ) {
    this._username = username;
    this._email = email;
    this._name = name;
    this._jwtToken = jwtToken;
    this._id = id;
  }

  public get username(): string {
    return this._username;
  }

  public get email(): string {
    return this._email;
  }

  public get name(): string {
    return this._name;
  }

  public get jwtToken(): string {
    return this._jwtToken;
  }

  public get id(): string {
    return this._id;
  }
}
