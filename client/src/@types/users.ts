export type LoginResponseType = {
  message: string;
  accessToken: string;
  email: string;
  password: string;
};

export type UserType = {
  _id: string;
  userName: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type UserResponseType = {
  message: string;
  data: {
    user?: UserType;
    users?: UserType[];
  };
};
