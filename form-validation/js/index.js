const settings = {
    formContainer: document.querySelector('#form'),
    formGroupElements: document.querySelectorAll('.form-group'),
    inputs: document.querySelectorAll('.form-group input'),
    errors: 0,
    regExpEmail: /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,
    eye: document.querySelector('.password i'),
    successContainer: document.querySelector('.success'),
    valid: false,
}

const validate = {
    settings,
    init() {
        this.initEventHandler();
        this.fetchJson();
    },
    initEventHandler() {
        this.settings.formContainer.addEventListener('submit', (event) => this.handleSubmit(event));
        this.passwordToggle();

    },

    handleSubmit(event) {
        if (!this.settings.valid) {
            event.preventDefault();
        }
        this.removeErrors();
        this.isValidForm();
        this.requestJson(event);
        if (this.settings.errors === 0) {
            event.preventDefault();
            this.removeErrors();
            this.showSuccess();
            this.clearInputs();
            this.valid = true;

        }
    },

    removeErrors() {
        document.querySelectorAll('.error').forEach(element => element.remove());
        this.settings.errors = 0;
        this.settings.inputs.forEach(element => {
            element.classList.remove('error-input');
        })
    },
    isValidForm() {
        this.settings.inputs.forEach(element => {
            if (element.classList.contains('name__input') && this.isEmptyName(element.value)) {
                this.showError(element, 'This field should not be empty');
                this.settings.errors++;
                element.classList.add('error-input');
            }
            if (element.classList.contains('email__input') && !this.isValidEmail(element.value)) {
                this.showError(element, 'Invalid email address');
                this.settings.errors++;
                element.classList.add('error-input');
            }
            if (element.classList.contains('password__input') && !this.isValidPassword(element.value)) {
                this.showError(element, 'Password should contain at least one uppercase letter, one lowercase letter, one digit, one special character and be at least 8 characters long.');
                this.settings.errors++;
                element.classList.add('error-input');
            }
            if (element.classList.contains('confirm-password__input') && element.value !== document.querySelector('.password__input').value) {
                this.showError(element, 'Password does not match');
                this.settings.errors++;
                element.classList.add('error-input');
            }
        })
    },
    isEmptyName(name) {
        return name === '';
    },
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    isValidPassword(password) {
        const minLength = 8;
        return (
            password.length >= minLength &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        );
    },
    requestJson(event){
            event.preventDefault();
            const resultDiv = document.querySelector('.success-text');
            const name = this.settings.formContainer.elements.name.value;
            const email = this.settings.formContainer.elements.email.value;

            const jsonData = {
                name: name,
                email: email
            };

            const jsonString = JSON.stringify(jsonData);
            console.log(jsonString);

        resultDiv.innerHTML =`<p id="jsonName">Your name: <span> ${name}</span></p><p id="jsonEmail">Your email: <span> ${email} </span> </p>`;


    },
    showError(field, message) {
        const errorElement = document.createElement('small');
        errorElement.classList.add('error');
        errorElement.classList.add('errorShow');
        errorElement.innerHTML = message;
        field.closest('.form-group').appendChild(errorElement);
    },
    showSuccess() {
        this.settings.formGroupElements.forEach(element => {
            element.classList.add('displayNone')
        })
        setTimeout(() => {
            this.settings.successContainer.classList.add('successShow');

        }, 1000);
    },
    clearInputs() {
        this.settings.inputs.forEach(element => {
            element.value = '';
        })
    },
    passwordToggle() {
        this.settings.eye.addEventListener('click', () => {
            const password = document.querySelectorAll('.password input');
            const eyeIcon = document.querySelector('.password i');

            password.forEach(element => {
                if (element.type === 'password') {
                    element.type = 'text';
                    eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    element.type = 'password';
                    eyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            })
        });
    },



    fetchJson(){
        const jsonNameElement = document.querySelector("#jsonName");
        const jsonEmailElement = document.querySelector("#jsonEmail");
        fetch("data.json")
            .then(response => response.json())
            .then(data => {
                if (jsonNameElement) {
                    jsonNameElement.textContent = data.name;
                }
                if (jsonEmailElement) {
                    jsonEmailElement.textContent = data.email;
                }
            })
            .catch(error => console.error("Ошибка при загрузке JSON-файла:", error));
    }

}

window.addEventListener('load', () => validate.init());



