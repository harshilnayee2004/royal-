/**
 * Contact Form Controller (Multi-Page Version)
 * Manages form validations, error hints, URL query pre-fills, and simulated success animations.
 */
export function initContactForm() {
    const form = document.getElementById('inquiry-form');
    const successOverlay = document.getElementById('form-success-overlay');
    const closeSuccessBtn = document.getElementById('success-close-btn');
    const submitBtn = document.getElementById('form-submit-btn');

    if (!form) return;

    // Prefill fields from URL query parameters (sent from products modal redirects)
    prefillFormFromURL();

    // Validation rules
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{10,14}$/;

    function validateField(input, errorElement, condition, errorMsgText) {
        if (!input) return true;
        const formGroup = input.closest('.form-group');
        if (condition) {
            formGroup.classList.remove('invalid');
            return true;
        } else {
            formGroup.classList.add('invalid');
            if (errorElement && errorMsgText) {
                errorElement.textContent = errorMsgText;
            }
            return false;
        }
    }

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const phoneInput = document.getElementById('form-phone');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const phoneError = document.getElementById('phone-error');

    if (nameInput) {
        nameInput.addEventListener('input', () => {
            validateField(nameInput, nameError, nameInput.value.trim().length > 0, "Name is required.");
        });
    }

    if (emailInput) {
        emailInput.addEventListener('input', () => {
            const val = emailInput.value.trim();
            validateField(
                emailInput, 
                emailError, 
                val.length > 0 && emailRegex.test(val), 
                val.length === 0 ? "Email is required." : "Please enter a valid email address."
            );
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', () => {
            const val = phoneInput.value.replace(/\s+/g, '');
            validateField(
                phoneInput, 
                phoneError, 
                val.length > 0 && phoneRegex.test(val), 
                val.length === 0 ? "Mobile number is required." : "Please enter a valid phone number."
            );
        });
    }

    // Submit Action
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = validateField(nameInput, nameError, nameInput.value.trim().length > 0, "Name is required.");
        const isEmailValid = validateField(emailInput, emailError, emailInput.value.trim().length > 0 && emailRegex.test(emailInput.value.trim()), "Please enter a valid email address.");
        const isPhoneValid = validateField(phoneInput, phoneError, phoneInput.value.trim().length > 0 && phoneRegex.test(phoneInput.value.replace(/\s+/g, '')), "Please enter a valid phone number.");

        if (isNameValid && isEmailValid && isPhoneValid) {
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span><i class="fa-solid fa-circle-notch fa-spin"></i> Submitting...</span>';

            // Simulate server network delay
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

                if (successOverlay) {
                    successOverlay.classList.remove('hidden');
                }

                form.reset();
            }, 1200);
        }
    });

    if (closeSuccessBtn && successOverlay) {
        closeSuccessBtn.addEventListener('click', (e) => {
            e.preventDefault();
            successOverlay.classList.add('hidden');
        });
    }
}

function prefillFormFromURL() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        const message = urlParams.get('message');

        const formProduct = document.getElementById('form-product');
        const formMessage = document.getElementById('form-message');
        const formName = document.getElementById('form-name');

        if (category && formProduct) {
            // Match select options
            const options = Array.from(formProduct.options);
            const match = options.find(opt => opt.value === category);
            if (match) {
                formProduct.value = category;
            }
        }

        if (message && formMessage) {
            formMessage.value = message;
        }

        // Auto focus the name input if we prefilled details to accelerate form entry
        if ((category || message) && formName) {
            setTimeout(() => {
                formName.focus();
            }, 600);
        }
    } catch (e) {
        console.error("Failed to parse prefill parameters", e);
    }
}
