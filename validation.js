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
    if (data.lname.trim() == "") {
        errors.push("Last name is required.");
    }

    // Validate method (pickup or delivery)
    const validMethods = ['pickup', 'delivery'];
    if(!validMethods.includes(data.method)) {
        errors.push("Method must be pickup or delivery");
    }

    // Validate pizza size
    const validSizes = ['small', 'medium', 'large'];
    if(!validSizes.includes(data.size)) {
        errors.push("Size is not valid. Go away, evildoer!");
    }


    console.log(errors);
    return {
        isValid: errors.length === 0,
        errors
    };
}
