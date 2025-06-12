document.addEventListener('DOMContentLoaded', function() {
    const quoteForm = document.querySelector('.php-email-form');
    
    if (quoteForm) {
        // Add input validation
        const validateInput = (input) => {
            const value = input.value.trim();
            if (input.hasAttribute('required') && !value) {
                input.classList.add('is-invalid');
                return false;
            }
            if (input.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    input.classList.add('is-invalid');
                    return false;
                }
            }
            if (input.type === 'tel' && value) {
                const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
                if (!phoneRegex.test(value)) {
                    input.classList.add('is-invalid');
                    return false;
                }
            }
            input.classList.remove('is-invalid');
            return true;
        };

        // Add input event listeners for real-time validation
        const inputs = quoteForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => validateInput(input));
            input.addEventListener('blur', () => validateInput(input));
        });

        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate all inputs before submission
            let isValid = true;
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                const errorMessage = this.querySelector('.error-message');
                errorMessage.textContent = 'Please fill in all required fields correctly.';
                errorMessage.style.display = 'block';
                return;
            }

            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const loadingMessage = this.querySelector('.loading');
            const errorMessage = this.querySelector('.error-message');
            const successMessage = this.querySelector('.sent-message');

            // Hide any existing messages
            loadingMessage.style.display = 'none';
            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';

            // Show loading message and disable submit button
            loadingMessage.style.display = 'block';
            submitButton.disabled = true;

            // Send the form data
            fetch(this.action, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text || 'An error occurred. Please try again later.');
                    });
                }
                return response.text();
            })
            .then(data => {
                // Hide loading message
                loadingMessage.style.display = 'none';

                if (data.trim() === 'OK') {
                    // Show success message
                    successMessage.style.display = 'block';
                    // Reset the form
                    this.reset();
                    // Remove validation classes
                    inputs.forEach(input => input.classList.remove('is-invalid'));
                } else {
                    throw new Error(data || 'An error occurred. Please try again later.');
                }
            })
            .catch(error => {
                // Hide loading message
                loadingMessage.style.display = 'none';
                // Show error message
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
                console.error('Error:', error);
            })
            .finally(() => {
                // Re-enable submit button
                submitButton.disabled = false;
            });
        });
    }
}); 