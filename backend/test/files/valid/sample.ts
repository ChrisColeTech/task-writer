// Sample TypeScript file for testing
interface User {
  id: string;
  name: string;
  email: string;
}

export class UserService {
  private users: User[] = [];
  
  constructor(private baseUrl: string) {}
  
  async getUser(id: string): Promise<User | null> {
    // FIXME: Add proper error handling
    const response = await fetch(`${this.baseUrl}/users/${id}`);
    return response.json();
  }
  
  addUser(user: User): void {
    this.users.push(user);
  }
  
  /**
   * Get all users
   * @returns Array of users
   */
  getAllUsers(): User[] {
    return this.users;
  }
}

export default UserService;