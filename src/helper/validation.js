const validateSignupData = (data) => {
    const {firstName, lastName, emailId, password} = data;
    if(!firstName || !lastName || !emailId || !password) {
        return { isValid: false, message: "All fields are required" };
    }

    return { isValid: true };
}
const validateProfileEditData = (req) => {
    console.log("Validating profile edit data:", req.body);

    const allowedFields = ["firstName", "lastName", "age", "gender", "about", "skills", "password"];

    const isEditAllowed = Object.keys(req.body).every((key) => allowedFields.includes(key));

    console.log("Is edit allowed:", isEditAllowed);
    return isEditAllowed;
};


module.exports = {
    validateSignupData,
    validateProfileEditData
};