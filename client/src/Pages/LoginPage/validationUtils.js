// validationUtils.js

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+]).{8,}$/;
    return passwordRegex.test(password);
  };
  
  export const validatePasswordsMatch = (password, retypePassword) => {
    return password === retypePassword;
  };

  export const validateIndianPhoneNumber = (phoneNumber) => {
    const numericPhoneNumber = phoneNumber.replace(/\D/g, '');
      const indianPhoneNumberRegex = /^[789]\d{9}$/;
  
    return indianPhoneNumberRegex.test(numericPhoneNumber);
  };
  
  