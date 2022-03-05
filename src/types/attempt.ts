export type Attempt = {
  letter: string;
  status?: AttemptStatus;
};

export enum AttemptStatus {
  PRESENT = "PRESENT",
  CORRECT = "CORRECT",
  ABSENT = "ABSENT",
}

export type KeyboardStatus = {
  [key: string]: AttemptStatus;
};
