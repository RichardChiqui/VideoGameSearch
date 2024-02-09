const validateUser = "SELECT * FROM public.\"Users\" WHERE username = $1 and password = $2";

module.exports = {
    validateUser
}