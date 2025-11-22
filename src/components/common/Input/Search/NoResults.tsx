import IconSearch from "@/components/icons/Search"
import { useTranslation } from "react-i18next"

const SearchNoResults = () => {
    const { t } = useTranslation('main')

    return (
        <div className="sidebar__no-results">
            <IconSearch className="sidebar__no-results--icon" />
            <small>{t('layout.search.noResults')}</small>
        </div>
    )
}

export default SearchNoResults