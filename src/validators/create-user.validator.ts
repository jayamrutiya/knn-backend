import { checkSchema } from 'express-validator';

const createUserValidator = checkSchema({
  firstName: {
    in: 'body',
    trim: true,
    exists: {
      errorMessage: 'First Name is required.',
    },
    notEmpty: {
      errorMessage: 'First Name cannot be empty.',
    },
    isLength: {
      options: {
        min: 1,
        max: 150,
      },
      errorMessage: 'First Name cannot be longer than 150 characters.',
    },
    isAlphanumeric: {
      errorMessage: 'First Name not contains any special characters.',
    },
  },
  lastName: {
    in: 'body',
    trim: true,
    exists: {
      errorMessage: 'Last Name is required.',
    },
    notEmpty: {
      errorMessage: 'Last Name cannot be empty.',
    },
    isLength: {
      options: {
        min: 1,
        max: 150,
      },
      errorMessage: 'Last Name cannot be longer than 150 characters.',
    },
    isAlphanumeric: {
      errorMessage: 'First Name not contains any special characters.',
    },
  },
  userName: {
    in: 'body',
    trim: true,
    exists: {
      errorMessage: 'User Name is required.',
    },
    notEmpty: {
      errorMessage: 'User Name cannot be empty.',
    },
    isLength: {
      options: {
        min: 1,
        max: 150,
      },
      errorMessage: 'User Name cannot be longer than 150 characters.',
    },
  },
  mobileNumber: {
    in: 'body',
    exists: {
      errorMessage: 'Mobile number is required.',
    },
    notEmpty: {
      errorMessage: 'Mobile number cannot be empty.',
    },
    isLength: {
      options: {
        min: 1,
        max: 15,
      },
      errorMessage: 'Mobile number should not be more than 15 characters long.',
    },
    trim: true,
    stripLow: true,
  },
  password: {
    in: 'body',
    trim: true,
    exists: {
      errorMessage: 'Password is required.',
    },
    notEmpty: {
      errorMessage: 'Password cannot be empty.',
    },
    isLength: {
      options: {
        min: 8,
        max: 20,
      },
      errorMessage: 'Password should be between 8 to 20 characters.',
    },
    matches: {
      options: RegExp(
        '/^(?=.*d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/',
        'i',
      ).compile(),
      errorMessage:
        'Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 characters long',
    },
    stripLow: true,
  },
  address: {
    in: 'body',
    trim: true,
    exists: {
      errorMessage: 'Address is required.',
    },
    notEmpty: {
      errorMessage: 'Address cannot be empty.',
    },
  },
  city: {
    in: 'body',
    trim: true,
    optional: {
      options: {
        nullable: true,
      },
    },
    exists: {
      errorMessage: 'City is required.',
    },
  },
  street: {
    in: 'body',
    trim: true,
    optional: {
      options: {
        nullable: true,
      },
    },
    exists: {
      errorMessage: 'Street is required.',
    },
  },
});

export default createUserValidator;
