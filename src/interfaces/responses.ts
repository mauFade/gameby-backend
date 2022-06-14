interface ISuccess {
  success: boolean;
  data: any;
}

interface IError {
  success: boolean;
  message: string;
  error: any;
}

export { ISuccess, IError };
