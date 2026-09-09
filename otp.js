// OTP Generator and Verifier Logic
document.addEventListener('DOMContentLoaded', () => {
    const otpInputs = document.querySelectorAll('.otp_output');
    const verifyBtn = document.getElementById('verify_btn');
    const statusMsg = document.getElementById('status_message');
    const copyBtn = document.getElementById('copy_btn');

    let currentOTP = '';

    // Generate a random 6-digit OTP code (0-9 for each digit)
    function generateRandomOTP() {
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += Math.floor(Math.random() * 10);
        }
        return code;
    }

    // Display a status message with smooth fade-in
    function showStatus(message, type = 'info') {
        if (!statusMsg) return;
        statusMsg.innerHTML = message;
        statusMsg.className = `status_message ${type} fade-in`;
        
        // Remove animation class after it plays so it can re-trigger next time
        setTimeout(() => {
            statusMsg.classList.remove('fade-in');
        }, 400);
    }

    // Populate the 6 inputs with the generated OTP and trigger animation
    function regenerateOTP(withAnimation = true) {
        currentOTP = generateRandomOTP();

        otpInputs.forEach((input, index) => {
            input.value = currentOTP[index];

            if (withAnimation) {
                input.classList.remove('pop-anim');
                void input.offsetWidth; // Force DOM reflow to restart animation
                input.style.animationDelay = `${index * 45}ms`;
                input.classList.add('pop-anim');
            }
        });

        showStatus(`✨ New OTP Generated: <strong>${currentOTP}</strong>`, 'success');
    }

    // Handle Verify Button Click -> Regenerates a new 6-digit OTP
    if (verifyBtn) {
        verifyBtn.addEventListener('click', () => {
            // Check if user has entered digits matching current OTP
            const enteredCode = Array.from(otpInputs).map(input => input.value.trim()).join('');

            if (enteredCode.length === 6 && enteredCode === currentOTP) {
                showStatus(`✅ OTP <strong>${currentOTP}</strong> Verified! Regenerating new code...`, 'verified');
            }
            
            // Automatically regenerate a brand new 6-digit number
            regenerateOTP(true);
        });
    }

    // Support keyboard navigation and manual typing
    otpInputs.forEach((input, index) => {
        // Automatically focus next input on digit entry
        input.addEventListener('input', (e) => {
            const val = e.target.value;

            // Only allow numbers
            if (!/^\d*$/.test(val)) {
                e.target.value = '';
                return;
            }

            if (val.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        // Handle Backspace and arrow navigation
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace') {
                if (input.value === '' && index > 0) {
                    otpInputs[index - 1].focus();
                    otpInputs[index - 1].value = '';
                }
            } else if (e.key === 'ArrowLeft' && index > 0) {
                otpInputs[index - 1].focus();
            } else if (e.key === 'ArrowRight' && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            } else if (e.key === 'Enter') {
                // Mobile numeric keypads often show "Go"/"Enter" instead of a submit button
                input.blur();
                verifyBtn?.click();
            }
        });

        // Select content on focus for quick overwrite
        input.addEventListener('focus', () => {
            input.select();
        });
    });

    // Handle pasting a full 6-digit code into any input
    document.querySelector('.otp_wrapper')?.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = (e.clipboardData || window.clipboardData)
            .getData('text')
            .replace(/\D/g, '') // Keep digits only
            .slice(0, 6);

        if (!pastedData) return;

        pastedData.split('').forEach((digit, idx) => {
            if (otpInputs[idx]) {
                otpInputs[idx].value = digit;
            }
        });

        // Focus the next empty or last input
        const nextIndex = Math.min(pastedData.length, otpInputs.length - 1);
        otpInputs[nextIndex]?.focus();
    });

    // Optional: Click to copy current OTP
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (!currentOTP) return;
            navigator.clipboard.writeText(currentOTP).then(() => {
                showStatus(`📋 Copied <strong>${currentOTP}</strong> to clipboard!`, 'copied');
            }).catch(() => {
                showStatus(`Current OTP: <strong>${currentOTP}</strong>`, 'info');
            });
        });
    }

    // Automatically generate the initial 6-digit OTP on load
    regenerateOTP(true);
});
