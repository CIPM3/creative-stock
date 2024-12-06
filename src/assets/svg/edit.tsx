
interface Props{
    className:string
}

const Edit = ({className}:Props) => {
    return (
        <svg className={className} width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.915039 13.122H11.327M1.99904 8.03799C1.72167 8.31624 1.56596 8.69312 1.56604 9.086V11.17H3.66604C3.86093 11.1702 4.05393 11.1318 4.23395 11.0572C4.41398 10.9825 4.57747 10.873 4.71504 10.735L10.897 4.54999C11.035 4.41217 11.1445 4.24849 11.2192 4.06832C11.2939 3.88816 11.3323 3.69503 11.3323 3.5C11.3323 3.30496 11.2939 3.11183 11.2192 2.93167C11.1445 2.7515 11.035 2.58782 10.897 2.45L10.287 1.838C10.1493 1.69976 9.98571 1.59007 9.80553 1.51523C9.62534 1.44038 9.43215 1.40186 9.23704 1.40186C9.04193 1.40186 8.84874 1.44038 8.66855 1.51523C8.48836 1.59007 8.32473 1.69976 8.18704 1.838L1.99904 8.03799Z" stroke="#3C3C3C" stroke-width="0.99" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    )
}

export default Edit