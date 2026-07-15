"use client"
import Button from "@/components/common/Button"
import InputSearch from "@/components/common/Input/Search/SearchInput"


const MessengerMessageList = () => {
    return (
        <>
            <div className="flex-col gap">
                <InputSearch placeholder="Name, email, message contents..."/>
                <div className="flex-row gap">
                    <Button label="Overview" inline/>
                </div>
            </div>
        </>
    )
}

export default MessengerMessageList;