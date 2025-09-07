interface IntroLayoutProps {
    children: React.ReactNode;
    width?: 'thin' | 'regular' | 'wide';
}


const IntroLayout: React.FC<IntroLayoutProps> = ({children, width = 'regular'}) => {

    return (
        <main className="intro-layout__wrap">
            <div className={`intro-layout__content ${width}`}>
                { children }
            </div>
        </main>
    )
}


export default IntroLayout;