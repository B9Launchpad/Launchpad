// TO DO: Possibly simplify checking for requirements.
//        Create a useImperativeHandle function to get 'true' or 'false' to the parent component if passwords do or do not match

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import InputString, { InputStringRef } from "./StringInput";
import { useSpring, animated } from "react-spring";
import SpringConfig from "../../../utils/SpringConfig";
import { useTranslation } from "react-i18next";

export type NewPasswordRef = {
    validate: () => false | string;
}

const NewPassword = forwardRef<NewPasswordRef>((_props, ref) => {
    const [fulfilledCharacterCount, setFulfilledCharacterCount] = useState<boolean>(false);
    const [fulfilledSmall, setFulfilledSmall] = useState<boolean>(false);
    const [fulfilledUpper, setFulfilledUpper] = useState<boolean>(false);
    const [fulfilledNumber, setFulfilledNumber] = useState<boolean>(false);
    const [fulfilledSpecialChar, setFulfilledSpecialChar] = useState<boolean>(false);
    const inputRef = useRef<InputStringRef>(null);

    const [newPassword, setNewPassword] = useState<string>('');
    const [repeatPassword, setRepeatPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const { t } = useTranslation('components');

    const [contentHeight, setContentHeight] = useState(0);
    const [expanded, setExpanded] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        const lowercaseRegex = /\p{Ll}/u;
        const uppercaseRegex = /\p{Lu}/u;
        const numberRegex = /[0-9]/;
        const specialCharacterRegex = /[!-\/:-@\[-`\{-~]/;


        setFulfilledCharacterCount(value.length > 7 && value.length < 21)
        setFulfilledSmall(lowercaseRegex.test(value));
        setFulfilledUpper(uppercaseRegex.test(value));
        setFulfilledSpecialChar(specialCharacterRegex.test(value));
        setFulfilledNumber(numberRegex.test(value));

        setNewPassword(value);
    }

    const handleRepeatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepeatPassword(e.currentTarget.value);
    }

    const allValid = 
        fulfilledCharacterCount &&
        fulfilledSmall &&
        fulfilledUpper &&
        fulfilledNumber &&
        fulfilledSpecialChar;

    useEffect(() => {
        if(allValid) {
            setExpanded(true);
        } else {
            setExpanded(false);
            inputRef.current?.clear();
            setPasswordError(null);
        }
    }, [fulfilledCharacterCount, fulfilledNumber, fulfilledSmall, fulfilledSpecialChar, fulfilledUpper, allValid])

    useImperativeHandle(ref, () => ({
        validate: () => {
            if(!allValid) {
                return false;
            }
            if(newPassword != repeatPassword) {
                setPasswordError(t('reset.passwordNoMatchError', { ns: "auth" }));
                return false
            }

            return newPassword;
        }
    }));

    useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [contentRef.current, passwordError]);

  const style = useSpring({
    height: expanded ? contentHeight : 0,
    opacity: expanded ? 1 : 0,
    // Overflow Y?
    config: SpringConfig,
  });

    return (
        <>
            <div className="input__wrap">
                <InputString type="password" autoComplete="new-password" label={t('newPassword.password')} isMandatory={true} onChange={(e) => handleChange(e)}>
                <div className="input-requirements__wrap">
                    <p>{t('newPassword.instructions')}</p>
                    <div className="input-requirements__content">

                        { /* TO DO: Wrap these into single component*/ }
                        <div className={`input-requirements__item ${fulfilledCharacterCount? "active" : ""}`}>
                            <em className="input-requirements__requirement">8-20</em>
                            <small>{t('newPassword.characters')}</small>
                        </div>
                        <div className={`input-requirements__item ${fulfilledSmall? "active" : ""}`}>
                            <em className="input-requirements__requirement">a</em>
                            <small>{t('newPassword.lowercase')}</small>
                        </div>
                        <div className={`input-requirements__item ${fulfilledUpper? "active" : ""}`}>
                            <em className="input-requirements__requirement">A</em>
                            <small>{t('newPassword.uppercase')}</small>
                        </div>
                        <div className={`input-requirements__item ${fulfilledSpecialChar? "active" : ""}`}>
                            <em className="input-requirements__requirement">#</em>
                            <small>{t('newPassword.specialCharacter')}</small>
                        </div>
                        <div className={`input-requirements__item ${fulfilledNumber? "active" : ""}`}>
                            <em className="input-requirements__requirement">123</em>
                            <small>{t('newPassword.numbers')}</small>
                        </div>
                    </div>
                </div>
                </InputString>
            </div>
            <animated.div className="input__wrap" ref={contentRef} style={style}>
                <InputString disabled={!expanded} ref={inputRef} onChange={(e) => handleRepeatChange(e)} label={t('newPassword.repeatPassword')} error={passwordError !== null ? passwordError : ""} autoComplete="new-password" isMandatory={true} type="password"></InputString>
            </animated.div>
        </>
    );
})

export default NewPassword;