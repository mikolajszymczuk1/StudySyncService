class Subject {
  id: number = -1;
  name: string = '';
  startTime: string = '';
  endTime: string = '';
  evenOdd: string = '';
  grade: number = -1;
  classNumber: string = '';
  day: string = '';
  userId: number = -1;

  constructor(
    id: number,
    name: string,
    startTime: string,
    endTime: string,
    evenOdd: string,
    grade: number,
    classNumber: string,
    day: string,
    userId: number,
  ) {
    this.id = id;
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
    this.evenOdd = evenOdd;
    this.grade = grade;
    this.classNumber = classNumber;
    this.day = day;
    this.userId = userId;
  }

  public static subjectFromPrisma(data: {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    evenOdd: string;
    grade: number;
    classNumber: string;
    day: string;
    userId: number;
  }): Subject {
    return new Subject(
      data.id,
      data.name,
      data.startTime,
      data.endTime,
      data.evenOdd,
      data.grade,
      data.classNumber,
      data.day,
      data.userId,
    );
  }
}

export default Subject;
