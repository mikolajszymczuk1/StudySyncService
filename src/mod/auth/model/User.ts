class User {
  id: number = -1;
  username: string = '';
  passwordHash?: string = '';
  firstName: string = '';
  lastName: string = '';
  createdAt: number = -1;

  constructor(
    id: number = -1,
    username: string = '',
    passwordHash: string = '',
    firstName: string = '',
    lastName: string = '',
    createdAt: number = -1,
  ) {
    this.id = id;
    this.username = username;
    this.passwordHash = passwordHash;
    this.firstName = firstName;
    this.lastName = lastName;
    this.createdAt = createdAt;
  }

  /**
   * Convert prisma data to User object
   * @param {object} data
   * @returns {User} user object
   */
  public static userFromPrisma(data: {
    id: number;
    username: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
  }): User {
    const user = new User(
      data.id,
      data.username,
      data.passwordHash,
      data.firstName,
      data.lastName,
      data.createdAt.getTime(),
    );

    return user;
  }
}

export default User;
