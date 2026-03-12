export function validateForm(data) {
    console.log("Server side validation happens here");
    console.log(data);

    /* data object
    {
        fname: 'Tina',
        lname: 'Ostrander',
        email: 'tina@aol.com',
        method: 'pickup',
        toppings: [ 'pepperoni', 'mushrooms' ],
        size: 'small',
        comment: 'hi',
        discount: 'on'
    }*/

    // Store error messages in an array
    const errors = [];

    // Validate first name
    if (data.fname.trim() == "") {
        errors.push("First name is required.");
    }

    // Validate last name

    console.log(errors);
}
