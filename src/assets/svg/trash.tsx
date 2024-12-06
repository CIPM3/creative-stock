
interface Props{
    className:string
}

const Trash = ({className}:Props) => {
    return (
        <svg className={className} width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.891 3.21094H0.915039M10.815 4.82494L10.515 9.27994C10.401 10.9929 10.344 11.8499 9.78504 12.3729C9.22604 12.8959 8.36704 12.8959 6.65004 12.8959H6.15004C4.43304 12.8959 3.57304 12.8959 3.01504 12.3729C2.45704 11.8499 2.39904 10.9939 2.28504 9.27994L1.98504 4.82494" stroke-linecap="round" />
            <path d="M2.85205 3.21096H2.92305C3.18278 3.20428 3.43444 3.11938 3.64515 2.96738C3.85585 2.81537 4.01579 2.60332 4.10405 2.35896L4.12605 2.29296L4.18905 2.10496C4.22006 1.99925 4.25883 1.89597 4.30505 1.79596C4.37482 1.6619 4.47502 1.54603 4.59762 1.45764C4.72021 1.36925 4.86181 1.3108 5.01105 1.28696C5.12057 1.27437 5.23088 1.27002 5.34105 1.27396H7.46505C7.57486 1.26974 7.68484 1.27375 7.79405 1.28596C7.9433 1.3098 8.08489 1.36825 8.20748 1.45664C8.33008 1.54503 8.43028 1.6609 8.50005 1.79496C8.54627 1.89497 8.58504 1.99825 8.61605 2.10396L8.67905 2.29196C8.76076 2.56394 8.92987 2.80139 9.16019 2.96753C9.39051 3.13367 9.66918 3.21923 9.95305 3.21096" />
        </svg>

    )
}

export default Trash