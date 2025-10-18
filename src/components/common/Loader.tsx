import Image from "next/image";
import { useEffect, useState } from "react";


const SuspenseLoader: React.FC = () => {
    const [hasExceededTimeout, setHasExceededTimeout] = useState<boolean>(false)

    useEffect(() => {
        setTimeout(() => {
            setHasExceededTimeout(true);
        }, 5000)
    }, [])

    return (
        <div className="loader__screen">
            <div className="loader__content">
                <h1 className={`loader__text ${hasExceededTimeout ? 'visible' : ''}`}>We are processing your request...</h1>
                <Image alt={"Loader animation"} width={200} height={150} src={"/static/loader.gif"}></Image>
                <em className={`loader__text ${hasExceededTimeout ? 'visible' : ''}`}>This may take a few seconds</em>
            </div>
        </div>
    )
}

export default SuspenseLoader;