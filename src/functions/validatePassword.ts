import { useState } from "react";
import { useTranslation } from "react-i18next";

interface PasswordProps {
    password: string;
    confirmPassword: string;
}

export type PasswordValidationResponse = [boolean, boolean, string | null] // Passed?, Requirements passed?, Error message.

// This function validates a password for minimum requirements.
// NOTE: Consider how this function could be further improved, for example with support for more special characters, checking if password is too simple is too commonly used. Possbily helpful resource: https://en.wikipedia.org/wiki/Wikipedia:10,000_most_common_passwords
const useValidatePassword = () => {
    const {t} = useTranslation('auth');

    const validatePassword = ({ password, confirmPassword }: PasswordProps): PasswordValidationResponse => {
        const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

        if (!passwordRegex.test(password.toLowerCase())) {
            return [false, true, t('reset.passwordRequirementsNotMetError')];
        } else if (password !== confirmPassword) {
            return [false, false, t('reset.passwordNoMatchError')];
        }
        return [true, true, null];
    };

    return validatePassword;
}

export default useValidatePassword;