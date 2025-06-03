const validateSignupData = (data) => {
    const {firstName, lastName, emailId, password} = data;
    if(!firstName || !lastName || !emailId || !password) {
        return { isValid: false, message: "All fields are required" };
    }

    return { isValid: true };
}

module.exports = {
    validateSignupData
};