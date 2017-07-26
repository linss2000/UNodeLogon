export interface DataEntry {
  id?: number;
}

export interface User extends DataEntry {
  username: string;
  name: string;
  role: 'admin' | 'user';
}

export interface Gif extends DataEntry {
  title: string;
  url: string;
}

export class MockDB<TData extends DataEntry> {
  private data: TData[];
  
  constructor(defaultData: TData[] = []) {
    this.data = defaultData;
  }

  public get(id?: number): TData | TData[]{
    if (typeof id === 'number') {
      return this.data[id];
    }

    return this.data.map((user, idx) => {
      user.id = idx
      return user;
    });
  }

  public update(user: User): number;
  public update(id: number, user: User): number;
  
  public update(idOrUser: number | User, user?: User): number {
    if (typeof idOrUser === 'number') {
      this.data[idOrUser] = this.clone(user);
      return idOrUser;
    } else {
      this.data.push(this.clone(idOrUser));
      return this.data.length - 1;
    }
  }

  public remove(id: number) {
    this.data.splice(id, 1);
    return {};
  }

  private clone(obj: Object) {
    return JSON.parse(JSON.stringify(obj));
  }
}

export const MOCK_USERS: User[] = [
  {
    username: 'richard',
    name: 'Richard Hendricks',
    role: 'admin'
  },
  {
    username: 'erlich',
    name: 'Erlich Bachman',
    role: 'admin'
  }
];