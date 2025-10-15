import IntroLayout from "../../components/layout/IntroLayout";
import { useTranslation } from "react-i18next";
import Button from "../../components/common/Button";
import PadSelect from "../../components/misc/intro/PadSelect";
import { useContext } from "react";
import ThemeContext from "../../contexts/ThemeContext";
import type { Theme } from "../../contexts/ThemeContext";

interface OnboardingProps {
    onNext: () => void;
}

const OnboardingTheme: React.FC<OnboardingProps> = ({ onNext }) => {
    const { t } = useTranslation('intro')
    const { theme, setTheme } = useContext(ThemeContext)

    const themes: Theme[] = ["light", "dark", "auto"];

    const options = themes.map((id) => ({
        id,
        label: t(`styleOption.${id}`),
        selected: theme === id,
        icon: <img alt="" src={`/static/themes/${id}.png`} />,
    }));

    const handleChange = (id: string | string[] | null) => {
        if (id === 'dark') {
            setTheme("dark");
        } else if (id == "light") {
            setTheme("light")
        } else {
            setTheme("auto")
        }
    }

    return (
        <IntroLayout>
            <div className="intro__content">
                <h1>{t('style')}</h1>
                <PadSelect onChange={(id) => handleChange(id)} options={options} imageMode={true} alwaysSelected={true}></PadSelect>
                <Button onClick={onNext}>{t("continue", {ns: "general"})}</Button>
            </div>
            <p>Some shits here</p>
        </IntroLayout>
    )
}

export default OnboardingTheme;