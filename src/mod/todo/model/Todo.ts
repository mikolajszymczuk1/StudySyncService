class Todo {
  id: number = -1;
  name: string = '';
  isComplete: boolean = false;
  order: number = -1;
  userId: number = -1;

  constructor(id: number, name: string, isComplete: boolean, order: number, userId: number) {
    this.id = id;
    this.name = name;
    this.isComplete = isComplete;
    this.order = order;
    this.userId = userId;
  }

  public static todoFromPrisma(data: {
    id: number;
    name: string;
    isComplete: boolean;
    order: number;
    userId: number;
  }): Todo {
    return new Todo(data.id, data.name, data.isComplete, data.order, data.userId);
  }
}

export default Todo;
