class Base {
  tableName = 'My table name';
  hello(name) {
    return `hello ${name}`;
  }
}

type $Constructor<T = {}> = new (...args: any[]) => T;
function UserFields<TBase extends $Constructor>(Base: TBase) {
  return class extends Base {
    name: string;
    email: string;
  };
}

class User extends UserFields(Base) {
  state = {
    name: 'mike'
  };
}
const u = new User();
u.tableName = 'users'; // ok
u.name = 'John'; // ok
