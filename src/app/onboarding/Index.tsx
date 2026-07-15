import { useContext, useEffect, useState } from "react"
import OnboardingLanguage from "./IntroLanguage"
import OnboardingTheme from "./Theme"
import OnboardingVideo from "./Video"
import ThemeContext from "../../contexts/ThemeContext"
import OnboardingAccount from "./Account/Account"
import OnboardingPassword from "./Account/Password"
import OnboardingSelect2FA from "./Account/Select2FA"
import OnboardingCompany from "./Company/Company"
import Onboarding2FA from "./Account/2FA"
import OnboardingSpecialty from "./Company/Specialty"
import OnboardingAddUsers from "./Users/AddUsers"
import OnboardingAssignAdmins from "./Users/AssignAdministrators"
import OnboardingRegion from "./IntroRegion"

export type Permission = {
    module: string;
} & {
    [key: string]: boolean | string;
};

export type OnboardingDataType = {
    token: string;
    step: number;
    isFirstOnboarding: boolean;
    account: {
        name: string;
        email: string;
        region: string;
        language: string;
        password: string;
        picture: string | null;
    };
    company: {
        name: string;
        logo: string | null;
        specialty: string;
    };
    modules: string[];
    invitedUsers: {
        email: string;
        admin: boolean;
    }[];
    team: {
        skipped: boolean;
        name: string;
        colour: string;
        permissions: Permission[];
        members: {
            email: string;
            leader: boolean;
        }[];
    };
};


type OnboardingStep =
    | 'video'
    | 'language'
    | 'region'
    | 'theme'
    | 'account'
    | 'password'
    | 'select2FA'
    | 'setup2FA'
    | 'company'
    | 'specialty'
    | 'addUsers'
    | 'assignAdmins';


const OnboardingStage: React.FC = () => {
    const [step, setStep] = useState<OnboardingStep>('language');
    const { setTheme } = useContext(ThemeContext)

    const [OnboardingData, setOnboardingData] = useState<OnboardingDataType>({
        token: "",
        step: 1,
        isFirstOnboarding: true,
        account: {
            name: "",
            email: "",
            region: "",
            language: "",
            password: "",
            picture: null,
        },
        company: {
            name: "",
            logo: "",
            specialty: ""
        },
        modules: [],
        invitedUsers: [],
        team: {
            skipped: false,
            name: "",
            colour: "",
            permissions: [],
            members: []
        }
    });

    useEffect(() => {
        setTheme("auto");
    }, [setTheme])

    const renderCurrentStep = () => {
        switch (step) {
            case 'video':
                return <OnboardingVideo onNext={() => setStep('language')} />;

            case 'language':
                return <OnboardingLanguage
                    data={OnboardingData}
                    onNext={(_addSteps, data) => {
                        setOnboardingData(data);
                        setStep('region');
                    }}
                />;
            
            case 'region':
                return <OnboardingRegion
                    data={OnboardingData}
                    onNext={(_addSteps, data) => {
                        setOnboardingData(data);
                        setStep('theme');
                    }}
                />;

            case 'theme':
                return <OnboardingTheme onNext={() => setStep('account')} />;

            case 'account':
                return <OnboardingAccount
                    data={OnboardingData}
                    onNext={(_addSteps, data) => {
                        setOnboardingData(data);
                        setStep('password');
                    }}
                />;

            case 'password':
                return <OnboardingPassword
                    data={OnboardingData}
                    onNext={(addSteps, data) => {
                        setOnboardingData(data);
                        addSteps == 2 ? setStep('company') : setStep('select2FA');
                    }}
                />;

            case 'select2FA':
                return <OnboardingSelect2FA onNext={() => setStep('setup2FA')} />;

            case 'setup2FA':
                return <Onboarding2FA onNext={() => setStep('company')} />;

            case 'company':
                return <OnboardingCompany
                    data={OnboardingData}
                    onNext={(_addSteps, data) => {
                        setOnboardingData(data);
                        setStep('specialty');
                    }}
                />;

            case 'specialty':
                return <OnboardingSpecialty onNext={() => setStep('addUsers')} />;

            case 'addUsers':
                return <OnboardingAddUsers
                    data={OnboardingData}
                    onNext={(_addSteps, data) => {
                        setOnboardingData(data);
                        setStep('assignAdmins');
                    }}
                />;

            case 'assignAdmins':
                return <OnboardingAssignAdmins
                    data={OnboardingData}
                    onNext={(_addSteps, data) => {
                        setOnboardingData(data);
                    }}
                />;

            default:
                return <OnboardingVideo onNext={() => setStep('language')} />;
        }
    }
    
    return (
        renderCurrentStep()
    )
}

export default OnboardingStage;