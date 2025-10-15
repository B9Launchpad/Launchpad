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
import { id } from "../../components/common/Input/Checkbox"

type Permission = {
  module: string;
} & {
  [key: string]: boolean | string; // string for 'module', boolean for others
};

export type OnboardingDataType = {
  token: string;
  step: number;
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
    // `permissions` is an array of objects with at least a `module` name,
    // and any number of other boolean flags.
    permissions: Permission[];
    members: {
      email: string;
      leader: boolean;
    }[];
  };
};


const OnboardingStage: React.FC = () => {
    const [step, setStep] = useState<number>(/*"video"*/ 1)
    const { setTheme } = useContext(ThemeContext)
    const [invitedUsers, setInvitedUsers] = useState<string[]>([]);

    const [OnboardingData, setOnboardingData] = useState<OnboardingDataType>({ 
        token: "",
        step: step,
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
        invitedUsers: [
        ],
        team: {
            skipped: false,
            name: "",
            colour: "",
            permissions: [
            ],
            members: [
            ]
        }
    });

    useEffect(() => {
        setTheme("light");
    }, [setTheme])

    const handlePageChange = (step: number, chips?: string[] | undefined) => {
        if(step !== 10 || !chips) {
            setStep(step);
        } else {
            setInvitedUsers(chips);
            setStep(10)
        }
    }

    const handleTransition = (addSteps: number, data: OnboardingDataType) => {
        setOnboardingData(data);
        console.log(OnboardingData)
        setStep(step + addSteps)
    }

    // OPTIMISE THIS MESS!!!

    return (
        <>
            {step === 0 && <OnboardingVideo onNext={() => setStep(1)}></OnboardingVideo>}
            {step === 1 && <OnboardingLanguage data={OnboardingData} onNext={(addSteps, data) => handleTransition(addSteps, data)}></OnboardingLanguage>}
            {step === 2 && <OnboardingTheme onNext={() => setStep(step+1)}></OnboardingTheme>}
            {step === 3 && <OnboardingAccount data={OnboardingData} onNext={(addSteps, data) => handleTransition(addSteps, data)}></OnboardingAccount>}
            {step === 4 && <OnboardingPassword data={OnboardingData} onNext={(addSteps, data) => handleTransition(addSteps, data)}></OnboardingPassword>}
            {step === 5 && <OnboardingSelect2FA onNext={() => setStep(step+1)}></OnboardingSelect2FA>}
            {step === 6 && <Onboarding2FA onNext={() => setStep(step+1)}></Onboarding2FA>}
            {step === 7 && <OnboardingCompany data={OnboardingData} onNext={(addSteps, data) => handleTransition(addSteps, data)}/>}
            {step === 8 && <OnboardingSpecialty onNext={() => setStep(step+1)}/>}
            {step === 9 && <OnboardingAddUsers data={OnboardingData} onNext={(addSteps, data) => handleTransition(addSteps, data)}/>}
            {step === 10 && <OnboardingAssignAdmins data={OnboardingData} onNext={(addSteps, data) => handleTransition(addSteps, data)}/>}
        </>
    )
}

export default OnboardingStage;