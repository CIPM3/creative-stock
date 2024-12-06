
interface Props {
    className:string
}

const Close = ({className}:Props) => {
    return (
        <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.71484 10.2231L10.2228 1.71509M10.2228 10.2231L1.71484 1.71509" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    )
}

export default Close
