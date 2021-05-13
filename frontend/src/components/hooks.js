import { useLocation } from "react-router"

export const useSearchQuery = ()=> {
    return new URLSearchParams(useLocation().search)
}